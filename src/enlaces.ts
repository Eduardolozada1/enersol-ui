// Links que llegan de afuera: el ?next= / #next= del SSO, los links de «Tus pendientes» y las
// menciones del sobre de mensajes. Solo se usan rutas del mismo sitio (o, donde se pide,
// https a un origen permitido); todo lo demás (javascript:, data:, otros dominios, «//x»,
// barras invertidas, caracteres de control) se descarta.
//
// Ojo con «/\evil.com» y «/<TAB>evil.com»: el navegador los lee como «//evil.com» (otro
// dominio). Por eso se rechazan barras invertidas y caracteres de control ANTES de resolver,
// y después se verifica el origen con URL (auditoría de seguridad 2026-10).

/** Dominio de Enersol: los https a este dominio o a sus subdominios son links válidos en el
 *  contenido (menciones, pendientes). */
export const DOMINIO_ENERSOL = "enersol-sa.com";

const LARGO_MAXIMO = 2048;

function tieneCaracteresRaros(s: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[\\\u0000-\u001f\u007f]/.test(s);
}

function origenActual(origen?: string): string {
  if (origen) return origen;
  if (typeof window !== "undefined" && window.location) return window.location.origin;
  return "http://localhost";
}

function origenDe(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** Ruta dentro del mismo sitio («/obras/3?x=1#y») o "" si no es segura. Se resuelve con
 *  `new URL(…, origen)`, se exige el mismo origen y se devuelve solo pathname + search + hash.
 *  `origen` es el de la página (por defecto `window.location.origin`). */
export function rutaInterna(raw: string | null | undefined, origen?: string): string {
  if (!raw || raw.length > LARGO_MAXIMO || tieneCaracteresRaros(raw) || !raw.startsWith("/") || raw.startsWith("//")) {
    return "";
  }
  const base = origenActual(origen);
  try {
    const u = new URL(raw, base);
    if (u.origin !== new URL(base).origin) return "";
    return u.pathname + u.search + u.hash;
  } catch {
    return "";
  }
}

/** Adónde mandar a la persona después de entrar por SSO (o de cualquier redirección con
 *  «next»). Devuelve:
 *  - la ruta interna si `next` es una ruta del mismo sitio («/obras/3?tab=cobros»);
 *  - la URL completa si es https (o el mismo esquema que figura en la lista) a uno de los
 *    `origenesPermitidos` exactos (p. ej. `["https://operaciones.enersol-sa.com"]`), sin
 *    usuario ni clave en la URL;
 *  - si no, `porDefecto` ("/").
 *
 *  Nunca devuelve un dominio ajeno: ante la duda, "/". */
export function destinoSeguro(
  next: string | null | undefined,
  origenesPermitidos: readonly string[] = [],
  opciones: { origen?: string; porDefecto?: string } = {},
): string {
  const porDefecto = opciones.porDefecto ?? "/";
  if (!next) return porDefecto;
  const v = next.trim();
  if (!v || v.length > LARGO_MAXIMO || tieneCaracteresRaros(v)) return porDefecto;
  if (v.startsWith("/")) return rutaInterna(v, opciones.origen) || porDefecto;
  if (origenesPermitidos.length === 0) return porDefecto;
  try {
    const u = new URL(v);
    if (u.username || u.password) return porDefecto;
    if (u.protocol !== "https:" && u.protocol !== "http:") return porDefecto;
    const permitidos = new Set(origenesPermitidos.map(origenDe).filter((o): o is string => !!o));
    if (!permitidos.has(u.origin)) return porDefecto;
    return u.href;
  } catch {
    return porDefecto;
  }
}

/** href seguro para un `<a>` con contenido que viene de la base (menciones, pendientes): ruta
 *  del mismo sitio o https a `*.enersol-sa.com` (o a `dominio`); si no, `undefined` y el link
 *  no se muestra. */
export function safeHref(
  raw: string | null | undefined,
  opciones: { origen?: string; dominio?: string } = {},
): string | undefined {
  if (!raw) return undefined;
  const ruta = rutaInterna(raw, opciones.origen);
  if (ruta) return ruta;
  if (raw.length > LARGO_MAXIMO || tieneCaracteresRaros(raw)) return undefined;
  const dominio = (opciones.dominio ?? DOMINIO_ENERSOL).toLowerCase();
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (u.protocol !== "https:" || u.username || u.password) return undefined;
    if (host !== dominio && !host.endsWith("." + dominio)) return undefined;
    return u.href;
  } catch {
    return undefined;
  }
}
