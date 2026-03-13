# Plan de reestructuración visual y funnel comercial de Trabix Granizados

## Resumen
Rediseñar el sitio estático completo para convertirlo en una landing principal de distribución de intención con tres rutas equivalentes y claramente diferenciadas: `Retail`, `Mayoristas` y `Emprende con Trabix`. La home no prioriza una ruta sobre otra, pero sí debe vender desde el primer pantallazo la economía, practicidad, portabilidad y facilidad de venta del producto. La estética base será juguetona, explosiva y muy apoyada en el universo real del logo y los `flavor_design`, evitando un look sobrio o corporativo.

La conversión principal será directa:
- `Retail` y `Mayoristas` llevan a WhatsApp con mensajes prellenados distintos sobre el mismo bot.
- `Emprende con Trabix` lleva a `trabixgranizados@gmail.com`, con apoyo visual y formulario solo para preparar mejor el primer contacto.

## Cambios de implementación
### Arquitectura del sitio
- Mantener 4 páginas: `/`, `/retail/`, `/volumen/` con naming visible `Mayoristas`, y `/alianzas/` con naming visible `Emprende con Trabix`.
- Unificar todo el sitio al español. Eliminar términos como `High-volume` y `Retail clients`.
- Reescribir navegación, headings, microcopy y CTAs para que cada ruta tenga una intención comercial única y sin texto genérico.
- Añadir CTA fijo discreto en móvil:
  - Home: acceso rápido a las 3 rutas.
  - Retail y Mayoristas: botón a WhatsApp.
  - Emprende con Trabix: botón a correo.

### Dirección visual
- Rehacer la identidad visual usando el arcoíris y neón del logo como sistema gráfico principal.
- Integrar `flavor_design` y `etiqueta_background` como base de cards, fondos, separadores y acentos por sabor o categoría.
- Mantener fondo oscuro y contrastado, pero con una composición más divertida, expresiva y memorable.
- Dar a cada ruta un subtono propio sin romper el sistema:
  - `Retail`: antojo inmediato, promo, catálogo y facilidad de compra.
  - `Mayoristas`: rentabilidad, operación simple, eventos y reventa.
  - `Emprende con Trabix`: oportunidad, dinero, apoyo y entrada fácil.
- Mantener visual no intrusiva en laptop, tablet y móvil.

### Home principal
- Hero centrado en la promesa transversal:
  - granizado listo para vender y llevar,
  - formato estándar `266 ml / 9 oz`,
  - fácil de mover, servir y ofrecer,
  - útil para fiestas, eventos, puntos nocturnos y venta rápida.
- Cambiar el mensaje actual de selector de rutas por una narrativa más comercial:
  - qué es Trabix,
  - por qué el producto resuelve mejor que un granizado tradicional,
  - qué gana cada tipo de usuario,
  - luego las 3 rutas.
- Estructurar la home en este orden:
  1. Hero de marca + practicidad + CTA a rutas.
  2. Bloque "por qué funciona" con `9 oz`, sin máquina, portátil, fácil de vender y útil para fiestas y eventos.
  3. Selector visual de 3 rutas con peso equivalente.
  4. Bloque de credibilidad con `11 aliados`, presencia en eventos, presencia nocturna y en establecimientos.
  5. Bloque de cobertura: Armenia cobertura fuerte; Quindío sujeto a confirmación por WhatsApp; otras ciudades enfocadas principalmente a mayoristas.
  6. Cierre con CTA por necesidad del usuario.
- No mostrar precios en la home; sí reforzar economía y practicidad.

### Página Retail
- Objetivo: antojar, facilitar elección y cerrar por WhatsApp.
- Incluir catálogo claro dividido entre `Con licor` y `Sin licor`.
- Confirmar nombres comerciales:
  - Con licor: `Smirnoff Lulo`, `Bon Bon Bum Fresa Champaña`, `Manzana Verde Tequila`, `Uva Vodka`, `Bon Bon Bum Whiskey`, `Maracumango Ron Blanco`, `Blueberry Vodka`.
  - Sin licor: `Blueberry`, `Bon Bon Bum`, `Manzana Verde`, `Maracumango`.
- Publicar precios retail visibles:
  - `Con licor`: primer granizado `$8.000`, segundo a mitad de precio.
  - Ejemplos visibles: `3 por $20.000` y `4 por $24.000`.
  - `Sin licor`: `$7.000` cada uno.
- La promo con licor aplica por tipo de producto, no por sabor.
- Incluir un bloque editable fijo de promociones activas.
- Añadir aviso discreto para línea con licor.
- CTA dominante siempre a WhatsApp con mensajes de compra rápida y consulta de disponibilidad o cobertura.

