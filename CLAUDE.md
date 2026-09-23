# website — Trabix Granizados

Sitio de marketing de **www.trabixgranizados.xyz**, desplegado en Vercel. En rediseño total
(decidido 2026-09-22): pasa de HTML plano a **Astro**, de la estética actual (12 colores de acento,
glassmorphism) a algo **minimalista y mobile-first**, y gana una pieza nueva que no es marketing
sino operación: la **carta interactiva**.

Lee `ROADMAP.md` junto con este archivo al iniciar sesión.

## Stack

- **Astro 7** (estático, sin adapter) + Tailwind v4 (`@tailwindcss/vite`) + Vercel.
- **Capa de movimiento aditiva**: GSAP 3.15 + ScrollTrigger + SplitText + Lenis 1.3.26, instalados
  por npm y empaquetados por Vite — **mismo origen, nunca un CDN**. Un CDN bloqueado tumbaba la
  capa entera en elipsis sin dejar rastro; el bundle propio resuelve eso sin copiar `.min.js` a
  mano. Patrón tomado de `~/Desktop/growup/elipsis` y sistematizado en la skill `web-motion`.
- Tier 2 (motion editorial). **Sin Three.js**: su gate `affordsWebGL()` devuelve false bajo 900px y
  acá el tráfico objetivo es celular casi entero, así que serían ~120 KB que nadie llega a ver.
- Sin base de datos propia. Los datos dinámicos (sabores disponibles) los sirve `crm-app`.

```
src/
├── layouts/Base.astro       shell + contrato de fallo de la animación
├── components/              Header, Footer, Carta, PhoneChat
├── lib/                     motion.js · carta.ts · whatsapp.ts
├── data/carta.json          fallback horneado del catálogo
├── assets/                  láminas de producto y fotos reales (optimizadas por Astro)
└── pages/                   index · carta · retail · volumen · alianzas
```

## El sistema de diseño en una frase

**La página es neutra y el color lo ponen los granizados.** Las láminas de producto son
ilustraciones a sangre, saturadas y opacas (485×650); si la interfaz también grita, compiten y no
gana ninguna. De ahí sale todo lo demás: un solo acento (`--color-berry`, el berry de marca bajado
de saturación), neutros fríos, y las fotos como único punto de color.

Reglas que no se rompen porque ya están puestas:
- **Un acento, todo el sitio.** Nada de un CTA azul en la sección 7.
- **Un solo juego de radios**: interactivo = pill, superficies = 20px, chips = 10px.
- **Una sola curva**: `--ease-out-soft`. Nada de `ease-in-out`.
- **Una etiqueta por intención.** "Ver carta" es "Ver carta" en todas partes; en `/carta/` el CTA
  del header cambia a "Escribir" porque mandar a la carta desde la carta es un botón muerto.

## La regla que no se rompe: el contenido nunca depende de la animación

Heredada de `elipsis` y obligatoria acá. Un script inline pone `.js` en `<html>` y arma un timeout;
la capa de movimiento lo cancela al arrancar. Si GSAP no carga, si un script revienta, o si el
visitante tiene `prefers-reduced-motion`, se quita `.js` y todo lo pre-oculto vuelve a ser visible.
Solo se pre-oculta lo que está sobre el pliegue.

`prefers-reduced-motion` **no** significa "sin animación": entra en modo calm — se conservan los
fundidos de opacidad y se caen translate, scale, rotate, parallax, smooth-scroll y bucles infinitos.

Esto importa el doble acá que en un sitio normal: **la carta se abre desde un celular ajeno, en un
evento, con datos móviles malos.** Una carta que no renderiza es una venta perdida en persona.

## La carta interactiva

Reemplaza la carta física. Se reparte por **NFC + QR** (híbrido: QR impreso, chip NFC detrás de la
misma etiqueta, ambos al mismo destino).

**La tag NFC nunca lleva la URL final hardcodeada.** Lleva una ruta corta controlada
(`trabixgranizados.xyz/c`) que redirige desde `vercel.json`. Así el destino se cambia sin recomprar
ni reprogramar tags. NTAG213 basta de sobra para una URL; NTAG215 sobra.

