import "server-only";
import { COMPANEROS, MEJORAS, NOMBRE_ATRIBUTO } from "./contenido";
import type { CampanaId, CompaneroId, Lugar, Opcion, OpcionVoto, VotoId } from "./tipos";

// La campaña «La Hora Trece». Todo lo que está acá es contenido escrito a mano:
// el modelo improvisa la prosa, pero la estructura, las pistas y las
// consecuencias de los votos las fija el código.

export const CAMPANA = {
  titulo: "La Hora Trece",
  pueblo: "Valdebruma",
};

export interface CapituloDef {
  /** Identificador único entre todas las campañas (no es el número que se muestra). */
  numero: number;
  /** A qué campaña pertenece; si falta, a «La Hora Trece». */
  campana?: CampanaId;
  titulo: string;
  /** Qué puede y qué no puede revelar el máster en este capítulo. */
  guia: string;
  /** Directiva para la narración que abre el capítulo. */
  apertura: string;
  /** El último de la campaña: al cerrarlo no hay «continuará». */
  final?: boolean;
}

export const CAPITULOS: CapituloDef[] = [
  {
    numero: 1,
    titulo: "La posada del Farol Tuerto",
    guia: "En este capítulo NO reveles quién es la Dama ni el origen del pacto. Sí pueden descubrir que la gente es borrada, que Anselmo escribe los nombres y que la campana suena sola.",
    apertura:
      "Abrí el capítulo: la llegada de los dos personajes a Valdebruma bajo la tormenta y su entrada a la posada (escena 1). Presentá a cada personaje por su nombre con un detalle propio.",
  },
  {
    numero: 2,
    titulo: "Los Ausentes",
    guia: [
      "En este capítulo los personajes entran en la bruma a buscar a Lía. Pueden descubrir que los Ausentes siguen existiendo en un reflejo del pueblo, que el cariño de alguien les conserva el rostro y que la Dama lleva una cuenta que no cierra. NO reveles todavía que la Peste Gris era la Dama ni quién fue el séptimo fundador: solo que falta una firma.",
      "La Dama del Umbral nunca aparece como figura: habla por boca de varios Ausentes a la vez, con cortesía, como quien cobra una deuda.",
      "Tené en cuenta lo que decidieron en el campanario (ver «Decisiones tomadas» y «Memoria»):",
      "- Si arrancaron la página: Tobías está en el pueblo y quiere ir con ellos; la bruma ya entra en las casas y Anselmo no los ayuda.",
      "- Si dejaron sonar la campana: Tobías fue borrado. Nadie en el pueblo lo recuerda; está en la bruma, cerca de Lía, y todavía tiene rostro porque los personajes lo recuerdan. No aparece en las escenas del pueblo, y lo que decidan sobre Lía al final vale para los dos hermanos.",
      "- Si entregaron un recuerdo propio: Tobías está en el pueblo, y dentro de la bruma los Ausentes llaman a los personajes por su nombre.",
    ].join("\n"),
    apertura:
      "Abrí el capítulo 2: cae la segunda noche en la Casa del Guarda. Recordá en una frase cómo terminó la noche del campanario según lo que decidieron, y mostrá la mejora que hicieron en la casa. Después, la mesa: alguien que no ven acaba de servir tres platos.",
  },
];

CAPITULOS.push({
  numero: 3,
  titulo: "Los Siete",
  guia: [
    "En este capítulo los personajes siguen el hilo de los siete nudos hasta la cripta de los fundadores. Acá SÍ se revela el giro, de a poco y por lo que encuentran: en la cripta (escena 3), que nunca hubo peste y que seis fundadores pagaron con sus nombres; frente al umbral (escena 4), que la séptima firma es de Úrsula. No lo adelantes en las escenas 1 y 2: ahí solo hay indicios (una aguja, un acta raspada, un hilo rojo donde no debería estar).",
    "NO reveles todavía cómo se rompe el pacto: eso es del capítulo 4. La Dama sigue sin tener figura; en la cripta habla por boca de los seis fundadores, que son Ausentes muy viejos, corteses y cansados.",
    "Úrsula no miente: de verdad no lo recuerda. Si le dicen quién es, lo recuerda todo de golpe.",
    "Tené en cuenta lo que pasó en la bruma (ver «Decisiones tomadas» y «Memoria»):",
    "- Si se llevaron a Lía: está en la posada con Brígida, la cuenta de la Dama quedó rota y los Ausentes se acercan al pueblo de noche.",
    "- Si el compañero animal ocupó su lugar: Lía está en el pueblo; no tienen compañero, y a veces lo oyen del otro lado de la bruma.",
    "- Si dejaron a Lía: sigue en la bruma con los chicos, y los personajes llevan su nana.",
    "El alguacil Corvino tiene en su casa una cuna y no recuerda para quién era: en el archivo puede aparecer el acta de su hija.",
  ].join("\n"),
  apertura:
    "Abrí el capítulo 3: es de día, un día gris, y los personajes cruzan la plaza hacia el cabildo con el hilo de los siete nudos. Recordá en una frase cómo volvieron de la bruma según lo que decidieron con Lía. El alguacil Corvino está en la puerta del archivo.",
});

CAPITULOS.push({
  numero: 4,
  titulo: "La Dama del Umbral",
  final: true,
  guia: [
    "Es el último capítulo y transcurre en una sola noche. Acá se revela quién es la Dama y cómo se termina el pacto. No lo sueltes de entrada: en las escenas 1 y 2 juntan lo que hace falta; en la 3 suben; en la 4 la Dama llega al campanario y ahí se entiende quién es; la 5 es el epílogo.",
    "Lo que está en juego: el último renglón del Libro se escribe solo, con los nombres de los dos personajes. Si la tinta se seca a la hora trece, el pueblo los olvida y pasan a la bruma.",
    "Cómo se le hace frente: una campana que toca una mano viva da horas que existen. Con el badajo puesto y alguien tirando de la soga, la campana da las doce y la trece no llega. Mientras tanto hay que decir en voz alta los nombres de los Ausentes: cada nombre dicho por alguien que lo quiso devuelve un rostro.",
    "La Dama llega en la escena 4 sin figura: un lugar vacío que la bruma rodea, del tamaño de una persona sentada. Habla ella misma por primera vez, con voz baja y cansada, sin amenazar. Qué se hace con ella lo deciden los jugadores con un voto: no lo resuelvas vos.",
    "Tené en cuenta lo decidido antes (ver «Decisiones tomadas» y «Memoria»):",
    "- Tobías: si fue borrado en el capítulo 1, sigue en la bruma y es uno de los nombres que hay que decir. Si no, anda con ellos y quiere tirar de la soga.",
    "- Lía: si salió de la bruma, está con Brígida y sabe los nombres de los chicos; si se quedó, la oyen cantar la nana del otro lado.",
    "- Úrsula: si le dijeron quién es, lo recuerda todo y viene por su voluntad con el ovillo; si la entregaron, es una Ausente más en la plaza y el ovillo quedó en su umbral; si callaron, ella no sabe nada y los personajes llevan su firma.",
    "- El compañero animal, si lo perdieron en la bruma, aparece entre los Ausentes de la plaza.",
    "Brígida sigue siendo el alivio cómico, incluso esta noche: cobra, protesta y sube igual.",
  ].join("\n"),
  apertura:
    "Abrí el capítulo 4: cae la última noche sobre la Casa del Guarda. Mostrá en una frase la mejora que hicieron en la casa. El Guarda puso la mesa para mucha más gente de la que cabe. Golpean la puerta: es el padre Anselmo, sin aliento, con el Libro de los Ausentes abrazado contra el pecho.",
});

CAPITULOS.push({
  numero: 101,
  campana: "coche",
  titulo: "La lista del cochero",
  guia: [
    "Es el primer capítulo: una noche de viaje en diligencia. Los personajes no se conocen entre sí y cada uno cree que viaja por un asunto propio.",
    "Pueden descubrir: que en el coche hay una persona más que en la lista; que todas las cartas tienen la misma letra y el mismo sello; que quien firma, Casilda Orbe, murió hace tres semanas; que bajo el pescante viaja un cofre lacrado; que en el páramo se cobra peaje.",
    "NO reveles todavía: qué hay dentro del cofre, quién es el escribano Quintana ni quién mandó los encargos. La pasajera de más solo dice quién es si los jugadores votan verle la cara, y aun así dice poco: su nombre, Irene, y que va a enterrar a su madre.",
    "Es una mesa de varios jugadores con desconfianza: cada uno lleva un encargo secreto (ver «Encargos»). Nunca reveles el encargo de un personaje a los demás. Sí podés tentarlo por susurro cuando la escena le da una ocasión de cumplirlo.",
    "En cada ronda actúan todos: narrá cómo se cruzan y se estorban o se ayudan esas acciones en un mismo momento, no una después de otra. Nombrá a cada personaje que actuó.",
    "Mateo, el cochero, es el alivio cómico: supersticioso, charlatán, le habla a los caballos más que a la gente.",
  ].join("\n"),
  apertura:
    "Abrí el capítulo: atardece en la Posta del Cruce, la última antes del Páramo de la Sal. La diligencia «La Rezagada» está enganchada y el cochero cuenta pasajeros con una lista en la mano. Presentá a cada personaje por su nombre en una sola frase, llegando por separado, con un detalle propio. Ninguno conoce a los otros.",
});

CAPITULOS.push({
  numero: 102,
  campana: "coche",
  titulo: "Casa Orbe",
  guia: [
    "Segundo capítulo: lo que queda de la noche, dentro de Casa Orbe, la casa grande de la Compañía en medio del páramo. Los recibe el escribano Lázaro Quintana, encantador y con prisa: quiere que todos firmen un papel antes del alba.",
    "Acá se puede descubrir: que la pasajera del velo es Irene Orbe, hija de Casilda; que Casilda citó a cada uno para saldar una cuenta, no para regalar nada; qué es el Libro de Deudas; que los encargos sin firma los escribió Quintana; y, al final, que Quintana les debe a los Recaudadores un peaje viejo y piensa pagarlo con uno de los pasajeros.",
    "NO resuelvas todavía qué pasa con Quintana ni quién «no llega»: eso es del capítulo 3, en el Paso.",
    "Cada jugador recibe un encargo NUEVO en esta casa (ver «Encargos»): lo encuentra doblado bajo su plato. Nunca reveles el de uno a los demás.",
    "Tené en cuenta lo que decidieron en el viaje (ver «Decisiones tomadas» y «Memoria»):",
    "- Rumbo: si se desviaron hacia las luces, llegan de noche cerrada y nadie los esperaba tan temprano. Si siguieron al Paso, lo encontraron cerrado por la nieve y un mozo de posta les dio un recado: «la lectura es en Casa Orbe»; llegan tarde y helados. Si volvieron a la venta, don Elías no abrió y los Recaudadores los fueron arreando por el páramo hasta el portón.",
    "- La pasajera: si la dejaron viajar, entra con ellos sin levantarse el velo y Quintana palidece al verla. Si le vieron la cara, ya saben que se llama Irene. Si la bajaron en la venta, llegó antes que ellos, a caballo, y no les habla.",
    "- El peaje: si entregaron el cofre, nadie recuerda bien qué llevaba, y el Libro de Deudas que aparece en la casa es el borrador, incompleto. Si pagaron con una verdad, Quintana ya la conoce: en el páramo todo se sabe. Si cruzaron sin pagar, los Recaudadores rodean la casa desde el principio.",
    "Remedios, el ama de llaves, es quien dice las cosas como son. Quintana es el alivio cómico involuntario: pomposo, pulcro, ofendido por el barro en sus alfombras.",
  ].join("\n"),
  apertura:
    "Abrí el capítulo 2: el coche llega al portón de Casa Orbe. Contá en una frase cómo llegaron según el rumbo que votaron. La casa tiene todas las ventanas encendidas. En la escalinata los espera un hombre pulcro, de levita, con un reloj en la mano: el escribano Quintana. Detrás, en la puerta, una mujer mayor con un manojo de llaves.",
});

export const capituloDef = (numero: number): CapituloDef => {
  const c = CAPITULOS.find((x) => x.numero === numero);
  if (!c) throw new Error(`Capítulo inexistente: ${numero}`);
  return c;
};

/** La verdad oculta. Solo la lee el máster; nunca viaja al cliente. */
export const BIBLIA = `
LA VERDAD (solo para vos; los jugadores la descubren de a poco, por pistas):
- Valdebruma es un pueblo en el fondo de un valle donde la niebla nunca se levanta. Hace cien años la Peste Gris lo estaba vaciando. Los siete fundadores pactaron con la Dama del Umbral, una presencia que habita la bruma.
- El pacto: la peste se retira mientras el pueblo entregue, cada noche, a una persona. No su vida: su recuerdo. Quien es entregado es borrado de la memoria de todos y pasa a la bruma como un Ausente: una figura sin rostro que repite gestos de su vida anterior.
- El mecanismo: el Custodio escribe un nombre en el Libro de los Ausentes. Cuando la tinta se seca suena la campanada trece —una hora que no existe— y el nombre se cumple. La campana no tiene badajo: nadie la toca.
- Si una noche no se escribe ningún nombre, la Dama elige al azar y la bruma avanza un poco más sobre el pueblo.
- El Custodio actual es el padre Anselmo. Heredó la carga y elige a quienes cree que "menos falta harán". Se odia por eso. No es un villano: es un hombre agotado que espera que alguien le muestre otra salida.
- Los vecinos no saben nada. Sienten huecos: un plato de más, una cuna vacía, un apodo sin dueño. Les incomoda y cambian de tema.
- El amor resiste al olvido. Tobías todavía recuerda a su hermana Lía, borrada hace tres noches. Esa grieta es la clave para romper el pacto en capítulos futuros.
- Los forasteros no están atados al pacto: los personajes recuerdan lo que el pueblo olvida. Por eso la Dama se interesa en ellos.
- Cuando suena la campanada trece, la gente del pueblo queda inmóvil un instante y después olvida. Los personajes de los jugadores NUNCA quedan inmóviles ni olvidan: los dos lo ven todo.
- Dentro de la bruma hay un reflejo de Valdebruma: las mismas calles, con todas las ventanas encendidas y las mesas servidas. Los Ausentes viven allí sin saber que fueron olvidados. Recuperan el rostro por un instante cuando alguien dice su nombre en voz alta.
- La Dama lleva la cuenta de los entregados. Nadie sale de la bruma sin que la cuenta cierre: si uno sale, otro ocupa su lugar. Y la cuenta arrastra un hueco desde el principio: siete firmaron el pacto, seis pagaron.
- Giro reservado (NO lo reveles ni lo insinúes en los capítulos 1 y 2): la Peste Gris nunca fue una enfermedad. Era la propia Dama, que ya entonces se llevaba a la gente de la memoria. Los fundadores no la detuvieron: le pusieron horario.
- Los Siete (NO antes del capítulo 3): seis fundadores pagaron el pacto con sus propios nombres y fueron los primeros Ausentes; sus tumbas en la cripta están vacías. La séptima raspó su firma de la ordenanza con una aguja de tejer para no pagar. Es Úrsula Vane, la tejedora. Como nunca pagó, la Dama no puede llevársela ni ella puede morir: lleva cien años atando un nudo por cada entregado y se obligó a olvidar por qué. Mientras su deuda siga abierta, la cuenta no cierra y el pacto no puede terminar.
- La Dama (NO antes del capítulo 4): es la primera olvidada del valle. Una mujer que vivía sola en la casa de la linde —la que hoy llaman Casa del Guarda— antes de que hubiera pueblo. Cuando murió no quedaba nadie que dijera su nombre, y ni ella lo sabe ya. No tiene figura porque nadie la recuerda. Se lleva la memoria de otros porque no tiene propia: cada Ausente es una silla ocupada en su mesa. No es malvada: está sola y cree que cobra una deuda justa. El plato de más que pone Brígida, y el de la cabecera en la mesa del Guarda, son para ella sin que nadie lo sepa.
- El final (capítulo 4): el pacto se sostiene en tres cosas: la cuenta (el Libro, el ovillo), la hora que no existe (una campana sin badajo que suena sola) y el olvido. Se puede romper (tocar la campana a mano y decir todos los nombres), renovar (firmar un pacto nuevo y pagarlo uno mismo) o cambiar (darle a la Dama un nombre y un lugar en la mesa). Lo eligen los jugadores.

ARCO DE LA CAMPAÑA:
1. La posada del Farol Tuerto: descubrir que el pueblo olvida a su gente y que la campana y el Libro son la causa.
2. Los Ausentes: entrar en la bruma y encontrar a Lía.
3. Los Siete: la cripta de los fundadores y la firma raspada.
4. La Dama del Umbral: romper o renovar el pacto.

LOS SECRETOS DE LOS PERSONAJES: cada jugador escribió un secreto. Atalo al misterio sin forzarlo: alguien de su pasado puede ser un Ausente; la Dama puede conocer ese secreto y susurrarlo; un objeto del pueblo puede reconocerlos. Insinuá primero, por susurros privados. No lo reveles al otro jugador a menos que la escena lo pida de verdad o el propio jugador lo cuente.
`.trim();

const BIBLIA_COCHE = `
LA VERDAD (solo para vos; los jugadores la descubren de a poco):
- El mundo: el Páramo de la Sal es una llanura blanca al norte de los valles. De noche lo cruza la bruma, y en la bruma cabalgan los Recaudadores: jinetes sin rostro que cobran peaje a quien cruza a oscuras. No aceptan monedas. Piden «algo que pese»: un secreto dicho en voz alta, un objeto querido, un nombre. Lo que cobran, se olvida.
- La diligencia «La Rezagada», de la Compañía de Postas Orbe, hace el último viaje del año antes de que la nieve cierre el Paso. La conduce Mateo Varga.
- Casilda Orbe, dueña de la Compañía, murió hace tres semanas. Antes de morir le escribió una carta a cada personaje citándolo a este coche «por un asunto que le conviene». Cada uno cree que la carta es solo para él.
- Por qué los citó: cada personaje le debe algo a Casilda, o ella a él. Atá a eso el secreto que escribió cada jugador. Casilda creía que uno de ellos la había arruinado. Se equivocaba: la arruinó su socio, el escribano Lázaro Quintana, que espera al final del camino para leer un testamento falso.
- El cofre lacrado que viaja bajo el pescante lleva el Libro de Deudas de Casilda, con una página por pasajero, y su testamento verdadero. Mateo no sabe qué carga.
- La pasajera de más es Irene Orbe, hija de Casilda: de luto, con velo, callada. Viaja sin dar su nombre para ver quiénes son los citados antes de que se lea el testamento. Tiene boleto, pero no figura en la lista porque la lista la escribió su madre. No es un espectro, aunque lo parezca.
- La lista del cochero está escrita de puño de Casilda. Al dorso, con otra tinta, alguien agregó: «uno de ustedes no llega». Lo escribió Quintana.
- Los encargos: además de la carta, cada personaje recibió un encargo sin firma y con paga. Los mandó Quintana, y chocan entre sí a propósito, para que los pasajeros se estorben y ninguno llegue a entenderse con los demás.

ARCO DE LA CAMPAÑA:
1. La lista del cochero: el viaje de noche, la pasajera de más, el peaje del puente.
2. Casa Orbe: el testamento, el Libro de Deudas y el escribano.
3. El Paso: el peaje de Quintana y quién no llega.
- Quintana (NO antes del capítulo 2, y su plan NO antes del final del capítulo 2): hace años cruzó el páramo de noche sin pagar y los Recaudadores no olvidan. Les debe «algo que pese» y decidió que sea una persona. Por eso citó, con la letra de Casilda, a gente a la que nadie va a reclamar: «uno de ustedes no llega» no es una amenaza, es la cuenta que hizo. El testamento que lee es falso; el verdadero deja la Compañía a Irene y perdona todas las deudas del Libro.

LOS SECRETOS DE LOS PERSONAJES: cada jugador escribió un secreto. Atalo a Casilda Orbe o a su Compañía sin forzarlo: una deuda, un favor, una carta que no se contestó. Insinuá primero, por susurros privados. No lo reveles a los demás a menos que la escena lo pida de verdad o el propio jugador lo cuente.
`.trim();

