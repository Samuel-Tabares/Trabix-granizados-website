# website — Trabix Granizados

Sitio de marketing de **www.trabixgranizados.xyz**, desplegado en Vercel. Reconstruido entero el
2026-09-22: de HTML plano a **Astro**, de 12 colores de acento y glassmorphism a **minimalista y
mobile-first**, y con una pieza que no es marketing sino operación: la **carta interactiva**, que
reemplaza la carta física y se reparte por NFC y QR.

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

Reemplaza la carta física. 12 sabores en grilla, filtro con/sin licor y selección por toque.

**No tiene checkout.** Termina en un CTA de WhatsApp con los sabores elegidos precargados en el
mensaje — el pedido se cierra en el bot, nunca en la web (ver "Por qué no hay carrito" abajo).

## NFC y QR — qué funciona y qué no

**Lo que se reparte es `/c` (NFC) y `/qr` (QR), nunca la URL final.** Los dos son redirects **307**
a `/carta/?src=`, temporales a propósito: un 308 se cachea para siempre en el navegador y dejaría
la tag clavada al destino viejo.

⚠️ **`trailingSlash: true` reescribe `/c` a `/c/` ANTES de evaluar los redirects**, así que en
`vercel.json` hacen falta las dos variantes de cada ruta. Sin la versión con barra, la ruta que va
grabada en las tags devuelve 404 — pasó en producción el 2026-09-23.

El QR está generado en `qr/carta-qr.png` (2048px) y `.svg`, apuntando a `/qr`.

**Lo que NO es posible, para no volver a proponerlo:** compartir la carta por NFC acercando un
iPhone a otro celular. Eso exige emulación de tarjeta (HCE) y Apple no la abre a terceros. Los
pases NFC de Apple Wallet existen pero Apple **solo los aprueba para pagos y transporte** — un menú
no califica, y pagar la cuenta de desarrollador no lo desbloquea. Lo que sí funciona: **tags NFC
físicas** (NTAG213) grabadas con la URL `/c`, y un pase de Wallet con el QR para mostrar en
pantalla.

## Fuente de verdad de los sabores: `crm-app`, no este repo

**Implementado y en producción desde el 2026-09-22.** El catálogo vivía hardcodeado en
`../trabix-bot/config/messages.toml` y cambiar un sabor exigía redesplegar Rust. Ahora es la tabla
`flavor` del Postgres de Railway, administrada desde `crm-app` → `/settings/sabores`:

```
crm-app /settings/sabores ─► tabla `flavor` ─┬─► GET /api/internal/flavors (token) ─► trabix-bot
                                             └─► GET /api/carta (público, CORS) ─► carta (Vercel)
```

**El bot consume HTTP, no SQL.** Comparte el Postgres con `crm-app`, así que leerlo directo era
posible — pero el bot ya consumía `/api/internal/pricing` de esa forma, y seguir el patrón que
existe vale más que la conexión directa. Caché en memoria, fetch al boot que nunca bloquea el
arranque, refresco cada 10 min y `POST /internal/flavors/refresh` para propagación instantánea.

El website lee `GET /api/carta` **en tiempo de build**, con `src/data/carta.json` como fallback si
`crm-app` no responde o devuelve algo deforme: un sitio que no se puede publicar porque el CRM está
dormido es peor que uno con la carta de ayer.

⚠️ **El desfase que hay que tener presente:** apagar un sabor lo saca del bot al instante, pero de
la carta **solo en el siguiente deploy del sitio**, porque se hornea en build. Sin resolver a
propósito. Si estorba, la salida es un fetch en cliente además del horneado, o un deploy hook de
Vercel disparado desde el panel.

**Las fotos: manda el panel.** `crm-app` sirve las imágenes por proxy desde un bucket privado de
Railway (`/api/carta/foto/[key]`, caché inmutable). Las láminas locales de `src/assets/products/`
pesan menos —WebP con srcset, ~35 KB contra ~550 KB del PNG proxeado— pero quedan de **fallback**,
no de prioridad: si el panel es la fuente de verdad, cambiar una foto ahí tiene que verse en la
carta. Mitigar el peso es optimizar la imagen al subirla en `crm-app`, no volver a invertir esto.

### Dos trampas que arrastra tener el catálogo en la BD

**1. El panel no borra sabores, los apaga.** `order_items.flavor` (Postgres del bot) guarda el
`flavor_id` como texto y sin foreign key, así que todo pedido histórico apunta ahí. Borrar deja
huérfanos esos pedidos y rompe `/ventas` y los reportes.

**2. El `nombre_base` es lo que evita un bug ya arreglado.** `AMBIGUOUS_GROUPS` era una lista
escrita a mano en `trabix-bot/src/ai/tools.rs` con los 4 nombres base que existen en dos variantes,
y es el parche del incidente del 2026-07-19 donde el modelo adivinaba en silencio si el cliente
quería la versión con o sin licor. Ya no existe: los grupos se calculan agrupando por `base_name` y
las palabras distintivas se derivan del nombre. Pero eso solo funciona si al crear un sabor se pone
la base correcta — "Mango" y "Mango Ron" tienen que compartir `Mango`.

## Los precios también salen de `crm-app`

Desde el 2026-09-23, `/settings/precios` manda de verdad sobre lo que cobra el bot: el endpoint
`/api/internal/pricing` incluye un bloque `retail` con el precio unitario con licor, el sin licor y
el par en promo. Antes solo viajaban los tiers mayoristas y el bot tenía los del detal como
constantes de Rust, así que **cambiar el precio al detal en el panel no cambiaba nada**.

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
**sin licor se vende al detal desde una unidad, a $7.000** (cambió el 2026-09-23 — antes era solo
mayorista); envío nacional llega **descongelado** y hay que decirlo explícitamente.

**La promo del segundo a mitad de precio es solo del con licor.** Dos con licor cuestan $12.000;
dos sin licor cuestan $14.000. Es el error fácil de cometer al escribir copy de precios.

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
