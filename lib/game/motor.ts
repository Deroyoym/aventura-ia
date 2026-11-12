import {
  VOTOS,
  campanaDe,
  capituloDef,
  npcsDe,
  ordenDe,
  siguienteCapitulo,
  esUltimaDelCapitulo,
  escenaDef,
  escenasDe,
  npcDef,
  pistaDef,
  pistasDe,
  type EfectosVoto,
} from "./campana";
import {
  AMENAZA_MAX,
  CD,
  CLASES,
  COMPANEROS,
  ETIQUETAS_RELACION,
  INVENTARIO_MAX,
  MEJORAS,
  NIVELES_ORDEN,
  NOMBRE_TERROR,
  OBJETOS,
  RAZAS,
  UMBRALES_AMENAZA,
  atributosDe,
} from "./contenido";
import { avatarPorDefecto, normalizarAvatar, type Avatar } from "./avatar";
import { AVANCE_POR_RESULTADO, resolverTirada, type Rng } from "./dados";
import {
  ASIENTOS,
  ErrorJuego,
  type AccionRonda,
  type Asiento,
  type CampanaId,
  type Enfoque,
  type Entrada,
  type EstadoJuego,
  type NivelTerror,
  type Objeto,
  type Opcion,
  type Personaje,
  type Plan,
  type Resultado,
  type SalidaDM,
  type SinId,
  type TiradaPedida,
  type Voto,
  type VotoId,
} from "./tipos";

// Motor de reglas. Funciones puras: reciben un estado y devuelven otro.
// Acá vive todo lo que el modelo NO decide: turnos, tiradas, relojes de escena,
// límites a los cambios que propone y consecuencias de los votos.

const MAX_ENTRADAS = 40;
const MAX_MEMORIA = 12;
const MAX_SUSURROS = 8;
/** Un susurro pierde efecto si llega en todos los turnos: se deja pasar uno cada tantos por jugador. */
const TURNOS_ENTRE_SUSURROS = 3;
const PISTAS_POR_NARRACION = 1;
const AMENAZA_INICIAL = 2;
const VIDA_AL_LEVANTARSE = 3;
const AVANCES_LIBRES_POR_ESCENA = 1;

const CAPITULO_INICIAL: Record<CampanaId, number> = { trece: 1, coche: 101 };

/** Asientos que tienen personaje, en orden. */
export const activos = (e: EstadoJuego): Asiento[] => ASIENTOS.filter((a) => e.personajes[a]);

/** El siguiente asiento con personaje que cumple la condición, dando la vuelta; null si no hay otro. */
function siguienteAsiento(e: EstadoJuego, desde: Asiento, sirve: (a: Asiento) => boolean): Asiento | null {
  const orden = activos(e);
  const i = orden.indexOf(desde);
  for (let paso = 1; paso < orden.length; paso++) {
    const a = orden[(i + paso) % orden.length];
    if (sirve(a)) return a;
  }
  return null;
}

const enPie = (e: EstadoJuego) => (a: Asiento) => !e.personajes[a]!.quebrado;

