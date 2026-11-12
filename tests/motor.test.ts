import { describe, expect, it } from "vitest";
import { ESCENAS, escenasDe } from "@/lib/game/campana";
import { instruccionSistema, mensajeTurno } from "@/lib/dm/prompt";
import { AVATAR, avatarPorDefecto, normalizarAvatar } from "@/lib/game/avatar";
import { clasificar, resolverTirada } from "@/lib/game/dados";
import {
  aplicarNarracion,
  avanzarRonda,
  estadoInicial,
  armarPersonaje,
  RETRATOS_MAX,
  cambiarAvatar,
  definirPersonaje,
  empezarRetrato,
  terminarRetrato,
  cambiarTerror,
  empezarCapitulo,
  iniciar,
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
    expect(e.resumenes).toHaveLength(escenasDe(1).length);
    expect(e.refugio.mejoras).toHaveLength(1);
    expect(e.companero).not.toBeNull();
    expect(e.decisiones.dilema).toBeDefined();
  });
});

describe("ritmo de pistas y susurros", () => {
  const turno = (e: EstadoJuego, s: ReturnType<typeof salida>) => {
    let x = prepararAccion(e, e.farol, { tipo: "opcion", id: e.opciones[0].id }, AHORA);
    x = tirar(x, e.farol, {}, dados(9), AHORA);
    return aplicarNarracion(x, planificar(x), s, AHORA);
  };

  it("la apertura no entrega pistas y cada narración entrega una sola", () => {
    const abierta = iniciar(preparada(), AHORA);
    const e = aplicarNarracion(abierta, planificar(abierta), salida({ cambios: { pistas: ["plato_de_mas"] } }), AHORA);
    expect(e.pistas).toEqual([]);
    const r = turno(e, salida({ cambios: { pistas: ["plato_de_mas", "registro_raspado"] } }));
    expect(r.pistas).toEqual(["plato_de_mas"]);
  });

  it("no deja pasar un susurro por turno al mismo jugador", () => {
    const susurro = (n: number) => salida({ susurros: [{ jugador: 1, texto: `Susurro ${n}, dicho muy bajo.` }, { jugador: 2, texto: `Otro ${n}.` }] });
    let e = enJuego();
    const vistos: number[] = [];
    for (let n = 1; n <= 4 && e.fase === "jugando" && !e.voto; n++) {
      e = turno(e, susurro(n));
      vistos.push(e.susurros.filter((s) => s.para === 1).length);
    }
    expect(vistos.slice(0, 3)).toEqual([1, 1, 1]);
    expect(e.susurros.filter((s) => s.para === 2)).toHaveLength(e.susurros.filter((s) => s.para === 1).length);
  });
});

describe("retrato", () => {
  const base = { nombre: "Aldric", raza: "enano", clase: "espada", rasgo: "Valiente", secreto: "Un secreto." };

  it("guarda lo elegido y descarta lo que no existe", () => {
    const p = armarPersonaje(1, { ...base, avatar: { peinado: "capucha", marca: "parche", piel: "verde" } });
    expect(p.avatar).toMatchObject({ peinado: "capucha", marca: "parche" });
    expect(AVATAR.piel.opciones.map((o) => o.id)).toContain(p.avatar!.piel);
  });

  it("sin elegir nada, el retrato es siempre el mismo para el mismo personaje", () => {
    expect(armarPersonaje(1, base).avatar).toEqual(armarPersonaje(2, base).avatar);
    expect(avatarPorDefecto("a")).toEqual(avatarPorDefecto("a"));
    expect(normalizarAvatar("basura", "a")).toEqual(avatarPorDefecto("a"));
  });

  it("un personaje guardado sin retrato recibe uno en la vista", () => {
    const e = enJuego();
    delete e.personajes[1]!.avatar;
    const vista = vistaPara(e, 2, false);
    expect(vista.personajes[1]!.avatar).toEqual(avatarPorDefecto("Aldric|enano|espada"));
  });

  it("se puede cambiar con la partida empezada, y solo el propio", () => {
    const e = cambiarAvatar(enJuego(), 2, { peinado: "sombrero", pelo: "<script>" }, AHORA);
    expect(e.personajes[2]!.avatar!.peinado).toBe("sombrero");
    expect(AVATAR.pelo.opciones.map((o) => o.id)).toContain(e.personajes[2]!.avatar!.pelo);
    expect(e.personajes[1]).toEqual(enJuego().personajes[1]);
  });
});

