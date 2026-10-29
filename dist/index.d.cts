import * as react from 'react';
import { HTMLAttributes, ButtonHTMLAttributes, ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

/** Une clases condicionalmente, sin dependencias externas. */
declare function cn(...parts: Array<string | false | null | undefined>): string;

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";
declare function Button({ variant, size, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
}): react.JSX.Element;
/** Card utilitaria: superficie blanca, borde sobrio, sombra ligera. */
declare function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
declare function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
declare function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
/** Tono del badge/status-pill. Paleta oficial, SIN tintes rosados:
 * - neutro: estado normal/info (gris)
 * - rojo: error / trabado → ROJO SÓLIDO (serio, no salmón)
 * - verde: completado / OK (único acento suave)
 * - atencion: requiere acción/precaución → ÁMBAR (semántica universal)
 * - marca: identidad (super-admin, "al cliente"): rojo en contorno, NO es un error */
type BadgeTone = "neutro" | "rojo" | "verde" | "atencion" | "marca";
declare function Badge({ tone, className, ...props }: HTMLAttributes<HTMLSpanElement> & {
    tone?: BadgeTone;
}): react.JSX.Element;
declare function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): react.JSX.Element;
declare function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>): react.JSX.Element;
declare function Spinner({ className }: {
    className?: string;
}): react.JSX.Element;
declare function CenteredSpinner(): react.JSX.Element;
type LogoVariant = "imagotipo-color" | "imagotipo-blanco" | "isotipo-color" | "isotipo-app" | "bloque-color" | "bloque-negativo";
/** Marca Enersol. Usar tal cual se entrega, sin alterar proporciones/colores (regla dura
 * del manual). Cada módulo sirve los archivos en `/brand/*.svg|png`; usa el SVG si existe
 * y cae al PNG si no. */
declare function Logo({ variant, className, alt, base, }: {
    variant?: LogoVariant;
    className?: string;
    alt?: string;
    /** Carpeta pública con los archivos de marca. */
    base?: string;
}): react.JSX.Element;
declare function Modal({ open, onClose, title, children, maxWidth, }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: string;
}): react.JSX.Element | null;
/** Estado vacío único para listas y tablas: qué no hay, por qué (opcional) y qué hacer
 *  (opcional). Un solo patrón en toda la app. */
declare function EmptyState({ title, hint, action, className, }: {
    title: ReactNode;
    hint?: ReactNode;
    action?: ReactNode;
    className?: string;
}): react.JSX.Element;
/** Cabecera de página COMPACTA (una línea): título, contador, filtros y acciones. En una
 *  herramienta de trabajo el título se lee una vez; los filtros y el botón principal se
 *  usan cien veces, así que van pegados al título. Envuelve sola en pantallas angostas. */
declare function PageHeader({ title, count, subtitle, filters, actions, className, }: {
    title: ReactNode;
    /** Texto corto junto al título (p.ej. "5 obras"). */
    count?: ReactNode;
    /** Una línea de contexto, solo si aporta algo que el título no dice. */
    subtitle?: ReactNode;
    filters?: ReactNode;
    actions?: ReactNode;
    className?: string;
}): react.JSX.Element;
/** Tarjeta colapsable (acordeón). El `summary` es la regla de oro: el estado de la
 *  sección se lee SIN abrirla (cuántos documentos, saldo, última fecha). Las acciones a la
 *  derecha NO togglean la tarjeta. */
declare function CollapsibleCard({ title, summary, right, defaultOpen, bodyClassName, className, children, }: {
    title: ReactNode;
    summary?: ReactNode;
    right?: ReactNode;
    defaultOpen?: boolean;
    bodyClassName?: string;
    className?: string;
    children: ReactNode;
}): react.JSX.Element;

/** Tabla de datos estándar del ecosistema: orden por columna, cabecera fija al hacer
 *  scroll, fila clicable (mouse y teclado), dígitos tabulares en las columnas numéricas y
 *  estado vacío. Toda lista "de trabajo" usa esta tabla para comportarse igual. */