const acotar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Recorta, colapsa espacios y quita caracteres de control de un texto escrito por un jugador o por el modelo. */
export function limpiar(texto: unknown, max: number): string {
  if (typeof texto !== "string") return "";
  return texto
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

export function estadoInicial(terror: NivelTerror, ahora: number, campana: CampanaId = "trece"): EstadoJuego {
  const capitulo = CAPITULO_INICIAL[campana];
  return {
    campana,
    fase: "preparacion",
    terror,
    capitulo,
    personajes: {},
    escena: { indice: escenasDe(capitulo)[0], avance: 0, turnos: 0, libres: 0 },
    farol: 1,
    amenaza: AMENAZA_INICIAL,
    pistas: [],
    npcs: Object.fromEntries(npcsDe(campana).map((n) => [n.id, { relacion: 0, conocido: false }])),
    companero: null,
    refugio: { mejoras: [] },
    decisiones: {},
    opciones: [],
    pendiente: null,
    voto: null,
    entradas: [],
    resumenes: [],
    susurros: [],
    memoria: [],
    eventos: [],
    narrando: null,
    turno: 0,
    secuencia: 0,
    actualizado: ahora,
  };
}

function agregar(e: EstadoJuego, entrada: SinId<Entrada>): number {
  e.secuencia += 1;
  e.entradas.push({ ...entrada, id: e.secuencia } as Entrada);
  if (e.entradas.length > MAX_ENTRADAS) e.entradas.splice(0, e.entradas.length - MAX_ENTRADAS);
  return e.secuencia;
}

const aviso = (e: EstadoJuego, texto: string, tono: "bien" | "mal" | "neutro" = "neutro") =>
  agregar(e, { tipo: "sistema", texto, tono });

function personajeDe(e: EstadoJuego, asiento: Asiento): Personaje {
  const p = e.personajes[asiento];
  if (!p) throw new ErrorJuego("sin_personaje", "Todavía no creaste tu personaje.");
  return p;
}

// ───────────────────────── Preparación ─────────────────────────

export interface DatosPersonaje {
  nombre: string;
  raza: string;
  clase: string;
  rasgo: string;
  secreto: string;
  avatar?: Partial<Avatar>;
  apariencia?: string;
}

const semillaDeAvatar = (p: { nombre: string; raza: string; clase: string }) => `${p.nombre}|${p.raza}|${p.clase}`;

/** El retrato de un personaje, o uno estable si se creó antes de que existieran. */
export const avatarDe = (p: Personaje): Avatar => p.avatar ?? avatarPorDefecto(semillaDeAvatar(p));

export function armarPersonaje(asiento: Asiento, datos: DatosPersonaje): Personaje {
  const nombre = limpiar(datos.nombre, 24);
  const rasgo = limpiar(datos.rasgo, 40);
  const secreto = limpiar(datos.secreto, 200);
  const raza = RAZAS.find((r) => r.id === datos.raza);
  const clase = CLASES.find((c) => c.id === datos.clase);
  if (nombre.length < 2) throw new ErrorJuego("nombre", "El nombre necesita al menos 2 letras.");
  if (!raza) throw new ErrorJuego("raza", "Elegí una raza.");
  if (!clase) throw new ErrorJuego("clase", "Elegí una clase.");
  if (rasgo.length < 2) throw new ErrorJuego("rasgo", "Elegí o escribí un rasgo.");
  if (secreto.length < 5) throw new ErrorJuego("secreto", "Tu personaje necesita un secreto.");

  const atributos = atributosDe(raza.id, clase.id)!;

  return {
    asiento,
    nombre,
    avatar: normalizarAvatar(datos.avatar, semillaDeAvatar({ nombre, raza: raza.id, clase: clase.id })),
    apariencia: limpiar(datos.apariencia, 120),
    raza: raza.id,
    clase: clase.id,
    rasgo,
    secreto,
    atributos,
    vida: clase.vida,
    vidaMax: clase.vida,
    inventario: clase.equipo.map((id) => ({ ...OBJETOS[id] })),
    rasgoUsado: false,
    quebrado: false,
    secretoRevelado: false,
  };
}

export function definirPersonaje(
  estado: EstadoJuego,
  asiento: Asiento,
  datos: DatosPersonaje,
  ahora: number,
): EstadoJuego {
  if (estado.fase !== "preparacion" || estado.pendiente) {
    throw new ErrorJuego("ya_empezo", "La partida ya empezó: el personaje no se puede cambiar.", 409);
  }
  const e = structuredClone(estado);
  const previo = e.personajes[asiento];
  e.personajes[asiento] = armarPersonaje(asiento, datos);
  // El retrato pintado y su cuenta siguen: rehacer el personaje no regala intentos.
  if (previo?.retrato) e.personajes[asiento]!.retrato = previo.retrato;
  e.actualizado = ahora;
  return e;
}

export const puedeEmpezar = (e: EstadoJuego): boolean =>
  e.fase === "preparacion" && activos(e).length >= campanaDe(e).jugadores.min;

/** Encargos secretos del capítulo en curso: se barajan y se reparte uno por jugador. */
function repartirEncargos(e: EstadoJuego, ahora: number): void {
  const encargos = campanaDe(e)
    .encargos.filter((x) => x.capitulo === e.capitulo)
    .map((x) => x.id);
  if (!encargos.length) return;
  let semilla = (ahora % 2147483647) + 1;
  for (let i = encargos.length - 1; i > 0; i--) {
    semilla = (semilla * 48271) % 2147483647;
    const j = semilla % (i + 1);
    [encargos[i], encargos[j]] = [encargos[j], encargos[i]];
  }
  e.encargos = Object.fromEntries(activos(e).map((a, i) => [a, encargos[i % encargos.length]]));
}

export function iniciar(estado: EstadoJuego, ahora: number): EstadoJuego {
  if (estado.fase !== "preparacion") throw new ErrorJuego("ya_empezo", "La partida ya empezó.", 409);
  if (!puedeEmpezar(estado)) {
    throw new ErrorJuego(
      "faltan_personajes",
      `Faltan personajes: hacen falta al menos ${campanaDe(estado).jugadores.min} para empezar.`,
    );
  }
  const e = structuredClone(estado);
  e.farol = activos(e)[0];
  repartirEncargos(e, ahora);
  e.pendiente = { tipo: "inicio" };
  e.actualizado = ahora;
  return e;
}

// ───────────────────────── Acciones y tiradas ─────────────────────────

export type Eleccion =
  | { tipo: "opcion"; id: string }
  | {
      tipo: "libre";
      texto: string;
      enfoque: Enfoque;
      tirada: TiradaPedida | null;
      avanza: boolean;
    };

/** Con la Bruma en 7 o más, todo cuesta un punto extra. */
export const cdEfectiva = (e: EstadoJuego, pedida: TiradaPedida): number =>
  CD[pedida.dificultad] + (e.amenaza >= 7 ? 1 : 0);

export function validarTurnoDe(e: EstadoJuego, asiento: Asiento): void {
  if (e.fase !== "jugando") throw new ErrorJuego("fase", "Ahora no se puede actuar.", 409);
  if (e.voto) throw new ErrorJuego("hay_voto", "Primero tienen que votar.", 409);
  if (e.pendiente) throw new ErrorJuego("hay_pendiente", "Ya hay una acción en curso.", 409);
  if (e.farol !== asiento) throw new ErrorJuego("no_es_tu_turno", "El farol lo lleva otro jugador.", 409);
  if (personajeDe(e, asiento).quebrado) {
    throw new ErrorJuego("quebrado", "Tu personaje está fuera de juego hasta que termine la escena.", 409);
  }
}

export function prepararAccion(
  estado: EstadoJuego,
  asiento: Asiento,
  eleccion: Eleccion,
  ahora: number,
): EstadoJuego {
  validarTurnoDe(estado, asiento);
  const e = structuredClone(estado);

  let texto: string;
  let enfoque: Enfoque;
  let pedida: TiradaPedida | null;
  let avanza: boolean;

  if (eleccion.tipo === "opcion") {
    const opcion = e.opciones.find((o) => o.id === eleccion.id);
    if (!opcion) throw new ErrorJuego("opcion", "Esa opción ya no está disponible.", 409);
    ({ texto, enfoque, avanza } = opcion);
    pedida = opcion.tirada;
  } else {
    texto = limpiar(eleccion.texto, 200);
    if (texto.length < 3) throw new ErrorJuego("texto", "Contá un poco más qué hacés.");
    enfoque = eleccion.enfoque;
    pedida = eleccion.tirada;
    avanza = eleccion.avanza;
  }

  // Una tirada superada siempre acerca a resolver la escena; sin tirada,
  // solo se regala un avance por escena.
  avanza = pedida ? true : avanza && e.escena.libres < AVANCES_LIBRES_POR_ESCENA;

  e.pendiente = {
    tipo: "accion",
    asiento,
    texto,
    enfoque,
    pedida,
    cd: pedida ? cdEfectiva(e, pedida) : null,
    avanza,
    tirada: null,
  };
  e.opciones = [];
  agregar(e, { tipo: "accion", asiento, texto, enfoque });
  e.actualizado = ahora;
  return e;
}

export interface Ayudas {
  rasgo?: boolean;
  companero?: boolean;
  objeto?: string;
}

/** Qué ayudas puede sumar un personaje a la tirada pendiente. */
export function ayudasDisponibles(e: EstadoJuego, asiento: Asiento) {
  const p = e.pendiente;
  const personaje = e.personajes[asiento];
  if (!personaje || p?.tipo !== "accion" || !p.pedida || p.asiento !== asiento) {
    return { rasgo: false, companero: false, objetos: [] as Objeto[] };
  }
  const atributo = p.pedida.atributo;
  return {
    rasgo: !personaje.rasgoUsado,
    companero:
      !!e.companero && !e.companero.usado && COMPANEROS[e.companero.id].atributos.includes(atributo),
    objetos: personaje.inventario.filter((o) => o.bono?.atributo === atributo && (o.usos ?? 0) > 0),
  };
}

export function tirar(
  estado: EstadoJuego,
  asiento: Asiento,
  ayudas: Ayudas,
  rng: Rng,
  ahora: number,
): EstadoJuego {
  const previo = estado.pendiente;
  if (previo?.tipo !== "accion" || !previo.pedida || previo.cd === null) {
    throw new ErrorJuego("sin_tirada", "No hay ninguna tirada pendiente.", 409);
  }
  if (previo.tirada) throw new ErrorJuego("ya_tirado", "Esa tirada ya se hizo.", 409);
  if (previo.asiento !== asiento) throw new ErrorJuego("no_es_tu_turno", "La tirada es de otro jugador.", 409);

  const e = structuredClone(estado);
  const p = e.pendiente as typeof previo;
  const personaje = personajeDe(e, asiento);
  const disponibles = ayudasDisponibles(e, asiento);
  const usadas: string[] = [];
  let ventaja = false;
  let bono = 0;

  if (ayudas.rasgo && disponibles.rasgo) {
    ventaja = true;
    personaje.rasgoUsado = true;
    usadas.push(`Rasgo: ${personaje.rasgo}`);
  }
  if (ayudas.companero && disponibles.companero && e.companero) {
    ventaja = true;
    e.companero.usado = true;
    usadas.push(`${COMPANEROS[e.companero.id].nombre} ayuda`);
  }
  if (ayudas.objeto) {
    const objeto = personaje.inventario.find(
      (o) => o.id === ayudas.objeto && o.bono?.atributo === previo.pedida!.atributo && (o.usos ?? 0) > 0,
    );
    if (objeto?.bono) {
      bono = objeto.bono.valor;
      objeto.usos = (objeto.usos ?? 1) - 1;
      usadas.push(`${objeto.nombre} +${bono}`);
    }
  }

  p.tirada = resolverTirada(
    {
      atributo: p.pedida!.atributo,
      dificultad: p.pedida!.dificultad,
      cd: p.cd!,
      modificador: personaje.atributos[p.pedida!.atributo],
      bono,
      ventaja,
      desventaja: e.amenaza >= AMENAZA_MAX,
      ayudas: usadas,
    },
    rng,
  );
  agregar(e, { tipo: "tirada", asiento, tirada: p.tirada });
  e.actualizado = ahora;
  return e;
}

// ───────────────────────── Rondas ─────────────────────────

/**
 * En campañas por rondas: si la acción pendiente ya está resuelta, la anota en
 * la ronda y le pasa el farol al siguiente que no actuó. Cuando actuaron todos,
 * deja pendiente la narración de la ronda entera.
 */
export function avanzarRonda(estado: EstadoJuego, ahora: number): EstadoJuego {
  const p = estado.pendiente;
  if (!campanaDe(estado).rondas || p?.tipo !== "accion" || (p.pedida && !p.tirada)) return estado;
  const e = structuredClone(estado);
  const ronda = (e.ronda ??= []);
  ronda.push({
    asiento: p.asiento,
    texto: p.texto,
    enfoque: p.enfoque,
    resultado: p.tirada?.resultado ?? null,
    avanza: p.avanza,
  });
  const falta = siguienteAsiento(e, p.asiento, (a) => enPie(e)(a) && !ronda.some((x) => x.asiento === a));
  if (falta) {
    e.farol = falta;
    e.pendiente = null;
    // Las opciones siguen en pie para los que faltan.
    e.opciones = estado.opciones.length ? estado.opciones : escenaDef(e.escena.indice).opcionesBase;
  } else {
    e.pendiente = { tipo: "ronda" };
  }
  e.actualizado = ahora;
  return e;
}

const SALIO_BIEN: Resultado[] = ["critico", "exito", "costo"];
const PEOR_PRIMERO: Resultado[] = ["pifia", "fallo", "costo", "exito", "critico"];

/** Cuánto avanza la escena con una ronda: un paso si a la mitad o más le salió bien; dos si además nadie falló y hubo un crítico. */
function avanceDeRonda(ronda: AccionRonda[]): number {
  const bien = ronda.filter((x) => (x.resultado ? SALIO_BIEN.includes(x.resultado) : x.avanza)).length;
  if (bien * 2 < ronda.length) return 0;
  return bien === ronda.length && ronda.some((x) => x.resultado === "critico") ? 2 : 1;
}

// ───────────────────────── Plan del turno ─────────────────────────

/** Decide, antes de llamar al modelo, qué tiene que pasar en esta narración. */
export function planificar(e: EstadoJuego): Plan {
  const p = e.pendiente;
  if (!p) throw new ErrorJuego("sin_pendiente", "No hay nada para narrar.", 409);
  const base = {
    resultado: null,
    avance: 0,
    cierra: false,
    motivoCierre: null,
    siguiente: null,
    amenazaForzada: 0,
    eventos: [...e.eventos],
  } satisfies Partial<Plan>;

  if (p.tipo === "inicio") return { ...base, tipo: "apertura", abre: escenasDe(e.capitulo)[0] };
  if (p.tipo === "voto") return { ...base, tipo: "tras_voto", abre: e.escena.indice + 1 };

  const ronda = p.tipo === "ronda" ? (e.ronda ?? []) : undefined;
  if (p.tipo === "accion" && p.pedida && !p.tirada) throw new ErrorJuego("falta_tirada", "Falta tirar el dado.", 409);
  // En una ronda, los límites a lo que puede cobrar el modelo los fija el peor resultado.
  const resultado: Resultado | null = ronda
    ? (PEOR_PRIMERO.find((r) => ronda.some((x) => x.resultado === r)) ?? null)
    : p.tipo === "accion"
      ? (p.tirada?.resultado ?? null)
      : null;
  const avance = ronda
    ? avanceDeRonda(ronda)
    : resultado
      ? AVANCE_POR_RESULTADO[resultado]
      : p.tipo === "accion" && p.avanza
        ? 1
        : 0;
  const def = escenaDef(e.escena.indice);
  const resuelta = e.escena.avance + avance >= def.meta;
  const agotada = !resuelta && e.escena.turnos + 1 >= def.tope;
  const cierra = resuelta || agotada;
  const siguiente = !cierra ? null : def.votoAlCerrar ? "voto" : esUltimaDelCapitulo(e.escena.indice) ? "fin" : "escena";

  return {
    tipo: "accion",
    resultado,
    avance,
    cierra,
    motivoCierre: resuelta ? "resuelta" : agotada ? "agotada" : null,
    siguiente,
    amenazaForzada: (resultado === "pifia" ? 1 : 0) + (agotada ? 1 : 0),
    ronda,
    abre: siguiente === "escena" ? e.escena.indice + 1 : null,
    eventos: [...e.eventos],
  };
}

// ───────────────────────── Aplicar la narración ─────────────────────────

/** Cuánto daño y cuánta amenaza puede imponer el modelo según cómo salió la tirada. */
const LIMITES: Record<Resultado | "ninguno", { danio: number; amenaza: number }> = {
  critico: { danio: 0, amenaza: 0 },
  exito: { danio: 0, amenaza: 0 },
  costo: { danio: 2, amenaza: 1 },
  fallo: { danio: 3, amenaza: 1 },
  pifia: { danio: 4, amenaza: 2 },
  ninguno: { danio: 1, amenaza: 1 },
};
const CURA_MAX_POR_TURNO = 2;

function ajustarAmenaza(e: EstadoJuego, delta: number): void {
  if (!delta) return;
  const antes = e.amenaza;
  e.amenaza = acotar(antes + delta, 0, AMENAZA_MAX);
  if (e.amenaza === antes) return;
  aviso(e, `La Bruma ${e.amenaza > antes ? "sube" : "cede"} a ${e.amenaza}.`, e.amenaza > antes ? "mal" : "bien");
  for (const u of UMBRALES_AMENAZA) {
    if (antes < u.valor && e.amenaza >= u.valor) {
      aviso(e, u.aviso, "mal");
      e.eventos.push(campanaDe(e).eventosAmenaza[u.valor]);
    }
  }
}

/** Quien fue entregado a la Bruma ya no está en el pueblo para tratar con nadie. */
const fueBorrado = (e: EstadoJuego, npcId: string): boolean =>
  npcId === "tobias" && e.decisiones.dilema === "dejar";

function ajustarRelacion(e: EstadoJuego, npcId: string, delta: number): boolean {
  const def = npcDef(npcId);
  if (!def || fueBorrado(e, npcId)) return false;
  // Los personajes de capítulos nuevos se suman a las partidas ya empezadas.
  const npc = (e.npcs[npcId] ??= { relacion: 0, conocido: false });
  const antes = npc.relacion;
  npc.relacion = acotar(antes + acotar(Math.round(delta), -2, 2), -3, 3);
  npc.conocido = true;
  if (npc.relacion === antes) return false;
  aviso(
    e,
    `${def.nombre}: ${ETIQUETAS_RELACION[npc.relacion].toLowerCase()}.`,
    npc.relacion > antes ? "bien" : "mal",
  );
  return npc.relacion < antes;
}

function descubrir(e: EstadoJuego, id: string): void {
  const pista = pistaDef(id);
  if (!pista || e.pistas.includes(id)) return;
  e.pistas.push(id);
  aviso(e, `Pista: ${pista.titulo}.`, "bien");
}

/** Entrega a un personaje un objeto del catálogo; si ya lo tiene, le recarga los usos. */
function entregar(e: EstadoJuego, p: Personaje, id: string): void {
  const catalogo = OBJETOS[id];
  if (!catalogo) return;
  const existente = p.inventario.find((o) => o.id === id);
  if (existente) existente.usos = (existente.usos ?? 0) + (catalogo.usos ?? 0);
  else if (p.inventario.length < INVENTARIO_MAX) p.inventario.push({ ...catalogo });
  else return;
  aviso(e, `${p.nombre} consigue: ${catalogo.nombre}.`, "bien");
}

function ajustarVida(e: EstadoJuego, asiento: Asiento, delta: number): void {
  const p = e.personajes[asiento];
  if (!p || !delta) return;
  const antes = p.vida;
  p.vida = acotar(antes + delta, 0, p.vidaMax);
  if (p.vida === antes) return;
  const d = p.vida - antes;
  aviso(e, `${p.nombre} ${d > 0 ? "recupera" : "pierde"} ${Math.abs(d)} de vida.`, d > 0 ? "bien" : "mal");
}

function aplicarInventario(e: EstadoJuego, cambios: SalidaDM["cambios"]["inventario"]): boolean {
  let perdio = false;
  for (const c of cambios) {
    const p = e.personajes[c.jugador];
    if (!p) continue;
    const clave = limpiar(c.objeto, 40);
    if (!clave) continue;
    if (c.accion === "agregar") {
      if (p.inventario.length >= INVENTARIO_MAX) continue;
      const catalogo = OBJETOS[clave.toLowerCase()];
      const objeto: Objeto = catalogo
        ? { ...catalogo }
        : {
            id: `x${e.secuencia + 1}`,
            nombre: clave,
            descripcion: limpiar(c.descripcion, 140),
          };
      // Un objeto de catálogo repetido recarga sus usos en vez de duplicarse.
      const existente = catalogo && p.inventario.find((o) => o.id === catalogo.id);
      if (existente) existente.usos = (existente.usos ?? 0) + (catalogo.usos ?? 0);
      else p.inventario.push(objeto);
      aviso(e, `${p.nombre} consigue: ${objeto.nombre}.`, "bien");
    } else {
      const i = p.inventario.findIndex(
        (o) => o.id === clave.toLowerCase() || o.nombre.toLowerCase() === clave.toLowerCase(),
      );
      if (i < 0) continue;
      const [quitado] = p.inventario.splice(i, 1);
      aviso(e, `${p.nombre} pierde: ${quitado.nombre}.`, "mal");
      perdio = true;
    }
  }
  return perdio;
}

function aplicarCambios(e: EstadoJuego, plan: Plan, salida: SalidaDM, actor: Asiento | null): void {
  const c = salida.cambios;
  const limite = LIMITES[plan.tipo === "accion" ? (plan.resultado ?? "ninguno") : "ninguno"];
  let huboCosto = false;

  // Vida: se suma por jugador y se acota al rango que permite el resultado.
  for (const asiento of ASIENTOS) {
    const suma = c.vida.filter((v) => v.jugador === asiento).reduce((s, v) => s + Math.round(v.delta), 0);
    // En una ronda, a cada uno solo lo puede lastimar su propio resultado.
    const propio = plan.ronda?.find((x) => x.asiento === asiento);
    const danio = plan.ronda ? (propio ? LIMITES[propio.resultado ?? "ninguno"].danio : 1) : limite.danio;
    const delta = acotar(suma, -danio, CURA_MAX_POR_TURNO);
    if (delta < 0) huboCosto = true;
    ajustarVida(e, asiento, delta);
  }

  for (const npcId of new Set(c.relaciones.map((r) => r.npc))) {
    const suma = c.relaciones.filter((r) => r.npc === npcId).reduce((s, r) => s + r.delta, 0);
    if (ajustarRelacion(e, npcId, suma)) huboCosto = true;
  }

  if (aplicarInventario(e, c.inventario)) huboCosto = true;

  // La Bruma solo retrocede por mérito propio con un éxito crítico (y al resolver una escena).
  const cede = plan.resultado === "critico" ? -1 : 0;
  let amenaza = acotar(Math.round(c.amenaza), cede, limite.amenaza) + plan.amenazaForzada;
  if (amenaza > 0) huboCosto = true;

  // Un fallo sin consecuencias no es un fallo: si el modelo no cobró nada, cobra el código.
  if (plan.ronda) {
    // En una ronda casi siempre falla alguien: la Bruma solo cobra si a la mayoría le fue mal.
    if (!huboCosto && plan.avance === 0) amenaza = Math.max(amenaza, 0) + 1;
  } else if (plan.tipo === "accion" && !huboCosto) {
    if (plan.resultado === "fallo") amenaza = Math.max(amenaza, 0) + 1;
    if (plan.resultado === "costo" && actor) ajustarVida(e, actor, -1);
  }
  ajustarAmenaza(e, amenaza);

  // Pistas: solo las del capítulo en curso que ya pueden haber aparecido, de a
  // una por narración y nunca en la apertura, para que no se gasten de entrada.
  let nuevas = 0;
  for (const id of plan.tipo === "apertura" ? [] : c.pistas) {
    const pista = pistaDef(id);
    if (!pista || pista.escena > e.escena.indice || escenaDef(pista.escena).capitulo !== e.capitulo) continue;
    if (e.pistas.includes(id) || nuevas >= PISTAS_POR_NARRACION) continue;
    descubrir(e, id);
    nuevas += 1;
  }

  if (plan.tipo !== "apertura") {
    for (const asiento of new Set(c.secretoRevelado)) {
      const p = e.personajes[asiento];
      if (!p || p.secretoRevelado) continue;
      p.secretoRevelado = true;
      aviso(e, `El secreto de ${p.nombre} sale a la luz.`, "neutro");
    }
  }

  for (const hecho of c.memoria) {
    const texto = limpiar(hecho, 140);
    if (texto && !e.memoria.includes(texto)) e.memoria.push(texto);
  }
  if (e.memoria.length > MAX_MEMORIA) e.memoria.splice(0, e.memoria.length - MAX_MEMORIA);

  // Un susurro por jugador y por turno.
  for (const asiento of ASIENTOS) {
    const s = salida.susurros.find((x) => x.jugador === asiento);
    const texto = s && limpiar(s.texto, 280);
    if (!texto || !e.personajes[asiento]) continue;
    const ultimo = e.susurros.findLast((x) => x.para === asiento);
    if (ultimo && e.turno - (ultimo.turno ?? e.turno) < TURNOS_ENTRE_SUSURROS) continue;
    e.secuencia += 1;
    e.susurros.push({ id: e.secuencia, para: asiento, texto, turno: e.turno });
  }
  if (e.susurros.length > MAX_SUSURROS) e.susurros.splice(0, e.susurros.length - MAX_SUSURROS);
}

/** Deja entre 2 y 3 opciones válidas; completa con las de respaldo de la escena. */
export function opcionesValidas(opciones: Opcion[], indiceEscena: number, libres: number): Opcion[] {
  const limpias: Opcion[] = [];
  const vistas = new Set<string>();
  const sumar = (o: Opcion) => {
    const texto = limpiar(o.texto, 110);
    const clave = texto.toLowerCase();
    if (texto.length < 4 || vistas.has(clave) || limpias.length >= 3) return;
    vistas.add(clave);
    limpias.push({
      id: "abc"[limpias.length],
      texto,
      enfoque: o.enfoque,
      tirada: o.tirada,
      avanza: o.tirada ? true : o.avanza && libres < AVANCES_LIBRES_POR_ESCENA,
    });
  };
  opciones.forEach(sumar);

  // Siempre tiene que haber al menos una forma de avanzar.
  if (limpias.length < 2 || !limpias.some((o) => o.avanza)) {
    const base = escenaDef(indiceEscena).opcionesBase;
    if (limpias.length >= 3) limpias.length = 2;
    const presentes = new Set(limpias.map((o) => o.enfoque));
    [...base.filter((o) => !presentes.has(o.enfoque)), ...base].forEach(sumar);
  }
  return limpias;
}

/** Opciones de un voto que siguen teniendo sentido: no se repite una mejora ya hecha. */
function opcionesDeVoto(e: EstadoJuego, id: VotoId) {
  const opciones = VOTOS[id].opciones;
  return id === "mejora" ? opciones.filter((o) => !e.refugio.mejoras.includes(o.id)) : opciones;
}

function crearVoto(e: EstadoJuego, id: VotoId): Voto {
  const def = VOTOS[id];
  return {
    id,
    pregunta: def.pregunta,
    contexto: def.contexto,
    opciones: opcionesDeVoto(e, id).map(({ id, titulo, detalle }) => ({ id, titulo, detalle })),
    elecciones: {},
    ronda: 1,
    anteriores: null,
  };
}

function abrirEscena(e: EstadoJuego, indice: number): void {
  const def = escenaDef(indice);
  e.escena = { indice, avance: 0, turnos: 0, libres: 0 };
  agregar(e, { tipo: "escena", escena: indice });
  for (const id of def.npcs) {
    // Quien fue borrado del pueblo no vuelve a aparecer en sus escenas.
    if (fueBorrado(e, id)) continue;
    (e.npcs[id] ??= { relacion: 0, conocido: false }).conocido = true;
  }
}

function cerrarEscena(e: EstadoJuego, plan: Plan, salida: SalidaDM): void {
  const def = escenaDef(e.escena.indice);
  if (plan.motivoCierre === "agotada") {
    aviso(e, "Se les acabó el tiempo: la escena se resuelve, pero a un costo.", "mal");
  } else {
    // Resolver bien una escena le quita terreno a la Bruma.
    ajustarAmenaza(e, -1);
  }
  e.resumenes.push({
    capitulo: e.capitulo,
    escena: e.escena.indice,
    titulo: def.titulo,
    texto: limpiar(salida.resumenEscena, 400) || def.resumenBase,
  });
  // Un respiro entre escenas.
  for (const asiento of ASIENTOS) {
    const p = e.personajes[asiento];
    if (!p) continue;
    if (p.quebrado) {
      p.quebrado = false;
      p.vida = Math.max(p.vida, VIDA_AL_LEVANTARSE);
    } else {
      p.vida = Math.min(p.vidaMax, p.vida + 1);
    }
  }
  if (e.companero) e.companero.usado = false;

  if (plan.siguiente === "voto" && def.votoAlCerrar) {
    e.voto = crearVoto(e, def.votoAlCerrar);
    if (esUltimaDelCapitulo(e.escena.indice)) e.fase = "fin_capitulo";
  } else if (plan.siguiente === "fin") {
    e.fase = "fin_capitulo";
  } else if (plan.abre !== null) {
    abrirEscena(e, plan.abre);
  }
}

/** Marca a quien llegó a 0 de vida. Si caen todos, la Bruma cobra y los devuelve. */
function revisarQuebrados(e: EstadoJuego): void {
  for (const asiento of ASIENTOS) {
    const p = e.personajes[asiento];
    if (!p || p.quebrado || p.vida > 0) continue;
    p.quebrado = true;
    aviso(e, `${p.nombre} no puede más: queda fuera de juego hasta que termine la escena.`, "mal");
    ajustarAmenaza(e, 1);
  }
  const todos = ASIENTOS.map((a) => e.personajes[a]).filter((p): p is Personaje => !!p);
  if (todos.length > 0 && todos.every((p) => p.quebrado)) {
    for (const p of todos) {
      p.quebrado = false;
      p.vida = VIDA_AL_LEVANTARSE;
    }
    aviso(e, "Caen todos. La Bruma los cubre un momento… y los suelta. Despiertan con frío en los huesos.", "mal");
    ajustarAmenaza(e, 2);
  }
}

export function aplicarNarracion(
  estado: EstadoJuego,
  plan: Plan,
  salida: SalidaDM,
  ahora: number,
): EstadoJuego {
  const e = structuredClone(estado);
  const p = e.pendiente;
  const actor = p?.tipo === "accion" ? p.asiento : null;

  // Los eventos que ya viajaron en este plan quedan consumidos.
  e.eventos = e.eventos.filter((ev) => !plan.eventos.includes(ev));

  if (plan.tipo === "apertura") {
    e.fase = "jugando";
    abrirEscena(e, plan.abre ?? escenasDe(e.capitulo)[0]);
  }
  agregar(e, { tipo: "narracion", texto: limpiarNarracion(salida.narracion) });

  aplicarCambios(e, plan, salida, actor);

  if (plan.tipo === "accion") {
    e.escena.avance += plan.avance;
    e.escena.turnos += 1;
    if (p?.tipo === "accion" && !p.pedida && plan.avance > 0) e.escena.libres += 1;
  }
  // Ronda narrada: la próxima la abre quien sigue al que abrió esta.
  if (plan.ronda?.length) {
    const abrio = plan.ronda[0].asiento;
    e.ronda = [];
    e.farol = abrio;
    e.farol = siguienteAsiento(e, abrio, enPie(e)) ?? abrio;
  }

  revisarQuebrados(e);
  if (plan.cierra) cerrarEscena(e, plan, salida);
  if (plan.tipo === "tras_voto" && plan.abre !== null) abrirEscena(e, plan.abre);

  e.opciones = e.voto || e.fase === "fin_capitulo" ? [] : opcionesValidas(salida.opciones, e.escena.indice, e.escena.libres);

  // El farol cambia de mano después de cada acción, salvo que el otro esté caído.
  if (actor) e.farol = siguienteAsiento(e, actor, enPie(e)) ?? actor;

  e.pendiente = null;
  e.narrando = null;
  e.turno += 1;
  e.actualizado = ahora;
  return e;
}

/** Normaliza saltos de línea y recorta narraciones desbordadas. */
export function limpiarNarracion(texto: string): string {
  return texto
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 2400);
}

