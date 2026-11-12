import type { ReactNode } from "react";
import type { Lugar } from "@/lib/game/tipos";

// Viñetas de cada locación, dibujadas a mano en SVG: siluetas contra un cielo
// nocturno, con una sola luz cálida. Van dentro de un marco en arco.

const TINTA = "#0c0d1b";
const VELA = "#f0b24a";
const HILO = "#c8402f";

function Luna({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill="#f3e6b8" opacity={0.07} />
      <circle cx={x} cy={y} r={r * 1.5} fill="#f3e6b8" opacity={0.1} />
      <circle cx={x} cy={y} r={r} fill="#f1e4b6" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.22} fill="#d9c98f" opacity={0.6} />
      <circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.15} fill="#d9c98f" opacity={0.5} />
    </g>
  );
}

function Niebla({ y, opacidad = 0.3 }: { y: number; opacidad?: number }) {
  return (
    <g filter="url(#difuso)" opacity={opacidad} fill="#c9cbe8">
      <ellipse cx={70} cy={y} rx={110} ry={11} />
      <ellipse cx={230} cy={y + 8} rx={120} ry={12} />
      <ellipse cx={160} cy={y + 16} rx={170} ry={10} />
    </g>
  );
}

function Luz({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="url(#halo)" />;
}

function Posada() {
  return (
    <>
      <Luna x={248} y={40} r={13} />
      {/* lluvia */}
      <g stroke="#c9cbe8" strokeWidth={0.7} opacity={0.22}>
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M${14 + i * 14} ${(i * 37) % 70}l-7 22`} />
        ))}
      </g>
      <g fill={TINTA}>
        <path d="M0 150h320v40H0z" />
        {/* cuerpo y techo */}
        <path d="M78 150V96l62-40 62 40v54z" />
        <path d="M68 100l72-48 72 48-6 6-66-43-66 43z" />
        <path d="M168 62V40h14v32z" />
        {/* ala baja */}
        <path d="M202 150v-34l44-12v46z" />
        {/* brazo del farol */}
        <path d="M78 104H52v3h26zM54 107v10h2v-10z" />
      </g>
      {/* humo */}
      <path d="M175 38c-6-8 6-12 0-20s6-10 2-16" stroke="#c9cbe8" strokeWidth={2} fill="none" opacity={0.25} strokeLinecap="round" />
      {/* ventanas y puerta */}
      <g fill={VELA}>
        <rect x={94} y={108} width={14} height={18} rx={1} />
        <rect x={172} y={108} width={14} height={18} rx={1} />
        <rect x={133} y={84} width={14} height={14} rx={1} opacity={0.75} />
        <path d="M130 150v-26a10 10 0 0120 0v26z" opacity={0.9} />
        <rect x={216} y={124} width={12} height={12} rx={1} opacity={0.6} />
      </g>
      <Luz x={101} y={117} r={20} />
      <Luz x={179} y={117} r={20} />
      <Luz x={140} y={136} r={24} />
      {/* el farol tuerto: un vidrio encendido, el otro oscuro */}
      <rect x={49} y={117} width={12} height={15} rx={2} fill={TINTA} />
      <rect x={51} y={119} width={4} height={11} fill={VELA} />
      <Luz x={53} y={124} r={16} />
      <Niebla y={158} opacidad={0.28} />
    </>
  );
}

function Cuarto() {
  return (
    <>
      {/* pasillo en perspectiva */}
      <path d="M0 0h320v190H0z" fill="#15172f" />
      <path d="M0 190L104 128h112l104 62z" fill="#0f1022" />
      <path d="M104 40h112v88H104z" fill="#1c1f40" />
      <path d="M0 0l104 40v88L0 190zM320 0L216 40v88l104 62z" fill="#121430" />
      {/* puertas a la izquierda */}
      <g fill={TINTA}>
        <path d="M16 62l26 10v84l-26 14z" />
        <path d="M70 80l20 7v58l-20 10z" />
        <path d="M304 62l-26 10v84l26 14z" />
        <path d="M250 80l-20 7v58l20 10z" />
      </g>
      {/* la puerta que nadie ve: apenas un contorno pálido */}
      <path d="M140 62h40v66h-40z" fill="#c9cbe8" opacity={0.06} />
      <path d="M140 62h40v66h-40z" fill="none" stroke="#c9cbe8" strokeWidth={1} strokeDasharray="3 4" opacity={0.55} />
      <circle cx={173} cy={97} r={1.6} fill="#c9cbe8" opacity={0.7} />
      {/* rendija de luz bajo la puerta */}
      <path d="M141 128h38l10 18h-58z" fill="url(#halo)" opacity={0.5} />
      <rect x={141} y={126} width={38} height={2} fill={VELA} opacity={0.8} />
      {/* caballito de madera */}
      <g fill={TINTA} transform="translate(196 138)">
        <path d="M2 14c6 5 20 5 26 0l-2-2c-6 4-16 4-22 0z" />
        <path d="M7 12V5h14v7h-3V8h-8v4zM19 5l3-6 4 1-2 5z" />
      </g>
      {/* vela en el suelo */}
      <rect x={96} y={150} width={4} height={10} fill="#e9dcc0" />
      <path d="M98 142c2 2 2.4 4 0 8-2.4-4-2-6 0-8z" fill={VELA} />
      <Luz x={98} y={148} r={26} />
      <Niebla y={176} opacidad={0.16} />
    </>
  );
}

function Plaza() {
  return (
    <>
      <Luna x={64} y={36} r={12} />
      {/* caserío al fondo */}
      <g fill="#161832">
        <path d="M0 132l18-18 18 18v-10l16-16 20 20v-22l14-14 14 14v28H0z" />
        <path d="M220 132v-26l16-16 16 16v10l18-18 18 18v-14l16-14 16 14v30z" />
      </g>
      {/* iglesia y campanario */}
      <g fill={TINTA}>
        <path d="M132 150V92l20-18 20 18v58z" />
        <path d="M172 150V50l12-22 12 22v100z" />
        <path d="M183 28v-12h2v12zM179 20h10v2h-10z" />
        <path d="M0 150h320v40H0z" />
      </g>
      <path d="M180 62a4 4 0 018 0v12h-8z" fill={VELA} opacity={0.85} />
      <Luz x={184} y={68} r={18} />
      {/* aljibe */}
      <g fill={TINTA}>
        <path d="M70 150v-14h36v14z" />
        <path d="M72 136v-22h3v22zM101 136v-22h3v22zM68 114l20-10 20 10v3H68z" />
      </g>
      {/* linternas de la ronda */}
      {[236, 262, 284].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 3} 150v-20a3 3 0 016 0v20z`} fill={TINTA} />
          <circle cx={x + 6} cy={138 - i} r={2.2} fill={VELA} />
          <Luz x={x + 6} y={138 - i} r={11} />
        </g>
      ))}
      {/* los ausentes: figuras quietas, sin rostro */}
      <g fill="#c9cbe8" opacity={0.3} filter="url(#difuso-suave)">
        {[18, 34, 126, 302].map((x) => (
          <path key={x} d={`M${x - 5} 152v-16a5 5 0 0110 0v16zM${x - 3.5} 127a3.5 3.5 0 107 0 3.5 3.5 0 10-7 0z`} />
        ))}
      </g>
      <Niebla y={154} opacidad={0.34} />
    </>
  );
}

