"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SalaEnVivo } from "@/lib/client/useSala";
import { ASIENTOS, type Asiento } from "@/lib/game/tipos";
import type { Vista } from "@/lib/game/vista";
import { Acciones } from "./Acciones";
import { Avatar } from "./Avatar";
import { DadoEnVivo } from "./Dado";
import { Historia } from "./Historia";
import { Libro, type Pestana } from "./Libro";
import { COLOR_JUGADOR, IconoFarol, IconoLibro, MedidorAmenaza, Ornamento, Vida } from "./ui";

// La pantalla de juego: barra con el estado de la partida, la página del
// libro y la hoja de acciones. Ocupa exactamente el alto del celular.

const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
/** Si pasó más que esto desde la última jugada, se muestra el resumen al entrar. */
const PAUSA_LARGA_MS = 10 * 60 * 1000;

function BarraSuperior({ sala, alAbrir }: { sala: SalaEnVivo; alAbrir: (p: Pestana) => void }) {
  const { vista, asientos } = sala.snap!;
  const turnosRestantes = Math.max(0, vista.escena.tope - vista.escena.turnos);
  const enLinea = (a: Asiento) => a === vista.yo || (sala.vivo ? sala.presentes.includes(a) : !!asientos[a]?.activo);
  const mesaGrande = vista.campana.max > 2;

  return (
    <header className="barra-superior shrink-0 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => alAbrir("hoja")}
          className="grid size-10 shrink-0 place-items-center rounded-md border border-bruma/30 text-ambar-claro"
          aria-label="Abrir el libro: hoja, diario y sala"
        >
          <IconoLibro tam={21} />
        </button>
        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => alAbrir("diario")}>
          <p className="versalitas truncate text-bruma">
            capítulo {ROMANOS[vista.capitulo.numero - 1]} · escena {ROMANOS[vista.escena.numero - 1]}
          </p>
          <p className="titulo line-clamp-2 text-[1.02rem] leading-[1.15] text-hueso">{vista.escena.titulo}</p>
        </button>
        <div className="shrink-0 text-right">
          <MedidorAmenaza valor={vista.amenaza} />
          {vista.fase === "jugando" && !vista.voto && (
            <p
              className="mt-1 flex items-center justify-end gap-1 text-[0.7rem] text-bruma"
              title={`Avance de la escena: ${vista.escena.avance} de ${vista.escena.meta}`}
            >
              {Array.from({ length: vista.escena.meta }, (_, i) => (
                <span
                  key={i}
                  className={`size-2 rotate-45 ${i < vista.escena.avance ? "bg-ambar" : "border border-bruma/60"}`}
                />
              ))}
              <span className="ml-1 tabular-nums">
                {turnosRestantes === 1 ? "1 turno" : `${turnosRestantes} turnos`}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className={`mt-2 grid ${mesaGrande ? "grid-cols-3 gap-1.5" : "grid-cols-2 gap-2"}`}>
        {ASIENTOS.map((a) => {
          const p = vista.personajes[a];
          if (!p) return mesaGrande ? null : <div key={a} />;
          const conFarol = vista.farol === a && vista.fase === "jugando";
          return (
            <button
              key={a}
              type="button"
              onClick={() => alAbrir("hoja")}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-left text-[0.92rem] ${
                conFarol ? "border-ambar/70 bg-ambar/10" : "border-bruma/25"
              } ${p.quebrado || vista.yaActuaron.includes(a) ? "opacity-55" : ""}`}
            >
              <span
                className={`shrink-0 rounded-full ${enLinea(a) ? "" : "opacity-45 grayscale"}`}
                style={{ boxShadow: `0 0 0 1.5px ${COLOR_JUGADOR[a]}` }}
                title={enLinea(a) ? "En la sala" : "Desconectado"}
              >
                <Avatar avatar={p.avatar} raza={p.raza} clase={p.clase} retrato={p.retrato.url} tam={26} emblema={false} className="block" />
              </span>
              <span className={`min-w-0 flex-1 truncate ${a === vista.yo ? "text-ambar-claro" : ""}`}>{p.nombre}</span>
              {conFarol && <IconoFarol tam={15} className="resplandor shrink-0 text-ambar" />}
              {mesaGrande ? (
                <span className="shrink-0 text-[0.8rem] tabular-nums text-bruma">{p.vida}</span>
              ) : (
                <Vida vida={p.vida} max={p.vidaMax} compacta />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}

function FinDeCapitulo({ vista }: { vista: Vista }) {
  const siguiente = ROMANOS[vista.capitulo.numero];
  return (
    <section className="aparecer mt-8 text-center">
      <Ornamento className="mb-5 text-sepia" />
      <p className="versalitas text-sepia">fin del capítulo {ROMANOS[vista.capitulo.numero - 1]}</p>
      <h2 className="titulo text-[1.8rem]">{vista.capitulo.titulo}</h2>
      <dl className="mx-auto mt-4 grid max-w-xs grid-cols-3 gap-2">
        <div className="tarjeta px-1 py-2">
          <dt className="versalitas text-sepia">pistas</dt>
          <dd className="titulo text-2xl tabular-nums">
            {vista.pistas.length}/{vista.pistasTotales}
          </dd>
        </div>
        <div className="tarjeta px-1 py-2">
          <dt className="versalitas text-sepia">la bruma</dt>
          <dd className="titulo text-2xl tabular-nums">{vista.amenaza}</dd>
        </div>
        <div className="tarjeta px-1 py-2">
          <dt className="versalitas text-sepia">aliados</dt>
          <dd className="titulo text-2xl tabular-nums">{vista.npcs.filter((n) => n.relacion >= 2).length}</dd>
        </div>
      </dl>
      {(vista.capitulo.final ? [] : vista.mejoras).map((m) => (
        <p key={m.id} className="mt-4 text-[1.05rem] leading-snug">
          <span className="titulo block text-lg">{m.titulo}</span>
          <span className="italic text-sepia">{m.efecto}</span>
        </p>
      ))}
      {vista.encargo && (
        <p className="mt-5 text-[1.05rem] leading-snug">
          <span className="versalitas block text-sepia">tu encargo (solo vos lo ves)</span>
          <span className="cuento italic">{vista.encargo.texto}</span>
          <span className={`titulo block text-lg ${vista.encargo.cumplido ? "text-musgo" : "text-sangre"}`}>
            {vista.encargo.cumplido ? "Cumplido" : "No se cumplió"}
          </span>
        </p>
      )}
      {vista.capitulo.final && vista.desenlace && (
        <p className="mt-5 text-[1.05rem] leading-snug">
          <span className="versalitas block text-sepia">eligieron</span>
          <span className="titulo text-xl">{vista.desenlace}</span>
        </p>
      )}
      <p className="cuento mt-6 text-2xl italic text-sangre">{vista.capitulo.final ? "Fin" : "Continuará…"}</p>
      <p className="mt-1 text-[0.95rem] italic text-sepia">
        {vista.capitulo.final
          ? `Así termina «${vista.campana.titulo}». La partida queda guardada para releerla.`
          : vista.hayOtroCapitulo
          ? `La partida queda guardada. Pueden seguir ahora con el capítulo ${siguiente} o volver otro día.`
          : `La partida queda guardada. El capítulo ${siguiente} llega en la próxima versión.`}
      </p>
    </section>
  );
}

function Anteriormente({ vista, alCerrar }: { vista: Vista; alCerrar: () => void }) {
  const ultima = [...vista.entradas].reverse().find((e) => e.tipo === "narracion");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#06070fcc] p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="anteriormente" className="pergamino pergamino-filete aparecer max-h-[85dvh] w-full max-w-md overflow-y-auto p-6">
        <h2 id="anteriormente" className="titulo text-center text-[1.8rem]">
          Anteriormente…
        </h2>
        <Ornamento className="my-3 text-sepia" />
        {vista.resumenes.length > 0 ? (
          <ol className="space-y-3">
            {vista.resumenes.map((r) => (
              <li key={`${r.capitulo}-${r.escena}`}>
                <p className="versalitas text-sepia">{r.titulo}</p>
                <p className="text-[1.08rem] leading-snug">{r.texto}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[1.08rem] italic leading-snug text-sepia">La historia recién empezaba.</p>
        )}
        {ultima?.tipo === "narracion" && (
          <>
            <p className="versalitas mt-4 text-sepia">lo último que pasó</p>
            <p className="cuento line-clamp-6 text-[1.05rem] italic leading-snug">{ultima.texto}</p>
          </>
        )}
        <button type="button" className="boton boton-tinta mt-5 w-full" onClick={alCerrar} autoFocus>
          Seguir la historia
        </button>
      </div>
    </div>
  );
}

export function Juego({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  const [libro, setLibro] = useState<Pestana | null>(null);
  const [resumen, setResumen] = useState(() => vista.turno > 0 && Date.now() - vista.actualizado > PAUSA_LARGA_MS);

  // La bruma del fondo se espesa con la amenaza.
  useEffect(() => {
    document.documentElement.style.setProperty("--amenaza", String(vista.amenaza));
    return () => {
      document.documentElement.style.removeProperty("--amenaza");
    };
  }, [vista.amenaza]);

  const terminado = vista.fase === "fin_capitulo" && !vista.voto && !vista.pendiente && !vista.narrando;
  const quien = sala.dado ? (vista.personajes[sala.dado.asiento]?.nombre ?? "Alguien") : "";
  const portador = vista.personajes[vista.farol];

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col">
      <BarraSuperior sala={sala} alAbrir={setLibro} />
      <Historia
        vista={vista}
        narracion={sala.narracion}
        espera={sala.espera}
        pensando={sala.pensando}
        pie={terminado ? <FinDeCapitulo vista={vista} /> : null}
      />
      {terminado ? (
        <div className="hoja-inferior flex shrink-0 flex-col gap-2 px-3.5 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3">
          {sala.error && (
            <p className="text-center text-[1.02rem] leading-snug text-hueso" role="alert">
              {sala.error}
            </p>
          )}
          {vista.hayOtroCapitulo && (
            <button
              type="button"
              className="boton boton-vela w-full"
              disabled={sala.enviando}
              onClick={() => void sala.turno({ tipo: "capitulo" })}
            >
              {sala.enviando ? "Abriendo el capítulo…" : `Empezar el capítulo ${ROMANOS[vista.capitulo.numero]}`}
            </button>
          )}
          <Link href="/" className="boton boton-noche w-full">
            Volver a la portada
          </Link>
        </div>
      ) : (
        <Acciones sala={sala} />
      )}

      {libro && <Libro sala={sala} inicial={libro} alCerrar={() => setLibro(null)} />}
      {resumen && <Anteriormente vista={vista} alCerrar={() => setResumen(false)} />}
      {sala.dado && <DadoEnVivo key={sala.dado.entrada} tirada={sala.dado.tirada} quien={quien} alCerrar={sala.cerrarDado} />}
      <span className="sr-only" aria-live="polite">
        {portador && vista.farol !== vista.yo ? `Turno de ${portador.nombre}` : "Tu turno"}
      </span>
    </div>
  );
}
