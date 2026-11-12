// «El Último Coche» con cuatro celulares simulados: sala, cuatro personajes,
// rondas en las que actúan todos antes de la narración y un voto por mayoría.
//
// Uso: con el servidor corriendo en modo local, `node e2e/coche.mjs`.
// Variables: BASE, CAPTURAS, ESCALA.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const SALIDA = process.env.CAPTURAS ?? './e2e/capturas';
const ESCALA = Number(process.env.ESCALA ?? 1);
mkdirSync(SALIDA, { recursive: true });

const navegador = await chromium.launch();
const movil = { viewport: { width: 390, height: 844 }, deviceScaleFactor: ESCALA, isMobile: true, hasTouch: true, locale: 'es-AR' };
const NOMBRES = ['Aldric', 'Mirta', 'Bruno', 'Selma'];
const paginas = [];
const errores = [];
for (const n of NOMBRES) {
  const p = await (await navegador.newContext(movil)).newPage();
  p.on('pageerror', (e) => errores.push(`${n} pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/401|409/.test(m.text())) errores.push(`${n} console: ${m.text().slice(0, 200)}`); });
  paginas.push(p);
}
const [A] = paginas;
const foto = (p, nombre) => p.screenshot({ path: `${SALIDA}/coche-${nombre}.png` });
const ok = (cond, msg) => { if (!cond) throw new Error(`FALLÓ: ${msg}`); console.log(`  ✓ ${msg}`); };
process.on('unhandledRejection', async (e) => { console.log(String(e).slice(0, 500)); for (const [i, p] of paginas.entries()) await foto(p, `error-${i + 1}`).catch(() => {}); process.exit(1); });

async function crearPersonaje(p, nombre, secreto) {
  await p.getByLabel('nombre', { exact: true }).fill(nombre);
  await p.getByRole('button', { name: /Humano/ }).click();
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('button', { name: /Juglar/ }).click();
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('heading', { name: 'Su rostro' }).waitFor();
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('button', { name: 'Valiente', exact: true }).click();
  await p.getByLabel('Secreto').fill(secreto);
  await p.getByRole('button', { name: 'Seguir' }).click();
  await p.getByRole('button', { name: 'Así soy yo' }).click();
  await p.getByRole('heading', { name: 'Junto al fuego' }).waitFor();
}

console.log('1. Sala de El Último Coche');
await A.goto(BASE);
await A.getByRole('button', { name: /El Último Coche/ }).click();
await A.getByRole('heading', { name: 'El Último Coche' }).waitFor();
await A.waitForTimeout(800);
await foto(A, '01-portada');
await A.getByRole('button', { name: 'Abrir una sala nueva' }).click();
await A.waitForURL(/\/sala\/[A-Z0-9]{5}$/);
const codigo = A.url().split('/').pop();
await crearPersonaje(A, NOMBRES[0], 'Le debo a Casilda Orbe una carta que nunca contesté.');
ok(await A.getByRole('button', { name: 'Abrir el libro' }).isDisabled(), 'con un solo personaje no se puede empezar');

for (const [i, p] of paginas.entries()) {
  if (i === 0) continue;
  await p.goto(`${BASE}/sala/${codigo}`);
  await p.getByRole('button', { name: 'Entrar a la sala' }).click();
  await crearPersonaje(p, NOMBRES[i], `Secreto número ${i + 1} que nadie más debe leer.`);
}
await A.getByText('Selma').first().waitFor({ timeout: 20000 });
await foto(A, '02-espera');
ok(!(await A.content()).includes('Secreto número'), 'los secretos ajenos no llegan al celular de A');

console.log('2. Apertura');
await A.getByRole('button', { name: 'Abrir el libro' }).click();
await A.getByText(/llevás el farol/).waitFor({ timeout: 40000 });
await A.waitForTimeout(600);
await foto(A, '03-escena1');

console.log('3. Rondas');
const quieto = async (p) => { await p.getByText('El máster está narrando').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {}); };
const cerrarDados = async () => { for (const p of paginas) await p.getByRole('button', { name: 'Cerrar la tirada' }).click({ timeout: 300 }).catch(() => {}); };
let acciones = 0, votos = 0, fotoRonda = false, fotoVoto = false;
for (let vueltas = 0; vueltas < 400 && votos < 1; vueltas++) {
  await cerrarDados();
  await quieto(A);
  if (await A.getByText('decisión de la mesa').isVisible().catch(() => false)) {
    if (!fotoVoto) { await foto(A, '06-voto'); fotoVoto = true; }
    // Tres votan la segunda opción y uno la primera: gana la mayoría.
    for (const [i, p] of paginas.entries()) {
      await p.getByText('decisión de la mesa').waitFor({ timeout: 20000 });
      await p.locator('.hoja-inferior button.pergamino').nth(i === 0 ? 0 : 1).click();
      await p.getByRole('button', { name: 'Votar', exact: true }).click();
      if (i === 1) { await A.getByText(/Faltan:/).waitFor({ timeout: 15000 }); await foto(A, '07-voto-faltan'); }
    }
    votos++;
    continue;
  }
  const seguir = A.getByRole('button', { name: 'Seguir la historia' });
  if (await seguir.isVisible().catch(() => false)) { await seguir.click(); continue; }

  let P = null;
  for (const p of paginas) if (await p.getByText(/llevás el farol/).isVisible().catch(() => false)) { P = p; break; }
  if (!P) { await A.waitForTimeout(600); continue; }
  await P.locator('.hoja-inferior button.pergamino').nth(acciones % 3).click();
  await P.getByRole('button', { name: 'Hacerlo' }).click();
  const tirar = P.getByRole('button', { name: 'Tirar el dado' });
  if (await tirar.waitFor({ timeout: 20000 }).then(() => true, () => false)) await tirar.click();
  acciones++;
  await P.waitForTimeout(900);
  await cerrarDados();
  if (acciones === 2 && !fotoRonda) {
    const otra = paginas.find((p) => p !== P);
    await otra.getByText(/Van 2 de 4/).waitFor({ timeout: 15000 });
    ok(!(await A.getByText('El máster está narrando').isVisible().catch(() => false)), 'con dos acciones de cuatro el máster todavía no narra');
    await foto(otra, '04-ronda-a-medias');
    fotoRonda = true;
  }
  if (acciones === 4) { await quieto(A); await A.waitForTimeout(3500); await cerrarDados(); await foto(A, '05-ronda-narrada'); }
}
ok(acciones >= 4 && acciones % 4 === 0, `se jugaron rondas completas (${acciones} acciones)`);
ok(votos === 1, 'la mesa votó por mayoría');
await A.getByText(/Se levantó el velo|Dice llamarse Irene/).first().waitFor({ timeout: 30000 });
ok(true, 'ganó la opción de la mayoría, no la del primer jugador');

console.log('4. Encargo secreto');
await quieto(A);
await cerrarDados();
await A.getByRole('button', { name: /Abrir el libro: hoja/ }).click();
await A.getByText('encargo (solo vos lo ves)').waitFor({ timeout: 10000 });
await foto(A, '08-hoja-encargo');
ok(true, 'cada jugador ve su encargo en la hoja');

await navegador.close();
if (errores.length) { console.log('\nERRORES DE CONSOLA:'); for (const e of [...new Set(errores)]) console.log('  -', e); process.exitCode = 1; }
else console.log('\nSin errores de consola.');