function Campanario() {
  return (
    <>
      <Luna x={206} y={58} r={34} />
      {/* pájaros */}
      <g stroke={TINTA} strokeWidth={1.4} fill="none" strokeLinecap="round">
        <path d="M70 46q5-5 9 0q4-5 9 0M96 30q4-4 7 0q3-4 7 0M250 96q4-4 7 0q3-4 7 0" />
      </g>
      <g fill={TINTA}>
        {/* torre */}
        <path d="M128 190V70h56v120z" />
        <path d="M120 72l36-46 36 46z" />
        <path d="M154 26V10h4v16zM148 16h16v3h-16z" />
        <path d="M122 96h68v6h-68z" />
        {/* techos del pueblo */}
        <path d="M0 190v-30l22-16 22 16v-8l20-14 20 14v-10l22-14 22 14v48z" />
        <path d="M184 190v-40l24-16 24 16v-10l22-14 22 14v-8l22-14 22 14v58z" />
      </g>
      {/* arco del campanario con la campana sin badajo */}
      <path d="M140 96V82a16 16 0 0132 0v14z" fill="#262a55" />
      <path d="M149 94c0-2 2-3 2-8a5 5 0 0110 0c0 5 2 6 2 8z" fill={TINTA} />
      <path d="M155 79v-4h2v4z" fill={TINTA} />
      <circle cx={166} cy={92} r={1.8} fill={VELA} />
      <Luz x={166} y={92} r={15} />
      <rect x={150} y={120} width={12} height={20} rx={6} fill="#1a1c3a" />
      <Niebla y={166} opacidad={0.36} />
    </>
  );
}