### Página Mayoristas
- Objetivo: mostrar economía por unidad, facilidad operativa y utilidad para eventos y reventa.
- Reorientar el discurso a `eventos + reventa`, no a B2B frío.
- Incluir tabla de precios mayoristas visible:
  - `Con licor`: `20-49 u $4.900`, `50-99 u $4.700`, `100+ u $4.500`.
  - `Sin licor`: `20-49 u $4.800`, `50-99 u $4.500`, `100+ u $4.200`.
- Explicar visualmente por qué funciona para mayoristas:
  - no requiere máquina,
  - fácil de almacenar y entregar,
  - rápido de mover en eventos,
  - buen producto para reventa y activación,
  - fuerte presencia visual.
- Incluir bloques de uso: bares, fiestas, eventos privados, activaciones, puntos aliados y venta nocturna.
- Mantener CTA de WhatsApp en hero, mitad de página y cierre.
- Incluir cobertura y comercialización:
  - Armenia y Quindío como base operativa,
  - otras ciudades enfocadas principalmente a compras por volumen.

### Página Emprende con Trabix
- Renombrar la ruta visualmente como `Emprende con Trabix`.
- Posicionarla como oportunidad de ingreso con apoyo de marca.
- Mensaje central:
  - pueden comenzar desde `$20.000`,
  - Trabix ayuda económicamente con parte del arranque,
  - el aliado solo vende o consigue ventas,
  - Trabix gestiona congelamiento, almacenamiento, registros, sellos, verificaciones y logística.
- Hacer visible el incentivo económico:
  - `60% de las ganancias para el aliado`,
  - `hasta 280% de rentabilidad sobre la inversión`.
- Incluir ejemplo explícito:
  - `Si empiezas con $100.000, puedes terminar recuperando tus $100.000 y generar hasta $280.000 de ganancia, para un total de hasta $380.000.`
- Explicar financiación de forma básica:
  - Trabix puede apoyar con parte del dinero inicial para separar producto.
- Usar prueba social concreta:
  - `11 aliados actualmente y creciendo`,
  - presencia en eventos, vida nocturna y establecimientos,
  - llegan donde los granizados tradicionales no llegan.
- Mantener el canal principal en correo.
- El formulario o preparador de correo debe pedir exactamente:
  - nombre,
  - ciudad,
  - teléfono de contacto,
  - monto disponible para comenzar.
- No profundizar en operación interna ni condiciones fuera del mensaje motivacional inicial.

### Interfaces públicas y contenido editable
- Actualizar labels y rutas visibles del nav a: `Inicio`, `Retail`, `Mayoristas`, `Emprende con Trabix`.
- Estandarizar mensajes prellenados de WhatsApp por intención:
  - retail: pedido directo,
  - mayoristas: cotización por cantidad, evento o reventa.
- Mantener correo oficial único: `trabixgranizados@gmail.com`.
- Centralizar como contenido editable del sitio:
  - tabla de precios retail,
  - tabla de precios mayoristas,
  - promo activa retail,
  - métricas de prueba social,
  - cobertura,
  - ejemplo de rentabilidad de aliados.

## Pruebas y criterios de aceptación
- Navegación consistente en desktop, tablet y móvil, con naming final en español en todas las páginas.
- Cada página debe dejar claro en menos de un pantallazo:
  - quién es la ruta,
  - qué gana ese usuario,
  - cuál es el siguiente paso.
- El CTA fijo móvil no debe tapar contenido clave ni romper scroll.
- Los precios visibles deben coincidir exactamente con los valores definidos para retail y mayoristas.
- La promo retail debe entenderse sin ambigüedad.
- El formulario o correo de aliados debe generar correctamente asunto y cuerpo con los 4 datos mínimos.
- El filtro de sabores retail debe seguir funcionando con la nueva jerarquía visual.
- Revisar legibilidad, contraste, carga y composición en móvil angosto, tablet vertical y laptop estándar.
- Verificar que todos los CTAs externos abran el canal correcto:
  - WhatsApp bot para retail y mayoristas,
  - Gmail para aliados.

## Supuestos y defaults
- El sitio sigue siendo estático con `index.html`, páginas por ruta, `styles.css` y `script.js`; no se cambia de stack.
- La ruta física `/volumen/` se puede mantener por compatibilidad, pero el naming visible será `Mayoristas`.
- La línea con licor seguirá visible con aviso discreto.
- No hay restricciones adicionales de tono o contenido por ahora.
- La cobertura retail sigue concentrada en Armenia; Quindío se comunica como sujeto a confirmación por WhatsApp; otras ciudades se empujan principalmente a mayoristas o aliados.
