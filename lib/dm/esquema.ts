import { z } from "zod";
import { NPCS, PISTAS } from "@/lib/game/campana";
import {
  ATRIBUTOS,
  DIFICULTADES,
  ENFOQUES,
  type Asiento,
  type Enfoque,
  type Opcion,
  type SalidaDM,
  type TiradaPedida,
} from "@/lib/game/tipos";

// Contrato con el modelo. Hay dos mitades:
//  - el JSON Schema que se le manda a Gemini (responseJsonSchema), y
//  - la lectura tolerante de lo que vuelve: un campo mal formado se descarta
//    sin tirar abajo el resto de la respuesta.

const ATRIBUTO_O_NINGUNO = [...ATRIBUTOS, "ninguno"] as const;

const opcionSchema = {
  type: "object",
  properties: {
    texto: { type: "string", description: "Frase corta en infinitivo, hasta 12 palabras." },
    enfoque: { type: "string", enum: [...ENFOQUES] },
    atributo: {
      type: "string",
      enum: [...ATRIBUTO_O_NINGUNO],
      description: 'Atributo que se pone a prueba, o "ninguno" si no hay riesgo.',
    },
    dificultad: { type: "string", enum: [...DIFICULTADES] },
    avanza: { type: "boolean", description: "Si acerca al objetivo de la escena." },
  },
  required: ["texto", "enfoque", "atributo", "dificultad", "avanza"],
};

/** `narracion` va primero para poder transmitirla mientras se genera el resto. */
export const ESQUEMA_NARRACION = {
  type: "object",
  properties: {
    narracion: {
      type: "string",
      description: "La narración del turno: 90 a 140 palabras, párrafos separados por línea en blanco.",
    },
    opciones: { type: "array", items: opcionSchema, maxItems: 3 },
    cambios: {
      type: "object",
      properties: {
        vida: {
          type: "array",
          items: {
            type: "object",
            properties: { jugador: { type: "integer", enum: [1, 2, 3, 4, 5, 6] }, delta: { type: "integer" } },
            required: ["jugador", "delta"],
          },
        },
        amenaza: { type: "integer", description: "Entre -1 y 2. Casi siempre 0." },
        relaciones: {
          type: "array",
          items: {
            type: "object",
            properties: {
              npc: { type: "string", enum: NPCS.map((n) => n.id) },
              delta: { type: "integer" },
            },
            required: ["npc", "delta"],
          },
        },
        pistas: { type: "array", items: { type: "string", enum: PISTAS.map((p) => p.id) } },
        inventario: {
          type: "array",
          items: {
            type: "object",
            properties: {
              jugador: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
              accion: { type: "string", enum: ["agregar", "quitar"] },
              objeto: { type: "string", description: "Id del catálogo o nombre corto." },
              descripcion: { type: "string" },
            },
            required: ["jugador", "accion", "objeto"],
          },
        },
        secretoRevelado: { type: "array", items: { type: "integer", enum: [1, 2, 3, 4, 5, 6] } },
        memoria: { type: "array", items: { type: "string" }, maxItems: 2 },
      },
    },
    susurros: {
      type: "array",
      items: {
        type: "object",
        properties: { jugador: { type: "integer", enum: [1, 2, 3, 4, 5, 6] }, texto: { type: "string" } },
        required: ["jugador", "texto"],
      },
    },
    resumenEscena: {
      type: "string",
      description: "Solo al cerrar una escena: 1 o 2 frases de lo ocurrido. Si no, cadena vacía.",
    },
  },
  required: ["narracion", "opciones", "cambios"],
  propertyOrdering: ["narracion", "opciones", "cambios", "susurros", "resumenEscena"],
};

export const ESQUEMA_ADJUDICACION = {
  type: "object",
  properties: {
    enfoque: { type: "string", enum: [...ENFOQUES] },
    atributo: { type: "string", enum: [...ATRIBUTO_O_NINGUNO] },
    dificultad: { type: "string", enum: [...DIFICULTADES] },
    avanza: { type: "boolean" },
  },
  required: ["enfoque", "atributo", "dificultad", "avanza"],
};

// ───────────────────────── Lectura tolerante ─────────────────────────

/** Lista que conserva solo los elementos válidos en vez de fallar entera. */
const lista = <T extends z.ZodType>(item: T) =>
  z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => item.safeParse(x).success) : []),
    z.array(item),
  );