type Column<T> = {
    key: string;
    header: ReactNode;
    render: (row: T) => ReactNode;
    /** Valor para ordenar; si falta, la columna no ordena. */
    sortValue?: (row: T) => string | number | null | undefined;
    align?: "left" | "right" | "center";
    /** Ancho CSS opcional (p.ej. "140px", "20%"). */
    width?: string;
    /** Oculta la columna por debajo del breakpoint (en la vista de tabla). */
    hideBelow?: "sm" | "md" | "lg" | "xl";
    className?: string;
    /** Vista de tarjetas en el celular: "titulo" = encabeza la tarjeta (por defecto la primera
     *  columna), "oculta" = no se muestra en la tarjeta, "dato" = par etiqueta/valor (default). */
    tarjeta?: "titulo" | "dato" | "oculta";
    /** Etiqueta en la tarjeta si el header no es texto o no sirve (p.ej. columna de acciones). */
    etiquetaTarjeta?: ReactNode;
};
declare function DataTable<T>({ columns, rows, rowKey, onRowClick, defaultSort, empty, dense, rowClassName, className, 
/** Altura del header fijo de la app (para que la cabecera de la tabla se pegue debajo). */
stickyTopClassName, 
/** En el celular (< 640 px): "tarjetas" (cada fila es una tarjeta con sus datos) o
 *  "tabla" (la tabla de siempre, con scroll lateral dentro de su tarjeta). */
movil, }: {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
    onRowClick?: (row: T) => void;
    defaultSort?: {
        key: string;
        dir: "asc" | "desc";
    };
    empty?: {
        title: ReactNode;
        hint?: ReactNode;
        action?: ReactNode;
    };
    dense?: boolean;
    rowClassName?: (row: T) => string | undefined;
    className?: string;
    stickyTopClassName?: string;
    movil?: "tarjetas" | "tabla";
}): react.JSX.Element;

/** Los módulos del ecosistema Enersol. El orden es el del lanzador del Hub. Los links pasan
 *  por el Hub (`/ir/<clave>`), que emite el ticket de SSO y redirige: un solo lugar decide quién
 *  entra a qué. */
type ModuloEnersol = {
    clave: string;
    nombre: string;
    url: string;
    descripcion: string;
    /** Solo se lista a quien tiene el módulo habilitado en el Hub (`accesos` del menú) y en el
     *  propio módulo. Distribución: admin, contabilidad y sus ejecutivos (Eduardo, 29/10/2026). */
    soloConAcceso?: boolean;
};
declare const HUB_URL = "https://app.enersol-sa.com";
declare const MODULOS_ENERSOL: ModuloEnersol[];
/** Los módulos que ve esta persona: los de siempre, y los `soloConAcceso` si los tiene
 *  habilitados (`accesos`, claves del Hub) o si está en ese módulo. Sin `accesos`, ninguno de
 *  esos: el módulo que no sabe los accesos de la persona no los muestra. */
declare function modulosVisibles(modulos: ModuloEnersol[], actual: string, accesos?: readonly string[] | null): ModuloEnersol[];
/** Menú «Apps»: saltar entre módulos sin volver al lanzador. Va junto al logo en el
 *  header de cada módulo. Los destinos pasan por el Hub para el SSO. */
declare function AppsMenu({ actual, hubUrl, modulos, accesos, className, }: {
    /** Clave del módulo donde estamos (se marca y no linkea). */
    actual: string;
    hubUrl?: string;
    modulos?: ModuloEnersol[];
    /** Claves de los módulos que la persona tiene habilitados en el Hub (las del lanzador). Hace
     *  falta para listar los `soloConAcceso`; sin ella, esos no se muestran. */
    accesos?: readonly string[] | null;
    className?: string;
}): react.JSX.Element;

/** Menú del encabezado para celular y tablet (se usa con `lg:hidden`; en escritorio cada
 *  módulo sigue mostrando su barra de navegación de siempre). Un botón ☰ abre una hoja a la
 *  derecha con los links del módulo y las acciones secundarias (guía, Mejoras, usuario,
 *  salir). Se cierra al tocar cualquier link, con Escape o tocando afuera.
 *
 *  Los links los arma cada módulo (con su router) usando `mobileMenuItemClass` para que
 *  todos se vean y se toquen igual (filas de 48 px). */
