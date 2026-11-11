"use client";

import { useState } from "react";
import type { SalaEnVivo } from "@/lib/client/useSala";
import { CD, NOMBRE_ATRIBUTO, NOMBRE_DIFICULTAD, NOMBRE_ENFOQUE } from "@/lib/game/contenido";
import { otroAsiento, type Opcion, type TiradaPedida } from "@/lib/game/tipos";
import type { Vista, VotoVista } from "@/lib/game/vista";
import { D20 } from "./Dado";
import { conSigno, efectoDe, usosDe } from "./Hoja";
import { ICONO_ENFOQUE, IconoFarol, Puntos } from "./ui";

// La hoja inferior: lo que el jugador puede hacer ahora. Cambia según el
// estado de la partida: elegir una acción, tirar el dado, votar o esperar.

const cdDe = (vista: Vista, pedida: TiradaPedida) => CD[pedida.dificultad] + (vista.amenaza >= 7 ? 1 : 0);

function Encabezado({ children }: { children: React.ReactNode }) {
  return <p className="versalitas mb-2 flex items-center gap-1.5 text-bruma">{children}</p>;
}

function TarjetaOpcion({
  opcion,
  vista,
  elegida,
  senalada,
  alTocar,
}: {
  opcion: Opcion;
  vista: Vista;
  elegida: boolean;
  /** Nombre del compañero, si la está señalando. */
  senalada: string | null;
  alTocar: () => void;
}) {
  const Icono = ICONO_ENFOQUE[opcion.enfoque];
  const mio = vista.personajes[vista.farol];
  return (
    <button
      type="button"
      onClick={alTocar}
      aria-pressed={elegida}
      className={`pergamino flex w-full items-start gap-2.5 px-3 py-2 text-left transition-shadow ${
        elegida ? "outline outline-2 outline-ambar [box-shadow:0_0_18px_#e6a93c66]" : ""
      }`}
    >
      <Icono tam={20} className="mt-1 shrink-0 text-sangre" />
      <span className="min-w-0 flex-1">
        <span className="block text-[1.06rem] leading-snug">{opcion.texto}</span>
        <span className="versalitas block text-sepia">
          {NOMBRE_ENFOQUE[opcion.enfoque]} ·{" "}
          {opcion.tirada
            ? `${NOMBRE_ATRIBUTO[opcion.tirada.atributo]} ${mio ? conSigno(mio.atributos[opcion.tirada.atributo]) : ""} · ${NOMBRE_DIFICULTAD[opcion.tirada.dificultad]} ${cdDe(vista, opcion.tirada)}`
            : "sin tirada"}
        </span>
        {senalada && <span className="block text-sm italic text-cardenillo">{senalada} señala esta</span>}
      </span>
    </button>
  );
}

