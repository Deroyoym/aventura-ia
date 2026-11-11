import "server-only";
import { EVENTO_SALA, canalDeSala, type EventoSala } from "@/lib/protocolo";
import { entorno } from "./config";

// Envío de eventos a los celulares por Supabase Realtime (Broadcast vía REST).
// Es un acelerador, no la fuente de verdad: si falla, los clientes igual se
// ponen al día pidiendo el snapshot.

const INTERVALO_MS = 300;

async function publicar(salaId: string, eventos: EventoSala[]): Promise<void> {
  const { supabaseUrl, supabaseSecreta, supabasePublica } = entorno();
  const clave = supabaseSecreta || supabasePublica;
  if (!supabaseUrl || !clave || eventos.length === 0) return;
  try {
    const respuesta = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: eventos.map((payload) => ({ topic: canalDeSala(salaId), event: EVENTO_SALA, payload })),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!respuesta.ok) console.warn(`Broadcast rechazado (${respuesta.status})`);
  } catch (e) {
    console.warn("Broadcast falló:", e instanceof Error ? e.message : e);
  }
}

export const difundir = (salaId: string, evento: EventoSala): Promise<void> => publicar(salaId, [evento]);

/**
 * Junta los trozos de narración y los envía en tandas, para no hacer un pedido
 * HTTP por cada palabra que llega del modelo.
 */
export function crearDifusor(salaId: string) {
  let cola: EventoSala[] = [];
  let temporizador: ReturnType<typeof setTimeout> | null = null;
  let enCurso: Promise<void> = Promise.resolve();

  const vaciar = () => {
    temporizador = null;
    const lote = cola;
    cola = [];
    enCurso = enCurso.then(() => publicar(salaId, lote));
  };

  return {
    enviar(evento: EventoSala) {
      const ultimo = cola[cola.length - 1];
      // Dos deltas seguidos se funden en uno.
      if (evento.t === "delta" && ultimo?.t === "delta" && ultimo.desde + ultimo.texto.length === evento.desde) {
        ultimo.texto += evento.texto;
      } else {
        cola.push({ ...evento });
      }
      temporizador ??= setTimeout(vaciar, INTERVALO_MS);
    },
    /** Envía lo que quede y espera a que salga. */
    async cerrar() {
      if (temporizador) clearTimeout(temporizador);
      vaciar();
      await enCurso;
    },
  };
}
