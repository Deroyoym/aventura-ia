import "server-only";
import { descripcionDeRetrato, firmaDe, pintarRetrato } from "@/lib/dm/retrato";
import { clasificarError } from "@/lib/dm/reintentos";
import { empezarRetrato, terminarRetrato } from "@/lib/game/motor";
import type { Asiento, EstadoJuego } from "@/lib/game/tipos";
import { entorno } from "./config";
import { difundir } from "./realtime";
import { obtenerStore } from "./store";

// Pinta el retrato de un personaje con el modelo de imágenes y lo guarda. Va
// en dos tiempos: primero se reserva el intento dentro del pedido del jugador
// y después, ya respondido el pedido, se genera y se guarda la imagen.

const LIMITE_MS = 50_000;

export const retratosActivos = (): boolean => !!entorno().geminiImagenes;

/**
 * Para usar dentro de `mutar`: reserva el intento si corresponde pintar.
 * Devuelve el estado sin cambios cuando no hay nada que hacer.
 */
export function reservarRetrato(
  estado: EstadoJuego,
  asiento: Asiento,
  pedido: boolean,
): { estado: EstadoJuego; pintar: boolean } {
  const p = estado.personajes[asiento];
  if (!retratosActivos() || !p) return { estado, pintar: false };
  const reservado = empezarRetrato(estado, asiento, firmaDe(descripcionDeRetrato(p)), Date.now(), pedido);
  return reservado ? { estado: reservado, pintar: true } : { estado, pintar: false };
}

/** Aplica un cambio chico sobre el estado más reciente, reintentando si alguien escribió en el medio. */
async function guardar(codigo: string, cambio: (estado: EstadoJuego) => EstadoJuego): Promise<void> {
  const store = obtenerStore();
  for (let intento = 0; intento < 5; intento++) {
    const sala = await store.obtenerSala(codigo);
    if (!sala) return;
    const guardada = await store.guardar(sala, cambio(sala.estado));
    if (guardada) {
      await difundir(guardada.id, { t: "estado", version: guardada.version });
      return;
    }
  }
  console.warn(`Retrato: no se pudo guardar en la sala ${codigo}.`);
}

/** Genera y guarda el retrato reservado. Nunca lanza: si falla, queda el anterior. */
export async function completarRetrato(codigo: string, asiento: Asiento): Promise<void> {
  const store = obtenerStore();
  let firma = "";
  let url: string | null = null;
  try {
    const sala = await store.obtenerSala(codigo);
    const p = sala?.estado.personajes[asiento];
    if (!sala || !p) return;
    const descripcion = descripcionDeRetrato(p);
    firma = firmaDe(descripcion);
    const { bytes, tipo } = await pintarRetrato(descripcion, AbortSignal.timeout(LIMITE_MS));
    url = await store.guardarImagen(`${sala.id}/${asiento}-${firma}-${Date.now().toString(36)}.webp`, bytes, tipo);
  } catch (e) {
    const fallo = clasificarError(e);
    console.warn(`Retrato fallido: ${fallo.codigo} · ${fallo.detalle}`);
  }
  await guardar(codigo, (estado) => terminarRetrato(estado, asiento, firma, url, Date.now()));
}
