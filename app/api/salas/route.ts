import { NIVELES_TERROR, type NivelTerror } from "@/lib/game/tipos";
import { cuerpo, json, manejar } from "@/lib/server/http";
import { crearSala } from "@/lib/server/sala";

export async function POST(req: Request) {
  return manejar(async () => {
    const { terror, campana } = await cuerpo<{ terror?: string; campana?: string }>(req);
    const nivel = NIVELES_TERROR.includes(terror as NivelTerror) ? (terror as NivelTerror) : "media";
    return json(await crearSala(nivel, campana === "coche" ? "coche" : "trece"), 201);
  });
}
