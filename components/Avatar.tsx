import { AVATAR, PARTES_AVATAR, colorDe, type Avatar as DatosAvatar } from "@/lib/game/avatar";

// Retrato de un personaje, dibujado por piezas en SVG. Lo elegido (piel, pelo,
// peinado, ropa y seña) se combina con lo que ponen la raza (orejas y
// complexión) y la clase (el detalle del atuendo y el emblema).

const TINTA = "#0c0d1b";
const NOCHE = "#1b1d3a";
const ORO = "#8a6f3a";

interface Cabeza {
  cy: number;
  rx: number;
  ry: number;
}

const CABEZA: Record<string, Cabeza> = {
  humano: { cy: 45, rx: 17, ry: 20 },
  elfo: { cy: 44, rx: 15, ry: 21 },
  enano: { cy: 47, rx: 20, ry: 18 },
  mediano: { cy: 47, rx: 17, ry: 17 },
  marcado: { cy: 45, rx: 16, ry: 20 },
};

/** Oscurece un color hexadecimal mezclándolo con tinta. */
function sombra(hex: string, cuanto = 0.3): string {
  const n = parseInt(hex.slice(1), 16);
  const canal = (c: number, base: number) => Math.round(c + (base - c) * cuanto);
  const r = canal((n >> 16) & 255, 12);
  const g = canal((n >> 8) & 255, 13);
  const b = canal(n & 255, 27);
  return `rgb(${r} ${g} ${b})`;
}

function Atuendo({ clase, color }: { clase: string; color: string }) {
  const oscuro = sombra(color, 0.4);
  const detalle = {
    // gola de acero
    espada: <path d="M34 73q16 13 32 0l1 7q-17 12-34 0z" fill="#9aa0b4" stroke={TINTA} strokeWidth={0.8} />,
    // cuello de piel
    montaraz: (
      <path
        d="M30 78q20-12 40 0l-3 6q-17-9-34 0z"
        fill="#6b5a45"
        stroke={TINTA}
        strokeWidth={0.8}
        strokeDasharray="2.5 1.5"
      />
    ),
    // pañuelo al cuello
    ganzua: <path d="M35 73q15 9 30 0l-2 8q-13 7-26 0zM52 80l5 12-8-4z" fill={oscuro} stroke={TINTA} strokeWidth={0.8} />,
    // cuello alto
    ocultista: <path d="M36 76l6-12 8 12 8-12 6 12-14 8z" fill={oscuro} stroke={TINTA} strokeWidth={0.8} />,
    // estola
    exorcista: <path d="M38 73l5 27h-7l-4-22zM62 73l-5 27h7l4-22z" fill="#e6dcc0" stroke={TINTA} strokeWidth={0.8} />,
    // gorguera
    juglar: (
      <path
        d="M30 78l5-5 5 5 5-6 5 6 5-6 5 6 5-5 5 5-4 5-6-4-5 5-5-5-5 5-5-5-6 4z"
        fill="#efe6cf"
        stroke={TINTA}
        strokeWidth={0.8}
      />
    ),
  }[clase];
  return (
    <>
      <path d="M12 102C14 80 33 71 50 71s36 9 38 31z" fill={color} stroke={TINTA} strokeWidth={1} />
      {detalle}
    </>
  );
}

function Emblema({ clase }: { clase: string }) {
  const glifo = {
    espada: <path d="M80 73v15M76 77h8M78.5 88h3" />,
    montaraz: <path d="M74 88l12-12M86 76h-5M86 76v5M75 84l3 3" />,
    ganzua: <path d="M77 80a3 3 0 106 0 3 3 0 10-6 0M80 83v6M80 87h3" />,
    ocultista: <path d="M73 82q7-7 14 0q-7 7-14 0zM80 80.5v3" />,
    exorcista: <path d="M80 73c3 4 3 6 0 8c-3-2-3-4 0-8zM78 83h4v6h-4z" />,
    juglar: <path d="M78 87V76l6-2v10M78 87a2 2 0 11-4 0 2 2 0 014 0zM84 84a2 2 0 11-4 0 2 2 0 014 0z" />,
  }[clase];
  if (!glifo) return null;
  return (
    <g>
      <circle cx={80} cy={81} r={11} fill="#e9dcbd" stroke={ORO} strokeWidth={1.4} />
      <g fill="none" stroke={TINTA} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {glifo}
      </g>
    </g>
  );
}

