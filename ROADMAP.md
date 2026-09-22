# ROADMAP — `website`

> Léeme al iniciar sesión, junto con `CLAUDE.md`. Última revisión: 2026-09-22.

## Estado: rediseño total en curso

El 2026-09-22 se decidió reconstruir el sitio entero. Deja de ser solo respaldo de credibilidad:
la **carta interactiva** lo convierte en herramienta de punto de venta, porque reemplaza la carta
física y se abre desde el celular del cliente en un evento.

Eso cambia la prioridad que tenía este proyecto. El `ROADMAP` anterior decía "no invertir esfuerzo
grande acá" porque las ventas pasan por el bot y los anuncios no tocan la web. **Sigue siendo
cierto para el marketing, pero ya no para la carta** — la carta se usa en persona, delante del
cliente, y si no carga es una venta perdida ahí mismo.

Lo que **no** cambió: no hay carrito ni chatbot web (decisión del 2026-07-30, ver `CLAUDE.md`). El
pedido se cierra en el bot.

---

## Fase 1 — Rediseño en Astro (este repo)

De HTML plano a Astro. De 12 colores de acento y glassmorphism a minimalista. Mobile-first de
verdad, no un desktop encogido. Muy animado, con la capa de movimiento de `~/Desktop/growup/elipsis`
(GSAP + ScrollTrigger + SplitText + Lenis vendorizados en `public/vendor/`, nunca CDN).

- [ ] Scaffold de Astro + adapter estático de Vercel, conservando los `redirects` y `headers` de
      `vercel.json`.
- [ ] Definir la paleta minimalista nueva. **`../brand_identity.md` no sirve de referencia** —
      fue extraído del CSS actual y documenta justo lo que se elimina. Se reescribe al final, como
      salida.
- [ ] Layout base + las 4 páginas (`/`, `retail/`, `volumen/`, `alianzas/`), cada una con su propio
      CTA de WhatsApp precargado.
- [ ] Capa de movimiento con el contrato de fallo de elipsis: `.js` en `<html>` + timeout, modo
      calm bajo `prefers-reduced-motion`, `?motion=debug` para diagnosticar en el aparato que falla.
- [ ] Mockup de chat de WhatsApp en CSS/SVG puro (el de `elipsis/contact-preview/`), que es lo que
      más le gustó a Samuel.
- [ ] Fotos reales de `site-assets/real-life/` como eje de confianza.
- [ ] Verificación con Playwright en viewport de celular **primero**.

## Fase 2 — Carta interactiva

- [ ] Ruta `/carta` (o `/menu`), la pieza más animada del sitio.
- [ ] Selección de sabores → CTA de WhatsApp con la selección precargada en el mensaje. Sin
      checkout.
- [ ] Ruta corta `/c` con redirect en `vercel.json`, que es **lo único que se graba en las tags
      NFC** — nunca la URL final, para no recomprar tags al cambiar el destino.
- [ ] QR apuntando al mismo destino. Patrón híbrido: QR impreso + chip NFC detrás de la misma
      etiqueta. NTAG213 basta para una URL.
- [ ] La carta lee de **una sola URL** desde el día uno, con fallback horneado en el build para que
      nunca salga vacía.

## Fase 3 — Panel de sabores en `crm-app` (fuente de verdad)

Vive en `crm-app`, no acá, pero la carta depende de esto. **Ver `crm-app/ROADMAP.md`.**

- [ ] Tabla `flavor` en el Postgres de Railway: `flavor_id`, `nombre`, `nombre_base`, `tipo`,
      `descripcion`, `foto_url`, `activo`, `orden`.
- [ ] Seed con los 12 sabores actuales de `../trabix-bot/config/messages.toml`.
- [ ] Panel `/settings/sabores`: agregar sabor, foto, nombre, descripción, on/off, orden.
      **Sin botón de eliminar** — ver la trampa 1 abajo.
- [ ] Fotos a un **bucket de Railway**, mismo proyecto que el Postgres.
- [ ] `GET /api/carta.json` público con CORS para el website.

## Fase 4 — El bot lee de la BD

Vive en `trabix-bot`. **Ver `trabix-bot/ROADMAP.md`.**

- [ ] El catálogo sale de `config/messages.toml` y pasa a leerse del Postgres con SQLx. **Sin
      HTTP**: bot y `crm-app` comparten el mismo Postgres físico.
- [ ] Hoy el bot manda una **imagen** de menú (`menu_image_caption`). Pasa a mandar el **link de la
      carta**, y a listar los sabores en el mismo mensaje cuando pregunten por el menú o los sabores.
- [ ] `AMBIGUOUS_GROUPS` deja de estar hardcodeado y se calcula en runtime agrupando por
      `nombre_base`.

### Las dos trampas de mover los sabores a la BD

**1. Nunca borrar un sabor.** `order_items.flavor` es un `VARCHAR(50)` con el `flavor_id` y sin
foreign key. Todo pedido histórico apunta ahí; borrar deja huérfanos los pedidos viejos y rompe
`/ventas` y los reportes. Soft delete siempre.

**2. Un sabor nuevo puede reintroducir un bug ya arreglado.** `AMBIGUOUS_GROUPS` en
`trabix-bot/src/ai/tools.rs` es el parche del incidente del 2026-07-19, donde el modelo adivinaba
si el cliente quería la variante con o sin licor. Cubre 4 nombres base **escritos a mano**. Agregar
"Mango" y luego "Mango Ron" desde el panel crea un par que esa lista no cubre, y el bot vuelve a
adivinar en silencio. Por eso el `nombre_base` no es opcional.

---

## Regla de oro (sigue vigente)

**El sitio nunca puede prometer algo que el bot no cumple.** Actualizar el copy *después* de que el
bot esté desplegado con el cambio, no antes. Y verificar el HTML de verdad, no este archivo: ya
pasó que acá decía "HECHO" y el copy nunca mencionó el Grupo B, y quedó desalineado una semana.

Mientras las fases 3 y 4 no estén, **la carta y el bot son dos catálogos distintos** y la carta
puede prometer un sabor que el bot no ofrece.

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
- **Sin licor es solo mayorista, mínimo 20 u.** No se ofrece al detal.

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
