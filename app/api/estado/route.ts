import { estadoServidor } from "@/lib/server/config";
import { json } from "@/lib/server/http";

/** Qué servicios están configurados. No expone ningún valor, solo nombres. */
export async function GET(req: Request) {
  // Leer el pedido evita que esta respuesta se prerenderice en el build.
  void req.headers;
  return json(estadoServidor());
}
