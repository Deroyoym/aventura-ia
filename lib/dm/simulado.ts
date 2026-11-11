import { PISTAS, escenaDef } from "@/lib/game/campana";
import type { SalidaDM } from "@/lib/game/tipos";
import type { Narrador } from "./narrador";
import { salidaDeRespaldo } from "./respaldo";

// Narrador sin modelo: arma una respuesta verosímil a partir del contenido
// escrito a mano y la emite en trozos, con el mismo formato JSON que Gemini.
// Permite jugar y correr los tests de punta a punta sin clave ni cuota.

const demora = () => Number(process.env.SIMULADO_DEMORA_MS ?? 12);
const dormir = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** SIMULAR_429=n hace fallar con 429 los primeros n pedidos, para probar los reintentos. */
const contador = globalThis as unknown as { __fallos429?: number };

function quizaFallar(): void {
  const total = Number(process.env.SIMULAR_429 ?? 0);
  contador.__fallos429 ??= 0;
  if (contador.__fallos429 >= total) return;
  contador.__fallos429 += 1;
  throw Object.assign(
    new Error('{"error":{"code":429,"status":"RESOURCE_EXHAUSTED","details":[{"retryDelay":"1s"}]}}'),
    { status: 429 },
  );
}

/** Convierte la salida interna al formato plano que se le pide al modelo. */
function comoJsonDelModelo(s: SalidaDM): string {
  return JSON.stringify({
    narracion: s.narracion,
    opciones: s.opciones.map((o) => ({
      texto: o.texto,
      enfoque: o.enfoque,
      atributo: o.tirada?.atributo ?? "ninguno",
      dificultad: o.tirada?.dificultad ?? "media",
      avanza: o.avanza,
    })),
    cambios: s.cambios,
    susurros: s.susurros,
    resumenEscena: s.resumenEscena,
  });
}

export const narradorSimulado: Narrador = {
  nombre: "simulado",

  async *narrar({ estado, plan }) {
    quizaFallar();
    const salida = salidaDeRespaldo(estado, plan);
    const p = estado.pendiente;

    if (plan.tipo === "accion" && p?.tipo === "accion") {
      const def = escenaDef(estado.escena.indice);
      if (plan.resultado === "exito" || plan.resultado === "critico" || plan.resultado === null) {
        const pista = PISTAS.find((x) => x.escena === estado.escena.indice && !estado.pistas.includes(x.id));
        if (pista) {
          salida.cambios.pistas = [pista.id];
          salida.narracion += `\n\n${pista.texto}`;
        }
        if (p.enfoque === "dialogo" && def.npcs[0]) {
          salida.cambios.relaciones = [{ npc: def.npcs[0], delta: 1 }];
        }
      }
      if (plan.resultado === "costo") salida.cambios.vida = [{ jugador: p.asiento, delta: -1 }];
      if (plan.resultado === "fallo") salida.cambios.amenaza = 1;
      if (plan.resultado === "pifia") salida.cambios.vida = [{ jugador: p.asiento, delta: -2 }];
    }
    if (plan.abre === 1) {
      salida.susurros = [{ jugador: 1, texto: "Por un instante escuchás tu nombre, dicho muy bajo, del otro lado de la pared." }];
    }

    for (const trozo of comoJsonDelModelo(salida).match(/[\s\S]{1,14}/g) ?? []) {
      await dormir(demora());
      yield trozo;
    }
  },

  async arbitrar({ texto }) {
    await dormir(demora() * 10);
    const t = texto.toLowerCase();
    const dialogo = /habl|pregunt|convenc|dec[ií]|ped[ií]|cant|consol|ment|negoci/.test(t);
    const combate = /golpe|empuj|romp|forz|atac|corr|trep|salt|pele|carg/.test(t);
    return JSON.stringify(
      dialogo
        ? { enfoque: "dialogo", atributo: "carisma", dificultad: "media", avanza: true }
        : combate
          ? { enfoque: "combate", atributo: "fuerza", dificultad: "media", avanza: true }
          : { enfoque: "ingenio", atributo: "ingenio", dificultad: "media", avanza: true },
    );
  },
};