function Refugio() {
  return (
    <>
      {/* amanecer gris */}
      <path d="M0 96h320v94H0z" fill="url(#alba)" opacity={0.75} />
      <circle cx={250} cy={112} r={30} fill="#e9c9a0" opacity={0.16} />
      <g fill={TINTA}>
        <path d="M0 190v-44c40-14 90-18 140-12s120 14 180 2v54z" />
        {/* casa */}
        <path d="M112 142V98l40-24 40 24v44z" />
        <path d="M104 100l48-30 48 30-5 6-43-27-43 27z" />
        <path d="M172 80V62h10v24z" />
        {/* árbol seco */}
        <path d="M52 146c2-22 0-40-2-56l4-1c1 8 2 14 3 20l10-16 3 2-12 22c1 10 1 20 0 29z" />
        <path d="M50 96L38 80l3-2 10 13zM56 104l12-6 1 3-12 7zM44 110l-12-4 1-3 12 4z" />
        {/* cerca */}
        <path d="M214 150v-16h3v16zM232 152v-16h3v16zM250 152v-16h3v16zM268 150v-16h3v16zM210 140h64v2h-64z" />
      </g>
      <rect x={126} y={110} width={13} height={15} rx={1} fill={VELA} />
      <path d="M150 142v-20a8 8 0 0116 0v20z" fill="#1a1c3a" />
      <Luz x={132} y={117} r={22} />
      <Niebla y={160} opacidad={0.3} />
    </>
  );
}

function Linde() {
  return (
    <>
      <Luna x={84} y={56} r={22} />
      <g fill={TINTA}>
        <path d="M0 190v-38c50-10 110-12 170-8l150 6v40z" />
        {/* la última casa, torcida */}
        <path d="M52 150l4-46 46-2 6 48z" />
        <path d="M44 106l34-26 38 22-4 6-34-19-30 22z" />
        <path d="M92 90l1-18h8l1 24z" />
        {/* espino con cabos */}
        <path d="M168 152c1-18-1-32-4-46l4-1c2 7 3 13 4 18l9-18 3 2-10 22c1 8 1 16 0 23z" />
        <path d="M166 112l-14-12 2-3 13 10zM174 118l14-8 2 3-14 9zM162 124l-13-2 1-3 13 2z" />
      </g>
      <rect x={66} y={118} width={11} height={13} rx={1} fill={VELA} />
      <Luz x={71} y={124} r={20} />
      {/* el hilo rojo: del umbral al espino y hacia la bruma */}
      <path d="M88 146c26 8 50-4 66-30M154 116c40 20 90 26 166 22" fill="none" stroke={HILO} strokeWidth={1.6} strokeLinecap="round" />
      <g stroke={HILO} strokeWidth={1.4} strokeLinecap="round">
        <path d="M152 100v8M188 110v9M150 122v7" />
      </g>
      <circle cx={88} cy={146} r={5} fill={HILO} />
      {/* la bruma como pared */}
      <rect x={214} y={0} width={110} height={190} fill="#d9d2e6" opacity={0.2} filter="url(#difuso)" />
      <Niebla y={150} opacidad={0.5} />
    </>
  );
}

function Bruma() {
  return (
    <>
      <rect width={320} height={190} fill="#b9b3cf" opacity={0.2} />
      {/* figuras sin rostro */}
      <g fill={TINTA} opacity={0.5} filter="url(#difuso-suave)">
        <path d="M60 176v-44c0-10 4-14 4-22a9 9 0 0118 0c0 8 4 12 4 22v44z" />
        <path d="M224 170v-36c0-8 3-12 3-18a7 7 0 0114 0c0 6 3 10 3 18v36z" />
        <path d="M268 164v-26c0-6 2-9 2-13a5 5 0 0110 0c0 4 2 7 2 13v26z" opacity={0.7} />
      </g>
      <g fill={TINTA} opacity={0.85}>
        <path d="M132 184v-52c0-12 5-17 5-27a11 11 0 0122 0c0 10 5 15 5 27v52z" />
        {/* la escoba */}
        <path d="M168 128l22 52-3 2-22-52z" />
        <path d="M184 176l12 10-14 2z" />
      </g>
      {/* el hilo, lo único con color */}
      <path d="M-4 150c50-16 92 10 140-6s110-34 190-14" fill="none" stroke={HILO} strokeWidth={1.8} strokeLinecap="round" />
      <Niebla y={108} opacidad={0.4} />
      <Niebla y={168} opacidad={0.55} />
    </>
  );
}