// ───────────────────────── Votos ─────────────────────────

function aplicarEfectos(e: EstadoJuego, efectos: EfectosVoto): void {
  if (efectos.companero) e.companero = { id: efectos.companero, usado: false };
  if (efectos.pierdeCompanero) e.companero = null;
  if (efectos.pista) descubrir(e, efectos.pista);
  if (efectos.objeto) {
    for (const asiento of ASIENTOS) {
      const p = e.personajes[asiento];
      if (p) entregar(e, p, efectos.objeto);
    }
  }
  if (efectos.mejora) e.refugio.mejoras.push(efectos.mejora);
  if (efectos.revelaFarol) {
    const p = e.personajes[e.farol];
    if (p && !p.secretoRevelado) {
      p.secretoRevelado = true;
      aviso(e, `El secreto de ${p.nombre} sale a la luz.`, "neutro");
    }
  }
  if (efectos.revelaTodos) {
    for (const asiento of ASIENTOS) {
      const p = e.personajes[asiento];
      if (p) p.secretoRevelado = true;
    }
    aviso(e, "Los secretos de todos salen a la luz.", "neutro");
  }
  if (efectos.danio) {
    for (const asiento of ASIENTOS) if (e.personajes[asiento]) ajustarVida(e, asiento, -efectos.danio);
    revisarQuebrados(e);
  }
  if (efectos.vidaMax) {
    for (const asiento of ASIENTOS) {
      const p = e.personajes[asiento];
      if (!p) continue;
      p.vidaMax = Math.max(4, p.vidaMax + efectos.vidaMax);
      p.vida = Math.min(p.vida, p.vidaMax);
    }
    aviso(e, `Cada uno pierde ${Math.abs(efectos.vidaMax)} de vida máxima.`, "mal");
  }
  for (const [npc, delta] of Object.entries(efectos.relaciones ?? {})) ajustarRelacion(e, npc, delta);
  if (efectos.memoria) e.memoria.push(efectos.memoria);
  if (efectos.amenaza) ajustarAmenaza(e, efectos.amenaza);
}