declare function MobileMenu({ children, title, footer, className, }: {
    children: ReactNode;
    title?: ReactNode;
    /** Zona de abajo (usuario, cambiar clave, salir). */
    footer?: ReactNode;
    className?: string;
}): react.JSX.Element;
/** Clase de cada fila del MobileMenu (link o botón): 48 px de alto, texto de 16 px. */
declare function mobileMenuItemClass(activo?: boolean): string;
/** Título de grupo dentro del MobileMenu (p.ej. «Administración»). */
declare function MobileMenuSection({ children }: {
    children: ReactNode;
}): react.JSX.Element;

/** Una sección del módulo. Sin `group` va en la barra; con `group`, en el desplegable «Más»
 *  (escritorio) bajo el título del grupo, y en el menú ☰ del celular bajo ese mismo título.
 *  Así un módulo con muchas secciones nunca necesita scroll lateral en el encabezado. */
type AppHeaderItem = {
    href: string;
    label: ReactNode;
    group?: string;
    /** Otras rutas que también marcan la sección como actual (p. ej. "/" para el Tablero). */
    match?: (path: string) => boolean;
};
/** Props que recibe `renderLink`: el módulo arma el link con SU router (Link, NavLink…). */
type AppHeaderLinkProps = {
    href: string;
    className: string;
    children: ReactNode;
    "aria-current"?: "page";
    role?: string;
    onClick?: () => void;
};
/** Desde qué ancho se ve la barra de escritorio; por debajo, el menú ☰. Clases escritas
 *  enteras (no armadas) para que Tailwind las encuentre al escanear el paquete. */
type AppHeaderBreakpoint = "lg" | "xl" | "2xl";
/** Cómo se marca la sección actual en la barra de escritorio: «texto» (el ítem en color de
 *  marca, como siempre) o «subrayado» (texto `brand-text` y una barra `bg-brand` de 3 px pegada al
 *  borde inferior del encabezado: para una marca cuyo color no sirve como texto sobre blanco,
 *  como el amarillo de Distribución). */
type AppHeaderIndicador = "texto" | "subrayado";
/** ¿La ruta actual es esta sección? Exacta o una subruta («/ventas» y «/ventas/12»), más
 *  lo que diga `match`. «/» solo es actual en «/». */
declare function isAppHeaderItemActive(item: AppHeaderItem, path: string): boolean;
/** Agrupa las secciones: las de la barra y los grupos del «Más», en el orden en que vienen. */
declare function groupAppHeaderItems(items: AppHeaderItem[]): {
    main: AppHeaderItem[];
    groups: Array<[string, AppHeaderItem[]]>;
};
/** Encabezado unificado del ecosistema Enersol (blanco, `border-b`, Apps + logo h-7 +
 *  separador + nombre del módulo, navegación en texto con la actual en `text-brand-text` (o
 *  subrayada, `indicador`), sin pastillas; a la derecha las acciones, el usuario y «Salir»).
 *
 *  Por debajo de `desktopFrom` (por defecto `lg`) la barra se reemplaza por el menú ☰
 *  (MobileMenu) con TODAS las secciones agrupadas, el usuario y «Salir»: en el celular
 *  nunca hay scroll lateral. Las secciones con `group` van en el desplegable «Más» de la
 *  barra de escritorio. Sin dependencias de router: cada módulo pasa `renderLink`. */