function Espejo() {
  const ventanas = [
    [22, 132], [44, 132], [70, 118], [96, 126], [118, 140], [196, 138], [218, 122], [244, 130], [268, 116], [292, 134],
  ];
  return (
    <>
      <g fill={TINTA}>
        <path d="M0 190v-66l16-12 16 12v-6l20-16 20 16v-22l22-16 22 16v40l14-8v62z" />
        <path d="M184 190v-58l16-10 16 10v-24l22-16 22 16v10l20-14 20 14v-18l20-12v102z" />
        {/* la posada del reflejo */}
        <path d="M130 190v-74l30-22 30 22v74z" />
        <path d="M124 118l36-28 36 28-4 5-32-24-32 24z" />
      </g>
      {ventanas.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={9} height={11} rx={1} fill={VELA} />
          <Luz x={x + 4} y={y + 5} r={13} />
        </g>
      ))}
      <rect x={140} y={124} width={11} height={13} rx={1} fill={VELA} />
      <rect x={169} y={124} width={11} height={13} rx={1} fill={VELA} />
      <path d="M152 190v-30a8 8 0 0116 0v30z" fill={VELA} opacity={0.85} />
      <Luz x={160} y={150} r={40} />
      {/* una chica en la puerta, de espaldas a la luz */}
      <path d="M156 190v-18c0-3 1-4 1-7a3.5 3.5 0 017 0c0 3 1 4 1 7v18z" fill={TINTA} />
      <Niebla y={174} opacidad={0.5} />
    </>
  );
}

function Cripta() {
  // Siete tumbas en círculo, vistas desde la escalera: seis abiertas, una cerrada.
  const tumbas = [
    [44, 150, 1], [84, 128, 0.85], [128, 116, 0.75], [176, 114, 0.75], [222, 126, 0.85], [262, 148, 1],
  ] as const;
  return (
    <>
      <rect width={320} height={190} fill="#0b0c1a" opacity={0.72} />
      {/* bóvedas */}
      <g fill="none" stroke="#3a3c66" strokeWidth={2.2} opacity={0.8}>
        <path d="M0 96C30 30 90 20 110 96M105 96C130 26 190 26 215 96M210 96C230 20 290 30 320 96" />
      </g>
      <g fill={TINTA}>
        <path d="M0 190v-36h320v36z" />
        <path d="M104 190V92h8v98zM208 190V92h8v98z" />
      </g>
      {tumbas.map(([x, y, e]) => (
        <g key={x}>
          <path d={`M${x - 16 * e} ${y}h${32 * e}l${4 * e} ${14 * e}h-${40 * e}z`} fill="#23254a" stroke={TINTA} strokeWidth={1} />
          <path d={`M${x - 12 * e} ${y + 2}h${24 * e}l${2.5 * e} ${9 * e}h-${29 * e}z`} fill="#05060f" />
          <circle cx={x} cy={y + 5 * e} r={1.6 * e} fill={VELA} />
          <Luz x={x} y={y + 5 * e} r={10 * e} />
        </g>
      ))}
      {/* la séptima, cerrada y sin nombre */}
      <path d="M134 150h52l6 22h-64z" fill="#4a4c7a" stroke={TINTA} strokeWidth={1.2} />
      <path d="M140 154h40l3 12h-46z" fill="#5b5d8c" />
      {/* la grieta por donde sube la bruma */}
      <path d="M150 190l6-10-4-6 8-4" stroke="#c9cbe8" strokeWidth={1.4} fill="none" opacity={0.5} />
      <Niebla y={172} opacidad={0.42} />
    </>
  );
}

function Umbral() {
  const figuras = [40, 78, 112, 208, 242, 280];
  return (
    <>
      <rect width={320} height={190} fill="#0b0c1a" opacity={0.78} />
      <path d="M0 190v-30c60-14 260-14 320 0v30z" fill={TINTA} />
      {/* la puerta sin pared */}
      <ellipse cx={160} cy={110} rx={54} ry={74} fill="#c9cbe8" opacity={0.12} filter="url(#difuso)" />
      <path d="M132 168V84a28 28 0 0156 0v84z" fill="#d9d2e6" opacity={0.3} />
      <path d="M138 168V86a22 22 0 0144 0v82z" fill="#eeeaf6" opacity={0.28} filter="url(#difuso-suave)" />
      <path d="M126 170V84a34 34 0 0168 0v86h-8V84a26 26 0 00-52 0v86z" fill="#2c2e55" stroke={TINTA} strokeWidth={1.2} />
      {/* la ordenanza en el dintel */}
      <path d="M150 56h20v9h-20z" fill="#d9c79a" stroke={TINTA} strokeWidth={0.8} />
      <path d="M153 59h14M153 62h9" stroke={HILO} strokeWidth={0.9} />
      {/* los seis fundadores */}
      <g fill="#2a2c52" stroke={TINTA} strokeWidth={0.8}>
        {figuras.map((x, i) => {
          const alto = 46 + (i % 3) * 5;
          return (
            <path
              key={x}
              d={`M${x - 9} 172v-${alto - 16}c0-7 3-9 3-15a6 6 0 0112 0c0 6 3 8 3 15v${alto - 16}z`}
              opacity={0.92}
            />
          );
        })}
      </g>
      <Niebla y={166} opacidad={0.5} />
    </>
  );
}

