import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AppsMenu, HUB_URL } from "./AppsMenu";
import { cn } from "./cn";
import { MobileMenu, MobileMenuSection, mobileMenuItemClass } from "./MobileMenu";

/** Una sección del módulo. Sin `group` va en la barra; con `group`, en el desplegable «Más»
 *  (escritorio) bajo el título del grupo, y en el menú ☰ del celular bajo ese mismo título.
 *  Así un módulo con muchas secciones nunca necesita scroll lateral en el encabezado. */
export type AppHeaderItem = {
  href: string;
  label: ReactNode;
  group?: string;
  /** Otras rutas que también marcan la sección como actual (p. ej. "/" para el Tablero). */
  match?: (path: string) => boolean;
};

/** Props que recibe `renderLink`: el módulo arma el link con SU router (Link, NavLink…). */
export type AppHeaderLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
  "aria-current"?: "page";
  role?: string;
  onClick?: () => void;
};

/** Desde qué ancho se ve la barra de escritorio; por debajo, el menú ☰. Clases escritas
 *  enteras (no armadas) para que Tailwind las encuentre al escanear el paquete. */
export type AppHeaderBreakpoint = "lg" | "xl" | "2xl";

/** Cómo se marca la sección actual en la barra de escritorio: «texto» (el ítem en color de
 *  marca, como siempre) o «subrayado» (texto `brand-text` y una barra `bg-brand` de 3 px pegada al
 *  borde inferior del encabezado: para una marca cuyo color no sirve como texto sobre blanco,
 *  como el amarillo de Distribución). */
export type AppHeaderIndicador = "texto" | "subrayado";

type ClasesDesde = { flex: string; block: string; contents: string; oculto: string; gap: string; gapAcciones: string; px: string };

const DESDE: Record<AppHeaderBreakpoint, ClasesDesde> = {
  lg: { flex: "lg:flex", block: "lg:block", contents: "lg:contents", oculto: "lg:hidden", gap: "lg:gap-4", gapAcciones: "lg:gap-3", px: "lg:px-6" },
  xl: { flex: "xl:flex", block: "xl:block", contents: "xl:contents", oculto: "xl:hidden", gap: "xl:gap-4", gapAcciones: "xl:gap-3", px: "xl:px-6" },
  "2xl": { flex: "2xl:flex", block: "2xl:block", contents: "2xl:contents", oculto: "2xl:hidden", gap: "2xl:gap-4", gapAcciones: "2xl:gap-3", px: "2xl:px-6" },
};

/** ¿La ruta actual es esta sección? Exacta o una subruta («/ventas» y «/ventas/12»), más
 *  lo que diga `match`. «/» solo es actual en «/». */
export function isAppHeaderItemActive(item: AppHeaderItem, path: string): boolean {
  if (item.match?.(path)) return true;
  if (item.href === "/") return path === "/";
  const base = item.href.replace(/\/+$/, "");
  return path === base || path.startsWith(`${base}/`);
}

/** Agrupa las secciones: las de la barra y los grupos del «Más», en el orden en que vienen. */
export function groupAppHeaderItems(items: AppHeaderItem[]): { main: AppHeaderItem[]; groups: Array<[string, AppHeaderItem[]]> } {
  const main: AppHeaderItem[] = [];
  const grupos = new Map<string, AppHeaderItem[]>();
  for (const item of items) {
    if (!item.group) main.push(item);
    else grupos.set(item.group, [...(grupos.get(item.group) ?? []), item]);
  }
  return { main, groups: [...grupos.entries()] };
}

const enlacePorDefecto = ({ href, ...props }: AppHeaderLinkProps) => <a href={href} {...props} />;

const claseBarra = (activo: boolean, indicador: AppHeaderIndicador = "texto") =>
  cn(
    "whitespace-nowrap px-2 py-2 text-[13px] font-medium transition-colors",
    activo ? "text-brand-text" : "text-subtle hover:text-brand-text",
    // la barra va por ::after, pegada al borde de abajo del encabezado (tapa su línea de 1 px)
    indicador === "subrayado" && "relative inline-flex h-full items-center",
    indicador === "subrayado" && activo &&
      "after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-t-sm after:bg-brand after:content-['']",
  );

