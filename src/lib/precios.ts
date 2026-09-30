/* ============================================================================
   Precios — el carrito de la carta.

   Los números salen de `crm-app` → `/settings/precios`, dentro de la misma
   respuesta de `/api/carta`. Se hornean en el build y se refrescan en el
   navegador al abrir la carta, así que un cambio de precio en el panel se ve
   sin redesplegar el sitio.

   `calcular()` es espejo de `calcular_pedido` en `trabix-bot/src/bot/pricing.rs`.
   Si el bot cambia cómo cobra, esto cambia igual: el total que ve el cliente
   acá tiene que ser el mismo que le va a decir el bot.
     - Cada tipo (con / sin licor) se evalúa por separado.
     - Desde el primer tramo mayorista (20 hoy) de un tipo, todas las unidades
       de ese tipo van al precio del tramo que corresponda.
     - Por debajo, el con licor va en pares al precio promo y la impar a
       precio unitario; el sin licor va a precio unitario, sin promo.
   ========================================================================== */

export interface Tramo {
  desde: number;
  unidad: number;
}

export interface Precios {
  detal: { con_licor: number; sin_licor: number; par_con_licor: number };
  mayor: { con_licor: Tramo[]; sin_licor: Tramo[] };
}

/** Lo que había en `/settings/precios` al 2026-09-30. Solo si crm-app no responde. */
export const PRECIOS_FALLBACK: Precios = {
  detal: { con_licor: 8000, sin_licor: 7000, par_con_licor: 12000 },
  mayor: {
    con_licor: [
      { desde: 20, unidad: 4900 },
      { desde: 50, unidad: 4700 },
      { desde: 100, unidad: 4500 },
    ],
    sin_licor: [
      { desde: 20, unidad: 4800 },
      { desde: 50, unidad: 4500 },
      { desde: 100, unidad: 4200 },
    ],
  },
};

const esNumero = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x) && x > 0;

function tramos(x: unknown): Tramo[] | null {
  if (!Array.isArray(x)) return null;
  const t = x.filter(
    (r): r is Tramo => typeof r === "object" && r !== null && esNumero(r.desde) && esNumero(r.unidad),
  );
  return t.length ? [...t].sort((a, b) => a.desde - b.desde) : null;
}

export function normalizarPrecios(raw: unknown): Precios | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, any>;
  const d = p.detal;
  if (!d || !esNumero(d.con_licor) || !esNumero(d.sin_licor) || !esNumero(d.par_con_licor)) return null;
  const con = tramos(p.mayor?.con_licor);
  const sin = tramos(p.mayor?.sin_licor);
  if (!con || !sin) return null;
  return {
    detal: { con_licor: d.con_licor, sin_licor: d.sin_licor, par_con_licor: d.par_con_licor },
    mayor: { con_licor: con, sin_licor: sin },
  };
}

export function minimoMayor(t: Tramo[]): number {
  return t[0]?.desde ?? Infinity;
}

function tramoPara(t: Tramo[], cantidad: number): Tramo | null {
  let elegido: Tramo | null = null;
  for (const r of t) if (r.desde <= cantidad) elegido = r;
  return elegido;
}

export interface Bloque {
  cantidad: number;
  total: number;
  mayor: boolean;
  /** Precio unitario cuando va por mayor. */
  unidad?: number;
  /** Pares con promo (solo con licor al detal). */
  pares?: number;
}

export interface Cuenta {
  con: Bloque;
  sin: Bloque;
  total: number;
  cantidad: number;
}

export function calcular(p: Precios, conLicor: number, sinLicor: number): Cuenta {
  const con: Bloque = { cantidad: conLicor, total: 0, mayor: false };
  const tCon = conLicor >= minimoMayor(p.mayor.con_licor) ? tramoPara(p.mayor.con_licor, conLicor) : null;
  if (tCon) {
    Object.assign(con, { mayor: true, unidad: tCon.unidad, total: conLicor * tCon.unidad });
  } else {
    const pares = Math.floor(conLicor / 2);
    con.pares = pares;
    con.total = pares * p.detal.par_con_licor + (conLicor % 2) * p.detal.con_licor;
  }

  const sin: Bloque = { cantidad: sinLicor, total: 0, mayor: false };
  const tSin = sinLicor >= minimoMayor(p.mayor.sin_licor) ? tramoPara(p.mayor.sin_licor, sinLicor) : null;
  if (tSin) {
    Object.assign(sin, { mayor: true, unidad: tSin.unidad, total: sinLicor * tSin.unidad });
  } else {
    sin.total = sinLicor * p.detal.sin_licor;
  }

  return { con, sin, total: con.total + sin.total, cantidad: conLicor + sinLicor };
}

export function pesos(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");
}
