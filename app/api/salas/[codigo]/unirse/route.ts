import type { Asiento } from "@/lib/game/tipos";
import { cuerpo, json, manejar, type Contexto } from "@/lib/server/http";
import { unirse } from "@/lib/server/sala";

export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const { reclamar } = await cuerpo<{ reclamar?: number }>(req);
    const asiento = reclamar === 1 || reclamar === 2 ? (reclamar as Asiento) : undefined;
    return json(await unirse(codigo, asiento), 201);
  });
}