export function Avatar({
  avatar,
  raza,
  clase,
  tam = 48,
  emblema = true,
  className = "",
  titulo,
}: {
  avatar: DatosAvatar;
  raza: string;
  clase: string;
  tam?: number;
  emblema?: boolean;
  className?: string;
  /** Texto alternativo. Sin él, el retrato es decorativo. */
  titulo?: string;
}) {
  const c = CABEZA[raza] ?? CABEZA.humano;
  const piel = colorDe("piel", avatar.piel);
  const pelo = colorDe("pelo", avatar.pelo);
  const prenda = colorDe("prenda", avatar.prenda);
  const pielSombra = sombra(piel, 0.25);
  const arriba = c.cy - c.ry;
  const ojos = c.cy - 1;
  const izq = 50 - c.rx;
  const der = 50 + c.rx;
  const conPelo = avatar.peinado !== "rapado";
  const id = `av-${raza}-${clase}-${Object.values(avatar).join("-")}`;

  // Casquete de pelo sobre la frente.
  const casquete = `M${izq - 1} ${c.cy - 2}C${izq - 3} ${arriba - 9} ${der + 3} ${arriba - 9} ${der + 1} ${c.cy - 2}C${der - 4} ${arriba + 7} ${50 + 6} ${arriba + 4} 50 ${arriba + 5}C${50 - 8} ${arriba + 4} ${izq + 4} ${arriba + 8} ${izq - 1} ${c.cy - 2}Z`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={tam}
      height={tam}
      className={`shrink-0 ${className}`}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      <defs>
        <clipPath id={id}>
          <circle cx={50} cy={50} r={47} />
        </clipPath>
      </defs>
      <circle cx={50} cy={50} r={47} fill={NOCHE} />
      <g clipPath={`url(#${id})`}>
        <circle cx={50} cy={40} r={34} fill="#f5cf7f" opacity={0.1} />

        {/* lo que va detrás de la cabeza */}
        {avatar.peinado === "largo" && (
          <path d={`M${izq - 4} ${c.cy}C${izq - 8} ${arriba - 12} ${der + 8} ${arriba - 12} ${der + 4} ${c.cy}L${der + 7} 82H${izq - 7}Z`} fill={pelo} />
        )}
        {avatar.peinado === "capucha" && (
          <path d={`M${izq - 12} 84C${izq - 16} 30 36 ${arriba - 13} 50 ${arriba - 13}S${der + 16} 30 ${der + 12} 84Z`} fill={sombra(prenda, 0.25)} stroke={TINTA} strokeWidth={1} />
        )}

        <Atuendo clase={clase} color={prenda} />

        {/* cuello y orejas */}
        <path d={`M43 ${c.cy + c.ry - 6}h14v12q-7 5-14 0z`} fill={pielSombra} />
        {raza === "elfo" ? (
          <path d={`M${izq + 1} ${ojos + 3}L${izq - 9} ${ojos - 11}L${izq + 2} ${ojos - 5}ZM${der - 1} ${ojos + 3}L${der + 9} ${ojos - 11}L${der - 2} ${ojos - 5}Z`} fill={piel} stroke={TINTA} strokeWidth={0.8} />
        ) : (
          <>
            <ellipse cx={izq} cy={ojos + 2} rx={3} ry={4.5} fill={piel} stroke={TINTA} strokeWidth={0.8} />
            <ellipse cx={der} cy={ojos + 2} rx={3} ry={4.5} fill={piel} stroke={TINTA} strokeWidth={0.8} />
          </>
        )}

        {/* cara */}
        <ellipse cx={50} cy={c.cy} rx={c.rx} ry={c.ry} fill={piel} stroke={TINTA} strokeWidth={1} />
        {raza === "mediano" && (
          <g fill="#c8402f" opacity={0.22}>
            <circle cx={41} cy={c.cy + 6} r={4} />
            <circle cx={59} cy={c.cy + 6} r={4} />
          </g>
        )}

        {avatar.marca === "barba" && (
          <path
            d={`M${izq + 1} ${c.cy + 3}C${izq} ${c.cy + c.ry + 9} ${der} ${c.cy + c.ry + 9} ${der - 1} ${c.cy + 3}C${der - 5} ${c.cy + 11} 56 ${c.cy + 9} 50 ${c.cy + 9}S${izq + 5} ${c.cy + 11} ${izq + 1} ${c.cy + 3}Z`}
            fill={pelo}
            stroke={TINTA}
            strokeWidth={0.8}
          />
        )}

        {/* ojos, cejas, nariz y boca */}
        {raza === "marcado" ? (
          <g>
            <circle cx={43} cy={ojos} r={5} fill="#f5cf7f" opacity={0.3} />
            <circle cx={57} cy={ojos} r={5} fill="#f5cf7f" opacity={0.3} />
            <circle cx={43} cy={ojos} r={2.4} fill="#f8e3a8" stroke={TINTA} strokeWidth={0.6} />
            <circle cx={57} cy={ojos} r={2.4} fill="#f8e3a8" stroke={TINTA} strokeWidth={0.6} />
          </g>
        ) : (
          <g fill={TINTA}>
            <circle cx={43} cy={ojos} r={1.9} />
            <circle cx={57} cy={ojos} r={1.9} />
          </g>
        )}
        <g fill="none" stroke={TINTA} strokeLinecap="round">
          <path d={`M39 ${ojos - 5}q4-2.5 8-0.5M53 ${ojos - 5.5}q4-2 8 0.5`} strokeWidth={1.3} />
          <path d={raza === "enano" ? `M50 ${ojos + 1}q-5 8 0 9q5-1 0-9` : `M50 ${ojos + 2}q-2.5 6 0.5 7.5`} strokeWidth={1.1} />
          <path d={`M45 ${c.cy + c.ry * 0.55}q5 ${avatar.marca === "barba" ? 1.5 : 3} 10 0`} strokeWidth={1.3} />
        </g>

        {avatar.marca === "pecas" && (
          <g fill="#8a4a2f" opacity={0.7}>
            {[38, 41, 44, 56, 59, 62].map((x, i) => (
              <circle key={x} cx={x} cy={ojos + 6 + (i % 2) * 2} r={0.8} />
            ))}
          </g>
        )}
        {avatar.marca === "cicatriz" && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M60 ${ojos - 9}l-3 8 4 3-2 9`} stroke={TINTA} strokeWidth={2.6} opacity={0.55} />
            <path d={`M60 ${ojos - 9}l-3 8 4 3-2 9`} stroke="#e39a8a" strokeWidth={1.3} />
          </g>
        )}
        {avatar.marca === "parche" && (
          <g>
            <path d={`M${izq} ${ojos - 9}L${der} ${ojos - 2}`} stroke={TINTA} strokeWidth={1.6} />
            <path d={`M52 ${ojos - 4}h10v5q-5 6-10 0z`} fill={TINTA} />
          </g>
        )}

        {/* pelo por delante */}
        {conPelo && avatar.peinado !== "capucha" && <path d={casquete} fill={pelo} stroke={TINTA} strokeWidth={0.8} />}
        {avatar.peinado === "rapado" && <path d={casquete} fill={pelo} opacity={0.28} />}
        {avatar.peinado === "trenza" && (
          <g fill={pelo} stroke={TINTA} strokeWidth={0.7}>
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={der + 3 + i * 0.8} cy={c.cy + 4 + i * 6.5} rx={3.6 - i * 0.3} ry={4} />
            ))}
          </g>
        )}
        {avatar.peinado === "capucha" && (
          <>
            <path d={`M${izq} ${c.cy - 6}C${izq + 3} ${arriba + 3} ${der - 3} ${arriba + 3} ${der} ${c.cy - 6}C${der - 6} ${arriba + 9} ${izq + 6} ${arriba + 9} ${izq} ${c.cy - 6}Z`} fill={pelo} />
            <path
              d={`M${izq - 6} ${c.cy + 8}C${izq - 9} ${arriba - 4} 40 ${arriba - 9} 50 ${arriba - 9}S${der + 9} ${arriba - 4} ${der + 6} ${c.cy + 8}C${der + 2} ${arriba + 4} ${izq - 2} ${arriba + 4} ${izq - 6} ${c.cy + 8}Z`}
              fill={sombra(prenda, 0.45)}
              stroke={TINTA}
              strokeWidth={0.9}
            />
          </>
        )}
        {avatar.peinado === "sombrero" && (
          <g stroke={TINTA} strokeWidth={0.9}>
            <path d={`M${izq + 1} ${arriba + 6}C${izq + 2} ${arriba - 16} ${der - 2} ${arriba - 16} ${der - 1} ${arriba + 6}Z`} fill="#22243f" />
            <path d={`M${izq + 1.5} ${arriba + 2}h${c.rx * 2 - 3}v4h-${c.rx * 2 - 3}z`} fill={prenda} />
            <ellipse cx={50} cy={arriba + 7} rx={c.rx + 13} ry={4.5} fill="#22243f" />
          </g>
        )}
      </g>
      {emblema && <Emblema clase={clase} />}
      <circle cx={50} cy={50} r={47} fill="none" stroke={ORO} strokeWidth={2.4} />
    </svg>
  );
}

/** Las piezas del retrato para elegir: muestras de color y fichas con nombre. */
export function OpcionesAvatar({
  avatar,
  alCambiar,
}: {
  avatar: DatosAvatar;
  alCambiar: (parte: Partial<DatosAvatar>) => void;
}) {
  return (
    <>
      {PARTES_AVATAR.map((parte) => (
        <fieldset key={parte}>
          <legend className="versalitas mb-1 text-sepia">{AVATAR[parte].titulo}</legend>
          <div className="flex flex-wrap gap-1.5">
            {AVATAR[parte].opciones.map((o) =>
              o.color ? (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={avatar[parte] === o.id}
                  aria-label={o.nombre}
                  title={o.nombre}
                  onClick={() => alCambiar({ [parte]: o.id })}
                  className={`size-10 rounded-full border-2 ${
                    avatar[parte] === o.id ? "border-sangre outline outline-2 outline-offset-2 outline-sangre" : "border-sepia/50"
                  }`}
                  style={{ background: o.color }}
                />
              ) : (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={avatar[parte] === o.id}
                  onClick={() => alCambiar({ [parte]: o.id })}
                  className={`tarjeta min-h-10 px-2.5 py-1 text-[0.95rem] ${avatar[parte] === o.id ? "tarjeta-elegida" : ""}`}
                >
                  {o.nombre}
                </button>
              ),
            )}
          </div>
        </fieldset>
      ))}
    </>
  );
}
