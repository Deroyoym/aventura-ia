import "server-only";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { estadoInicial } from "@/lib/game/motor";
import { ASIENTOS, ErrorJuego, type Asiento, type EstadoJuego, type NivelTerror } from "@/lib/game/tipos";
import { vistaPara } from "@/lib/game/vista";
import { LARGO_CODIGO, normalizarCodigo, type Credencial, type InfoPublica, type Instantanea } from "@/lib/protocolo";
import { estadoServidor } from "./config";
import { obtenerStore, type FilaAsiento, type Sala } from "./store";

// Salas y asientos: códigos, tokens, acceso y el snapshot que ve cada jugador.

/** Sin 0/O, 1/I/L: se dicta por teléfono sin errores. */
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
/** Un asiento cuenta como activo si su celular pidió el estado hace poco. */
const ACTIVO_MS = 45_000;
/** Pasado este tiempo, un bloqueo de narración se considera abandonado. */
export const NARRACION_VENCE_MS = 90_000;

const nuevoCodigo = (): string =>
  Array.from({ length: LARGO_CODIGO }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");

const hashDe = (token: string): string => createHash("sha256").update(token).digest("hex");

function nuevoToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashDe(token) };
}

/** Dado del servidor: entero criptográfico llevado a [0, 1). */
export const rngServidor = (): number => randomInt(0, 2 ** 32) / 2 ** 32;

export const estaNarrando = (e: EstadoJuego, ahora = Date.now()): boolean =>
  e.narrando !== null && ahora - e.narrando < NARRACION_VENCE_MS;

const activo = (fila: FilaAsiento | undefined, ahora: number): boolean =>
  !!fila && ahora - fila.vistoEn < ACTIVO_MS;

async function salaOError(codigo: string): Promise<Sala> {
  const sala = await obtenerStore().obtenerSala(normalizarCodigo(codigo));
  if (!sala) throw new ErrorJuego("sin_sala", "No existe ninguna sala con ese código.", 404);
  return sala;
}

export async function crearSala(terror: NivelTerror): Promise<Credencial> {
  const store = obtenerStore();
  const { token, hash } = nuevoToken();
  for (let intento = 0; intento < 6; intento++) {
    const sala = await store.crearSala(nuevoCodigo(), estadoInicial(terror, Date.now()), hash);
    if (sala) return { codigo: sala.codigo, asiento: 1, token };
  }
  throw new ErrorJuego("sin_codigo", "No se pudo generar un código de sala. Probá de nuevo.", 503);
}

function infoPublica(sala: Sala, filas: FilaAsiento[]): InfoPublica {
  const ahora = Date.now();
  return {
    codigo: sala.codigo,
    fase: sala.estado.fase,
    asientos: ASIENTOS.map((asiento) => {
      const fila = filas.find((f) => f.asiento === asiento);
      return {
        asiento,
        ocupado: !!fila,
        activo: activo(fila, ahora),
        personaje: sala.estado.personajes[asiento]?.nombre ?? null,
      };
    }),
  };
}

/** Entra a un asiento libre o, con `reclamar`, recupera uno propio desde otro dispositivo. */
export async function unirse(codigo: string, reclamar?: Asiento): Promise<Credencial> {
  const store = obtenerStore();
  const sala = await salaOError(codigo);
  const filas = await store.asientos(sala.id);
  const { token, hash } = nuevoToken();

  if (reclamar) {
    const fila = filas.find((f) => f.asiento === reclamar);
    if (!fila) throw new ErrorJuego("asiento", "Ese lugar todavía no es de nadie.", 409);
    if (activo(fila, Date.now())) {
      throw new ErrorJuego("en_uso", "Ese personaje está abierto en otro dispositivo ahora mismo.", 409);
    }
    await store.ocupar(sala.id, reclamar, hash, true);
    return { codigo: sala.codigo, asiento: reclamar, token };
  }

  const libre = ASIENTOS.find((a) => !filas.some((f) => f.asiento === a));
  if (!libre || !(await store.ocupar(sala.id, libre, hash, false))) {
    throw new ErrorJuego("sala_llena", "La sala ya tiene a sus dos jugadores.", 409);
  }
  return { codigo: sala.codigo, asiento: libre, token };
}

export interface Acceso {
  sala: Sala;
  asiento: Asiento;
  filas: FilaAsiento[];
}

/** Valida el token del asiento. Sin acceso, el error lleva la info pública para poder unirse. */
export async function autenticar(codigo: string, token: string | null): Promise<Acceso> {
  const sala = await salaOError(codigo);
  const filas = await obtenerStore().asientos(sala.id);
  const hash = token ? hashDe(token) : null;
  const fila = filas.find((f) => f.tokenHash === hash);
  if (!fila) {
    throw Object.assign(new ErrorJuego("sin_acceso", "Este dispositivo no tiene un lugar en la sala.", 401), {
      publica: infoPublica(sala, filas),
    });
  }
  return { sala, asiento: fila.asiento, filas };
}

export function instantanea({ sala, asiento, filas }: Acceso): Instantanea {
  const ahora = Date.now();
  const { narrador, almacen } = estadoServidor();
  const asientos = Object.fromEntries(
    ASIENTOS.map((a) => {
      const fila = filas.find((f) => f.asiento === a);
      // Quien pide el snapshot está activo por definición.
      return [a, { ocupado: !!fila, activo: a === asiento || activo(fila, ahora) }];
    }),
  ) as Instantanea["asientos"];
  return {
    codigo: sala.codigo,
    salaId: sala.id,
    version: sala.version,
    vista: vistaPara(sala.estado, asiento, estaNarrando(sala.estado, ahora)),
    asientos,
    modo: { narrador, almacen },
  };
}

/** Aplica un cambio de estado reintentando si otro pedido escribió en el medio. */
export async function mutar(
  codigo: string,
  token: string | null,
  cambio: (estado: EstadoJuego, asiento: Asiento) => EstadoJuego,
): Promise<Acceso> {
  const store = obtenerStore();
  for (let intento = 0; intento < 4; intento++) {
    const acceso = await autenticar(codigo, token);
    const guardada = await store.guardar(acceso.sala, cambio(acceso.sala.estado, acceso.asiento));
    if (guardada) return { ...acceso, sala: guardada };
  }
  throw new ErrorJuego("conflicto", "Los dos tocaron algo a la vez. Probá de nuevo.", 409);
}
