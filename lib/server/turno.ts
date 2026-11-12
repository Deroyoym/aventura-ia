import "server-only";
import { interpretarAdjudicacion, interpretarSalida, type Adjudicacion } from "@/lib/dm/esquema";
import { narradorGemini } from "@/lib/dm/gemini";
import { extraerNarracion } from "@/lib/dm/narracion-parcial";
import type { Narrador } from "@/lib/dm/narrador";
import { INSTRUCCION_ARBITRO, instruccionSistema, mensajeArbitro, mensajeTurno } from "@/lib/dm/prompt";
import { ErrorNarrador, clasificarError, conReintentos, falloDe, type Fallo } from "@/lib/dm/reintentos";
import { salidaDeRespaldo } from "@/lib/dm/respaldo";
import { narradorSimulado } from "@/lib/dm/simulado";
import {
  aplicarNarracion,
  avanzarRonda,
  empezarCapitulo,
  iniciar,
  limpiar,
  limpiarNarracion,
  planificar,
  prepararAccion,
  tirar,
  validarTurnoDe,
} from "@/lib/game/motor";
import { ErrorJuego, type Asiento, type EstadoJuego, type Plan, type SalidaDM } from "@/lib/game/tipos";
import type { EventoTurno, PeticionTurno } from "@/lib/protocolo";
import { estadoServidor } from "./config";
import { crearDifusor } from "./realtime";
import { estaNarrando, rngServidor, type Acceso } from "./sala";
import { obtenerStore, type Sala } from "./store";

// Orquesta un turno: valida, deja la acción y la tirada guardadas, llama al
// máster en streaming y aplica el resultado. Todo lo que el cliente necesita
// saber sale por `emitir`, un evento por vez.

type Emisor = (evento: EventoTurno) => void;

const narrador = (): Narrador => (estadoServidor().narrador === "gemini" ? narradorGemini : narradorSimulado);

/** Tope de un turno completo. Queda por debajo del `maxDuration` de la route para poder avisar y liberar la sala. */
const LIMITE_TURNO_MS = 100_000;

/** Deja en el log del servidor la causa de cada fallo de la API, se reintente o no. */
const anotarFallo = (etapa: string) => (fallo: Fallo, intento: number) =>
  console.warn(`Gemini (${etapa}, intento ${intento}): ${fallo.codigo} · ${fallo.detalle}`);

const ARBITRAJE_POR_DEFECTO: Adjudicacion = {
  enfoque: "ingenio",
  tirada: { atributo: "ingenio", dificultad: "media" },
  avanza: true,
};

async function guardarOConflicto(sala: Sala, estado: EstadoJuego): Promise<Sala> {
  const guardada = await obtenerStore().guardar(sala, estado);
  if (!guardada) throw new ErrorJuego("conflicto", "Los dos tocaron algo a la vez. Probá de nuevo.", 409);
  return guardada;
}

/** Clasifica una acción escrita a mano. Si el árbitro falla, se usa una tirada media. */
async function arbitrar(
  estado: EstadoJuego,
  asiento: Asiento,
  texto: string,
  emitir: Emisor,
  signal: AbortSignal,
): Promise<Adjudicacion> {
  try {
    const crudo = await conReintentos(
      () =>
        narrador().arbitrar({
          sistema: INSTRUCCION_ARBITRO,
          mensaje: mensajeArbitro(estado, asiento, texto),
          estado,
          asiento,
          texto,
          signal,
        }),
      { intentos: 3, presupuestoMs: 30_000, alFallar: anotarFallo("árbitro"), alEsperar: (ms, intento) => emitir({ t: "espera", segundos: Math.ceil(ms / 1000), intento }) },
    );
    return interpretarAdjudicacion(crudo) ?? ARBITRAJE_POR_DEFECTO;
  } catch (e) {
    // Sin cuota no tiene sentido seguir: la narración fallaría igual.
    if (signal.aborted) throw e;
    const codigo = e instanceof ErrorNarrador ? e.fallo.codigo : "otro";
    if (codigo === "cuota" || codigo === "sin_cuota" || codigo === "config") throw e;
    return ARBITRAJE_POR_DEFECTO;
  }
}