declare function AppHeader({ moduleKey, moduleName, logo, homeHref, items, currentPath, renderLink, notice, persistentActions, actions, user, onLogout, mobileMenuFooter, desktopFrom, moreLabel, hubUrl, accesos, indicador, mostrarApps, mostrarNombre, className, }: {
    /** Clave del módulo en el menú Apps (p. ej. "contabilidad"). */
    moduleKey: string;
    moduleName: ReactNode;
    /** El imagotipo del módulo (h-7), tal como lo entrega la marca. */
    logo: ReactNode;
    homeHref?: string;
    items: AppHeaderItem[];
    currentPath: string;
    renderLink?: (props: AppHeaderLinkProps) => ReactNode;
    /** Aviso arriba de todo (p. ej. «tu usuario no tiene permisos»): en ámbar, no es un error. */
    notice?: ReactNode;
    /** Visibles en escritorio Y en el celular (mensajes, guía ❓). */
    persistentActions?: ReactNode;
    /** Solo en la barra de escritorio (en el celular van en `mobileMenuFooter`). */
    actions?: ReactNode;
    user?: {
        name: ReactNode;
        email?: string;
    } | null;
    onLogout?: () => void;
    /** Filas extra al pie del menú ☰ (usar `mobileMenuItemClass()`; `data-cierra` lo cierra). */
    mobileMenuFooter?: ReactNode;
    desktopFrom?: AppHeaderBreakpoint;
    moreLabel?: ReactNode;
    hubUrl?: string;
    /** Módulos que la persona tiene habilitados en el Hub (para los del menú Apps que solo ve quien
     *  tiene acceso, como Distribución). Ver `AppsMenu`. */
    accesos?: readonly string[] | null;
    /** Cómo se marca la sección actual en la barra de escritorio (por defecto, «texto»). */
    indicador?: AppHeaderIndicador;
    /** Menú Apps (módulos del ecosistema). En falso para quien no es personal de Enersol (los
     *  clientes externos de un portal no ven los módulos internos). */
    mostrarApps?: boolean;
    /** Nombre del módulo al lado del logo. En falso cuando el logo ya lo dice (el imagotipo de una
     *  división, «enersol distribución»); el menú ☰ lo sigue usando como título. */
    mostrarNombre?: boolean;
    className?: string;
}): react.JSX.Element;

/** Tono de la confirmación: "primary" para confirmar algo normal (registrar, aprobar) y
 *  "danger" para lo destructivo o irreversible (anular, revertir, borrar): solo ahí el botón
 *  va en rojo, y el foco arranca en «Cancelar». */
type ConfirmTone = "primary" | "danger";
/** Motivo escrito obligatorio u opcional (anulaciones, reaperturas): queda en auditoría. */
type ConfirmReason = {
    label: ReactNode;
    placeholder?: string;
    /** Si es obligatorio, «Confirmar» no se habilita hasta que tenga `minLength` letras. */
    required?: boolean;
    minLength?: number;
};
/** Diálogo de confirmación del ecosistema: reemplaza a window.confirm / window.prompt.
 *  Dice qué va a pasar, pide el motivo si hace falta y, si `onConfirm` devuelve una
 *  promesa, muestra «Procesando…» y bloquea los botones hasta que termine (un doble clic
 *  no manda dos veces); si la promesa falla, el error se ve en el diálogo y sigue abierto.
 *  Escape o tocar afuera cancelan (salvo mientras procesa); el foco queda adentro (Tab da
 *  la vuelta) y al cerrar vuelve a donde estaba. En el celular es una hoja que sube desde
 *  abajo, como Modal. */
declare function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel, tone, reason, busy, error, onConfirm, onCancel, }: {
    open: boolean;
    title: ReactNode;
    /** Qué va a pasar y qué no se puede deshacer. */
    children?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    tone?: ConfirmTone;
    reason?: ConfirmReason;
    /** Procesando desde afuera (además del estado propio cuando onConfirm es async). */
    busy?: boolean;
    /** Error que viene de afuera (además del que captura de onConfirm). */
    error?: ReactNode;
    onConfirm: (reason: string) => void | Promise<unknown>;
    onCancel: () => void;
}): react.JSX.Element | null;
type ConfirmOptions = {
    title: ReactNode;
    message?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    tone?: ConfirmTone;
    reason?: ConfirmReason;
};
/** Resultado de `confirm(...)`: si confirmó y el motivo escrito (vacío si no se pidió). */
type ConfirmResult = {
    confirmed: boolean;
    reason: string;
};
/** Confirmación como promesa, para reemplazar `window.confirm` / `window.prompt` sin armar
 *  estado en cada pantalla:
 *
 *    const [confirm, dialog] = useConfirm();
 *    const r = await confirm({ title: "¿Anular la venta?", tone: "danger", reason: { label: "Motivo", required: true } });
 *    if (r.confirmed) await api.post(..., { motivo: r.reason });
 *    …
 *    return <>{dialog}…</>;
 *
 *  La acción corre DESPUÉS de cerrar el diálogo: sus errores los muestra la pantalla. */
declare function useConfirm(): [(options: ConfirmOptions) => Promise<ConfirmResult>, ReactNode];

