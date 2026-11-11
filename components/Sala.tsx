"use client";

import Link from "next/link";
import { useState } from "react";
import { useSala, type SalaEnVivo } from "@/lib/client/useSala";
import type { Asiento } from "@/lib/game/tipos";
import { Juego } from "./Juego";
import { Preparacion } from "./Preparacion";
import { Ornamento, Puntos } from "./ui";

// Punto de entrada de una sala: decide qué pantalla toca según el acceso de
// este dispositivo y la fase de la partida.

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-4 py-8">{children}</main>
  );
}

export function Cargando() {
  return (
    <Marco>
      <p className="cuento text-center text-2xl italic text-bruma" role="status">
        Abriendo el libro <Puntos />
      </p>
    </Marco>
  );
}

function Aviso({ titulo, texto, children }: { titulo: string; texto: string; children?: React.ReactNode }) {
  return (
    <Marco>
      <section className="pergamino pergamino-filete aparecer space-y-4 p-6 text-center">
        <h1 className="titulo text-[1.8rem]">{titulo}</h1>
        <p className="text-[1.08rem] leading-snug text-sepia">{texto}</p>
        <Ornamento className="text-sepia" />
        {children}
        <Link href="/" className="boton boton-sepia w-full">
          Volver a la portada
        </Link>
      </section>
    </Marco>
  );
}

function Unirse({ sala, codigo }: { sala: SalaEnVivo; codigo: string }) {
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const asientos = sala.publica?.asientos ?? [];
  const hayLugar = asientos.some((a) => !a.ocupado);

  async function entrar(reclamar?: Asiento) {
    setOcupado(true);
    setError(null);
    try {
      await sala.unirse(reclamar);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo entrar a la sala.");
      await sala.refrescar();
      setOcupado(false);
    }
  }

  return (
    <Marco>
      <section className="pergamino pergamino-filete aparecer space-y-4 p-6 text-center">
        <p className="versalitas text-sepia">sala</p>
        <h1 className="titulo text-5xl tracking-[0.22em]">{codigo}</h1>
        <Ornamento className="text-sepia" />

        {hayLugar ? (
          <>
            <p className="text-[1.08rem] leading-snug text-sepia">Hay una silla libre junto al fuego.</p>
            <button type="button" className="boton boton-tinta w-full" disabled={ocupado} onClick={() => void entrar()}>
              {ocupado ? "Entrando…" : "Entrar a la sala"}
            </button>
          </>
        ) : (
          <>
            <p className="text-[1.08rem] leading-snug text-sepia">
              La sala ya tiene a sus dos jugadores. Si uno sos vos y cambiaste de celular, recuperá tu personaje:
            </p>
            <div className="space-y-2">
              {asientos.map((a) => (
                <button
                  key={a.asiento}
                  type="button"
                  className="boton boton-tinta w-full"
                  disabled={ocupado || a.activo}
                  onClick={() => void entrar(a.asiento)}
                >
                  Soy {a.personaje ?? `el jugador ${a.asiento}`}
                  {a.activo && <span className="text-sm normal-case tracking-normal"> (abierto en otro dispositivo)</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="text-[0.95rem] text-sangre">
            {error}
          </p>
        )}
        <Link href="/" className="block text-[0.95rem] italic text-sepia underline">
          Volver a la portada
        </Link>
      </section>
    </Marco>
  );
}

export function Sala({ codigo }: { codigo: string }) {
  const sala = useSala(codigo);

  if (sala.carga === "cargando") return <Cargando />;
  if (sala.carga === "sin_sala") {
    return <Aviso titulo="Esa sala no existe" texto={`No hay ninguna partida con el código ${codigo}. Revisá que esté bien escrito.`} />;
  }
  if (sala.carga === "error" || !sala.snap) {
    if (sala.carga === "sin_acceso") return <Unirse sala={sala} codigo={codigo} />;
    return (
      <Aviso titulo="No se pudo abrir la sala" texto={sala.error ?? "El servidor no respondió."}>
        <button type="button" className="boton boton-tinta w-full" onClick={() => void sala.refrescar()}>
          Probar de nuevo
        </button>
      </Aviso>
    );
  }

  const { vista } = sala.snap;
  // Mientras se narra la apertura ya se muestra la página del libro.
  const preparando = vista.fase === "preparacion" && !vista.pendiente && !sala.enviando;
  return preparando ? <Preparacion sala={sala} /> : <Juego sala={sala} />;
}
