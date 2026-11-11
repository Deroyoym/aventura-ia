"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { Asiento, Tirada } from "@/lib/game/tipos";
import type {
  EventoSala,
  EventoTurno,
  InfoPublica,
  Instantanea,
  PeticionAccion,
  PeticionPersonaje,
  PeticionTurno,
} from "@/lib/protocolo";
import { anotarSala, guardarSala, olvidarSala, salaGuardada, type SalaGuardada } from "./almacenamiento";
import { ErrorDeApi, api } from "./api";
import { conectarSala, type ConexionSala } from "./realtime";

// Estado de una sala en el navegador. La verdad es el snapshot del servidor;
// el canal de Realtime solo trae la narración en vivo y el aviso de "cambió
// algo". Si el canal no está, se sondea el snapshot cada pocos segundos.

const SONDEO_VIVO_MS = 10_000;
const SONDEO_MS = 4_000;
const SONDEO_NARRANDO_MS = 1_500;

export interface DadoEnPantalla {
  entrada: number;
  asiento: Asiento;
  tirada: Tirada;
}

interface EstadoSala {
  carga: "cargando" | "lista" | "sin_acceso" | "sin_sala" | "error";
  snap: Instantanea | null;
  publica: InfoPublica | null;
  /** Narración que está llegando en este momento. */
  narracion: string;
  /** El máster está reintentando tras un límite de la API. */
  espera: { hasta: number; intento: number } | null;
  enviando: boolean;
  pensando: boolean;
  dado: DadoEnPantalla | null;
  /** Id de la última tirada ya mostrada, para no animarla dos veces. */
  tiradaVista: number;
  error: string | null;
  /** Opción que marcó el compañero. */
  sugerencia: string | null;
  vivo: boolean;
  presentes: Asiento[];
}

type Accion =
  | { tipo: "snap"; snap: Instantanea }
  | { tipo: "acceso"; carga: "sin_acceso" | "sin_sala"; publica: InfoPublica | null }
  | { tipo: "fallo"; mensaje: string }
  | { tipo: "evento"; evento: EventoTurno | EventoSala; origen: "http" | "canal" }
  | { tipo: "enviando"; valor: boolean }
  | { tipo: "conexion"; vivo: boolean; presentes: Asiento[] }
  | { tipo: "cerrar_dado" }
  | { tipo: "cerrar_error" };

const INICIAL: EstadoSala = {
  carga: "cargando",
  snap: null,
  publica: null,
  narracion: "",
  espera: null,
  enviando: false,
  pensando: false,
  dado: null,
  tiradaVista: 0,
  error: null,
  sugerencia: null,
  vivo: false,
  presentes: [],
};

function conSnap(s: EstadoSala, snap: Instantanea): EstadoSala {
  // Un snapshot más viejo que el que ya tenemos se descarta.
  if (s.snap && snap.version < s.snap.version) return s;
  const tiradas = snap.vista.entradas.filter((e) => e.tipo === "tirada");
  const ultima = tiradas[tiradas.length - 1];
  const esNueva = !!s.snap && !!ultima && ultima.id > s.tiradaVista;
  const cambioTurno = s.snap?.vista.turno !== snap.vista.turno || !!snap.vista.pendiente;
  const narrando = snap.vista.narrando;
  return {
    ...s,
    carga: "lista",
    snap,
    publica: null,
    narracion: narrando ? s.narracion : "",
    espera: narrando ? s.espera : null,
    pensando: narrando ? s.pensando : false,
    dado: esNueva && ultima.tipo === "tirada" ? { entrada: ultima.id, asiento: ultima.asiento, tirada: ultima.tirada } : s.dado,
    tiradaVista: Math.max(s.tiradaVista, ultima?.id ?? 0),
    sugerencia: cambioTurno ? null : s.sugerencia,
  };
}

