// Manejo de errores de la API de Gemini: clasifica el fallo y reintenta los
// transitorios (429 por minuto, 5xx, red) con backoff exponencial y jitter.

export type CodigoFallo =
  | "limite"
  | "cuota"
  | "sin_cuota"
  | "servidor"
  | "red"
  | "lento"
  | "config"
  | "cancelado"
  | "otro";

export interface Fallo {
  codigo: CodigoFallo;
  reintentable: boolean;
  /** Espera sugerida por la API (RetryInfo.retryDelay), si vino. */
  esperaMs: number | null;
  mensaje: string;
  /** Causa técnica resumida, para el log del servidor. Nunca incluye la clave. */
  detalle: string;
}

export class ErrorNarrador extends Error {
  constructor(public fallo: Fallo) {
    super(fallo.mensaje);
    this.name = "ErrorNarrador";
  }
}

const MENSAJES: Record<CodigoFallo, string> = {
  limite: "El máster está saturado de pedidos. Probá de nuevo en un momento.",
  cuota: "Se agotó la cuota diaria de la API de Gemini para este modelo. Vuelvan mañana o cambien GEMINI_MODEL.",
  sin_cuota: "La clave de Gemini se quedó sin crédito o sin cuota para este modelo. Recargá el saldo en AI Studio, o cambiá GEMINI_MODEL.",
  lento: "El máster tardó demasiado en responder. Probá de nuevo.",
  servidor: "El servicio de Gemini está con problemas. Probá de nuevo en un momento.",
  red: "No se pudo conectar con Gemini. Probá de nuevo.",
  config: "La configuración de Gemini no es válida: revisá GEMINI_API_KEY y GEMINI_MODEL.",
  cancelado: "El pedido se canceló.",
  otro: "El máster perdió el hilo. Probá de nuevo.",
};

function estadoHttp(e: unknown): number | null {
  if (e && typeof e === "object") {
    const s = (e as { status?: unknown }).status;
    if (typeof s === "number") return s;
  }
  return null;
}

const texto = (e: unknown): string => (e instanceof Error ? e.message : String(e ?? ""));

/** Lee `"retryDelay": "17s"` (o `17.5s`) del cuerpo del error. */
export function esperaSugerida(mensaje: string): number | null {
  const m = /retryDelay"?\s*[:=]\s*"?(\d+(?:\.\d+)?)s/i.exec(mensaje);
  return m ? Math.ceil(Number(m[1]) * 1000) : null;
}

/** Resume el cuerpo del error: cuota afectada y tope si vienen, o el principio del mensaje. */
function resumir(status: number | null, msg: string): string {
  const cuotas = [...msg.matchAll(/"quotaId"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const tope = /limit:\s*(\d+)/i.exec(msg)?.[1];
  const partes = [status === null ? "sin estado HTTP" : `HTTP ${status}`];
  if (cuotas.length) partes.push(cuotas.join(", "));
  if (tope !== undefined) partes.push(`tope ${tope}`);
  if (!cuotas.length) partes.push(msg.replace(/\s+/g, " ").slice(0, 300));
  return partes.join(" · ");
}

export function falloDe(codigo: CodigoFallo, detalle = ""): Fallo {
  return { codigo, reintentable: false, esperaMs: null, mensaje: MENSAJES[codigo], detalle };
}

export function clasificarError(e: unknown): Fallo {
  if (e instanceof ErrorNarrador) return e.fallo;
  const msg = texto(e);
  const status = estadoHttp(e);
  const detalle = resumir(status, msg);
  const fallo = (codigo: CodigoFallo, reintentable: boolean, esperaMs: number | null = null): Fallo => ({
    codigo,
    reintentable,
    esperaMs,
    mensaje: MENSAJES[codigo],
    detalle,
  });

  if (e instanceof Error && e.name === "AbortError") return fallo("cancelado", false);
  // Saldo prepago agotado: no tiene sentido reintentar ni seguir con texto de relleno.
  if (status === 402) return fallo("sin_cuota", false);
  if (status === 429) {
    // Un tope de cero no se recupera nunca; la cuota diaria, no en unos segundos.
    if (/limit:\s*0\b/i.test(msg)) return fallo("sin_cuota", false);
    if (/per\s?day|perday|daily/i.test(msg)) return fallo("cuota", false);
    return fallo("limite", true, esperaSugerida(msg));
  }
  if (status !== null && status >= 500) return fallo("servidor", true);
  if (status === 401 || status === 403 || status === 404) return fallo("config", false);
  if (status === 400) return fallo(/api[ _]?key/i.test(msg) ? "config" : "otro", false);
  if (status === 408) return fallo("red", true);
  if (/fetch failed|network|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|terminated/i.test(msg)) {
    return fallo("red", true);
  }
  return fallo("otro", false);
}

export interface OpcionesReintento {
  /** Intentos totales, contando el primero. */
  intentos?: number;
  baseMs?: number;
  /** Si hay que esperar más que esto, se abandona. */
  maxEsperaMs?: number;
  /** Tiempo total, entre intentos y esperas, que no se puede superar. */
  presupuestoMs?: number;
  /** Se llama con cada fallo, se reintente o no. */
  alFallar?: (fallo: Fallo, intento: number) => void;
  alEsperar?: (ms: number, intento: number) => void;
  dormir?: (ms: number) => Promise<void>;
  azar?: () => number;
  reloj?: () => number;
}

const dormirReal = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function conReintentos<T>(
  operacion: (intento: number) => Promise<T>,
  opciones: OpcionesReintento = {},
): Promise<T> {
  const {
    intentos = 4,
    baseMs = 1500,
    maxEsperaMs = 45_000,
    presupuestoMs = 75_000,
    alFallar,
    alEsperar,
    dormir = dormirReal,
    azar = Math.random,
    reloj = Date.now,
  } = opciones;
  const inicio = reloj();

  for (let intento = 1; ; intento++) {
    try {
      return await operacion(intento);
    } catch (e) {
      const fallo = clasificarError(e);
      alFallar?.(fallo, intento);
      if (!fallo.reintentable || intento >= intentos) throw new ErrorNarrador(fallo);
      const exponencial = baseMs * 2 ** (intento - 1);
      const espera = Math.round(Math.max(fallo.esperaMs ?? 0, exponencial) * (1 + azar() * 0.25));
      if (espera > maxEsperaMs || reloj() - inicio + espera > presupuestoMs) throw new ErrorNarrador({ ...fallo, reintentable: false });
      alEsperar?.(espera, intento);
      await dormir(espera);
    }
  }
}
