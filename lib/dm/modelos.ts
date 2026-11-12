import type { Fallo } from "./reintentos";

// Elige entre el modelo principal y uno de respaldo opcional. Si el principal
// se queda sin cuota o está saturado, se usa el respaldo por un rato en vez de
// hacer esperar a los jugadores.

const PAUSA_CORTA_MS = 5 * 60 * 1000;
const PAUSA_LARGA_MS = 6 * 60 * 60 * 1000;

export interface SelectorDeModelo {
  actual(): string;
  /** Pasa al respaldo si el fallo lo justifica. Devuelve true si hay que reintentar ya con el otro modelo. */
  degradar(fallo: Fallo): boolean;
}

export function crearSelector(principal: string, respaldo: string, reloj: () => number = Date.now): SelectorDeModelo {
  let hasta = 0;
  const hayRespaldo = !!respaldo && respaldo !== principal;
  const enRespaldo = () => hayRespaldo && reloj() < hasta;
  return {
    actual: () => (enRespaldo() ? respaldo : principal),
    degradar(fallo) {
      if (!hayRespaldo || enRespaldo()) return false;
      if (fallo.codigo === "cuota" || fallo.codigo === "sin_cuota") hasta = reloj() + PAUSA_LARGA_MS;
      else if (fallo.codigo === "limite" || fallo.codigo === "servidor") hasta = reloj() + PAUSA_CORTA_MS;
      else return false;
      return true;
    },
  };
}
