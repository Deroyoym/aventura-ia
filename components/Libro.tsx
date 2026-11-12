"use client";

import Link from "next/link";
import { useState } from "react";
import type { SalaEnVivo } from "@/lib/client/useSala";
import { NIVELES_ORDEN, NOMBRE_ATRIBUTO } from "@/lib/game/contenido";
import { NIVELES_TERROR, otroAsiento } from "@/lib/game/tipos";
import { Avatar, OpcionesAvatar } from "./Avatar";
import { Atributos, FichaCorta, efectoDe, nombreClase, nombreRaza, usosDe } from "./Hoja";
import { SelectorTerror } from "./Portada";
import { Compartir } from "./Preparacion";
import { IconoCerrar, IconoHuella, Ornamento, Puntos, Vida } from "./ui";

// El libro del jugador: su hoja, el diario de lo descubierto y los ajustes de
// la sala. Se abre como un cajón sobre la partida.

export type Pestana = "hoja" | "diario" | "sala";

const PESTANAS: { id: Pestana; nombre: string }[] = [
  { id: "hoja", nombre: "Hoja" },
  { id: "diario", nombre: "Diario" },
  { id: "sala", nombre: "Sala" },
];

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="versalitas border-b border-sepia/30 pb-1 text-sepia">{titulo}</h3>
      {children}
    </section>
  );
}