/** Página de un listado: qué filas se ven y qué botones de página dibujar. Función pura
 *  (sin React) para que cada módulo la pueda usar y probar igual que el componente. */
type PaginationRange = {
    /** Página actual, desde 1. */
    page: number;
    /** Cantidad de páginas (al menos 1, aunque no haya filas). */
    pages: number;
    /** Número (desde 1) de la primera fila que se ve; 0 si no hay filas. */
    from: number;
    /** Número de la última fila que se ve. */
    to: number;
    /** Botones de página a dibujar: números y "…" donde se saltan páginas. */
    items: Array<number | "…">;
};
declare function paginationRange(total: number, pageSize: number, offset: number, siblings?: number): PaginationRange;
/** Paginación de un listado con total: «Mostrando 51–100 de 251 ventas» y los botones
 *  Anterior / páginas / Siguiente. Trabaja con `offset` (desplazamiento) y `pageSize`
 *  (límite), igual que la API: `onChange` recibe el nuevo desplazamiento.
 *
 *  En el celular (< 640 px) los números de página se reemplazan por «Página 2 de 6» para
 *  que nunca haya scroll lateral; los botones miden 44 px con puntero táctil. Con una sola
 *  página solo se muestra el total. */
declare function Pagination({ total, pageSize, offset, onChange, itemLabel, disabled, className, }: {
    total: number;
    pageSize: number;
    offset: number;
    onChange: (offset: number) => void;
    /** Cómo se llaman las filas, en singular y plural: ["venta", "ventas"]. */
    itemLabel?: [string, string];
    /** Mientras carga la página nueva, para no pedir dos a la vez. */
    disabled?: boolean;
    className?: string;
}): react.JSX.Element;

/** Dominio de Enersol: los https a este dominio o a sus subdominios son links válidos en el
 *  contenido (menciones, pendientes). */
declare const DOMINIO_ENERSOL = "enersol-sa.com";
/** Ruta dentro del mismo sitio («/obras/3?x=1#y») o "" si no es segura. Se resuelve con
 *  `new URL(…, origen)`, se exige el mismo origen y se devuelve solo pathname + search + hash.
 *  `origen` es el de la página (por defecto `window.location.origin`). */
declare function rutaInterna(raw: string | null | undefined, origen?: string): string;
/** Adónde mandar a la persona después de entrar por SSO (o de cualquier redirección con
 *  «next»). Devuelve:
 *  - la ruta interna si `next` es una ruta del mismo sitio («/obras/3?tab=cobros»);
 *  - la URL completa si es https (o el mismo esquema que figura en la lista) a uno de los
 *    `origenesPermitidos` exactos (p. ej. `["https://operaciones.enersol-sa.com"]`), sin
 *    usuario ni clave en la URL;
 *  - si no, `porDefecto` ("/").
 *
 *  Nunca devuelve un dominio ajeno: ante la duda, "/". */
declare function destinoSeguro(next: string | null | undefined, origenesPermitidos?: readonly string[], opciones?: {
    origen?: string;
    porDefecto?: string;
}): string;
/** href seguro para un `<a>` con contenido que viene de la base (menciones, pendientes): ruta
 *  del mismo sitio o https a `*.enersol-sa.com` (o a `dominio`); si no, `undefined` y el link
 *  no se muestra. */
declare function safeHref(raw: string | null | undefined, opciones?: {
    origen?: string;
    dominio?: string;
}): string | undefined;

