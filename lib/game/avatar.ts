// Retrato de un personaje: unas pocas piezas a elegir. La raza y la clase
// ponen el resto (orejas, complexión, atuendo), así que no se guardan acá.

export interface Avatar {
  piel: string;
  pelo: string;
  peinado: string;
  prenda: string;
  marca: string;
}

export interface OpcionAvatar {
  id: string;
  nombre: string;
  /** Color de muestra, cuando la opción es un color. */
  color?: string;
}

export const AVATAR: Record<keyof Avatar, { titulo: string; opciones: OpcionAvatar[] }> = {
  piel: {
    titulo: "piel",
    opciones: [
      { id: "palida", nombre: "Pálida", color: "#f0d9c4" },
      { id: "clara", nombre: "Clara", color: "#e3bf9f" },
      { id: "triguena", nombre: "Trigueña", color: "#c99873" },
      { id: "morena", nombre: "Morena", color: "#9a6a48" },
      { id: "oscura", nombre: "Oscura", color: "#6b4631" },
      { id: "ceniza", nombre: "Ceniza", color: "#b9b6c4" },
    ],
  },
  pelo: {
    titulo: "pelo",
    opciones: [
      { id: "negro", nombre: "Negro", color: "#17151c" },
      { id: "castano", nombre: "Castaño", color: "#5a3a24" },
      { id: "cobre", nombre: "Cobre", color: "#a4532a" },
      { id: "rubio", nombre: "Rubio", color: "#d2a856" },
      { id: "cano", nombre: "Cano", color: "#cfcfd6" },
      { id: "ciruela", nombre: "Ciruela", color: "#5b2f5e" },
    ],
  },
  peinado: {
    titulo: "peinado",
    opciones: [
      { id: "corto", nombre: "Corto" },
      { id: "largo", nombre: "Largo" },
      { id: "trenza", nombre: "Trenza" },
      { id: "rapado", nombre: "Rapado" },
      { id: "capucha", nombre: "Capucha" },
      { id: "sombrero", nombre: "Sombrero" },
    ],
  },
  prenda: {
    titulo: "ropa",
    opciones: [
      { id: "sangre", nombre: "Granate", color: "#8d2f2a" },
      { id: "cardenillo", nombre: "Cardenillo", color: "#2f7a6d" },
      { id: "ambar", nombre: "Ámbar", color: "#b97c24" },
      { id: "ciruela", nombre: "Ciruela", color: "#56305f" },
      { id: "bruma", nombre: "Azul bruma", color: "#5b6190" },
      { id: "hueso", nombre: "Hueso", color: "#b9ad8f" },
    ],
  },
  marca: {
    titulo: "seña",
    opciones: [
      { id: "ninguna", nombre: "Ninguna" },
      { id: "cicatriz", nombre: "Cicatriz" },
      { id: "parche", nombre: "Parche" },
      { id: "pecas", nombre: "Pecas" },
      { id: "barba", nombre: "Barba" },
    ],
  },
};

export const PARTES_AVATAR = Object.keys(AVATAR) as (keyof Avatar)[];

const valida = (parte: keyof Avatar, id: unknown): id is string =>
  typeof id === "string" && AVATAR[parte].opciones.some((o) => o.id === id);

/** Retrato estable para un personaje que todavía no eligió el suyo. */
export function avatarPorDefecto(semilla: string): Avatar {
  let h = 2166136261;
  for (let i = 0; i < semilla.length; i++) h = Math.imul(h ^ semilla.charCodeAt(i), 16777619) >>> 0;
  const elegir = (parte: keyof Avatar, salto: number) => {
    // La piel ceniza y las señas se eligen a mano, no por defecto.
    const opciones = AVATAR[parte].opciones.filter((o) => o.id !== "ceniza");
    return parte === "marca" ? "ninguna" : opciones[(h >>> salto) % opciones.length].id;
  };
  return {
    piel: elegir("piel", 0),
    pelo: elegir("pelo", 5),
    peinado: elegir("peinado", 10),
    prenda: elegir("prenda", 15),
    marca: elegir("marca", 20),
  };
}

/** Deja solo opciones que existen; lo que falte o no valga sale del retrato por defecto. */
export function normalizarAvatar(dato: unknown, semilla: string): Avatar {
  const base = avatarPorDefecto(semilla);
  if (!dato || typeof dato !== "object") return base;
  const entrada = dato as Record<string, unknown>;
  const salida = { ...base };
  for (const parte of PARTES_AVATAR) if (valida(parte, entrada[parte])) salida[parte] = entrada[parte];
  return salida;
}

export function avatarAlAzar(azar: () => number = Math.random): Avatar {
  const elegir = (parte: keyof Avatar) => {
    const opciones = AVATAR[parte].opciones;
    return opciones[Math.floor(azar() * opciones.length)].id;
  };
  return { piel: elegir("piel"), pelo: elegir("pelo"), peinado: elegir("peinado"), prenda: elegir("prenda"), marca: elegir("marca") };
}

export const colorDe = (parte: keyof Avatar, id: string): string =>
  AVATAR[parte].opciones.find((o) => o.id === id)?.color ?? "#888";