La carta no tiene checkout. Termina en un CTA de WhatsApp con la selección precargada en el mensaje
— el pedido se cierra en el bot, nunca en la web (ver "Por qué no hay carrito" abajo).

## Fuente de verdad de los sabores: `crm-app`, no este repo

**Decisión del 2026-09-22.** Hoy el catálogo vive hardcodeado en
`../trabix-bot/config/messages.toml` (8 con licor, 4 sin licor) y cambiar un sabor exige un
redeploy de Rust. No existe tabla `products` ni en el bot ni en `crm-app`.

El modelo acordado es **una tabla `flavor` en el Postgres de Railway**, administrada desde un panel
en `crm-app`, con dos consumidores:

```
crm-app /settings/sabores  ──►  Postgres (Railway)  ──┬──► trabix-bot   (SQL directo, SQLx)
                                                      └──► crm-app /api/carta.json ──► carta (Vercel)
```

**El bot no consume HTTP.** `trabix-bot` y `crm-app` comparten el **mismo Postgres físico**
(`crm-app/CLAUDE.md` §"dos capas de acceso"), así que el bot lee la tabla por la conexión que ya
tiene. Nada de endpoint interno, secreto compartido ni un modo de fallo nuevo entre servicios.

El website sí necesita HTTP porque vive en Vercel, fuera de Railway. Consume una sola URL
(`/api/carta.json`) con un fallback horneado en el build, para que la carta nunca salga vacía si
`crm-app` no responde — se abre desde un celular ajeno en un evento, con datos móviles malos.

Campos de la tabla: `flavor_id`, `nombre`, `nombre_base`, `tipo` (con/sin licor), `descripcion`,
`foto_url`, `activo`, `orden`. Las fotos que se suban desde el panel van a un **bucket de Railway**,
en el mismo proyecto que el Postgres y `crm-app`.

Samuel apaga un sabor desde el panel en su iPhone y desaparece de la carta **y** del bot, sin
deploy de nada.

### Dos trampas que arrastra mover los sabores a la BD

**1. El panel no puede tener "Eliminar", solo "Desactivar".**
`trabix-bot/migrations/003_create_order_items.sql` define `order_items.flavor` como `VARCHAR(50)`
guardando el `flavor_id` (`liquor_uva_vodka`). Todo pedido histórico apunta ahí y no hay foreign
key. Borrar un sabor deja huérfanos los pedidos viejos y rompe `/ventas` y los reportes. Soft
delete siempre (`activo = false`).

**2. Sabores dinámicos rompen la protección anti-alucinación del bot.**
`trabix-bot/src/ai/tools.rs` tiene `AMBIGUOUS_GROUPS` **hardcodeado**: los 4 nombres base que
existen en dos variantes (Maracumango, Manzana verde, Bonbonbum, Blueberry) obligan al bot a
preguntar cuál quiere el cliente antes de meterlo al pedido. Es el parche del incidente del
2026-07-19, donde el modelo adivinaba la variante en silencio.

Un sabor nuevo agregado desde el panel **no queda cubierto por esa lista**. Agregar "Mango" sin
licor y luego "Mango Ron" reintroduce el bug exacto. Por eso el panel pide `nombre_base` y el
agrupamiento se calcula **en runtime desde la BD**, no se escribe en Rust. Al tocar este circuito,
verificar que la desambiguación siga siendo determinista — es código, nunca prompt.

Cambio de comportamiento en el bot que viene con esto: hoy manda una **imagen** de menú
(`menu_image_caption` en `messages.toml`) — pasa a mandar el **link de la carta**, y a listar los
sabores en el mismo mensaje cuando pregunten por el menú o los sabores.

**Mientras la fase 2 no exista, la carta y el bot son dos catálogos distintos** y la carta puede
prometer un sabor que el bot no ofrece. Es la misma clase de desincronización que ya duró una semana
con las reglas de domicilio (ver `ROADMAP.md`). Diseñar la carta contra una sola URL desde el día
uno, para que cambiar la fuente sea cambiar la URL y nada más.

