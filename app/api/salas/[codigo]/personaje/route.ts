import { after } from "next/server";
import { definirPersonaje } from "@/lib/game/motor";
import type { PeticionPersonaje } from "@/lib/protocolo";
import { cuerpo, json, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { difundir } from "@/lib/server/realtime";
import { completarRetrato, reservarRetrato } from "@/lib/server/retrato";
import { mutar } from "@/lib/server/sala";

/** Alcanza para pintar el retrato después de responder. */
export const maxDuration = 60;

export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const datos = await cuerpo<PeticionPersonaje>(req);
    let pintar = false;
    const { sala, asiento } = await mutar(codigo, tokenDe(req), (estado, quien) => {
      const reserva = reservarRetrato(definirPersonaje(estado, quien, datos, Date.now()), quien, false);
      pintar = reserva.pintar;
      return reserva.estado;
    });
    await difundir(sala.id, { t: "estado", version: sala.version });
    if (pintar) after(() => completarRetrato(sala.codigo, asiento));
    return json({ ok: true });
  });
}
