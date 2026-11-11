import type {
  Atributo,
  CompaneroId,
  Dificultad,
  Enfoque,
  NivelTerror,
  Objeto,
  Resultado,
} from "./tipos";

export const NIVELES_ORDEN: Record<NivelTerror, number> = { suave: 0, media: 1, fuerte: 2 };

export const NOMBRE_TERROR: Record<NivelTerror, string> = {
  suave: "Suave",
  media: "Media",
  fuerte: "Fuerte",
};

export const DESCRIPCION_TERROR: Record<NivelTerror, string> = {
  suave: "Inquietud y melancolía. Lo siniestro apenas se insinúa.",
  media: "Suspenso sostenido y algún susto de verdad.",
  fuerte: "Terror psicológico intenso. Nunca gore.",
};

export const NOMBRE_ATRIBUTO: Record<Atributo, string> = {
  fuerza: "Fuerza",
  destreza: "Destreza",
  ingenio: "Ingenio",
  voluntad: "Voluntad",
  carisma: "Carisma",
};

export const DESCRIPCION_ATRIBUTO: Record<Atributo, string> = {
  fuerza: "Empujar, cargar, pelear de cerca.",
  destreza: "Sigilo, puntería, manos rápidas.",
  ingenio: "Deducir, recordar, improvisar.",
  voluntad: "Resistir el miedo y lo que no tiene nombre.",
  carisma: "Convencer, consolar, mentir bien.",
};

export const NOMBRE_ENFOQUE: Record<Enfoque, string> = {
  combate: "Acción",
  ingenio: "Ingenio",
  dialogo: "Diálogo",
};

export const CD: Record<Dificultad, number> = {
  facil: 8,
  media: 12,
  dificil: 15,
  heroica: 18,
};

export const NOMBRE_DIFICULTAD: Record<Dificultad, string> = {
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
  heroica: "Heroica",
};

export const NOMBRE_RESULTADO: Record<Resultado, string> = {
  critico: "Éxito crítico",
  exito: "Éxito",
  costo: "Éxito con costo",
  fallo: "Fallo",
  pifia: "Pifia",
};

export interface Raza {
  id: string;
  nombre: string;
  descripcion: string;
  bono: Atributo;
}

export const RAZAS: Raza[] = [
  {
    id: "humano",
    nombre: "Humano",
    descripcion: "Tercos como la mala hierba. Donde otros se rinden, ellos discuten.",
    bono: "voluntad",
  },
  {
    id: "elfo",
    nombre: "Elfo crepuscular",
    descripcion: "Hijos de la última luz. Pisan sin ruido y olvidan despacio.",
    bono: "destreza",
  },
  {
    id: "enano",
    nombre: "Enano de cripta",
    descripcion: "Criados bajo tierra, entre lápidas y cerveza negra. No le temen a un cajón cerrado.",
    bono: "fuerza",
  },
  {
    id: "mediano",
    nombre: "Mediano errante",
    descripcion: "Llegan a cualquier mesa con una historia y se van con dos.",
    bono: "carisma",
  },
  {
    id: "marcado",
    nombre: "Marcado",
    descripcion: "Nacieron en una noche de bruma y algo se les quedó en la mirada. Ven lo que no deberían.",
    bono: "ingenio",
  },
];

export interface Clase {
  id: string;
  nombre: string;
  descripcion: string;
  afinidad: Enfoque;
  atributos: Record<Atributo, number>;
  vida: number;
  equipo: string[];
}

