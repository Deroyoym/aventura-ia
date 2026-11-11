import type { Atributo, Dificultad, Resultado, Tirada } from "./tipos";

/** Generador en [0, 1). El servidor inyecta uno criptográfico; los tests, uno fijo. */
export type Rng = () => number;

export const d20 = (rng: Rng): number => 1 + Math.floor(rng() * 20);

/** Cuánto por debajo de la CD todavía cuenta como éxito con costo. */
const MARGEN_COSTO = 2;

export function clasificar(dado: number, total: number, cd: number): Resultado {
  if (dado === 20) return "critico";
  if (dado === 1) return "pifia";
  if (total >= cd) return "exito";
  if (total >= cd - MARGEN_COSTO) return "costo";
  return "fallo";
}

export function resolverTirada(
  p: {
    atributo: Atributo;
    dificultad: Dificultad;
    cd: number;
    modificador: number;
    bono: number;
    ventaja: boolean;
    desventaja: boolean;
    ayudas: string[];
  },
  rng: Rng,
): Tirada {
  // Ventaja y desventaja se anulan entre sí.
  const modo: Tirada["modo"] =
    p.ventaja === p.desventaja ? "normal" : p.ventaja ? "ventaja" : "desventaja";
  const dados = modo === "normal" ? [d20(rng)] : [d20(rng), d20(rng)];
  const dado = modo === "desventaja" ? Math.min(...dados) : Math.max(...dados);
  const total = dado + p.modificador + p.bono;
  return {
    atributo: p.atributo,
    dificultad: p.dificultad,
    cd: p.cd,
    dados,
    dado,
    modificador: p.modificador,
    bono: p.bono,
    total,
    modo,
    resultado: clasificar(dado, total, p.cd),
    ayudas: p.ayudas,
  };
}

export const AVANCE_POR_RESULTADO: Record<Resultado, number> = {
  critico: 2,
  exito: 1,
  costo: 1,
  fallo: 0,
  pifia: 0,
};
