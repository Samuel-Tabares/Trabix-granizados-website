# ROADMAP — `website`

> Léeme al iniciar sesión, junto con `README.md`. Última revisión: 2026-07-30.

## Qué es esto

Sitio de marketing estático (HTML/CSS/JS puro, sin framework) para **www.trabixgranizados.xyz**,
desplegado en Vercel (`vercel.json`). Tres segmentos: `retail/`, `volumen/`, `alianzas/`.

La identidad visual (paleta, tipografías, estética) está documentada en `../brand_identity.md` —
usarla como referencia para cualquier trabajo de diseño.

## Contexto: este sitio NO es el canal de venta

El canal de venta retail es **el bot de WhatsApp** (`../trabix-bot`). Los anuncios de Meta son
click-to-WhatsApp y **no pasan por acá** — no hay web intermedia, ni carrito, ni checkout. Este
sitio es respaldo de credibilidad y captación orgánica, no conversión pagada.

Consecuencia práctica: **no tiene prioridad**. La prioridad del negocio hoy es vender, y las ventas
se producen en el bot. No invertir esfuerzo grande acá mientras eso sea cierto.

---

## Sincronización con las reglas de domicilio — HECHO (2026-07-31)

El bot ya está desplegado con el cambio (ver `../trabix-bot/CHANGELOG.md` v1.9.0), así que
`retail/index.html` (sección "Cobertura y domicilio") ya refleja las reglas nuevas:

- **Armenia:** domicilio **gratis de 6 a 19 unidades**. Por debajo de 6 se cobra tarifa de zona
  (norte $6.000 / centro $8.000 / sur $10.000). Desde 20 u es precio mayorista con domicilio cobrado.
- **Pueblos aledaños (Grupo A** — Calarcá, El Caimo, Circasia, Montenegro, La Tebaida, Pueblo Tapao,
  Barcelona**):** detal de cualquier cantidad, **sin mínimo**, con domicilio siempre cobrado.
- **Pueblos lejanos (Grupo B** — Quimbaya, Salento, Filandia, Buenavista, Pijao, Córdoba,
  Génova**):** se mantiene el mínimo de 20 unidades.
- El domicilio gratis es **exclusivo de Armenia**.

**Regla de oro: el sitio nunca puede prometer algo que el bot no cumple.** Actualizarlo *después* de
que el bot esté desplegado con el cambio, no antes.

Lo que ya está correcto y no hay que tocar: **sin licor es solo mayorista, mínimo 20 u** — ya se
refleja en `retail/index.html` y `volumen/index.html`.

---

---

## Decisión tomada: NO se pone un chatbot en el sitio (2026-07-30)

Se evaluó meter un chatbot en la web para que el cliente pidiera sin ir a WhatsApp. **Descartado.**
La razón principal no es el costo de construirlo:

- **Se perdería el teléfono.** Todo el modelo financiero descansa en la tasa de recompra (*"a 25%
  mensual funciona; a 10% no"*), y el retorno de los meses 3–6 asume poder volver a contactar al que
  ya compró. WhatsApp deja número e hilo persistente; un visitante de chat web es anónimo y se va.
- **Ir a WhatsApp no es fricción en Colombia** — es el canal por defecto del comercio. El chat web
  tendría que pedir igual teléfono, dirección y foto del comprobante.
- **Los anuncios no pasan por la web** (son click-to-WhatsApp), así que el chatbot solo atendería
  tráfico orgánico, hoy marginal.
- **Duplicaría la superficie del agente**, justo lo que la dirección de arquitectura busca evitar.
- **Rompería la atribución**: el `ctwa_clid` existe porque es WhatsApp.

Se hizo en su lugar la alternativa barata (ya implementada, ver abajo). Reevaluar solo si el tráfico
orgánico crece y los datos muestran que la gente entra al sitio y no da el tap — con datos, no por
intuición.

### CTAs con texto prellenado — IMPLEMENTADO

Los CTAs ya no apuntan a un `wa.me` pelado: cada uno abre WhatsApp con un mensaje precargado según
la sección, así el bot arranca sabiendo de dónde viene el cliente y se segmenta el tráfico orgánico
sin construir nada.

| Sección | Key `data-whatsapp-link` | Mensaje |
|---|---|---|
| Home + `retail/` | `retail-order` | "Hola, quiero pedir granizados" |
| `volumen/` | `mayoristas-quote` | "Hola, quiero cotizar granizados por mayor" |
| `alianzas/` | `alianzas-info` | "Hola, me interesa el modelo de alianzas de Trabix" |

Los textos viven en `SITE_CONTENT.messages` (`script.js`) y los hidrata `bindContactLinks()`. El
`href` estático del HTML **también** trae el texto prellenado, para que funcione si el JS falla —
si cambias un mensaje, cámbialo en los dos lados o quedan desincronizados.

## Advertencias de contenido

- `alianzas/` es la cara pública del modelo de inversión/vendedores ("desde $20.000, hasta 280% de
  rentabilidad"). Ese sistema está **pausado** hoy. Si alguien llega por ahí, no hay proceso de
  onboarding detrás. Decidir si se despublica o se deja como captación pasiva.
- **Nunca publicar el costo real por unidad** ($2.000) ni nada del modelo interno de `MODELO
  NEGOCIO/` — a los vendedores se les presenta un costo percibido distinto.
- El programa de embajadores **no está corriendo**; no agregar llamados a la acción que dependan de
  que existan embajadores activos.
