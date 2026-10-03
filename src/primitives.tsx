import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";

// ── Button ──────────────────────────────────────────────────────────────────
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Rojo manda pero no satura: primario sólido, el resto sobrio. UN primario por pantalla.
  primary: "bg-brand text-white hover:bg-brand-fg focus-visible:ring-rojo-300",
  secondary: "bg-white text-ink border border-line hover:bg-neutro-50 focus-visible:ring-neutro-200",
  ghost: "bg-transparent text-ink hover:bg-neutro-100 focus-visible:ring-neutro-200",
  danger: "bg-rojo-600 text-white hover:bg-rojo-700 focus-visible:ring-rojo-300",
};
const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-caption",
  md: "h-9 px-4 text-[14px]",
};

/** En pantallas táctiles (dedo, no mouse) todo lo tocable mide al menos 44 px de alto.
 *  En escritorio no cambia nada: la condición es el tipo de puntero, no el ancho. */
const TACTIL = "[@media(pointer:coarse)]:min-h-[44px]";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
        TACTIL,
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    />
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
/** Card utilitaria: superficie blanca, borde sobrio, sombra ligera. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-surface border border-line rounded-card shadow-card", className)} {...props} />;
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 border-b border-line", className)} {...props} />;
}
export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

// ── Badge ───────────────────────────────────────────────────────────────────
/** Tono del badge/status-pill. Paleta oficial, SIN tintes rosados:
 * - neutro: estado normal/info (gris)
 * - rojo: error / trabado → ROJO SÓLIDO (serio, no salmón)
 * - verde: completado / OK (único acento suave)
 * - atencion: requiere acción/precaución → ÁMBAR (semántica universal)
 * - marca: identidad (super-admin, "al cliente"): rojo en contorno, NO es un error */
export type BadgeTone = "neutro" | "rojo" | "verde" | "atencion" | "marca";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutro: "bg-neutro-100 text-neutro-900 border border-neutro-200",
  rojo: "bg-rojo-600 text-white",
  verde: "bg-verde-100 text-verde-600 border border-verde-300",
  atencion: "bg-ambar-100 text-ambar-700 border border-ambar-300",
  marca: "bg-white text-rojo-700 border border-rojo-300",
};

export function Badge({
  tone = "neutro",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption font-medium",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

// ── Input / Select ──────────────────────────────────────────────────────────
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-white px-3 text-body text-ink",
        TACTIL,
        "placeholder:text-neutro-300",
        "focus:outline-none focus:ring-2 focus:ring-rojo-300 focus:border-rojo-300",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 rounded-md border border-line bg-white px-3 text-base sm:text-caption text-ink",
        TACTIL,
        "focus:outline-none focus:ring-2 focus:ring-rojo-300",
        className,
      )}
      {...props}
    />
  );
}

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutro-200 border-t-brand",
        className,
      )}
      role="status"
      aria-label="Cargando"
    />
  );
}
export function CenteredSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner className="h-7 w-7" />
    </div>
  );
}

// ── Logo ────────────────────────────────────────────────────────────────────
export type LogoVariant = "imagotipo-color" | "imagotipo-blanco" | "isotipo-color" | "isotipo-app";

/** Marca Enersol. Usar tal cual se entrega, sin alterar proporciones/colores (regla dura
 * del manual). Cada módulo sirve los archivos en `/brand/*.svg|png`; usa el SVG si existe
 * y cae al PNG si no. */
export function Logo({
  variant = "imagotipo-color",
  className,
  alt = "Enersol",
  base = "/brand",
}: {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  /** Carpeta pública con los archivos de marca. */
  base?: string;
}) {
  const [src, setSrc] = useState(`${base}/${variant}.svg`);
  useEffect(() => setSrc(`${base}/${variant}.svg`), [base, variant]);
  return (
    <img
      src={src}
      alt={alt}
      className={cn("select-none", className)}
      draggable={false}
      onError={() => {
        const png = `${base}/${variant}.png`;
        if (src !== png) setSrc(png);
      }}
    />
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={cn(
          "bg-surface shadow-card w-full overflow-auto",
          // Celular: hoja que sube desde abajo, a lo ancho. Desde sm: ventana centrada de siempre.
          "max-h-[92vh] rounded-t-card sm:max-h-[90vh] sm:rounded-card",
          maxWidth,
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-line flex items-center justify-between sticky top-0 bg-surface">
          <h3 className="text-h4 min-w-0">{title}</h3>
          <button
            onClick={onClose}
            className="-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-subtle hover:text-ink text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ── EmptyState ──────────────────────────────────────────────────────────────
/** Estado vacío único para listas y tablas: qué no hay, por qué (opcional) y qué hacer
 *  (opcional). Un solo patrón en toda la app. */
export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-10 text-center", className)}>
      <div className="text-caption font-medium text-ink">{title}</div>
      {hint && <p className="mx-auto mt-1 max-w-md text-[12px] text-subtle">{hint}</p>}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
}

// ── PageHeader ──────────────────────────────────────────────────────────────
/** Cabecera de página COMPACTA (una línea): título, contador, filtros y acciones. En una
 *  herramienta de trabajo el título se lee una vez; los filtros y el botón principal se
 *  usan cien veces, así que van pegados al título. Envuelve sola en pantallas angostas. */
export function PageHeader({
  title,
  count,
  subtitle,
  filters,
  actions,
  className,
}: {
  title: ReactNode;
  /** Texto corto junto al título (p.ej. "5 obras"). */
  count?: ReactNode;
  /** Una línea de contexto, solo si aporta algo que el título no dice. */
  subtitle?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <h1 className="font-display text-[22px] font-semibold leading-tight text-ink">{title}</h1>
          {count != null && count !== "" && (
            <span className="text-caption text-subtle tnum whitespace-nowrap">{count}</span>
          )}
        </div>
        {filters && (
          <div className="flex flex-wrap items-center gap-2 [&>input]:w-auto [&>input]:max-w-full">{filters}</div>
        )}
        {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {subtitle && <p className="mt-1 text-[12px] text-subtle">{subtitle}</p>}
    </div>
  );
}

// ── CollapsibleCard ─────────────────────────────────────────────────────────
/** Tarjeta colapsable (acordeón). El `summary` es la regla de oro: el estado de la
 *  sección se lee SIN abrirla (cuántos documentos, saldo, última fecha). Las acciones a la
 *  derecha NO togglean la tarjeta. */
export function CollapsibleCard({
  title,
  summary,
  right,
  defaultOpen = false,
  bodyClassName,
  className,
  children,
}: {
  title: ReactNode;
  summary?: ReactNode;
  right?: ReactNode;
  defaultOpen?: boolean;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("bg-surface border border-line rounded-card shadow-card overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 flex-1 min-w-[min(100%,16rem)] text-left"
        >
          <svg
            viewBox="0 0 20 20"
            aria-hidden
            className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-90")}
          >
            <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h3 className="text-h4 shrink-0">{title}</h3>
            {summary && <span className="min-w-0 truncate text-caption font-normal text-subtle">{summary}</span>}
          </span>
        </button>
        {right && <div className="shrink-0 max-w-full">{right}</div>}
      </div>
      {open && <div className={cn("px-4 py-3 sm:px-5 sm:py-4 border-t border-line", bodyClassName)}>{children}</div>}
    </div>
  );
}
