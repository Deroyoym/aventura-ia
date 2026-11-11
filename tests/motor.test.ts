import { describe, expect, it } from "vitest";
import { ESCENAS } from "@/lib/game/campana";
import { clasificar, resolverTirada } from "@/lib/game/dados";
import {
  aplicarNarracion,
  armarPersonaje,
  cambiarTerror,
  opcionesValidas,
  pasarFarol,
  planificar,
  prepararAccion,
  tirar,
  usarObjeto,
  votar,
} from "@/lib/game/motor";
import { salidaDeRespaldo } from "@/lib/dm/respaldo";
import { vistaPara } from "@/lib/game/vista";
import { ErrorJuego, type Asiento, type EstadoJuego } from "@/lib/game/tipos";
import { AHORA, dados, enJuego, preparada, salida } from "./ayudas";

const codigo = (fn: () => unknown): string => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ErrorJuego) return e.codigo;
    throw e;
  }
  return "sin_error";
};

/** Juega un turno completo de la opción indicada con un dado fijo. */
function turno(e: EstadoJuego, opcion: string, dado: number, extra = salida()): EstadoJuego {
  const asiento = e.farol;
  let s = prepararAccion(e, asiento, { tipo: "opcion", id: opcion }, AHORA);
  if (s.pendiente?.tipo === "accion" && s.pendiente.pedida) s = tirar(s, asiento, {}, dados(dado), AHORA);
  return aplicarNarracion(s, planificar(s), extra, AHORA);
}

describe("personajes", () => {
  it("suma la base de la clase y el bono de la raza", () => {
    const p = armarPersonaje(1, { nombre: "Aldric", raza: "enano", clase: "espada", rasgo: "Valiente", secreto: "Un secreto." });
    expect(p.atributos.fuerza).toBe(4);
    expect(p.vida).toBe(12);
    expect(p.inventario.map((o) => o.id)).toEqual(["espada", "vendas"]);
  });

  it("rechaza datos incompletos", () => {
    const base = { nombre: "Aldric", raza: "enano", clase: "espada", rasgo: "Valiente", secreto: "Un secreto." };
    expect(codigo(() => armarPersonaje(1, { ...base, nombre: "A" }))).toBe("nombre");
    expect(codigo(() => armarPersonaje(1, { ...base, raza: "dragon" }))).toBe("raza");
    expect(codigo(() => armarPersonaje(1, { ...base, secreto: "no" }))).toBe("secreto");
  });
});

describe("tiradas", () => {
  it("clasifica el resultado", () => {
    expect(clasificar(20, 20, 30)).toBe("critico");
    expect(clasificar(1, 30, 5)).toBe("pifia");
    expect(clasificar(10, 12, 12)).toBe("exito");
    expect(clasificar(9, 11, 12)).toBe("costo");
    expect(clasificar(9, 10, 12)).toBe("costo");
    expect(clasificar(8, 9, 12)).toBe("fallo");
  });

  it("con ventaja queda el dado mayor y con desventaja el menor", () => {
    const base = { atributo: "fuerza" as const, dificultad: "media" as const, cd: 12, modificador: 0, bono: 0, ayudas: [] as string[] };
    expect(resolverTirada({ ...base, ventaja: true, desventaja: false }, dados(4, 15)).dado).toBe(15);
    expect(resolverTirada({ ...base, ventaja: false, desventaja: true }, dados(4, 15)).dado).toBe(4);
    const anuladas = resolverTirada({ ...base, ventaja: true, desventaja: true }, dados(7));
    expect(anuladas.modo).toBe("normal");
    expect(anuladas.dados).toEqual([7]);
  });
});

describe("turnos", () => {
  it("abre el capítulo con opciones y el farol en el jugador 1", () => {
    const e = enJuego();
    expect(e.fase).toBe("jugando");
    expect(e.farol).toBe(1);
    expect(e.opciones).toHaveLength(3);
    expect(e.entradas[0]).toMatchObject({ tipo: "escena", escena: 0 });
    expect(e.npcs.brigida.conocido).toBe(true);
  });

  it("solo actúa quien lleva el farol", () => {
    const e = enJuego();
    expect(codigo(() => prepararAccion(e, 2, { tipo: "opcion", id: "a" }, AHORA))).toBe("no_es_tu_turno");
  });

  it("guarda la acción y la tirada antes de narrar, y consume las ayudas", () => {
    let e = prepararAccion(enJuego(), 1, { tipo: "opcion", id: "a" }, AHORA);
    expect(e.pendiente).toMatchObject({ tipo: "accion", asiento: 1, cd: 8, tirada: null });
    expect(codigo(() => planificar(e))).toBe("falta_tirada");

    e = tirar(e, 1, { rasgo: true, objeto: "espada" }, dados(3, 11), AHORA);
    const t = e.pendiente?.tipo === "accion" ? e.pendiente.tirada : null;
    expect(t).toMatchObject({ modo: "ventaja", dado: 11, modificador: 4, bono: 2, total: 17, resultado: "exito" });
    expect(e.personajes[1]?.rasgoUsado).toBe(true);
    expect(e.personajes[1]?.inventario.find((o) => o.id === "espada")?.usos).toBe(1);
    expect(codigo(() => tirar(e, 1, {}, dados(5), AHORA))).toBe("ya_tirado");
  });

  it("alterna el farol después de cada acción", () => {
    let e = turno(enJuego(), "a", 12);
    expect(e.farol).toBe(2);
    expect(e.escena).toMatchObject({ avance: 1, turnos: 1 });
    e = turno(e, "a", 12);
    expect(e.farol).toBe(1);
  });

  it("el crítico avanza dos pasos", () => {
    expect(turno(enJuego(), "a", 20).escena.avance).toBe(2);
  });

  it("pasar el farol no gasta turno", () => {
    const e = pasarFarol(enJuego(), 1, AHORA);
    expect(e.farol).toBe(2);
    expect(e.escena.turnos).toBe(0);
  });
});