export function votar(
  estado: EstadoJuego,
  asiento: Asiento,
  opcionId: string,
  ahora: number,
): { estado: EstadoJuego; resuelto: boolean; narrar: boolean } {
  if (!estado.voto) throw new ErrorJuego("sin_voto", "No hay ninguna votación abierta.", 409);
  if (estado.narrando) throw new ErrorJuego("ocupado", "Esperá a que el máster termine.", 409);
  personajeDe(estado, asiento);
  const e = structuredClone(estado);
  const voto = e.voto!;
  const def = VOTOS[voto.id];
  if (!opcionesDeVoto(e, voto.id).some((o) => o.id === opcionId)) throw new ErrorJuego("opcion", "Esa opción no existe.");

  voto.elecciones[asiento] = opcionId;
  e.actualizado = ahora;
  const votantes = activos(e);
  const elegidas = votantes.map((a) => voto.elecciones[a]);
  if (elegidas.some((x) => !x)) return { estado: e, resuelto: false, narrar: false };

  let ganadora: string | null = null;
  let desempate = false;
  if (votantes.length <= 2) {
    if (elegidas[0] === elegidas[1]) ganadora = elegidas[0]!;
    // Segundo desacuerdo: decide quien lleva el farol.
    else if (voto.ronda >= 2) {
      ganadora = voto.elecciones[e.farol]!;
      desempate = true;
    }
  } else {
    // Mesa grande: gana la opción más votada; si hay empate, entre las empatadas decide el farol.
    const cuenta = new Map<string, number>();
    for (const x of elegidas) cuenta.set(x!, (cuenta.get(x!) ?? 0) + 1);
    const tope = Math.max(...cuenta.values());
    const punteras = [...cuenta].filter(([, n]) => n === tope).map(([id]) => id);
    desempate = punteras.length > 1;
    ganadora = punteras.includes(voto.elecciones[e.farol]!) ? voto.elecciones[e.farol]! : punteras[0];
  }

  if (!ganadora) {
    voto.anteriores = { ...voto.elecciones };
    voto.elecciones = {};
    voto.ronda += 1;
    return { estado: e, resuelto: false, narrar: false };
  }

  const opcion = def.opciones.find((o) => o.id === ganadora)!;
  if (desempate) {
    aviso(e, `No hubo acuerdo: decide ${personajeDe(e, e.farol).nombre}, que lleva el farol.`, "neutro");
  }
  aviso(e, opcion.aviso, "neutro");
  aplicarEfectos(e, opcion.efectos);
  e.decisiones[voto.id] = ganadora;
  e.voto = null;
  if (def.narrar) e.pendiente = { tipo: "voto", votoId: voto.id, opcionId: ganadora };
  return { estado: e, resuelto: true, narrar: def.narrar };
}