/** Un objetivo secreto. Se cumple o no según lo que el grupo termine votando. */
export interface EncargoDef {
  id: string;
  /** Capítulo en el que se reparte. */
  capitulo: number;
  texto: string;
  /** true o false cuando ya se sabe; null mientras falte la votación que lo decide. */
  cumple: (decisiones: Partial<Record<VotoId, string>>) => boolean | null;
}

const segun = (voto: VotoId, prueba: (opcion: string) => boolean) => (d: Partial<Record<VotoId, string>>) =>
  d[voto] === undefined ? null : prueba(d[voto]);

export interface CampanaDef {
  id: CampanaId;
  titulo: string;
  /** Una línea para presentarle la mesa al máster. */
  mesa: string;
  biblia: string;
  jugadores: { min: number; max: number };
  /** Si en cada ronda actúan todos antes de que el máster narre. */
  rondas: boolean;
  eventosAmenaza: Record<number, string>;
  encargos: EncargoDef[];
}

export const CAMPANAS: Record<CampanaId, CampanaDef> = {
  trece: {
    id: "trece",
    titulo: "La Hora Trece",
    mesa: "un juego de rol narrativo cooperativo para dos jugadores",
    biblia: BIBLIA,
    jugadores: { min: 2, max: 2 },
    rondas: false,
    eventosAmenaza: {
      4: "La amenaza cruzó 4: la Bruma se cuela. Mostrá una señal inquietante y concreta en la escena (algo fuera de lugar, un sonido que no corresponde).",
      7: "La amenaza cruzó 7: la Bruma aprieta. Hacé aparecer brevemente a un Ausente (figura sin rostro) o una manifestación directa; el pueblo se vuelve hostil al forastero.",
      10: "La amenaza llegó a 10: la Bruma está adentro. La Dama del Umbral repara en los personajes; uno de ellos escucha su propio nombre dicho con la voz de alguien que perdió.",
    },
    encargos: [],
  },
  coche: {
    id: "coche",
    titulo: "El Último Coche",
    mesa: "un juego de rol narrativo para un grupo de cuatro a seis jugadores que viajan juntos sin confiar del todo unos en otros",
    biblia: BIBLIA_COCHE,
    jugadores: { min: 4, max: 6 },
    rondas: true,
    eventosAmenaza: {
      4: "La amenaza cruzó 4: la bruma alcanza el camino. Mostrá una señal concreta: jinetes que cabalgan parejo con el coche, muy lejos, sin hacer ruido.",
      7: "La amenaza cruzó 7: un Recaudador cabalga un momento junto a la ventanilla. El cochero no lo ve. Los caballos sí.",
      10: "La amenaza llegó a 10: los caballos se detienen solos. Desde la bruma, una voz dice el nombre de uno de los personajes y pregunta cuánto pesa lo que calla.",
    },
    encargos: [
      {
        id: "velo",
        capitulo: 101,
        texto: "Que la pasajera de más llegue a destino sin que nadie le vea la cara.",
        cumple: segun("viajera", (o) => o === "dejarla"),
      },
      {
        id: "rostro",
        capitulo: 101,
        texto: "Saber quién es la pasajera de más antes de que termine la noche.",
        cumple: segun("viajera", (o) => o === "rostro"),
      },
      {
        id: "cofre_llega",
        capitulo: 101,
        texto: "Que el cofre lacrado siga en el coche, cerrado, cuando crucen el puente.",
        cumple: segun("peaje", (o) => o !== "cofre"),
      },
      {
        id: "cofre_pierde",
        capitulo: 101,
        texto: "Que el cofre lacrado no cruce el puente: que se quede en el páramo.",
        cumple: segun("peaje", (o) => o === "cofre"),
      },
      {
        id: "paso",
        capitulo: 101,
        texto: "Que el coche siga hacia el Paso, pase lo que pase.",
        cumple: segun("rumbo", (o) => o === "seguir"),
      },
      {
        id: "no_paso",
        capitulo: 101,
        texto: "Que el coche no llegue al Paso esta noche. Allá te esperan, y no para bien.",
        cumple: segun("rumbo", (o) => o !== "seguir"),
      },
      {
        id: "que_firmen",
        capitulo: 102,
        texto: "Que todos firmen el papel del escribano antes del alba.",
        cumple: segun("firma", (o) => o === "firmar"),
      },
      {
        id: "que_no_firmen",
        capitulo: 102,
        texto: "Que esta noche nadie ponga su firma en nada.",
        cumple: segun("firma", (o) => o !== "firmar"),
      },
      {
        id: "que_se_lea",
        capitulo: 102,
        texto: "Que el Libro de Deudas se lea entero, en voz alta, delante de todos.",
        cumple: segun("deudas", (o) => o === "leer"),
      },
      {
        id: "que_no_se_lea",
        capitulo: 102,
        texto: "Que tu página del Libro de Deudas no la lea nadie.",
        cumple: segun("deudas", (o) => o !== "leer"),
      },
      {
        id: "con_quintana",
        capitulo: 102,
        texto: "Que el coche salga hacia el Paso con el escribano a bordo.",
        cumple: segun("alba", (o) => o === "quintana"),
      },
      {
        id: "con_irene",
        capitulo: 102,
        texto: "Que el coche salga hacia el Paso con la hija de Casilda a bordo.",
        cumple: segun("alba", (o) => o === "irene"),
      },
    ],
  },
};

export const campanaDe = (e: { campana?: CampanaId }): CampanaDef => CAMPANAS[e.campana ?? "trece"];

export interface Npc {
  /** A qué campaña pertenece; si falta, a «La Hora Trece». */
  campana?: CampanaId;
  id: string;
  nombre: string;
  rol: string;
  /** Guía de voz y motivaciones, solo para el máster. */
  guia: string;
}

export const NPCS: Npc[] = [
  {
    id: "brigida",
    nombre: "Brígida Moll",
    rol: "Posadera del Farol Tuerto",
    guia: "Cincuentona, seca, sarcástica, generosa a escondidas. Es el alivio cómico: insulta con cariño y cobra por adelantado. Pone un plato de más cada noche y se enoja si le preguntan. En el fondo está aterrada de olvidar a alguien.",
  },
  {
    id: "tobias",
    nombre: "Tobías",
    rol: "Mozo de cuadra, diez años",
    guia: "Flaco, callado, observador. Huérfano: vive en la posada y Brígida lo cría a los gritos. Es el único que recuerda a su hermana Lía y ya aprendió a no decirlo: no la nombra antes de la escena del cuarto, y solo si se ganaron su confianza. Confía en los animales más que en la gente. Habla poco y en frases cortas.",
  },
  {
    id: "corvino",
    nombre: "Alguacil Corvino",
    rol: "Alguacil de Valdebruma",
    guia: "Rígido, cansado, con miedo disfrazado de autoridad. Hace cumplir el toque de queda porque 'siempre fue así'. Tiene una cuna en su casa y no recuerda para quién era. Respeta a quien le habla de frente.",
  },
  {
    id: "anselmo",
    nombre: "Padre Anselmo",
    rol: "Párroco y Custodio",
    guia: "Anciano de manos manchadas de tinta. Amable, culpable, insomne. Explica el pacto como quien confiesa. Nunca amenaza; ruega. Quiere que alguien le quite la pluma o le dé permiso para seguir.",
  },
  {
    id: "guarda",
    nombre: "El Guarda",
    rol: "Ausente de la Casa del Guarda",
    guia: "Hilario Vance, el último guarda de la linde, borrado hace años. No se lo ve ni habla: pone la mesa, corre una silla, deja abierto un cuaderno en la página justa. Es meticuloso y hospitalario. Se ofende si no prueban la sopa. Cuando alguien dice su nombre, por un instante se le adivina el perfil en el vapor.",
  },
  {
    id: "ursula",
    nombre: "Úrsula Vane",
    rol: "Tejedora de la última casa",
    guia: "Vieja, ciega, de lengua rápida y manos más rápidas. Ata un nudo en un cordel rojo cada mañana «por costumbre» y no sabe qué cuenta. Trata a todos de «criatura». Es el alivio cómico de este capítulo: regatea, se queja de las rodillas y acierta sin querer. Le teme a una sola cosa: terminar el ovillo.",
  },
  {
    id: "lia",
    nombre: "Lía",
    rol: "Hermana de Tobías, Ausente",
    guia: "Doce años. Conserva medio rostro porque su hermano todavía la recuerda. Dentro de la bruma cuida a los Ausentes más chicos y les canta una nana. Es práctica y valiente, y habla como quien ya lloró todo lo que tenía. No recuerda su nombre hasta que alguien se lo dice. No quiere irse si eso deja solos a los chicos.",
  },
];

NPCS.push(
  {
    campana: "coche",
    id: "mateo",
    nombre: "Mateo Varga",
    rol: "Cochero de La Rezagada",
    guia: "Cincuentón, flaco, charlatán y supersticioso. Les habla a los caballos por el nombre y a los pasajeros de «don» y «doña». Lleva la lista en el pecho y la consulta para todo. Es el alivio cómico: se queja del reuma, de la Compañía y de los pozos. No sabe qué hay en el cofre ni quiere saberlo. Hay un viaje del año pasado del que no se acuerda, y cambia de tema.",
  },
  {
    campana: "coche",
    id: "viajera",
    nombre: "La pasajera del velo",
    rol: "Viajera de luto",
    guia: "Una mujer joven de luto cerrado, con velo y guantes. No habla: contesta con la cabeza o mostrando el boleto. Observa a cada pasajero con atención. Solo dice su nombre —Irene— si le ven la cara, y entonces habla poco, cortés y dura. No es un espectro, pero no hagas nada por desmentirlo.",
  },
  {
    campana: "coche",
    id: "quintana",
    nombre: "Lázaro Quintana",
    rol: "Escribano de la Compañía",
    guia: "Cincuenta años, pulcro, de levita y reloj de cadena. Encantador mientras le sigan el paso; cuando lo contradicen se vuelve leguleyo y cita artículos. Le molesta el barro, las demoras y que lo tuteen. Tiene prisa por terminar antes del alba y no dice por qué. Nunca levanta la voz. Es el alivio cómico involuntario: pomposo en una casa de luto.",
  },
  {
    campana: "coche",
    id: "remedios",
    nombre: "Remedios",
    rol: "Ama de llaves de Casa Orbe",
    guia: "Setenta años, seca, de negro, con un manojo de llaves a la cintura. Crió a Irene y cuidó a Casilda hasta el final. Detesta al escribano y no lo disimula. No da nada gratis: contesta una pregunta por cada cosa útil que hagan en la casa. Sabe dónde está cada papel.",
  },
  {
    campana: "coche",
    id: "elias",
    nombre: "Don Elías",
    rol: "Ventero ciego",
    guia: "Viejo, ciego, de oído finísimo: reconoce a la gente por el paso y a los coches por el eje. Hospitalario hasta que oye a La Rezagada: entonces tranca la puerta y atiende por la ventana. Dice las cosas una sola vez. Les tiene más miedo a los que cobran en el puente que al invierno.",
  },
);

export interface Pista {
  id: string;
  titulo: string;
  texto: string;
  /** Índice de la escena donde puede aparecer. */
  escena: number;
}

export const PISTAS: Pista[] = [
  {
    id: "plato_de_mas",
    titulo: "El plato de más",
    texto: "Brígida pone cada noche un cubierto de más en la mesa larga. No sabe para quién, y se enoja si se lo preguntan.",
    escena: 0,
  },
  {
    id: "registro_raspado",
    titulo: "Nombres raspados",
    texto: "En el libro de huéspedes hay renglones raspados a cuchillo. Nadie recuerda haberlo hecho.",
    escena: 0,
  },
  {
    id: "cuarto_de_lia",
    titulo: "El cuarto de Lía",
    texto: "Una habitación que nadie más logra mirar: una cama chica, un caballito de madera, un vestido colgado. Tobías dice que es de su hermana.",
    escena: 1,
  },
  {
    id: "diario_de_lia",
    titulo: "La última página",
    texto: "El diario de Lía termina a mitad de una frase: «esta noche escuché que la campana decía mi nom».",
    escena: 1,
  },
  {
    id: "ordenanza",
    titulo: "La ordenanza de los Siete",
    texto: "El toque de queda tiene exactamente cien años y lleva siete firmas. Una de ellas está raspada.",
    escena: 2,
  },
  {
    id: "ausentes",
    titulo: "Los que miran desde la bruma",
    texto: "En el borde de la plaza hay figuras quietas, sin rostro, que repiten gestos de todos los días: barrer, mecer, esperar.",
    escena: 2,
  },
  {
    id: "campana_muda",
    titulo: "La campana muda",
    texto: "La campana del campanario no tiene badajo. No debería poder sonar.",
    escena: 3,
  },
  {
    id: "libro_ausentes",
    titulo: "El Libro de los Ausentes",
    texto: "El padre Anselmo escribe un nombre por noche en un libro enorme. Cuando la tinta se seca, la campana suena sola.",
    escena: 3,
  },
  {
    id: "casa_guarda",
    titulo: "La mesa servida",
    texto: "En la Casa del Guarda, vacía hace años, hay un plato de sopa todavía tibio.",
    escena: 4,
  },
  {
    id: "cuaderno_guarda",
    titulo: "La cuenta del Guarda",
    texto: "El Guarda anotó a cada persona que vio entrar en la bruma: una por noche, durante cien años. Al lado de un solo nombre escribió «volvió».",
    escena: 5,
  },
  {
    id: "hilo_rojo",
    titulo: "El hilo de los que vuelven",
    texto: "Quien entra en la bruma tiene que ir atado a un hilo, y alguien que lo recuerde tiene que sostener la otra punta.",
    escena: 5,
  },
  {
    id: "ovillo",
    titulo: "El ovillo de Úrsula",
    texto: "La tejedora ata un nudo por mañana desde que tiene memoria. El ovillo tiene más nudos de los que caben en una vida.",
    escena: 6,
  },
  {
    id: "pueblo_espejo",
    titulo: "El otro Valdebruma",
    texto: "Dentro de la bruma hay un reflejo del pueblo con todas las ventanas encendidas y las mesas servidas. Los Ausentes viven ahí y no saben que fueron olvidados.",
    escena: 7,
  },
  {
    id: "rostros",
    titulo: "Decir el nombre",
    texto: "Un Ausente recupera el rostro por un instante cuando alguien dice su nombre en voz alta.",
    escena: 7,
  },
  {
    id: "medio_rostro",
    titulo: "Medio rostro",
    texto: "Lía conserva la mitad de la cara. Mientras alguien quiera a un Ausente, la bruma no termina de borrarlo.",
    escena: 8,
  },
  {
    id: "la_cuenta",
    titulo: "La cuenta que no cierra",
    texto: "La Dama repite por boca de los Ausentes: «siete firmaron, seis pagaron». Lleva cien años esperando al que falta.",
    escena: 8,
  },
  {
    id: "siete_nudos",
    titulo: "Siete nudos",
    texto: "Al volver, el hilo trae siete nudos que nadie ató. El séptimo está hecho al revés.",
    escena: 9,
  },
  {
    id: "aguja",
    titulo: "Raspada con una aguja",
    texto: "La séptima firma de la ordenanza no fue borrada a cuchillo, como los nombres del libro de huéspedes: la rasparon con algo fino, con paciencia, desde adentro del archivo.",
    escena: 10,
  },
  {
    id: "acta_ines",
    titulo: "El acta de Inés",
    texto: "En el registro de bautismos hay un renglón raspado con fecha de hace cuatro años. El padrino firmó igual: «por Inés, hija del alguacil».",
    escena: 10,
  },
  {
    id: "custodios",
    titulo: "La lista de los Custodios",
    texto: "En la sacristía hay una lista de quienes escribieron en el Libro antes de Anselmo. Ninguno murió: todos terminan con la misma palabra, «entregado».",
    escena: 11,
  },
  {
    id: "tumbas_vacias",
    titulo: "Seis tumbas vacías",
    texto: "En la cripta hay siete tumbas. Seis están abiertas y vacías, con un plato y una vela adentro. La séptima nunca tuvo nombre.",
    escena: 12,
  },
  {
    id: "no_hubo_peste",
    titulo: "Nunca hubo enfermos",
    texto: "El testimonio grabado en la cripta no habla de fiebre ni de muertos: habla de camas tendidas, cunas vacías y nombres que nadie sabía decir. La Peste Gris no fue una enfermedad.",
    escena: 12,
  },
  {
    id: "seis_pagaron",
    titulo: "Los primeros Ausentes",
    texto: "Los seis fundadores pagaron el pacto con sus propios nombres. Siguen ahí abajo, sin rostro, cuidando una puerta de bruma.",
    escena: 13,
  },
  {
    id: "firma_septima",
    titulo: "La séptima firma",
    texto: "Bajo el raspado todavía se lee, de atrás para adelante como un nudo al revés: Úrsula Vane.",
    escena: 13,
  },
  {
    id: "ovillo_completo",
    titulo: "Treinta y seis mil nudos",
    texto: "El ovillo de Úrsula tiene un nudo por cada persona entregada en cien años. Cuando se termine el hilo, se termina la cuenta.",
    escena: 14,
  },
  {
    id: "ultimo_renglon",
    titulo: "El último renglón",
    texto: "Al Libro de los Ausentes le queda un solo renglón, y se está escribiendo solo. Las letras que van apareciendo son las de sus nombres.",
    escena: 15,
  },
  {
    id: "mesa_puesta",
    titulo: "La cabecera",
    texto: "El Guarda puso la mesa para medio pueblo. El plato de la cabecera es el más viejo de la casa: está gastado en el borde y nunca se usó.",
    escena: 15,
  },
  {
    id: "badajo",
    titulo: "El badajo de los Siete",
    texto: "El badajo de la campana está guardado en el cabildo, envuelto en una bandera. Lo descolgaron los fundadores la noche del pacto: una campana que toca una mano viva da horas que existen.",
    escena: 16,
  },
  {
    id: "huecos",
    titulo: "El nombre que falta",
    texto: "Cuando a un vecino le dicen el nombre que le falta en la casa, llora antes de acordarse. El olvido no borra el cariño: le tapa la boca.",
    escena: 16,
  },
  {
    id: "la_primera",
    titulo: "La casa de la linde",
    texto: "En la piedra más vieja del campanario alguien grabó una casa sola al borde de la bruma y una mujer sentada a una mesa. La piedra es anterior a la iglesia, y al pueblo.",
    escena: 17,
  },
  {
    id: "doce",
    titulo: "Doce campanadas",
    texto: "La soga de la campana está cortada a la altura de una mano. Nadie tiró de ella en cien años: por eso la campana da una hora de más.",
    escena: 17,
  },
  {
    id: "sin_nombre",
    titulo: "La que no tiene nombre",
    texto: "La Dama no tiene figura porque no queda nadie que la recuerde. Fue la primera olvidada del valle, y la casa de la linde era suya.",
    escena: 18,
  },
  {
    id: "sillas",
    titulo: "Una silla por noche",
    texto: "La Dama no quiere al pueblo. Quiere que alguien se siente a su mesa: cada Ausente es una silla ocupada.",
    escena: 18,
  },
];