/** Desplegable «Más» de la barra de escritorio, con las secciones agrupadas. */
function MasSecciones({
  label,
  groups,
  path,
  renderLink,
  indicador,
}: {
  label: ReactNode;
  groups: Array<[string, AppHeaderItem[]]>;
  path: string;
  renderLink: (props: AppHeaderLinkProps) => ReactNode;
  indicador: AppHeaderIndicador;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activo = groups.some(([, items]) => items.some((i) => isAppHeaderItemActive(i, path)));

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

  // Cambió la ruta (se eligió una sección): se cierra.
  useEffect(() => setAbierto(false), [path]);

  return (
    <div ref={ref} className={cn("relative", indicador === "subrayado" && "flex h-full")}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={cn(claseBarra(activo, indicador), "inline-flex items-center gap-1")}
      >
        {label}
        <svg viewBox="0 0 20 20" className={cn("h-3.5 w-3.5 transition-transform", abierto && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {abierto && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 grid w-max max-w-[calc(100vw-1.5rem)] grid-cols-2 gap-x-6 gap-y-3 rounded-card border border-line bg-surface p-3 shadow-card"
        >
          {groups.map(([grupo, items]) => (
            <div key={grupo} className="min-w-[10rem]">
              <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">{grupo}</div>
              {items.map((item) => {
                const actual = isAppHeaderItemActive(item, path);
                return (
                  <Fragment key={item.href}>
                    {renderLink({
                      href: item.href,
                      role: "menuitem",
                      "aria-current": actual ? "page" : undefined,
                      onClick: () => setAbierto(false),
                      className: cn(
                        "block whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                        actual ? "bg-neutro-100 text-brand-text" : "text-ink hover:bg-neutro-50 hover:text-brand-text",
                      ),
                      children: item.label,
                    })}
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Encabezado unificado del ecosistema Enersol (blanco, `border-b`, Apps + logo h-7 +
 *  separador + nombre del módulo, navegación en texto con la actual en `text-brand-text` (o
 *  subrayada, `indicador`), sin pastillas; a la derecha las acciones, el usuario y «Salir»).
 *
 *  Por debajo de `desktopFrom` (por defecto `lg`) la barra se reemplaza por el menú ☰
 *  (MobileMenu) con TODAS las secciones agrupadas, el usuario y «Salir»: en el celular
 *  nunca hay scroll lateral. Las secciones con `group` van en el desplegable «Más» de la
 *  barra de escritorio. Sin dependencias de router: cada módulo pasa `renderLink`. */
export function AppHeader({
  moduleKey,
  moduleName,
  logo,
  homeHref = "/",
  items,
  currentPath,
  renderLink = enlacePorDefecto,
  notice,
  persistentActions,
  actions,
  user,
  onLogout,
  mobileMenuFooter,
  desktopFrom = "lg",
  moreLabel = "Más",
  hubUrl = HUB_URL,
  indicador = "texto",
  mostrarApps = true,
  mostrarNombre = true,
  className,
}: {
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
  user?: { name: ReactNode; email?: string } | null;
  onLogout?: () => void;
  /** Filas extra al pie del menú ☰ (usar `mobileMenuItemClass()`; `data-cierra` lo cierra). */
  mobileMenuFooter?: ReactNode;
  desktopFrom?: AppHeaderBreakpoint;
  moreLabel?: ReactNode;
  hubUrl?: string;
  /** Cómo se marca la sección actual en la barra de escritorio (por defecto, «texto»). */
  indicador?: AppHeaderIndicador;
  /** Menú Apps (módulos del ecosistema). En falso para quien no es personal de Enersol (los
   *  clientes externos de un portal no ven los módulos internos). */
  mostrarApps?: boolean;
  /** Nombre del módulo al lado del logo. En falso cuando el logo ya lo dice (el imagotipo de una
   *  división, «enersol distribución»); el menú ☰ lo sigue usando como título. */
  mostrarNombre?: boolean;
  className?: string;
}) {
  const bp = DESDE[desktopFrom];
  const { main, groups } = groupAppHeaderItems(items);

  const enlaceMovil = (item: AppHeaderItem) => {
    const actual = isAppHeaderItemActive(item, currentPath);
    return (
      <Fragment key={item.href}>
        {renderLink({
          href: item.href,
          "aria-current": actual ? "page" : undefined,
          className: mobileMenuItemClass(actual),
          children: item.label,
        })}
      </Fragment>
    );
  };

  return (
    <header className={cn("sticky top-0 z-30 border-b border-neutro-200 bg-white", className)}>
      {notice && (
        <div role="status" className="border-b border-ambar-300 bg-ambar-100 px-4 py-2 text-center text-[13px] font-medium text-ambar-700">
          {notice}
        </div>
      )}
      <div className={cn("flex h-16 items-center justify-between gap-2 px-3", bp.gap, bp.px)}>
        <div className={cn("flex min-w-0 items-center gap-2", bp.gap)}>
          {mostrarApps && <AppsMenu actual={moduleKey} hubUrl={hubUrl} className="-ml-1.5 shrink-0" />}
          {renderLink({ href: homeHref, className: "shrink-0", children: logo })}
          {mostrarNombre && (
            <span className={cn("min-w-0 truncate font-display text-[15px] font-semibold text-neutro-900", bp.oculto)}>
              {moduleName}
            </span>
          )}
          <span className={cn("hidden h-6 w-px shrink-0 bg-neutro-200", bp.block)} aria-hidden />
          {mostrarNombre && (
            <span className={cn("hidden shrink-0 whitespace-nowrap font-display text-[17px] font-semibold text-neutro-900", bp.block)}>
              {moduleName}
            </span>
          )}
          <nav
            aria-label="Secciones del módulo"
            className={cn("hidden shrink-0 items-center gap-1", bp.flex, indicador === "subrayado" && "self-stretch")}
          >
            {main.map((item) => {
              const actual = isAppHeaderItemActive(item, currentPath);
              return (
                <Fragment key={item.href}>
                  {renderLink({
                    href: item.href,
                    "aria-current": actual ? "page" : undefined,
                    className: claseBarra(actual, indicador),
                    children: item.label,
                  })}
                </Fragment>
              );
            })}
            {groups.length > 0 && (
              <MasSecciones label={moreLabel} groups={groups} path={currentPath} renderLink={renderLink} indicador={indicador} />
            )}
          </nav>
        </div>
        <div className={cn("flex shrink-0 items-center gap-1", bp.gapAcciones)}>
          {persistentActions}
          <span className={cn("hidden", bp.contents)}>
            {actions}
            {user && (
              <span className="hidden whitespace-nowrap text-[13px] text-neutro-900 2xl:block" title={user.email}>
                {user.name}
              </span>
            )}
            {onLogout && (
              <button type="button" onClick={onLogout} className="px-2 py-1 text-[13px] text-subtle transition-colors hover:text-brand-text">
                Salir
              </button>
            )}
          </span>
          <MobileMenu
            className={bp.oculto}
            title={moduleName}
            footer={
              (user || mobileMenuFooter || onLogout) && (
                <>
                  {user && (
                    <div className="px-3 pb-2 pt-1">
                      <div className="truncate text-[15px] font-medium text-ink">{user.name}</div>
                      {user.email && <div className="truncate text-[13px] text-subtle">{user.email}</div>}
                    </div>
                  )}
                  {mobileMenuFooter}
                  {onLogout && (
                    <button type="button" data-cierra onClick={onLogout} className={mobileMenuItemClass()}>
                      Salir
                    </button>
                  )}
                </>
              )
            }
          >
            {main.map(enlaceMovil)}
            {groups.map(([grupo, lista]) => (
              <Fragment key={grupo}>
                <MobileMenuSection>{grupo}</MobileMenuSection>
                {lista.map(enlaceMovil)}
              </Fragment>
            ))}
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
