import { after } from "next/server";
import { cambiarAvatar, cambiarTerror, pasarFarol, usarObjeto, votar } from "@/lib/game/motor";
import { ErrorJuego, NIVELES_TERROR } from "@/lib/game/tipos";
import type { PeticionAccion, RespuestaAccion } from "@/lib/protocolo";
import { cuerpo, json, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { difundir } from "@/lib/server/realtime";
import { completarRetrato, reservarRetrato, retratosActivos } from "@/lib/server/retrato";
import { estaNarrando, mutar } from "@/lib/server/sala";

/** Alcanza para pintar un retrato después de responder. */
export const maxDuration = 60;

/** Cambios de estado que no necesitan al máster: votar, pasar el farol, ajustes. */
export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const p = await cuerpo<PeticionAccion>(req);
    let narrar = false;
    let pintar = false;

    const { sala, asiento } = await mutar(codigo, tokenDe(req), (estado, asiento) => {
      const ahora = Date.now();
      const ocupado = () => {
        if (estaNarrando(estado, ahora)) throw new ErrorJuego("ocupado", "Esperá a que el máster termine.", 409);
      };
      switch (p.tipo) {
        case "votar": {
          ocupado();
          const r = votar({ ...estado, narrando: null }, asiento, String(p.opcion), ahora);
          narrar = r.narrar;
          return r.estado;
        }
        case "pasar":
          ocupado();
          return pasarFarol(estado, asiento, ahora);
        case "terror":
          if (!NIVELES_TERROR.includes(p.nivel)) throw new ErrorJuego("terror", "Nivel desconocido.");
          return cambiarTerror(estado, p.nivel, ahora);
        case "usar":
          return usarObjeto(estado, asiento, String(p.objeto), ahora);
        case "avatar":
          return cambiarAvatar(estado, asiento, p.avatar, ahora);
        case "retrato": {
          if (!retratosActivos()) throw new ErrorJuego("retratos", "Los retratos pintados no están activados.", 409);
          const reserva = reservarRetrato(estado, asiento, true);
          pintar = reserva.pintar;
          return reserva.estado;
        }
        default:
          throw new ErrorJuego("accion", "Acción desconocida.");
      }
    });

    await difundir(sala.id, { t: "estado", version: sala.version });
    if (pintar) after(() => completarRetrato(sala.codigo, asiento));
    return json({ ok: true, narrar } satisfies RespuestaAccion);
  });
}