describe("límites a lo que propone el modelo", () => {
  it("un éxito no puede costar vida ni subir la amenaza", () => {
    const antes = enJuego();
    const e = turno(antes, "a", 15, salida({ cambios: { vida: [{ jugador: 1, delta: -5 }], amenaza: 2 } }));
    expect(e.personajes[1]?.vida).toBe(antes.personajes[1]?.vida);
    expect(e.amenaza).toBe(antes.amenaza);
  });

  it("un fallo sin consecuencias igual sube la Bruma", () => {
    const antes = enJuego();
    expect(turno(antes, "b", 2).amenaza).toBe(antes.amenaza + 1);
  });

  it("acota el daño de un fallo y el de una pifia", () => {
    const danio = salida({ cambios: { vida: [{ jugador: 1, delta: -9 }] } });
    expect(turno(enJuego(), "b", 2, danio).personajes[1]?.vida).toBe(12 - 3);
    const pifia = turno(enJuego(), "b", 1, danio);
    expect(pifia.personajes[1]?.vida).toBe(12 - 4);
    expect(pifia.amenaza).toBe(3);
  });

  it("ignora pistas inexistentes o de escenas futuras", () => {
    const e = turno(enJuego(), "a", 15, salida({ cambios: { pistas: ["plato_de_mas", "campana_muda", "inventada"] } }));
    expect(e.pistas).toEqual(["plato_de_mas"]);
  });

  it("acota y registra los cambios de relación", () => {
    const e = turno(enJuego(), "a", 15, salida({ cambios: { relaciones: [{ npc: "brigida", delta: 9 }, { npc: "nadie", delta: 1 }] } }));
    expect(e.npcs.brigida.relacion).toBe(2);
    expect(Object.keys(e.npcs)).not.toContain("nadie");
  });

  it("entrega objetos del catálogo y narrativos", () => {
    const e = turno(
      enJuego(),
      "a",
      15,
      salida({
        cambios: {
          inventario: [
            { jugador: 1, accion: "agregar", objeto: "caldo", descripcion: "" },
            { jugador: 2, accion: "agregar", objeto: "Llave oxidada", descripcion: "Abre algo viejo." },
          ],
        },
      }),
    );
    expect(e.personajes[1]?.inventario.find((o) => o.id === "caldo")?.cura).toBe(4);
    expect(e.personajes[2]?.inventario.at(-1)).toMatchObject({ nombre: "Llave oxidada" });
  });

  it("completa las opciones con las de respaldo si faltan", () => {
    const una = [{ id: "x", texto: "Mirar el fuego", enfoque: "ingenio" as const, tirada: null, avanza: false }];
    const r = opcionesValidas(una, 0, 0);
    expect(r).toHaveLength(3);
    expect(r.map((o) => o.id)).toEqual(["a", "b", "c"]);
    expect(r.some((o) => o.avanza)).toBe(true);
  });

  it("solo regala un avance sin tirada por escena", () => {
    const libres = [
      { id: "x", texto: "Escuchar tras la puerta", enfoque: "ingenio" as const, tirada: null, avanza: true },
      { id: "y", texto: "Sentarse junto al fuego", enfoque: "dialogo" as const, tirada: null, avanza: true },
    ];
    expect(opcionesValidas(libres, 0, 0).filter((o) => !o.tirada).every((o) => o.avanza)).toBe(true);
    expect(opcionesValidas(libres, 0, 1).filter((o) => !o.tirada).every((o) => !o.avanza)).toBe(true);
  });
});