// ───────────────────────── Capítulos ─────────────────────────

/** Lo que deja la mejora del refugio elegida al cerrar el capítulo anterior. */
function aplicarMejora(e: EstadoJuego, id: string | undefined): void {
  const mejora = MEJORAS.find((m) => m.id === id);
  if (!mejora) return;
  aviso(e, `${mejora.titulo}: ${mejora.efecto.toLowerCase()}`, "bien");
  if (mejora.id === "hogar") {
    for (const asiento of ASIENTOS) {
      const p = e.personajes[asiento];
      if (p) p.vidaMax += 2;
    }
  } else if (mejora.id === "biblioteca") {
    const primera = pistasDe(e.capitulo)[0]?.id;
    if (primera) descubrir(e, primera);
  } else if (mejora.id === "cerrojos") {
    ajustarAmenaza(e, -2);
  } else if (mejora.id === "botica") {
    for (const asiento of ASIENTOS) {
      const p = e.personajes[asiento];
      if (p) entregar(e, p, "vendas");
    }
  }
}

export const hayOtroCapitulo = (e: EstadoJuego): boolean =>
  e.fase === "fin_capitulo" && !e.voto && !e.pendiente && siguienteCapitulo(e.capitulo) !== null;

/** Pasa al capítulo siguiente: un día de descanso en el refugio y la mejora elegida rinde. */
export function empezarCapitulo(estado: EstadoJuego, ahora: number): EstadoJuego {
  if (estado.fase !== "fin_capitulo" || estado.voto) {
    throw new ErrorJuego("fase", "El capítulo todavía no terminó.", 409);
  }
  if (estado.pendiente) throw new ErrorJuego("hay_pendiente", "El capítulo ya está empezando.", 409);
  const proximo = siguienteCapitulo(estado.capitulo);
  if (proximo === null) {
    throw new ErrorJuego("sin_capitulo", "El capítulo siguiente todavía no está escrito.", 409);
  }
  const e = structuredClone(estado);
  e.capitulo = proximo;
  aviso(
    e,
    campanaDe(e).rondas
      ? `Capítulo ${ordenDe(e.capitulo)}: ${capituloDef(e.capitulo).titulo}. Un respiro, y un encargo nuevo para cada uno.`
      : `Capítulo ${ordenDe(e.capitulo)}: ${capituloDef(e.capitulo).titulo}. Un día de descanso.`,
  );
  repartirEncargos(e, ahora);
  e.ronda = [];
  e.farol = activos(e)[0] ?? e.farol;
  // La mejora se aplica antes de curar, para que la vida máxima nueva cuente.
  aplicarMejora(e, e.refugio.mejoras[e.refugio.mejoras.length - 1]);
  for (const asiento of ASIENTOS) {
    const p = e.personajes[asiento];
    if (!p) continue;
    p.vida = p.vidaMax;
    p.quebrado = false;
    p.rasgoUsado = false;
  }
  if (e.companero) e.companero.usado = false;
  e.opciones = [];
  e.pendiente = { tipo: "inicio" };
  e.actualizado = ahora;
  return e;
}

