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
    /** Oculta la columna por debajo del breakpoint (para celular). */
    hideBelow?: "sm" | "md" | "lg" | "xl";
    className?: string;
};
declare function DataTable<T>({ columns, rows, rowKey, onRowClick, defaultSort, empty, dense, rowClassName, className, 
/** Altura del header fijo de la app (para que la cabecera de la tabla se pegue debajo). */
stickyTopClassName, }: {
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

export { AppsMenu, Badge, type BadgeTone, Button, type ButtonSize, type ButtonVariant, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, type Column, DataTable, EmptyState, HUB_URL, Input, Logo, type LogoVariant, MODULOS_ENERSOL, Modal, type ModuloEnersol, PageHeader, Select, Spinner, cn };
