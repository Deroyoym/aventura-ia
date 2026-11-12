import { ESCENAS, NPCS, PISTAS, capituloDef, escenaDef, escenasDe } from "./campana";
import { COMPANEROS, ETIQUETAS_RELACION, MEJORAS, type Companero } from "./contenido";
import type { Avatar } from "./avatar";
import { RETRATOS_MAX, avatarDe, ayudasDisponibles, estaPintando, hayOtroCapitulo } from "./motor";
import {
  ASIENTOS,
  otroAsiento,
  type Asiento,
  type Entrada,
  type EstadoJuego,
  type Fase,
  type Lugar,
  type NivelTerror,
  type Objeto,
  type Opcion,
  type OpcionVoto,
  type Pendiente,
  type Personaje,
  type ResumenEscena,
  type VotoId,
} from "./tipos";

// La Vista es lo único del estado que sale del servidor. Se arma por jugador:
// el secreto ajeno, los susurros ajenos y el voto del otro no viajan nunca.

export type PersonajeVista = Omit<Personaje, "secreto" | "avatar" | "retrato"> & {
  avatar: Avatar;
  /** Retrato pintado: su dirección si existe, si se está pintando y cuántos intentos quedan. */
  retrato: { url: string | null; pintando: boolean; restantes: number };
  /** null cuando es el secreto del otro y todavía no fue revelado. */
  secreto: string | null;
};

export interface VotoVista {
  id: VotoId;
  pregunta: string;
  contexto: string;
  opciones: OpcionVoto[];
  ronda: number;
  miEleccion: string | null;
  otroVoto: boolean;
  /** Elecciones de la ronda anterior, ya reveladas porque no coincidieron. */
  anteriores: Partial<Record<Asiento, string>> | null;
}

export interface Vista {
  yo: Asiento;
  fase: Fase;
  terror: NivelTerror;
  capitulo: { numero: number; titulo: string };
  /** Si el servidor puede pintar retratos con el modelo de imágenes. */
  retratos: boolean;
  /** Si al terminar este capítulo hay otro para seguir. */
  hayOtroCapitulo: boolean;
  escena: {
    /** Posición en la lista completa de escenas de la campaña. */
    indice: number;
    /** Número de escena dentro del capítulo, desde 1. */
    numero: number;
    total: number;
    titulo: string;
    lugar: Lugar;
    avance: number;
    meta: number;
    turnos: number;
    tope: number;
  };
  escenas: { titulo: string; lugar: Lugar; capitulo: number; numero: number }[];
  farol: Asiento;
  amenaza: number;
  personajes: Partial<Record<Asiento, PersonajeVista>>;
  companero: (Companero & { usado: boolean }) | null;
  npcs: { id: string; nombre: string; rol: string; relacion: number; etiqueta: string }[];
  pistas: { id: string; titulo: string; texto: string }[];
  pistasTotales: number;
  opciones: Opcion[];
  pendiente: Pendiente | null;
  /** Ayudas que puedo sumar a mi tirada pendiente. */
  ayudas: { rasgo: boolean; companero: boolean; objetos: Objeto[] };
  voto: VotoVista | null;
  entradas: Entrada[];
  resumenes: ResumenEscena[];
  susurros: { id: number; texto: string }[];
  mejoras: { id: string; titulo: string; efecto: string }[];
  narrando: boolean;
  puedeEmpezar: boolean;
  turno: number;
  actualizado: number;
}

function personajeVista(p: Personaje, yo: Asiento, ahora: number): PersonajeVista {
  const visible = p.asiento === yo || p.secretoRevelado;
  return {
    ...p,
    avatar: avatarDe(p),
    retrato: {
      url: p.retrato?.url ?? null,
      pintando: estaPintando(p, ahora),
      restantes: Math.max(0, RETRATOS_MAX - (p.retrato?.hechos ?? 0)),
    },
    secreto: visible ? p.secreto : null,
  };
}

export function vistaPara(
  e: EstadoJuego,
  yo: Asiento,
  narrando: boolean,
  extra: { ahora?: number; retratos?: boolean } = {},
): Vista {
  const def = escenaDef(e.escena.indice);
  const otro = otroAsiento(yo);
  const capitulo = capituloDef(e.capitulo);
  const delCapitulo = escenasDe(e.capitulo);
  const numeroDe = (indice: number) => escenasDe(ESCENAS[indice].capitulo).indexOf(indice) + 1;

  const personajes: Vista["personajes"] = {};
  for (const a of ASIENTOS) {
    const p = e.personajes[a];
    if (p) personajes[a] = personajeVista(p, yo, extra.ahora ?? e.actualizado);
  }

  return {
    yo,
    fase: e.fase,
    terror: e.terror,
    capitulo: { numero: capitulo.numero, titulo: capitulo.titulo },
    hayOtroCapitulo: hayOtroCapitulo(e),
    retratos: !!extra.retratos,
    escena: {
      indice: e.escena.indice,
      numero: numeroDe(e.escena.indice),
      total: delCapitulo.length,
      titulo: def.titulo,
      lugar: def.lugar,
      avance: e.escena.avance,
      meta: def.meta,
      turnos: e.escena.turnos,
      tope: def.tope,
    },
    escenas: ESCENAS.map((s, i) => ({ titulo: s.titulo, lugar: s.lugar, capitulo: s.capitulo, numero: numeroDe(i) })),
    farol: e.farol,
    amenaza: e.amenaza,
    personajes,
    companero: e.companero ? { ...COMPANEROS[e.companero.id], usado: e.companero.usado } : null,
    npcs: NPCS.filter((n) => e.npcs[n.id]?.conocido).map((n) => ({
      id: n.id,
      nombre: n.nombre,
      rol: n.rol,
      relacion: e.npcs[n.id].relacion,
      etiqueta: ETIQUETAS_RELACION[e.npcs[n.id].relacion],
    })),
    pistas: PISTAS.filter((p) => e.pistas.includes(p.id)).map(({ id, titulo, texto }) => ({
      id,
      titulo,
      texto,
    })),
    pistasTotales: PISTAS.filter((p) => ESCENAS[p.escena].capitulo <= e.capitulo).length,
    opciones: e.opciones,
    pendiente: e.pendiente,
    ayudas: ayudasDisponibles(e, yo),
    voto: e.voto && {
      id: e.voto.id,
      pregunta: e.voto.pregunta,
      contexto: e.voto.contexto,
      opciones: e.voto.opciones,
      ronda: e.voto.ronda,
      miEleccion: e.voto.elecciones[yo] ?? null,
      otroVoto: !!e.voto.elecciones[otro],
      anteriores: e.voto.anteriores,
    },
    entradas: e.entradas,
    resumenes: e.resumenes,
    susurros: e.susurros.filter((s) => s.para === yo).map(({ id, texto }) => ({ id, texto })),
    mejoras: MEJORAS.filter((m) => e.refugio.mejoras.includes(m.id)).map(({ id, titulo, efecto }) => ({
      id,
      titulo,
      efecto,
    })),
    narrando,
    puedeEmpezar: e.fase === "preparacion" && ASIENTOS.every((a) => e.personajes[a]),
    turno: e.turno,
    actualizado: e.actualizado,
  };
}
