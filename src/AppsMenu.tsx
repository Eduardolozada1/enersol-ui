import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/** Los módulos del ecosistema Enersol (Distribución queda fuera). El orden es el del
 *  lanzador del Hub. Los links pasan por el Hub (`/ir/<clave>`), que emite el ticket de
 *  SSO y redirige: un solo lugar decide quién entra a qué. */
export type ModuloEnersol = {
  clave: string;
  nombre: string;
  url: string;
  descripcion: string;
};

export const HUB_URL = "https://app.enersol-sa.com";

export const MODULOS_ENERSOL: ModuloEnersol[] = [
  { clave: "plataforma", nombre: "App Enersol", url: HUB_URL, descripcion: "Inicio, accesos, mensajes y correos" },
  { clave: "operaciones", nombre: "Operaciones", url: "https://operaciones.enersol-sa.com", descripcion: "Obras, campo, postventa" },
  { clave: "propuestas", nombre: "Proyectos", url: "https://propuestas.enersol-sa.com", descripcion: "Cotizador, propuestas y CRM" },
  { clave: "marketing", nombre: "Marketing", url: "https://marketing.enersol-sa.com", descripcion: "Funnel, campañas y mensajería" },
  { clave: "contabilidad", nombre: "Contabilidad", url: "https://contabilidad.enersol-sa.com", descripcion: "Contable, inventario y tesorería" },
];

/** Menú «Apps»: saltar entre módulos sin volver al lanzador. Va junto al logo en el
 *  header de cada módulo. Los destinos pasan por el Hub para el SSO. */
export function AppsMenu({
  actual,
  hubUrl = HUB_URL,
  modulos = MODULOS_ENERSOL,
  className,
}: {
  /** Clave del módulo donde estamos (se marca y no linkea). */
  actual: string;
  hubUrl?: string;
  modulos?: ModuloEnersol[];
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Cambiar de módulo"
        title="Cambiar de módulo"
        className={cn(
          "rounded-md p-1.5 text-subtle transition-colors hover:bg-neutro-100 hover:text-ink",
          abierto && "bg-neutro-100 text-ink",
        )}
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
          <circle cx="4" cy="4" r="1.7" /><circle cx="10" cy="4" r="1.7" /><circle cx="16" cy="4" r="1.7" />
          <circle cx="4" cy="10" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="16" cy="10" r="1.7" />
          <circle cx="4" cy="16" r="1.7" /><circle cx="10" cy="16" r="1.7" /><circle cx="16" cy="16" r="1.7" />
        </svg>
      </button>
      {abierto && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-72 rounded-card border border-line bg-surface p-1.5 shadow-card"
        >
          <div className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">Módulos</div>
          {modulos.map((m) => {
            const esActual = m.clave === actual;
            const href = m.clave === "plataforma" ? hubUrl : `${hubUrl}/ir/${m.clave}`;
            return (
              <a
                key={m.clave}
                role="menuitem"
                href={esActual ? undefined : href}
                aria-current={esActual ? "page" : undefined}
                onClick={(e) => esActual && e.preventDefault()}
                className={cn(
                  "block rounded-md px-2.5 py-2 transition-colors",
                  esActual ? "bg-neutro-100 cursor-default" : "hover:bg-neutro-50",
                )}
              >
                <div className={cn("text-caption font-medium", esActual ? "text-brand" : "text-ink")}>
                  {m.nombre}
                  {esActual && <span className="ml-2 text-[11px] font-normal text-subtle">estás acá</span>}
                </div>
                <div className="text-[11px] text-subtle">{m.descripcion}</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