/** Opciones de `iniciarSondeo`. Los relojes se pueden inyectar (tests). */
type SondeoOpciones = {
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
/** Llama a `fn` cada `ms` (y al arrancar). Nunca hay dos llamadas en vuelo a la vez: si la
 *  anterior no terminó, esa vuelta se salta. Los errores de `fn` se tragan (el sondeo sigue).
 *  Al volver a la pestaña (visibilitychange) consulta enseguida en vez de esperar la vuelta.
 *  Devuelve la función para detenerlo. */
declare function iniciarSondeo(fn: () => unknown, opciones: SondeoOpciones): () => void;
/** Hook de `iniciarSondeo`: siempre llama a la última versión de `fn` sin reiniciar el reloj.
 *  Con `activo=false` no consulta. */
declare function useSondeo(fn: () => unknown, ms: number, activo?: boolean): void;

/** Lo que recibe el backend (`ErrorPantallaIn`: mensaje, ruta, pila). */
type ErrorPantalla = {
    mensaje: string;
    ruta: string;
    pila: string;
};
type ReporteErroresOpciones = {
    /** Hace el POST a `/api/salud/error-pantalla` con la sesión del módulo. Puede devolver una
     *  promesa; si falla, se ignora. El segundo argumento dice qué módulo es. */
    enviar: (error: ErrorPantalla, contexto: {
        app: string;
    }) => unknown;
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
type ReporteErrores = {
    /** Reporta un error (lo usan los ErrorBoundary: `componentDidCatch(e) { reportar(e) }`). */
    reportar: (error: unknown) => void;
    /** Saca los listeners globales (tests, desmontar). */
    desinstalar: () => void;
};
/** Reportador sin listeners globales: lo que usa `instalarReporteErrores` por dentro. Útil en
 *  tests o si el módulo ya escucha los errores por su cuenta. */
declare function crearReporteErrores(opciones: ReporteErroresOpciones): Pick<ReporteErrores, "reportar">;
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
declare function instalarReporteErrores(opciones: ReporteErroresOpciones): ReporteErrores;

/** Cliente de API del módulo. `get`/`post` reciben la ruta YA con el prefijo
 *  (`${prefijo}/unread`) y devuelven el JSON; si falla, rechazan la promesa. */
type MensajesApi = {
    get: <T = unknown>(path: string) => Promise<T>;
    post: <T = unknown>(path: string, body: unknown) => Promise<T>;
};
type MensajesHilo = {
    con_email: string;
    con_nombre: string;
    ultimo_cuerpo: string;
    ultimo_at: string;
    no_leidos: number;
};
type MensajesMensaje = {
    id: number;
    de_email: string;
    de_nombre: string;
    para_email: string;
    tipo: string;
    cuerpo: string;
    context_url: string | null;
    context_label: string | null;
    leido: boolean;
    created_at: string;
};
type MensajesPersona = {
    email: string;
    nombre: string;
};
/** Evento de ventana que abre el panel desde cualquier lado (p. ej. la fila «N mensajes sin
 *  leer» de Mi día): `window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_MENSAJES))`. */
declare const EVENTO_ABRIR_MENSAJES = "enersol:abrir-mensajes";
/** Rutas que usa el sobre, a partir del prefijo («/msg», «/mensajes», «/api/mensajes»). */
declare function rutasMensajes(prefijo: string): {
    unread: string;
    threads: string;
    thread: (conEmail: string) => string;
    menciones: string;
    leer: string;
    leerThread: string;
    send: string;
    directorio: string;
};
/** «99+» desde 100; vacío si no hay nada. */
declare function textoContador(total: number): string;
type MessagesBellProps = {
    /** Cliente de API del módulo (con la sesión). */
    api: MensajesApi;
    /** Email del usuario (para saber qué burbujas son suyas). */
    selfEmail: string;
    /** Prefijo de las rutas: «/msg» en el Hub, «/mensajes» en los módulos (por defecto). */
    prefijo?: string;
    /** Cada cuánto se consulta el contador (ms). Por defecto 30 s. */
    pollMs?: number;
    /** Versión fila del menú ☰ («✉ Mensajes» + contador); el panel se abre a pantalla completa
     *  encima del menú. */
    enMenu?: boolean;
    /** Hasta qué ancho el panel ocupa toda la pantalla: «sm» (por defecto) o «lg». */
    pantallaCompletaHasta?: "sm" | "lg";
    /** Si el Hub no responde, el sobre se esconde solo (por defecto sí). */
    ocultarSiFalla?: boolean;
    /** Dominio aceptado en los links de las menciones (además de las rutas del mismo sitio). */
    dominioEnlaces?: string;
    className?: string;
};
declare function MessagesBell({ api: apiProp, selfEmail, prefijo, pollMs, enMenu, pantallaCompletaHasta, ocultarSiFalla, dominioEnlaces, className, }: MessagesBellProps): react.JSX.Element | null;

type SugerenciaTipo = "mejora" | "error";
/** Lo que espera `POST /sugerencias` (Hub y módulos). */
type SugerenciaPayload = {
    tipo: SugerenciaTipo;
    descripcion: string;
    /** Pantalla desde donde se mandó (pathname + search). */
    url: string;
    /** data URL («data:image/png;base64,…») o null. */
    captura_b64: string | null;
    captura_nombre: string | null;
    captura_tipo: string | null;
};
/** Tope de la captura: 4 MB (el Hub rechaza lo que pase de ahí). */
declare const SUGERENCIA_MAX_BYTES: number;
/** Formatos de captura que acepta el Hub. */
declare const SUGERENCIA_TIPOS_CAPTURA: readonly ["image/png", "image/jpeg", "image/webp"];
/** Valida antes de mandar. Devuelve el mensaje de error (en español) o null si está bien. */
declare function validarSugerencia(datos: {
    descripcion: string;
    captura?: {
        size: number;
        type?: string;
    } | null;
}, maxBytes?: number): string | null;
type SugerenciaEnviar = (payload: SugerenciaPayload) => unknown;
/** Botón «💡 Mejoras» + su modal. `variante="boton"` va en el encabezado de escritorio;
 *  `variante="menu"` es la fila del menú ☰ del celular («💡 Mejoras y errores», 48 px). */
declare function SugerenciaBoton({ onEnviar, variante, className, textoGracias, maxBytes, }: {
    /** Manda el payload a la API del módulo. Si la promesa falla, su `message` se muestra. */
    onEnviar: SugerenciaEnviar;
    variante?: "boton" | "menu";
    className?: string;
    textoGracias?: string;
    maxBytes?: number;
}): react.JSX.Element;
/** El formulario de «Mejoras y errores» suelto (para abrirlo desde otro lado, p. ej. una fila
 *  del menú ☰ que cierra el menú antes de abrirlo). */
declare function SugerenciaModal({ open, onClose, onEnviar, textoGracias, maxBytes, url, }: {
    open?: boolean;
    onClose: () => void;
    onEnviar: SugerenciaEnviar;
    textoGracias?: string;
    maxBytes?: number;
    /** Pantalla que se informa (por defecto la actual: pathname + search). */
    url?: string;
}): react.JSX.Element;

/** Una guía del catálogo. Con `render` se dibuja eso; si no, `intro` + `pasos` + `notas`. */
type Guia = {
    id: string;
    titulo: string;
    /** Emoji o ícono corto junto al título. */
    icono?: string;
    intro?: string;
    /** «Quién lo ve». */
    quien?: string;
    /** Pasos numerados, con «**negritas**». */
    pasos?: readonly string[];
    /** Notas al pie, con «**negritas**». */
    notas?: readonly string[];
    /** Contenido propio (JSX); reemplaza intro/pasos/notas. */
    render?: () => ReactNode;
    /** ¿Corresponde a esta ruta? Recibe la ruta sin barra final («/obras/3»; la raíz es «/»). */
    match: (path: string) => boolean;
};
/** Ruta sin barras finales (la raíz queda «/»). */
declare function normalizarRuta(path: string): string;
/** Todas las guías que corresponden a la ruta, en el orden del catálogo. Un `match` que falla
 *  no rompe el panel (se trata como «no corresponde»). */
declare function guiasPorRuta<G extends Pick<Guia, "match">>(guias: readonly G[], path: string): G[];
/** Ayuda para `match`: la ruta exacta o cualquier subruta («/obras» → «/obras», «/obras/3»). */
declare function rutaEmpieza(prefijo: string): (path: string) => boolean;
/** Partes de un texto con «**negritas**»: `[{ texto, negrita }]`. Un «**» sin cerrar queda
 *  como texto. */
declare function partirNegritas(texto: string): Array<{
    texto: string;
    negrita: boolean;
}>;
/** «**negrita**» dentro de un texto → `<b>`. */
declare function conNegritas(texto: string): ReactNode;
declare function IconoGuia({ className }: {
    className?: string;
}): react.JSX.Element;
/** Dibuja una guía (de datos o con render). */
declare function GuiaContenido({ guia }: {
    guia: Guia;
}): react.JSX.Element;
type GuiaPanelProps = {
    open: boolean;
    onClose: () => void;
    /** Catálogo de guías del módulo. */
    guias: readonly Guia[];
    /** Ruta actual (`useLocation().pathname`). */
    path: string;
    /** Guía a mostrar cuando ninguna corresponde a la ruta (id). Por defecto la primera. */
    porDefecto?: string;
    /** Abrir directamente esta guía (id), sin mirar la ruta. */
    guiaId?: string | null;
    /** Lista «Ver la guía de otra pantalla» con todo el catálogo (por defecto sí, si hay alguna
     *  guía de datos; no en catálogos solo con render(), que tienen su página /guia). Con `filtrar` se esconden guías de esa lista (p. ej. las de super-admin). */
    elegirOtra?: boolean;
    filtrar?: (g: Guia) => boolean;
    /** Varias guías para la ruta: «pestanas» (una a la vez, con botones) o «todas» (una debajo
     *  de la otra). */
    multiples?: "pestanas" | "todas";
    /** Link a la guía completa del módulo (con el router del módulo), arriba del panel. */
    enlaceGuiaCompleta?: ReactNode;
    /** Algo fijo al pie del contenido (nota del menú ☰, contacto…). */
    pie?: ReactNode;
};
/** Panel lateral de la guía (derecha, 520 px; en el celular a pantalla completa con safe-area).
 *  Escape o tocar afuera lo cierran; el foco entra al panel y vuelve al botón al cerrar. */
declare function GuiaPanel({ open, onClose, guias, path, porDefecto, guiaId, elegirOtra, filtrar, multiples, enlaceGuiaCompleta, pie, }: GuiaPanelProps): react.JSX.Element | null;
/** Botón ❓ + panel. `variante="icono"` es el ❓ del encabezado; `variante="menu"` es la fila
 *  «❓ Guía de esta pantalla» del menú ☰ (no cierra el menú: el panel se abre encima).
 *  Con `open`/`onOpenChange` se controla desde afuera; `sinBoton` deja solo el panel. */
declare function GuiaBoton({ variante, className, ocultarEn, open: openProp, onOpenChange, sinBoton, ...panel }: Omit<GuiaPanelProps, "open" | "onClose"> & {
    variante?: "icono" | "menu";
    className?: string;
    /** Rutas donde el botón no aparece (p. ej. la guía completa: `(p) => p.startsWith("/guia")`). */
    ocultarEn?: (path: string) => boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    sinBoton?: boolean;
}): react.JSX.Element | null;

export { AppHeader, type AppHeaderBreakpoint, type AppHeaderIndicador, type AppHeaderItem, type AppHeaderLinkProps, AppsMenu, Badge, type BadgeTone, Button, type ButtonSize, type ButtonVariant, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, type Column, ConfirmDialog, type ConfirmOptions, type ConfirmReason, type ConfirmResult, type ConfirmTone, DOMINIO_ENERSOL, DataTable, EVENTO_ABRIR_MENSAJES, EmptyState, type ErrorPantalla, type Guia, GuiaBoton, GuiaContenido, GuiaPanel, type GuiaPanelProps, HUB_URL, IconoGuia, Input, Logo, type LogoVariant, MODULOS_ENERSOL, type MensajesApi, type MensajesHilo, type MensajesMensaje, type MensajesPersona, MessagesBell, type MessagesBellProps, MobileMenu, MobileMenuSection, Modal, type ModuloEnersol, PageHeader, Pagination, type PaginationRange, type ReporteErrores, type ReporteErroresOpciones, SUGERENCIA_MAX_BYTES, SUGERENCIA_TIPOS_CAPTURA, Select, type SondeoOpciones, Spinner, SugerenciaBoton, type SugerenciaEnviar, SugerenciaModal, type SugerenciaPayload, type SugerenciaTipo, cn, conNegritas, crearReporteErrores, destinoSeguro, groupAppHeaderItems, guiasPorRuta, iniciarSondeo, instalarReporteErrores, isAppHeaderItemActive, mobileMenuItemClass, modulosVisibles, normalizarRuta, paginationRange, partirNegritas, rutaEmpieza, rutaInterna, rutasMensajes, safeHref, textoContador, useConfirm, useSondeo, validarSugerencia };