const zAsiento = z.preprocess(
  (v) => (typeof v === "string" ? Number(v) : v),
  z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
);
const zEntero = z.preprocess((v) => (typeof v === "string" ? Number(v) : v), z.number().finite());

const zOpcion = z.object({
  texto: z.string().min(1),
  enfoque: z.enum(ENFOQUES as readonly [Enfoque, ...Enfoque[]]).catch("ingenio"),
  atributo: z.enum(ATRIBUTO_O_NINGUNO).catch("ninguno"),
  dificultad: z.enum(DIFICULTADES as readonly [TiradaPedida["dificultad"], ...TiradaPedida["dificultad"][]]).catch("media"),
  avanza: z.boolean().catch(true),
});

const zCambios = z.object({
  vida: lista(z.object({ jugador: zAsiento, delta: zEntero })),
  amenaza: zEntero.catch(0),
  relaciones: lista(z.object({ npc: z.string(), delta: zEntero })),
  pistas: lista(z.string()),
  inventario: lista(
    z.object({
      jugador: zAsiento,
      accion: z.enum(["agregar", "quitar"]),
      objeto: z.string().min(1),
      descripcion: z.string().catch(""),
    }),
  ),
  secretoRevelado: lista(zAsiento),
  memoria: lista(z.string()),
});

const zSalida = z.object({
  narracion: z.string(),
  opciones: lista(zOpcion),
  cambios: z.preprocess((v) => (v && typeof v === "object" ? v : {}), zCambios),
  susurros: lista(z.object({ jugador: zAsiento, texto: z.string().min(1) })),
  resumenEscena: z.string().catch(""),
});

const zAdjudicacion = z.object({
  enfoque: z.enum(ENFOQUES as readonly [Enfoque, ...Enfoque[]]),
  atributo: z.enum(ATRIBUTO_O_NINGUNO),
  dificultad: z.enum(DIFICULTADES as readonly [TiradaPedida["dificultad"], ...TiradaPedida["dificultad"][]]).catch("media"),
  avanza: z.boolean().catch(true),
});

/** Saca el objeto JSON de una respuesta que puede venir envuelta en ``` o con texto alrededor. */
function extraerJson(crudo: string): unknown {
  const desde = crudo.indexOf("{");
  const hasta = crudo.lastIndexOf("}");
  if (desde < 0 || hasta <= desde) return null;
  try {
    return JSON.parse(crudo.slice(desde, hasta + 1));
  } catch {
    return null;
  }
}

const aTirada = (o: { atributo: (typeof ATRIBUTO_O_NINGUNO)[number]; dificultad: TiradaPedida["dificultad"] }) =>
  o.atributo === "ninguno" ? null : { atributo: o.atributo, dificultad: o.dificultad };

export const SALIDA_VACIA: SalidaDM = {
  narracion: "",
  opciones: [],
  cambios: {
    vida: [],
    amenaza: 0,
    relaciones: [],
    pistas: [],
    inventario: [],
    secretoRevelado: [],
    memoria: [],
  },
  susurros: [],
  resumenEscena: "",
};

/** Devuelve null si no hay una narración utilizable. */
export function interpretarSalida(crudo: string): SalidaDM | null {
  const r = zSalida.safeParse(extraerJson(crudo));
  if (!r.success || r.data.narracion.trim().length < 20) return null;
  const d = r.data;
  return {
    narracion: d.narracion,
    opciones: d.opciones.map(
      (o, i): Opcion => ({
        id: "abc"[i] ?? `o${i}`,
        texto: o.texto,
        enfoque: o.enfoque,
        tirada: aTirada(o),
        avanza: o.avanza,
      }),
    ),
    cambios: {
      ...d.cambios,
      vida: d.cambios.vida as { jugador: Asiento; delta: number }[],
      inventario: d.cambios.inventario as SalidaDM["cambios"]["inventario"],
      secretoRevelado: d.cambios.secretoRevelado as Asiento[],
    },
    susurros: d.susurros as SalidaDM["susurros"],
    resumenEscena: d.resumenEscena,
  };
}

export interface Adjudicacion {
  enfoque: Enfoque;
  tirada: TiradaPedida | null;
  avanza: boolean;
}

export function interpretarAdjudicacion(crudo: string): Adjudicacion | null {
  const r = zAdjudicacion.safeParse(extraerJson(crudo));
  if (!r.success) return null;
  return { enfoque: r.data.enfoque, tirada: aTirada(r.data), avanza: r.data.avanza };
}
