# ROADMAP — `website`

> Léeme al iniciar sesión, junto con `CLAUDE.md`. Última revisión: 2026-09-23.

## Estado: rediseñado, con el catálogo ya conectado de punta a punta

El 2026-09-22 se reconstruyó el sitio entero. Deja de ser solo respaldo de credibilidad:
la **carta interactiva** lo convierte en herramienta de punto de venta, porque reemplaza la carta
física y se abre desde el celular del cliente en un evento.

Eso cambia la prioridad que tenía este proyecto. El `ROADMAP` anterior decía "no invertir esfuerzo
grande acá" porque las ventas pasan por el bot y los anuncios no tocan la web. **Sigue siendo
cierto para el marketing, pero ya no para la carta** — la carta se usa en persona, delante del
cliente, y si no carga es una venta perdida ahí mismo.

Lo que **no** cambió: no hay carrito ni chatbot web (decisión del 2026-07-30, ver `CLAUDE.md`). El
pedido se cierra en el bot.

---

## Fase 1 — Rediseño en Astro — **HECHO y publicado (2026-09-22)**

- [x] Astro 7 + Tailwind v4, estático, sin adapter. Se conservan los redirects de `vercel.json`.
- [x] Paleta minimalista: un solo acento y neutros fríos. La tesis es que **el color lo ponen las
      láminas de producto**, que son ilustraciones a sangre y saturadas.
- [x] Las 4 páginas, cada una con su CTA de WhatsApp precargado.
- [x] Capa de movimiento (GSAP + Lenis por npm, empaquetados por Vite — mismo origen, sin CDN) con
      el contrato de fallo de elipsis. Sin Three.js: su gate se apaga bajo 900px y acá el tráfico
      es celular casi entero.
- [x] Mockup de chat de WhatsApp en CSS puro.
- [x] Verificado con Playwright en iPhone 14: con el JS bloqueado los `h1` siguen visibles, bajo
      `prefers-reduced-motion` nada se mueve ni falta, ninguna página desborda y la consola queda
      limpia.

## Fase 2 — Carta interactiva — **HECHA y publicada (2026-09-22)**

- [x] `/carta`: 12 sabores, filtro con/sin licor, selección por toque y barra que arma el mensaje
      de WhatsApp con los sabores elegidos. Sin checkout.
- [x] `/c` y `/qr` como redirects **307** a `/carta/?src=`. Es lo único que se graba en la tag;
      temporales a propósito, porque un 308 se cachea para siempre en el navegador y dejaría la tag
      clavada al destino viejo. NTAG213 basta.
- [x] Lee de una sola URL (`crm-app`) con fallback horneado, para que nunca salga vacía.

## Fase 3 — Panel de sabores en `crm-app` — **HECHO y desplegado (2026-09-22)**

- [x] Tabla `flavor` (migración `0005`) + seed idempotente de los 12 sabores (`0006`).
- [x] Panel `/settings/sabores`: agregar, foto, nombre, nombre base, descripción, on/off.
      **Sin botón de eliminar**, solo apagar — ver la trampa 1 abajo.
- [x] Fotos a un bucket de Railway (`trabix-sabores`, región `iad`), servidas por
      `/api/carta/foto/[key]`. Los buckets de Railway son **privados** y la plataforma no admite
      buckets públicos, así que se proxea en vez de firmar URLs: una presigned URL caduca dentro de
      la carta cacheada y deja las fotos rotas en pleno evento.
- [x] `GET /api/carta` público con CORS. Verificado en producción: 12 sabores, 8 con licor y 4 sin.

## Fase 4 — El bot lee el catálogo de `crm-app` — **HECHO y desplegado (2026-09-22, v1.30.0)**

- [x] `src/bot/flavors.rs`, mismo patrón que `pricing.rs`. **Por HTTP, no por SQL**: el bot ya
      consumía `/api/internal/pricing` de `crm-app` de esa forma, y seguir el patrón que existe
      vale más que la conexión directa que la base compartida permitiría.
- [x] Fallback compilado con los 12 sabores: si `crm-app` no responde al arranque el bot sigue
      vendiendo. Verificado en producción — el primer deploy arrancó antes que `crm-app` y el log
      dijo `initial flavor fetch failed, using compiled defaults`, que es justo lo que debía pasar.
- [x] `show_menu_image` → `show_menu`: manda el link de la carta y el prompt pide además la lista
      de sabores en texto en el mismo turno.
- [x] `AMBIGUOUS_GROUPS` calculado en runtime agrupando por `base_name`.

> **`CARTA_URL` ya está activa** (`https://trabixgranizados.xyz/carta/`). Se dejó vacía a propósito
> hasta publicar el sitio, porque con `/carta/` devolviendo 404 el bot habría mandado un link roto a
> clientes reales.

## Fase 5 — Sin licor al detal y precios centralizados — **HECHO y desplegado (2026-09-23)**

- [x] **El sin licor se vende por unidad, a $7.000.** Antes solo por mayor desde 20. Cambiado en el
      bot (`SIN_LICOR_RETAIL_AVAILABLE`) y en todo el copy del sitio.
      **La promo del segundo a mitad es solo del con licor**: 2 con licor son $12.000, 2 sin licor
      son $14.000. Hay un test en el bot que fija esa diferencia.
