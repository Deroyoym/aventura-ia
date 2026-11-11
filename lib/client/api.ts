import {
  CABECERA_TOKEN,
  type Credencial,
  type ErrorApi,
  type EstadoServidor,
  type EventoTurno,
  type Instantanea,
  type PeticionAccion,
  type PeticionPersonaje,
  type PeticionTurno,
  type RespuestaAccion,
} from "@/lib/protocolo";

// Llamadas del navegador a las routes. Los errores del servidor llegan como
// ErrorDeApi, con su código para que la interfaz decida qué mostrar.

export class ErrorDeApi extends Error {
  constructor(
    public estado: number,
    public datos: ErrorApi,
  ) {
    super(datos.mensaje);
    this.name = "ErrorDeApi";
  }
}

const SIN_CONEXION: ErrorApi = { codigo: "red", mensaje: "No hay conexión con el servidor." };

async function pedir(ruta: string, opciones: { token?: string | null; cuerpo?: unknown } = {}): Promise<Response> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: opciones.cuerpo === undefined ? "GET" : "POST",
      headers: {
        ...(opciones.cuerpo === undefined ? {} : { "Content-Type": "application/json" }),
        ...(opciones.token ? { [CABECERA_TOKEN]: opciones.token } : {}),
      },
      body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
      cache: "no-store",
    });
  } catch {
    throw new ErrorDeApi(0, SIN_CONEXION);
  }
  if (respuesta.ok) return respuesta;
  const datos = (await respuesta.json().catch(() => null)) as ErrorApi | null;
  throw new ErrorDeApi(
    respuesta.status,
    datos?.mensaje ? datos : { codigo: "interno", mensaje: "El servidor respondió con un error." },
  );
}

const json = async <T>(r: Promise<Response>): Promise<T> => (await (await r).json()) as T;
const sala = (codigo: string, resto = "") => `/api/salas/${encodeURIComponent(codigo)}${resto}`;

export const api = {
  estado: () => json<EstadoServidor>(pedir("/api/estado")),
  crearSala: (terror: string) => json<Credencial>(pedir("/api/salas", { cuerpo: { terror } })),
  unirse: (codigo: string, reclamar?: number) =>
    json<Credencial>(pedir(sala(codigo, "/unirse"), { cuerpo: { reclamar } })),
  instantanea: (codigo: string, token: string | null) => json<Instantanea>(pedir(sala(codigo), { token })),
  personaje: (codigo: string, token: string, datos: PeticionPersonaje) =>
    json<{ ok: true }>(pedir(sala(codigo, "/personaje"), { token, cuerpo: datos })),
  accion: (codigo: string, token: string, peticion: PeticionAccion) =>
    json<RespuestaAccion>(pedir(sala(codigo, "/accion"), { token, cuerpo: peticion })),

  /** Pide un turno y entrega los eventos del máster a medida que llegan. */
  async turno(
    codigo: string,
    token: string,
    peticion: PeticionTurno,
    alEvento: (evento: EventoTurno) => void,
  ): Promise<void> {
    const respuesta = await pedir(sala(codigo, "/turno"), { token, cuerpo: peticion });
    const lector = respuesta.body?.getReader();
    if (!lector) throw new ErrorDeApi(0, SIN_CONEXION);
    const decodificador = new TextDecoder();
    let resto = "";
    let cerrado = false;
    const procesar = (linea: string) => {
      if (!linea.trim()) return;
      const evento = JSON.parse(linea) as EventoTurno;
      if (evento.t === "fin" || evento.t === "pendiente" || evento.t === "error") cerrado = true;
      alEvento(evento);
    };
    try {
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        resto += decodificador.decode(value, { stream: true });
        const lineas = resto.split("\n");
        resto = lineas.pop() ?? "";
        lineas.forEach(procesar);
      }
      procesar(resto);
    } catch {
      // Se cortó la conexión a mitad del turno: el servidor igual lo termina.
    }
    if (!cerrado) {
      alEvento({ t: "error", codigo: "red", mensaje: "Se cortó la conexión. El turno sigue en el servidor: esperá un momento." });
    }
  },
};
