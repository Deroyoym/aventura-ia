"use client";

import { useEffect, useState } from "react";
import { NOMBRE_ATRIBUTO, NOMBRE_RESULTADO } from "@/lib/game/contenido";
import type { Resultado, Tirada } from "@/lib/game/tipos";

// El d20: una cara de icosaedro en SVG. Se usa chico en la bitácora y grande,
// animado, cuando alguien tira.

const COLOR: Record<Resultado, { cara: string; borde: string; texto: string; brillo: string }> = {
  critico: { cara: "#f5cf7f", borde: "#8a5d12", texto: "#2a1a05", brillo: "#f5cf7fcc" },
  exito: { cara: "#e9dcc0", borde: "#55764a", texto: "#243a1d", brillo: "#7fae6f88" },
  costo: { cara: "#e9dcc0", borde: "#b8923f", texto: "#3b2a0c", brillo: "#e6a93c77" },
  fallo: { cara: "#cfc3ad", borde: "#6b553a", texto: "#2a2018", brillo: "#00000000" },
  pifia: { cara: "#3a1414", borde: "#c2552f", texto: "#f3b9a4", brillo: "#c2552faa" },
};
const NEUTRO = { cara: "#e9dcc0", borde: "#6b553a", texto: "#2a2018", brillo: "#00000000" };

export function D20({
  valor,
  resultado,
  tam = 44,
  className = "",
}: {
  valor: number | string;
  resultado?: Resultado;
  tam?: number;
  className?: string;
}) {
  const c = resultado ? COLOR[resultado] : NEUTRO;
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: `drop-shadow(0 0 ${tam / 6}px ${c.brillo})` }}
      aria-hidden
    >
      <path d="M50 4L90 27v46L50 96 10 73V27z" fill={c.cara} stroke={c.borde} strokeWidth={3} strokeLinejoin="round" />
      <g stroke={c.borde} strokeWidth={1.6} strokeLinejoin="round" fill="none" opacity={0.75}>
        <path d="M50 20l28 46H22z" />
        <path d="M50 20V4M50 20l40 7M50 20l-40 7M78 66l12-39M78 66l12 7M78 66L50 96M22 66L10 27M22 66l-12 7M22 66l28 30" />
      </g>
      {/* grieta de la pifia */}
      {resultado === "pifia" && (
        <path d="M34 18l8 16-6 10 10 12-4 14 8 10" stroke="#c2552f" strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-titulo)"
        fontSize={String(valor).length > 1 ? 27 : 31}
        fill={c.texto}
      >
        {valor}
      </text>
    </svg>
  );
}

const signo = (n: number) => (n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`);

/** La cuenta de una tirada: dado, modificadores, total y dificultad. */
export function CuentaTirada({ tirada, clara = false }: { tirada: Tirada; clara?: boolean }) {
  return (
    <span className="tabular-nums">
      {tirada.dado} {signo(tirada.modificador)}
      {tirada.bono ? ` ${signo(tirada.bono)}` : ""} = <strong>{tirada.total}</strong>
      <span className={clara ? "text-bruma" : "opacity-70"}> contra {tirada.cd}</span>
    </span>
  );
}

const DURACION_RODAR_MS = 1150;
const DURACION_TOTAL_MS = 3400;

/** Pantalla completa mientras rueda el dado. Se cierra sola o al tocar. */
export function DadoEnVivo({
  tirada,
  quien,
  alCerrar,
}: {
  tirada: Tirada;
  quien: string;
  alCerrar: () => void;
}) {
  const [asentado, setAsentado] = useState(false);
  const [cara, setCara] = useState(() => 1 + Math.floor(Math.random() * 20));

  useEffect(() => {
    const giro = setInterval(() => setCara(1 + Math.floor(Math.random() * 20)), 70);
    const asentar = setTimeout(() => {
      clearInterval(giro);
      setAsentado(true);
      navigator.vibrate?.(tirada.resultado === "critico" || tirada.resultado === "pifia" ? [30, 40, 60] : 25);
    }, DURACION_RODAR_MS);
    const cerrar = setTimeout(alCerrar, DURACION_TOTAL_MS);
    return () => {
      clearInterval(giro);
      clearTimeout(asentar);
      clearTimeout(cerrar);
    };
  }, [tirada, alCerrar]);

  const otro = tirada.dados.length > 1 ? tirada.dados.find((d, i) => i !== tirada.dados.indexOf(tirada.dado)) : null;

  return (
    <button
      type="button"
      onClick={alCerrar}
      className="fixed inset-0 z-50 flex cursor-default flex-col items-center justify-center gap-5 bg-[#06070fd9] px-6 text-center backdrop-blur-sm"
      aria-label="Cerrar la tirada"
    >
      <p className="versalitas text-bruma">
        {quien} tira {NOMBRE_ATRIBUTO[tirada.atributo]}
      </p>
      <div className="flex items-end gap-4">
        <D20
          key={asentado ? "final" : "rodando"}
          valor={asentado ? tirada.dado : cara}
          resultado={asentado ? tirada.resultado : undefined}
          tam={148}
          className={asentado ? "aparecer" : "dado-rodando"}
        />
        {asentado && otro !== null && otro !== undefined && (
          <D20 valor={otro} tam={64} className="aparecer opacity-45" />
        )}
      </div>
      <div className="min-h-[5.5rem]" aria-live="polite">
        {asentado && (
          <div className="aparecer space-y-1">
            <p className="titulo text-3xl" style={{ color: COLOR[tirada.resultado].cara === "#3a1414" ? "#e88d6f" : COLOR[tirada.resultado].cara }}>
              {NOMBRE_RESULTADO[tirada.resultado]}
            </p>
            <p className="text-lg text-hueso">
              <CuentaTirada tirada={tirada} clara />
            </p>
            {(tirada.modo !== "normal" || tirada.ayudas.length > 0) && (
              <p className="text-sm italic text-bruma">
                {[tirada.modo !== "normal" ? `Con ${tirada.modo}` : null, ...tirada.ayudas].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
