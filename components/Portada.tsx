"use client";

import { CAMPANAS_PUBLICAS } from "@/lib/game/contenido";
import type { CampanaId } from "@/lib/game/tipos";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  guardarSala,
  leerSalasGuardadas,
  olvidarSala,
  sinSalasGuardadas,
  suscribirSalasGuardadas,
} from "@/lib/client/almacenamiento";
import { api } from "@/lib/client/api";
import { DESCRIPCION_TERROR, NOMBRE_TERROR } from "@/lib/game/contenido";
import { NIVELES_TERROR, type NivelTerror } from "@/lib/game/tipos";
import { LARGO_CODIGO, normalizarCodigo, type EstadoServidor } from "@/lib/protocolo";
import { IconoCerrar, Ornamento } from "./ui";
import { Vineta } from "./Vineta";

export function SelectorTerror({
  valor,
  alCambiar,
  permitidos = NIVELES_TERROR,
}: {
  valor: NivelTerror;
  alCambiar: (nivel: NivelTerror) => void;
  permitidos?: readonly NivelTerror[];
}) {
  return (
    <fieldset>
      <legend className="versalitas mb-1.5 text-sepia">Intensidad del terror</legend>
      <div className="grid grid-cols-3 gap-1.5">
        {NIVELES_TERROR.map((nivel) => (
          <button
            key={nivel}
            type="button"
            disabled={!permitidos.includes(nivel)}
            aria-pressed={valor === nivel}
            onClick={() => alCambiar(nivel)}
            className={`tarjeta min-h-11 px-2 py-1.5 text-center disabled:opacity-35 ${valor === nivel ? "tarjeta-elegida" : ""}`}
          >
            <span className="titulo text-base">{NOMBRE_TERROR[nivel]}</span>
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[0.95rem] italic leading-snug text-sepia">{DESCRIPCION_TERROR[valor]}</p>
    </fieldset>
  );
}

export function Portada() {
  const router = useRouter();
  const guardadas = useSyncExternalStore(suscribirSalasGuardadas, leerSalasGuardadas, sinSalasGuardadas);
  const [, refrescarLista] = useState(0);
  const [terror, setTerror] = useState<NivelTerror>("media");
  const [campana, setCampana] = useState<CampanaId>("trece");
  const elegida = CAMPANAS_PUBLICAS.find((c) => c.id === campana)!;
  const [codigo, setCodigo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servidor, setServidor] = useState<EstadoServidor | null>(null);

  useEffect(() => {
    api.estado().then(setServidor, () => {});
  }, []);

  async function crear() {
    setOcupado(true);
    setError(null);
    try {
      const credencial = await api.crearSala(terror, campana);
      guardarSala(credencial);
      router.push(`/sala/${credencial.codigo}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo abrir la sala.");
      setOcupado(false);
    }
  }

  const codigoListo = codigo.length === LARGO_CODIGO;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="aparecer text-center">
        <Vineta key={elegida.id} lugar={elegida.lugar} className="aparecer mx-auto max-w-[19rem]" />
        <p className="versalitas mt-4 text-bruma">{elegida.bajada}</p>
        <h1 className="titulo mt-1 text-[2.9rem] leading-none text-ambar-claro [text-shadow:0_0_26px_#e6a93c55]">
          {elegida.titulo}
        </h1>
        <p className="cuento mx-auto mt-2 max-w-[20rem] text-[1.05rem] italic leading-snug text-bruma">
          {elegida.premisa}
        </p>
      </header>

      {servidor && !servidor.listo && (
        <p role="alert" className="rounded-md border border-brasa/60 bg-brasa/15 px-3 py-2 text-[0.95rem] leading-snug">
          Falta configurar el servidor: <strong>{servidor.faltan.join(", ")}</strong>. Cargá esas variables en Vercel y
          volvé a desplegar.
        </p>
      )}

      <section className="pergamino pergamino-filete aparecer space-y-4 p-5">
        <h2 className="titulo text-center text-2xl">Abrir una sala</h2>
        <fieldset>
          <legend className="versalitas mb-1.5 text-sepia">Historia</legend>
          <div className="grid grid-cols-2 gap-2">
            {CAMPANAS_PUBLICAS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={campana === c.id}
                onClick={() => setCampana(c.id)}
                className={`tarjeta px-2 py-2 text-center leading-tight ${
                  campana === c.id ? "outline outline-2 outline-sangre" : ""
                }`}
              >
                <span className="titulo block text-[1.05rem]">{c.titulo}</span>
                <span className="block text-[0.85rem] italic text-sepia">{c.jugadores}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <SelectorTerror valor={terror} alCambiar={setTerror} />
        <button type="button" className="boton boton-tinta w-full" disabled={ocupado} onClick={crear}>
          {ocupado ? "Abriendo…" : "Abrir una sala nueva"}
        </button>

        <Ornamento className="text-sepia" />

        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (codigoListo) router.push(`/sala/${codigo}`);
          }}
        >
          <label htmlFor="codigo" className="titulo block text-center text-xl">
            ¿Te pasaron un código?
          </label>
          <div className="flex gap-2">
            <input
              id="codigo"
              className="campo titulo text-center text-2xl tracking-[0.3em]"
              value={codigo}
              onChange={(e) => setCodigo(normalizarCodigo(e.target.value))}
              placeholder="·····"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={LARGO_CODIGO}
              aria-label="Código de sala"
            />
            <button type="submit" className="boton boton-sepia shrink-0" disabled={!codigoListo}>
              Entrar
            </button>
          </div>
        </form>

        {error && (
          <p role="alert" className="text-center text-[0.95rem] text-sangre">
            {error}
          </p>
        )}
      </section>

      {guardadas.length > 0 && (
        <section className="aparecer space-y-2">
          <h2 className="versalitas text-center text-bruma">partidas en este celular</h2>
          <ul className="space-y-2">
            {guardadas.map((s) => (
              <li key={s.codigo} className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/sala/${s.codigo}`)}
                  className="boton boton-noche min-w-0 flex-1 justify-between text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate">{s.personaje ?? "Sin personaje todavía"}</span>
                    <span className="block truncate font-[family-name:var(--font-texto)] text-sm italic tracking-normal text-bruma">
                      {s.capitulo ?? "Preparando la partida"}
                    </span>
                  </span>
                  <span className="tracking-[0.2em] text-ambar-claro">{s.codigo}</span>
                </button>
                <button
                  type="button"
                  className="boton boton-noche px-3"
                  aria-label={`Quitar la sala ${s.codigo} de este celular`}
                  onClick={() => {
                    olvidarSala(s.codigo);
                    refrescarLista((n) => n + 1);
                  }}
                >
                  <IconoCerrar tam={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {servidor?.listo && servidor.narrador === "simulado" && (
        <p className="text-center text-sm italic text-bruma">
          Modo local: narrador simulado{servidor.almacen === "memoria" ? " y partidas en memoria" : ""}.
        </p>
      )}
    </main>
  );
}