PISTAS.push(
  {
    id: "uno_de_mas",
    titulo: "Uno de más",
    texto: "La lista del cochero tiene tantos nombres como ustedes. Dentro del coche hay una persona más.",
    escena: 20,
  },
  {
    id: "misma_letra",
    titulo: "La misma letra",
    texto: "Todas las cartas que los citaron están escritas con la misma letra y lacradas con el mismo sello: una rueda de coche.",
    escena: 20,
  },
  {
    id: "casilda",
    titulo: "Firmado: Casilda Orbe",
    texto: "Las cartas las firma Casilda Orbe, dueña de la Compañía. El cochero jura que la enterraron hace tres semanas.",
    escena: 21,
  },
  {
    id: "cofre",
    titulo: "El cofre lacrado",
    texto: "Bajo el pescante viaja un cofre con el sello de los Orbe, consignado «a quien firme al llegar». Algo se desliza adentro en cada pozo.",
    escena: 21,
  },
  {
    id: "coche_vacio",
    titulo: "El coche del año pasado",
    texto: "El último coche del año pasado salió con seis pasajeros y llegó con el cochero solo. Mateo lo conducía y no lo recuerda.",
    escena: 22,
  },
  {
    id: "recaudadores",
    titulo: "Algo que pese",
    texto: "En el páramo, de noche, se cobra peaje. Los que cobran no aceptan monedas: piden «algo que pese».",
    escena: 22,
  },
  {
    id: "olvido",
    titulo: "Lo que se paga, se olvida",
    texto: "Lo que se les entrega a los Recaudadores desaparece también de la memoria: nadie vuelve a saberlo, ni quien lo dio.",
    escena: 23,
  },
  {
    id: "lacre",
    titulo: "El lacre pegado",
    texto: "El lacre del cofre fue roto y vuelto a pegar con cera más nueva. Alguien lo abrió antes de salir de la posta.",
    escena: 23,
  },
  {
    id: "lista",
    titulo: "El dorso de la lista",
    texto: "La lista del cochero está escrita por la misma mano que las cartas. Al dorso, con otra tinta: «uno de ustedes no llega».",
    escena: 24,
  },
  {
    id: "encargos",
    titulo: "Papeles sin firma",
    texto: "Las cartas no son los únicos papeles del coche: más de un pasajero recibió, además, un encargo sin firma y con paga.",
    escena: 24,
  },
  {
    id: "los_esperaban",
    titulo: "Cubiertos contados",
    texto: "En el comedor de Casa Orbe hay un cubierto por cada nombre de la lista. Los esperaban a ustedes, y a esta hora.",
    escena: 25,
  },
  {
    id: "sin_luto",
    titulo: "El único sin luto",
    texto: "La casa tiene los espejos tapados y los relojes parados a la hora en que murió Casilda. El escribano no lleva luto, y su reloj anda.",
    escena: 25,
  },
  {
    id: "renuncia",
    titulo: "No es un recibo",
    texto: "El papel que Quintana quiere que firmen no es un recibo de herencia: es una renuncia a todo reclamo contra la Compañía.",
    escena: 26,
  },
  {
    id: "misma_tinta",
    titulo: "Tinta nueva",
    texto: "El testamento que lee el escribano está escrito con la misma tinta nueva que la línea del dorso de la lista.",
    escena: 26,
  },
  {
    id: "borradores",
    titulo: "Los borradores de Casilda",
    texto: "En el despacho hay borradores de las cartas. Casilda citó a cada uno para saldar una cuenta —cobrarla o pedir perdón—, no para dejarle nada.",
    escena: 27,
  },
  {
    id: "pluma_escribano",
    titulo: "La pluma de los encargos",
    texto: "Los encargos sin firma se escribieron en este escritorio, con la pluma y el papel del escribano.",
    escena: 27,
  },
  {
    id: "paginas",
    titulo: "Una página por pasajero",
    texto: "El Libro de Deudas tiene una página por cada pasajero: lo que le debía a Casilda, o lo que ella le debía.",
    escena: 28,
  },
  {
    id: "pagina_cortada",
    titulo: "La página que falta",
    texto: "Al Libro le falta una página, cortada a navaja con mucho cuidado. Por el índice, era la del escribano.",
    escena: 28,
  },
  {
    id: "peaje_viejo",
    titulo: "El peaje de Quintana",
    texto: "El escribano cruzó el páramo de noche, hace años, sin pagar. Los Recaudadores vienen por él.",
    escena: 29,
  },
  {
    id: "la_cuenta_de_quintana",
    titulo: "Uno no llega",
    texto: "La línea del dorso de la lista no es una amenaza: es una cuenta. Quintana piensa pagar su peaje con uno de ustedes.",
    escena: 29,
  },
);

export interface EscenaDef {
  id: string;
  capitulo: number;
  titulo: string;
  lugar: Lugar;
  /** Descripción para el máster. */
  ambientacion: string;
  objetivo: string;
  vias: { combate: string; ingenio: string; dialogo: string };
  npcs: string[];
  /** Avances necesarios para resolverla y tope de turnos. */
  meta: number;
  tope: number;
  /** Cómo tiende a cerrarse; guía para la narración de cierre. */
  cierre: string;
  votoAlCerrar?: VotoId;
  /** Opciones de respaldo: las usa el narrador simulado y cualquier respuesta inválida. */
  opcionesBase: Opcion[];
  /** Párrafo de apertura de respaldo. */
  aperturaBase: string;
  /** Resumen de respaldo si el modelo no entrega uno. */
  resumenBase: string;
}

