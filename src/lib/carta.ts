/* ============================================================================
   Carta — capa de datos.

   Un solo contrato, dos orígenes posibles. Hoy la carta se hornea en el build
   desde src/data/carta.json. Cuando exista el panel de sabores en crm-app,
   basta definir PUBLIC_CARTA_URL y el mismo código empieza a leer de allá:
   el contrato no cambia, solo la URL.

   El fallback NUNCA se quita. La carta se abre desde el celular de un cliente,
   en un evento, con datos móviles malos. Una carta vacía es una venta perdida
   ahí mismo, así que si el origen remoto falla o llega deforme, se sirve lo
   horneado sin decir nada.
   ========================================================================== */

import local from "../data/carta.json";

export type TipoSabor = "con_licor" | "sin_licor";

export interface Sabor {
  flavor_id: string;
  nombre: string;
  nombre_base: string;
  tipo: TipoSabor;
  descripcion: string;
  /** Nombre de archivo en src/assets/products/, o null si el sabor no tiene foto. */
  foto: string | null;
  activo: boolean;
  orden: number;
}

export interface Carta {
  actualizado: string;
  sabores: Sabor[];
}

/** Rechaza una respuesta remota deforme antes de que llegue a la página. */
function esSaborValido(x: unknown): x is Sabor {
  if (typeof x !== "object" || x === null) return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.flavor_id === "string" &&
    s.flavor_id.length > 0 &&
    typeof s.nombre === "string" &&
    s.nombre.length > 0 &&
    (s.tipo === "con_licor" || s.tipo === "sin_licor") &&
    typeof s.activo === "boolean"
  );
}

export function normalizar(raw: unknown): Carta | null {
  if (typeof raw !== "object" || raw === null) return null;
  const c = raw as Record<string, unknown>;
  if (!Array.isArray(c.sabores)) return null;

  const sabores = c.sabores.filter(esSaborValido);
  // Una respuesta sin un solo sabor válido es una respuesta rota, no una carta
  // vacía legítima. Se descarta y gana el fallback.
  if (sabores.length === 0) return null;

  return {
    actualizado: typeof c.actualizado === "string" ? c.actualizado : "",
    sabores,
  };
}

/** Solo los activos, en el orden del panel. Es lo único que la UI debe pintar. */
export function disponibles(carta: Carta): Sabor[] {
  return carta.sabores
    .filter((s) => s.activo)
    .sort((a, b) => a.orden - b.orden);
}

const fallback = normalizar(local)!;

/**
 * El panel de sabores de `crm-app`. No es secreto —la carta es pública— así que
 * va como constante y no como variable de entorno: una URL pública en el
 * dashboard de Vercel es una cosa más que se puede olvidar de configurar y un
 * build que silenciosamente sirve datos viejos. `PUBLIC_CARTA_URL` la puede
 * sobrescribir para apuntar a un crm-app local.
 */
const CARTA_URL = "https://crm-app-production-405d.up.railway.app/api/carta";

/**
 * Se resuelve en tiempo de build. Si `crm-app` no responde, responde lento o
 * devuelve algo deforme, gana el fallback horneado y el build sigue: un sitio
 * que no se puede publicar porque el CRM está dormido es peor que uno con la
 * carta de ayer.
 */
export async function obtenerCarta(): Promise<Carta> {
  const url = import.meta.env.PUBLIC_CARTA_URL ?? CARTA_URL;
  if (!url) return fallback;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return fallback;
    return normalizar(await res.json()) ?? fallback;
  } catch {
    // Un build no se cae porque crm-app esté dormido.
    return fallback;
  }
}
