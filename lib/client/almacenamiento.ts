import type { Asiento } from "@/lib/game/tipos";

// Las salas de este dispositivo: el token de cada asiento y lo mínimo para
// listar "partidas guardadas" en la portada. Todo vive en localStorage.

const CLAVE = "aventura:salas";

export interface SalaGuardada {
  codigo: string;
  asiento: Asiento;
  token: string;
  personaje: string | null;
  capitulo: string | null;
  actualizado: number;
}

function leer(): Record<string, SalaGuardada> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "{}") as Record<string, SalaGuardada>;
  } catch {
    return {};
  }
}

function escribir(salas: Record<string, SalaGuardada>): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(salas));
  } catch {
    // Modo privado o almacenamiento lleno: la sala igual funciona en esta sesión.
  }
}

export const salaGuardada = (codigo: string): SalaGuardada | null => leer()[codigo] ?? null;

export const salasGuardadas = (): SalaGuardada[] =>
  Object.values(leer()).sort((a, b) => b.actualizado - a.actualizado);

export function guardarSala(sala: Omit<SalaGuardada, "actualizado" | "personaje" | "capitulo">): void {
  const salas = leer();
  const previa = salas[sala.codigo] as SalaGuardada | undefined;
  salas[sala.codigo] = {
    personaje: previa?.personaje ?? null,
    capitulo: previa?.capitulo ?? null,
    ...sala,
    actualizado: Date.now(),
  };
  escribir(salas);
}

export function anotarSala(codigo: string, datos: Pick<SalaGuardada, "personaje" | "capitulo">): void {
  const salas = leer();
  const sala = salas[codigo];
  if (!sala || (sala.personaje === datos.personaje && sala.capitulo === datos.capitulo)) return;
  salas[codigo] = { ...sala, ...datos, actualizado: Date.now() };
  escribir(salas);
}

export function olvidarSala(codigo: string): void {
  const salas = leer();
  delete salas[codigo];
  escribir(salas);
}

// ───────── Lectura reactiva para la portada ─────────

const VACIA: SalaGuardada[] = [];
let cache: { crudo: string | null; salas: SalaGuardada[] } = { crudo: null, salas: VACIA };

/** Devuelve la misma referencia mientras localStorage no cambie (lo exige useSyncExternalStore). */
export function leerSalasGuardadas(): SalaGuardada[] {
  let crudo: string | null = null;
  try {
    crudo = localStorage.getItem(CLAVE);
  } catch {
    return VACIA;
  }
  if (crudo !== cache.crudo) cache = { crudo, salas: salasGuardadas() };
  return cache.salas;
}

export const sinSalasGuardadas = (): SalaGuardada[] => VACIA;

export function suscribirSalasGuardadas(avisar: () => void): () => void {
  window.addEventListener("storage", avisar);
  return () => window.removeEventListener("storage", avisar);
}
