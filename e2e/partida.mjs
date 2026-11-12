// Partida completa con dos celulares simulados: sala, personajes, turnos con
// tirada, votos y cierre del capítulo. Verifica que los dos se mantengan en
// sincronía y que el secreto de uno no llegue al otro.
//
// Uso: con el servidor corriendo (`npm run dev`, mejor en modo local),
//   npm run e2e
// Variables: BASE (http://localhost:3000), CAPTURAS (carpeta de capturas),
// ESCALA (densidad de píxeles de las capturas).

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const SALIDA = process.env.CAPTURAS ?? './e2e/capturas';
const ESCALA = Number(process.env.ESCALA ?? 1);
const MAX_TURNOS = Number(process.env.MAX_TURNOS ?? 140);
mkdirSync(SALIDA, { recursive: true });

const navegador = await chromium.launch();
const movil = { viewport: { width: 390, height: 844 }, deviceScaleFactor: ESCALA, isMobile: true, hasTouch: true, locale: 'es-AR' };
const ctxA = await navegador.newContext(movil);
const ctxB = await navegador.newContext(movil);
const A = await ctxA.newPage();
const B = await ctxB.newPage();
const errores = [];
for (const [n, p] of [['A', A], ['B', B]]) {
  p.on('pageerror', (e) => errores.push(`${n} pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('401')) errores.push(`${n} console: ${m.text().slice(0, 200)}`); });
}
const foto = (p, nombre) => p.screenshot({ path: `${SALIDA}/${nombre}.png` });
process.on('uncaughtException', async (e) => { console.log(String(e).slice(0,400)); try { await foto(A,'error-A'); await foto(B,'error-B'); console.log('B hoja:', (await B.locator('.hoja-inferior').innerText().catch(()=> '(sin hoja)')).slice(0,300)); } catch {} process.exit(1); });
process.on('unhandledRejection', (e) => { throw e; });
const ok = (cond, msg) => { if (!cond) throw new Error(`FALLÓ: ${msg}`); console.log(`  ✓ ${msg}`); };

async function crearPersonaje(p, { nombre, raza, clase, rasgo, secreto, seña = 'Cicatriz', peinado = 'Trenza' }, prefijo) {
  await p.getByLabel('nombre', { exact: true }).fill(nombre);
  await p.getByRole('button', { name: new RegExp(raza) }).click();
  if (prefijo) await foto(p, `${prefijo}-paso1`);
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('button', { name: new RegExp(clase) }).click();
  if (prefijo) await foto(p, `${prefijo}-paso2`);
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('heading', { name: 'Su rostro' }).waitFor();
  await p.getByRole('button', { name: seña, exact: true }).click();
  await p.getByRole('button', { name: peinado, exact: true }).click();
  if (prefijo) await foto(p, `${prefijo}-paso2b-rostro`);
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('button', { name: rasgo, exact: true }).click();
  await p.getByLabel('Secreto').fill(secreto);
  if (prefijo) await foto(p, `${prefijo}-paso3`);
  await p.getByRole('button', { name: 'Seguir' }).click();
  if (prefijo) await foto(p, `${prefijo}-paso4`);
  await p.getByRole('button', { name: 'Así soy yo' }).click();
  await p.getByRole('heading', { name: 'Junto al fuego' }).waitFor();
}

console.log('1. Portada y sala');
await A.goto(BASE);
await A.getByRole('heading', { name: 'La Hora Trece' }).waitFor();
await A.waitForTimeout(600);
await foto(A, '01-portada');
await A.getByRole('button', { name: 'Abrir una sala nueva' }).click();
await A.waitForURL(/\/sala\/[A-Z0-9]{5}$/);
const codigo = A.url().split('/').pop();
ok(/^[A-Z0-9]{5}$/.test(codigo), `sala creada: ${codigo}`);

console.log('2. Personajes');
await crearPersonaje(A, { nombre: 'Aldric', raza: 'Enano de cripta', clase: 'Espada juramentada', rasgo: 'Valiente', secreto: 'Hui de un juramento y otra persona pagó por mí.' }, '02-personaje');
await foto(A, '03-espera');
await B.goto(BASE);
await B.getByLabel('Código de sala').fill(codigo.toLowerCase());
await B.getByRole('button', { name: 'Entrar', exact: true }).click();
await B.getByRole('button', { name: 'Entrar a la sala' }).click();
await crearPersonaje(B, { nombre: 'Mirta', raza: 'Mediano errante', clase: 'Juglar', rasgo: 'Lengua afilada', secreto: 'Este nombre se lo robé a una muerta.' });
await A.getByText('Mirta').first().waitFor({ timeout: 15000 });
ok(true, 'A ve el personaje de B sin recargar');
ok(!(await A.content()).includes('robé a una muerta'), 'el secreto de B no llega al celular de A');
await foto(A, '04-listos');

console.log('3. Apertura');
await A.getByRole('button', { name: 'Abrir el libro' }).click();
await A.getByText(/llevás el farol/).waitFor({ timeout: 30000 });
await B.getByText(/Aldric lleva el farol/).waitFor({ timeout: 30000 });
ok(true, 'los dos ven la primera escena y el farol en A');
await A.waitForTimeout(500);
await foto(A, '05-escena1-A');
await foto(B, '06-escena1-B');

console.log('4. Turnos');
let turnos = 0, votos = 0, capitulos = 1, fotoTirada = false, fotoVoto = false, fotoDado = false, libre = false;
const quieto = async (p) => { await p.getByText('El máster está narrando').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {}); };
for (;;) {
  if (turnos > MAX_TURNOS) throw new Error('demasiados turnos');
  await quieto(A); await quieto(B);
  await A.waitForTimeout(350);
  if (await A.getByText('Continuará…').isVisible().catch(() => false)) {
    // Fin de un capítulo: si hay otro, lo abre el segundo celular.
    const otro = B.getByRole('button', { name: /Empezar el capítulo/ });
    if (!(await otro.waitFor({ timeout: 8000 }).then(() => true, () => false))) break;
    ok(votos === capitulos * 3, `capítulo ${capitulos}: se resolvieron sus tres votaciones`);
    await foto(A, `11-fin-capitulo-${capitulos}`);
    await otro.click();
    await A.getByText('Continuará…').waitFor({ state: 'hidden', timeout: 30000 });
    await A.getByText(/llevás el farol|lleva el farol/).first().waitFor({ timeout: 40000 });
    ok(true, `los dos pasan al capítulo ${capitulos + 1}`);
    await quieto(A); await quieto(B);
    await A.waitForTimeout(600);
    await foto(A, `11b-capitulo-${capitulos + 1}`);
    capitulos++;
    continue;
  }

  if (await A.getByText('decisión de los dos').isVisible().catch(() => false)) {
    // En modo sondeo un celular puede tardar unos segundos en enterarse de que el voto ya cerró.
    if (await A.getByText('Votaste:').isVisible().catch(() => false)) { await A.waitForTimeout(1000); continue; }
    await B.getByText('decisión de los dos').waitFor({ timeout: 15000 });
    if (!fotoVoto) { await foto(A, '09-voto'); fotoVoto = true; }
    const titulo = await A.locator('.hoja-inferior button.pergamino .titulo').first().innerText();
    for (const p of [A, B]) {
      await p.locator('.hoja-inferior button.pergamino').first().click();
      await p.getByRole('button', { name: 'Votar', exact: true }).click();
    }
    votos++;
    console.log(`  voto ${votos}: ${titulo}`);
    await A.waitForTimeout(800);
    continue;
  }

  const seguir = A.getByRole('button', { name: 'Seguir la historia' });
  if (await seguir.isVisible().catch(() => false)) { await seguir.click(); continue; }

  const turnoDeA = await A.getByText(/llevás el farol/).isVisible().catch(() => false);
  const turnoDeB = await B.getByText(/llevás el farol/).isVisible().catch(() => false);
  if (!turnoDeA && !turnoDeB) { await A.waitForTimeout(700); turnos += 0.2; continue; }
  const P = turnoDeA ? A : B, O = turnoDeA ? B : A;
  turnos = Math.floor(turnos) + 1;

  if (turnos === 2 && !libre) {
    libre = true;
    await P.getByRole('button', { name: 'Otra cosa…' }).click();
    await P.getByLabel('Acción libre').fill('Le canto una copla a la posadera para que afloje la lengua');
    await foto(P, '07-accion-libre');
  } else {
    // el otro sugiere, el portador elige
    if (turnos === 1) {
      await O.locator('.hoja-inferior button.pergamino').nth(1).click();
    }
    await P.locator('.hoja-inferior button.pergamino').nth(turnos % 3).click();
  }
  await P.getByRole('button', { name: 'Hacerlo' }).click();
  const tirar = P.getByRole('button', { name: 'Tirar el dado' });
  const hayTirada = await tirar.waitFor({ timeout: 20000 }).then(() => true, () => false);
  if (hayTirada) {
    if (!fotoTirada) { await foto(P, '08-tirada'); await O.getByText(/tiene el dado en la mano/).waitFor({ timeout: 10000 }); await foto(O, '08b-tirada-espera'); fotoTirada = true; }
    if (turnos === 3) await P.getByRole('button', { name: /Invocar tu rasgo/ }).click().catch(() => {});
    await tirar.click();
    if (!fotoDado) { await P.waitForTimeout(1500); await foto(P, '08c-dado'); fotoDado = true; }
    // el dado del otro
    await O.getByRole('button', { name: 'Cerrar la tirada' }).waitFor({ timeout: 15000 }).catch(() => errores.push(`turno ${turnos}: el otro no vio el dado`));
  }
  await quieto(P);
  if (turnos === 4) { await P.waitForTimeout(3600); await foto(P, '10-historia'); }
}
console.log(`  ${Math.floor(turnos)} turnos, ${votos} votos`);
ok(capitulos === 3 && votos === 9, 'se jugaron los tres capítulos, con tres votaciones cada uno');
await A.waitForTimeout(500);
await foto(A, '11-fin');
await B.getByText('Continuará…').waitFor({ timeout: 15000 });
ok(true, 'B también ve el final');

console.log('5. Libro y resumen');
await A.getByRole('button', { name: /Abrir el libro: hoja/ }).click();
await A.waitForTimeout(400);
await A.getByRole('button', { name: 'Cambiar retrato' }).click();
await A.getByRole('button', { name: 'Sombrero', exact: true }).click();
await A.getByRole('button', { name: 'Sombrero', exact: true, pressed: true }).waitFor({ timeout: 10000 });
ok(true, 'A cambia su retrato con la partida empezada');
await foto(A, '12-hoja');
await A.getByRole('button', { name: 'Listo', exact: true }).click();
const pintar = A.getByRole('button', { name: /Pintar (mi|otro) retrato/ });
if (await pintar.isVisible().catch(() => false)) {
  await pintar.click();
  await A.getByRole('img', { name: 'Retrato de Aldric' }).and(A.locator('img')).waitFor({ timeout: 20000 });
  await B.locator('header img').first().waitFor({ timeout: 20000 });
  ok(true, 'el retrato pintado llega a los dos celulares');
  await foto(A, '12b-retrato-pintado');
}
await A.getByRole('tab', { name: 'Diario' }).click();
await foto(A, '13-diario');
await A.getByRole('tab', { name: 'Sala' }).click();
await foto(A, '14-sala');
await A.getByRole('button', { name: 'Cerrar', exact: true }).click();

console.log('6. Recarga y portada');
await B.reload();
await B.getByText('Continuará…').waitFor({ timeout: 15000 });
ok(true, 'B recarga y sigue en la partida');
await A.goto(BASE);
await A.getByText('partidas en este celular').waitFor();
ok(await A.getByText(codigo).isVisible(), 'la partida aparece guardada en la portada');
await foto(A, '15-portada-guardadas');

console.log('7. Tercer dispositivo');
const C = await (await navegador.newContext(movil)).newPage();
await C.goto(`${BASE}/sala/${codigo}`);
await C.getByText('La sala ya tiene a sus dos jugadores').waitFor({ timeout: 15000 });
ok(true, 'un tercero no puede entrar');
await foto(C, '16-sala-llena');

await navegador.close();
if (errores.length) { console.log('\nERRORES DE CONSOLA:'); for (const e of [...new Set(errores)]) console.log('  -', e); process.exitCode = 1; }
else console.log('\nSin errores de consola.');
