import { describe, expect, it } from "vitest";
import { interpretarAdjudicacion, interpretarSalida } from "@/lib/dm/esquema";
import { extraerNarracion } from "@/lib/dm/narracion-parcial";
import { instruccionSistema, mensajeTurno } from "@/lib/dm/prompt";
import { ErrorNarrador, clasificarError, conReintentos, esperaSugerida } from "@/lib/dm/reintentos";
import { narradorSimulado } from "@/lib/dm/simulado";
import { planificar, prepararAccion, tirar } from "@/lib/game/motor";
import { AHORA, dados, enJuego } from "./ayudas";

const error429 = (cuerpo: string) => Object.assign(new Error(cuerpo), { status: 429 });
const POR_MINUTO = '{"error":{"code":429,"details":[{"quotaId":"GenerateRequestsPerMinutePerProjectPerModel-FreeTier"},{"retryDelay":"7s"}]}}';
const POR_DIA = '{"error":{"code":429,"details":[{"quotaId":"GenerateRequestsPerDayPerProjectPerModel-FreeTier"},{"retryDelay":"3600s"}]}}';

describe("narración parcial", () => {
  it("lee la narración de un JSON todavía incompleto", () => {
    expect(extraerNarracion('{"narr')).toBe("");
    expect(extraerNarracion('{"narracion":"La bru')).toBe("La bru");
    expect(extraerNarracion('{"narracion": "Dijo: \\"no\\".\\n\\nSilencio","opciones":[')).toBe('Dijo: "no".\n\nSilencio');
  });

  it("espera a que se complete un escape cortado", () => {
    expect(extraerNarracion('{"narracion":"año\\')).toBe("año");
    expect(extraerNarracion('{"narracion":"a\\u00f')).toBe("a");
    expect(extraerNarracion('{"narracion":"a\\u00f1o')).toBe("año");
  });

  it("crece de forma monótona mientras llegan trozos", () => {
    const completo = JSON.stringify({ narracion: 'Brígida gruñe: "a cenar".\nLa campana —esa— suena.', opciones: [] });
    let previo = "";
    for (let i = 1; i <= completo.length; i++) {
      const parcial = extraerNarracion(completo.slice(0, i));
      expect(parcial.startsWith(previo)).toBe(true);
      previo = parcial;
    }
    expect(previo).toBe('Brígida gruñe: "a cenar".\nLa campana —esa— suena.');
  });
});

describe("lectura de la respuesta del modelo", () => {
  const narracion = "La posadera deja la jarra sobre la mesa y los mira sin apuro.";

  it("convierte las opciones planas y descarta lo inválido sin perder el resto", () => {
    const s = interpretarSalida(
      "```json\n" +
        JSON.stringify({
          narracion,
          opciones: [
            { texto: "Forzar la puerta", enfoque: "combate", atributo: "fuerza", dificultad: "dificil", avanza: true },
            { texto: "Mirar el fuego", enfoque: "ingenio", atributo: "ninguno", dificultad: "media", avanza: false },
            { enfoque: "dialogo" },
          ],
          cambios: {
            vida: [{ jugador: "2", delta: -1 }, { jugador: 7, delta: -1 }],
            amenaza: "muchísima",
            relaciones: [{ npc: "brigida", delta: 1 }],
          },
        }) +
        "\n```",
    );
    expect(s?.opciones).toEqual([
      { id: "a", texto: "Forzar la puerta", enfoque: "combate", tirada: { atributo: "fuerza", dificultad: "dificil" }, avanza: true },
      { id: "b", texto: "Mirar el fuego", enfoque: "ingenio", tirada: null, avanza: false },
    ]);
    expect(s?.cambios.vida).toEqual([{ jugador: 2, delta: -1 }]);
    expect(s?.cambios.amenaza).toBe(0);
    expect(s?.cambios.pistas).toEqual([]);
    expect(s?.susurros).toEqual([]);
  });

  it("devuelve null si no hay narración utilizable", () => {
    expect(interpretarSalida("lo siento, no puedo")).toBeNull();
    expect(interpretarSalida('{"narracion":"corta","opciones":[],"cambios":{}}')).toBeNull();
    expect(interpretarSalida('{"narracion":"' + narracion)).toBeNull();
  });

  it("lee la clasificación de una acción libre", () => {
    expect(interpretarAdjudicacion('{"enfoque":"dialogo","atributo":"carisma","dificultad":"media","avanza":true}')).toEqual({
      enfoque: "dialogo",
      tirada: { atributo: "carisma", dificultad: "media" },
      avanza: true,
    });
    expect(interpretarAdjudicacion('{"enfoque":"ingenio","atributo":"ninguno","dificultad":"facil","avanza":false}')?.tirada).toBeNull();
    expect(interpretarAdjudicacion("{}")).toBeNull();
  });
});

