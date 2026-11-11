import "server-only";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory, type ThinkingLevel } from "@google/genai";
import { ESQUEMA_ADJUDICACION, ESQUEMA_NARRACION } from "./esquema";
import type { Narrador } from "./narrador";
import { ErrorNarrador } from "./reintentos";

// Único punto del proyecto que habla con la API de Gemini. Solo se importa
// desde el servidor: la clave nunca llega al cliente.

let cliente: GoogleGenAI | null = null;

function ia(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY");
  cliente ??= new GoogleGenAI({ apiKey });
  return cliente;
}

function modelo(): string {
  const nombre = process.env.GEMINI_MODEL;
  if (!nombre) throw new Error("Falta GEMINI_MODEL");
  return nombre;
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
  });
}

export const narradorGemini: Narrador = {
  nombre: "gemini",

  async *narrar({ sistema, mensaje, signal }) {
    const stream = await ia().models.generateContentStream({
      model: modelo(),
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
    for await (const trozo of stream) {
      const bloqueado = trozo.promptFeedback?.blockReason;
      if (bloqueado) throw bloqueo(String(bloqueado));
      const texto = trozo.text;
      if (texto) yield texto;
      const fin = trozo.candidates?.[0]?.finishReason;
      if (fin && CORTES_POR_FILTRO.has(String(fin))) throw bloqueo(String(fin));
    }
  },

  async arbitrar({ sistema, mensaje, signal }) {
    const respuesta = await ia().models.generateContent({
      model: modelo(),
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
  },
};
