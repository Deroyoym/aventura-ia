import { VOTOS, escenaDef } from "@/lib/game/campana";
import type { EstadoJuego, Plan, Resultado, SalidaDM } from "@/lib/game/tipos";
import { SALIDA_VACIA } from "./esquema";

// Narración escrita por código. Se usa cuando el modelo no devuelve nada
// utilizable (para no trabar la partida) y como base del narrador simulado.

const POR_RESULTADO: Record<Resultado | "ninguno", (nombre: string) => string> = {
  critico: (n) =>
    `${n} lo consigue con una soltura que sorprende a todos, empezando por ${n}. Por un momento la noche parece de su lado.`,
  exito: (n) => `${n} lo consigue. No fue elegante, pero alcanzó.`,
  costo: (n) =>
    `${n} lo consigue, aunque no sale gratis: algo cruje, algo se pierde, alguien se da cuenta.`,
  fallo: (n) =>
    `No sale. ${n} se queda con las manos vacías y la sensación de que el pueblo entero contuvo el aliento.`,
  pifia: (n) =>
    `Sale mal, y de la peor manera: con ruido. En algún lugar de la bruma, algo gira la cabeza hacia ${n}.`,
  ninguno: (n) => `${n} lo intenta. La noche sigue su curso, indiferente.`,
};

export function salidaDeRespaldo(e: EstadoJuego, plan: Plan): SalidaDM {
  const p = e.pendiente;
  const def = escenaDef(e.escena.indice);
  const parrafos: string[] = [];
  let escenaDeOpciones: number | null = e.escena.indice;

  if (plan.tipo === "apertura") {
    escenaDeOpciones = plan.abre ?? e.escena.indice;
    parrafos.push(escenaDef(escenaDeOpciones).aperturaBase);
  } else if (plan.tipo === "tras_voto" && p?.tipo === "voto") {
    const opcion = VOTOS[p.votoId].opciones.find((o) => o.id === p.opcionId);
    if (opcion) parrafos.push(opcion.aviso);
    if (plan.abre !== null) {
      parrafos.push(escenaDef(plan.abre).aperturaBase);
      escenaDeOpciones = plan.abre;
    }
  } else if (p?.tipo === "accion") {
    const nombre = e.personajes[p.asiento]?.nombre ?? "Alguien";
    parrafos.push(POR_RESULTADO[plan.resultado ?? "ninguno"](nombre));
    if (plan.cierra) {
      if (plan.siguiente === "voto" && def.votoAlCerrar) {
        parrafos.push(VOTOS[def.votoAlCerrar].contexto);
        escenaDeOpciones = null;
      } else if (plan.abre !== null) {
        parrafos.push(escenaDef(plan.abre).aperturaBase);
        escenaDeOpciones = plan.abre;
      }
    } else {
      parrafos.push("La escena sigue abierta. ¿Qué hacen?");
    }
  }

  return {
    ...SALIDA_VACIA,
    cambios: { ...SALIDA_VACIA.cambios },
    narracion: parrafos.join("\n\n"),
    opciones: escenaDeOpciones === null ? [] : escenaDef(escenaDeOpciones).opcionesBase,
  };
}
