// Errores de pantalla → /api/salud/error-pantalla de cada módulo (lo revisa la rutina
// diaria). El paquete no conoce la API ni el token: cada módulo pasa `enviar`, que hace el
// POST con su sesión. Reportar NUNCA rompe la pantalla.

/** Lo que recibe el backend (`ErrorPantallaIn`: mensaje, ruta, pila). */
export type ErrorPantalla = {
  mensaje: string;
  ruta: string;
  pila: string;
};

export type ReporteErroresOpciones = {
  /** Hace el POST a `/api/salud/error-pantalla` con la sesión del módulo. Puede devolver una
   *  promesa; si falla, se ignora. El segundo argumento dice qué módulo es. */
  enviar: (error: ErrorPantalla, contexto: { app: string }) => unknown;
  /** Módulo que reporta («operaciones», «proyectos», «marketing», «hub», «cuotas»…). */
  app: string;
  /** Si devuelve false no se reporta (p. ej. sin sesión). Se consulta en cada error. */
  activo?: () => boolean;
  /** Prefijos de rutas sin sesión (login, sso, links por token): ahí no se reporta.
   *  «/p/» cubre «/p/…»; «/login» cubre «/login» y «/login/…». */
  rutasPublicas?: readonly string[];
  /** Errores que ya se muestran en pantalla o no son del sistema (p. ej. `e instanceof
   *  ApiError`). Los cortes de red del navegador ya se ignoran solos. */
  ignorar?: (motivo: unknown) => boolean;
  /** Ruta actual (por defecto `window.location.pathname`). */
  ruta?: () => string;
  /** Tope de errores distintos por sesión de la página (por defecto 20). */
  maximo?: number;
};

export type ReporteErrores = {
  /** Reporta un error (lo usan los ErrorBoundary: `componentDidCatch(e) { reportar(e) }`). */
  reportar: (error: unknown) => void;
  /** Saca los listeners globales (tests, desmontar). */
  desinstalar: () => void;
};

// Cortes de conexión del navegador (wifi, datos): no son errores del sistema.
const SIN_RED = /Failed to fetch|NetworkError|Load failed|network error/i;

function rutaActual(): string {
  return typeof window !== "undefined" && window.location ? window.location.pathname : "/";
}

function esPublica(ruta: string, prefijos: readonly string[]): boolean {
  return prefijos.some((pre) => {
    if (pre.endsWith("/")) return ruta.startsWith(pre) || ruta === pre.slice(0, -1);
    return ruta === pre || ruta.startsWith(pre + "/");
  });
}

function aError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error(err);
  try {
    return new Error(JSON.stringify(err));
  } catch {
    return new Error(String(err));
  }
}

/** Reportador sin listeners globales: lo que usa `instalarReporteErrores` por dentro. Útil en
 *  tests o si el módulo ya escucha los errores por su cuenta. */
export function crearReporteErrores(opciones: ReporteErroresOpciones): Pick<ReporteErrores, "reportar"> {
  const enviados = new Set<string>();
  const maximo = opciones.maximo ?? 20;
  const ruta = opciones.ruta ?? rutaActual;
  const publicas = opciones.rutasPublicas ?? [];

  function reportar(err: unknown): void {
    try {
      if (opciones.activo && !opciones.activo()) return;
      const r = ruta();
      if (esPublica(r, publicas)) return;
      const e = aError(err);
      const mensaje = `${e.name}: ${e.message}`.slice(0, 1900);
      if (SIN_RED.test(e.message)) return;
      const clave = `${r}|${mensaje}`;
      if (enviados.has(clave) || enviados.size >= maximo) return;
      enviados.add(clave);
      const res = opciones.enviar({ mensaje, ruta: r, pila: (e.stack ?? "").slice(0, 7900) }, { app: opciones.app });
      if (res && typeof (res as Promise<unknown>).catch === "function") (res as Promise<unknown>).catch(() => {});
    } catch {
      /* reportar nunca debe romper la pantalla */
    }
  }

  return { reportar };
}

const instalados = new Map<string, ReporteErrores>();

/** Escucha los errores globales de la página (`error` y `unhandledrejection`) y los manda con
 *  `enviar`, una vez por error y ruta. Llamarlo una vez al arrancar (main.tsx); si se llama de
 *  nuevo para la misma `app`, devuelve el mismo reportador (no duplica listeners).
 *
 *  ```ts
 *  const { reportar } = instalarReporteErrores({
 *    app: "operaciones",
 *    activo: () => !!getToken(),
 *    rutasPublicas: ["/login", "/sso", "/n/"],
 *    ignorar: (e) => e instanceof ApiError,
 *    enviar: (error) => fetch("/api/salud/error-pantalla", { method: "POST", keepalive: true,
 *      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
 *      body: JSON.stringify(error) }),
 *  });
 *  ``` */
export function instalarReporteErrores(opciones: ReporteErroresOpciones): ReporteErrores {
  const previo = instalados.get(opciones.app);
  if (previo) return previo;
  const { reportar } = crearReporteErrores(opciones);
  const ignorar = opciones.ignorar;

  const enError = (ev: ErrorEvent) => {
    const motivo = ev.error ?? ev.message;
    if (ignorar?.(motivo)) return;
    reportar(motivo);
  };
  const enPromesa = (ev: PromiseRejectionEvent) => {
    const motivo = ev.reason;
    if (ignorar?.(motivo)) return;
    // Convención de Proyectos: los errores del cliente de API llevan `deApi` (ya se muestran).
    if (motivo && typeof motivo === "object" && (motivo as { deApi?: unknown }).deApi) return;
    reportar(motivo);
  };

  const conVentana = typeof window !== "undefined" && typeof window.addEventListener === "function";
  if (conVentana) {
    window.addEventListener("error", enError);
    window.addEventListener("unhandledrejection", enPromesa);
  }
  const instalado: ReporteErrores = {
    // Directo (ErrorBoundary): un error que rompió la pantalla se reporta siempre.
    reportar,
    desinstalar: () => {
      if (conVentana) {
        window.removeEventListener("error", enError);
        window.removeEventListener("unhandledrejection", enPromesa);
      }
      instalados.delete(opciones.app);
    },
  };
  instalados.set(opciones.app, instalado);
  return instalado;
}
