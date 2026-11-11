// Manejo de errores de la API de Gemini: clasifica el fallo y reintenta los
// transitorios (429 por minuto, 5xx, red) con backoff exponencial y jitter.

export type CodigoFallo = "limite" | "cuota" | "servidor" | "red" | "config" | "cancelado" | "otro";

export interface Fallo {
  codigo: CodigoFallo;
  reintentable: boolean;
  /** Espera sugerida por la API (RetryInfo.retryDelay), si vino. */
  esperaMs: number | null;
  mensaje: string;
}

export class ErrorNarrador extends Error {
  constructor(public fallo: Fallo) {
    super(fallo.mensaje);
    this.name = "ErrorNarrador";
  }
}

const MENSAJES: Record<CodigoFallo, string> = {
  limite: "El máster está saturado de pedidos. Probá de nuevo en un momento.",
  cuota: "Se agotó la cuota diaria de la API de Gemini. Vuelvan mañana o revisen el plan de la clave.",
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

export function clasificarError(e: unknown): Fallo {
  if (e instanceof ErrorNarrador) return e.fallo;
  const msg = texto(e);
  const status = estadoHttp(e);
  const fallo = (codigo: CodigoFallo, reintentable: boolean, esperaMs: number | null = null): Fallo => ({
    codigo,
    reintentable,
    esperaMs,
    mensaje: MENSAJES[codigo],
  });

  if (e instanceof Error && e.name === "AbortError") return fallo("cancelado", false);
  if (status === 429) {
    // La cuota diaria no se recupera esperando unos segundos.
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
  alEsperar?: (ms: number, intento: number) => void;
  dormir?: (ms: number) => Promise<void>;
  azar?: () => number;
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
    alEsperar,
    dormir = dormirReal,
    azar = Math.random,
  } = opciones;

  for (let intento = 1; ; intento++) {
    try {
      return await operacion(intento);
    } catch (e) {
      const fallo = clasificarError(e);
      if (!fallo.reintentable || intento >= intentos) throw new ErrorNarrador(fallo);
      const exponencial = baseMs * 2 ** (intento - 1);
      const espera = Math.round(Math.max(fallo.esperaMs ?? 0, exponencial) * (1 + azar() * 0.25));
      if (espera > maxEsperaMs) throw new ErrorNarrador({ ...fallo, reintentable: false });
      alEsperar?.(espera, intento);
      await dormir(espera);
    }
  }
}