## Por qué no hay carrito ni chatbot web

Decidido el 2026-07-30 y sigue vigente — **no reabrir sin datos**:

- **Se perdería el teléfono.** El modelo financiero descansa en la tasa de recompra; WhatsApp deja
  número e hilo persistente, un visitante web es anónimo.
- Los anuncios de Meta son **click-to-WhatsApp y no pasan por la web**.
- **Rompería la atribución**: el `ctwa_clid` existe porque es WhatsApp.

La consecuencia de diseño: **cada página empuja a WhatsApp con un mensaje distinto según dónde
está el visitante.** No es un `wa.me` pelado repetido cuatro veces.

| Página | Mensaje precargado |
|---|---|
| Home + `retail/` | "Hola, quiero pedir granizados" |
| `volumen/` | "Hola, quiero cotizar granizados por mayor" |
| `alianzas/` | "Hola, me interesa el modelo de alianzas de Trabix" |
| Carta | el mismo, más los sabores seleccionados |

El `href` estático debe traer el texto precargado **además** de la hidratación por JS, para que
funcione si el JS falla.

## El sitio nunca promete algo que el bot no cumple

Regla de oro heredada. Precios, mínimos y reglas de domicilio se actualizan **después** de que el
bot esté desplegado con el cambio, nunca antes. Y se verifica el HTML de verdad, no el ROADMAP —
ya pasó que el ROADMAP decía "HECHO" y el copy nunca mencionó el Grupo B.

Reglas vigentes que el copy debe respetar: domicilio gratis **solo en Armenia, 6–19 unidades**;
**sin licor es solo mayorista, mínimo 20 u**; envío nacional llega **descongelado** y hay que
decirlo explícitamente.

## Contenido prohibido

- **Nunca publicar el costo real por unidad** ($2.000) ni nada de `../MODELO NEGOCIO/`. A los
  vendedores se les presenta un costo percibido distinto.
- El **programa de embajadores no está corriendo**: ningún CTA puede depender de que existan
  embajadores activos.
- `alianzas/` es la cara pública del modelo de inversión, que está **pausado**. Si alguien llega por
  ahí no hay onboarding detrás.

## `brand_identity.md` quedó obsoleto con este rediseño

`../brand_identity.md` fue extraído **del CSS actual** — documenta los 12 acentos y el
glassmorphism que el rediseño elimina. Es salida del rediseño, no entrada: **reescribirlo cuando la
paleta minimalista nueva esté definida**, no usarlo como referencia mientras tanto.

Lo único que sobrevive sin discusión son las fotos reales de `site-assets/real-life/` y
`site-assets/products/` — generar confianza con imágenes propias es el objetivo declarado del
rediseño.

## Convenciones

- `CHANGELOG.md` + SemVer en cada cambio publicado (skill `commit`).
- **`<!DOCTYPE html>` en la primera línea siempre.** Sin él el navegador entra en quirks mode y el
  scroller pasa a ser `document.body`, que es justo lo que ScrollTrigger y Lenis leen.
- Un `<img>` con `width` y `height` a la vez hace que el navegador **ignore `aspect-ratio`**. Si se
  ponen los dos, `img { height: auto }` es obligatorio.
- Verificación visual con Playwright en viewport de celular primero, no de escritorio.

## Skills — inyección continua

Antes de empezar cualquier trabajo no trivial, revisa en silencio si la tarea corresponde a un skill
de `~/.claude/skills-library/` que todavía no esté en `.claude/skills/` — infiérelo del contenido de
la tarea, no solo de menciones explícitas. Si falta, inyéctalo primero
(`cp -r ~/.claude/skills-library/<skill-name> .claude/skills/`), menciónalo en una línea, **y sigue
sus instrucciones de verdad** — inyectar sin aplicar no sirve de nada. Esto aplica durante toda la
vida del proyecto, no solo al `/init`.