// ───────────────────────── Acciones menores ─────────────────────────

export function pasarFarol(estado: EstadoJuego, asiento: Asiento, ahora: number): EstadoJuego {
  validarTurnoDe(estado, asiento);
  const yaActuo = (a: Asiento) => !!estado.ronda?.some((x) => x.asiento === a);
  const otro = siguienteAsiento(estado, asiento, (a) => enPie(estado)(a) && !yaActuo(a));
  const companero = otro && estado.personajes[otro];
  if (!otro || !companero) {
    throw new ErrorJuego("no_puede", "Nadie más puede tomar el farol ahora.", 409);
  }
  const e = structuredClone(estado);
  e.farol = otro;
  aviso(e, `${personajeDe(e, asiento).nombre} le pasa el farol a ${companero.nombre}.`);
  e.actualizado = ahora;
  return e;
}

export function cambiarTerror(
  estado: EstadoJuego,
  nivel: NivelTerror,
  ahora: number,
): EstadoJuego {
  if (nivel === estado.terror) return estado;
  const sube = NIVELES_ORDEN[nivel] > NIVELES_ORDEN[estado.terror];
  // Bajar la intensidad es una herramienta de seguridad: siempre se puede.
  if (sube && estado.fase !== "preparacion") {
    throw new ErrorJuego("terror", "Con la partida empezada la intensidad solo se puede bajar.", 409);
  }
  const e = structuredClone(estado);
  e.terror = nivel;
  if (e.fase !== "preparacion") aviso(e, `Intensidad del terror: ${NOMBRE_TERROR[nivel].toLowerCase()}.`);
  e.actualizado = ahora;
  return e;
}

