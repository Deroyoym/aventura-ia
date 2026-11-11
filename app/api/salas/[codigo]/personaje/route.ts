import { definirPersonaje } from "@/lib/game/motor";
import type { PeticionPersonaje } from "@/lib/protocolo";
import { cuerpo, json, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { difundir } from "@/lib/server/realtime";
import { mutar } from "@/lib/server/sala";

export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const datos = await cuerpo<PeticionPersonaje>(req);
    const { sala } = await mutar(codigo, tokenDe(req), (estado, asiento) =>
      definirPersonaje(estado, asiento, datos, Date.now()),
    );
    await difundir(sala.id, { t: "estado", version: sala.version });
    return json({ ok: true });
  });
}
