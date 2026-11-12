"use client";

import { useState } from "react";
import type { SalaEnVivo } from "@/lib/client/useSala";
import { otroAsiento } from "@/lib/game/tipos";
import { CrearPersonaje } from "./CrearPersonaje";
import { FichaCorta } from "./Hoja";
import { SelectorTerror } from "./Portada";
import { IconoCompartir, Ornamento, Puntos } from "./ui";

/** Botón que comparte el enlace de la sala o, si no se puede, lo copia. */
export function Compartir({ codigo, className = "" }: { codigo: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = `${window.location.origin}/sala/${codigo}`;
    const datos = { title: "La Hora Trece", text: `Sumate a mi sala de La Hora Trece. Código: ${codigo}`, url };
    try {
      if (navigator.share) {
        await navigator.share(datos);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // El usuario cerró el diálogo de compartir: no hay nada que avisar.
    }
  }

  return (
    <button type="button" className={`boton ${className}`} onClick={compartir}>
      <IconoCompartir tam={18} />
      {copiado ? "Enlace copiado" : "Compartir enlace"}
    </button>
  );
}

/** Antes de empezar: crear el personaje y esperar al compañero. */
export function Preparacion({ sala }: { sala: SalaEnVivo }) {
  const { vista, codigo, asientos } = sala.snap!;
  const yo = vista.yo;
  const otro = otroAsiento(yo);
  const mio = vista.personajes[yo];
  const suyo = vista.personajes[otro];
  const [editando, setEditando] = useState(false);
  const companeroEnSala = asientos[otro].ocupado;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="text-center">
        <p className="versalitas text-bruma">código de la sala</p>
        <p className="titulo text-5xl tracking-[0.22em] text-ambar-claro [text-shadow:0_0_22px_#e6a93c55]">{codigo}</p>
        <Compartir codigo={codigo} className="boton-noche mt-3" />
      </header>

      {!mio || editando ? (
        <CrearPersonaje
          retratos={vista.retratos}
          inicial={
            mio && {
              nombre: mio.nombre,
              raza: mio.raza,
              clase: mio.clase,
              rasgo: mio.rasgo,
              secreto: mio.secreto ?? "",
              avatar: mio.avatar,
              apariencia: mio.apariencia,
            }
          }
          alCancelar={mio ? () => setEditando(false) : undefined}
          alGuardar={async (datos) => {
            await sala.guardarPersonaje(datos);
            setEditando(false);
          }}
        />
      ) : (
        <section className="pergamino pergamino-filete aparecer space-y-4 p-5">
          <h2 className="titulo text-center text-2xl">Junto al fuego</h2>

          <FichaCorta
            personaje={mio}
            etiqueta="vos"
            accion={
              <button type="button" className="text-sm italic text-sangre underline" onClick={() => setEditando(true)}>
                Cambiar
              </button>
            }
          />

          {suyo ? (
            <FichaCorta personaje={suyo} etiqueta="tu compañero" />
          ) : (
            <div className="tarjeta px-3 py-3 text-center text-[1.02rem] italic text-sepia" aria-live="polite">
              {companeroEnSala ? (
                <>
                  Tu compañero está armando su personaje <Puntos />
                </>
              ) : (
                <>
                  La otra silla está vacía. Pasale el código <strong className="not-italic tracking-widest">{codigo}</strong>{" "}
                  a quien te acompañe.
                </>
              )}
            </div>
          )}

          <SelectorTerror valor={vista.terror} alCambiar={(nivel) => void sala.accion({ tipo: "terror", nivel })} />

          <Ornamento className="text-sepia" />

          <button
            type="button"
            className="boton boton-tinta w-full text-lg"
            disabled={!vista.puedeEmpezar || sala.enviando}
            onClick={() => void sala.turno({ tipo: "inicio" })}
          >
            {sala.enviando ? "Abriendo el libro…" : "Abrir el libro"}
          </button>
          {!vista.puedeEmpezar && (
            <p className="text-center text-[0.95rem] italic text-sepia">
              La historia empieza cuando los dos personajes estén listos.
            </p>
          )}
          {sala.error && (
            <p role="alert" className="text-center text-[0.95rem] text-sangre">
              {sala.error}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