export const CLASES: Clase[] = [
  {
    id: "espada",
    nombre: "Espada juramentada",
    descripcion: "Un acero, un voto y pocas palabras. Se pone delante.",
    afinidad: "combate",
    atributos: { fuerza: 3, destreza: 1, ingenio: 0, voluntad: 1, carisma: 0 },
    vida: 12,
    equipo: ["espada", "vendas"],
  },
  {
    id: "montaraz",
    nombre: "Montaraz",
    descripcion: "Lee huellas, vientos y silencios. Prefiere no estar donde lo esperan.",
    afinidad: "combate",
    atributos: { fuerza: 1, destreza: 3, ingenio: 1, voluntad: 0, carisma: 0 },
    vida: 10,
    equipo: ["arco", "cuerda", "vendas"],
  },
  {
    id: "ganzua",
    nombre: "Ganzúa",
    descripcion: "No hay puerta cerrada, solo puertas que todavía no conoce.",
    afinidad: "ingenio",
    atributos: { fuerza: 0, destreza: 2, ingenio: 2, voluntad: 0, carisma: 1 },
    vida: 9,
    equipo: ["ganzuas", "daga"],
  },
  {
    id: "ocultista",
    nombre: "Erudito ocultista",
    descripcion: "Leyó los libros que otros quemaron. Algunos le contestaron.",
    afinidad: "ingenio",
    atributos: { fuerza: -1, destreza: 0, ingenio: 3, voluntad: 2, carisma: 1 },
    vida: 8,
    equipo: ["grimorio", "vela"],
  },
  {
    id: "exorcista",
    nombre: "Exorcista",
    descripcion: "Fe gastada, voz firme. Sabe cuándo rezar y cuándo plantarse.",
    afinidad: "dialogo",
    atributos: { fuerza: 1, destreza: 0, ingenio: 0, voluntad: 3, carisma: 1 },
    vida: 10,
    equipo: ["agua_bendita", "vendas"],
  },
  {
    id: "juglar",
    nombre: "Juglar",
    descripcion: "Canta, miente y consuela, a veces en la misma estrofa.",
    afinidad: "dialogo",
    atributos: { fuerza: -1, destreza: 1, ingenio: 1, voluntad: 1, carisma: 3 },
    vida: 9,
    equipo: ["laud", "petaca"],
  },
];

/** Catálogo de objetos con efecto. El máster puede entregar cualquiera por su id. */
export const OBJETOS: Record<string, Objeto> = {
  espada: {
    id: "espada",
    nombre: "Espada del juramento",
    descripcion: "Vieja, pesada, con un nombre grabado que nunca explicás.",
    usos: 2,
    bono: { atributo: "fuerza", valor: 2 },
  },
  arco: {
    id: "arco",
    nombre: "Arco de tejo",
    descripcion: "Silencioso y certero si la mano no tiembla.",
    usos: 2,
    bono: { atributo: "destreza", valor: 2 },
  },
  daga: {
    id: "daga",
    nombre: "Daga fina",
    descripcion: "Para cuando la sutileza no alcanza.",
    usos: 1,
    bono: { atributo: "destreza", valor: 2 },
  },
  ganzuas: {
    id: "ganzuas",
    nombre: "Juego de ganzúas",
    descripcion: "Seis alambres y mucha paciencia.",
    usos: 2,
    bono: { atributo: "destreza", valor: 2 },
  },
  cuerda: {
    id: "cuerda",
    nombre: "Cuerda encerada",
    descripcion: "Quince pasos de buena cuerda. Siempre hace falta.",
    usos: 1,
    bono: { atributo: "fuerza", valor: 2 },
  },
  grimorio: {
    id: "grimorio",
    nombre: "Grimorio de bolsillo",
    descripcion: "Apuntes robados a tres bibliotecas.",
    usos: 2,
    bono: { atributo: "ingenio", valor: 2 },
  },
  vela: {
    id: "vela",
    nombre: "Vela de sebo bendito",
    descripcion: "Su llama no se dobla con el viento. Calma el pulso.",
    usos: 1,
    bono: { atributo: "voluntad", valor: 2 },
  },
  agua_bendita: {
    id: "agua_bendita",
    nombre: "Agua bendita",
    descripcion: "Un frasco tibio. Lo que no es de este mundo la respeta.",
    usos: 2,
    bono: { atributo: "voluntad", valor: 2 },
  },
  laud: {
    id: "laud",
    nombre: "Laúd remendado",
    descripcion: "Le falta una cuerda y le sobran canciones.",
    usos: 2,
    bono: { atributo: "carisma", valor: 2 },
  },
  petaca: {
    id: "petaca",
    nombre: "Petaca de aguardiente",
    descripcion: "Quema al bajar y entibia al rato.",
    usos: 2,
    cura: 2,
  },
  vendas: {
    id: "vendas",
    nombre: "Vendas limpias",
    descripcion: "Hilas y un ungüento que huele a romero.",
    usos: 2,
    cura: 3,
  },
  caldo: {
    id: "caldo",
    nombre: "Caldo de Brígida",
    descripcion: "Nadie sabe qué lleva. Levanta a un muerto, dice ella.",
    usos: 1,
    cura: 4,
  },
  farol: {
    id: "farol",
    nombre: "Farol tuerto",
    descripcion: "Le falta un vidrio. Alumbra justo lo necesario.",
    usos: 2,
    bono: { atributo: "ingenio", valor: 2 },
  },
};

