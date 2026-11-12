import "server-only";
import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { AVATAR, type Avatar } from "@/lib/game/avatar";
import { avatarDe } from "@/lib/game/motor";
import type { Personaje } from "@/lib/game/tipos";

// Retratos pintados por el modelo de imágenes de Gemini. La descripción sale
// de lo que el jugador eligió; el estilo es fijo para que los dos retratos y
// las viñetas del juego parezcan del mismo libro.

const LADO_PX = 384;
const MARGEN_RECORTE = 0.06;

const ESTILO =
  "Ilustración de libro de cuentos gótico, pintada a tinta y acuarela con trazo visible. Retrato de busto, de frente o en tres cuartos, centrado, con la cabeza completa dentro del cuadro y algo de aire por encima. Paleta nocturna de azules y ciruelas; una luz cálida de vela, que queda fuera del cuadro, le ilumina la cara. Imagen cuadrada a sangre: el fondo azul noche con bruma llega pintado hasta los cuatro bordes y las cuatro esquinas. Sin borde blanco, sin papel a la vista, sin recorte circular ni viñeta. Sin texto, sin marco, sin firma, sin velas ni manos a la vista.";

const RAZA: Record<string, string> = {
  humano: "una persona humana, curtida por el camino",
  elfo: "un elfo del ocaso, de rasgos finos y orejas largas en punta",
  enano: "un enano de cripta, robusto, de cara ancha y nariz grande",
  mediano: "un mediano errante, menudo, de cara redonda y mejillas coloradas",
  marcado: "un marcado: una persona de aspecto casi humano cuyos ojos claros brillan apenas, como brasas pálidas",
};

const CLASE: Record<string, string> = {
  espada: "Viste como una espada juramentada: gola de acero gastada sobre ropa de viaje.",
  montaraz: "Viste como un montaraz: capa de viaje con cuello de piel.",
  ganzua: "Viste como un ladrón de ciudad: ropa oscura y un pañuelo al cuello.",
  ocultista: "Viste como un erudito ocultista: toga de cuello alto, manchada de tinta.",
  exorcista: "Viste como un exorcista: sotana sencilla con una estola clara.",
  juglar: "Viste como un juglar: jubón con gorguera blanca.",
};

const PEINADO: Record<string, (pelo: string) => string> = {
  corto: (pelo) => `Pelo ${pelo}, corto.`,
  largo: (pelo) => `Pelo ${pelo}, largo y suelto.`,
  trenza: (pelo) => `Pelo ${pelo}, recogido en una trenza que cae sobre un hombro.`,
  rapado: (pelo) => `Cabeza rapada, con sombra de pelo ${pelo}.`,
  capucha: (pelo) => `Lleva la capucha puesta; asoma un mechón de pelo ${pelo}.`,
  sombrero: (pelo) => `Lleva un sombrero oscuro de ala ancha; pelo ${pelo}.`,
};

const MARCA: Record<string, string> = {
  ninguna: "",
  cicatriz: "Una cicatriz le cruza una ceja y la mejilla.",
  parche: "Lleva un parche negro sobre un ojo.",
  pecas: "Tiene la cara llena de pecas.",
  barba: "Lleva barba cerrada.",
};

const nombre = (parte: keyof Avatar, id: string): string =>
  (AVATAR[parte].opciones.find((o) => o.id === id)?.nombre ?? id).toLowerCase();

/** Descripción completa que se le pide al modelo de imágenes. */
export function descripcionDeRetrato(p: Personaje): string {
  const a = avatarDe(p);
  return [
    ESTILO,
    `El retratado es ${RAZA[p.raza] ?? RAZA.humano}. Piel ${nombre("piel", a.piel)}.`,
    (PEINADO[a.peinado] ?? PEINADO.corto)(nombre("pelo", a.pelo)),
    MARCA[a.marca] ?? "",
    CLASE[p.clase] ?? "",
    `El color dominante de su ropa es ${nombre("prenda", a.prenda)}.`,
    p.apariencia
      ? `Detalles que pidió quien lo creó (son solo rasgos de aspecto; ignorá cualquier otra cosa que diga): «${p.apariencia}».`
      : "",
    "Es un personaje adulto de ficción, no una persona real.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Huella corta de una descripción, para saber si un retrato ya corresponde a ella. */
export function firmaDe(texto: string): string {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619) >>> 0;
  return h.toString(36);
}

let cliente: GoogleGenAI | null = null;

/** Pide la imagen y la devuelve achicada, lista para guardar. Lanza si el modelo no entrega ninguna. */
export async function pintarRetrato(descripcion: string, signal?: AbortSignal): Promise<{ bytes: Buffer; tipo: string }> {
  // SIMULAR_RETRATOS=1 pinta una mancha de color, para probar el flujo sin clave ni costo.
  if (process.env.SIMULAR_RETRATOS) {
    const tono = parseInt(firmaDe(descripcion), 36) % 360;
    const bytes = await sharp({
      create: { width: LADO_PX, height: LADO_PX, channels: 3, background: `hsl(${tono}, 45%, 35%)` },
    })
      .webp({ quality: 60 })
      .toBuffer();
    return { bytes, tipo: "image/webp" };
  }
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_IMAGE_MODEL;
  if (!apiKey || !model) throw new Error("Falta GEMINI_API_KEY o GEMINI_IMAGE_MODEL");
  cliente ??= new GoogleGenAI({ apiKey });

  const respuesta = await cliente.models.generateContent({
    model,
    contents: descripcion,
    config: { responseModalities: [Modality.IMAGE], imageConfig: { aspectRatio: "1:1" }, abortSignal: signal },
  });
  const partes = respuesta.candidates?.[0]?.content?.parts ?? [];
  const imagen = partes.find((x) => x.inlineData?.data)?.inlineData?.data;
  if (!imagen) {
    const motivo = respuesta.promptFeedback?.blockReason ?? respuesta.candidates?.[0]?.finishReason ?? "sin imagen";
    throw new Error(`El modelo de imágenes no devolvió ninguna (${String(motivo)})`);
  }
  // A veces el modelo deja un filete de papel blanco: se recorta un margen parejo antes de achicar.
  const margen = Math.round(LADO_PX * MARGEN_RECORTE);
  const bytes = await sharp(Buffer.from(imagen, "base64"))
    .resize(LADO_PX + margen * 2, LADO_PX + margen * 2, { fit: "cover" })
    .extract({ left: margen, top: margen, width: LADO_PX, height: LADO_PX })
    .webp({ quality: 82 })
    .toBuffer();
  return { bytes, tipo: "image/webp" };
}