function conEvento(s: EstadoSala, evento: EventoTurno | EventoSala, origen: "http" | "canal"): EstadoSala {
  const yo = s.snap?.vista.yo;
  // Mientras llega mi propio turno por HTTP, lo mismo por el canal sería un duplicado.
  const duplicado = origen === "canal" && s.enviando;
  switch (evento.t) {
    case "delta": {
      if (duplicado) return s;
      const largo = s.narracion.length;
      // Deltas repetidos o fuera de orden: se aplica solo la parte que falta.
      if (evento.desde > largo || evento.desde + evento.texto.length <= largo) return s;
      return { ...s, narracion: s.narracion + evento.texto.slice(largo - evento.desde), espera: null, pensando: false };
    }
    case "reinicio":
      return duplicado ? s : { ...s, narracion: "" };
    case "espera":
      return duplicado ? s : { ...s, espera: { hasta: Date.now() + evento.segundos * 1000, intento: evento.intento } };
    case "pensando":
      return { ...s, pensando: true };
    case "tirada":
      return yo
        ? {
            ...s,
            dado: { entrada: evento.entrada, asiento: yo, tirada: evento.tirada },
            tiradaVista: Math.max(s.tiradaVista, evento.entrada),
          }
        : s;
    case "error":
      return { ...s, error: evento.mensaje, pensando: false, espera: null };
    case "sugerencia":
      return evento.asiento === yo ? s : { ...s, sugerencia: evento.opcion };
    default:
      return s;
  }
}

function reductor(s: EstadoSala, a: Accion): EstadoSala {
  switch (a.tipo) {
    case "snap":
      return conSnap(s, a.snap);
    case "acceso":
      return { ...INICIAL, carga: a.carga, publica: a.publica };
    case "fallo":
      return s.snap ? s : { ...s, carga: "error", error: a.mensaje };
    case "evento":
      return conEvento(s, a.evento, a.origen);
    case "enviando":
      return { ...s, enviando: a.valor, error: a.valor ? null : s.error };
    case "conexion":
      return { ...s, vivo: a.vivo, presentes: a.presentes };
    case "cerrar_dado":
      return { ...s, dado: null };
    case "cerrar_error":
      return { ...s, error: null };
  }
}

