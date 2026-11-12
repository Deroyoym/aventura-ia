import "server-only";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory, type ThinkingLevel } from "@google/genai";
import { ESQUEMA_ADJUDICACION, ESQUEMA_NARRACION } from "./esquema";
import type { Narrador } from "./narrador";
import { crearSelector, type SelectorDeModelo } from "./modelos";
import { ErrorNarrador, clasificarError } from "./reintentos";

// Único punto del proyecto que habla con la API de Gemini. Solo se importa
// desde el servidor: la clave nunca llega al cliente.

let cliente: GoogleGenAI | null = null;

function ia(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY");
  cliente ??= new GoogleGenAI({ apiKey });
  return cliente;
}

let selector: { clave: string; valor: SelectorDeModelo } | null = null;

/** GEMINI_MODEL y, si está, GEMINI_MODEL_RESPALDO para cuando el primero no da abasto. */
function modelos(): SelectorDeModelo {
  const principal = process.env.GEMINI_MODEL;
  if (!principal) throw new Error("Falta GEMINI_MODEL");
  const respaldo = process.env.GEMINI_MODEL_RESPALDO?.trim() ?? "";
  const clave = `${principal}|${respaldo}`;
  if (selector?.clave !== clave) selector = { clave, valor: crearSelector(principal.trim(), respaldo) };
  return selector.valor;
}

/** Si el modelo principal rechaza el pedido por cuota o saturación, se repite una vez con el de respaldo. */
function cambiarAlRespaldo(e: unknown): boolean {
  const fallo = clasificarError(e);
  const anterior = modelos().actual();
  if (!modelos().degradar(fallo)) return false;
  console.warn(`Gemini: ${anterior} falló (${fallo.detalle}); se usa ${modelos().actual()}.`);
  return true;
}

/** Opcional: GEMINI_THINKING_LEVEL (MINIMAL, LOW, MEDIUM, HIGH) para bajar la latencia. */
function pensamiento() {
  const nivel = process.env.GEMINI_THINKING_LEVEL?.toUpperCase();
  return nivel ? { thinkingConfig: { thinkingLevel: nivel as ThinkingLevel } } : {};
}

// Es ficción de terror: se deja pasar lo que un filtro estricto marcaría como
// violencia o amenaza, y se sigue bloqueando lo grave.
const SEGURIDAD = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

const CORTES_POR_FILTRO = new Set(["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "RECITATION", "SPII"]);

function bloqueo(motivo: string): ErrorNarrador {
  return new ErrorNarrador({
    codigo: "otro",
    reintentable: false,
    esperaMs: null,
    mensaje: `El filtro de contenido cortó la respuesta (${motivo}).`,
    detalle: `filtro: ${motivo}`,
  });
}

type Trozos = AsyncIterable<{ text?: string; promptFeedback?: { blockReason?: unknown }; candidates?: { finishReason?: unknown }[] }>;

export const narradorGemini: Narrador = {
  nombre: "gemini",

  async *narrar({ sistema, mensaje, signal }) {
    const abrir = (model: string): Promise<Trozos> =>
      ia().models.generateContentStream({
        model,
        contents: mensaje,
        config: {
          systemInstruction: sistema,
          responseMimeType: "application/json",
          responseJsonSchema: ESQUEMA_NARRACION,
          temperature: 0.95,
          safetySettings: SEGURIDAD,
          abortSignal: signal,
          ...pensamiento(),
        },
      });

    async function* leer(stream: Trozos) {
      for await (const trozo of stream) {
        const bloqueado = trozo.promptFeedback?.blockReason;
        if (bloqueado) throw bloqueo(String(bloqueado));
        const texto = trozo.text;
        if (texto) yield texto;
        const fin = trozo.candidates?.[0]?.finishReason;
        if (fin && CORTES_POR_FILTRO.has(String(fin))) throw bloqueo(String(fin));
      }
    }

    let emitio = false;
    try {
      for await (const texto of leer(await abrir(modelos().actual()))) {
        emitio = true;
        yield texto;
      }
      return;
    } catch (e) {
      if (emitio || !cambiarAlRespaldo(e)) throw e;
    }
    yield* leer(await abrir(modelos().actual()));
  },

  async arbitrar({ sistema, mensaje, signal }) {
    const pedir = async (model: string) => {
      const respuesta = await ia().models.generateContent({
        model,
        contents: mensaje,
        config: {
          systemInstruction: sistema,
          responseMimeType: "application/json",
          responseJsonSchema: ESQUEMA_ADJUDICACION,
          temperature: 0.2,
          abortSignal: signal,
          ...pensamiento(),
        },
      });
      return respuesta.text ?? "";
    };
    try {
      return await pedir(modelos().actual());
    } catch (e) {
      if (!cambiarAlRespaldo(e)) throw e;
      return pedir(modelos().actual());
    }
  },
};
