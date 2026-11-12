"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { NOMBRE_ATRIBUTO, NOMBRE_RESULTADO } from "@/lib/game/contenido";
import type { Asiento, Entrada } from "@/lib/game/tipos";
import type { Vista } from "@/lib/game/vista";
import { CuentaTirada, D20 } from "./Dado";
import { COLOR_JUGADOR, ICONO_ENFOQUE, IconoSusurro, Ornamento, Puntos } from "./ui";
import { Vineta } from "./Vineta";

// La página del libro: escenas, narración, acciones y tiradas en orden, más la
// narración que está llegando en este momento.

const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
/** Hasta qué distancia del final se considera que el lector "sigue" el texto. */
const MARGEN_PEGADO = 160;

type Item = Entrada | { id: number; tipo: "susurro"; texto: string };

const TONO = { bien: "text-musgo", mal: "text-sangre", neutro: "text-sepia" } as const;

function Parrafos({ texto, capitular, escribiendo }: { texto: string; capitular: boolean; escribiendo?: boolean }) {
  const parrafos = texto.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <div className="space-y-3">
      {parrafos.map((p, i) => {
        const dialogo = p.trimStart().startsWith("—");
        const ultimo = i === parrafos.length - 1;
        return (
          <p
            key={i}
            className={`whitespace-pre-line text-[1.14rem] leading-[1.62] ${capitular && i === 0 && !dialogo ? "capitular" : ""} ${escribiendo && ultimo ? "escribiendo" : ""}`}
          >
            {p}
          </p>
        );
      })}
    </div>
  );
}

function Segundos({ hasta }: { hasta: number }) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(id);
  }, []);
  return <>{Math.max(0, Math.ceil((hasta - ahora) / 1000))}</>;
}

export function Historia({
  vista,
  narracion,
  espera,
  pensando,
  pie,
}: {
  vista: Vista;
  narracion: string;
  espera: { hasta: number; intento: number } | null;
  pensando: boolean;
  /** Contenido extra al final de la página (p. ej. el cierre del capítulo). */
  pie?: React.ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const pegado = useRef(true);
  const nombre = (a: Asiento) => vista.personajes[a]?.nombre ?? `Jugador ${a}`;

  const items = useMemo<Item[]>(
    () =>
      [...vista.entradas, ...vista.susurros.map((s) => ({ ...s, tipo: "susurro" as const }))].sort(
        (a, b) => a.id - b.id,
      ),
    [vista.entradas, vista.susurros],
  );

  // Seguir el texto mientras llega, salvo que el lector haya subido a releer.
  const ultimoId = items[items.length - 1]?.id ?? 0;
  useLayoutEffect(() => {
    const el = caja.current;
    if (el && pegado.current) el.scrollTop = el.scrollHeight;
  }, [ultimoId, narracion, espera, pensando, vista.narrando]);

  // La primera narración de cada escena lleva capitular.
  const capitulares = useMemo(() => {
    const ids = new Set<number>();
    let toca = false;
    for (const item of items) {
      if (item.tipo === "escena") toca = true;
      else if (item.tipo === "narracion" && toca) {
        ids.add(item.id);
        toca = false;
      }
    }
    return { ids, enVivo: toca };
  }, [items]);

  return (
    <div
      ref={caja}
      onScroll={(e) => {
        const el = e.currentTarget;
        pegado.current = el.scrollHeight - el.scrollTop - el.clientHeight < MARGEN_PEGADO;
      }}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
    >
      <article className="pergamino px-4 pb-6 pt-4" aria-live="polite">
        {items.length === 0 && !narracion && (
          <p className="cuento py-10 text-center text-xl italic text-sepia">
            El libro se abre <Puntos />
          </p>
        )}

        {items.map((item) => {
          switch (item.tipo) {
            case "escena": {
              const escena = vista.escenas[item.escena];
              return (
                <header key={item.id} className="aparecer mb-4 mt-2 text-center first:mt-0">
                  {item.escena > 0 && <Ornamento className="mb-5 text-sepia" />}
                  <Vineta lugar={escena.lugar} className="mx-auto max-w-[17rem]" />
                  <p className="versalitas mt-3 text-sepia">
                    {escena.numero === 1 && escena.capitulo > 1 ? `capítulo ${ROMANOS[escena.capitulo - 1]} · ` : ""}
                    escena {ROMANOS[escena.numero - 1]}
                  </p>
                  <h2 className="titulo text-[1.65rem]">{escena.titulo}</h2>
                </header>
              );
            }
            case "narracion":
              return (
                <section key={item.id} className="aparecer my-4">
                  <Parrafos texto={item.texto} capitular={capitulares.ids.has(item.id)} />
                </section>
              );
            case "accion": {
              const Icono = ICONO_ENFOQUE[item.enfoque];
              return (
                <p
                  key={item.id}
                  className="aparecer cuento my-3 ml-6 flex items-start justify-end gap-2 text-right text-[1.08rem] italic leading-snug"
                  style={{ color: COLOR_JUGADOR[item.asiento] }}
                >
                  <span>
                    <span className="not-italic">{nombre(item.asiento)}:</span> «{item.texto}»
                  </span>
                  <Icono tam={18} className="mt-0.5 shrink-0" />
                </p>
              );
            }
            case "tirada":
              return (
                <div
                  key={item.id}
                  className="aparecer my-3 flex items-center justify-end gap-2.5 text-[0.98rem] leading-tight"
                >
                  <div className="text-right">
                    <p className="titulo text-base">{NOMBRE_RESULTADO[item.tirada.resultado]}</p>
                    <p className="text-sepia">
                      {NOMBRE_ATRIBUTO[item.tirada.atributo]}: <CuentaTirada tirada={item.tirada} />
                    </p>
                  </div>
                  <D20 valor={item.tirada.dado} resultado={item.tirada.resultado} tam={42} />
                </div>
              );
            case "sistema":
              return (
                <p key={item.id} className={`aparecer my-1.5 text-center text-[0.95rem] italic ${TONO[item.tono]}`}>
                  {item.texto}
                </p>
              );
            case "susurro":
              return (
                <aside
                  key={item.id}
                  className="aparecer my-4 rounded-md border border-[#3a3560] bg-[#15162fee] px-3.5 py-3 text-hueso shadow-[0_4px_14px_#0006]"
                >
                  <p className="versalitas mb-1 flex items-center gap-1.5 text-bruma">
                    <IconoSusurro tam={15} /> solo vos lo percibís
                  </p>
                  <p className="cuento text-[1.08rem] italic leading-snug">{item.texto}</p>
                </aside>
              );
          }
        })}

        {narracion && (
          <section className="my-4">
            <Parrafos texto={narracion} capitular={capitulares.enVivo} escribiendo />
          </section>
        )}

        {espera ? (
          <p className="my-4 text-center text-[1.02rem] italic text-sangre" role="status">
            El máster recupera el aliento. Reintenta en <Segundos hasta={espera.hasta} /> s (intento {espera.intento + 1}).
          </p>
        ) : pensando && !narracion ? (
          <p className="my-4 text-center text-[1.02rem] italic text-sepia" role="status">
            El máster sopesa lo que intentás <Puntos />
          </p>
        ) : vista.narrando && !narracion ? (
          <p className="my-4 text-center text-[1.02rem] italic text-sepia" role="status">
            El máster moja la pluma <Puntos />
          </p>
        ) : null}

        {pie}
      </article>
    </div>
  );
}
