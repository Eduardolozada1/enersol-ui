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
type LogoVariant = "imagotipo-color" | "imagotipo-blanco" | "isotipo-color" | "isotipo-app";
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

/** Los módulos del ecosistema Enersol (Distribución queda fuera). El orden es el del
 *  lanzador del Hub. Los links pasan por el Hub (`/ir/<clave>`), que emite el ticket de
 *  SSO y redirige: un solo lugar decide quién entra a qué. */
type ModuloEnersol = {
    clave: string;
    nombre: string;
    url: string;
    descripcion: string;
};
declare const HUB_URL = "https://app.enersol-sa.com";
declare const MODULOS_ENERSOL: ModuloEnersol[];
/** Menú «Apps»: saltar entre módulos sin volver al lanzador. Va junto al logo en el
 *  header de cada módulo. Los destinos pasan por el Hub para el SSO. */
declare function AppsMenu({ actual, hubUrl, modulos, className, }: {
    /** Clave del módulo donde estamos (se marca y no linkea). */
    actual: string;
    hubUrl?: string;
    modulos?: ModuloEnersol[];
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
/** ¿La ruta actual es esta sección? Exacta o una subruta («/ventas» y «/ventas/12»), más
 *  lo que diga `match`. «/» solo es actual en «/». */
declare function isAppHeaderItemActive(item: AppHeaderItem, path: string): boolean;
/** Agrupa las secciones: las de la barra y los grupos del «Más», en el orden en que vienen. */
declare function groupAppHeaderItems(items: AppHeaderItem[]): {
    main: AppHeaderItem[];
    groups: Array<[string, AppHeaderItem[]]>;
};
/** Encabezado unificado del ecosistema Enersol (blanco, `border-b`, Apps + logo h-7 +
 *  separador + nombre del módulo, navegación en texto con la actual en `text-brand`, sin
 *  pastillas; a la derecha las acciones, el usuario y «Salir»).
 *
 *  Por debajo de `desktopFrom` (por defecto `lg`) la barra se reemplaza por el menú ☰
 *  (MobileMenu) con TODAS las secciones agrupadas, el usuario y «Salir»: en el celular
 *  nunca hay scroll lateral. Las secciones con `group` van en el desplegable «Más» de la
 *  barra de escritorio. Sin dependencias de router: cada módulo pasa `renderLink`. */
declare function AppHeader({ moduleKey, moduleName, logo, homeHref, items, currentPath, renderLink, notice, persistentActions, actions, user, onLogout, mobileMenuFooter, desktopFrom, moreLabel, hubUrl, className, }: {
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

export { AppHeader, type AppHeaderBreakpoint, type AppHeaderItem, type AppHeaderLinkProps, AppsMenu, Badge, type BadgeTone, Button, type ButtonSize, type ButtonVariant, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, type Column, ConfirmDialog, type ConfirmOptions, type ConfirmReason, type ConfirmResult, type ConfirmTone, DataTable, EmptyState, HUB_URL, Input, Logo, type LogoVariant, MODULOS_ENERSOL, MobileMenu, MobileMenuSection, Modal, type ModuloEnersol, PageHeader, Pagination, type PaginationRange, Select, Spinner, cn, groupAppHeaderItems, isAppHeaderItemActive, mobileMenuItemClass, paginationRange, useConfirm };