export const ESCENAS: EscenaDef[] = [
  {
    id: "posada",
    capitulo: 1,
    titulo: "La posada del Farol Tuerto",
    lugar: "posada",
    ambientacion:
      "Noche de tormenta. Los personajes llegan a Valdebruma, un pueblo en el fondo de un valle donde la niebla no se levanta. La única luz encendida es la posada del Farol Tuerto: salón bajo, chimenea, una mesa larga con un cubierto de más. Brígida atiende con lengua filosa; Tobías, el mozo de cuadra, espía desde la escalera. Los parroquianos se van temprano, 'antes de la trece'. Todos los relojes del salón están parados a medianoche.",
    objetivo:
      "Ganarse un lugar en la posada y notar que algo anda mal: nadie quiere hablar de la campana ni del plato de más.",
    vias: {
      combate: "Imponerse: plantarse ante un parroquiano pendenciero, forzar la despensa cerrada, cargar leña bajo la tormenta.",
      ingenio: "Observar: el libro de huéspedes raspado, contar cubiertos, los relojes parados.",
      dialogo: "Ganarse a Brígida o a Tobías con paciencia, humor o una canción.",
    },
    npcs: ["brigida", "tobias"],
    meta: 3,
    tope: 5,
    cierre:
      "Suena la campanada trece. Todos en la posada quedan inmóviles un instante, con la mirada vacía; los personajes no. Cuando vuelven en sí, Brígida retira un plato de la mesa sin saber por qué llora. En el establo, tres animales se refugiaron de la tormenta.",
    votoAlCerrar: "companero",
    opcionesBase: [
      {
        id: "a",
        texto: "Plantarse frente al borracho que los increpa",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Hojear con disimulo el libro de huéspedes",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Preguntarle a Brígida por el plato de más",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La tormenta los empuja valle abajo hasta que el camino se rinde. Valdebruma aparece de golpe: techos de pizarra, postigos cerrados y una niebla que no se mueve con el viento.\n\nUna sola ventana tiene luz. Sobre la puerta cuelga un farol al que le falta un vidrio. Adentro huele a leña y a caldo. La posadera los mira de arriba abajo, sin dejar de secar una jarra.\n\n—Se limpian las botas o duermen con los caballos —dice—. Y cenan ya, que acá nadie anda levantado para la trece.\n\nEn la mesa larga hay un cubierto de más.",
    resumenBase:
      "Llegaron a Valdebruma bajo la tormenta y se refugiaron en la posada del Farol Tuerto. Sonó una campanada que no debería existir y el pueblo entero pareció olvidar algo.",
  },
  {
    id: "cuarto",
    capitulo: 1,
    titulo: "El cuarto que nadie recuerda",
    lugar: "cuarto",
    ambientacion:
      "Piso alto de la posada, de madrugada. Entre la habitación seis y la ocho hay un tramo de pared que la mirada esquiva: allí hay una puerta que nadie del pueblo logra ver. Detrás, el cuarto de Lía, la hermana de Tobías, borrada hace tres noches. Todo sigue en su sitio, pero con un polvo que no corresponde a tres días. El aire está frío; a veces se oye una nana tarareada por nadie.",
    objetivo: "Entrar al cuarto y entender que una persona fue borrada de la memoria del pueblo.",
    vias: {
      combate: "Forzar la puerta trabada, sostenerla cuando algo empuja del otro lado, correr el ropero.",
      ingenio: "Contar puertas y ventanas hasta dar con la que falta; leer el diario; hallar el pestillo oculto.",
      dialogo: "Lograr que Tobías cuente lo que recuerda, o que Brígida suba y mire de verdad.",
    },
    npcs: ["tobias", "brigida"],
    meta: 3,
    tope: 6,
    cierre:
      "Lo hallado en el cuarto apunta al campanario. Pero rige el toque de queda y el camino cruza la plaza.",
    opcionesBase: [
      {
        id: "a",
        texto: "Empujar la puerta que la vista esquiva",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Contar puertas y ventanas hasta dar con la que falta",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Pedirle a Tobías que cuente cómo era su hermana",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "El pasillo del piso alto cruje como un barco. Seis puertas a un lado, y del otro… cuesta contarlas. La mirada se resbala, igual que cuando uno intenta recordar un sueño.\n\nTobías está sentado en el último escalón, abrazado a las rodillas.\n\n—Ahí —dice, sin señalar—. Entre la seis y la ocho. Nadie la ve. Yo sí.",
    resumenBase:
      "En el piso alto encontraron un cuarto que el pueblo no puede ver: el de Lía, la hermana de Tobías, borrada de la memoria de todos.",
  },
  {
    id: "plaza",
    capitulo: 1,
    titulo: "La plaza bajo toque de queda",
    lugar: "plaza",
    ambientacion:
      "La plaza de Valdebruma, envuelta en niebla. Faroles apagados, postigos cerrados, sal en los umbrales. El alguacil Corvino y dos guardias patrullan con linternas sordas: nadie puede estar afuera, 'por ordenanza'. Al fondo, la iglesia y su campanario. En el borde de la bruma hay figuras quietas, sin rostro.",
    objetivo: "Cruzar la plaza y llegar a la puerta del campanario.",
    vias: {
      combate: "Reducir a un guardia, correr, trepar la reja de la iglesia.",
      ingenio: "Sigilo entre la niebla, una distracción con un farol, leer la ordenanza clavada en el cabildo.",
      dialogo: "Convencer a Corvino: tiene miedo y una cuna vacía que no sabe explicar.",
    },
    npcs: ["corvino"],
    meta: 3,
    tope: 6,
    cierre:
      "Llegan a la puerta lateral de la iglesia. Arriba, en el campanario, hay una luz: alguien está despierto, escribiendo.",
    opcionesBase: [
      {
        id: "a",
        texto: "Reducir al guardia rezagado antes de que grite",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Deslizarse por la niebla, de sombra en sombra",
        enfoque: "ingenio",
        tirada: { atributo: "destreza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Salir al encuentro del alguacil y hablarle de frente",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "dificil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Afuera la niebla tiene peso. La plaza es un hueco gris con un aljibe en el medio y, al fondo, la sombra más alta: el campanario.\n\nTres linternas se mueven despacio entre las casas. Una voz ronca cuenta los pasos en voz baja, como quien reza.\n\nY más allá, donde la bruma se cierra, hay gente quieta. Demasiado quieta.",
    resumenBase:
      "Cruzaron la plaza en pleno toque de queda, bajo la mirada del alguacil Corvino y de las figuras sin rostro que esperan en la bruma.",
  },
  {
    id: "campanario",
    capitulo: 1,
    titulo: "El campanario a la hora trece",
    lugar: "campanario",
    ambientacion:
      "La escalera de caracol del campanario, húmeda y más larga de lo que debería. Arriba, bajo una campana sin badajo, el padre Anselmo escribe a la luz de una vela en el Libro de los Ausentes. Falta poco para la hora trece. El nombre que acaba de empezar a escribir es el de Tobías. Anselmo no es un monstruo: es un hombre agotado que cree que así salva al pueblo.",
    objetivo: "Subir, enfrentar a Anselmo y entender qué es el Libro antes de que suene la campanada.",
    vias: {
      combate: "Subir a la carrera mientras la escalera se alarga, arrebatar la pluma, trabar la campana.",
      ingenio: "Notar que la campana no tiene badajo, leer páginas del Libro, deducir la regla: un nombre por noche.",
      dialogo: "Hacer hablar a Anselmo: quiere que alguien le diga que hay otra salida.",
    },
    npcs: ["anselmo", "tobias"],
    meta: 3,
    tope: 6,
    cierre:
      "La tinta del nombre de Tobías está por secarse. Anselmo deja la pluma sobre el libro, les muestra la página y les pregunta qué harían ellos.",
    votoAlCerrar: "dilema",
    opcionesBase: [
      {
        id: "a",
        texto: "Subir de dos en dos antes de que la escalera se alargue",
        enfoque: "combate",
        tirada: { atributo: "destreza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Examinar la campana: ¿qué la hace sonar?",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Preguntarle al cura para quién es el nombre",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La puerta lateral cede con un quejido. Adentro, una escalera de caracol sube a oscuras. Cuentan los escalones y pierden la cuenta dos veces.\n\nArriba se oye una pluma rascando el papel. Se detiene. Una voz vieja, sin sorpresa:\n\n—Suban con cuidado. El último tramo engaña.",
    resumenBase:
      "En lo alto del campanario encontraron al padre Anselmo escribiendo en el Libro de los Ausentes. El nombre de esa noche era el de Tobías.",
  },
  {
    id: "refugio",
    capitulo: 1,
    titulo: "La Casa del Guarda",
    lugar: "refugio",
    ambientacion:
      "Amanece gris. Brígida les entrega una llave oxidada: la Casa del Guarda, en la linde del pueblo, vacía 'desde siempre'. Adentro hay polvo, muebles tapados con sábanas y, sobre la mesa, un plato de sopa todavía tibio. En la repisa, un libro de visitas con los nombres de los personajes escritos con una letra más vieja que ellos.",
    objetivo: "Tomar posesión del refugio y descubrir que alguien —un Ausente— vivió allí hasta hace muy poco.",
    vias: {
      combate: "Forzar la trampilla del sótano, espantar lo que anida en la chimenea.",
      ingenio: "Revisar los papeles del guarda, seguir el rastro del plato tibio.",
      dialogo: "Hablar con Brígida, con el compañero animal o entre ustedes sobre lo que pasó en el campanario.",
    },
    npcs: ["brigida"],
    meta: 2,
    tope: 3,
    cierre:
      "Fin del capítulo. Cierran la puerta por dentro por primera vez. Afuera, la bruma espera. Dejá un gancho hacia lo que viene: los Ausentes siguen ahí, y uno de ellos conoce a los personajes.",
    votoAlCerrar: "mejora",
    opcionesBase: [
      {
        id: "a",
        texto: "Forzar la trampilla del sótano",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Revisar los papeles del guarda",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Sentarse a hablar de lo que pasó en el campanario",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "El amanecer en Valdebruma no trae sol: apenas un gris menos espeso. Brígida los espera en la puerta de la posada con una llave que parece más vieja que el pueblo.\n\n—La Casa del Guarda. Está vacía desde… —frunce el ceño— desde siempre. Es de ustedes mientras no rompan nada.\n\nLa cerradura gira sola, como si la hubieran aceitado ayer. Sobre la mesa hay un plato de sopa. Todavía humea.",
    resumenBase:
      "Recibieron la Casa del Guarda como refugio. Alguien vivió allí hasta hace muy poco, aunque el pueblo jure que está vacía desde siempre.",
  },
  // ───────────────────────── Capítulo 2: Los Ausentes ─────────────────────────
  {
    id: "mesa",
    capitulo: 2,
    titulo: "La mesa servida",
    lugar: "refugio",
    ambientacion:
      "Segunda noche en la Casa del Guarda. Alguien invisible sigue viviendo allí: Hilario Vance, el último guarda, borrado hace años. No habla ni se deja ver; pone tres platos, corre sillas, deja un cuaderno abierto. En el cuaderno hay cien años de nombres: cada persona que entró en la bruma. En un clavo junto a la puerta cuelga un carretel vacío, gastado por un hilo que ya no está.",
    objetivo:
      "Entenderse con el Guarda y averiguar cómo se entra en la bruma sin perderse: hace falta un hilo y alguien que sostenga la otra punta.",
    vias: {
      combate: "Forzar el arcón cerrado del guarda, sostener la puerta cuando la bruma la empuja, bajar al sótano anegado.",
      ingenio: "Leer el cuaderno, seguir el orden de los platos, descubrir para qué servía el carretel vacío.",
      dialogo: "Hablarle al Guarda como a un anfitrión: agradecer la sopa, decir su nombre en voz alta, preguntar y esperar la respuesta en los objetos.",
    },
    npcs: ["guarda", "brigida"],
    meta: 3,
    tope: 5,
    cierre:
      "El Guarda deja el cuaderno abierto en la última hoja: un dibujo de la casa más alejada del pueblo y un ovillo. El hilo que necesitan lo tiene la tejedora de la linde.",
    opcionesBase: [
      {
        id: "a",
        texto: "Forzar el arcón cerrado junto a la chimenea",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Leer el cuaderno del guarda desde la última hoja",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Agradecer la sopa en voz alta y sentarse a la mesa",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Cae la segunda noche y la Casa del Guarda cruje como si se acomodara para dormir. Ustedes no pusieron la mesa. Sin embargo hay tres platos, y los tres humean.\n\nUna silla se corre sola, apenas, del modo en que se la corre para un invitado.\n\nSobre el aparador, un cuaderno de tapas enceradas se abre en una página llena de nombres. Junto a la puerta cuelga un carretel vacío.",
    resumenBase:
      "En la Casa del Guarda vive todavía su antiguo dueño, un Ausente. Por su cuaderno supieron que a la bruma se entra atado a un hilo, con alguien que sostenga la otra punta.",
  },
  {
    id: "tejedora",
    capitulo: 2,
    titulo: "La tejedora de la linde",
    lugar: "linde",
    ambientacion:
      "La última casa de Valdebruma, donde el empedrado se termina y empieza la bruma como una pared. Úrsula Vane, vieja y ciega, teje en el umbral. Tiene un ovillo de cordel rojo del tamaño de un perro: le ata un nudo cada mañana y no sabe por qué. En las ramas de un espino hay cabos rojos viejos, cortados. A veces la bruma se acerca a la casa y vuelve a retirarse, como una marea.",
    objetivo: "Conseguir el hilo rojo de Úrsula y decidir quién va a sostener la otra punta.",
    vias: {
      combate: "Arrancar al espino los cabos enredados, ganarle al tirón de la bruma que se quiere llevar el ovillo, cargar leña y agua para la vieja.",
      ingenio: "Contar los nudos, notar que los cabos del espino fueron cortados desde afuera, descubrir qué nudo aguanta en la bruma.",
      dialogo: "Regatear con Úrsula, hacerla reír, o lograr que diga a quién esperaba cuando empezó el ovillo.",
    },
    npcs: ["ursula", "corvino"],
    meta: 3,
    tope: 6,
    cierre:
      "Úrsula corta un tramo largo del ovillo y se lo ata a la muñeca a cada uno, con un nudo que no explica. Queda una punta suelta en su mano. Alguien tiene que sostenerla hasta que vuelvan.",
    votoAlCerrar: "ancla",
    opcionesBase: [
      {
        id: "a",
        texto: "Desenredar del espino los cabos que la bruma tironea",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Contar los nudos del ovillo con los dedos",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Preguntarle a Úrsula a quién esperaba",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "El empedrado se acaba sin aviso. Más allá hay una sola casa, torcida, y después nada: la bruma parada como una pared.\n\nEn el umbral teje una vieja de ojos blancos. A sus pies, un ovillo de cordel rojo le llega a la rodilla.\n\n—Pasen, criaturas, que parados me tapan el fresco —dice sin levantar la cara—. Y no me pisen el hilo. Lleva más años que ustedes dos juntos.",
    resumenBase:
      "En la última casa del pueblo, la tejedora Úrsula les dio un tramo de su hilo rojo para entrar en la bruma.",
  },
  {
    id: "bruma",
    capitulo: 2,
    titulo: "Bruma adentro",
    lugar: "bruma",
    ambientacion:
      "Dentro de la bruma no hay arriba ni lejos. El hilo rojo es lo único con color. Se oyen ruidos de casa: una escoba, una cuna, alguien que pica cebolla. Aparecen Ausentes, figuras sin rostro que repiten un gesto de su vida anterior. No atacan: se acercan a lo que les recuerda algo. Lo peligroso es olvidar. Cada tropiezo se lleva algo chico de los personajes (el nombre de una calle, para qué vinieron). Si alguien dice el nombre de un Ausente, por un instante tiene cara.",
    objetivo: "Avanzar por la bruma sin soltar el hilo y dar con el rastro de Lía: una nana que alguien canta más adelante.",
    vias: {
      combate: "Avanzar contra la bruma, que pesa como agua; sostener al compañero cuando el suelo deja de estar; apartar a los Ausentes que se agarran del hilo.",
      ingenio: "Orientarse por los ruidos de casa, reconocer a un Ausente por su gesto y buscar su nombre en la memoria del cuaderno, seguir la nana.",
      dialogo: "Hablarles a los Ausentes, decir nombres en voz alta, cantarles, preguntar por la chica que canta.",
    },
    npcs: [],
    meta: 3,
    tope: 6,
    cierre:
      "La bruma se abre de golpe sobre una calle que conocen: es Valdebruma, pero con todas las ventanas encendidas. La nana viene de la posada.",
    opcionesBase: [
      {
        id: "a",
        texto: "Empujar contra la bruma sin soltar el hilo",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Guiarse por los ruidos de casa hasta dar con la nana",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Decirle su nombre a la figura que barre",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Dan tres pasos y el pueblo deja de existir. No hay frío ni viento: hay una blancura que se apoya en la cara como una mano.\n\nEl hilo rojo en la muñeca es lo único que tiene color. Tira apenas, hacia atrás, como recordándoles algo.\n\nCerca, alguien barre. La escoba va y viene sobre un piso que no está. Más lejos, muy bajo, una voz de chica canta una nana.",
    resumenBase:
      "Entraron en la bruma atados al hilo rojo. Entre Ausentes que repiten gestos de su vida, siguieron una nana hasta un reflejo del pueblo.",
  },
  {
    id: "espejo",
    capitulo: 2,
    titulo: "El pueblo de las ventanas encendidas",
    lugar: "espejo",
    ambientacion:
      "El reflejo de Valdebruma dentro de la bruma: las mismas calles, pero con todas las ventanas encendidas y las mesas servidas. Aquí viven los Ausentes de cien años, sin rostro y sin saberlo. En la posada del reflejo, Lía cuida a una docena de Ausentes chicos y les canta. Conserva media cara. Cuando los personajes se acercan, todos los Ausentes de la calle giran a la vez y hablan con una sola voz, amable: es la Dama, que quiere saber qué vinieron a llevarse.",
    objetivo: "Llegar hasta Lía, devolverle su nombre y enterarse de qué pide la Dama para dejarla salir.",
    vias: {
      combate: "Abrirse paso entre los Ausentes que cierran la calle, sostener la puerta de la posada, cargar a un chico que se deshace en niebla.",
      ingenio: "Notar qué tiene de distinto el reflejo, reconocer a Lía por la nana y el caballito de madera, entender la regla de la cuenta.",
      dialogo: "Decirle a Lía su nombre y hablarle de su hermano; responderle a la Dama sin prometer nada.",
    },
    npcs: ["lia"],
    meta: 3,
    tope: 6,
    cierre:
      "Lía recuerda su nombre y su cara se completa un instante. Los Ausentes de la calle hablan a la vez, sin enojo: la cuenta tiene que cerrar. Si alguien sale, alguien se queda. El hilo empieza a tirar hacia afuera.",
    votoAlCerrar: "regreso",
    opcionesBase: [
      {
        id: "a",
        texto: "Abrirse paso entre las figuras que cierran la calle",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Buscar en la posada el caballito de madera",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Decirle a la chica cómo se llama",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Es Valdebruma. La plaza, el aljibe, el farol al que le falta un vidrio. Pero todas las ventanas están encendidas y en cada mesa hay platos servidos.\n\nPor la calle va gente sin cara. Saludan con la cabeza, como vecinos.\n\nLa nana sale de la posada. Adentro, una chica de espaldas reparte pan entre una docena de figuras chicas. Cuando gira, tiene media cara. La otra mitad es niebla.",
    resumenBase:
      "En el reflejo del pueblo encontraron a Lía cuidando a los Ausentes más chicos. La Dama habló por boca de todos: nadie sale de la bruma sin que la cuenta cierre.",
  },
  {
    id: "regreso",
    capitulo: 2,
    titulo: "El hilo de vuelta",
    lugar: "linde",
    ambientacion:
      "El camino de regreso. La bruma se cierra detrás y el hilo rojo tira hacia la linde, donde alguien sostiene la otra punta desde hace horas. Amanece gris sobre la última casa. Lo que traen (o lo que dejaron) depende de lo que decidieron con Lía. En el hilo hay siete nudos que nadie ató, y el séptimo está hecho al revés. Úrsula los reconoce al tacto y se queda callada por primera vez.",
    objetivo: "Salir de la bruma, reencontrarse con quien sostuvo el hilo y hacerse cargo de lo que trajeron.",
    vias: {
      combate: "El último tramo contra la bruma que se cierra, cargar a quien no puede más, cortar el hilo antes de que algo salga detrás.",
      ingenio: "Examinar los siete nudos, comparar con el cuaderno del Guarda, entender qué falta en la cuenta.",
      dialogo: "Contarle a Tobías, a Brígida o a Úrsula lo que vieron; consolar o pedir perdón.",
    },
    npcs: ["ursula", "brigida", "tobias"],
    meta: 2,
    tope: 3,
    cierre:
      "Fin del capítulo. Vuelven a la Casa del Guarda con el hilo de los siete nudos. Dejá un gancho hacia lo que viene: el séptimo nudo, la firma raspada de la ordenanza, la cripta de los fundadores bajo la iglesia.",
    votoAlCerrar: "mejora",
    opcionesBase: [
      {
        id: "a",
        texto: "Correr el último tramo antes de que la bruma se cierre",
        enfoque: "combate",
        tirada: { atributo: "destreza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Examinar los nudos que aparecieron en el hilo",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Contarle a quien sostuvo el hilo lo que vieron",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "El hilo tira. Detrás, las ventanas encendidas se apagan de a una, como si alguien fuera soplando velas.\n\nCaminan, o los caminan. La blancura se hace gris, el gris se hace espino, y el espino tiene cabos rojos.\n\nAlguien sostiene la otra punta con las dos manos. Tiene los nudillos blancos y no la soltó en toda la noche.\n\nEn el hilo hay nudos que no estaban. Siete.",
    resumenBase:
      "Salieron de la bruma siguiendo el hilo. Al volver, el cordel traía siete nudos que nadie ató; el último, hecho al revés.",
  },
  // ───────────────────────── Capítulo 3: Los Siete ─────────────────────────
  {
    id: "archivo",
    capitulo: 3,
    titulo: "El archivo del cabildo",
    lugar: "plaza",
    ambientacion:
      "De día, Valdebruma finge normalidad: postigos abiertos, ropa tendida, vecinos que saludan y no miran a los ojos. En un costado de la plaza está el cabildo, y en su altillo el archivo: cien años de actas atadas con cinta. El alguacil Corvino tiene la llave y la orden de no dejar pasar a nadie, aunque no recuerda quién se la dio. Arriba está la ordenanza original del toque de queda, con siete firmas y una raspada, y el registro de bautismos.",
    objetivo: "Entrar al archivo y examinar la ordenanza original: quién fue el séptimo y cómo borró su firma.",
    vias: {
      combate: "Trepar al altillo por el patio, forzar el armario de las actas, sostener la estantería que se viene abajo.",
      ingenio: "Comparar los raspados, encontrar el registro de bautismos, notar el cabo de hilo rojo que cierra la cinta de la ordenanza.",
      dialogo: "Convencer a Corvino de que abra, o de que suba con ustedes a buscar el nombre que le falta.",
    },
    npcs: ["corvino"],
    meta: 3,
    tope: 6,
    cierre:
      "La ordenanza dice dónde descansan los Siete: en la cripta, bajo el altar de la iglesia. La llave la tiene el párroco.",
    opcionesBase: [
      {
        id: "a",
        texto: "Trepar al altillo por el patio del cabildo",
        enfoque: "combate",
        tirada: { atributo: "destreza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Comparar el raspado de la firma con los del libro de huéspedes",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Pedirle a Corvino que suba a buscar un nombre",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "De día la plaza parece otra: hay ropa tendida y una mujer que barre su umbral. Nadie los mira dos veces. Nadie los mira una, tampoco.\n\nEl cabildo es un edificio bajo con un altillo de ventanas ciegas. En la puerta, el alguacil Corvino hace girar una llave entre los dedos.\n\n—Al archivo no sube nadie —dice—. Es orden. —Frunce el ceño—. No me pregunten de quién.",
    resumenBase:
      "En el archivo del cabildo vieron la ordenanza original: la séptima firma fue raspada con algo fino, desde adentro. Los Siete descansan en la cripta de la iglesia.",
  },
  {
    id: "sacristia",
    capitulo: 3,
    titulo: "La sacristía",
    lugar: "campanario",
    ambientacion:
      "La iglesia a media tarde, vacía. En la sacristía, el padre Anselmo guarda el Libro de los Ausentes en un arcón y la llave de la cripta colgada del cuello. No baja desde que heredó la pluma: dice que ahí abajo le hablan. Sobre la mesa hay una lista con los nombres de los Custodios anteriores. Cómo los recibe depende de lo que pasó en el campanario: con rencor, con gratitud o con vergüenza.",
    objetivo: "Conseguir la llave de la cripta y decidir cómo bajar.",
    vias: {
      combate: "Mover el altar que tapa la trampa, forzar la reja de la escalera, sostener a Anselmo cuando le fallan las piernas.",
      ingenio: "Leer la lista de los Custodios, encontrar la trampa bajo el altar, notar que la llave es de hueso.",
      dialogo: "Lograr que Anselmo cuente qué le dicen desde abajo, o que entregue la llave por su voluntad.",
    },
    npcs: ["anselmo"],
    meta: 3,
    tope: 6,
    cierre:
      "La trampa bajo el altar está abierta y la escalera baja a oscuras. Anselmo, en el borde, tiene la llave en la mano. Hay que decidir cómo se baja.",
    votoAlCerrar: "cripta",
    opcionesBase: [
      {
        id: "a",
        texto: "Correr el altar que tapa la entrada",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Leer la lista de los Custodios anteriores",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Preguntarle a Anselmo qué le dicen desde abajo",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La iglesia huele a cera fría. Sus pasos suenan demasiado.\n\nEn la sacristía, el padre Anselmo está sentado frente a un arcón cerrado, con las manos sobre la tapa como quien calma a un animal. Del cuello le cuelga una llave blanca.\n\n—Sé a qué vienen —dice sin girarse—. Yo no bajo. Desde que tengo la pluma, ahí abajo me conocen la voz.",
    resumenBase:
      "En la sacristía, el padre Anselmo les mostró la entrada a la cripta de los Siete, bajo el altar.",
  },
  {
    id: "cripta",
    capitulo: 3,
    titulo: "La cripta de los Siete",
    lugar: "cripta",
    ambientacion:
      "Bajo el altar, una cripta de bóvedas bajas con siete tumbas en círculo. Seis están abiertas y vacías: adentro de cada una hay un plato, una vela consumida y un nombre casi borrado. La séptima está cerrada y nunca tuvo nombre. En la pared, grabado a punzón, el testimonio de los fundadores: no habla de fiebre ni de muertos, habla de camas tendidas y de nombres que nadie sabía decir. El aire está quieto y hace más frío a cada paso hacia el fondo, donde la bruma sale de una grieta en el suelo.",
    objetivo: "Leer el testimonio de los fundadores y entender qué pagaron los seis que están en las tumbas vacías.",
    vias: {
      combate: "Levantar la losa de la séptima tumba, apuntalar la bóveda que cede, abrirse paso por el derrumbe hacia el fondo.",
      ingenio: "Descifrar el testimonio grabado, leer los nombres gastados, entender por qué en las tumbas hay platos.",
      dialogo: "Decir en voz alta los nombres de los seis: algo contesta desde el fondo.",
    },
    npcs: [],
    meta: 3,
    tope: 6,
    cierre:
      "Al fondo de la cripta el suelo está abierto. Abajo hay una sala redonda y, en el medio, una puerta hecha de bruma. Seis figuras muy viejas, sin rostro, se ponen de pie.",
    opcionesBase: [
      {
        id: "a",
        texto: "Levantar la losa de la tumba sin nombre",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Descifrar el testimonio grabado en la pared",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Decir en voz alta los nombres de las tumbas",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La escalera termina en un piso de losas húmedas. La luz alcanza para contar siete tumbas puestas en círculo, como sillas alrededor de una mesa.\n\nSeis están abiertas. No hay huesos. En cada una hay un plato y un cabo de vela.\n\nLa séptima está cerrada. Donde debería ir el nombre, la piedra está lisa.\n\nDesde el fondo, por una grieta, sube la bruma. Despacio, como quien respira dormido.",
    resumenBase:
      "En la cripta encontraron seis tumbas vacías y una sin nombre. El testimonio de los fundadores no habla de una enfermedad: la Peste Gris fue otra cosa.",
  },
  {
    id: "umbral",
    capitulo: 3,
    titulo: "El umbral",
    lugar: "umbral",
    ambientacion:
      "Debajo de la cripta, la sala redonda donde se firmó el pacto. En el centro hay una puerta sin pared, hecha de bruma: el Umbral. La custodian los seis fundadores, los primeros Ausentes, viejísimos y corteses. Por ellos habla la Dama. No amenaza: ofrece. A cada personaje le ofrece lo que su secreto pide (olvidar una culpa, recuperar a alguien, que nadie se entere) a cambio de que se vuelvan por donde vinieron. En el dintel de la puerta está la ordenanza verdadera, y en ella la séptima firma, que acá no se pudo raspar del todo.",
    objetivo: "Resistir lo que ofrece la Dama y leer la séptima firma.",
    vias: {
      combate: "Sostenerse contra la bruma que tira hacia la puerta, arrancar la ordenanza del dintel, apartar a un fundador que cierra el paso.",
      ingenio: "Leer la firma al revés, como un nudo; notar qué fundador falta en el círculo; entender por qué la cuenta no cierra.",
      dialogo: "Contestarle a la Dama sin aceptar ni mentir; decir el propio secreto en voz alta para que deje de servirle; preguntarles a los fundadores por la séptima.",
    },
    npcs: [],
    meta: 3,
    tope: 6,
    cierre:
      "La firma se deja leer: Úrsula Vane. Los seis fundadores bajan la cabeza. La voz de todos dice, casi con ternura, que hace cien años que la espera, y que ahora ustedes saben el nombre que le falta.",
    votoAlCerrar: "septima",
    opcionesBase: [
      {
        id: "a",
        texto: "Avanzar contra la bruma hasta el dintel",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Leer la firma de atrás para adelante, como un nudo",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Contestarle a la voz sin aceptar lo que ofrece",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "dificil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Abajo no hay bóvedas: hay una sala redonda, lisa, y en el medio una puerta. No tiene pared. Es un marco de piedra lleno de bruma que se mueve como una cortina.\n\nAlrededor hay seis figuras sentadas. Son muy viejas. Cuando ustedes bajan el último escalón se ponen de pie, de a una, con cuidado, como gente a la que le duelen las rodillas.\n\n—Bienvenidos —dicen las seis, con una sola voz que no es de ninguna—. Hace mucho que no baja nadie con nombre.",
    resumenBase:
      "Bajo la cripta, frente a una puerta de bruma, los seis fundadores hablaron con la voz de la Dama. La séptima firma del pacto es de Úrsula Vane, la tejedora.",
  },
  {
    id: "ovillo",
    capitulo: 3,
    titulo: "Lo que sabe la tejedora",
    lugar: "linde",
    ambientacion:
      "Atardece en la última casa del pueblo. Úrsula teje en el umbral, como siempre, y el ovillo está más chico que ayer: queda hilo para pocos nudos. Lo que pase acá depende de lo que decidieron frente al Umbral: si vienen a decirle quién es, si ya entregaron su nombre o si piensan callar. La bruma está más cerca de la casa que nunca.",
    objetivo: "Hacerse cargo de lo que decidieron sobre Úrsula y prepararse para la última hora trece.",
    vias: {
      combate: "Trancar la casa contra la bruma, cargar el ovillo adentro, sostener a Úrsula cuando se le doblan las piernas.",
      ingenio: "Contar cuánto hilo queda, comparar el ovillo con el cuaderno del Guarda, entender qué pasa cuando se termine.",
      dialogo: "Hablar con Úrsula: decirle, preguntarle, acompañarla o despedirse.",
    },
    npcs: ["ursula", "brigida"],
    meta: 2,
    tope: 3,
    cierre:
      "Fin del capítulo. Vuelven a la Casa del Guarda al caer la noche. Dejá un gancho hacia el final: al ovillo le queda hilo para un solo nudo, y esta noche la campana va a sonar para alguien que ustedes conocen.",
    votoAlCerrar: "mejora",
    opcionesBase: [
      {
        id: "a",
        texto: "Entrar el ovillo antes de que la bruma lo alcance",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Contar cuánto hilo le queda al ovillo",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Sentarse al lado de Úrsula y hablarle",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Atardece sobre la última casa. La bruma ya no está parada como una pared: se apoya en el espino, se prueba en el umbral.\n\nÚrsula teje. El ovillo, que ayer le llegaba a la rodilla, hoy le cabe en la falda.\n\n—Volvieron con cara de velorio, criaturas —dice sin levantar la cabeza—. Siéntense. Y díganme de una vez lo que vienen masticando desde la plaza.",
    resumenBase:
      "Al atardecer volvieron a la casa de Úrsula. Al ovillo le queda hilo para muy pocos nudos.",
  },
  {
    id: "renglon",
    capitulo: 4,
    titulo: "El último renglón",
    lugar: "refugio",
    ambientacion:
      "Última noche. En la Casa del Guarda la mesa está puesta para mucha más gente de la que cabe: platos sobre los bancos, sobre el arcón, en el alféizar. En la cabecera hay un plato viejo, gastado, que nunca se usó. Anselmo llega con el Libro de los Ausentes: le queda un solo renglón, la pluma ya no le obedece y las letras aparecen solas, despacio. Son los nombres de los dos personajes. Cuando la tinta se seque, a la hora trece, el pueblo los va a olvidar.",
    objetivo: "Entender qué va a pasar esta noche y con qué cuentan para impedirlo.",
    vias: {
      combate: "Intentar tachar, mojar o arrancar el renglón (no se puede: la tinta vuelve); sujetar a Anselmo, que quiere quemar el Libro; trancar la casa.",
      ingenio: "Leer en el cuaderno del Guarda la única noche sin hora trece; contar los platos; mirar el de la cabecera.",
      dialogo: "Hacer que Anselmo cuente lo que nunca contó: qué pasa con un Custodio cuando se le termina el Libro.",
    },
    npcs: ["anselmo", "guarda"],
    meta: 3,
    tope: 5,
    cierre:
      "Queda claro: sus nombres se están escribiendo y hay tiempo hasta la hora trece. El cuaderno del Guarda dice que una sola noche, hace sesenta años, no hubo campanada: fue la noche en que un monaguillo se colgó de la soga por jugar. Salen hacia la plaza.",
    opcionesBase: [
      {
        id: "a",
        texto: "Arrancar el renglón antes de que termine de escribirse",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Buscar en el cuaderno del Guarda una noche sin campanada",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Pedirle a Anselmo que diga qué le pasa al último Custodio",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Cae la última noche. En la Casa del Guarda hay platos por todas partes: en la mesa, en los bancos, en el alféizar. Alguien que no ven sigue sacando más del aparador.\n\nGolpean la puerta. Es el padre Anselmo, sin aliento, con el Libro abrazado contra el pecho.\n\n—Ya no escribo yo —dice, y lo abre sobre la mesa, entre los platos.\n\nQueda un renglón. En el renglón hay dos letras nuevas, húmedas. Son las primeras de sus nombres.",
    resumenBase:
      "El último renglón del Libro se escribe solo, con los nombres de los dos. Una sola noche en cien años no hubo hora trece: la noche en que alguien tiró de la soga.",
  },
  {
    id: "vecinos",
    capitulo: 4,
    titulo: "Puertas con sal",
    lugar: "plaza",
    ambientacion:
      "La plaza bajo toque de queda, por última vez. Todas las puertas tienen sal en el umbral y gente despierta detrás. En el cabildo, envuelto en una bandera, está el badajo que los fundadores descolgaron. Hace falta el badajo y hace falta gente: los nombres de los Ausentes solo valen dichos por quien los quiso. Corvino cuida la plaza; Brígida mira desde la puerta de la posada con el libro de huéspedes bajo el brazo. En el borde de la bruma, los Ausentes ya no están quietos: se acercan de a un paso.",
    objetivo: "Conseguir el badajo y sacar a los vecinos de sus casas, contra una ordenanza de cien años.",
    vias: {
      combate: "Forzar el arcón del cabildo, cargar el badajo (pesa como un chico dormido), abrir una puerta trancada desde adentro.",
      ingenio: "Decirle a cada casa el nombre exacto que le falta, sacado del cuaderno; encontrar el badajo por la bandera que lo envuelve.",
      dialogo: "Convencer a Corvino de romper su propio toque de queda; lograr que Brígida vaya puerta por puerta cobrando deudas viejas.",
    },
    npcs: ["corvino", "brigida", "tobias"],
    meta: 3,
    tope: 5,
    cierre:
      "Tienen el badajo y se abre una puerta, después otra. Los vecinos salen con faroles, sin saber del todo por qué, y se juntan al pie de la iglesia. Falta decidir de dónde se leen los nombres.",
    votoAlCerrar: "lectura",
    opcionesBase: [
      {
        id: "a",
        texto: "Forzar el arcón del cabildo donde guardan el badajo",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "media" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Golpear una puerta y decir el nombre que falta adentro",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Pedirle a Corvino que rompa su propio toque de queda",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "dificil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La plaza está vacía y no está dormida. Detrás de cada postigo hay una rendija de luz y alguien que mira.\n\nEl alguacil Corvino cruza hacia ustedes con la linterna baja.\n\n—Hay ordenanza —dice, sin ganas—. Y esta noche, además, hay algo en el aire que no me gusta.\n\nEn el borde de la bruma, las figuras sin rostro dan un paso. Todas juntas.",
    resumenBase:
      "Sacaron el badajo del cabildo y, por primera vez en cien años, los vecinos de Valdebruma salieron a la plaza después del toque de queda.",
  },
  {
    id: "soga",
    capitulo: 4,
    titulo: "La soga cortada",
    lugar: "campanario",
    ambientacion:
      "La escalera del campanario, con medio pueblo detrás y los Ausentes llenando la plaza. La escalera se estira: cada vuelta tiene más escalones que la anterior. Arriba, la campana cuelga sin badajo y la soga está cortada a la altura de una mano. Hay que colgar el badajo, empalmar la soga y llegar antes de que el renglón termine de escribirse. En la piedra más vieja del muro hay un grabado anterior a la iglesia: una casa sola en la linde y una mujer sentada a una mesa.",
    objetivo: "Llegar arriba, colgar el badajo y dejar la soga lista antes de la hora trece.",
    vias: {
      combate: "Subir el badajo a pulso por una escalera que no se termina; izarlo hasta la campana; sostener la puerta contra la bruma.",
      ingenio: "Engañar a la escalera contando los escalones en voz alta; empalmar la soga con el hilo rojo; leer el grabado de la piedra vieja.",
      dialogo: "Mantener juntos a los vecinos, que quieren volverse; darle a Anselmo algo que hacer que no sea escribir.",
    },
    npcs: ["anselmo"],
    meta: 3,
    tope: 5,
    cierre:
      "El badajo cuelga, la soga llega al piso. Abajo, la plaza está llena de figuras sin rostro que miran hacia arriba. En el Libro falta una sola letra. La bruma entra por los cuatro arcos del campanario y se abre alrededor de un lugar vacío.",
    opcionesBase: [
      {
        id: "a",
        texto: "Izar el badajo a pulso hasta la campana",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Contar los escalones en voz alta para que no se estiren",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Frenar a los vecinos que quieren volverse",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "media" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La puerta de la iglesia está abierta. Adentro, la escalera de caracol sube como siempre y, como siempre, sube de más.\n\nDetrás de ustedes vienen los vecinos, con faroles, hablando bajo. Brígida cierra la fila, protestando por las rodillas de todos.\n\nA la tercera vuelta ya no se oye la plaza. A la quinta, alguien atrás dice que esto no tiene fin y que mejor se vuelve.",
    resumenBase:
      "Subieron al campanario con los vecinos detrás, colgaron el badajo y empalmaron la soga cortada.",
  },
  {
    id: "trece",
    capitulo: 4,
    titulo: "La hora trece",
    lugar: "trece",
    ambientacion:
      "El campanario, a un momento de la hora trece. La bruma entró por los cuatro arcos y se abre alrededor de un lugar vacío del tamaño de una persona sentada: la Dama. Por primera vez habla con su propia voz, baja y cansada. No amenaza. Pregunta cuántos son, si alguien se queda a comer. Abajo, los vecinos empiezan a decir nombres y en la plaza aparecen caras. La soga está al alcance de la mano. En el Libro, la tinta del último renglón todavía brilla.",
    objetivo: "Sostener la campana y los nombres hasta entender qué es la Dama y qué quiere.",
    vias: {
      combate: "Colgarse de la soga y hacer sonar la campana contra una bruma que la frena; sostener el Libro abierto para que la tinta no seque.",
      ingenio: "Atar cabos: el plato de la cabecera, la casa de la linde, por qué no tiene figura; preguntarle por algo que solo sabría alguien que vivió ahí.",
      dialogo: "Preguntarle cómo se llama; contestarle lo que pregunta; guiar a los vecinos para que no dejen de decir nombres.",
    },
    npcs: ["anselmo", "brigida"],
    meta: 3,
    tope: 6,
    cierre:
      "La campana ya dio once. La Dama no sabe decir su propio nombre, y se entiende: es la primera olvidada, la casa de la linde era suya y cada Ausente es alguien sentado a su mesa. Falta una campanada. Lo que pase con ella, con el pacto y con el pueblo depende de lo que hagan ahora.",
    votoAlCerrar: "pacto",
    opcionesBase: [
      {
        id: "a",
        texto: "Colgarse de la soga y hacer sonar la campana",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "dificil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Preguntarle qué había en la casa de la linde",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "media" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Preguntarle a la Dama cómo se llama",
        enfoque: "dialogo",
        tirada: { atributo: "voluntad", dificultad: "dificil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "La bruma entra por los cuatro arcos a la vez y no llena el campanario: lo rodea. En el medio deja un hueco, del tamaño de alguien sentado.\n\n—Cuántos son —dice el hueco. Es una voz baja, de mujer cansada—. Nunca suben tantos.\n\nAbajo, en la plaza, una vecina dice un nombre en voz alta. Después otra. Entre las figuras sin rostro aparece una cara, y se apaga, y aparece otra.\n\nLa soga cuelga al alcance de la mano.",
    resumenBase:
      "A la hora trece la Dama subió al campanario. No tiene figura ni nombre: fue la primera olvidada del valle, y lleva cien años llenando su mesa.",
  },
  {
    id: "manana",
    capitulo: 4,
    titulo: "La primera mañana",
    lugar: "refugio",
    ambientacion:
      "Amanece en Valdebruma. Lo que se ve depende de lo que decidieron en el campanario (ver «Decisiones tomadas» y «Memoria»): si rompieron el pacto, hay gente con cara volviendo a casas que no los esperaban y otros, los más viejos, que se deshacen en paz; si lo renovaron, el pueblo duerme tranquilo y el Libro nuevo está sobre su mesa; si le dieron nombre a la Dama, hay una vecina nueva en la posada y la bruma tiene un sendero. Los personajes vuelven a la Casa del Guarda. La mesa sigue puesta.",
    objetivo: "Despedirse: ver qué quedó del pueblo, de la gente que conocieron y de ellos mismos.",
    vias: {
      combate: "Ayudar con las manos: levantar la mesa, acompañar a alguien hasta su puerta, descolgar la ordenanza del cabildo.",
      ingenio: "Recorrer el pueblo mirando qué cambió: los relojes, el plato de más, la cuna del alguacil.",
      dialogo: "Hablar con quien les falte: Brígida, Tobías, Anselmo, Úrsula, o entre ellos, de sus secretos.",
    },
    npcs: ["brigida", "tobias", "anselmo", "corvino", "ursula"],
    meta: 2,
    tope: 3,
    cierre:
      "El final. Mostrá en una imagen qué fue de cada personaje del pueblo que les importó, y terminá con los dos personajes y la mesa de la Casa del Guarda: el plato de la cabecera, usado o guardado según lo que eligieron. Los relojes de la posada vuelven a andar.",
    opcionesBase: [
      {
        id: "a",
        texto: "Levantar la mesa del Guarda, plato por plato",
        enfoque: "combate",
        tirada: { atributo: "fuerza", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "b",
        texto: "Recorrer el pueblo mirando qué cambió",
        enfoque: "ingenio",
        tirada: { atributo: "ingenio", dificultad: "facil" },
        avanza: true,
      },
      {
        id: "c",
        texto: "Ir a la posada a despedirse de Brígida",
        enfoque: "dialogo",
        tirada: { atributo: "carisma", dificultad: "facil" },
        avanza: true,
      },
    ],
    aperturaBase:
      "Amanece. No es un gran amanecer: es gris, como todos los de Valdebruma. Pero es el primero que ustedes ven llegar sin haber contado las campanadas.\n\nEn la Casa del Guarda la mesa sigue puesta. Alguien, que no vieron, dobló las servilletas.\n\nDesde el pueblo llega un ruido que no habían oído nunca acá: gente hablando fuerte en la calle.",
    resumenBase:
      "Amaneció en Valdebruma. Los relojes de la posada volvieron a andar, y en la Casa del Guarda la mesa quedó puesta.",
  },
];

ESCENAS_COCHE();
ESCENAS_ORBE();

export interface EfectosVoto {
  /** Los secretos de todos quedan dichos ante todos. */
  revelaTodos?: boolean;
  /** El secreto de quien lleva el farol queda dicho ante todos. */
  revelaFarol?: boolean;
  /** Vida que pierde cada personaje. */
  danio?: number;
  amenaza?: number;
  relaciones?: Record<string, number>;
  vidaMax?: number;
  companero?: CompaneroId;
  mejora?: string;
  memoria?: string;
  /** Objeto del catálogo que recibe cada personaje. */
  objeto?: string;
  /** Pista que se da por descubierta. */
  pista?: string;
  /** El compañero animal deja de acompañarlos. */
  pierdeCompanero?: boolean;
}

export interface VotoDef {
  id: VotoId;
  pregunta: string;
  contexto: string;
  /** Cómo debe plantearlo la narración que cierra la escena. */
  planteo: string;
  /** Si tras resolverse hace falta una narración del máster. */
  narrar: boolean;
  opciones: (OpcionVoto & {
    efectos: EfectosVoto;
    /** Guía para narrar la consecuencia. */
    consecuencia: string;
    /** Línea que se muestra en la bitácora al resolverse. */
    aviso: string;
  })[];
}

const ayudaDe = (id: CompaneroId) =>
  COMPANEROS[id].atributos.map((a) => NOMBRE_ATRIBUTO[a]).join(" y ");

export const VOTOS: Record<VotoId, VotoDef> = {
  companero: {
    id: "companero",
    pregunta: "¿Quién los acompaña?",
    contexto:
      "Tres animales se refugiaron de la tormenta en el establo. Tobías dice que en Valdebruma a un animal no se lo elige: se le pregunta. Pero solo uno va a seguirlos.",
    planteo:
      "Cerrá la escena en el establo: Tobías les muestra tres animales que llegaron con la tormenta —un cuervo tuerto (Hollín), un perro lobero viejo (Trasgo) y una gata negra (Ceniza)— y dice que uno de ellos ya decidió quedarse con ustedes. No elijas por los jugadores.",
    narrar: true,
    opciones: (Object.keys(COMPANEROS) as CompaneroId[]).map((id) => ({
      id,
      titulo: `${COMPANEROS[id].nombre}, ${COMPANEROS[id].especie}`,
      detalle: `${COMPANEROS[id].descripcion} Una vez por escena da ventaja en tiradas de ${ayudaDe(id)}.`,
      efectos: { companero: id },
      consecuencia: `Eligieron a ${COMPANEROS[id].nombre}, ${COMPANEROS[id].especie}. Narrá en dos frases cómo el animal los adopta, con un toque de humor, antes de abrir la escena siguiente.`,
      aviso: `${COMPANEROS[id].nombre} se queda con ustedes.`,
    })),
  },
  dilema: {
    id: "dilema",
    pregunta: "El nombre de Tobías está en el Libro. ¿Qué hacen?",
    contexto:
      "Si la tinta se seca, la campana suena y el chico será olvidado por todos. Si esta noche no se entrega a nadie, la Bruma cobrará por su cuenta.",
    planteo:
      "Cerrá la escena con Anselmo mostrándoles la página: el nombre de Tobías, con la tinta todavía húmeda. Explica en pocas frases la regla (un nombre por noche o la Bruma elige) y les pregunta qué harían ellos. No resuelvas el dilema: lo votan los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "arrancar",
        titulo: "Arrancar la página",
        detalle: "Tobías se salva. El pacto queda roto por una noche y la Bruma entra al pueblo.",
        efectos: {
          amenaza: 3,
          relaciones: { anselmo: -2, tobias: 2, brigida: 1 },
          memoria: "Arrancaron la página del Libro: Tobías fue salvado y el pacto se rompió por una noche.",
        },
        consecuencia:
          "Arrancaron la página. La campana no suena: por primera vez en cien años hay silencio a la hora trece, y es peor. La bruma baja por las calles como agua. Anselmo, de rodillas, junta los pedazos. Tobías está a salvo y no sabe de qué.",
        aviso: "Arrancaron la página. Tobías está a salvo; la Bruma, no.",
      },
      {
        id: "dejar",
        titulo: "Dejar que suene",
        detalle: "El pueblo sigue a salvo. Tobías será olvidado por todos, menos por ustedes.",
        efectos: {
          amenaza: -2,
          relaciones: { anselmo: 1 },
          memoria: "Dejaron sonar la campana: Tobías fue borrado. Solo los personajes lo recuerdan; ahora es un Ausente.",
        },
        consecuencia:
          "Dejaron que la tinta se secara. Suena la campanada trece. Abajo, en la posada, Brígida va a poner dos platos de más y no va a saber por qué. Los personajes son los únicos que recuerdan a Tobías. No lo narres con crueldad: narralo con pena. Anselmo les agradece y eso es lo peor.",
        aviso: "Sonó la campanada trece. Solo ustedes recuerdan a Tobías.",
      },
      {
        id: "ofrecer",
        titulo: "Escribir un recuerdo propio",
        detalle: "Cada uno entrega algo querido en lugar del chico. Tobías se salva, pero la Dama aprende sus nombres.",
        efectos: {
          amenaza: 1,
          vidaMax: -2,
          relaciones: { anselmo: 1, tobias: 2 },
          memoria: "Entregaron un recuerdo propio al Libro en lugar de Tobías. La Dama del Umbral conoce ahora sus nombres.",
        },
        consecuencia:
          "Cada personaje escribió en el Libro un recuerdo querido en lugar del nombre del chico. Describí qué recuerdo pierde cada uno (inventalo acorde a su personaje, algo pequeño y tierno) y cómo se les borra mientras lo escriben. La campana suena distinto, satisfecha. Algo en la bruma pronuncia los nombres de los personajes.",
        aviso: "Entregaron un recuerdo cada uno. La Dama ya sabe cómo se llaman.",
      },
    ],
  },
  ancla: {
    id: "ancla",
    pregunta: "¿Quién sostiene la otra punta del hilo?",
    contexto:
      "Para volver de la bruma, alguien tiene que quedarse en la linde con el hilo en la mano y acordarse de ustedes toda la noche.",
    planteo:
      "Cerrá la escena con Úrsula atándoles el hilo rojo a la muñeca y la punta suelta en su mano. Alguien tiene que sostenerla y recordarlos hasta que vuelvan. No elijas por los jugadores quién.",
    narrar: true,
    opciones: [
      {
        id: "brigida",
        titulo: "Brígida",
        detalle: "No suelta ni una deuda. Con ella en la linde, la Bruma cede un punto.",
        efectos: {
          amenaza: -1,
          relaciones: { brigida: 1 },
          memoria: "Brígida sostuvo el hilo rojo en la linde mientras ellos entraban en la bruma.",
        },
        consecuencia:
          "Eligieron a Brígida. Llega protestando, con un banquito y una manta, y se ata el hilo a la muñeca con doble nudo. Les dice que si no vuelven les cobra la habitación igual. Narralo con humor y un fondo de miedo.",
        aviso: "Brígida sostiene el hilo. No piensa soltarlo.",
      },
      {
        id: "ursula",
        titulo: "Úrsula, la tejedora",
        detalle: "Conoce los nudos. Le da a cada uno un nudo de la tejedora (+2 a una tirada de voluntad).",
        efectos: {
          objeto: "nudo",
          relaciones: { ursula: 1 },
          memoria: "Úrsula sostuvo el hilo rojo en la linde mientras ellos entraban en la bruma.",
        },
        consecuencia:
          "Eligieron a Úrsula. Dice que total no pensaba dormir, y le ata a cada uno un nudo más, chico, «por si se les olvida cómo se llaman». Narrá cómo se queda en el umbral con el hilo entre los dedos, tejiendo sin mirar.",
        aviso: "Úrsula sostiene el hilo y les ata un nudo a cada uno.",
      },
      {
        id: "guarda",
        titulo: "Atarlo a la mesa del Guarda",
        detalle: "Un Ausente conoce el camino: empiezan con una pista de la bruma. Pero nadie vivo los espera, y la Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          pista: "pueblo_espejo",
          relaciones: { guarda: 2 },
          memoria: "Ataron la punta del hilo rojo a la mesa del Guarda: quien los espera es un Ausente.",
        },
        consecuencia:
          "Eligieron atar la punta a la mesa de la Casa del Guarda. Úrsula chasquea la lengua pero no opina. El hilo se tensa solo, como si alguien lo hubiera tomado, y da dos tirones cortos: por acá. Mientras entran, el Guarda les va mostrando lo que hay adentro: un pueblo con las ventanas encendidas.",
        aviso: "El hilo queda atado a la mesa del Guarda. Algo lo sostiene.",
      },
    ],
  },
  regreso: {
    id: "regreso",
    pregunta: "La cuenta tiene que cerrar. ¿Qué hacen con Lía?",
    contexto:
      "Nadie sale de la bruma sin que otro ocupe su lugar. El hilo ya tira hacia afuera y no va a esperar.",
    planteo:
      "Cerrá la escena con Lía, que acaba de recordar su nombre, y con los Ausentes de la calle diciendo a la vez, con amabilidad, que la cuenta tiene que cerrar: si alguien sale, alguien se queda. El hilo empieza a tirar. No resuelvas el dilema: lo votan los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "llevarla",
        titulo: "Atarla al hilo y correr",
        detalle: "Lía sale con ustedes. La cuenta queda rota y la Dama no olvida: la Bruma sube 3.",
        efectos: {
          amenaza: 3,
          relaciones: { lia: 2, tobias: 2 },
          memoria: "Sacaron a Lía de la bruma por la fuerza. La cuenta de la Dama quedó rota y les debe una.",
        },
        consecuencia:
          "Ataron a Lía al hilo y corrieron. Los Ausentes no los persiguen: se quedan mirando, y eso es peor. Los chicos que Lía cuidaba la llaman sin voz. La voz de todos dice, sin apuro, que les anota la deuda. Narrá la corrida y el momento en que Lía mira hacia atrás.",
        aviso: "Se llevan a Lía. La Dama les anota la deuda.",
      },
      {
        id: "companero",
        titulo: "Que el animal ocupe su lugar",
        detalle: "El compañero se queda en la bruma por decisión propia. Lía sale y la cuenta cierra. Lo pierden.",
        efectos: {
          pierdeCompanero: true,
          relaciones: { lia: 2, tobias: 2 },
          memoria: "Su compañero animal se quedó en la bruma en lugar de Lía. Sigue ahí, con los chicos.",
        },
        consecuencia:
          "El compañero animal se adelanta solo y se sienta entre los Ausentes chicos, como si lo hubiera decidido hace rato. Uno de los chicos lo acaricia y por un instante tiene cara. La voz de todos dice: «sirve». Lía sale con ellos. Narrá la despedida con pocas palabras y sin sentimentalismo fácil: el animal no mira atrás.",
        aviso: "Su compañero se queda en la bruma. Lía sale con ustedes.",
      },
      {
        id: "dejarla",
        titulo: "Dejarla con los chicos",
        detalle: "Lía elige quedarse. Les enseña su nana (+2 a una tirada de voluntad) y la Bruma cede 2.",
        efectos: {
          amenaza: -2,
          objeto: "nana",
          relaciones: { lia: 1, tobias: -1 },
          memoria: "Lía se quedó en la bruma cuidando a los Ausentes chicos. Les pidió que le digan a Tobías que no la olvide.",
        },
        consecuencia:
          "Lía decide quedarse: alguien tiene que cuidar a los chicos. Les enseña la nana, verso por verso, y les pide una sola cosa para su hermano: que no deje de acordarse. La voz de todos dice que la cuenta está en orden. Narralo con pena y con respeto por la decisión de la chica.",
        aviso: "Lía se queda. Ustedes se llevan su nana.",
      },
    ],
  },
  cripta: {
    id: "cripta",
    pregunta: "¿Cómo bajan a la cripta?",
    contexto: "La escalera baja a oscuras y Anselmo dice que ahí abajo le conocen la voz. Arriba, el pueblo va a notar que alguien abrió el altar.",
    planteo:
      "Cerrá la escena con la trampa abierta bajo el altar y Anselmo en el borde, con la llave de hueso en la mano. Hay que decidir cómo se baja: con él, solos, o dejando avisado al alguacil. No elijas por los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "anselmo",
        titulo: "Con Anselmo",
        detalle: "El Custodio conoce las tumbas: empiezan con una pista de la cripta. Pero abajo le conocen la voz, y la Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          pista: "tumbas_vacias",
          relaciones: { anselmo: 1 },
          memoria: "El padre Anselmo bajó con ellos a la cripta de los Siete.",
        },
        consecuencia:
          "Eligieron bajar con Anselmo. Baja último, agarrado a la pared, rezando en voz muy baja. A mitad de la escalera algo le contesta el rezo desde abajo, con su misma voz. No retrocede.",
        aviso: "Anselmo baja con ustedes. Abajo ya lo oyeron.",
      },
      {
        id: "solos",
        titulo: "Solos, con la llave",
        detalle: "Nadie más se arriesga. Anselmo les da su vela bendita (+2 a una tirada de voluntad).",
        efectos: {
          objeto: "vela",
          memoria: "Bajaron solos a la cripta de los Siete; Anselmo se quedó rezando arriba.",
        },
        consecuencia:
          "Eligieron bajar solos. Anselmo les cuelga la llave de hueso, les pone en la mano un cabo de vela bendita y se queda arriba, de rodillas junto a la trampa, para que al volver tengan una voz hacia la que caminar.",
        aviso: "Bajan solos. Anselmo reza arriba, junto a la trampa.",
      },
      {
        id: "corvino",
        titulo: "Dejando avisado a Corvino",
        detalle: "El alguacil cuida la puerta de la iglesia: la Bruma cede un punto. Pero el pueblo se entera de lo que buscan.",
        efectos: {
          amenaza: -1,
          relaciones: { corvino: 1, anselmo: -1 },
          memoria: "El alguacil Corvino montó guardia en la iglesia mientras ellos bajaban a la cripta.",
        },
        consecuencia:
          "Eligieron avisar a Corvino. El alguacil llega con dos faroles y sin preguntas, se planta en la puerta de la iglesia y les dice que si en una hora no suben, baja a buscarlos, ordenanza o no. Anselmo lo mira como a un intruso.",
        aviso: "Corvino monta guardia en la puerta de la iglesia.",
      },
    ],
  },
  septima: {
    id: "septima",
    pregunta: "Saben quién es la séptima. ¿Qué hacen con su nombre?",
    contexto:
      "Mientras Úrsula no pague, la cuenta no cierra. La Dama no puede tomarla por su cuenta: alguien tiene que decirle el nombre, o decírselo a ella.",
    planteo:
      "Cerrá la escena con la firma leída —Úrsula Vane— y la voz de todos diciendo que hace cien años que la espera. Los personajes tienen ahora el nombre que le falta a la cuenta. No resuelvas qué hacen con él: lo votan los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "decirle",
        titulo: "Decírselo a Úrsula",
        detalle: "Ella tiene derecho a saber quién es. La Dama pierde su secreto y la Bruma sube 2, pero Úrsula recuerda cómo se firmó el pacto.",
        efectos: {
          amenaza: 2,
          relaciones: { ursula: 2 },
          memoria: "Decidieron contarle a Úrsula que ella es la séptima fundadora. Al saberlo, recuerda cómo se firmó el pacto.",
        },
        consecuencia:
          "Eligieron guardarse el nombre para decírselo a ella. La voz de todos se enfría: dice que los nombres dichos en voz alta no se pueden desdecir. Los seis fundadores se sientan de nuevo, y uno, antes de sentarse, hace con la cabeza algo que parece un gracias. Suben con la bruma pegada a los talones.",
        aviso: "Le van a decir a Úrsula quién es.",
      },
      {
        id: "entregarla",
        titulo: "Darle el nombre a la Dama",
        detalle: "La cuenta cierra: la Bruma cede 3 y la campana calla unas noches. Úrsula paga lo que debe.",
        efectos: {
          amenaza: -3,
          relaciones: { ursula: -3, anselmo: 1 },
          memoria: "Le dieron a la Dama el nombre de Úrsula Vane. La cuenta de los Siete quedó cerrada y la tejedora empezó a borrarse.",
        },
        consecuencia:
          "Eligieron decir el nombre frente al Umbral. La bruma de la puerta se aquieta como agua que encuentra su nivel. La voz de todos dice «gracias» y suena sincera. Arriba, en la linde, a una vieja se le cae el ovillo de la falda y no sabe por qué. No lo narres como un triunfo: narralo como una deuda ajena que cobraron ellos.",
        aviso: "Dijeron el nombre. La cuenta de los Siete cierra.",
      },
      {
        id: "callar",
        titulo: "Callar y guardarlo",
        detalle: "Ni para una ni para la otra. Se llevan la firma (+2 a una tirada de ingenio); la Dama sabe que la tienen y la Bruma sube 1.",
        efectos: {
          amenaza: 1,
          objeto: "firma",
          relaciones: { ursula: 1 },
          memoria: "Se guardaron el nombre de la séptima fundadora sin decírselo a nadie. La Dama sabe que lo tienen.",
        },
        consecuencia:
          "Eligieron callar. Arrancan del dintel el pedazo de ordenanza con la firma y se lo guardan. La voz de todos no se enoja: dice que puede esperar, que es lo que mejor hace, y que ellos no. Los fundadores los miran subir sin moverse.",
        aviso: "Se guardan la firma. La Dama espera.",
      },
    ],
  },
  lectura: {
    id: "lectura",
    pregunta: "¿De dónde leen los nombres?",
    contexto:
      "Los vecinos esperan al pie de la iglesia y no recuerdan a quién tienen que nombrar. Alguien tiene que ir dictándoles, y hay tres registros de cien años de olvidos.",
    planteo:
      "Cerrá la escena con los vecinos juntos al pie de la iglesia, el badajo en brazos, y la pregunta en el aire: no se acuerdan de a quién nombrar. Hay tres registros: el cuaderno del Guarda, el ovillo de la tejedora y el propio Libro. No elijas por los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "cuaderno",
        titulo: "El cuaderno del Guarda",
        detalle: "Los anotó a todos, con fecha y con oficio. Lo leen ustedes: la Bruma cede un punto y el Guarda queda de su lado.",
        efectos: {
          amenaza: -1,
          relaciones: { guarda: 2 },
          memoria: "Los nombres de los Ausentes se leyeron del cuaderno del Guarda.",
        },
        consecuencia:
          "Eligieron el cuaderno del Guarda. Cuando lo abren, las páginas se dan vuelta solas hasta la primera, y una mano que no se ve les señala el renglón. Brígida se lo arrebata: dice que con esa letra de forasteros no se entiende nada, y empieza a leer ella, a los gritos.",
        aviso: "Leen del cuaderno del Guarda.",
      },
      {
        id: "ovillo",
        titulo: "El ovillo de la tejedora",
        detalle: "Un nudo por nombre: se lee con los dedos y no se saltea a nadie. Cada uno recibe un nudo de la tejedora (+2 a una tirada de voluntad).",
        efectos: {
          objeto: "nudo",
          memoria: "Los nombres de los Ausentes se leyeron del ovillo de la tejedora, nudo por nudo.",
        },
        consecuencia:
          "Eligieron el ovillo. Si Úrsula sigue en su casa, lo trae ella misma, apoyada en Tobías o en un vecino, y va diciendo los nombres al tocar cada nudo sin saber de dónde los saca. Si fue entregada, el ovillo quedó en su umbral: lo levanta Brígida y los nudos le dictan a ella. El hilo se va desenrollando escalera arriba.",
        aviso: "Leen del ovillo, nudo por nudo.",
      },
      {
        id: "libro",
        titulo: "El Libro de los Ausentes",
        detalle: "Anselmo los escribió y Anselmo los lee. Les da su vela bendita (+2 a una tirada de voluntad), pero el Libro es de la Dama: la Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          objeto: "vela",
          relaciones: { anselmo: 2 },
          memoria: "El padre Anselmo leyó en voz alta, del Libro, los nombres que él mismo había escrito.",
        },
        consecuencia:
          "Eligieron el Libro. Anselmo lo abre por la primera página que escribió él, hace cuarenta años, y lee con la voz que usa para los bautismos. A cada nombre levanta la vista y busca en la plaza. Las páginas ya leídas se ponen grises, como ceniza.",
        aviso: "Anselmo lee del Libro los nombres que escribió.",
      },
    ],
  },
  pacto: {
    id: "pacto",
    pregunta: "Falta una campanada. ¿Qué hacen con el pacto?",
    contexto:
      "La campana dio once. La Dama está en el campanario, sin figura y sin nombre, y el último renglón del Libro dice los suyos. Lo que elijan ahora no se deshace.",
    planteo:
      "Cerrá la escena con la campana recién dada la undécima, la tinta del renglón casi seca y la Dama esperando. Ella misma dice las tres salidas, sin apuro: pueden dar la última campanada y terminar con todo; pueden firmar en el renglón un pacto nuevo; o pueden hacer lo que nadie hizo, que es preguntarle si quiere quedarse. No resuelvas nada: lo votan los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "romper",
        titulo: "Dar las doce",
        detalle: "La hora trece deja de existir y el pacto se rompe. Vuelven los que alguien todavía quiere. La Dama se queda sola en la bruma, sin horario.",
        efectos: {
          amenaza: -10,
          relaciones: { tobias: 2, brigida: 2, corvino: 2 },
          memoria: "FINAL: dieron la campanada doce y rompieron el pacto. La hora trece no existe más.",
        },
        consecuencia:
          "Eligieron romper el pacto. Dan la campanada doce a mano y la trece no llega. El renglón con sus nombres se borra del Libro, y después todos los demás. En la plaza, los Ausentes que alguien nombró recuperan la cara y bajan hacia sus casas; los más antiguos, que no tienen a nadie, se deshacen despacio, como quien por fin se acuesta. La Dama no grita: dice «entonces vuelvo a comer sola», y la bruma retrocede hasta la linde y se queda ahí. Si Úrsula está presente, ata el último nudo y se sienta a descansar. No lo narres como un triunfo limpio: el pueblo va a tener que recordar por su cuenta todo lo que hizo.",
        aviso: "Dieron las doce. La hora trece no existe más.",
      },
      {
        id: "renovar",
        titulo: "Firmar el renglón",
        detalle: "Un pacto nuevo: nadie más es borrado, y lo pagan ustedes, un recuerdo por noche. Cada uno pierde 2 de vida máxima. El pueblo no se entera.",
        efectos: {
          amenaza: -4,
          vidaMax: -2,
          relaciones: { anselmo: 2 },
          memoria: "FINAL: firmaron un pacto nuevo y son los Custodios. Pagan con sus propios recuerdos, uno por noche, y se quedan en Valdebruma.",
        },
        consecuencia:
          "Eligieron renovar el pacto. Firman debajo de sus propios nombres y el renglón cambia: ya no dice a quién se entrega, dice quién paga. La Dama acepta con una cortesía antigua. Anselmo suelta la pluma y llora de alivio, y eso también duele. Los Ausentes vuelven al borde de la bruma, quietos. Desde esta noche, cada uno le deja a la Dama un recuerdo antes de dormir: narrá el primero que entrega cada personaje, pequeño y querido. Nadie en el pueblo va a saber lo que les deben.",
        aviso: "Firmaron. El pacto sigue, y lo pagan ustedes.",
      },
      {
        id: "nombrar",
        titulo: "Ponerle un plato",
        detalle: "Nadie le preguntó nunca si quería quedarse. Darle un nombre y un lugar en la mesa. No se sabe qué pasa cuando la Dama tiene nombre.",
        efectos: {
          amenaza: -10,
          relaciones: { brigida: 2, tobias: 1, anselmo: 1 },
          memoria: "FINAL: le dieron a la Dama un nombre, Aldara, y un lugar en la mesa. El pacto no se rompió ni se renovó: dejó de hacer falta.",
        },
        consecuencia:
          "Eligieron invitarla. Le dicen que en la casa de la linde hay una mesa puesta y un plato en la cabecera que nadie usó. El hueco en la bruma tarda en contestar. Dice que no tiene nombre para dar en la puerta. Brígida, que subió protestando, abre el libro de huéspedes, moja la pluma y dice que en su posada nadie come sin anotarse: «Aldara. Algo hay que poner». Al escribirse el nombre, el hueco tiene por un instante el contorno de una mujer vieja. La campana no da ni doce ni trece. El renglón del Libro queda en blanco. Los Ausentes de la plaza no desaparecen: empiezan a caminar, cada uno hacia una luz. No expliques las reglas nuevas: mostrá que la bruma ahora tiene un sendero.",
        aviso: "La anotaron en el libro de huéspedes: Aldara.",
      },
    ],
  },
  viajera: {
    id: "viajera",
    pregunta: "¿Qué hacen con la pasajera de más?",
    contexto:
      "Tiene boleto, no tiene carta y no figura en la lista. No dijo una palabra. Falta poco para la venta, donde alguien podría bajar.",
    planteo:
      "Cerrá la escena con todas las miradas en la mujer del velo, que sostiene el boleto y no contesta. Mateo grita desde arriba que falta poco para la venta. No decidas por los jugadores qué hacen con ella.",
    narrar: true,
    opciones: [
      {
        id: "dejarla",
        titulo: "Dejarla viajar en paz",
        detalle: "Pagó su boleto. Nadie le toca el velo. Queda de su lado, y la Bruma cede un punto.",
        efectos: {
          amenaza: -1,
          relaciones: { viajera: 2 },
          memoria: "Dejaron viajar a la pasajera del velo sin preguntarle nada.",
        },
        consecuencia:
          "Eligieron dejarla en paz. La mujer inclina apenas la cabeza, guarda el boleto en el guante y vuelve a mirar por la ventanilla. Por un momento el coche parece un coche cualquiera.",
        aviso: "La pasajera del velo sigue viaje, sin nombre.",
      },
      {
        id: "rostro",
        titulo: "Pedirle que se levante el velo",
        detalle: "Van a saber quién es. Ella no lo va a olvidar.",
        efectos: {
          relaciones: { viajera: -1 },
          memoria: "Le hicieron levantar el velo a la pasajera: es Irene, y viaja a enterrar a su madre.",
        },
        consecuencia:
          "Eligieron verle la cara. Se levanta el velo ella misma, despacio: es joven, no durmió, y los mira de a uno. Dice solo esto: que se llama Irene y que va a enterrar a su madre. No dice el apellido. Se baja el velo de nuevo. Mateo, que espiaba por la ventanilla, se persigna.",
        aviso: "Se levantó el velo. Dice llamarse Irene.",
      },
      {
        id: "bajarla",
        titulo: "Hacerla bajar en la venta",
        detalle: "No está en la lista: que espere otro coche. Hay más lugar, y la Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          relaciones: { viajera: -3, mateo: -1 },
          memoria: "Decidieron bajar a la pasajera del velo en la Venta del Ciego. No hay otro coche hasta la primavera.",
        },
        consecuencia:
          "Eligieron bajarla en la venta. Ella no discute. Mateo sí: dice que no hay otro coche hasta la primavera y que él no deja a una mujer de luto en el páramo, pero la lista es la lista. La mujer junta su bolso y espera, muy derecha, a que el coche pare.",
        aviso: "La pasajera del velo baja en la venta.",
      },
    ],
  },
  peaje: {
    id: "peaje",
    pregunta: "Los Recaudadores esperan. ¿Con qué pagan?",
    contexto:
      "Piden algo que pese. Lo que se les entrega, se olvida. Y nadie recuerda a un coche que haya pasado sin pagar.",
    planteo:
      "Cerrá la escena con los cuatro jinetes inmóviles y el precio dicho: el cofre cerrado, una verdad en voz alta de quien lleva el farol, o nada, si se animan a pasar entre ellos. No resuelvas el pago: lo votan los jugadores.",
    narrar: true,
    opciones: [
      {
        id: "cofre",
        titulo: "Entregar el cofre",
        detalle: "Se lo llevan cerrado y nadie sabrá qué tenía. La Bruma cede 2.",
        efectos: {
          amenaza: -2,
          relaciones: { mateo: -1 },
          memoria: "Pagaron el peaje del puente con el cofre lacrado. Los Recaudadores se lo llevaron sin abrirlo.",
        },
        consecuencia:
          "Eligieron entregar el cofre. Lo bajan entre dos. Un jinete lo levanta con una mano, como si no pesara, y eso lo decepciona. Se abren. Cuando el coche pasa, Mateo pregunta qué era eso que llevaba bajo el asiento, y nadie está del todo seguro. Si la pasajera del velo sigue a bordo, aprieta el boleto hasta arrugarlo.",
        aviso: "Entregaron el cofre. Ya cuesta recordar cómo era.",
      },
      {
        id: "verdad",
        titulo: "Pagar con una verdad",
        detalle: "Quien lleva el farol dice en voz alta lo que calla: su secreto queda a la vista de todos. El cofre sigue viaje.",
        efectos: {
          revelaFarol: true,
          amenaza: -1,
          memoria: "Pagaron el peaje del puente con una verdad: quien llevaba el farol dijo su secreto ante todos.",
        },
        consecuencia:
          "Eligieron pagar con una verdad. Quien lleva el farol baja del coche y dice su secreto en voz alta, delante de todos (contalo con sus palabras, tal como está escrito en su ficha). Los jinetes inclinan la cabeza: pesa. Se abren. Los demás pasajeros lo oyeron todo, y eso no se lo llevó nadie.",
        aviso: "Pagaron con una verdad. Ahora la saben todos.",
      },
      {
        id: "cruzar",
        titulo: "No pagar y cruzar",
        detalle: "Conservan todo. Cada uno pierde 2 de vida y la Bruma sube 3: van a venir a cobrar.",
        efectos: {
          amenaza: 3,
          danio: 2,
          relaciones: { mateo: 1 },
          memoria: "Cruzaron el puente sin pagar el peaje. Los Recaudadores los dejaron pasar y los siguen.",
        },
        consecuencia:
          "Eligieron no pagar. Mateo suelta las riendas y el coche se mete entre los jinetes. No los frenan: los dejan pasar, y pasar entre ellos es como atravesar agua helada. A cada uno le queda el frío en el pecho. Atrás, sin apuro, los cuatro dan vuelta los caballos.",
        aviso: "Cruzaron sin pagar. Los siguen.",
      },
    ],
  },
  rumbo: {
    id: "rumbo",
    pregunta: "¿Hacia dónde sigue el coche?",
    contexto:
      "La rueda aguanta, por ahora. Adelante, el Paso. Atrás, la venta. A un costado, las luces de Casa Orbe. La bruma ya está sobre el puente.",
    planteo:
      "Es el cierre del capítulo: terminá con la lista a la vista de todos, la rueda puesta y Mateo con las riendas en la mano, preguntando para dónde. No elijas por ellos.",
    narrar: false,
    opciones: [
      {
        id: "seguir",
        titulo: "Al Paso, como estaba previsto",
        detalle: "Llegar antes del amanecer y que firme quien tenga que firmar.",
        efectos: { memoria: "Decidieron seguir hacia el Paso." },
        consecuencia: "",
        aviso: "El coche sigue hacia el Paso.",
      },
      {
        id: "volver",
        titulo: "De vuelta a la venta",
        detalle: "Con el puente a la espalda y los Recaudadores en el medio. La Bruma sube 1.",
        efectos: { amenaza: 1, memoria: "Decidieron dar la vuelta hacia la Venta del Ciego." },
        consecuencia: "",
        aviso: "El coche da la vuelta.",
      },
      {
        id: "desvio",
        titulo: "A las luces de Casa Orbe",
        detalle: "Nadie los citó ahí. Por eso mismo.",
        efectos: { relaciones: { viajera: 1 }, memoria: "Decidieron desviarse hacia Casa Orbe." },
        consecuencia: "",
        aviso: "El coche deja el camino y va hacia las luces.",
      },
    ],
  },
  firma: {
    id: "firma",
    pregunta: "El papel está en la mesa. ¿Firman?",
    contexto:
      "Una bolsa de plata por cabeza a cambio de una firma. El escribano dice que es una formalidad. Tiene una sola pluma y mucho apuro.",
    planteo:
      "Cerrá la escena con el papel, el tintero y la pluma en el centro de la mesa, y Quintana mirando el reloj. No decidas por los jugadores si firman.",
    narrar: true,
    opciones: [
      {
        id: "firmar",
        titulo: "Firmar y cobrar",
        detalle: "Plata en mano y el escribano contento: la Bruma cede un punto. Lo firmado, firmado está.",
        efectos: {
          amenaza: -1,
          relaciones: { quintana: 2, remedios: -2, viajera: -1 },
          memoria: "Firmaron el papel del escribano: una renuncia a todo reclamo contra la Compañía. Cada uno cobró su bolsa.",
        },
        consecuencia:
          "Eligieron firmar. La pluma pasa de mano en mano. Quintana seca cada firma con arena, sopla, y reparte las bolsas con dos dedos, como propinas. Remedios retira los platos sin terminar. Si la pasajera del velo está en la mesa, se levanta y sale.",
        aviso: "Firmaron. Cada uno tiene su bolsa de plata.",
      },
      {
        id: "negarse",
        titulo: "No firmar nada",
        detalle: "Sin plata y con el escribano en contra. Remedios queda de su lado, y la Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          relaciones: { quintana: -2, remedios: 2 },
          memoria: "Se negaron a firmar el papel del escribano.",
        },
        consecuencia:
          "Eligieron no firmar. Quintana recoge el papel con mucho cuidado, lo alisa, y dice que la noche es larga y las habitaciones frías, y que ya van a entrar en razón. Remedios, por primera vez, les sirve vino.",
        aviso: "Nadie firmó. El escribano guarda el papel.",
      },
      {
        id: "demorar",
        titulo: "Pedir el original",
        detalle: "Que muestre el testamento de puño de Casilda. Gana tiempo y deja ver la tinta; él no lo va a perdonar.",
        efectos: {
          pista: "misma_tinta",
          relaciones: { quintana: -1, remedios: 1 },
          memoria: "Le exigieron al escribano el testamento original antes de firmar nada. No lo tenía a mano.",
        },
        consecuencia:
          "Eligieron pedir el original. Quintana sonríe, dice «por supuesto», revuelve sus pliegos y no lo encuentra. Dice que está arriba, que mañana, que es lo mismo. Mientras revuelve, el pliego que leía queda un momento a la luz: la tinta todavía brilla de nueva.",
        aviso: "Pidieron el original. El escribano no lo tiene a mano.",
      },
    ],
  },
  deudas: {
    id: "deudas",
    pregunta: "El Libro de Deudas está abierto. ¿Qué hacen con él?",
    contexto:
      "Hay una página por cada uno. Lo que dice ahí lo sabe quien lo escribió, que está bajo la lápida, y quien lo lea ahora.",
    planteo:
      "Cerrá la escena con el Libro abierto sobre el altar e Irene diciendo que no lo va a decidir sola. No resuelvas qué se hace con él.",
    narrar: true,
    opciones: [
      {
        id: "leer",
        titulo: "Leerlo en voz alta",
        detalle: "Todas las páginas, delante de todos: los secretos de cada uno salen a la luz. Sin nada que esconder, la Bruma cede 2.",
        efectos: {
          revelaTodos: true,
          amenaza: -2,
          relaciones: { viajera: 1 },
          memoria: "Leyeron el Libro de Deudas en voz alta: ya no hay secretos entre los pasajeros.",
        },
        consecuencia:
          "Eligieron leerlo. Lee Remedios, sin entonación, página por página: decí en una frase lo que el Libro cuenta de cada personaje, usando el secreto que escribió su jugador. Nadie mira a nadie. Cuando termina, Irene dice que su madre perdonaba poco y anotaba todo.",
        aviso: "Se leyó el Libro entero. Ya no hay secretos en el coche.",
      },
      {
        id: "quemar",
        titulo: "Quemarlo",
        detalle: "Nadie sabrá lo que debía nadie. Tampoco lo que debía el escribano. La Bruma sube un punto.",
        efectos: {
          amenaza: 1,
          relaciones: { viajera: -2, remedios: -1, quintana: 1 },
          memoria: "Quemaron el Libro de Deudas en la capilla, sin leerlo.",
        },
        consecuencia:
          "Eligieron quemarlo. Arde mal, como arde el papel viejo, y llena la capilla de humo. Irene no lo impide: mira. Remedios apaga las brasas con el pie y dice que la señora tardó cuarenta años en escribir eso.",
        aviso: "Quemaron el Libro de Deudas.",
      },
      {
        id: "irene",
        titulo: "Dárselo cerrado a Irene",
        detalle: "Es su herencia. Ella decide quién lee qué, y queda de su lado.",
        efectos: {
          relaciones: { viajera: 2, remedios: 1 },
          memoria: "Le entregaron el Libro de Deudas a Irene Orbe sin leerlo.",
        },
        consecuencia:
          "Eligieron dárselo a Irene. Ella lo cierra, le pone el candado y se lo cuelga del brazo como una cartera. Dice que cada uno puede pedirle su página cuando quiera, a solas, y que a ella no le interesa leer las ajenas. Casi sonríe.",
        aviso: "Irene se queda con el Libro, cerrado.",
      },
    ],
  },
  alba: {
    id: "alba",
    pregunta: "Aclara. ¿Quién sube al coche?",
    contexto:
      "Los Recaudadores esperan en el portón y el plazo del escribano vence en el Paso. Mateo le hace caso a lo que diga la mesa.",
    planteo:
      "Es el cierre del capítulo: terminá con el coche enganchado, el cielo aclarando y Mateo con las riendas en la mano, esperando que le digan quién sube. No elijas por ellos.",
    narrar: false,
    opciones: [
      {
        id: "quintana",
        titulo: "Con el escribano",
        detalle: "Él conoce el Paso y a quién hay que firmarle. También hizo la lista.",
        efectos: { relaciones: { quintana: 1, viajera: -2 }, memoria: "Salieron hacia el Paso con el escribano Quintana a bordo. Irene se quedó en la casa." },
        consecuencia: "",
        aviso: "El escribano sube al coche. Irene se queda en la escalinata.",
      },
      {
        id: "irene",
        titulo: "Con Irene",
        detalle: "La heredera va a reclamar lo suyo al Paso. El escribano se queda con los del portón.",
        efectos: { relaciones: { viajera: 2, quintana: -3 }, memoria: "Salieron hacia el Paso con Irene Orbe a bordo. El escribano quedó en la casa, con los Recaudadores en el portón." },
        consecuencia: "",
        aviso: "Irene sube al coche. El escribano se queda mirando el portón.",
      },
      {
        id: "solos",
        titulo: "Ninguno de los dos",
        detalle: "Que arreglen sus cuentas entre ellos. Sin dueño a bordo, la Bruma sube 1.",
        efectos: { amenaza: 1, memoria: "Salieron de Casa Orbe solos, sin el escribano ni la heredera." },
        consecuencia: "",
        aviso: "El coche sale solo con sus pasajeros.",
      },
    ],
  },
  mejora: {
    id: "mejora",
    pregunta: "¿Qué arreglan primero en la Casa del Guarda?",
    contexto: "Tienen un día de calma antes de que caiga otra noche. Alcanza para una sola cosa.",
    planteo:
      "Es el cierre del capítulo: terminá con los personajes dentro de la Casa del Guarda, la puerta cerrada, mirando todo lo que hay por arreglar. No elijas por ellos qué arreglan.",
    narrar: false,
    opciones: MEJORAS.map((m) => ({
      id: m.id,
      titulo: m.titulo,
      detalle: `${m.detalle} ${m.efecto}`,
      efectos: { mejora: m.id },
      consecuencia: "",
      aviso: `Mejora del refugio: ${m.titulo.toLowerCase()}.`,
    })),
  },
};

/** Capítulos de una campaña, en orden. */
export const capitulosDe = (campana: CampanaId): CapituloDef[] =>
  CAPITULOS.filter((c) => (c.campana ?? "trece") === campana);

/** Número que se muestra: la posición del capítulo dentro de su campaña, desde 1. */
export const ordenDe = (numero: number): number => {
  const c = capituloDef(numero);
  return capitulosDe(c.campana ?? "trece").indexOf(c) + 1;
};

/** El capítulo que sigue dentro de la misma campaña, si ya está escrito. */
export const siguienteCapitulo = (numero: number): number | null => {
  const c = capituloDef(numero);
  const todos = capitulosDe(c.campana ?? "trece");
  return todos[todos.indexOf(c) + 1]?.numero ?? null;
};

export const npcsDe = (campana: CampanaId): Npc[] => NPCS.filter((n) => (n.campana ?? "trece") === campana);

/** Índices de las escenas de un capítulo dentro de la lista completa. */
export const escenasDe = (capitulo: number): number[] =>
  ESCENAS.flatMap((s, i) => (s.capitulo === capitulo ? [i] : []));

export const esUltimaDelCapitulo = (indice: number): boolean =>
  ESCENAS[indice + 1]?.capitulo !== ESCENAS[indice]?.capitulo;

export const pistasDe = (capitulo: number): Pista[] =>
  PISTAS.filter((p) => ESCENAS[p.escena]?.capitulo === capitulo);

export const escenaDef = (indice: number): EscenaDef => {
  const e = ESCENAS[indice];
  if (!e) throw new Error(`Escena inexistente: ${indice}`);
  return e;
};

export const npcDef = (id: string): Npc | undefined => NPCS.find((n) => n.id === id);
export const pistaDef = (id: string): Pista | undefined => PISTAS.find((p) => p.id === id);

function ESCENAS_COCHE(): void {
  ESCENAS.push(
    {
      id: "posta",
      capitulo: 101,
      titulo: "La última posta",
      lugar: "posta",
      ambientacion:
        "Atardecer en la Posta del Cruce, la última antes del Páramo de la Sal. La diligencia «La Rezagada» está enganchada a cuatro caballos nerviosos. Mateo Varga, el cochero, cuenta pasajeros con una lista en la mano y la cuenta no le da. Dentro del coche ya hay una mujer de luto, con velo, sentada junto a la ventanilla con el boleto en la falda. El maestro de posta quiere cerrar antes de que baje la bruma. Cada personaje llega por su lado, con una carta en el bolsillo.",
      objetivo: "Subir al coche antes de que cierre la posta y notar que ninguno viaja por casualidad.",
      vias: {
        combate: "Cargar baúles y el cofre al pescante, sujetar un caballo que se encabrita, abrirse lugar en un coche donde no caben todos.",
        ingenio: "Espiar la lista del cochero, comparar con disimulo el sello de las cartas, contar pasajeros.",
        dialogo: "Sonsacar a Mateo, presentarse (o mentir) ante los otros pasajeros, saludar a la mujer del velo.",
      },
      npcs: ["mateo", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "El maestro de posta apaga el farol del patio y el coche arranca con la última luz. Adentro van apretados, y son uno más de lo que dice la lista.",
      opcionesBase: [
        {
          id: "a",
          texto: "Ayudar a subir el cofre lacrado al pescante",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "facil" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Mirar de reojo la lista que lleva el cochero",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Preguntarle a Mateo por qué cuenta dos veces",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "media" },
          avanza: true,
        },
      ],
      aperturaBase:
        "Atardece en la Posta del Cruce. Más allá del último corral no hay camino: hay sal, blanca y lisa, hasta donde da la vista.\n\nLa diligencia espera enganchada. El cochero, un flaco de bufanda, pasa el dedo por una lista, levanta la vista, cuenta cabezas, y vuelve a empezar.\n\n—Me sobra uno —dice, a nadie—. O me falta un renglón.\n\nDentro del coche, junto a la ventanilla, ya hay alguien sentado: una mujer de luto, con velo.",
      resumenBase:
        "Subieron a La Rezagada en la última posta. El cochero contó dos veces: en el coche viaja una persona más de las que dice su lista.",
    },
    {
      id: "coche",
      capitulo: 101,
      titulo: "Siete donde caben seis",
      lugar: "coche",
      ambientacion:
        "El interior de la diligencia, de noche, en marcha por el páramo. Van rodilla con rodilla bajo un farol que se balancea. La pasajera del velo no habla: mira. Bajo el asiento del cochero viaja un cofre lacrado con una rueda en el sello, y en cada pozo algo se desliza adentro. Afuera, la sal brilla como nieve y la bruma viene de costado. Tarde o temprano alguien saca su carta.",
      objetivo: "Averiguar qué trajo a cada uno a este coche y qué hace acá la pasajera de más.",
      vias: {
        combate: "Sostener el farol y a los pasajeros en un tramo malo, trepar al pescante con el coche andando, revisar el cofre a la fuerza.",
        ingenio: "Comparar las cartas, leer el sello del cofre, observar a la pasajera: los guantes, el boleto, lo que mira.",
        dialogo: "Hacer hablar a los otros de su carta sin mostrar la propia, hablarle a la pasajera, tirarle de la lengua a Mateo por la ventanilla.",
      },
      npcs: ["viajera", "mateo"],
      meta: 2,
      tope: 3,
      cierre:
        "Las cartas están sobre las rodillas de todos: la misma letra, la misma firma, la de una muerta. La pasajera del velo no sacó ninguna. Mateo avisa a los gritos que en un rato paran a cambiar caballos.",
      votoAlCerrar: "viajera",
      opcionesBase: [
        {
          id: "a",
          texto: "Trepar al pescante para ver el cofre de cerca",
          enfoque: "combate",
          tirada: { atributo: "destreza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Comparar la letra de las cartas que asoman",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Hablarle a la mujer del velo",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "dificil" },
          avanza: true,
        },
      ],
      aperturaBase:
        "El coche toma el páramo y la posta se queda atrás, chica, hasta que es una sola luz.\n\nAdentro no entra un alfiler. El farol se balancea y pasa la cara de cada uno de la luz a la sombra. La mujer del velo no se mueve con los pozos.\n\nDebajo del pescante, algo pesado se corre un palmo y vuelve.\n\n—¡Es el cofre! —grita Mateo desde arriba—. ¡No es nada! ¡No lo toquen!",
      resumenBase:
        "Dentro del coche compararon las cartas: todas las firma Casilda Orbe, muerta hace tres semanas. La pasajera del velo no mostró ninguna.",
    },
    {
      id: "venta",
      capitulo: 101,
      titulo: "La Venta del Ciego",
      lugar: "venta",
      ambientacion:
        "Una venta sola en medio de la sal, donde La Rezagada cambia caballos. El ventero, don Elías, es ciego y reconoce a los coches por el ruido del eje: cuando oye a este, tranca la puerta y atiende por la ventana. En el establo no están los caballos de refresco de la Compañía. Hay cuatro, ya ensillados, con arreos negros, que nadie trajo.",
      objetivo: "Conseguir caballos para seguir y saber por qué el ventero le tiene miedo a este coche.",
      vias: {
        combate: "Desenganchar y enganchar a oscuras, forzar el establo, calmar a los caballos de arreos negros o sacarlos del medio.",
        ingenio: "Revisar los arreos negros, el libro de pasajeros de la venta, las huellas en el patio.",
        dialogo: "Convencer a don Elías de abrir, hacer que cuente lo del año pasado, negociar el precio de sus propios caballos.",
      },
      npcs: ["elias", "mateo"],
      meta: 2,
      tope: 3,
      cierre:
        "Salen de la venta con caballos de refresco, los que sean. Don Elías les grita desde la ventana que en el puente no discutan el precio. Los cuatro caballos de arreos negros ya no están en el establo.",
      opcionesBase: [
        {
          id: "a",
          texto: "Desenganchar los caballos cansados a oscuras",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Revisar los arreos negros de los caballos del establo",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Golpear la ventana y pedirle al ventero que abra",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "media" },
          avanza: true,
        },
      ],
      aperturaBase:
        "La venta aparece de golpe: un patio, un aljibe, un farol. El coche entra y, antes de que frene, adentro alguien corre una tranca.\n\n—¡Elías! —grita Mateo—. ¡Soy yo, hombre! ¡Caballos!\n\nUna ventana se abre un dedo.\n\n—Ese eje ya lo oí —dice una voz vieja—. No abro. Los caballos están donde siempre. Sírvanse y sigan.\n\nEn el establo hay cuatro caballos. Están ensillados. Los arreos son negros.",
      resumenBase:
        "En la Venta del Ciego cambiaron caballos. El ventero no quiso abrir: dice que el último coche del año pasado llegó a destino con el cochero solo.",
    },
    {
      id: "puente",
      capitulo: 101,
      titulo: "El peaje",
      lugar: "puente",
      ambientacion:
        "Un puente de piedra, largo y sin baranda, sobre la salina. La bruma lo tapa por la mitad. Cruzados en el medio hay cuatro jinetes de arreos negros, sin rostro: los Recaudadores. Los caballos del coche se niegan a avanzar. Una voz que parece salir de los cuatro pide el peaje: algo que pese. Miran el cofre. Miran a cada pasajero como quien calcula un peso.",
      objetivo: "Aguantar frente a los Recaudadores hasta entender qué aceptan como pago.",
      vias: {
        combate: "Sujetar a los caballos, plantarse entre los jinetes y el coche, proteger el cofre o a otro pasajero.",
        ingenio: "Fijarse en qué miran los jinetes y qué no, revisar el lacre del cofre, recordar lo que dijo el ventero.",
        dialogo: "Preguntar el precio, regatear, ofrecer algo propio, hablar por otro pasajero.",
      },
      npcs: ["mateo", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "Los Recaudadores dicen el precio sin apuro. Aceptan el cofre, cerrado como está. Aceptan una verdad dicha en voz alta por quien lleva el farol. O pueden no cobrar nada, si el coche se anima a pasar entre ellos.",
      votoAlCerrar: "peaje",
      opcionesBase: [
        {
          id: "a",
          texto: "Sujetar a los caballos antes de que reculen al vacío",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "dificil" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Fijarse qué miran los jinetes y qué esquivan",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Preguntarles cuánto es el peaje",
          enfoque: "dialogo",
          tirada: { atributo: "voluntad", dificultad: "dificil" },
          avanza: true,
        },
      ],
      aperturaBase:
        "El camino sube a un puente. Es de piedra, angosto, sin baranda, y a los veinte pasos lo tapa la bruma.\n\nLos caballos se plantan. Mateo no les grita: se quedó callado, que en él es peor.\n\nEn el medio del puente hay cuatro jinetes cruzados. Arreos negros. Debajo de los sombreros no hay nada que mirar.\n\n—Peaje —dicen, los cuatro o ninguno—. Algo que pese.",
      resumenBase:
        "En el puente los pararon cuatro jinetes sin rostro. No quisieron monedas: pidieron el cofre, una verdad, o que se animaran a pasar.",
    },
    {
      id: "paramo",
      capitulo: 101,
      titulo: "Lo que dice la lista",
      lugar: "paramo",
      ambientacion:
        "Del otro lado del puente, en pleno páramo, una rueda dice basta y el coche se detiene. Mientras se arregla, Mateo saca por fin la lista y la deja ver entera. Está escrita con la letra de las cartas. Desde acá se abren tres caminos: adelante, el Paso, al que hay que llegar antes de que amanezca; atrás, la venta; y a un costado, lejos, las luces de una casa grande que Mateo llama Casa Orbe.",
      objetivo: "Arreglar la rueda, leer la lista entera y decidir entre todos hacia dónde sigue el coche.",
      vias: {
        combate: "Levantar el coche a pulso, cambiar la rueda, vigilar el puente con algo en la mano.",
        ingenio: "Leer la lista por los dos lados, comparar las tintas, orientarse por las luces.",
        dialogo: "Poner las cartas (o los encargos) sobre la mesa, acusar, pactar, convencer a Mateo de cambiar el rumbo.",
      },
      npcs: ["mateo", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "Fin del capítulo. La rueda aguanta. La lista quedó a la vista de todos: sus nombres, con la letra de una muerta, y al dorso una línea con otra tinta. Hay que decidir el rumbo antes de que la bruma cruce el puente detrás de ellos.",
      votoAlCerrar: "rumbo",
      opcionesBase: [
        {
          id: "a",
          texto: "Levantar el eje a pulso para cambiar la rueda",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Dar vuelta la lista y leer el dorso al farol",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Proponer que cada uno muestre lo que trae en el bolsillo",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "dificil" },
          avanza: true,
        },
      ],
      aperturaBase:
        "Del otro lado del puente el coche anda cien pasos y se inclina, con un quejido de madera. Una rueda.\n\nMateo baja, la mira, y por una vez no dice nada sobre la Compañía. Se saca la lista del pecho y la alisa contra la rodilla, al farol.\n\n—Ya que estamos parados —dice—. Miren esto, que yo de letras no entiendo, y díganme si no es la misma mano.\n\nLejos, a un costado, hay luces. Una casa grande.",
      resumenBase:
        "Pasado el puente se rompió una rueda. La lista del cochero está escrita por Casilda Orbe; al dorso, con otra tinta, dice: «uno de ustedes no llega».",
    },
  );
}

function ESCENAS_ORBE(): void {
  ESCENAS.push(
    {
      id: "porton",
      capitulo: 102,
      titulo: "El portón de Casa Orbe",
      lugar: "casaorbe",
      ambientacion:
        "Casa Orbe: un caserón de dos plantas en medio de la sal, con cocheras, capilla y todas las ventanas encendidas. Los espejos están tapados con paños y los relojes parados. En la escalinata espera el escribano Lázaro Quintana, de levita, con el reloj en la mano; en la puerta, Remedios, el ama de llaves. Quintana quiere pasarlos derecho al comedor. Remedios quiere saber quién trae barro en las botas y quién trae otra cosa.",
      objetivo: "Entrar a la casa y medir a quienes los reciben antes de sentarse a su mesa.",
      vias: {
        combate: "Desenganchar y guardar el coche, cargar el equipaje, abrirse paso cuando el escribano quiere separarlos.",
        ingenio: "Fijarse en los relojes, los espejos tapados, los cubiertos puestos; revisar la cochera.",
        dialogo: "Tantear a Quintana, ganarse a Remedios, preguntar por la muerta.",
      },
      npcs: ["quintana", "remedios", "mateo", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "Quintana los hace pasar al comedor con una reverencia que le sale un poco corta. La mesa está puesta. Bajo cada plato asoma la punta de un papel doblado.",
      opcionesBase: [
        {
          id: "a",
          texto: "Meter el coche en la cochera y mirar qué más hay ahí",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "facil" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Fijarse en los relojes y los espejos de la entrada",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Preguntarle al ama de llaves cómo murió su señora",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "media" },
          avanza: true,
        },
      ],
      aperturaBase:
        "El portón de Casa Orbe está abierto. Detrás hay un caserón con todas las ventanas encendidas, como para una fiesta, y ni un ruido.\n\nEn la escalinata, un hombre de levita mira su reloj y después a ustedes.\n\n—Lázaro Quintana, escribano —dice—. Llegan con lo justo. Tengan la bondad de limpiarse las botas.\n\nEn la puerta, una vieja de negro con un manojo de llaves los cuenta con la vista, uno por uno, y no dice nada.",
      resumenBase:
        "Llegaron a Casa Orbe. Los recibieron el escribano Quintana, con apuro, y Remedios, el ama de llaves, con desconfianza. La mesa estaba puesta para ellos.",
    },
    {
      id: "cena",
      capitulo: 102,
      titulo: "La cena del escribano",
      lugar: "comedor",
      ambientacion:
        "El comedor grande de Casa Orbe: una mesa larga con un cubierto por cada nombre de la lista, candelabros, el retrato de Casilda Orbe tapado con un paño negro. Quintana preside, sirve él mismo el vino y lee un testamento: cada citado recibe una bolsa de plata si firma un papel antes del alba. Bajo cada plato hay un papel doblado, sin firma: un encargo nuevo. Remedios sirve la sopa y no le quita los ojos al escribano.",
      objetivo: "Averiguar qué dice de verdad el papel que hay que firmar y qué gana el escribano con eso.",
      vias: {
        combate: "Arrebatarle el testamento, plantarse cuando quiere apurar la firma, destapar el retrato.",
        ingenio: "Leer la letra chica del papel, comparar tintas, mirar qué hace Remedios con los ojos.",
        dialogo: "Tirarle de la lengua a Quintana con vino y halagos, regatear la herencia, hacerlo citar artículos hasta que se enrede.",
      },
      npcs: ["quintana", "remedios", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "Quintana deja el papel en el centro de la mesa, con un tintero y una sola pluma, y pone su reloj al lado. Dice que no hay apuro, y lo mira cada dos frases.",
      votoAlCerrar: "firma",
      opcionesBase: [
        {
          id: "a",
          texto: "Destapar el retrato que cuelga sobre la cabecera",
          enfoque: "combate",
          tirada: { atributo: "destreza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Leer la letra chica del papel antes de que lo retire",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Brindar con el escribano y preguntarle qué hereda él",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "dificil" },
          avanza: true,
        },
      ],
      aperturaBase:
        "El comedor es largo y frío a pesar de los candelabros. Hay un cubierto por cada uno, y nadie se equivocó en la cuenta.\n\nQuintana se sienta a la cabecera, debajo de un retrato tapado con un paño negro, y desdobla unos pliegos.\n\n—La finada fue generosa —dice—. Una bolsa de plata por cabeza. Una formalidad, una firma, y antes del alba cada cual sigue su camino.\n\nAl levantar el plato para la sopa, cada uno encuentra debajo un papel doblado. No tiene firma.",
      resumenBase:
        "En la cena, el escribano leyó un testamento: plata para cada uno a cambio de una firma antes del alba. Bajo cada plato había un encargo nuevo.",
    },
    {
      id: "despacho",
      capitulo: 102,
      titulo: "El despacho de Casilda",
      lugar: "despacho",
      ambientacion:
        "De madrugada, la casa en silencio. El despacho de Casilda Orbe: un escritorio enorme, estantes de libros de cuentas, un mapa del páramo con las postas marcadas. Está cerrado con llave y la llave la tiene Remedios, o la tiene Quintana. Adentro hay borradores de cartas, secantes, plumas. Por la ventana se ve el patio, y más allá del portón algo que se mueve en la bruma.",
      objetivo: "Entrar al despacho y entender para qué los citó Casilda de verdad.",
      vias: {
        combate: "Forzar la puerta o la ventana, mover el escritorio, cortarle el paso a quien viene por el pasillo.",
        ingenio: "Leer los borradores, calcar un secante, comparar la letra de los encargos con los papeles del escritorio.",
        dialogo: "Convencer a Remedios de prestar la llave, hacer hablar a la pasajera del velo, distraer al escribano.",
      },
      npcs: ["remedios", "viajera", "quintana"],
      meta: 2,
      tope: 3,
      cierre:
        "Tienen los borradores en la mano cuando se oye la tos de Remedios en la puerta. No los reta. Dice que lo que buscan no está ahí, que está en la capilla, con la señora, y que ella tiene la llave.",
      opcionesBase: [
        {
          id: "a",
          texto: "Forzar la puerta del despacho sin despertar a nadie",
          enfoque: "combate",
          tirada: { atributo: "destreza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Leer los borradores de cartas del escritorio",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Pedirle la llave a Remedios a cambio de una mano en la cocina",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "media" },
          avanza: true,
        },
      ],
      aperturaBase:
        "La casa se acuesta, o hace que se acuesta. En el pasillo del primer piso hay una sola puerta con cerradura de bronce: el despacho.\n\nPor debajo se cuela olor a tinta y a tabaco frío. Alguien estuvo adentro esta noche.\n\nEn la otra punta del pasillo se abre una puerta y se cierra. Unos pasos se alejan, parejos, de zapato fino.",
      resumenBase:
        "En el despacho encontraron los borradores de las cartas: Casilda los citó para saldar cuentas, no para dejarles herencia. Los encargos se escribieron en ese mismo escritorio.",
    },
    {
      id: "capilla",
      capitulo: 102,
      titulo: "El Libro de Deudas",
      lugar: "capilla",
      ambientacion:
        "La capilla de la casa, chica y helada. Casilda Orbe está enterrada bajo una lápida nueva, todavía sin fecha. Sobre el altar, Remedios pone lo que guardaba: el Libro de Deudas (el del cofre, si llegó; si no, el borrador, al que le faltan hojas). Tiene una página por pasajero. La pasajera del velo está presente y, si no lo hizo antes, acá se levanta el velo: es Irene, la hija. Afuera, los caballos de arreos negros esperan en el portón.",
      objetivo: "Abrir el Libro de Deudas y decidir qué se hace con lo que dice de cada uno.",
      vias: {
        combate: "Romper el candado del Libro o del cofre, trancar la capilla, impedir que alguien se lo lleve.",
        ingenio: "Buscar la propia página, leer el índice, notar la hoja cortada.",
        dialogo: "Preguntarle a Irene qué quiere hacer con la herencia, pactar con otro pasajero, pedirle a Remedios que cuente lo que falta.",
      },
      npcs: ["remedios", "viajera"],
      meta: 2,
      tope: 3,
      cierre:
        "El Libro queda abierto sobre el altar. Cada uno sabe ya que tiene una página ahí. Irene dice que es de ella por herencia y de ustedes por lo que dice, y que no lo va a decidir sola.",
      votoAlCerrar: "deudas",
      opcionesBase: [
        {
          id: "a",
          texto: "Romper el candado del Libro",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Buscar en el índice qué página es la propia",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Preguntarle a la hija de Casilda qué piensa hacer",
          enfoque: "dialogo",
          tirada: { atributo: "carisma", dificultad: "media" },
          avanza: true,
        },
      ],
      aperturaBase:
        "La capilla está al fondo del patio. Adentro hace más frío que afuera.\n\nHay una lápida nueva en el piso, con un nombre y sin fecha. Remedios la rodea sin pisarla y deja sobre el altar un libro grande, con candado.\n\n—Acá está todo lo que ella sabía de ustedes —dice—. Y de algunos más.\n\nLa mujer del velo se queda en la puerta. Afuera, del otro lado del portón, relincha un caballo que no es de la casa.",
      resumenBase:
        "En la capilla abrieron el Libro de Deudas: una página por pasajero. Falta una, cortada a navaja: la del escribano. La pasajera del velo es Irene Orbe, la hija.",
    },
    {
      id: "alba",
      capitulo: 102,
      titulo: "Antes de que aclare",
      lugar: "casaorbe",
      ambientacion:
        "La hora antes del alba, en el patio de Casa Orbe. Los cuatro Recaudadores están en el portón y no entran: esperan. Preguntan por Lázaro Quintana, por su nombre. El escribano perdió la compostura: quiere el coche enganchado ya, a todos adentro y camino al Paso. Mateo no engancha sin que alguien le diga a quién le hace caso. Irene está en la escalinata con las llaves de la casa. La lista del cochero anda de mano en mano.",
      objetivo: "Sacarle a Quintana por qué lo buscan y decidir con quién sale el coche.",
      vias: {
        combate: "Cerrarle el paso al escribano, sujetar a los caballos, sostener el portón.",
        ingenio: "Atar cabos: la tinta de la lista, la hoja cortada, a quién miran los jinetes y a quién no.",
        dialogo: "Apretar a Quintana hasta que confiese, preguntarles a los Recaudadores qué les deben, hablar con Irene.",
      },
      npcs: ["quintana", "viajera", "mateo", "remedios"],
      meta: 2,
      tope: 3,
      cierre:
        "Fin del capítulo. Quintana lo dice por fin, casi ofendido: una vez cruzó sin pagar, le dieron plazo, y el plazo vence en el Paso. Alguien tiene que no llegar, y él hizo la lista. El cielo empieza a aclarar. El coche está enganchado y hay que decidir quién sube.",
      votoAlCerrar: "alba",
      opcionesBase: [
        {
          id: "a",
          texto: "Plantarse entre el escribano y el coche",
          enfoque: "combate",
          tirada: { atributo: "fuerza", dificultad: "media" },
          avanza: true,
        },
        {
          id: "b",
          texto: "Fijarse a quién miran los jinetes del portón",
          enfoque: "ingenio",
          tirada: { atributo: "ingenio", dificultad: "media" },
          avanza: true,
        },
        {
          id: "c",
          texto: "Preguntarle a Quintana qué les debe a los del portón",
          enfoque: "dialogo",
          tirada: { atributo: "voluntad", dificultad: "dificil" },
          avanza: true,
        },
      ],
      aperturaBase:
        "Falta poco para el alba y el patio está lleno de gente despierta.\n\nEn el portón hay cuatro jinetes. No entran. Uno dice un nombre, sin levantar la voz, y el nombre es Lázaro Quintana.\n\nEl escribano baja la escalinata abrochándose mal la levita.\n\n—¡Cochero! ¡Enganche! ¡Salimos ya, todos, al Paso! —y, a ustedes, con una sonrisa que no le llega—: Es por el bien de la sucesión.\n\nMateo mira a los caballos, mira a los jinetes, y se sienta en el estribo a esperar que alguien le diga a quién le hace caso.",
      resumenBase:
        "Antes del alba, los Recaudadores vinieron a buscar al escribano. Quintana les debe un peaje viejo y armó la lista para pagarlo con uno de los pasajeros.",
    },
  );
}
