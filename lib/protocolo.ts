import type { DatosPersonaje } from "@/lib/game/motor";
import type { Asiento, Fase, NivelTerror, Tirada } from "@/lib/game/tipos";
import type { Vista } from "@/lib/game/vista";

// Formas de los mensajes entre el navegador y las routes. Tipos puros: este
// archivo lo importan los dos lados y no arrastra código de servidor.

export const CABECERA_TOKEN = "x-asiento-token";
/** Evento de Broadcast que usa la sala en Supabase Realtime. */
export const EVENTO_SALA = "sala";
export const canalDeSala = (salaId: string) => `sala-${salaId}`;

export const LARGO_CODIGO = 5;
export const normalizarCodigo = (texto: string): string =>
  texto
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, LARGO_CODIGO);

export interface ModoServidor {
  narrador: "gemini" | "simulado";
  almacen: "supabase" | "memoria";
}

export interface EstadoServidor extends ModoServidor {
  listo: boolean;
  /** Variables de entorno que faltan para funcionar en producción. */
  faltan: string[];
  /** Nombres de los modelos configurados, para comprobar el deploy. No son secretos. */
  modelo: string | null;
  modeloRespaldo: string | null;
}

export interface Instantanea {
  codigo: string;
  salaId: string;
  version: number;
  vista: Vista;
  asientos: Record<Asiento, { ocupado: boolean; activo: boolean }>;
  modo: ModoServidor;
}

export interface InfoPublica {
  codigo: string;
  fase: Fase;
  asientos: { asiento: Asiento; ocupado: boolean; activo: boolean; personaje: string | null }[];
}

export interface Credencial {
  codigo: string;
  asiento: Asiento;
  token: string;
}

export interface ErrorApi {
  codigo: string;
  mensaje: string;
  publica?: InfoPublica;
}

export type PeticionTurno =
  | { tipo: "inicio" }
  | { tipo: "opcion"; id: string }
  | { tipo: "libre"; texto: string }
  | { tipo: "tirar"; rasgo?: boolean; companero?: boolean; objeto?: string }
  /** Narra lo que quedó pendiente: tras un voto o tras un error. */
  | { tipo: "continuar" };

export type PeticionAccion =
  | { tipo: "votar"; opcion: string }
  | { tipo: "pasar" }
  | { tipo: "terror"; nivel: NivelTerror }
  | { tipo: "usar"; objeto: string };

export interface RespuestaAccion {
  ok: true;
  /** Un voto quedó resuelto y hay que pedir su narración. */
  narrar: boolean;
}

export type PeticionPersonaje = DatosPersonaje;

/** Lo que emite la route de turno, una línea JSON por evento. */
export type EventoTurno =
  /** El árbitro está clasificando una acción libre. */
  | { t: "pensando" }
  /** La acción quedó a la espera de una tirada; el stream termina. */
  | { t: "pendiente" }
  | { t: "tirada"; entrada: number; tirada: Tirada }
  | { t: "espera"; segundos: number; intento: number }
  /** Trozo de narración. `desde` permite aplicar el mismo delta dos veces sin duplicar. */
  | { t: "delta"; desde: number; texto: string }
  | { t: "reinicio" }
  | { t: "fin"; version: number }
  | { t: "error"; codigo: string; mensaje: string };

/** Lo que viaja por Broadcast a los dos celulares. */
export type EventoSala =
  | { t: "delta"; desde: number; texto: string }
  | { t: "reinicio" }
  | { t: "espera"; segundos: number; intento: number }
  | { t: "estado"; version: number }
  | { t: "sugerencia"; asiento: Asiento; opcion: string | null };
