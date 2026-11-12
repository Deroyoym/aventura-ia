import "server-only";
import { COMPANEROS, MEJORAS, NOMBRE_ATRIBUTO } from "./contenido";
import type { CompaneroId, Lugar, Opcion, OpcionVoto, VotoId } from "./tipos";

// La campaña «La Hora Trece». Todo lo que está acá es contenido escrito a mano:
// el modelo improvisa la prosa, pero la estructura, las pistas y las
// consecuencias de los votos las fija el código.

export const CAMPANA = {
  titulo: "La Hora Trece",
  pueblo: "Valdebruma",
};

export interface CapituloDef {
  numero: number;
  titulo: string;
  /** Qué puede y qué no puede revelar el máster en este capítulo. */
  guia: string;
  /** Directiva para la narración que abre el capítulo. */
  apertura: string;
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

ARCO DE LA CAMPAÑA:
1. La posada del Farol Tuerto: descubrir que el pueblo olvida a su gente y que la campana y el Libro son la causa.
2. Los Ausentes: entrar en la bruma y encontrar a Lía.
3. Los Siete: la cripta de los fundadores y la firma raspada.
4. La Dama del Umbral: romper o renovar el pacto.

LOS SECRETOS DE LOS PERSONAJES: cada jugador escribió un secreto. Atalo al misterio sin forzarlo: alguien de su pasado puede ser un Ausente; la Dama puede conocer ese secreto y susurrarlo; un objeto del pueblo puede reconocerlos. Insinuá primero, por susurros privados. No lo reveles al otro jugador a menos que la escena lo pida de verdad o el propio jugador lo cuente.
`.trim();

export interface Npc {
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
];

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
];

export interface EfectosVoto {
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

/** Qué debe mostrar el máster cuando la amenaza cruza cada umbral. */
export const EVENTOS_AMENAZA: Record<number, string> = {
  4: "La amenaza cruzó 4: la Bruma se cuela. Mostrá una señal inquietante y concreta en la escena (algo fuera de lugar, un sonido que no corresponde).",
  7: "La amenaza cruzó 7: la Bruma aprieta. Hacé aparecer brevemente a un Ausente (figura sin rostro) o una manifestación directa; el pueblo se vuelve hostil al forastero.",
  10: "La amenaza llegó a 10: la Bruma está adentro. La Dama del Umbral repara en los personajes; uno de ellos escucha su propio nombre dicho con la voz de alguien que perdió.",
};

/** Índices de las escenas de un capítulo dentro de la lista completa. */
export const escenasDe = (capitulo: number): number[] =>
  ESCENAS.flatMap((s, i) => (s.capitulo === capitulo ? [i] : []));

export const esUltimaDelCapitulo = (indice: number): boolean =>
  ESCENAS[indice + 1]?.capitulo !== ESCENAS[indice]?.capitulo;

export const pistasDe = (capitulo: number): Pista[] =>
  PISTAS.filter((p) => ESCENAS[p.escena]?.capitulo === capitulo);

export const hayCapitulo = (numero: number): boolean => CAPITULOS.some((c) => c.numero === numero);

export const escenaDef = (indice: number): EscenaDef => {
  const e = ESCENAS[indice];
  if (!e) throw new Error(`Escena inexistente: ${indice}`);
  return e;
};

export const npcDef = (id: string): Npc | undefined => NPCS.find((n) => n.id === id);
export const pistaDef = (id: string): Pista | undefined => PISTAS.find((p) => p.id === id);