function PanelOpciones({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  const yo = vista.yo;
  const otro = otroAsiento(yo);
  const esMiTurno = vista.farol === yo;
  const portador = vista.personajes[vista.farol];
  const companero = vista.personajes[otro];
  const [elegida, setElegida] = useState<string | null>(null);
  const [libre, setLibre] = useState<string | null>(null);

  const tocar = (id: string) => {
    const nueva = elegida === id ? null : id;
    setElegida(nueva);
    setLibre(null);
    sala.sugerir(nueva);
  };
  const texto = libre?.trim() ?? "";
  const listo = libre !== null ? texto.length >= 3 : !!elegida && vista.opciones.some((o) => o.id === elegida);

  return (
    <div>
      <Encabezado>
        <IconoFarol tam={16} className="resplandor text-ambar" />
        {esMiTurno ? "llevás el farol: ¿qué hacés?" : `${portador?.nombre ?? "tu compañero"} lleva el farol`}
      </Encabezado>

      <div className="space-y-2">
        {vista.opciones.map((o) => (
          <TarjetaOpcion
            key={o.id}
            opcion={o}
            vista={vista}
            elegida={libre === null && elegida === o.id}
            senalada={sala.sugerencia === o.id ? (companero?.nombre ?? "Tu compañero") : null}
            alTocar={() => tocar(o.id)}
          />
        ))}
      </div>

      {esMiTurno ? (
        <>
          {libre !== null && (
            <textarea
              className="campo campo-noche mt-2 min-h-20 resize-none leading-snug"
              value={libre}
              onChange={(e) => setLibre(e.target.value)}
              maxLength={200}
              placeholder="Contá con tus palabras qué hace tu personaje…"
              aria-label="Acción libre"
              autoFocus
            />
          )}
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              className="boton boton-noche"
              onClick={() => {
                setLibre(libre === null ? "" : null);
                setElegida(null);
              }}
            >
              {libre === null ? "Otra cosa…" : "Volver"}
            </button>
            <button
              type="button"
              className="boton boton-vela flex-1"
              disabled={!listo || sala.enviando}
              onClick={() =>
                void sala.turno(libre !== null ? { tipo: "libre", texto } : { tipo: "opcion", id: elegida! })
              }
            >
              Hacerlo
            </button>
          </div>
          {companero && !companero.quebrado && (
            <button
              type="button"
              className="mx-auto mt-2 block text-sm italic text-bruma underline"
              onClick={() => void sala.accion({ tipo: "pasar" })}
            >
              Pasarle el farol a {companero.nombre}
            </button>
          )}
        </>
      ) : (
        <p className="mt-2 text-center text-[0.95rem] italic text-bruma">
          {vista.personajes[yo]?.quebrado
            ? "Tu personaje está fuera de juego hasta que termine la escena."
            : "Tocá una opción para sugerírsela."}
        </p>
      )}
    </div>
  );
}

function Ayuda({ activa, alTocar, children }: { activa: boolean; alTocar: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={alTocar}
      className={`boton min-h-11 w-full justify-start px-3 py-1.5 text-left text-[0.98rem] ${activa ? "boton-vela" : "boton-noche"}`}
    >
      {children}
    </button>
  );
}

function PanelTirada({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  const p = vista.pendiente;
  const [rasgo, setRasgo] = useState(false);
  const [companero, setCompanero] = useState(false);
  const [objeto, setObjeto] = useState<string | null>(null);
  if (p?.tipo !== "accion" || !p.pedida || p.cd === null) return null;

  const mio = p.asiento === vista.yo;
  const actor = vista.personajes[p.asiento];
  const modificador = actor?.atributos[p.pedida.atributo] ?? 0;
  const bono = vista.ayudas.objetos.find((o) => o.id === objeto)?.bono?.valor ?? 0;
  const necesita = Math.max(2, p.cd - modificador - bono);
  const desventaja = vista.amenaza >= 10;

  if (!mio) {
    return (
      <div className="text-center">
        <Encabezado>
          <span className="mx-auto">tirada de {NOMBRE_ATRIBUTO[p.pedida.atributo]}</span>
        </Encabezado>
        <p className="text-[1.05rem] italic text-hueso">
          {actor?.nombre} tiene el dado en la mano <Puntos />
        </p>
      </div>
    );
  }

  return (
    <div>
      <Encabezado>
        tirada de {NOMBRE_ATRIBUTO[p.pedida.atributo]} · {NOMBRE_DIFICULTAD[p.pedida.dificultad]}
      </Encabezado>
      <p className="mb-2.5 text-[1.05rem] leading-snug text-hueso">
        Tenés que llegar a <strong className="text-ambar-claro">{p.cd}</strong>. Con tu {conSigno(modificador + bono)}{" "}
        alcanza un <strong className="text-ambar-claro">{necesita}</strong> o más en el dado.
        {desventaja && <span className="block italic text-brasa">La hora trece: tirás con desventaja.</span>}
      </p>

      {(vista.ayudas.rasgo || vista.ayudas.companero || vista.ayudas.objetos.length > 0) && (
        <div className="mb-2.5 space-y-1.5">
          {vista.ayudas.rasgo && actor && (
            <Ayuda activa={rasgo} alTocar={() => setRasgo(!rasgo)}>
              Invocar tu rasgo: {actor.rasgo} <span className="opacity-70">(ventaja, una vez por capítulo)</span>
            </Ayuda>
          )}
          {vista.ayudas.companero && vista.companero && (
            <Ayuda activa={companero} alTocar={() => setCompanero(!companero)}>
              Pedirle ayuda a {vista.companero.nombre} <span className="opacity-70">(ventaja, una vez por escena)</span>
            </Ayuda>
          )}
          {vista.ayudas.objetos.map((o) => (
            <Ayuda key={o.id} activa={objeto === o.id} alTocar={() => setObjeto(objeto === o.id ? null : o.id)}>
              Usar {o.nombre}{" "}
              <span className="opacity-70">
                ({efectoDe(o)}, {usosDe(o)})
              </span>
            </Ayuda>
          ))}
        </div>
      )}

      <button
        type="button"
        className="boton boton-vela w-full py-2 text-xl"
        disabled={sala.enviando}
        onClick={() => void sala.turno({ tipo: "tirar", rasgo, companero, objeto: objeto ?? undefined })}
      >
        <D20 valor="20" tam={34} />
        Tirar el dado
      </button>
    </div>
  );
}

function PanelVoto({ sala, voto }: { sala: SalaEnVivo; voto: VotoVista }) {
  const vista = sala.snap!.vista;
  const yo = vista.yo;
  const otro = otroAsiento(yo);
  const companero = vista.personajes[otro]?.nombre ?? "tu compañero";
  const [elegida, setElegida] = useState<string | null>(null);
  const [cambiando, setCambiando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const titulo = (id: string | undefined) => voto.opciones.find((o) => o.id === id)?.titulo ?? "—";
  const yaVote = !!voto.miEleccion && !cambiando;

  async function votar() {
    if (!elegida) return;
    setEnviando(true);
    await sala.accion({ tipo: "votar", opcion: elegida });
    setEnviando(false);
    setCambiando(false);
  }

  return (
    <div>
      <Encabezado>decisión de los dos{voto.ronda > 1 ? " · segunda vuelta" : ""}</Encabezado>
      <h3 className="titulo text-[1.35rem] leading-tight text-ambar-claro">{voto.pregunta}</h3>
      <p className="cuento mb-2.5 mt-1 text-[1rem] italic leading-snug text-bruma">{voto.contexto}</p>

      {voto.anteriores && (
        <p className="mb-2.5 rounded-md border border-brasa/50 bg-brasa/10 px-3 py-2 text-[0.95rem] leading-snug">
          No coincidieron: vos elegiste <strong>{titulo(voto.anteriores[yo])}</strong> y {companero},{" "}
          <strong>{titulo(voto.anteriores[otro])}</strong>. Háblenlo y voten otra vez. Si vuelven a diferir, decide{" "}
          {vista.personajes[vista.farol]?.nombre}, que lleva el farol.
        </p>
      )}

      {yaVote ? (
        <div className="text-center">
          <p className="text-[1.05rem] text-hueso">
            Votaste: <strong className="text-ambar-claro">{titulo(voto.miEleccion ?? undefined)}</strong>
          </p>
          <p className="mt-1 italic text-bruma">
            Falta {companero} <Puntos />
          </p>
          <button type="button" className="mt-2 text-sm italic text-bruma underline" onClick={() => setCambiando(true)}>
            Cambiar mi voto
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {voto.opciones.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={elegida === o.id}
                onClick={() => setElegida(o.id)}
                className={`pergamino block w-full px-3 py-2 text-left ${
                  elegida === o.id ? "outline outline-2 outline-ambar [box-shadow:0_0_18px_#e6a93c66]" : ""
                }`}
              >
                <span className="titulo block text-[1.12rem]">{o.titulo}</span>
                <span className="block text-[0.97rem] leading-snug text-sepia">{o.detalle}</span>
              </button>
            ))}
          </div>
          <button type="button" className="boton boton-vela mt-2.5 w-full" disabled={!elegida || enviando} onClick={votar}>
            {enviando ? "Votando…" : "Votar"}
          </button>
          {voto.otroVoto && <p className="mt-1.5 text-center text-sm italic text-bruma">{companero} ya votó.</p>}
        </>
      )}
    </div>
  );
}

export function Acciones({ sala }: { sala: SalaEnVivo }) {
  const vista = sala.snap!.vista;
  const p = vista.pendiente;
  const esperaTirada = p?.tipo === "accion" && !!p.pedida && !p.tirada;
  const ocupado = vista.narrando || sala.enviando;

  let panel: React.ReactNode;
  if (sala.error && !ocupado) {
    panel = (
      <div className="text-center" role="alert">
        <p className="mb-2.5 text-[1.05rem] leading-snug text-hueso">{sala.error}</p>
        <div className="flex gap-2">
          <button type="button" className="boton boton-noche flex-1" onClick={sala.cerrarError}>
            Cerrar
          </button>
          {p && !esperaTirada && (
            <button type="button" className="boton boton-vela flex-1" onClick={() => void sala.turno({ tipo: "continuar" })}>
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  } else if (esperaTirada && !vista.narrando) {
    panel = <PanelTirada key={vista.turno} sala={sala} />;
  } else if (ocupado) {
    panel = (
      <p className="py-1 text-center text-[1.05rem] italic text-bruma" role="status">
        El máster está narrando <Puntos />
      </p>
    );
  } else if (vista.voto) {
    panel = <PanelVoto key={`${vista.voto.id}-${vista.voto.ronda}`} sala={sala} voto={vista.voto} />;
  } else if (p) {
    // Quedó algo sin narrar (tras un voto o un error): cualquiera puede seguir.
    panel = (
      <button type="button" className="boton boton-vela w-full" onClick={() => void sala.turno({ tipo: "continuar" })}>
        Seguir la historia
      </button>
    );
  } else if (vista.fase === "jugando") {
    panel = <PanelOpciones key={vista.turno} sala={sala} />;
  } else {
    return null;
  }

  return (
    <div className="hoja-inferior max-h-[68dvh] shrink-0 overflow-y-auto px-3.5 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3">
      {panel}
    </div>
  );
}
