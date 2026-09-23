# Trabix Granizados — website

Sitio de marketing de **www.trabixgranizados.xyz**, en Astro, desplegado en Vercel.

> **Lee `CLAUDE.md` y `ROADMAP.md` al iniciar sesión.** Dicen qué reglas de negocio tiene que
> respetar el copy, qué está pendiente y por qué este sitio no es el canal de venta (el checkout
> es el bot de WhatsApp, a propósito).

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview   # sirve dist/ como en producción
```

Node 22.12+ (par). Producción: <https://www.trabixgranizados.xyz>

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Home: la promesa, prueba visual y los tres canales |
| `/carta/` | **La carta interactiva.** Reemplaza la carta física; se reparte por NFC y QR |
| `/retail/` | Pedir al detal: precio, cobertura y reglas de domicilio |
| `/volumen/` | Por mayor y eventos |
| `/alianzas/` | Emprender con Trabix |

`/c` y `/qr` redirigen a `/carta/` con `?src=`. **Eso es lo único que se graba en las tags NFC y en
el QR** — nunca la URL final, para poder cambiar el destino sin recomprar tags. Son 307 (temporales)
a propósito: un 308 se cachea para siempre en el navegador y dejaría la tag clavada.

## La carta

Los sabores salen de `src/data/carta.json`, que es el **fallback horneado**. Cuando exista el panel
de sabores en `crm-app`, se define `PUBLIC_CARTA_URL` y `src/lib/carta.ts` empieza a leer de allá
sin que cambie nada más. El fallback no se quita nunca: la carta se abre desde el celular de un
cliente, en un evento, con datos móviles malos.

Los `flavor_id` son los mismos de `../trabix-bot/config/messages.toml` y los guarda
`order_items.flavor` sin foreign key — **no renombrarlos**.

## Antes de dar por terminado un cambio

```bash
npm run build && npm run preview
```

Y las tres verificaciones de la capa de movimiento (ver `CLAUDE.md`):

1. **Bloquear el JS** y confirmar que todos los `h1` siguen visibles con `opacity: 1`.
2. **Emular `prefers-reduced-motion`** y confirmar que nada se mueve y nada falta.
3. **Mirarlo en viewport de celular primero**, no de escritorio.