- [x] **Los precios al detal salen de `/settings/precios`.** `unitWithAlcoholPrice`,
      `unitNoAlcoholPrice` y `promoPackagePrice` ya existían ahí, pero el endpoint que consume el
      bot solo mandaba los tiers mayoristas y el bot tenía los del detal hardcodeados: cambiarlos en
      el panel **no cambiaba lo que el bot cobraba**.
- [x] Las 12 láminas subidas al bucket. La carta las sirve desde el panel, no desde el repo.
- [x] QR generado en `qr/carta-qr.png` y `.svg`, apuntando a `/qr`.
- [x] Alianzas recupera todo el contenido de la página anterior.
- [x] Quitados por petición de Samuel: la línea de disponibilidad de la carta, la tarifa de zona de
      Armenia, el "domicilio siempre se cobra" de los dos grupos de municipios y el "domicilio
      gratis solo en Armenia".

### Bugs encontrados verificando contra producción, no antes

1. **`/c` y `/qr` devolvían 404** — `trailingSlash: true` reescribe `/c` a `/c/` antes de evaluar
   los redirects, así que la regla nunca hacía match. Era justo la ruta que va grabada en las tags.
2. **El build caía siempre al fallback en silencio** — Astro sustituye una `PUBLIC_*` no definida
   por cadena vacía, y `"" ?? DEFAULT` devuelve `""`, no el default.
3. **La lámina local ganaba sobre la foto del panel**, así que cambiar una foto desde `crm-app`
   quedaba invisible en la web. Invertido.

---

### Las dos trampas de mover los sabores a la BD

**1. Nunca borrar un sabor.** `order_items.flavor` es un `VARCHAR(50)` con el `flavor_id` y sin
foreign key. Todo pedido histórico apunta ahí; borrar deja huérfanos los pedidos viejos y rompe
`/ventas` y los reportes. Soft delete siempre.

**2. El `nombre_base` es lo que evita un bug ya arreglado.** `AMBIGUOUS_GROUPS` era el parche del
incidente del 2026-07-19, donde el modelo adivinaba si el cliente quería la variante con o sin
licor, y cubría 4 nombres base escritos a mano. Ya no: los grupos se calculan agrupando por
`base_name`. Pero eso solo funciona si al crear un sabor se pone el nombre base correcto — "Mango"
y "Mango Ron" tienen que compartir la base `Mango` o el bot no sabrá que puede confundirlos.

---

## Regla de oro (sigue vigente)

**El sitio nunca puede prometer algo que el bot no cumple.** Actualizar el copy *después* de que el
bot esté desplegado con el cambio, no antes. Y verificar el HTML de verdad, no este archivo: ya
pasó que acá decía "HECHO" y el copy nunca mencionó el Grupo B, y quedó desalineado una semana.

Desde el 2026-09-22 **la carta y el bot leen el mismo catálogo**, así que esa clase de
desincronización ya no aplica a los sabores. Sigue aplicando a todo lo demás: precios, mínimos y
reglas de domicilio.

**Ojo con el desfase de build.** La carta se hornea en el build del website, así que apagar un
sabor lo saca del bot al instante pero de la carta solo en el siguiente deploy. Para que un sabor
agotado desaparezca de la carta hoy hay que republicar el sitio. Si eso molesta en la práctica, la
salida es un fetch en cliente además del horneado, o un deploy hook de Vercel disparado desde el
panel — está sin hacer a propósito, para ver primero si de verdad estorba.

## Reglas de negocio que el copy debe respetar

- **Armenia:** domicilio gratis de **6 a 19 unidades**. Por debajo de 6, tarifa de zona (norte
  $6.000 / centro $8.000 / sur $10.000). Desde 20 u, precio mayorista con domicilio cobrado.
- **Grupo A** (Calarcá, El Caimo, Circasia, Montenegro, La Tebaida, Pueblo Tapao, Barcelona): detal
  de cualquier cantidad, sin mínimo, domicilio siempre cobrado.
- **Grupo B** (Quimbaya, Salento, Filandia, Buenavista, Pijao, Córdoba, Génova): detal desde 20 u,
  domicilio siempre cobrado.
- **Resto del país:** envío nacional desde 20 u, **llega descongelado** — hay que decirlo
  explícitamente, es la única promesa distinta.
- El domicilio gratis es **exclusivo de Armenia**.
- **Sin licor se vende al detal desde una unidad, a $7.000** (cambió el 2026-09-23). Por mayor
  sigue con el mínimo de 20 u por tipo.
- **La promo del segundo a mitad de precio es solo del con licor.** Dos con licor son $12.000, dos
  sin licor son $14.000.

## Advertencias de contenido

- **Nunca publicar el costo real por unidad** ($2.000) ni nada de `../MODELO NEGOCIO/`.
- El **programa de embajadores no está corriendo**: ningún CTA puede depender de que existan.
- `alianzas/` es la cara pública del modelo de inversión, hoy **pausado**. Si alguien llega por ahí
  no hay onboarding detrás. Decidir si se despublica o se deja como captación pasiva.

## Decisión tomada: NO se pone un chatbot ni carrito en el sitio (2026-07-30)

Vigente. Razones completas en `CLAUDE.md` — en corto: se perdería el teléfono (el modelo financiero
descansa en la recompra), ir a WhatsApp no es fricción en Colombia, los anuncios son
click-to-WhatsApp y no pasan por la web, y rompería la atribución del `ctwa_clid`.

Reevaluar solo si el tráfico orgánico crece y los datos muestran que la gente entra y no da el tap.
Con datos, no por intuición.
