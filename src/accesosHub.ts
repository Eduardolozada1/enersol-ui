// Módulos que la persona tiene habilitados en el Hub, para el menú Apps de cada módulo (0.7.0).
//
// El Hub los manda en el ticket de SSO (campo `modulos`) cada vez que alguien entra a un módulo
// desde el Hub. El módulo los guarda en el navegador al recibir el ticket
// (`guardarAccesosDelTicket`) y el menú Apps los lee solo (`accesosGuardados`). Sirven ÚNICAMENTE
// para decidir qué módulos mostrar: quién entra a cada uno lo sigue decidiendo el Hub en /ir/,
// por eso se lee el ticket sin verificar su firma (de eso se encarga el backend del módulo).

const CLAVE = "enersol-accesos-hub";

/** Decodifica base64url (la parte central de un JWT) a texto. */
function base64UrlATexto(parte: string): string {
  const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
  const relleno = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(relleno);
}

function esListaDeClaves(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.length <= 50 && valor.every((v) => typeof v === "string" && /^[a-z0-9_-]{1,40}$/.test(v));
}

/** Las claves de los módulos que trae el ticket de SSO del Hub (`modulos`), o null si el ticket
 *  no las trae (un Hub de antes) o no se puede leer. */
export function accesosDelTicket(ticket: string | null | undefined): string[] | null {
  if (!ticket) return null;
  try {
    const parte = ticket.split(".")[1];
    if (!parte) return null;
    const datos = JSON.parse(base64UrlATexto(parte)) as { modulos?: unknown };
    return esListaDeClaves(datos.modulos) ? datos.modulos : null;
  } catch {
    return null;
  }
}

function almacen(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null; // navegador con el almacenamiento bloqueado
  }
}

/** Al recibir el ticket de SSO: guarda los módulos de la persona para el menú Apps. Si el ticket
 *  no los trae, borra lo guardado (nunca queda la lista de otra persona). */
export function guardarAccesosDelTicket(ticket: string | null | undefined): void {
  const modulos = accesosDelTicket(ticket);
  const a = almacen();
  if (!a) return;
  try {
    if (modulos) a.setItem(CLAVE, JSON.stringify(modulos));
    else a.removeItem(CLAVE);
  } catch {
    // sin espacio o bloqueado: el menú sigue sin los módulos restringidos
  }
}

/** Los módulos guardados en este navegador, o null si no hay. */
export function accesosGuardados(): string[] | null {
  const a = almacen();
  if (!a) return null;
  try {
    const valor = a.getItem(CLAVE);
    if (!valor) return null;
    const lista = JSON.parse(valor) as unknown;
    return esListaDeClaves(lista) ? lista : null;
  } catch {
    return null;
  }
}

/** Al cerrar la sesión: olvida los módulos guardados (la próxima persona en ese navegador no ve
 *  los de la anterior). */
export function olvidarAccesos(): void {
  const a = almacen();
  try {
    a?.removeItem(CLAVE);
  } catch {
    // nada que hacer
  }
}

/** Lo que usa el menú Apps: la prop `accesos` si el módulo la pasa (también null = ninguno) y, si
 *  no la pasa (undefined), los guardados al entrar por SSO. */
export function accesosDelMenu(accesos: readonly string[] | null | undefined): readonly string[] | null {
  return accesos === undefined ? accesosGuardados() : accesos;
}