export const RASGOS: string[] = [
  "Valiente",
  "Curiosidad insaciable",
  "Lengua afilada",
  "Corazón blando",
  "Desconfianza crónica",
  "Superstición",
  "Terquedad",
  "Cabeza en las nubes",
];

export const SECRETOS: string[] = [
  "Hui de un juramento y otra persona pagó por mí.",
  "Algo me habla en sueños, y a veces le contesto.",
  "No soy quien digo ser: este nombre lo robé.",
  "Dejé morir a alguien que confiaba en mí.",
  "Vine a este valle buscando a una persona que nadie más recuerda.",
  "Le debo un favor a algo que no era humano.",
];

export interface Companero {
  id: CompaneroId;
  nombre: string;
  especie: string;
  descripcion: string;
  atributos: [Atributo, Atributo];
}

export const COMPANEROS: Record<CompaneroId, Companero> = {
  cuervo: {
    id: "cuervo",
    nombre: "Hollín",
    especie: "cuervo tuerto",
    descripcion: "Ve lo que otros pasan por alto y se lleva lo que brilla.",
    atributos: ["ingenio", "destreza"],
  },
  perro: {
    id: "perro",
    nombre: "Trasgo",
    especie: "perro lobero viejo",
    descripcion: "Gruñe antes de que el peligro tenga forma. No retrocede.",
    atributos: ["fuerza", "voluntad"],
  },
  gata: {
    id: "gata",
    nombre: "Ceniza",
    especie: "gata negra",
    descripcion: "Se sienta en el regazo justo y la gente empieza a hablar.",
    atributos: ["carisma", "voluntad"],
  },
};

export interface Mejora {
  id: string;
  titulo: string;
  detalle: string;
  efecto: string;
}

export const MEJORAS: Mejora[] = [
  {
    id: "hogar",
    titulo: "Encender el hogar",
    detalle: "Limpiar la chimenea y tener, por fin, un fuego propio.",
    efecto: "Empiezan el próximo capítulo con +2 de vida máxima.",
  },
  {
    id: "biblioteca",
    titulo: "Ordenar los papeles del guarda",
    detalle: "Hay décadas de apuntes bajo el polvo. Alguien llevaba la cuenta de algo.",
    efecto: "Empiezan el próximo capítulo con una pista extra.",
  },
  {
    id: "cerrojos",
    titulo: "Reforzar puertas y postigos",
    detalle: "Trancas, clavos y sal en los umbrales. Que la bruma se quede afuera.",
    efecto: "La Bruma baja 2 puntos al empezar el próximo capítulo.",
  },
];

export const ETIQUETAS_RELACION: Record<number, string> = {
  [-3]: "Hostil",
  [-2]: "Enemistado",
  [-1]: "Receloso",
  0: "Indiferente",
  1: "Cordial",
  2: "De confianza",
  3: "Aliado",
};

export const UMBRALES_AMENAZA: { valor: number; titulo: string; aviso: string }[] = [
  { valor: 4, titulo: "La Bruma se cuela", aviso: "La Bruma se cuela por las rendijas. Algo los ha notado." },
  { valor: 7, titulo: "La Bruma aprieta", aviso: "La Bruma aprieta. Todas las tiradas son un punto más difíciles." },
  {
    valor: 10,
    titulo: "La hora trece",
    aviso: "La hora trece los alcanza. Tiran con desventaja hasta que la Bruma ceda.",
  },
];

/** Atributos finales de un personaje: la base de la clase más el bono de la raza. */
export function atributosDe(razaId: string, claseId: string): Record<Atributo, number> | null {
  const raza = RAZAS.find((r) => r.id === razaId);
  const clase = CLASES.find((c) => c.id === claseId);
  if (!raza || !clase) return null;
  return { ...clase.atributos, [raza.bono]: clase.atributos[raza.bono] + 1 };
}

export const AMENAZA_MAX = 10;
export const INVENTARIO_MAX = 8;
