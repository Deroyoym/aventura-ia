import { SALIDA_VACIA } from "@/lib/dm/esquema";
import { aplicarNarracion, definirPersonaje, estadoInicial, iniciar, planificar } from "@/lib/game/motor";
import type { EstadoJuego, SalidaDM } from "@/lib/game/tipos";

export const AHORA = 1_700_000_000_000;

/** Rng que hace salir exactamente estos valores de d20, en orden. */
export function dados(...valores: number[]) {
  let i = 0;
  return () => {
    const v = valores[i++];
    if (v === undefined) throw new Error("Se pidieron más dados de los previstos");
    return (v - 0.5) / 20;
  };
}

export function salida(parcial: Partial<Omit<SalidaDM, "cambios">> & { cambios?: Partial<SalidaDM["cambios"]> } = {}): SalidaDM {
  return {
    ...SALIDA_VACIA,
    narracion: "La bruma se aprieta contra los vidrios y nadie dice nada durante un rato largo.",
    ...parcial,
    cambios: { ...SALIDA_VACIA.cambios, ...parcial.cambios },
  };
}

/** Sala con dos personajes creados, todavía sin empezar. */
export function preparada(): EstadoJuego {
  let e = estadoInicial("media", AHORA);
  e = definirPersonaje(
    e,
    1,
    { nombre: "Aldric", raza: "enano", clase: "espada", rasgo: "Valiente", secreto: "Hui de un juramento y otro pagó por mí." },
    AHORA,
  );
  e = definirPersonaje(
    e,
    2,
    { nombre: "Mirta", raza: "mediano", clase: "juglar", rasgo: "Lengua afilada", secreto: "Este nombre lo robé a una muerta." },
    AHORA,
  );
  return e;
}

/** Partida ya abierta: escena 1 narrada, farol en el jugador 1. */
export function enJuego(): EstadoJuego {
  const e = iniciar(preparada(), AHORA);
  return aplicarNarracion(e, planificar(e), salida(), AHORA);
}
