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

## Lo único pendiente: sincronizar con las reglas de domicilio

Cuando se implemente el cambio de domicilio en el bot (ver `../trabix-bot/ROADMAP.md` §2), este
sitio queda desactualizado y hay que alinearlo. Las reglas nuevas:

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

## Advertencias de contenido

- `alianzas/` es la cara pública del modelo de inversión/vendedores ("desde $20.000, hasta 280% de
  rentabilidad"). Ese sistema está **pausado** hoy. Si alguien llega por ahí, no hay proceso de
  onboarding detrás. Decidir si se despublica o se deja como captación pasiva.
- **Nunca publicar el costo real por unidad** ($2.000) ni nada del modelo interno de `MODELO
  NEGOCIO/` — a los vendedores se les presenta un costo percibido distinto.
- El programa de embajadores **no está corriendo**; no agregar llamados a la acción que dependan de
  que existan embajadores activos.