export function useSala(codigo: string) {
  const [s, despachar] = useReducer(reductor, INICIAL);
  const credencial = useRef<SalaGuardada | null>(null);
  const conexion = useRef<ConexionSala | null>(null);
  const version = useRef(0);

  const refrescar = useCallback(async () => {
    credencial.current ??= salaGuardada(codigo);
    try {
      const snap = await api.instantanea(codigo, credencial.current?.token ?? null);
      version.current = Math.max(version.current, snap.version);
      despachar({ tipo: "snap", snap });
    } catch (e) {
      if (!(e instanceof ErrorDeApi)) return;
      if (e.estado === 401) {
        // El token ya no vale (p. ej. el personaje se abrió en otro dispositivo).
        if (credencial.current) olvidarSala(codigo);
        credencial.current = null;
        despachar({ tipo: "acceso", carga: "sin_acceso", publica: e.datos.publica ?? null });
      } else if (e.estado === 404) {
        despachar({ tipo: "acceso", carga: "sin_sala", publica: null });
      } else {
        despachar({ tipo: "fallo", mensaje: e.message });
      }
    }
  }, [codigo]);

  // Carga inicial y puesta al día al volver a la pestaña o recuperar la red.
  useEffect(() => {
    void refrescar();
    const alVolver = () => {
      if (document.visibilityState === "visible") void refrescar();
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("online", alVolver);
    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("online", alVolver);
    };
  }, [refrescar]);

  // Sondeo: lento si el canal está vivo, rápido si no (y más mientras se narra).
  const lista = s.carga === "lista";
  const narrando = !!s.snap?.vista.narrando;
  useEffect(() => {
    if (!lista) return;
    const cada = s.vivo ? SONDEO_VIVO_MS : narrando ? SONDEO_NARRANDO_MS : SONDEO_MS;
    const id = setInterval(() => void refrescar(), cada);
    return () => clearInterval(id);
  }, [lista, s.vivo, narrando, refrescar]);

  // Canal de la sala.
  const salaId = s.snap?.salaId;
  const yo = s.snap?.vista.yo;
  useEffect(() => {
    if (!salaId || !yo) return;
    const c = conectarSala(
      salaId,
      yo,
      (evento) => {
        if (evento.t === "estado") {
          if (evento.version > version.current) void refrescar();
        } else {
          despachar({ tipo: "evento", evento, origen: "canal" });
        }
      },
      ({ vivo, presentes }) => {
        despachar({ tipo: "conexion", vivo, presentes });
        if (vivo) void refrescar();
      },
    );
    conexion.current = c;
    return () => {
      c?.cerrar();
      conexion.current = null;
    };
  }, [salaId, yo, refrescar]);

  // Datos para la lista de partidas guardadas de la portada.
  const personaje = yo ? (s.snap?.vista.personajes[yo]?.nombre ?? null) : null;
  const capitulo = s.snap?.vista.fase === "preparacion" ? null : (s.snap?.vista.capitulo.titulo ?? null);
  useEffect(() => {
    if (lista) anotarSala(codigo, { personaje, capitulo });
  }, [lista, codigo, personaje, capitulo]);

  const turno = useCallback(
    async (peticion: PeticionTurno) => {
      const token = credencial.current?.token;
      if (!token) return;
      despachar({ tipo: "enviando", valor: true });
      try {
        await api.turno(codigo, token, peticion, (evento) => {
          if (evento.t !== "fin" && evento.t !== "pendiente") despachar({ tipo: "evento", evento, origen: "http" });
        });
      } catch (e) {
        const mensaje = e instanceof Error ? e.message : "Algo salió mal.";
        despachar({ tipo: "evento", evento: { t: "error", codigo: "pedido", mensaje }, origen: "http" });
      }
      await refrescar();
      despachar({ tipo: "enviando", valor: false });
    },
    [codigo, refrescar],
  );

  const accion = useCallback(
    async (peticion: PeticionAccion) => {
      const token = credencial.current?.token;
      if (!token) return;
      try {
        const { narrar } = await api.accion(codigo, token, peticion);
        if (narrar) await turno({ tipo: "continuar" });
        else await refrescar();
      } catch (e) {
        const mensaje = e instanceof Error ? e.message : "Algo salió mal.";
        despachar({ tipo: "evento", evento: { t: "error", codigo: "pedido", mensaje }, origen: "http" });
        await refrescar();
      }
    },
    [codigo, turno, refrescar],
  );

  /** Lanza ErrorDeApi para que el formulario muestre el motivo. */
  const guardarPersonaje = useCallback(
    async (datos: PeticionPersonaje) => {
      const token = credencial.current?.token;
      if (!token) return;
      await api.personaje(codigo, token, datos);
      await refrescar();
    },
    [codigo, refrescar],
  );

  /** Lanza ErrorDeApi si la sala está llena o el personaje está en uso. */
  const unirse = useCallback(
    async (reclamar?: Asiento) => {
      const cred = await api.unirse(codigo, reclamar);
      guardarSala(cred);
      credencial.current = salaGuardada(cred.codigo);
      await refrescar();
    },
    [codigo, refrescar],
  );

  const sugerir = useCallback(
    (opcion: string | null) => {
      if (yo) conexion.current?.enviar({ t: "sugerencia", asiento: yo, opcion });
    },
    [yo],
  );

  return {
    ...s,
    refrescar,
    turno,
    accion,
    guardarPersonaje,
    unirse,
    sugerir,
    cerrarDado: useCallback(() => despachar({ tipo: "cerrar_dado" }), []),
    cerrarError: useCallback(() => despachar({ tipo: "cerrar_error" }), []),
  };
}

export type SalaEnVivo = ReturnType<typeof useSala>;
