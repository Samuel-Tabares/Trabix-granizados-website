export const INSTAGRAM_HANDLE = "trabix_granizados";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587030724828";

/**
 * Últimos posts, del más nuevo al más viejo. Salen de `crm-app`
 * (`GET /api/instagram`), que tiene el token de la Instagram API y lo renueva
 * solo. Se leen en el build y el carrusel los vuelve a pedir en el navegador,
 * así que un post nuevo aparece sin redesplegar el sitio.
 *
 * `INSTAGRAM_FALLBACK` solo se usa si crm-app no responde. Van permalinks sin
 * el usuario: `instagram.com/<usuario>/p/<código>/embed/` responde
 * `X-Frame-Options: DENY` y el iframe sale en blanco.
 */
export const INSTAGRAM_API_URL = "https://crm-app-production-405d.up.railway.app/api/instagram";

export const INSTAGRAM_FALLBACK = [
  "https://www.instagram.com/p/Dbm31R2lWmt/",
  "https://www.instagram.com/p/DbUwqApFVNX/",
  "https://www.instagram.com/p/DbOpQyPNyMk/",
  "https://www.instagram.com/p/DZ_sD7jFaRY/",
  "https://www.instagram.com/p/DZ_rHbflTiH/",
  "https://www.instagram.com/reel/DWzeiYyDc_k/",
  "https://www.instagram.com/reel/DWaOXdxDVQU/",
  "https://www.instagram.com/reel/DWUv7twj7Uj/",
  "https://www.instagram.com/reel/DWO_7grDdnV/",
  "https://www.instagram.com/reel/DWFROnsj1NF/",
];

export const MAX_POSTS = 10;

/** Acepta solo permalinks de post o reel de Instagram. */
export function normalizarPosts(raw: unknown): string[] | null {
  const posts = (raw as { posts?: unknown })?.posts;
  if (!Array.isArray(posts)) return null;
  const links = posts
    .map((p) => (p as { permalink?: unknown })?.permalink)
    .filter((l): l is string => typeof l === "string" && /^https:\/\/www\.instagram\.com\/(p|reel|tv)\/[\w-]+\/?/.test(l))
    .slice(0, MAX_POSTS);
  return links.length ? links : null;
}

export async function obtenerPosts(): Promise<string[]> {
  try {
    const res = await fetch(INSTAGRAM_API_URL, { signal: AbortSignal.timeout(6000) });
    if (res.ok) return normalizarPosts(await res.json()) ?? INSTAGRAM_FALLBACK;
  } catch {}
  return INSTAGRAM_FALLBACK;
}