describe("retrato pintado", () => {
  it("reserva un intento, no repite el mismo y devuelve el intento si falla", () => {
    const e0 = enJuego();
    const e1 = empezarRetrato(e0, 1, "abc", AHORA, false)!;
    expect(e1.personajes[1]!.retrato).toMatchObject({ hechos: 1, pintando: AHORA, url: null });
    expect(vistaPara(e1, 1, false, { ahora: AHORA + 1000 }).personajes[1]!.retrato).toEqual({ url: null, pintando: true, restantes: RETRATOS_MAX - 1 });
    // mientras pinta no se reserva otro
    expect(empezarRetrato(e1, 1, "abc", AHORA + 1000, false)).toBeNull();
    expect(codigo(() => empezarRetrato(e1, 1, "abc", AHORA + 1000, true))).toBe("pintando");

    const fallo = terminarRetrato(e1, 1, "abc", null, AHORA + 2000);
    expect(fallo.personajes[1]!.retrato).toMatchObject({ hechos: 0, pintando: null, url: null });

    const listo = terminarRetrato(e1, 1, "abc", "https://x/r.webp", AHORA + 2000);
    expect(listo.personajes[1]!.retrato).toMatchObject({ hechos: 1, url: "https://x/r.webp", firma: "abc" });
    // misma descripción: no se vuelve a pintar solo, pero sí a pedido
    expect(empezarRetrato(listo, 1, "abc", AHORA + 3000, false)).toBeNull();
    expect(empezarRetrato(listo, 1, "abc", AHORA + 3000, true)).not.toBeNull();
    expect(empezarRetrato(listo, 1, "otra", AHORA + 3000, false)).not.toBeNull();
  });

  it("tiene un tope de intentos por personaje y sobrevive a rehacer el personaje", () => {
    let e = preparada();
    for (let i = 0; i < RETRATOS_MAX; i++) {
      e = terminarRetrato(empezarRetrato(e, 1, `f${i}`, AHORA, true)!, 1, `f${i}`, `u${i}`, AHORA);
    }
    expect(codigo(() => empezarRetrato(e, 1, "mas", AHORA, true))).toBe("sin_retratos");
    expect(empezarRetrato(e, 1, "mas", AHORA, false)).toBeNull();
    e = definirPersonaje(e, 1, { nombre: "Otro", raza: "elfo", clase: "juglar", rasgo: "Valiente", secreto: "Un secreto." }, AHORA);
    expect(e.personajes[1]!.retrato?.hechos).toBe(RETRATOS_MAX);
  });

  it("un intento colgado vence solo", () => {
    const e = empezarRetrato(enJuego(), 2, "abc", AHORA, true)!;
    expect(vistaPara(e, 2, false, { ahora: AHORA + 5 * 60_000 }).personajes[2]!.retrato.pintando).toBe(false);
    expect(empezarRetrato(e, 2, "abc", AHORA + 5 * 60_000, true)).not.toBeNull();
  });
});

