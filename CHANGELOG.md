# Changelog

Todos los cambios relevantes de este proyecto.
Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) · versionado [SemVer](https://semver.org/lang/es/).

## [2.2.0] — 2026-09-24

### Added
- **`og:image`, `twitter:card` y JSON-LD `LocalBusiness`** en las 5 páginas. Antes no había ninguna
  imagen de preview: compartir el link por WhatsApp o Instagram no mostraba nada.
- **Links a Instagram y Facebook en el footer.**
- **Sección "En Instagram" en la home**, con los últimos 5 posts embebidos (`embed.js` oficial,
  carga diferida al entrar en pantalla). No se actualiza sola — la lista de posts vive en
  `src/lib/social.ts` y hay que agregarle el permalink nuevo a mano.

### Changed
- **`/alianzas/` ya no menciona costo de producción ni porcentaje de rentabilidad.** Decisión de
  Samuel: esas cifras se acercaban demasiado al costo real que `MODELO NEGOCIO/` marca como
  confidencial.

## [2.1.0] — 2026-09-23

### Added
- **Lámina de Smirnoff de tamarindo**: los 12 sabores ya tienen foto.
- **QR de la carta** en `qr/carta-qr.png` (2048px) y `.svg`, apuntando a `/qr` y no a la URL final.
- **Alianzas recupera todo el contenido de la página anterior**: los $20.000 de entrada, el 280%,
  el fondo de recompensas con premios desde $25.000, el acceso a precio proveedor y el correo con
  los cuatro datos. Se le sumó WhatsApp como segunda vía, sin quitar el correo.

### Changed
- **El sin licor se vende al detal, desde una unidad, a $7.000.** Antes era solo mayorista. Copy
  actualizado en home, retail y volumen. La promo del segundo a mitad **sigue siendo solo del con
  licor** y el copy lo dice explícitamente.
- **La foto del panel manda sobre la lámina local.** Estaba al revés: la local pesa menos, pero si
  `crm-app` es la fuente de verdad, cambiar una foto ahí tiene que verse en la carta.

### Removed
- Por petición de Samuel: la línea de disponibilidad de la carta, la tarifa de zona de Armenia, el
  "el domicilio siempre se cobra" de los dos grupos de municipios y el "el domicilio gratis es solo
  en Armenia".

### Fixed
- **`/c` y `/qr` devolvían 404 en producción.** `trailingSlash: true` reescribe `/c` a `/c/` antes
  de evaluar los redirects, así que la regla con `source: "/c"` nunca hacía match — justo la ruta
  que va grabada en las tags NFC. Se agregaron las variantes con barra.
- **El build caía siempre al fallback sin avisar.** Astro sustituye una `PUBLIC_*` no definida por
  cadena vacía y `"" ?? DEFAULT` devuelve `""`, así que la guarda `if (!url)` disparaba siempre y
  nunca se consultaba `crm-app`.

## [2.0.0] — 2026-09-22

Rediseño total. El sitio deja de ser solo respaldo de credibilidad: la carta interactiva lo
convierte en herramienta de punto de venta, porque reemplaza la carta física y se abre desde el
celular del cliente en un evento.

### Added

- **Carta interactiva** (`/carta/`): 12 sabores en grilla, filtro con licor / sin licor, selección
  por toque y barra de pedido que arma el mensaje de WhatsApp con los sabores elegidos.
- **Rutas cortas `/c` y `/qr`** (307 a `/carta/?src=`), que es lo único que se graba en las tags
  NFC y en el QR — nunca la URL final, para cambiar el destino sin recomprar tags.
- **Capa de datos de la carta** (`src/lib/carta.ts`): un solo contrato con fallback horneado en
  `src/data/carta.json`, validación de la respuesta remota y `PUBLIC_CARTA_URL` ya preparada para
  cuando exista el panel de sabores en `crm-app`.
- **Capa de movimiento** (`src/lib/motion.js`, `src/styles/motion.css`): entrada del hero con
  SplitText, reveals por scroll, parallax, tilt y smooth scroll con Lenis, con el contrato de fallo
  que mantiene la página legible si el bundle no carga.
- **Mockup de chat de WhatsApp** en CSS puro, con el bucle pausado por `IntersectionObserver`.
- **Modo oscuro** por `prefers-color-scheme`.
- `CHANGELOG.md` (este archivo).

### Changed

- **Stack: de HTML/CSS/JS plano a Astro 7 + Tailwind v4.** Header, footer y carta pasan a ser
  componentes en vez de estar copiados en cada página.
- **Sistema de diseño nuevo**: de 12 colores de acento y glassmorphism a neutros fríos con **un
  solo acento**. La tesis es que el color lo ponen las láminas de producto, no la interfaz.
- **Tipografía**: Paytone One + Baloo 2 → Geist.
- Las imágenes pasan a `src/assets/` y las optimiza Astro. La foto del hero de `/retail/` bajó de
  **7.2 MB a 40–831 KB** según el ancho servido.
- Mobile-first de verdad: el diseño arranca en viewport de celular.

### Removed

- `index.html`, `retail/`, `volumen/`, `alianzas/`, `styles.css` (1541 líneas) y `script.js`.
- El campo WebGL que trae la capa de movimiento de la skill. Su gate `affordsWebGL()` devuelve
  false bajo 900px y acá el tráfico objetivo es celular casi entero: serían ~120 KB que ningún
  usuario real llega a ver.
- Los headers de caché de `/site-assets/` en `vercel.json`: Astro ya sirve los assets con hash e
  inmutables.

### Notas

- **`../brand_identity.md` quedó obsoleto.** Documenta la paleta vieja porque se extrajo del CSS
  anterior. Hay que reescribirlo con la paleta nueva.
- Falta la lámina de **Smirnoff de tamarindo** (11 fotos para 12 sabores). La carta lo resuelve con
  un estado tipográfico, pero conviene la foto real.
- La carta y el bot siguen siendo **dos catálogos distintos** hasta que existan las fases 3 y 4 del
  `ROADMAP.md`.
