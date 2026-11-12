// Pinta las ilustraciones de cada lugar con el modelo de imágenes de Gemini y
// las deja en public/escenas. Se corre a mano, una vez; las imágenes se
// versionan con el repo.
//
// Uso: GEMINI_API_KEY=… node scripts/pintar-escenas.mjs [lugar …]
// Variables: GEMINI_IMAGE_MODEL (por defecto, el modelo de mayor calidad).

import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const MODELO = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";
const SALIDA = "public/escenas";
const ANCHO = 960;
const ALTO = 570;
const MARGEN = 0.06;

const ESTILO =
  "Ilustración de libro de cuentos gótico, pintada a tinta y acuarela con trazo visible y textura de papel. Paleta nocturna de azules medianoche y ciruelas, con acentos cálidos de luz de vela en ámbar. Bruma baja. Composición apaisada y rectangular, con el motivo principal en el centro y cielo o pared oscura arriba. Imagen a sangre: la pintura oscura cubre todo el rectángulo hasta los cuatro bordes y las cuatro esquinas, sin papel blanco a la vista y sin recorte en arco ni viñeta. Sin texto, sin letras, sin marco, sin firma, sin borde blanco. Las personas, si aparecen, son siluetas pequeñas y lejanas, sin rostro visible.";

const LUGARES = {
  posada:
    "Noche de tormenta en un pueblo en el fondo de un valle. Una posada de piedra y madera de dos plantas, con un único farol encendido colgado sobre la puerta y ventanas con luz cálida. Lluvia, charcos que reflejan la luz, techos de pizarra alrededor.",
  cuarto:
    "Interior de un cuarto chico de posada, abandonado y cubierto de polvo: una cama angosta, un caballito de madera en el piso, un vestido de niña colgado de un clavo, una ventana por la que entra luz de luna azul. Una sola vela encendida sobre una mesita.",
  plaza:
    "Plaza empedrada de un pueblo antiguo, de noche y vacía, con un aljibe en el centro, faroles apagados y casas con los postigos cerrados. Al fondo, la silueta de una iglesia con campanario. En el borde de la plaza, la niebla es espesa y dentro se adivinan figuras quietas.",
  campanario:
    "Una torre de iglesia con campanario vista desde abajo contra una luna grande y velada. En el arco de arriba cuelga una campana oscura y brilla la luz de una sola vela. Pájaros negros en el cielo, techos del pueblo abajo, niebla.",
  refugio:
    "Amanecer gris y rosado sobre una casa de piedra solitaria y algo venida abajo, al borde de un bosque con niebla. Sale un hilo de humo de la chimenea y hay una ventana con luz cálida. Un sendero llega hasta la puerta.",
  linde:
    "La última casa de un pueblo, baja, con un banco en el umbral y un espino retorcido al lado. Atardecer. Justo detrás de la casa se levanta una pared de niebla densa. Un hilo rojo sale del umbral y se pierde dentro de la niebla.",
  bruma:
    "Dentro de una niebla espesa y azulada, un sendero entre árboles pelados. Un hilo rojo tenso cruza la imagen y se pierde hacia adelante. A lo lejos, muy tenues, luces cálidas de ventanas que no deberían estar ahí.",
  espejo:
    "Una calle de pueblo antiguo dentro de la niebla, extrañamente acogedora: todas las ventanas están encendidas con luz cálida y se ven mesas servidas adentro. La calle se refleja en el empedrado mojado como en un espejo. Siluetas quietas en los umbrales.",
  cripta:
    "Una cripta de piedra bajo una iglesia: una fila de siete nichos de piedra, seis abiertos con una vela encendida adentro y uno cerrado y liso. Escalera que baja desde arriba, humedad, bruma a ras del suelo.",
  umbral:
    "Una sala subterránea redonda de piedra lisa. En el centro, un marco de puerta de piedra sin pared alrededor, lleno de niebla clara que se mueve como una cortina. Alrededor, seis asientos de piedra vacíos. Una vela en el piso.",
  trece:
    "Interior de un campanario de noche: una gran campana de bronce colgada de una viga, con una soga que baja hasta el piso, parte de ella empalmada con hilo rojo. Por los arcos abiertos entra niebla y se ve la luna. La niebla rodea, sin tocarlo, un espacio vacío junto a una silla de madera.",
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
mkdirSync(SALIDA, { recursive: true });

async function pintar(lugar) {
  const r = await ai.models.generateContent({
    model: MODELO,
    contents: `${ESTILO}\n\nEscena: ${LUGARES[lugar]}`,
    config: { responseModalities: [Modality.IMAGE], imageConfig: { aspectRatio: "16:9" } },
  });
  const dato = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!dato) throw new Error(`${lugar}: el modelo no devolvió imagen`);
  // El modelo suele dejar un filete de papel en los bordes: se recorta.
  const cruda = sharp(Buffer.from(dato, "base64"));
  const { width = 0, height = 0 } = await cruda.metadata();
  const mx = Math.round(width * MARGEN);
  const my = Math.round(height * MARGEN);
  await cruda
    .extract({ left: mx, top: my, width: width - 2 * mx, height: height - 2 * my })
    .resize(ANCHO, ALTO, { fit: "cover", position: "centre" })
    .webp({ quality: 78 })
    .toFile(`${SALIDA}/${lugar}.webp`);
  console.log(`✓ ${lugar}`);
}

const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LUGARES);
const fallos = (await Promise.allSettled(pedidos.map(pintar))).filter((x) => x.status === "rejected");
for (const f of fallos) console.log("✗", String(f.reason).slice(0, 300));
process.exitCode = fallos.length ? 1 : 0;