describe("capítulo 2", () => {
  /** Juega con la primera opción de cada voto (o la indicada) hasta cerrar el capítulo en curso. */
  function hastaElFinal(inicial: EstadoJuego, votos: Record<string, string> = {}): EstadoJuego {
    let e = inicial;
    let guardia = 0;
    while (e.fase !== "fin_capitulo" || e.voto) {
      if (guardia++ > 200) throw new Error("El capítulo no termina");
      if (e.voto) {
        const opcion = votos[e.voto.id] ?? e.voto.opciones[0].id;
        e = votar(votar(e, 1, opcion, AHORA).estado, 2, opcion, AHORA).estado;
        if (e.pendiente) e = aplicarNarracion(e, planificar(e), salidaDeRespaldo(e, planificar(e)), AHORA);
        continue;
      }
      const asiento = e.farol;
      let s = prepararAccion(e, asiento, { tipo: "opcion", id: "a" }, AHORA);
      s = tirar(s, asiento, {}, dados(14), AHORA);
      e = aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
    }
    return e;
  }
  const abrir = (e: EstadoJuego) => {
    const s = empezarCapitulo(e, AHORA);
    return aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
  };

  it("no se puede empezar antes de cerrar el capítulo 1", () => {
    expect(() => empezarCapitulo(enJuego(), AHORA)).toThrow(ErrorJuego);
  });

  it("abre el capítulo 2 descansados y con la mejora del refugio aplicada", () => {
    const fin = hastaElFinal(enJuego(), { mejora: "hogar" });
    const vidaMax = fin.personajes[1]!.vidaMax;
    fin.personajes[1]!.vida = 2;
    fin.personajes[1]!.rasgoUsado = true;
    expect(vistaPara(fin, 1, false).hayOtroCapitulo).toBe(true);

    const s = empezarCapitulo(fin, AHORA);
    expect(s.capitulo).toBe(2);
    expect(s.personajes[1]).toMatchObject({ vidaMax: vidaMax + 2, vida: vidaMax + 2, rasgoUsado: false });
    expect(planificar(s)).toMatchObject({ tipo: "apertura", abre: escenasDe(2)[0] });
    expect(mensajeTurno(s, planificar(s))).toContain("La mesa servida");
    expect(instruccionSistema(s)).toContain("Los Ausentes");
    expect(instruccionSistema(s)).not.toContain("El cuarto que nadie recuerda");

    const e = aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
    expect(e.fase).toBe("jugando");
    expect(e.escena.indice).toBe(escenasDe(2)[0]);
    expect(e.npcs.guarda.conocido).toBe(true);
    const vista = vistaPara(e, 1, false);
    expect(vista.capitulo).toMatchObject({ numero: 2, titulo: "Los Ausentes" });
    expect(vista.escena).toMatchObject({ numero: 1, total: 5, lugar: "refugio" });
  });

  it("las otras mejoras rinden al empezar: una pista, menos Bruma o vendas", () => {
    const con = (mejora: string) => empezarCapitulo(hastaElFinal(enJuego(), { mejora }), AHORA);
    expect(con("biblioteca").pistas).toContain("cuaderno_guarda");
    const fin = hastaElFinal(enJuego(), { mejora: "cerrojos" });
    expect(empezarCapitulo(fin, AHORA).amenaza).toBe(Math.max(0, fin.amenaza - 2));
    expect(con("botica").personajes[2]!.inventario.some((o) => o.id === "vendas")).toBe(true);
  });

  it("solo valen las pistas del capítulo en curso", () => {
    const e = abrir(hastaElFinal(enJuego()));
    let s = prepararAccion(e, e.farol, { tipo: "opcion", id: "a" }, AHORA);
    s = tirar(s, e.farol, {}, dados(14), AHORA);
    const r = aplicarNarracion(s, planificar(s), salida({ cambios: { pistas: ["campana_muda", "hilo_rojo", "siete_nudos"] } }), AHORA);
    expect(r.pistas).toContain("hilo_rojo");
    expect(r.pistas).not.toContain("siete_nudos");
    expect(r.pistas.filter((p) => p === "campana_muda")).toHaveLength(e.pistas.includes("campana_muda") ? 1 : 0);
  });

  it("si Tobías fue borrado, no vuelve a aparecer en el pueblo", () => {
    const fin = hastaElFinal(enJuego(), { dilema: "dejar" });
    expect(fin.decisiones.dilema).toBe("dejar");
    const e = hastaElFinal(abrir(fin));
    expect(e.entradas.some((x) => x.tipo === "sistema" && x.texto.startsWith("Tobías"))).toBe(false);
  });

  it("el voto del regreso puede costar al compañero o dejar la nana", () => {
    const base = abrir(hastaElFinal(enJuego()));
    const sin = hastaElFinal(base, { regreso: "companero" });
    expect(sin.companero).toBeNull();
    expect(sin.npcs.lia.relacion).toBe(2);
    const nana = hastaElFinal(base, { regreso: "dejarla" });
    expect(nana.companero).not.toBeNull();
    expect(nana.personajes[1]!.inventario.some((o) => o.id === "nana")).toBe(true);
  });

  it("recorre el capítulo 2 entero y no repite la mejora ya hecha", () => {
    const fin1 = hastaElFinal(enJuego(), { mejora: "hogar" });
    let e = abrir(fin1);
    let vioMejora = false;
    let guardia = 0;
    while (e.fase !== "fin_capitulo" || e.voto) {
      if (guardia++ > 200) throw new Error("El capítulo no termina");
      if (e.voto) {
        if (e.voto.id === "mejora") {
          vioMejora = true;
          expect(e.voto.opciones.map((o) => o.id)).not.toContain("hogar");
          expect(() => votar(e, 1, "hogar", AHORA)).toThrow(ErrorJuego);
        }
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
    expect(vioMejora).toBe(true);
    expect(e.capitulo).toBe(2);
    expect(e.resumenes).toHaveLength(escenasDe(1).length + escenasDe(2).length);
    expect(e.refugio.mejoras).toHaveLength(2);
    expect(e.decisiones.ancla).toBeDefined();
    expect(e.decisiones.regreso).toBeDefined();
    expect(vistaPara(e, 1, false).hayOtroCapitulo).toBe(true);
  });
});

describe("capítulo 3", () => {
  /** Juega hasta cerrar el capítulo en curso; `votos` fija qué se elige en cada votación. */
  function cerrar(inicial: EstadoJuego, votos: Record<string, string> = {}): EstadoJuego {
    let e = inicial;
    let guardia = 0;
    while (e.fase !== "fin_capitulo" || e.voto) {
      if (guardia++ > 200) throw new Error("El capítulo no termina");
      if (e.voto) {
        const opcion = votos[e.voto.id] ?? e.voto.opciones[0].id;
        e = votar(votar(e, 1, opcion, AHORA).estado, 2, opcion, AHORA).estado;
        if (e.pendiente) e = aplicarNarracion(e, planificar(e), salidaDeRespaldo(e, planificar(e)), AHORA);
        continue;
      }
      const asiento = e.farol;
      let s = prepararAccion(e, asiento, { tipo: "opcion", id: "a" }, AHORA);
      s = tirar(s, asiento, {}, dados(14), AHORA);
      e = aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
    }
    return e;
  }
  const abrir = (e: EstadoJuego) => {
    const s = empezarCapitulo(e, AHORA);
    return aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
  };
  const hastaElTres = (votos: Record<string, string> = {}) => abrir(cerrar(abrir(cerrar(enJuego(), votos)), votos));

  it("abre en el archivo y el máster recibe la guía y las escenas del capítulo", () => {
    const fin2 = cerrar(abrir(cerrar(enJuego())));
    const s = empezarCapitulo(fin2, AHORA);
    expect(s.capitulo).toBe(3);
    const sistema = instruccionSistema(s);
    expect(sistema).toContain("Los Siete");
    expect(sistema).toContain("La cripta de los Siete");
    expect(sistema).not.toContain("Bruma adentro");
    const vista = vistaPara(aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA), 1, false);
    expect(vista.escena).toMatchObject({ numero: 1, total: 5, titulo: "El archivo del cabildo" });
  });

  it("se puede jugar entero y quedan dos votos propios más la mejora", () => {
    const e = cerrar(hastaElTres());
    expect(e.capitulo).toBe(3);
    expect(e.resumenes).toHaveLength(15);
    expect(e.decisiones.cripta).toBeDefined();
    expect(e.decisiones.septima).toBeDefined();
    expect(e.refugio.mejoras).toHaveLength(3);
    expect(vistaPara(e, 1, false).hayOtroCapitulo).toBe(true);
  });

  it("el capítulo 4 cierra la campaña con el voto del pacto y un epílogo sin opciones", () => {
    const abierto = abrir(cerrar(hastaElTres()));
    expect(abierto.capitulo).toBe(4);
    expect(instruccionSistema(abierto)).toContain("La Dama del Umbral");
    const e = cerrar(abierto, { pacto: "nombrar" });
    expect(e.resumenes).toHaveLength(20);
    expect(e.decisiones.lectura).toBeDefined();
    expect(e.decisiones.pacto).toBe("nombrar");
    expect(e.refugio.mejoras).toHaveLength(3);
    expect(e.opciones).toEqual([]);
    expect(e.amenaza).toBe(0);
    const vista = vistaPara(e, 1, false);
    expect(vista.capitulo.final).toBe(true);
    expect(vista.desenlace).toBe("Ponerle un plato");
    expect(vista.hayOtroCapitulo).toBe(false);
    expect(() => empezarCapitulo(e, AHORA)).toThrow(ErrorJuego);
  });

  it("renovar el pacto se paga con vida máxima", () => {
    const abierto = abrir(cerrar(hastaElTres()));
    const antes = abierto.personajes[1]!.vidaMax;
    const e = cerrar(abierto, { pacto: "renovar" });
    expect(e.personajes[1]!.vidaMax).toBe(antes - 2);
    expect(vistaPara(e, 1, false).desenlace).toBe("Firmar el renglón");
  });

  it("la Bruma solo cede por mérito propio con un crítico", () => {
    const cede = salida({ cambios: { amenaza: -1 } });
    const base = enJuego();
    expect(turno(base, "b", 14, cede).amenaza).toBe(base.amenaza);
    expect(turno(base, "b", 20, cede).amenaza).toBe(base.amenaza - 1);
  });

  it("entregar a Úrsula baja la Bruma y la enemista; callar deja la firma", () => {
    const base = hastaElTres();
    const entregada = cerrar(base, { septima: "entregarla" });
    expect(entregada.npcs.ursula.relacion).toBeLessThan(base.npcs.ursula.relacion);
    expect(entregada.memoria.some((m) => m.includes("Úrsula Vane"))).toBe(true);
    const callada = cerrar(base, { septima: "callar" });
    expect(callada.personajes[2]!.inventario.some((o) => o.id === "firma")).toBe(true);
  });

  it("bajar con Anselmo adelanta una pista de la cripta", () => {
    let e = hastaElTres();
    let guardia = 0;
    while (e.voto?.id !== "cripta") {
      if (guardia++ > 60) throw new Error("No llegó el voto de la cripta");
      const asiento = e.farol;
      let s = prepararAccion(e, asiento, { tipo: "opcion", id: "a" }, AHORA);
      s = tirar(s, asiento, {}, dados(14), AHORA);
      e = aplicarNarracion(s, planificar(s), salidaDeRespaldo(s, planificar(s)), AHORA);
    }
    const r = votar(votar(e, 1, "anselmo", AHORA).estado, 2, "anselmo", AHORA).estado;
    expect(r.pistas).toContain("tumbas_vacias");
  });
});

describe("El Último Coche: mesa grande por rondas", () => {
  const mesa = (jugadores: number): EstadoJuego => {
    let e = estadoInicial("media", AHORA, "coche");
    for (let a = 1; a <= jugadores; a++) {
      e = definirPersonaje(
        e,
        a as Asiento,
        { nombre: `Viajero ${a}`, raza: "humano", clase: "espada", rasgo: "Terco", secreto: `Le debo plata a Casilda ${a}` },
        AHORA,
      );
    }
    return e;
  };
  const narrar = (e: EstadoJuego) => aplicarNarracion(e, planificar(e), salidaDeRespaldo(e, planificar(e)), AHORA);
  const abierta = (jugadores = 5) => narrar(iniciar(mesa(jugadores), AHORA));
  /** Actúa quien lleva el farol y deja la acción anotada en la ronda. */
  const actuar = (e: EstadoJuego, dado = 14): EstadoJuego => {
    const asiento = e.farol;
    let s = prepararAccion(e, asiento, { tipo: "opcion", id: "a" }, AHORA);
    s = tirar(s, asiento, {}, dados(dado), AHORA);
    return avanzarRonda(s, AHORA);
  };
  const ronda = (e: EstadoJuego, dado = 14): EstadoJuego => {
    let s = e;
    while (s.pendiente?.tipo !== "ronda") s = actuar(s, dado);
    return narrar(s);
  };

  it("no empieza con menos de cuatro y reparte un encargo distinto a cada uno", () => {
    expect(codigo(() => iniciar(mesa(3), AHORA))).toBe("faltan_personajes");
    const e = abierta(5);
    expect(e.capitulo).toBe(101);
    expect(new Set(Object.values(e.encargos!)).size).toBe(5);
    expect(vistaPara(e, 1, false).capitulo).toMatchObject({ numero: 1, titulo: "La lista del cochero" });
    expect(vistaPara(e, 1, false).escena.lugar).toBe("posta");
  });

  it("cada jugador ve solo su encargo, y el máster los recibe todos", () => {
    const e = abierta(4);
    const mio = vistaPara(e, 2, false).encargo!.texto;
    expect(mio.length).toBeGreaterThan(10);
    expect(JSON.stringify(vistaPara(e, 3, false))).not.toContain(mio);
    expect(mensajeTurno(e, planificar({ ...e, pendiente: { tipo: "ronda" }, ronda: [] }))).toContain(mio);
    expect(instruccionSistema(e)).toContain("El Último Coche");
    expect(instruccionSistema(e)).not.toContain("Valdebruma");
  });

  it("actúan todos antes de que el máster narre, y el farol va pasando", () => {
    let e = abierta(4);
    expect(e.farol).toBe(1);
    e = actuar(e);
    expect(e.pendiente).toBeNull();
    expect(e.farol).toBe(2);
    expect(e.opciones.length).toBeGreaterThan(0);
    expect(codigo(() => prepararAccion(e, 1, { tipo: "opcion", id: "a" }, AHORA))).toBe("no_es_tu_turno");
    e = actuar(actuar(e));
    expect(vistaPara(e, 1, false).yaActuaron).toEqual([1, 2, 3]);
    e = actuar(e);
    expect(e.pendiente).toEqual({ tipo: "ronda" });
    const plan = planificar(e);
    expect(plan.ronda).toHaveLength(4);
    expect(plan.avance).toBe(1);
    expect(mensajeTurno(e, plan)).toContain("acciones de esta ronda");
    e = narrar(e);
    expect(e.ronda).toEqual([]);
    expect(e.escena.avance).toBe(1);
    expect(e.farol).toBe(2);
  });

  it("si a la mayoría le sale mal, la ronda no avanza", () => {
    let e = abierta(4);
    e = actuar(actuar(actuar(actuar(e, 1), 1), 1), 15);
    expect(planificar(e).avance).toBe(0);
  });

  it("los votos se resuelven por mayoría y el empate lo define el farol", () => {
    let e = abierta(5);
    while (!e.voto) e = ronda(e);
    expect(e.voto.id).toBe("viajera");
    for (const [a, o] of [[1, "rostro"], [2, "rostro"], [3, "dejarla"], [4, "bajarla"]] as const) {
      e = votar(e, a, o, AHORA).estado;
      expect(e.voto).not.toBeNull();
    }
    expect(vistaPara(e, 1, false).voto!.faltan).toEqual([5]);
    const r = votar(e, 5, "dejarla", AHORA);
    expect(r.resuelto).toBe(true);
    expect(["rostro", "dejarla"]).toContain(r.estado.decisiones.viajera);
    expect(r.estado.decisiones.viajera).toBe(r.estado.voto === null && e.voto!.elecciones[e.farol] === "dejarla" ? "dejarla" : r.estado.decisiones.viajera);
  });

  it("se juega el capítulo entero y cada encargo queda cumplido o no", () => {
    let e = abierta(6);
    let guardia = 0;
    while (e.fase !== "fin_capitulo" || e.voto) {
      if (guardia++ > 80) throw new Error("El capítulo no termina");
      if (e.voto) {
        const opcion = e.voto.opciones[0].id;
        for (const a of [1, 2, 3, 4, 5, 6] as Asiento[]) if (e.voto) e = votar(e, a, opcion, AHORA).estado;
        if (e.pendiente) e = narrar(e);
        continue;
      }
      e = ronda(e);
    }
    expect(e.decisiones).toMatchObject({ viajera: "dejarla", peaje: "cofre", rumbo: "seguir" });
    const cumplidos = ([1, 2, 3, 4, 5, 6] as Asiento[]).map((a) => vistaPara(e, a, false).encargo!.cumplido);
    expect(cumplidos.filter((x) => x === true)).toHaveLength(3);
    expect(cumplidos.filter((x) => x === false)).toHaveLength(3);
    expect(vistaPara(e, 1, false).hayOtroCapitulo).toBe(false);
  });

  it("pagar con una verdad revela el secreto de quien lleva el farol", () => {
    let e = abierta(4);
    while (e.voto?.id !== "peaje") {
      if (e.voto) {
        const o = e.voto.opciones[0].id;
        for (const a of [1, 2, 3, 4] as Asiento[]) if (e.voto) e = votar(e, a, o, AHORA).estado;
        if (e.pendiente) e = narrar(e);
      } else e = ronda(e);
    }
    const farol = e.farol;
    for (const a of [1, 2, 3, 4] as Asiento[]) if (e.voto) e = votar(e, a, "verdad", AHORA).estado;
    expect(e.personajes[farol]!.secretoRevelado).toBe(true);
    expect(vistaPara(e, (farol === 1 ? 2 : 1) as Asiento, false).personajes[farol]!.secreto).toContain("Casilda");
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
