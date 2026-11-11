import { COMPANEROS, MEJORAS, NOMBRE_ATRIBUTO } from "./contenido";
import type { CompaneroId, Lugar, Opcion, OpcionVoto, VotoId } from "./tipos";

// La campaña «La Hora Trece». Todo lo que está acá es contenido escrito a mano:
// el modelo improvisa la prosa, pero la estructura, las pistas y las
// consecuencias de los votos las fija el código.

export const CAMPANA = {
  titulo: "La Hora Trece",
  pueblo: "Valdebruma",
};

export const CAPITULO_1 = {
  numero: 1,
  titulo: "La posada del Farol Tuerto",
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
- Giro reservado para más adelante (NO lo reveles en el capítulo 1): la Peste Gris nunca fue una enfermedad; era la propia Dama. Uno de los siete fundadores lo sabía.

ARCO DE LA CAMPAÑA:
1. La posada del Farol Tuerto: descubrir que el pueblo olvida a su gente y que la campana y el Libro son la causa.
2. Los Ausentes: entrar en la bruma y encontrar a Lía.
3. Los Siete: la cripta de los fundadores y la firma raspada.
4. La Dama del Umbral: romper o renovar el pacto.

En el capítulo 1 NO reveles quién es la Dama ni el origen del pacto. Sí pueden descubrir que la gente es borrada, que Anselmo escribe los nombres y que la campana suena sola.

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
    guia: "Flaco, callado, observador. Es el único que recuerda a su hermana Lía y ya aprendió a no decirlo. Confía en los animales más que en la gente. Habla poco y en frases cortas.",
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
];

export interface EscenaDef {
  id: string;
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
];

export interface EfectosVoto {
  amenaza?: number;
  relaciones?: Record<string, number>;
  vidaMax?: number;
  companero?: CompaneroId;
  mejora?: string;
  memoria?: string;
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

export const escenaDef = (indice: number): EscenaDef => {
  const e = ESCENAS[indice];
  if (!e) throw new Error(`Escena inexistente: ${indice}`);
  return e;
};

export const npcDef = (id: string): Npc | undefined => NPCS.find((n) => n.id === id);
export const pistaDef = (id: string): Pista | undefined => PISTAS.find((p) => p.id === id);
