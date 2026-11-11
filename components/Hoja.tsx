import { CLASES, DESCRIPCION_ATRIBUTO, NOMBRE_ATRIBUTO, RAZAS } from "@/lib/game/contenido";
import { ATRIBUTOS, type Atributo, type Objeto } from "@/lib/game/tipos";
import type { PersonajeVista } from "@/lib/game/vista";
import { Vida } from "./ui";

// Piezas para mostrar un personaje: sus atributos, su ficha corta y sus objetos.

const ABREVIATURA: Record<Atributo, string> = {
  fuerza: "Fue",
  destreza: "Des",
  ingenio: "Ing",
  voluntad: "Vol",
  carisma: "Car",
};

export const conSigno = (n: number): string => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0");

export const nombreRaza = (id: string): string => RAZAS.find((r) => r.id === id)?.nombre ?? id;
export const nombreClase = (id: string): string => CLASES.find((c) => c.id === id)?.nombre ?? id;

export function Atributos({ atributos }: { atributos: Record<Atributo, number> }) {
  return (
    <dl className="grid grid-cols-5 gap-1.5 text-center">
      {ATRIBUTOS.map((a) => (
        <div
          key={a}
          className="rounded-md border border-sepia/40 bg-[#fff8ea66] px-1 py-1.5"
          title={`${NOMBRE_ATRIBUTO[a]}: ${DESCRIPCION_ATRIBUTO[a]}`}
        >
          <dt className="versalitas text-[0.68rem] text-sepia">
            <abbr title={NOMBRE_ATRIBUTO[a]} className="no-underline">
              {ABREVIATURA[a]}
            </abbr>
          </dt>
          <dd className={`titulo text-xl tabular-nums ${atributos[a] >= 3 ? "text-sangre" : ""}`}>
            {conSigno(atributos[a])}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function FichaCorta({
  personaje,
  etiqueta,
  accion,
}: {
  personaje: PersonajeVista;
  etiqueta: string;
  accion?: React.ReactNode;
}) {
  return (
    <div className="tarjeta flex items-center justify-between gap-3 px-3 py-2.5">
      <div className="min-w-0">
        <p className="versalitas text-sepia">{etiqueta}</p>
        <p className="titulo truncate text-xl">{personaje.nombre}</p>
        <p className="truncate text-[0.95rem] italic text-sepia">
          {nombreRaza(personaje.raza)} · {nombreClase(personaje.clase)}
        </p>
      </div>
      <div className="shrink-0 text-right text-[0.95rem]">
        <Vida vida={personaje.vida} max={personaje.vidaMax} />
        {accion && <div className="mt-1">{accion}</div>}
      </div>
    </div>
  );
}

export function efectoDe(o: Objeto): string | null {
  if (o.bono) return `+${o.bono.valor} a ${NOMBRE_ATRIBUTO[o.bono.atributo]}`;
  if (o.cura) return `Cura ${o.cura}`;
  return null;
}

export function usosDe(o: Objeto): string | null {
  if (o.usos === undefined) return null;
  if (o.usos <= 0) return "agotado";
  return o.usos === 1 ? "1 uso" : `${o.usos} usos`;
}
