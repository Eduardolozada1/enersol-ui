import { useEffect, useRef } from "react";

/** Opciones de `iniciarSondeo`. Los relojes se pueden inyectar (tests). */
export type SondeoOpciones = {
  /** Cada cuánto se repite (ms). Valores raros o menores a 1 s se suben a 1 s. */
  ms: number;
  /** Llamar también al arrancar (por defecto sí). */
  inmediato?: boolean;
  /** Si devuelve false (pestaña oculta), esa vuelta se salta: no se gasta red en segundo
   *  plano. Por defecto mira `document.visibilityState`. */
  visible?: () => boolean;
  setInterval?: (fn: () => void, ms: number) => unknown;
  clearInterval?: (id: unknown) => void;
};

const MINIMO_MS = 1000;

function documentoVisible(): boolean {
  return typeof document === "undefined" || document.visibilityState !== "hidden";
}

/** Llama a `fn` cada `ms` (y al arrancar). Nunca hay dos llamadas en vuelo a la vez: si la
 *  anterior no terminó, esa vuelta se salta. Los errores de `fn` se tragan (el sondeo sigue).
 *  Al volver a la pestaña (visibilitychange) consulta enseguida en vez de esperar la vuelta.
 *  Devuelve la función para detenerlo. */
export function iniciarSondeo(fn: () => unknown, opciones: SondeoOpciones): () => void {
  const ms = Number.isFinite(opciones.ms) ? Math.max(MINIMO_MS, opciones.ms) : MINIMO_MS;
  const visible = opciones.visible ?? documentoVisible;
  const programar = opciones.setInterval ?? ((f: () => void, t: number) => setInterval(f, t));
  const cancelar = opciones.clearInterval ?? ((id: unknown) => clearInterval(id as ReturnType<typeof setInterval>));
  let enVuelo = false;
  let detenido = false;

  const vuelta = () => {
    if (detenido || enVuelo || !visible()) return;
    enVuelo = true;
    let r: unknown;
    try {
      r = fn();
    } catch {
      enVuelo = false;
      return;
    }
    if (r && typeof (r as Promise<unknown>).then === "function") {
      (r as Promise<unknown>).then(
        () => (enVuelo = false),
        () => (enVuelo = false),
      );
    } else {
      enVuelo = false;
    }
  };

  if (opciones.inmediato !== false) vuelta();
  const id = programar(vuelta, ms);
  const alVolver = () => {
    if (documentoVisible()) vuelta();
  };
  const conDocumento = typeof document !== "undefined" && !opciones.visible;
  if (conDocumento) document.addEventListener("visibilitychange", alVolver);

  return () => {
    detenido = true;
    cancelar(id);
    if (conDocumento) document.removeEventListener("visibilitychange", alVolver);
  };
}

/** Hook de `iniciarSondeo`: siempre llama a la última versión de `fn` sin reiniciar el reloj.
 *  Con `activo=false` no consulta. */
export function useSondeo(fn: () => unknown, ms: number, activo = true): void {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!activo) return;
    return iniciarSondeo(() => ref.current(), { ms });
  }, [ms, activo]);
}