describe("errores de la API", () => {
  it("distingue el límite por minuto de la cuota diaria", () => {
    expect(esperaSugerida(POR_MINUTO)).toBe(7000);
    expect(clasificarError(error429(POR_MINUTO))).toMatchObject({ codigo: "limite", reintentable: true, esperaMs: 7000 });
    expect(clasificarError(error429(POR_DIA))).toMatchObject({ codigo: "cuota", reintentable: false });
  });

  it("clasifica el resto", () => {
    expect(clasificarError(Object.assign(new Error("x"), { status: 503 }))).toMatchObject({ codigo: "servidor", reintentable: true });
    expect(clasificarError(Object.assign(new Error("API key not valid"), { status: 400 }))).toMatchObject({ codigo: "config", reintentable: false });
    expect(clasificarError(Object.assign(new Error("x"), { status: 404 }))).toMatchObject({ codigo: "config" });
    expect(clasificarError(new TypeError("fetch failed"))).toMatchObject({ codigo: "red", reintentable: true });
    expect(clasificarError(new Error("cualquier cosa"))).toMatchObject({ codigo: "otro", reintentable: false });
  });
});

describe("reintentos", () => {
  const sinEsperar = { dormir: async () => {}, azar: () => 0 };

  it("reintenta un 429 respetando la espera que pide la API", async () => {
    const esperas: number[] = [];
    let llamadas = 0;
    const r = await conReintentos(
      async () => {
        if (++llamadas < 3) throw error429(POR_MINUTO);
        return "listo";
      },
      { ...sinEsperar, alEsperar: (ms) => esperas.push(ms) },
    );
    expect(r).toBe("listo");
    expect(llamadas).toBe(3);
    expect(esperas).toEqual([7000, 7000]);
  });

  it("usa backoff exponencial cuando la API no sugiere espera", async () => {
    const esperas: number[] = [];
    await conReintentos(
      async (intento) => {
        if (intento < 4) throw Object.assign(new Error("x"), { status: 503 });
      },
      { ...sinEsperar, baseMs: 1000, alEsperar: (ms) => esperas.push(ms) },
    );
    expect(esperas).toEqual([1000, 2000, 4000]);
  });

  it("se rinde tras agotar los intentos", async () => {
    let llamadas = 0;
    const p = conReintentos(async () => {
      llamadas++;
      throw error429(POR_MINUTO);
    }, sinEsperar);
    await expect(p).rejects.toBeInstanceOf(ErrorNarrador);
    expect(llamadas).toBe(4);
  });

  it("no reintenta la cuota diaria ni las esperas demasiado largas", async () => {
    let llamadas = 0;
    await expect(
      conReintentos(async () => {
        llamadas++;
        throw error429(POR_DIA);
      }, sinEsperar),
    ).rejects.toMatchObject({ fallo: { codigo: "cuota" } });
    expect(llamadas).toBe(1);

    llamadas = 0;
    await expect(
      conReintentos(async () => {
        llamadas++;
        throw error429('{"details":[{"retryDelay":"120s"}]}');
      }, sinEsperar),
    ).rejects.toMatchObject({ fallo: { codigo: "limite", reintentable: false } });
    expect(llamadas).toBe(1);
  });
});

describe("prompt", () => {
  it("el máster recibe los dos secretos, la acción resuelta y la directiva", () => {
    let e = prepararAccion(enJuego(), 1, { tipo: "opcion", id: "a" }, AHORA);
    e = tirar(e, 1, {}, dados(15), AHORA);
    const mensaje = mensajeTurno(e, planificar(e));
    expect(mensaje).toContain("juramento");
    expect(mensaje).toContain("robé");
    expect(mensaje).toContain("ÉXITO");
    expect(mensaje).toContain("La escena continúa (avance 1/3)");
    expect(mensaje).toContain("La próxima decisión es de Mirta");
  });

  it("al cerrar una escena con voto pide la lista de opciones vacía", () => {
    let e = prepararAccion(enJuego(), 1, { tipo: "opcion", id: "a" }, AHORA);
    e = tirar(e, 1, {}, dados(20), AHORA);
    e.escena.avance = 1;
    const mensaje = mensajeTurno(e, planificar(e));
    expect(mensaje).toContain("RESUELTA");
    expect(mensaje).toContain("lista de opciones VACÍA");
    expect(mensaje).toContain("resumenEscena");
  });

  it("la instrucción de sistema lleva el nivel de terror y la biblia", () => {
    const sistema = instruccionSistema(enJuego());
    expect(sistema).toContain("Intensidad del terror: media");
    expect(sistema).toContain("Libro de los Ausentes");
    expect(sistema).toContain("Escena 5");
  });
});

describe("narrador simulado", () => {
  it("emite en trozos un JSON que el resto del sistema entiende", async () => {
    process.env.SIMULADO_DEMORA_MS = "0";
    let e = prepararAccion(enJuego(), 1, { tipo: "opcion", id: "a" }, AHORA);
    e = tirar(e, 1, {}, dados(15), AHORA);
    const plan = planificar(e);
    let crudo = "";
    let trozos = 0;
    for await (const t of narradorSimulado.narrar({ sistema: "", mensaje: "", estado: e, plan })) {
      crudo += t;
      trozos++;
    }
    expect(trozos).toBeGreaterThan(5);
    const s = interpretarSalida(crudo);
    expect(s?.narracion).toContain("Aldric");
    expect(s?.opciones).toHaveLength(3);
    expect(s?.cambios.pistas).toEqual(["plato_de_mas"]);
  });
});
