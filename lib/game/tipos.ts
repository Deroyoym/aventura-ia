// Tipos del dominio. Todo el estado de una partida es un único documento JSON
// (EstadoJuego) que vive en el servidor; el cliente solo recibe una Vista filtrada.

export type Asiento = 1 | 2;
export const ASIENTOS: readonly Asiento[] = [1, 2];
export const otroAsiento = (a: Asiento): Asiento => (a === 1 ? 2 : 1);

export type Atributo = "fuerza" | "destreza" | "ingenio" | "voluntad" | "carisma";
export const ATRIBUTOS: readonly Atributo[] = [
  "fuerza",
  "destreza",
  "ingenio",
  "voluntad",
  "carisma",
];

export type Enfoque = "combate" | "ingenio" | "dialogo";
export const ENFOQUES: readonly Enfoque[] = ["combate", "ingenio", "dialogo"];

export type Dificultad = "facil" | "media" | "dificil" | "heroica";
export const DIFICULTADES: readonly Dificultad[] = ["facil", "media", "dificil", "heroica"];

export type NivelTerror = "suave" | "media" | "fuerte";
export const NIVELES_TERROR: readonly NivelTerror[] = ["suave", "media", "fuerte"];

export type Resultado = "critico" | "exito" | "costo" | "fallo" | "pifia";

export type Lugar = "posada" | "cuarto" | "plaza" | "campanario" | "refugio" | "linde" | "bruma" | "espejo";

export type CompaneroId = "cuervo" | "perro" | "gata";
export type VotoId = "companero" | "dilema" | "mejora" | "ancla" | "regreso";

export interface Objeto {
  id: string;
  nombre: string;
  descripcion: string;
  /** Usos restantes; ausente = objeto narrativo sin efecto mecánico. */
  usos?: number;
  /** Suma a una tirada del atributo indicado al gastar un uso. */
  bono?: { atributo: Atributo; valor: number };
  /** Vida que recupera al gastar un uso. */
  cura?: number;
}

export interface Personaje {
  asiento: Asiento;
  nombre: string;
  raza: string;
  clase: string;
  rasgo: string;
  secreto: string;
  atributos: Record<Atributo, number>;
  vida: number;
  vidaMax: number;
  inventario: Objeto[];
  /** El rasgo da ventaja una vez por capítulo. */
  rasgoUsado: boolean;
  /** En 0 de vida: fuera de juego hasta que cierre la escena. */
  quebrado: boolean;
  secretoRevelado: boolean;
}

export interface TiradaPedida {
  atributo: Atributo;
  dificultad: Dificultad;
}

export interface Opcion {
  id: string;
  texto: string;
  enfoque: Enfoque;
  tirada: TiradaPedida | null;
  /** Si la acción acerca al grupo a resolver la escena. */
  avanza: boolean;
}

export interface Tirada {
  atributo: Atributo;
  dificultad: Dificultad;
  cd: number;
  /** Uno o dos d20 (ventaja / desventaja). */
  dados: number[];
  /** El dado que cuenta. */
  dado: number;
  modificador: number;
  bono: number;
  total: number;
  modo: "normal" | "ventaja" | "desventaja";
  resultado: Resultado;
  /** Qué ayudas se usaron, para mostrar en pantalla. */
  ayudas: string[];
}

export type Pendiente =
  | { tipo: "inicio" }
  | {
      tipo: "accion";
      asiento: Asiento;
      texto: string;
      enfoque: Enfoque;
      pedida: TiradaPedida | null;
      cd: number | null;
      avanza: boolean;
      tirada: Tirada | null;
    }
  | { tipo: "voto"; votoId: VotoId; opcionId: string };

export interface OpcionVoto {
  id: string;
  titulo: string;
  detalle: string;
}

export interface Voto {
  id: VotoId;
  pregunta: string;
  contexto: string;
  opciones: OpcionVoto[];
  elecciones: Partial<Record<Asiento, string>>;
  ronda: number;
  /** Lo que eligió cada uno en la ronda anterior, si no coincidieron. */
  anteriores: Partial<Record<Asiento, string>> | null;
}

export type Entrada =
  | { id: number; tipo: "escena"; escena: number }
  | { id: number; tipo: "narracion"; texto: string }
  | { id: number; tipo: "accion"; asiento: Asiento; texto: string; enfoque: Enfoque }
  | { id: number; tipo: "tirada"; asiento: Asiento; tirada: Tirada }
  | { id: number; tipo: "sistema"; texto: string; tono: "bien" | "mal" | "neutro" };

/** `Omit` que se reparte sobre cada miembro de una unión. */
export type SinId<T> = T extends unknown ? Omit<T, "id"> : never;

export interface Susurro {
  id: number;
  para: Asiento;
  texto: string;
}

export interface ResumenEscena {
  capitulo: number;
  escena: number;
  titulo: string;
  texto: string;
}

export type Fase = "preparacion" | "jugando" | "fin_capitulo";

export interface EstadoJuego {
  fase: Fase;
  terror: NivelTerror;
  capitulo: number;
  personajes: Partial<Record<Asiento, Personaje>>;
  escena: {
    indice: number;
    avance: number;
    turnos: number;
    /** Avances conseguidos sin tirada en esta escena. */
    libres: number;
  };
  /** Quién decide la próxima acción. */
  farol: Asiento;
  amenaza: number;
  pistas: string[];
  npcs: Record<string, { relacion: number; conocido: boolean }>;
  companero: { id: CompaneroId; usado: boolean } | null;
  refugio: { mejoras: string[] };
  /** Elección tomada en cada voto ya resuelto. */
  decisiones: Partial<Record<VotoId, string>>;
  opciones: Opcion[];
  pendiente: Pendiente | null;
  voto: Voto | null;
  entradas: Entrada[];
  resumenes: ResumenEscena[];
  susurros: Susurro[];
  /** Hechos sueltos que el máster quiere recordar. */
  memoria: string[];
  /** Avisos del código para la próxima narración (p. ej. un umbral de amenaza). */
  eventos: string[];
  /** Marca de tiempo (ms) mientras el máster está narrando; sirve de bloqueo. */
  narrando: number | null;
  turno: number;
  secuencia: number;
  actualizado: number;
}

/** Lo que devuelve el modelo, ya validado y con forma estable. */
export interface SalidaDM {
  narracion: string;
  opciones: Opcion[];
  cambios: {
    vida: { jugador: Asiento; delta: number }[];
    amenaza: number;
    relaciones: { npc: string; delta: number }[];
    pistas: string[];
    inventario: {
      jugador: Asiento;
      accion: "agregar" | "quitar";
      objeto: string;
      descripcion: string;
    }[];
    secretoRevelado: Asiento[];
    memoria: string[];
  };
  susurros: { jugador: Asiento; texto: string }[];
  resumenEscena: string;
}

/** Lo que el código decide antes de pedir la narración. */
export interface Plan {
  tipo: "apertura" | "accion" | "tras_voto";
  resultado: Resultado | null;
  avance: number;
  cierra: boolean;
  motivoCierre: "resuelta" | "agotada" | null;
  /** Qué sigue al cierre de la escena. */
  siguiente: "escena" | "voto" | null;
  amenazaForzada: number;
  /** Índice de la escena que esta narración debe abrir, si abre alguna. */
  abre: number | null;
  eventos: string[];
}

export class ErrorJuego extends Error {
  constructor(
    public codigo: string,
    mensaje: string,
    public estado = 400,
  ) {
    super(mensaje);
    this.name = "ErrorJuego";
  }
}