function PestanaHoja({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  const yo = vista.personajes[vista.yo];
  const otro = vista.personajes[otroAsiento(vista.yo)];
  const [retocando, setRetocando] = useState(false);
  if (!yo) return null;

  return (
    <div className="space-y-5">
      <header className="flex flex-col items-center text-center">
        <Avatar
          avatar={yo.avatar}
          raza={yo.raza}
          clase={yo.clase}
          retrato={retocando ? null : yo.retrato.url}
          tam={retocando ? 96 : 132}
          titulo={`Retrato de ${yo.nombre}`}
        />
        <button
          type="button"
          className="mb-1 mt-1 text-[0.95rem] italic text-sangre underline"
          aria-expanded={retocando}
          onClick={() => setRetocando(!retocando)}
        >
          {retocando ? "Listo" : "Cambiar retrato"}
        </button>
        {retocando && (
          <div className="mb-3 w-full space-y-3 text-left">
            <OpcionesAvatar
              avatar={yo.avatar}
              alCambiar={(parte) => void sala.accion({ tipo: "avatar", avatar: { ...yo.avatar, ...parte } })}
            />
          </div>
        )}
        {vista.retratos && (
          <div className="mb-3">
            {yo.retrato.pintando ? (
              <p className="text-[0.95rem] italic text-sepia" role="status">
                El retratista está pintando <Puntos />
              </p>
            ) : (
              <button
                type="button"
                className="boton boton-sepia"
                disabled={yo.retrato.restantes === 0}
                onClick={() => void sala.accion({ tipo: "retrato" })}
              >
                {yo.retrato.url ? "Pintar otro retrato" : "Pintar mi retrato"}
              </button>
            )}
            <p className="mt-1 text-[0.85rem] italic text-sepia">
              {yo.retrato.restantes === 0
                ? "Ya no quedan retratos para este personaje."
                : `Se pinta con lo que elegiste. Quedan ${yo.retrato.restantes}.`}
            </p>
          </div>
        )}
        <h2 className="titulo text-3xl">{yo.nombre}</h2>
        <p className="italic text-sepia">
          {nombreRaza(yo.raza)} · {nombreClase(yo.clase)}
        </p>
        <p className="mt-1 text-lg">
          <Vida vida={yo.vida} max={yo.vidaMax} />
          {yo.quebrado && <span className="ml-2 italic text-sangre">fuera de juego</span>}
        </p>
      </header>

      <Atributos atributos={yo.atributos} />

      <Seccion titulo="rasgo">
        <p className="text-[1.05rem]">
          {yo.rasgo}{" "}
          <span className="text-[0.95rem] italic text-sepia">
            ({yo.rasgoUsado ? "ya lo invocaste en este capítulo" : "ventaja disponible"})
          </span>
        </p>
      </Seccion>

      <Seccion titulo={yo.secretoRevelado ? "secreto (tu compañero ya lo sabe)" : "secreto (solo vos lo ves)"}>
        <p className="cuento text-[1.05rem] italic leading-snug">{yo.secreto}</p>
      </Seccion>

      <Seccion titulo="morral">
        {yo.inventario.length === 0 && <p className="italic text-sepia">Vacío.</p>}
        <ul className="space-y-1.5">
          {yo.inventario.map((o) => {
            const curable = !!o.cura && (o.usos ?? 0) > 0 && yo.vida < yo.vidaMax && !yo.quebrado && vista.fase === "jugando";
            return (
              <li key={o.id} className="tarjeta flex items-center gap-2 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[1.05rem] leading-tight">
                    {o.nombre}
                    {efectoDe(o) && <span className="versalitas ml-2 text-sangre">{efectoDe(o)}</span>}
                  </p>
                  <p className="text-[0.92rem] leading-snug text-sepia">
                    {o.descripcion}
                    {usosDe(o) && <span className="italic"> · {usosDe(o)}</span>}
                  </p>
                </div>
                {curable && (
                  <button
                    type="button"
                    className="boton boton-tinta min-h-10 shrink-0 px-3 py-1 text-sm"
                    onClick={() => void sala.accion({ tipo: "usar", objeto: o.id })}
                  >
                    Usar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Seccion>

      {vista.companero && (
        <Seccion titulo="compañero">
          <div className="tarjeta flex items-start gap-2.5 px-3 py-2">
            <IconoHuella tam={22} className="mt-0.5 shrink-0 text-sangre" />
            <div>
              <p className="titulo text-lg leading-tight">
                {vista.companero.nombre}{" "}
                <span className="font-[family-name:var(--font-texto)] text-[0.95rem] italic tracking-normal text-sepia">
                  {vista.companero.especie}
                </span>
              </p>
              <p className="text-[0.95rem] leading-snug text-sepia">{vista.companero.descripcion}</p>
              <p className="text-[0.95rem] leading-snug">
                Ventaja en {vista.companero.atributos.map((a) => NOMBRE_ATRIBUTO[a]).join(" y ")}
                <span className="italic text-sepia">
                  {" "}
                  ({vista.companero.usado ? "ya ayudó en esta escena" : "una vez por escena"})
                </span>
              </p>
            </div>
          </div>
        </Seccion>
      )}

      {otro && (
        <Seccion titulo="tu compañero de viaje">
          <FichaCorta personaje={otro} etiqueta={otro.rasgo} />
          {otro.secreto && (
            <p className="cuento text-[1rem] italic leading-snug">
              <span className="versalitas not-italic text-sepia">su secreto: </span>
              {otro.secreto}
            </p>
          )}
        </Seccion>
      )}
    </div>
  );
}

function PestanaDiario({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  return (
    <div className="space-y-5">
      <Seccion titulo={`pistas · ${vista.pistas.length} de ${vista.pistasTotales}`}>
        {vista.pistas.length === 0 && <p className="italic text-sepia">Todavía no encontraron ninguna.</p>}
        <ul className="space-y-2">
          {vista.pistas.map((p) => (
            <li key={p.id}>
              <p className="titulo text-lg leading-tight">{p.titulo}</p>
              <p className="text-[1rem] leading-snug text-sepia">{p.texto}</p>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="la gente del pueblo">
        {vista.npcs.length === 0 && <p className="italic text-sepia">Aún no conocen a nadie.</p>}
        <ul className="space-y-2">
          {vista.npcs.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[1.05rem] leading-tight">{n.nombre}</p>
                <p className="truncate text-[0.92rem] italic text-sepia">{n.rol}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`versalitas ${n.relacion > 0 ? "text-musgo" : n.relacion < 0 ? "text-sangre" : "text-sepia"}`}>
                  {n.etiqueta}
                </p>
                <div className="mt-0.5 flex justify-end gap-[3px]" aria-hidden>
                  {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-2.5 rounded-sm"
                      style={{
                        background:
                          i === n.relacion
                            ? i > 0
                              ? "var(--color-musgo)"
                              : i < 0
                                ? "var(--color-sangre)"
                                : "var(--color-sepia)"
                            : "#6b553a33",
                      }}
                    />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="lo ocurrido">
        {vista.resumenes.length === 0 && <p className="italic text-sepia">La historia recién empieza.</p>}
        <ol className="space-y-2">
          {vista.resumenes.map((r) => (
            <li key={`${r.capitulo}-${r.escena}`}>
              <p className="titulo text-lg leading-tight">{r.titulo}</p>
              <p className="text-[1rem] leading-snug text-sepia">{r.texto}</p>
            </li>
          ))}
        </ol>
      </Seccion>
    </div>
  );
}

function PestanaSala({ sala }: { sala: SalaEnVivo }) {
  const { vista, codigo, asientos, modo } = sala.snap!;
  const otro = otroAsiento(vista.yo);
  const companeroActivo = sala.vivo ? sala.presentes.includes(otro) : asientos[otro].activo;
  // Con la partida empezada la intensidad solo se puede bajar.
  const permitidos =
    vista.fase === "preparacion"
      ? NIVELES_TERROR
      : NIVELES_TERROR.filter((n) => NIVELES_ORDEN[n] <= NIVELES_ORDEN[vista.terror]);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="versalitas text-sepia">código de la sala</p>
        <p className="titulo text-4xl tracking-[0.22em]">{codigo}</p>
        <Compartir codigo={codigo} className="boton-sepia mt-2" />
      </div>

      <Seccion titulo="conexión">
        <p className="text-[1.02rem]">
          {sala.vivo ? "En vivo." : "Actualizando cada pocos segundos."}{" "}
          {vista.personajes[otro]?.nombre ?? "Tu compañero"} {companeroActivo ? "está en la sala." : "no está conectado."}
        </p>
        {modo.narrador === "simulado" && (
          <p className="text-[0.95rem] italic text-sepia">Modo local: el máster es un narrador simulado.</p>
        )}
      </Seccion>

      <SelectorTerror
        valor={vista.terror}
        permitidos={permitidos}
        alCambiar={(nivel) => void sala.accion({ tipo: "terror", nivel })}
      />
      {vista.fase !== "preparacion" && (
        <p className="text-[0.95rem] italic leading-snug text-sepia">
          Cualquiera de los dos puede bajar la intensidad en cualquier momento, sin dar explicaciones.
        </p>
      )}

      <Ornamento className="text-sepia" />
      <Link href="/" className="boton boton-sepia w-full">
        Salir a la portada
      </Link>
    </div>
  );
}

export function Libro({
  sala,
  inicial,
  alCerrar,
}: {
  sala: SalaEnVivo;
  inicial: Pestana;
  alCerrar: () => void;
}) {
  const [pestana, setPestana] = useState<Pestana>(inicial);
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-[#06070fb3]" onClick={alCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Libro del jugador"
        className="pergamino subir mx-auto flex max-h-[88dvh] w-full max-w-md flex-col rounded-b-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 border-b border-sepia/30 px-2 pt-2">
          <div role="tablist" className="flex flex-1 gap-1">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={pestana === p.id}
                onClick={() => setPestana(p.id)}
                className={`titulo min-h-11 flex-1 rounded-t-md px-2 text-lg ${
                  pestana === p.id ? "border-b-2 border-sangre text-sangre" : "text-sepia"
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </div>
          <button type="button" className="grid size-11 place-items-center text-sepia" onClick={alCerrar} aria-label="Cerrar">
            <IconoCerrar tam={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          {pestana === "hoja" && <PestanaHoja sala={sala} />}
          {pestana === "diario" && <PestanaDiario sala={sala} />}
          {pestana === "sala" && <PestanaSala sala={sala} />}
        </div>
      </div>
    </div>
  );
}