describe("vida", () => {
  it("quien llega a 0 queda fuera y el farol no vuelve a él", () => {
    let e = enJuego();
    e.personajes[1]!.vida = 2;
    e = turno(e, "b", 1, salida({ cambios: { vida: [{ jugador: 1, delta: -4 }] } }));
    expect(e.personajes[1]).toMatchObject({ vida: 0, quebrado: true });
    expect(e.farol).toBe(2);
    e = turno(e, "a", 9);
    expect(e.farol).toBe(2);
  });

  it("si caen los dos, la Bruma cobra y los devuelve", () => {
    let e = enJuego();
    e.personajes[1]!.vida = 1;
    e.personajes[2]!.vida = 1;
    const antes = e.amenaza;
    e = turno(e, "b", 1, salida({ cambios: { vida: [{ jugador: 1, delta: -4 }, { jugador: 2, delta: -4 }] } }));
    expect(e.personajes[1]).toMatchObject({ vida: 3, quebrado: false });
    expect(e.personajes[2]).toMatchObject({ vida: 3, quebrado: false });
    expect(e.amenaza).toBeGreaterThanOrEqual(antes + 4);
  });

  it("los objetos de cura se gastan", () => {
    let e = enJuego();
    e.personajes[1]!.vida = 5;
    e = usarObjeto(e, 1, "vendas", AHORA);
    expect(e.personajes[1]?.vida).toBe(8);
    expect(e.personajes[1]?.inventario.find((o) => o.id === "vendas")?.usos).toBe(1);
    expect(codigo(() => usarObjeto(e, 1, "espada", AHORA))).toBe("objeto");
  });
});

describe("escenas y votos", () => {
  const cerrarEscena1 = () => {
    let e = turno(enJuego(), "a", 20);
    e = turno(e, "a", 15, salida({ resumenEscena: "Llegaron a la posada." }));
    return e;
  };

  it("al llenar el reloj la escena cierra y abre el voto", () => {
    const e = cerrarEscena1();
    expect(e.voto?.id).toBe("companero");
    // Resolver bien la escena le quita un punto a la Bruma.
    expect(e.amenaza).toBe(1);
    expect(e.opciones).toEqual([]);
    expect(e.resumenes).toEqual([
      { capitulo: 1, escena: 0, titulo: ESCENAS[0].titulo, texto: "Llegaron a la posada." },
    ]);
    expect(codigo(() => prepararAccion(e, e.farol, { tipo: "opcion", id: "a" }, AHORA))).toBe("hay_voto");
  });

  it("si coinciden, el voto se resuelve y queda pendiente su narración", () => {
    let r = votar(cerrarEscena1(), 1, "cuervo", AHORA);
    expect(r.resuelto).toBe(false);
    r = votar(r.estado, 2, "cuervo", AHORA);
    expect(r).toMatchObject({ resuelto: true, narrar: true });
    expect(r.estado.companero).toEqual({ id: "cuervo", usado: false });
    expect(r.estado.pendiente).toEqual({ tipo: "voto", votoId: "companero", opcionId: "cuervo" });

    const plan = planificar(r.estado);
    expect(plan).toMatchObject({ tipo: "tras_voto", abre: 1 });
    const e = aplicarNarracion(r.estado, plan, salida(), AHORA);
    expect(e.escena.indice).toBe(1);
    expect(e.opciones).toHaveLength(3);
  });

  it("si no coinciden vuelven a votar, y al segundo desacuerdo decide el farol", () => {
    let r = votar(cerrarEscena1(), 1, "cuervo", AHORA);
    r = votar(r.estado, 2, "gata", AHORA);
    expect(r.resuelto).toBe(false);
    expect(r.estado.voto).toMatchObject({ ronda: 2, elecciones: {}, anteriores: { 1: "cuervo", 2: "gata" } });

    r = votar(r.estado, 1, "cuervo", AHORA);
    r = votar(r.estado, 2, "gata", AHORA);
    expect(r.resuelto).toBe(true);
    const esperado = r.estado.farol === 1 ? "cuervo" : "gata";
    expect(r.estado.companero?.id).toBe(esperado);
  });

  it("si se acaba el tiempo la escena cierra a un costo", () => {
    let e = enJuego();
    const antes = e.amenaza;
    for (let i = 0; i < ESCENAS[0].tope; i++) e = turno(e, "c", 3, salida({ cambios: { vida: [{ jugador: e.farol, delta: -1 }] } }));
    expect(e.voto?.id).toBe("companero");
    expect(e.amenaza).toBe(antes + 1);
    expect(e.entradas.some((x) => x.tipo === "sistema" && x.texto.includes("acabó el tiempo"))).toBe(true);
  });

  it("el dilema aplica las consecuencias escritas en la campaña", () => {
    const e = enJuego();
    e.voto = {
      id: "dilema",
      pregunta: "",
      contexto: "",
      opciones: [],
      elecciones: {},
      ronda: 1,
      anteriores: null,
    };
    e.escena.indice = 3;
    const r = votar(votar(e, 1, "ofrecer", AHORA).estado, 2, "ofrecer", AHORA);
    expect(r.estado.personajes[1]?.vidaMax).toBe(10);
    expect(r.estado.npcs.tobias.relacion).toBe(2);
    expect(r.estado.amenaza).toBe(e.amenaza + 1);
    expect(r.estado.decisiones.dilema).toBe("ofrecer");
  });

  it("recorre el capítulo completo hasta el voto de mejora", () => {
    let e = enJuego();
    let guardia = 0;
    while (e.fase !== "fin_capitulo" || e.voto) {
      if (guardia++ > 200) throw new Error("El capítulo no termina");
      if (e.voto) {
        const opcion = e.voto.opciones[0].id;
        e = votar(votar(e, 1, opcion, AHORA).estado, 2, opcion, AHORA).estado;
        if (e.pendiente) e = aplicarNarracion(e, planificar(e), salidaDeRespaldo(e, planificar(e)), AHORA);
        continue;
      }
      const asiento = e.farol;
      let s = prepararAccion(e, asiento, { tipo: "opcion", id: "a" }, AHORA);
      s = tirar(s, asiento, {}, dados(14), AHORA);
      e = aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
    }
    expect(e.resumenes).toHaveLength(ESCENAS.length);
    expect(e.refugio.mejoras).toHaveLength(1);
    expect(e.companero).not.toBeNull();
    expect(e.decisiones.dilema).toBeDefined();
  });
});

