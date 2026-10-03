import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "./cn";

/** Menú del encabezado para celular y tablet (se usa con `lg:hidden`; en escritorio cada
 *  módulo sigue mostrando su barra de navegación de siempre). Un botón ☰ abre una hoja a la
 *  derecha con los links del módulo y las acciones secundarias (guía, Mejoras, usuario,
 *  salir). Se cierra al tocar cualquier link, con Escape o tocando afuera.
 *
 *  Los links los arma cada módulo (con su router) usando `mobileMenuItemClass` para que
 *  todos se vean y se toquen igual (filas de 48 px). */
export function MobileMenu({
  children,
  title = "Menú",
  footer,
  className,
}: {
  children: ReactNode;
  title?: ReactNode;
  /** Zona de abajo (usuario, cambiar clave, salir). */
  footer?: ReactNode;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    // Que la página de atrás no se desplace mientras el menú está abierto.
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  // Cualquier link o botón marcado con data-cierra dentro del menú lo cierra (navegación).
  function alTocar(e: MouseEvent<HTMLDivElement>) {
    const el = (e.target as HTMLElement).closest("a, [data-cierra]");
    if (el) setAbierto(false);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label="Abrir menú"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-neutro-100"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {abierto && (
        <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setAbierto(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : "Menú"}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-[86vw] max-w-sm flex-col bg-surface shadow-card"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <div className="font-display text-[17px] font-semibold text-ink">{title}</div>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2" onClick={alTocar}>
              <nav className="flex flex-col">{children}</nav>
            </div>
            {footer && (
              <div className="border-t border-line px-2 py-2" onClick={alTocar}>
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Clase de cada fila del MobileMenu (link o botón): 48 px de alto, texto de 16 px. */
export function mobileMenuItemClass(activo = false): string {
  return cn(
    "flex min-h-[48px] w-full items-center gap-3 rounded-md px-3 text-left text-[16px] font-medium transition-colors",
    activo ? "bg-neutro-100 text-brand" : "text-ink hover:bg-neutro-50",
  );
}

/** Título de grupo dentro del MobileMenu (p.ej. «Administración»). */
export function MobileMenuSection({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-3 text-[12px] font-semibold uppercase tracking-wide text-subtle">{children}</div>
  );
}