/** El retrato se puede cambiar en cualquier momento: no toca las reglas. */
export function cambiarAvatar(estado: EstadoJuego, asiento: Asiento, avatar: unknown, ahora: number): EstadoJuego {
  const e = structuredClone(estado);
  const p = personajeDe(e, asiento);
  p.avatar = normalizarAvatar(avatar, semillaDeAvatar(p));
  e.actualizado = ahora;
  return e;
}

// ───────────────────────── Retrato pintado ─────────────────────────

export const RETRATOS_MAX = 6;
const PINTANDO_VENCE_MS = 120_000;

export const estaPintando = (p: Personaje, ahora: number): boolean =>
  !!p.retrato?.pintando && ahora - p.retrato.pintando < PINTANDO_VENCE_MS;

/**
 * Reserva un intento de retrato. Devuelve null si no hay nada que pintar: ya
 * hay uno con esa misma descripción, hay otro en curso o se acabaron los intentos.
 */
export function empezarRetrato(
  estado: EstadoJuego,
  asiento: Asiento,
  firma: string,
  ahora: number,
  pedido: boolean,
): EstadoJuego | null {
  const actual = personajeDe(estado, asiento);
  const r = actual.retrato;
  if (estaPintando(actual, ahora)) {
    if (pedido) throw new ErrorJuego("pintando", "Tu retrato todavía se está pintando.", 409);
    return null;
  }
  if ((r?.hechos ?? 0) >= RETRATOS_MAX) {
    if (pedido) throw new ErrorJuego("sin_retratos", "Ya no quedan retratos para este personaje.", 409);
    return null;
  }
  if (!pedido && r?.url && r.firma === firma) return null;
  const e = structuredClone(estado);
  e.personajes[asiento]!.retrato = { url: r?.url ?? null, firma: r?.firma ?? "", hechos: (r?.hechos ?? 0) + 1, pintando: ahora };
  e.actualizado = ahora;
  return e;
}