describe("amenaza", () => {
  it("avisa al cruzar un umbral y deja un evento para la próxima narración", () => {
    let e = enJuego();
    e.amenaza = 3;
    e = turno(e, "b", 2);
    expect(e.amenaza).toBe(4);
    expect(e.eventos).toHaveLength(1);
    const plan = (() => {
      const s = tirar(prepararAccion(e, e.farol, { tipo: "opcion", id: "a" }, AHORA), e.farol, {}, dados(15), AHORA);
      return { s, plan: planificar(s) };
    })();
    expect(plan.plan.eventos).toHaveLength(1);
    expect(aplicarNarracion(plan.s, plan.plan, salida(), AHORA).eventos).toEqual([]);
  });

  it("con la Bruma en 7 todo cuesta un punto más, y en 10 se tira con desventaja", () => {
    let e = enJuego();
    e.amenaza = 7;
    expect(prepararAccion(e, 1, { tipo: "opcion", id: "a" }, AHORA).pendiente).toMatchObject({ cd: 9 });
    e.amenaza = 10;
    e = tirar(prepararAccion(e, 1, { tipo: "opcion", id: "a" }, AHORA), 1, {}, dados(18, 5), AHORA);
    expect(e.pendiente).toMatchObject({ tirada: { modo: "desventaja", dado: 5 } });
  });
});

describe("intensidad del terror", () => {
  it("se puede bajar en cualquier momento, pero no subir con la partida empezada", () => {
    const e = enJuego();
    expect(cambiarTerror(e, "suave", AHORA).terror).toBe("suave");
    expect(codigo(() => cambiarTerror(e, "fuerte", AHORA))).toBe("terror");
    expect(cambiarTerror(preparada(), "fuerte", AHORA).terror).toBe("fuerte");
  });
});

describe("vista por jugador", () => {
  it("no incluye el secreto del otro hasta que se revela", () => {
    const e = enJuego();
    const v1 = vistaPara(e, 1, false);
    expect(v1.personajes[1]?.secreto).toContain("juramento");
    expect(v1.personajes[2]?.secreto).toBeNull();
    expect(JSON.stringify(v1)).not.toContain("robé");

    e.personajes[2]!.secretoRevelado = true;
    expect(vistaPara(e, 1, false).personajes[2]?.secreto).toContain("robé");
  });

  it("los susurros solo llegan a su destinatario", () => {
    const e = turno(enJuego(), "a", 15, salida({ susurros: [{ jugador: 2 as Asiento, texto: "Escuchás tu nombre." }] }));
    expect(vistaPara(e, 2, false).susurros.map((s) => s.texto)).toEqual(["Escuchás tu nombre."]);
    expect(JSON.stringify(vistaPara(e, 1, false))).not.toContain("Escuchás tu nombre");
  });

  it("no muestra qué votó el otro mientras la ronda está abierta", () => {
    let e = turno(enJuego(), "a", 20);
    e = turno(e, "a", 15);
    e = votar(e, 1, "perro", AHORA).estado;
    const v2 = vistaPara(e, 2, false);
    expect(v2.voto).toMatchObject({ miEleccion: null, otroVoto: true });
    expect(JSON.stringify(v2.voto)).not.toContain('"perro"}');
    expect(vistaPara(e, 1, false).voto?.miEleccion).toBe("perro");
  });
});
