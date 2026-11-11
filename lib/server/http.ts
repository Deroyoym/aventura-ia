import { ErrorJuego } from "@/lib/game/tipos";
import { CABECERA_TOKEN, type ErrorApi, type InfoPublica } from "@/lib/protocolo";
import { estadoServidor } from "./config";

// Utilidades comunes a todas las routes.

export type Contexto = { params: Promise<{ codigo: string }> };

export const tokenDe = (req: Request): string | null => req.headers.get(CABECERA_TOKEN);

export async function cuerpo<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ErrorJuego("json", "Pedido inválido.");
  }
}

const SIN_CACHE = { "Cache-Control": "no-store" };

export const json = (datos: unknown, status = 200): Response =>
  Response.json(datos, { status, headers: SIN_CACHE });

function respuestaError(e: unknown): Response {
  if (e instanceof ErrorJuego) {
    const publica = (e as ErrorJuego & { publica?: InfoPublica }).publica;
    return json({ codigo: e.codigo, mensaje: e.message, publica } satisfies ErrorApi, e.estado);
  }
  console.error(e);
  return json({ codigo: "interno", mensaje: "Algo se rompió del lado del servidor." } satisfies ErrorApi, 500);
}

/** Envuelve una route: avisa si falta configuración y traduce los errores a JSON. */
export async function manejar(fn: () => Promise<Response>): Promise<Response> {
  const { listo, faltan } = estadoServidor();
  if (!listo) {
    return json(
      { codigo: "config", mensaje: `Falta configurar en el servidor: ${faltan.join(", ")}.` } satisfies ErrorApi,
      503,
    );
  }
  try {
    return await fn();
  } catch (e) {
    return respuestaError(e);
  }
}
