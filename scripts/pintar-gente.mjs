// Pinta los retratos de los personajes del máster y los deja en public/gente.
// Se corre a mano, una vez; las imágenes se versionan con el repo.
//
// Uso: GEMINI_API_KEY=… node scripts/pintar-gente.mjs [id …]

import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const MODELO = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";
const SALIDA = "public/gente";
const LADO = 256;
const MARGEN = 0.06;

const ESTILO =
  "Ilustración de libro de cuentos gótico, pintada a tinta y acuarela con trazo visible. Retrato de busto, en tres cuartos, centrado, con la cabeza completa dentro del cuadro. Paleta nocturna de azules y ciruelas; una luz cálida de vela, fuera del cuadro, ilumina la cara. Imagen cuadrada a sangre: el fondo azul noche con bruma llega pintado hasta los cuatro bordes y las cuatro esquinas. Sin borde blanco, sin papel a la vista, sin recorte circular. Sin texto, sin marco, sin firma. Es un personaje de ficción, no una persona real.";

const GENTE = {
  brigida:
    "Una posadera de unos cincuenta años, robusta, de cara ancha y colorada, cejas arqueadas y media sonrisa burlona. Pelo gris recogido bajo un pañuelo, delantal manchado, un trapo al hombro.",
  tobias:
    "Un niño de diez años, flaco, serio y observador, de pelo castaño revuelto con paja, camisa grande remendada. Mira de reojo, con desconfianza.",
  corvino:
    "Un alguacil de unos cuarenta y cinco años, rígido y ojeroso, bigote entrecano, capa oscura con broche de metal y sombrero de ala. Sostiene una linterna sorda que apenas se ve en el borde.",
  anselmo:
    "Un sacerdote anciano, muy delgado, de ojos cansados y enrojecidos por el insomnio, pelo blanco ralo, sotana negra gastada. Tiene manchas de tinta en los dedos de la mano que lleva al pecho.",
  guarda:
    "No hay persona: una silla de madera vacía junto a una mesa con un plato de sopa humeante y una vela. En el vapor que sube del plato se adivina apenas el perfil de un hombre mayor con gorra.",
  ursula:
    "Una tejedora muy vieja y ciega, de ojos blanquecinos, cara llena de arrugas y expresión pícara. Mantón de lana gris, pelo blanco en rodete, y entre los dedos un hilo rojo con nudos.",
  lia:
    "Una niña de doce años, de trenza oscura y vestido sencillo, valiente y seria. La mitad izquierda de su cara está nítida; la otra mitad se deshace suavemente en bruma clara.",
  mateo:
    "Un cochero de diligencia de unos cincuenta años, flaco, narigón, de bigote caído y expresión charlatana. Bufanda larga de lana, sombrero de ala gastado, capote con esclavina. Asoma un papel doblado en el bolsillo del pecho.",
  viajera:
    "Una mujer joven de luto riguroso: vestido negro de cuello alto, guantes negros y un velo negro translúcido que le cubre toda la cara, de modo que apenas se adivinan los rasgos. Muy derecha, quieta.",
  elias:
    "Un ventero viejo y ciego, de barba blanca corta, ojos cerrados y la cabeza apenas ladeada, como quien escucha. Chaleco de lana, camisa arremangada, manos grandes.",
  quintana:
    "Un escribano de unos cincuenta años, pulcro y algo pomposo: pelo oscuro peinado con raya y pomada, patillas, anteojos redondos chicos, levita gris oscura impecable con cuello duro. Sostiene un reloj de bolsillo con cadena. Sonrisa cortés que no le llega a los ojos.",
  remedios:
    "Un ama de llaves de unos setenta años, delgada y seca, de expresión severa y ojos atentos. Vestido negro de cuello cerrado, pelo blanco tirante en rodete, y un gran manojo de llaves antiguas colgado de la cintura, que sostiene con una mano.",
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
mkdirSync(SALIDA, { recursive: true });

async function pintar(id) {
  const r = await ai.models.generateContent({
    model: MODELO,
    contents: `${ESTILO}\n\nRetratado: ${GENTE[id]}`,
    config: { responseModalities: [Modality.IMAGE], imageConfig: { aspectRatio: "1:1" } },
  });
  const dato = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!dato) throw new Error(`${id}: el modelo no devolvió imagen`);
  const cruda = sharp(Buffer.from(dato, "base64"));
  const { width = 0, height = 0 } = await cruda.metadata();
  const mx = Math.round(width * MARGEN);
  const my = Math.round(height * MARGEN);
  await cruda
    .extract({ left: mx, top: my, width: width - 2 * mx, height: height - 2 * my })
    .resize(LADO, LADO, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(`${SALIDA}/${id}.webp`);
  console.log(`✓ ${id}`);
}

const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(GENTE);
const fallos = (await Promise.allSettled(pedidos.map(pintar))).filter((x) => x.status === "rejected");
for (const f of fallos) console.log("✗", String(f.reason).slice(0, 300));
process.exitCode = fallos.length ? 1 : 0;
