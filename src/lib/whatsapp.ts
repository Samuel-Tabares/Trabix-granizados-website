/* ============================================================================
   WhatsApp — el único destino del sitio.

   Cada página abre el chat con un mensaje distinto según dónde estaba el
   visitante, para que el bot arranque sabiendo de dónde viene y el tráfico
   orgánico quede segmentado sin construir nada.

   En el sitio viejo el texto vivía en dos lados (el href del HTML y un objeto
   de JS que lo hidrataba), y había que acordarse de cambiar los dos. Acá el
   href se genera en el build, así que hay una sola fuente y no se pueden
   desincronizar.
   ========================================================================== */

export const WHATSAPP_NUMERO = "573043535455";

export const MENSAJES = {
  "retail-order": "Hola, quiero pedir granizados",
  "mayoristas-quote": "Hola, quiero cotizar granizados por mayor",
  "alianzas-info": "Hola, me interesa el modelo de alianzas de Trabix",
  "carta-order": "Hola, quiero pedir granizados",
  "eventos-info": "Hola, quiero granizados para un evento",
} as const;

export type MensajeKey = keyof typeof MENSAJES;

export function waLink(key: MensajeKey, extra?: string): string {
  const texto = extra ? `${MENSAJES[key]}\n\n${extra}` : MENSAJES[key];
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}