/** Cierra el intento: con `url` guarda el retrato nuevo; sin ella deja el anterior y devuelve el intento. */
export function terminarRetrato(
  estado: EstadoJuego,
  asiento: Asiento,
  firma: string,
  url: string | null,
  ahora: number,
): EstadoJuego {
  const e = structuredClone(estado);
  const p = e.personajes[asiento];
  if (!p?.retrato) return estado;
  p.retrato.pintando = null;
  if (url) {
    p.retrato.url = url;
    p.retrato.firma = firma;
  } else {
    p.retrato.hechos = Math.max(0, p.retrato.hechos - 1);
  }
  e.actualizado = ahora;
  return e;
}

export function usarObjeto(
  estado: EstadoJuego,
  asiento: Asiento,
  objetoId: string,
  ahora: number,
): EstadoJuego {
  if (estado.fase !== "jugando") throw new ErrorJuego("fase", "Ahora no se puede usar.", 409);
  const e = structuredClone(estado);
  const p = personajeDe(e, asiento);
  const i = p.inventario.findIndex((o) => o.id === objetoId && o.cura && (o.usos ?? 0) > 0);
  if (i < 0) throw new ErrorJuego("objeto", "Ese objeto no se puede usar así.");
  if (p.quebrado) throw new ErrorJuego("quebrado", "Tu personaje está fuera de juego.", 409);
  if (p.vida >= p.vidaMax) throw new ErrorJuego("vida_llena", "Ya estás con toda la vida.");
  const objeto = p.inventario[i];
  aviso(e, `${p.nombre} usa ${objeto.nombre}.`);
  ajustarVida(e, asiento, objeto.cura!);
  objeto.usos = (objeto.usos ?? 1) - 1;
  if (objeto.usos <= 0) p.inventario.splice(i, 1);
  e.actualizado = ahora;
  return e;
}