/** Pide la narración en streaming. Devuelve siempre una salida utilizable o lanza ErrorNarrador. */
async function narrar(estado: EstadoJuego, plan: Plan, emitir: Emisor, signal: AbortSignal): Promise<SalidaDM> {
  const sistema = instruccionSistema(estado);
  const mensaje = mensajeTurno(estado, plan);
  let enviado = "";
  const reiniciar = () => {
    if (!enviado) return;
    enviado = "";
    emitir({ t: "reinicio" });
  };

  // Hasta dos respuestas: si la primera no se puede leer, se pide otra.
  for (let lectura = 0; lectura < 2; lectura++) {
    let crudo = "";
    try {
      await conReintentos(
        async () => {
          crudo = "";
          reiniciar();
          for await (const trozo of narrador().narrar({ sistema, mensaje, estado, plan, signal })) {
            crudo += trozo;
            const texto = extraerNarracion(crudo);
            if (texto.length > enviado.length) {
              emitir({ t: "delta", desde: enviado.length, texto: texto.slice(enviado.length) });
              enviado = texto;
            }
          }
        },
        {
          alFallar: anotarFallo("narración"),
          alEsperar: (ms, intento) => emitir({ t: "espera", segundos: Math.ceil(ms / 1000), intento }),
        },
      );
    } catch (e) {
      if (signal.aborted) throw e;
      const fallo = clasificarError(e);
      // Un corte del filtro de contenido se trata como respuesta ilegible.
      if (fallo.codigo !== "otro") throw e;
      console.warn("Narración descartada:", fallo.mensaje);
    }
    const salida = interpretarSalida(crudo);
    if (salida) return salida;
    reiniciar();
  }

  // Último recurso: una narración escrita por código, para no trabar la partida.
  const respaldo = salidaDeRespaldo(estado, plan);
  emitir({ t: "delta", desde: 0, texto: respaldo.narracion });
  return respaldo;
}

/** Aplica la narración sobre el estado más reciente (pudo cambiar algo menor mientras se narraba). */
async function cerrarTurno(sala: Sala, plan: Plan, salida: SalidaDM): Promise<Sala> {
  const store = obtenerStore();
  let actual: Sala | null = sala;
  for (let intento = 0; intento < 4 && actual; intento++) {
    const guardada = await store.guardar(actual, aplicarNarracion(actual.estado, plan, salida, Date.now()));
    if (guardada) return guardada;
    actual = await store.obtenerSala(sala.codigo);
  }
  throw new ErrorJuego("conflicto", "No se pudo guardar el turno. Probá de nuevo.", 409);
}

function registrar(sala: Sala, previo: EstadoJuego, plan: Plan, salida: SalidaDM): Promise<void> {
  const p = previo.pendiente;
  return obtenerStore()
    .registrarTurno(sala.id, {
      turno: previo.turno,
      tipo: plan.tipo,
      asiento: p?.tipo === "accion" ? p.asiento : null,
      accion: p?.tipo === "accion" ? p.texto : p?.tipo === "voto" ? `${p.votoId}:${p.opcionId}` : null,
      tirada: p?.tipo === "accion" ? p.tirada : null,
      narracion: limpiarNarracion(salida.narracion),
      salida,
    })
    .catch((e) => console.warn("No se pudo registrar el turno:", e instanceof Error ? e.message : e));
}

function validarPeticion(estado: EstadoJuego, asiento: Asiento, peticion: PeticionTurno): void {
  if (estaNarrando(estado)) throw new ErrorJuego("ocupado", "El máster todavía está narrando.", 409);
  if (peticion.tipo === "opcion" || peticion.tipo === "libre") validarTurnoDe(estado, asiento);
  if (peticion.tipo === "libre" && limpiar(peticion.texto, 200).length < 3) {
    throw new ErrorJuego("texto", "Contá un poco más qué hacés.");
  }
  if (peticion.tipo === "continuar") {
    const p = estado.pendiente;
    if (!p) throw new ErrorJuego("sin_pendiente", "No hay nada para narrar.", 409);
    if (p.tipo === "accion" && p.pedida && !p.tirada) throw new ErrorJuego("falta_tirada", "Falta tirar el dado.", 409);
  }
}

/**
 * Corre el turno completo. Los errores de validación previos al streaming se
 * lanzan (para responder con su código HTTP); a partir de ahí todo se informa
 * por `emitir`.
 */
