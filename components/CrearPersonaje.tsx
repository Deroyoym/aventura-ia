"use client";

import { useState } from "react";
import {
  CLASES,
  NOMBRE_ATRIBUTO,
  NOMBRE_ENFOQUE,
  OBJETOS,
  RASGOS,
  RAZAS,
  SECRETOS,
  atributosDe,
} from "@/lib/game/contenido";
import type { PeticionPersonaje } from "@/lib/protocolo";
import { Atributos } from "./Hoja";
import { ICONO_ENFOQUE, IconoCorazon, Ornamento } from "./ui";

// Creación de personaje en cuatro pasos cortos, pensada para una mano.

const PASOS = ["Quién llega", "Su oficio", "Su sombra", "La hoja"] as const;

const VACIO: PeticionPersonaje = { nombre: "", raza: "", clase: "", rasgo: "", secreto: "" };

export function CrearPersonaje({
  inicial,
  alGuardar,
  alCancelar,
}: {
  inicial?: PeticionPersonaje;
  alGuardar: (datos: PeticionPersonaje) => Promise<void>;
  alCancelar?: () => void;
}) {
  const [paso, setPaso] = useState(0);
  const [d, setD] = useState<PeticionPersonaje>(inicial ?? VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cambiar = (parte: Partial<PeticionPersonaje>) => setD((previo) => ({ ...previo, ...parte }));

  const raza = RAZAS.find((r) => r.id === d.raza);
  const clase = CLASES.find((c) => c.id === d.clase);
  const atributos = atributosDe(d.raza, d.clase);
  const completo = [
    d.nombre.trim().length >= 2 && !!raza,
    !!clase,
    d.rasgo.trim().length >= 2 && d.secreto.trim().length >= 5,
    true,
  ];

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      await alGuardar(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el personaje.");
      setGuardando(false);
    }
  }

  return (
    <section className="pergamino pergamino-filete aparecer p-5" aria-labelledby="titulo-paso">
      <ol className="mb-3 flex justify-center gap-1.5" aria-label="Pasos">
        {PASOS.map((nombre, i) => (
          <li
            key={nombre}
            aria-current={i === paso ? "step" : undefined}
            className={`h-1.5 w-9 rounded-full ${i <= paso ? "bg-sangre" : "bg-sepia/30"}`}
          >
            <span className="sr-only">{nombre}</span>
          </li>
        ))}
      </ol>
      <p className="versalitas text-center text-sepia">
        paso {paso + 1} de {PASOS.length}
      </p>
      <h2 id="titulo-paso" className="titulo mb-4 text-center text-[1.7rem]">
        {PASOS[paso]}
      </h2>

      {paso === 0 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="versalitas mb-1 block text-sepia">
              nombre
            </label>
            <input
              id="nombre"
              className="campo"
              value={d.nombre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
              maxLength={24}
              placeholder="¿Cómo te llaman?"
              autoComplete="off"
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="versalitas mb-1 text-sepia">raza</legend>
            {RAZAS.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={d.raza === r.id}
                onClick={() => cambiar({ raza: r.id })}
                className={`tarjeta block w-full px-3 py-2 text-left ${d.raza === r.id ? "tarjeta-elegida" : ""}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="titulo text-lg">{r.nombre}</span>
                  <span className="versalitas shrink-0 text-sangre">+1 {NOMBRE_ATRIBUTO[r.bono]}</span>
                </span>
                <span className="block text-[0.95rem] leading-snug text-sepia">{r.descripcion}</span>
              </button>
            ))}
          </fieldset>
        </div>
      )}

      {paso === 1 && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Clase</legend>
          {CLASES.map((c) => {
            const Icono = ICONO_ENFOQUE[c.afinidad];
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={d.clase === c.id}
                onClick={() => cambiar({ clase: c.id })}
                className={`tarjeta block w-full px-3 py-2 text-left ${d.clase === c.id ? "tarjeta-elegida" : ""}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="titulo text-lg">{c.nombre}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-sepia">
                    <span className="inline-flex items-center gap-1">
                      <Icono tam={15} /> {NOMBRE_ENFOQUE[c.afinidad]}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconoCorazon tam={13} /> {c.vida}
                    </span>
                  </span>
                </span>
                <span className="block text-[0.95rem] leading-snug text-sepia">{c.descripcion}</span>
              </button>
            );
          })}
        </fieldset>
      )}

      {paso === 2 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="versalitas mb-1 text-sepia">rasgo</legend>
            <p className="mb-2 text-[0.95rem] leading-snug text-sepia">
              Lo que cualquiera nota al conocerte. Una vez por capítulo te deja tirar con ventaja.
            </p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {RASGOS.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={d.rasgo === r}
                  onClick={() => cambiar({ rasgo: r })}
                  className={`tarjeta min-h-10 px-2.5 py-1 text-[0.95rem] ${d.rasgo === r ? "tarjeta-elegida" : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              className="campo"
              value={d.rasgo}
              onChange={(e) => cambiar({ rasgo: e.target.value })}
              maxLength={40}
              placeholder="…o escribí el tuyo"
              aria-label="Rasgo propio"
            />
          </fieldset>

          <fieldset>
            <legend className="versalitas mb-1 text-sepia">secreto</legend>
            <p className="mb-2 text-[0.95rem] leading-snug text-sepia">
              Solo lo saben vos y el máster. Tu compañero no lo va a ver… hasta que la historia lo saque a la luz.
            </p>
            <textarea
              className="campo min-h-24 resize-none leading-snug"
              value={d.secreto}
              onChange={(e) => cambiar({ secreto: e.target.value })}
              maxLength={200}
              placeholder="Lo que tu personaje no le contó a nadie"
              aria-label="Secreto"
            />
            <details className="mt-2">
              <summary className="cursor-pointer text-[0.95rem] italic text-sepia">Darme ideas</summary>
              <div className="mt-2 space-y-1.5">
                {SECRETOS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => cambiar({ secreto: s })}
                    className="tarjeta block w-full px-2.5 py-1.5 text-left text-[0.95rem] leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </details>
          </fieldset>
        </div>
      )}

      {paso === 3 && raza && clase && atributos && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="titulo text-3xl">{d.nombre.trim()}</p>
            <p className="italic text-sepia">
              {raza.nombre} · {clase.nombre}
            </p>
          </div>
          <Atributos atributos={atributos} />
          <dl className="space-y-2 text-[1.02rem] leading-snug">
            <div className="flex gap-2">
              <dt className="versalitas w-16 shrink-0 pt-0.5 text-sepia">vida</dt>
              <dd>{clase.vida}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="versalitas w-16 shrink-0 pt-0.5 text-sepia">rasgo</dt>
              <dd>{d.rasgo.trim()}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="versalitas w-16 shrink-0 pt-0.5 text-sepia">lleva</dt>
              <dd>{clase.equipo.map((id) => OBJETOS[id].nombre).join(", ")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="versalitas w-16 shrink-0 pt-0.5 text-sepia">secreto</dt>
              <dd className="italic">{d.secreto.trim()}</dd>
            </div>
          </dl>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-center text-[0.95rem] text-sangre">
          {error}
        </p>
      )}

      <Ornamento className="my-4 text-sepia" />

      <div className="flex gap-2">
        {(paso > 0 || alCancelar) && (
          <button
            type="button"
            className="boton boton-sepia"
            onClick={() => (paso > 0 ? setPaso(paso - 1) : alCancelar?.())}
            disabled={guardando}
          >
            {paso > 0 ? "Atrás" : "Cancelar"}
          </button>
        )}
        {paso < PASOS.length - 1 ? (
          <button type="button" className="boton boton-tinta flex-1" disabled={!completo[paso]} onClick={() => setPaso(paso + 1)}>
            Seguir
          </button>
        ) : (
          <button type="button" className="boton boton-tinta flex-1" disabled={guardando} onClick={guardar}>
            {guardando ? "Guardando…" : "Así soy yo"}
          </button>
        )}
      </div>
    </section>
  );
}
