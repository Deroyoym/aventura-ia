import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import type { Asiento } from "@/lib/game/tipos";
import { EVENTO_SALA, canalDeSala, type EventoSala } from "@/lib/protocolo";

// Suscripción del navegador al canal de la sala en Supabase Realtime. Usa solo
// la clave pública. Si no está configurado, la sala funciona igual por sondeo.

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CLAVE_PUBLICA =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let cliente: SupabaseClient | null = null;

function supabase(): SupabaseClient | null {
  if (!URL_SUPABASE || !CLAVE_PUBLICA) return null;
  cliente ??= createClient(URL_SUPABASE, CLAVE_PUBLICA, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

export interface ConexionSala {
  enviar(evento: EventoSala): void;
  cerrar(): void;
}

export function conectarSala(
  salaId: string,
  yo: Asiento,
  alEvento: (evento: EventoSala) => void,
  alCambiar: (estado: { vivo: boolean; presentes: Asiento[] }) => void,
): ConexionSala | null {
  const db = supabase();
  if (!db) return null;

  let vivo = false;
  let presentes: Asiento[] = [];
  const avisar = () => alCambiar({ vivo, presentes });

  const canal: RealtimeChannel = db.channel(canalDeSala(salaId), {
    config: { broadcast: { self: false }, presence: { key: String(yo) } },
  });

  canal
    .on("broadcast", { event: EVENTO_SALA }, ({ payload }) => alEvento(payload as EventoSala))
    .on("presence", { event: "sync" }, () => {
      presentes = Object.keys(canal.presenceState()).map(Number).filter((a): a is Asiento => a === 1 || a === 2);
      avisar();
    })
    .subscribe((estado) => {
      vivo = estado === "SUBSCRIBED";
      if (vivo) void canal.track({ asiento: yo });
      avisar();
    });

  return {
    enviar: (evento) => {
      if (vivo) void canal.send({ type: "broadcast", event: EVENTO_SALA, payload: evento });
    },
    cerrar: () => {
      void db.removeChannel(canal);
    },
  };
}
