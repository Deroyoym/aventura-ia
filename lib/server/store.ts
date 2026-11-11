import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Asiento, EstadoJuego, Tirada } from "@/lib/game/tipos";
import { entorno, estadoServidor } from "./config";

// Persistencia de las salas. Hay dos implementaciones con la misma interfaz:
// Supabase (producción) y memoria (desarrollo y tests sin claves).

export interface Sala {
  id: string;
  codigo: string;
  estado: EstadoJuego;
  version: number;
}

export interface FilaAsiento {
  asiento: Asiento;
  tokenHash: string;
  /** Última vez que ese celular pidió el estado (ms). */
  vistoEn: number;
}

export interface FilaTurno {
  turno: number;
  tipo: string;
  asiento: Asiento | null;
  accion: string | null;
  tirada: Tirada | null;
  narracion: string;
  salida: unknown;
}

export interface Store {
  /** null si el código ya existe. */
  crearSala(codigo: string, estado: EstadoJuego, tokenHash: string): Promise<Sala | null>;
  obtenerSala(codigo: string): Promise<Sala | null>;
  /** Guarda solo si nadie escribió antes; null si la versión ya cambió. */
  guardar(sala: Sala, estado: EstadoJuego): Promise<Sala | null>;
  asientos(salaId: string): Promise<FilaAsiento[]>;
  /** Ocupa un asiento libre o, con `reemplazar`, cambia el token de uno tomado. */
  ocupar(salaId: string, asiento: Asiento, tokenHash: string, reemplazar: boolean): Promise<boolean>;
  visto(salaId: string, asiento: Asiento): Promise<void>;
  registrarTurno(salaId: string, fila: FilaTurno): Promise<void>;
}

// ───────────────────────── Supabase ─────────────────────────

const UNICO_VIOLADO = "23505";

function falla(operacion: string, error: { message: string } | null): never {
  throw new Error(`Supabase (${operacion}): ${error?.message ?? "sin detalle"}`);
}

function storeSupabase(db: SupabaseClient): Store {
  return {
    async crearSala(codigo, estado, tokenHash) {
      const { data, error } = await db
        .from("rooms")
        .insert({ code: codigo, state: estado })
        .select("id, version")
        .single();
      if (error?.code === UNICO_VIOLADO) return null;
      if (error || !data) falla("crear sala", error);
      const asiento = await db.from("seats").insert({ room_id: data.id, seat: 1, token_hash: tokenHash });
      if (asiento.error) falla("crear asiento", asiento.error);
      return { id: data.id, codigo, estado, version: data.version };
    },

    async obtenerSala(codigo) {
      const { data, error } = await db
        .from("rooms")
        .select("id, code, state, version")
        .eq("code", codigo)
        .maybeSingle();
      if (error) falla("leer sala", error);
      return data && { id: data.id, codigo: data.code, estado: data.state as EstadoJuego, version: data.version };
    },

    async guardar(sala, estado) {
      const { data, error } = await db
        .from("rooms")
        .update({ state: estado, version: sala.version + 1, updated_at: new Date().toISOString() })
        .eq("id", sala.id)
        .eq("version", sala.version)
        .select("version");
      if (error) falla("guardar sala", error);
      return data?.length ? { ...sala, estado, version: sala.version + 1 } : null;
    },

    async asientos(salaId) {
      const { data, error } = await db
        .from("seats")
        .select("seat, token_hash, last_seen_at")
        .eq("room_id", salaId);
      if (error) falla("leer asientos", error);
      return (data ?? []).map((f) => ({
        asiento: f.seat as Asiento,
        tokenHash: f.token_hash as string,
        vistoEn: Date.parse(f.last_seen_at as string),
      }));
    },

    async ocupar(salaId, asiento, tokenHash, reemplazar) {
      const fila = { room_id: salaId, seat: asiento, token_hash: tokenHash, last_seen_at: new Date().toISOString() };
      if (reemplazar) {
        const { error } = await db.from("seats").upsert(fila, { onConflict: "room_id,seat" });
        if (error) falla("reclamar asiento", error);
        return true;
      }
      const { error } = await db.from("seats").insert(fila);
      if (error?.code === UNICO_VIOLADO) return false;
      if (error) falla("ocupar asiento", error);
      return true;
    },

    async visto(salaId, asiento) {
      await db
        .from("seats")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("room_id", salaId)
        .eq("seat", asiento);
    },

    async registrarTurno(salaId, f) {
      const { error } = await db.from("turns").insert({
        room_id: salaId,
        turn: f.turno,
        kind: f.tipo,
        seat: f.asiento,
        action: f.accion,
        roll: f.tirada,
        narration: f.narracion,
        output: f.salida,
      });
      if (error) falla("registrar turno", error);
    },
  };
}

// ───────────────────────── Memoria ─────────────────────────

interface SalaEnMemoria {
  sala: Sala;
  asientos: Map<Asiento, FilaAsiento>;
  turnos: FilaTurno[];
}

function storeMemoria(salas: Map<string, SalaEnMemoria>): Store {
  const porId = (id: string) => [...salas.values()].find((s) => s.sala.id === id);
  return {
    async crearSala(codigo, estado, tokenHash) {
      if (salas.has(codigo)) return null;
      const sala: Sala = { id: crypto.randomUUID(), codigo, estado: structuredClone(estado), version: 1 };
      salas.set(codigo, {
        sala,
        asientos: new Map([[1, { asiento: 1, tokenHash, vistoEn: Date.now() }]]),
        turnos: [],
      });
      return structuredClone(sala);
    },
    async obtenerSala(codigo) {
      const s = salas.get(codigo);
      return s ? structuredClone(s.sala) : null;
    },
    async guardar(sala, estado) {
      const s = salas.get(sala.codigo);
      if (!s || s.sala.version !== sala.version) return null;
      s.sala = { ...sala, estado: structuredClone(estado), version: sala.version + 1 };
      return structuredClone(s.sala);
    },
    async asientos(salaId) {
      return [...(porId(salaId)?.asientos.values() ?? [])].map((f) => ({ ...f }));
    },
    async ocupar(salaId, asiento, tokenHash, reemplazar) {
      const s = porId(salaId);
      if (!s || (s.asientos.has(asiento) && !reemplazar)) return false;
      s.asientos.set(asiento, { asiento, tokenHash, vistoEn: Date.now() });
      return true;
    },
    async visto(salaId, asiento) {
      const fila = porId(salaId)?.asientos.get(asiento);
      if (fila) fila.vistoEn = Date.now();
    },
    async registrarTurno(salaId, fila) {
      porId(salaId)?.turnos.push(fila);
    },
  };
}

// ───────────────────────── Selección ─────────────────────────

// En desarrollo cada route se compila aparte: el estado compartido va en globalThis.
const global = globalThis as unknown as {
  __salasEnMemoria?: Map<string, SalaEnMemoria>;
  __supabaseServidor?: SupabaseClient;
};

export function obtenerStore(): Store {
  if (estadoServidor().almacen === "memoria") {
    global.__salasEnMemoria ??= new Map();
    return storeMemoria(global.__salasEnMemoria);
  }
  const { supabaseUrl, supabaseSecreta } = entorno();
  global.__supabaseServidor ??= createClient(supabaseUrl, supabaseSecreta, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return storeSupabase(global.__supabaseServidor);
}
