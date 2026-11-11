import { after } from "next/server";
import { ErrorJuego } from "@/lib/game/tipos";
import type { EventoTurno, PeticionTurno } from "@/lib/protocolo";
import { cuerpo, manejar, tokenDe, type Contexto } from "@/lib/server/http";
import { autenticar } from "@/lib/server/sala";
import { prepararTurno } from "@/lib/server/turno";

/** Un turno puede incluir reintentos con espera ante un 429. */
export const maxDuration = 120;

const TIPOS: PeticionTurno["tipo"][] = ["inicio", "opcion", "libre", "tirar", "continuar"];
const LATIDO_MS = 10_000;

/**
 * El máster en streaming. Responde con una línea JSON por evento (NDJSON):
 * la tirada, los trozos de narración a medida que el modelo los escribe, las
 * esperas por reintento y el cierre del turno.
 */
export async function POST(req: Request, ctx: Contexto) {
  return manejar(async () => {
    const { codigo } = await ctx.params;
    const peticion = await cuerpo<PeticionTurno>(req);
    if (!TIPOS.includes(peticion?.tipo)) throw new ErrorJuego("turno", "Pedido de turno desconocido.");
    const correr = prepararTurno(await autenticar(codigo, tokenDe(req)), peticion);

    const codificador = new TextEncoder();
    let controlador!: ReadableStreamDefaultController<Uint8Array>;
    let abierto = true;
    const flujo = new ReadableStream<Uint8Array>({
      start: (c) => {
        controlador = c;
      },
      // Si el celular corta la conexión, el turno igual termina y se guarda.
      cancel: () => {
        abierto = false;
      },
    });
    const escribir = (linea: string) => {
      if (!abierto) return;
      try {
        controlador.enqueue(codificador.encode(`${linea}\n`));
      } catch {
        abierto = false;
      }
    };

    // Líneas vacías para que ningún proxy corte la conexión mientras el modelo piensa.
    const latido = setInterval(() => escribir(""), LATIDO_MS);
    const trabajo = correr((evento: EventoTurno) => escribir(JSON.stringify(evento))).finally(() => {
      clearInterval(latido);
      if (!abierto) return;
      abierto = false;
      controlador.close();
    });
    after(() => trabajo);

    return new Response(flujo, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  });
}
