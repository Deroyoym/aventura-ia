# La Hora Trece

Juego de rol narrativo cooperativo para dos jugadores, con una IA como máster. Fantasía gótica, misterio y terror psicológico, pensado para jugar desde el celular.

> En Valdebruma suena cada noche una campanada que no existe. Y cada vez, alguien deja de haber existido.

Cada jugador entra con un código de sala, crea su personaje (raza, clase, un retrato armado por piezas, rasgo y un secreto que el otro no ve) y juegan por turnos. Hay tres capítulos, de 20 a 30 minutos cada uno: «La posada del Farol Tuerto», «Los Ausentes» y «Los Siete». Lo que se decide en uno pesa en el siguiente.

## Cómo se juega

- **El farol.** Quien lo lleva decide la acción del turno: una de las tres opciones del máster (acción, ingenio o diálogo) o algo escrito con sus palabras. El otro puede señalar una opción como sugerencia. Después de cada acción, el farol cambia de mano.
- **Tiradas.** d20 + atributo contra una dificultad (fácil 8, media 12, difícil 15, heroica 18). Hay éxito crítico, éxito, éxito con costo, fallo y pifia. El rasgo del personaje y el compañero animal dan ventaja.
- **Escenas.** Cada escena se resuelve juntando avances por cualquiera de las tres vías. Si se acaban los turnos, se resuelve igual, pero a un costo.
- **La Bruma.** Un medidor de amenaza de 0 a 10 que sube con los fallos y las malas decisiones. En 7 todo cuesta más; en 10 se tira con desventaja.
- **Decisiones de los dos.** El compañero animal, los dilemas y la mejora del refugio se votan. Si no coinciden dos veces, decide quien lleva el farol.
- **Entre capítulos.** Al cerrar un capítulo arreglan una cosa en la Casa del Guarda. Al empezar el siguiente descansan (vida completa, el rasgo se recupera) y esa mejora rinde: más vida, una pista, menos Bruma o vendas.
- **Intensidad del terror.** Suave, media o fuerte. Cualquiera de los dos puede bajarla en cualquier momento.

## Arquitectura

El servidor es la única autoridad: el navegador nunca escribe estado ni ve una clave.

```
app/api/salas/…          routes: crear sala, unirse, personaje, acción y turno (streaming)
lib/game/                reglas como funciones puras: tiradas, turnos, escenas, votos
lib/game/campana.ts      la campaña y sus capítulos, escritos a mano (solo servidor)
lib/dm/                  el máster: prompt, esquema JSON, streaming, reintentos
lib/server/              salas, asientos, almacén (Supabase o memoria) y Realtime
lib/client/              estado de la sala en el navegador
components/              la interfaz
```

**Un turno.** El jugador elige; el servidor guarda la acción y, si hace falta, tira el dado. Recién entonces llama a Gemini con el estado, la acción y el resultado ya resuelto. El modelo devuelve un JSON con la narración primero, que se transmite a los dos celulares mientras se escribe, y después los cambios propuestos (vida, pistas, relaciones, amenaza). El código valida y acota esos cambios antes de aplicarlos.

**Sincronía.** La fuente de verdad es el snapshot de la sala, filtrado para cada jugador (el secreto ajeno y los susurros privados del máster no salen del servidor). Supabase Realtime reparte la narración en vivo y avisa cuando cambia el estado; si el canal se cae, el navegador consulta el snapshot cada pocos segundos.

**Errores 429.** Las llamadas a Gemini se reintentan hasta cuatro veces con espera exponencial, respetando el `retryDelay` que indica la API. Como la tirada se guarda antes de narrar, un reintento nunca vuelve a tirar el dado. Si se agotó la cuota diaria, se corta con un mensaje claro; con `GEMINI_MODEL_RESPALDO` cargado, se sigue con ese modelo. Un turno nunca espera más de 100 s, y la causa de cada fallo queda en el log del servidor.

## Puesta en marcha

Requiere Node 22 o superior.

```bash
npm install
npm run dev
```

Sin variables de entorno arranca en **modo local**: narrador simulado y partidas en memoria. Alcanza para probar todo el flujo con dos pestañas.

Para usar los servicios reales, copiá `.env.example` a `.env.local` y completalo.

| Variable | Dónde se usa | Qué es |
|---|---|---|
| `GEMINI_API_KEY` | servidor | Clave de Google AI Studio |
| `GEMINI_MODEL` | servidor | Nombre del modelo Flash |
| `GEMINI_MODEL_RESPALDO` | servidor | Opcional: modelo al que se pasa si el principal se queda sin cuota o está saturado |
| `GEMINI_IMAGE_MODEL` | servidor | Opcional: modelo de imágenes que pinta el retrato de cada personaje. Requiere facturación |
| `SUPABASE_SECRET_KEY` | servidor | Clave secreta del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | navegador y servidor | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | navegador | Clave pública, solo para Realtime |

La base se crea con `supabase/migrations/0001_init.sql`. Las tablas tienen RLS activado y ninguna política: con la clave pública no se puede leer ni escribir nada.

En Vercel, si falta alguna variable la portada lo avisa en vez de caer al modo local.

## Comandos

```bash
npm run dev         # servidor de desarrollo
npm run build       # build de producción
npm test            # tests unitarios (vitest)
npm run typecheck   # tipos
npm run lint        # eslint
npm run e2e         # partida completa con dos celulares simulados (necesita el servidor corriendo)
```
