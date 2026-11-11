import type { Asiento, EstadoJuego, Plan } from "@/lib/game/tipos";

// Lo que la partida necesita de un máster. Hay dos implementaciones: Gemini y
// un narrador simulado para desarrollo y tests sin clave.

export interface PedidoNarracion {
  sistema: string;
  mensaje: string;
  estado: EstadoJuego;
  plan: Plan;
  signal?: AbortSignal;
}

export interface PedidoArbitro {
  sistema: string;
  mensaje: string;
  estado: EstadoJuego;
  asiento: Asiento;
  texto: string;
  signal?: AbortSignal;
}

export interface Narrador {
  nombre: "gemini" | "simulado";
  /** Emite el JSON de la narración en trozos, a medida que se genera. */
  narrar(pedido: PedidoNarracion): AsyncIterable<string>;
  /** Devuelve el JSON que clasifica una acción libre. */
  arbitrar(pedido: PedidoArbitro): Promise<string>;
}