export function prepararTurno(acceso: Acceso, peticion: PeticionTurno): (emitir: Emisor) => Promise<void> {
  validarPeticion(acceso.sala.estado, acceso.asiento, peticion);

  return async (emitirAlCliente) => {
    const { asiento } = acceso;
    let sala = acceso.sala;
    const difusor = crearDifusor(sala.id);
    // El que actúa lo recibe por HTTP; su compañero, por Broadcast.
    // Pasado el tope se corta el pedido a Gemini y se deja de emitir lo que llegue tarde.
    const corte = new AbortController();
    let vencido = false;
    let reloj: ReturnType<typeof setTimeout> | undefined;
    const vencimiento = new Promise<never>((_, rechazar) => {
      reloj = setTimeout(() => {
        vencido = true;
        rechazar(new ErrorNarrador(falloDe("lento", `sin respuesta en ${LIMITE_TURNO_MS / 1000} s`)));
        corte.abort();
      }, LIMITE_TURNO_MS);
    });
    vencimiento.catch(() => {});
    const conLimite = <T>(trabajo: Promise<T>): Promise<T> => {
      trabajo.catch(() => {});
      return Promise.race([trabajo, vencimiento]);
    };
    const emitirSiempre: Emisor = (evento) => {
      emitirAlCliente(evento);
      if (evento.t === "delta" || evento.t === "reinicio" || evento.t === "espera") difusor.enviar(evento);
    };
    const emitir: Emisor = (evento) => {
      if (!vencido) emitirSiempre(evento);
    };
    const avisarEstado = () => difusor.enviar({ t: "estado", version: sala.version });
    const ahora = () => Date.now();

    try {
      let estado = sala.estado;

      if (peticion.tipo === "inicio") {
        estado = iniciar(estado, ahora());
      } else if (peticion.tipo === "capitulo") {
        estado = empezarCapitulo(estado, ahora());
      } else if (peticion.tipo === "opcion") {
        estado = prepararAccion(estado, asiento, { tipo: "opcion", id: peticion.id }, ahora());
      } else if (peticion.tipo === "libre") {
        // Se bloquea la sala mientras el árbitro clasifica la acción.
        sala = await guardarOConflicto(sala, { ...estado, narrando: ahora() });
        avisarEstado();
        emitir({ t: "pensando" });
        const veredicto = await conLimite(arbitrar(estado, asiento, peticion.texto, emitir, corte.signal));
        estado = prepararAccion(estado, asiento, { tipo: "libre", texto: peticion.texto, ...veredicto }, ahora());
      } else if (peticion.tipo === "tirar") {
        estado = tirar(
          estado,
          asiento,
          { rasgo: peticion.rasgo, companero: peticion.companero, objeto: peticion.objeto },
          rngServidor,
          ahora(),
        );
        const entrada = estado.entradas[estado.entradas.length - 1];
        if (entrada?.tipo === "tirada") emitir({ t: "tirada", entrada: entrada.id, tirada: entrada.tirada });
      }

      // Una acción con tirada queda guardada a la espera del dado.
      // Por rondas: la acción resuelta espera a las de los demás, sin narración todavía.
      estado = avanzarRonda(estado, ahora());
      if (!estado.pendiente && (peticion.tipo === "opcion" || peticion.tipo === "libre" || peticion.tipo === "tirar")) {
        sala = await guardarOConflicto(sala, { ...estado, narrando: null });
        avisarEstado();
        emitir({ t: "fin", version: sala.version });
        return;
      }

      const p = estado.pendiente;
      if (p?.tipo === "accion" && p.pedida && !p.tirada) {
        sala = await guardarOConflicto(sala, { ...estado, narrando: null });
        avisarEstado();
        emitir({ t: "pendiente" });
        return;
      }

      // Acción y tirada quedan guardadas antes de llamar al modelo: un reintento no vuelve a tirar.
      sala = await guardarOConflicto(sala, { ...estado, narrando: ahora() });
      avisarEstado();

      const previo = sala.estado;
      const plan = planificar(previo);
      const salida = await conLimite(narrar(previo, plan, emitir, corte.signal));
      sala = await cerrarTurno(sala, plan, salida);
      await registrar(sala, previo, plan, salida);
      avisarEstado();
      emitir({ t: "fin", version: sala.version });
    } catch (e) {
      // Se libera el bloqueo para que cualquiera de los dos pueda reintentar.
      const actual = await obtenerStore().obtenerSala(sala.codigo).catch(() => null);
      if (actual?.estado.narrando) {
        const liberada = await obtenerStore()
          .guardar(actual, { ...actual.estado, narrando: null })
          .catch(() => null);
        if (liberada) sala = liberada;
      }
      avisarEstado();
      if (e instanceof ErrorJuego) emitirSiempre({ t: "error", codigo: e.codigo, mensaje: e.message });
      else {
        const fallo = clasificarError(e);
        if (fallo.codigo === "otro") console.error("Turno fallido:", e);
        else console.warn(`Turno fallido: ${fallo.codigo} · ${fallo.detalle}`);
        emitirSiempre({ t: "error", codigo: fallo.codigo, mensaje: fallo.mensaje });
      }
    } finally {
      clearTimeout(reloj);
      await difusor.cerrar();
    }
  };
}
