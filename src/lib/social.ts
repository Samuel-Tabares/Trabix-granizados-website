export const INSTAGRAM_HANDLE = "trabix_granizados";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587030724828";

/**
 * Los posts del carrusel de la home, del más nuevo al más viejo. Máximo 10.
 *
 * Solo el shortcode, nunca el permalink completo: el embed de la forma
 * `instagram.com/<usuario>/p/<código>/embed/` responde `X-Frame-Options: DENY`
 * y el iframe sale en blanco. Eso rompió la sección entre el 2026-09-24 y el
 * 2026-09-30. `instagram.com/p/<código>/embed/` sí se deja embeber.
 *
 * No hay API conectada: al publicar, agregar el código nuevo arriba.
 * Revisado el 2026-09-30 — la cuenta tiene 8 posts en total.
 */
export const INSTAGRAM_POSTS = [
  "Dbm31R2lWmt",
  "DbUwqApFVNX",
  "DbOpQyPNyMk",
  "DZ_sD7jFaRY",
  "DZ_rHbflTiH",
  "DTjqj3mDHfs",
  "DScGfq9lVs2",
  "DSb6Xb5jlRo",
].slice(0, 10);

export const permalinkPost = (codigo: string) => `https://www.instagram.com/p/${codigo}/`;
