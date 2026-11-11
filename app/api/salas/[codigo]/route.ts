import { after } from "next/server";
import { json, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { autenticar, instantanea } from "@/lib/server/sala";
import { obtenerStore } from "@/lib/server/store";

/** Snapshot de la sala tal como la ve el jugador que lo pide. */
export async function GET(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const acceso = await autenticar(codigo, tokenDe(req));
    // Cada pedido cuenta como señal de vida de ese celular.
    after(() => obtenerStore().visto(acceso.sala.id, acceso.asiento));
    return json(instantanea(acceso));
  });
}
