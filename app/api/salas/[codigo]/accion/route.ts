import { cambiarAvatar, cambiarTerror, pasarFarol, usarObjeto, votar } from "@/lib/game/motor";
import { ErrorJuego, NIVELES_TERROR } from "@/lib/game/tipos";
import type { PeticionAccion, RespuestaAccion } from "@/lib/protocolo";
import { cuerpo, json, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { difundir } from "@/lib/server/realtime";
import { estaNarrando, mutar } from "@/lib/server/sala";

/** Cambios de estado que no necesitan al máster: votar, pasar el farol, ajustes. */
export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const p = await cuerpo<PeticionAccion>(req);
    let narrar = false;

    const { sala } = await mutar(codigo, tokenDe(req), (estado, asiento) => {
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
        default:
          throw new ErrorJuego("accion", "Acción desconocida.");
      }
    });

    await difundir(sala.id, { t: "estado", version: sala.version });
    return json({ ok: true, narrar } satisfies RespuestaAccion);
  });
}