function Trece() {
  return (
    <>
      {/* interior del campanario: dos arcos abiertos a la noche */}
      <path d="M0 0h320v190H0z" fill={TINTA} />
      <path d="M34 190V92a40 40 0 0180 0v98z" fill="#262a55" />
      <path d="M206 190V92a40 40 0 0180 0v98z" fill="#262a55" />
      <Luna x={248} y={84} r={16} />
      {/* viga, campana y badajo */}
      <path d="M96 30h128v7H96z" fill="#3a2d28" />
      <path d="M157 37h6v10h-6z" fill="#3a2d28" />
      <path d="M134 104c0-6 8-10 8-30a18 18 0 0136 0c0 20 8 24 8 30z" fill="#8a6f3a" />
      <path d="M134 104h52v5h-52z" fill="#6f5830" />
      <path d="M158 96h4v20h-4z" fill="#2a211d" />
      <circle cx={160} cy={119} r={5} fill="#2a211d" />
      {/* soga empalmada con el hilo rojo */}
      <path d="M186 60c18 4 22 30 20 62" fill="none" stroke="#b9a37a" strokeWidth={2} />
      <path d="M206 122c-1 22 1 40 0 62" fill="none" stroke={HILO} strokeWidth={2} />
      {/* la bruma rodea un lugar vacío */}
      <Niebla y={150} opacidad={0.55} />
      <path d="M92 190v-34c0-12 6-18 6-26a12 12 0 0124 0c0 8 6 14 6 26v34z" fill={TINTA} opacity={0.9} />
      <circle cx={70} cy={168} r={2} fill={VELA} />
      <Luz x={70} y={168} r={16} />
    </>
  );
}

const ESCENAS: Record<Lugar, () => ReactNode> = {
  posada: Posada,
  cuarto: Cuarto,
  plaza: Plaza,
  campanario: Campanario,
  refugio: Refugio,
  linde: Linde,
  bruma: Bruma,
  espejo: Espejo,
  cripta: Cripta,
  umbral: Umbral,
  trece: Trece,
};

export function Vineta({ lugar, className = "" }: { lugar: Lugar; className?: string }) {
  const Escena = ESCENAS[lugar];
  // Ids únicos por viñeta: puede haber varias en la misma página.
  const id = `v-${lugar}`;
  return (
    <svg viewBox="0 0 320 190" className={`block w-full ${className}`} role="img" aria-label={`Ilustración: ${lugar}`}>
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12142c" />
          <stop offset="0.6" stopColor="#2a2a5a" />
          <stop offset="1" stopColor="#4a3a62" />
        </linearGradient>
        <linearGradient id="alba" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a5a78" stopOpacity="0" />
          <stop offset="1" stopColor="#c79a86" />
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#f5cf7f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f5cf7f" stopOpacity="0" />
        </radialGradient>
        <filter id="difuso" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="difuso-suave">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
        {/* marco en arco */}
        <clipPath id={id}>
          <path d="M6 190V70C6 34 70 6 160 6s154 28 154 64v120z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="320" height="190" fill="url(#cielo)" />
        {/* El dibujo queda debajo como respaldo mientras carga la ilustración pintada. */}
        <Escena />
        <image href={`/escenas/${lugar}.webp`} width="320" height="190" preserveAspectRatio="xMidYMid slice" />
      </g>
      <path d="M6 190V70C6 34 70 6 160 6s154 28 154 64v120" fill="none" stroke="#8a6f3a" strokeWidth={2} />
      <path d="M11 190V71C11 39 73 11 160 11s149 28 149 60v119" fill="none" stroke="#8a6f3a" strokeWidth={0.7} opacity={0.6} />
    </svg>
  );
}
