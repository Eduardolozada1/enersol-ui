import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { mobileMenuItemClass } from "./MobileMenu";

// Botón ❓ de guías: está en TODAS las pantallas de los módulos (Eduardo, 26/09/2026) y abre un
// panel lateral con la guía de la pantalla actual. Cada cambio de pantalla actualiza su guía.
//
// Acepta dos formatos de guía, mezclables en el mismo catálogo:
// - De DATOS (Hub, Proyectos, Marketing): `intro`, `quien`, `pasos[]`, `notas[]` con
//   «**negritas**».
// - Con `render()` (Operaciones, Cuotas): JSX propio (capturas inertes, avisos, tablas).
// `match(path)` decide qué guías corresponden a la ruta; puede haber varias por ruta.

/** Una guía del catálogo. Con `render` se dibuja eso; si no, `intro` + `pasos` + `notas`. */
export type Guia = {
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
export function normalizarRuta(path: string): string {
  const sinConsulta = path.split(/[?#]/)[0] || "/";
  return sinConsulta.replace(/\/+$/, "") || "/";
}

/** Todas las guías que corresponden a la ruta, en el orden del catálogo. Un `match` que falla
 *  no rompe el panel (se trata como «no corresponde»). */
export function guiasPorRuta<G extends Pick<Guia, "match">>(guias: readonly G[], path: string): G[] {
  const p = normalizarRuta(path);
  return guias.filter((g) => {
    try {
      return g.match(p);
    } catch {
      return false;
    }
  });
}

/** Ayuda para `match`: la ruta exacta o cualquier subruta («/obras» → «/obras», «/obras/3»). */
export function rutaEmpieza(prefijo: string): (path: string) => boolean {
  const pre = normalizarRuta(prefijo);
  return (p) => p === pre || p.startsWith(pre === "/" ? "/" : pre + "/");
}

/** Partes de un texto con «**negritas**»: `[{ texto, negrita }]`. Un «**» sin cerrar queda
 *  como texto. */
export function partirNegritas(texto: string): Array<{ texto: string; negrita: boolean }> {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return partes
    .map((p, i) => ({ texto: p, negrita: i % 2 === 1 }))
    .filter((p) => p.texto !== "");
}

/** «**negrita**» dentro de un texto → `<b>`. */
export function conNegritas(texto: string): ReactNode {
  return partirNegritas(texto).map((p, i) => (p.negrita ? <b key={i}>{p.texto}</b> : <span key={i}>{p.texto}</span>));
}

export function IconoGuia({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" />
      <circle cx="12" cy="17" r=".6" fill="currentColor" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Dibuja una guía (de datos o con render). */
export function GuiaContenido({ guia }: { guia: Guia }) {
  if (guia.render) return <>{guia.render()}</>;
  return (
    <div>
      <div className="flex items-center gap-2">
        {guia.icono && (
          <span className="text-[20px]" aria-hidden>
            {guia.icono}
          </span>
        )}
        <h2 className="font-display text-[17px] font-semibold text-ink">{guia.titulo}</h2>
      </div>
      {guia.intro && <p className="mt-1 text-[13px] text-subtle">{conNegritas(guia.intro)}</p>}
      {guia.quien && (
        <p className="mt-2 text-[12px] text-subtle sm:text-[11px]">
          <b>Quién lo ve:</b> {conNegritas(guia.quien)}
        </p>
      )}
      {guia.pasos && guia.pasos.length > 0 && (
        <ol className="mt-4 space-y-3">
          {guia.pasos.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-white" aria-hidden>
                {i + 1}
              </span>
              <p className="min-w-0 text-[14px] leading-relaxed text-ink sm:text-[13px]">{conNegritas(p)}</p>
            </li>
          ))}
        </ol>
      )}
      {guia.notas && guia.notas.length > 0 && (
        <div className="mt-4 space-y-2">
          {guia.notas.map((n, i) => (
            <div key={i} className="rounded-md border border-line bg-neutro-50 px-3 py-2 text-[13px] text-ink sm:text-[12px]">
              {conNegritas(n)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type GuiaPanelProps = {
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
export function GuiaPanel({
  open,
  onClose,
  guias,
  path,
  porDefecto,
  guiaId,
  elegirOtra,
  filtrar,
  multiples = "pestanas",
  enlaceGuiaCompleta,
  pie,
}: GuiaPanelProps) {
  const coinciden = useMemo(() => {
    const forzada = guiaId ? guias.find((g) => g.id === guiaId) : undefined;
    if (forzada) return [forzada];
    const m = guiasPorRuta(guias, path);
    if (m.length > 0) return m;
    const def = (porDefecto && guias.find((g) => g.id === porDefecto)) || guias[0];
    return def ? [def] : [];
  }, [guias, path, porDefecto, guiaId]);

  const principal = coinciden[0]?.id ?? "";
  const [id, setId] = useState(principal);
  // Al cambiar de pantalla (o al abrir), vuelve a la guía principal de esa pantalla.
  useEffect(() => {
    setId(principal);
  }, [principal, open]);

  const conSelector = elegirOtra ?? guias.some((g) => !g.render);
  const visibles = useMemo(
    () => guias.filter((g) => coinciden.some((c) => c.id === g.id) || !filtrar || filtrar(g)),
    [guias, coinciden, filtrar],
  );

  const asideRef = useRef<HTMLElement>(null);
  const tituloId = useId();
  const cerrarRef = useRef(onClose);
  cerrarRef.current = onClose;

  // Solo al abrir/cerrar (no en cada render): Escape cierra, el foco entra al panel y al
  // cerrar vuelve a donde estaba.
  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement as HTMLElement | null;
    const h = (e: KeyboardEvent) => e.key === "Escape" && cerrarRef.current();
    document.addEventListener("keydown", h);
    asideRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", h);
      previo?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const elegida = visibles.find((g) => g.id === id) ?? coinciden[0];
  const enPestanas = multiples === "pestanas" && coinciden.length > 1;
  const aMostrar: Guia[] =
    multiples === "todas" && coinciden.some((c) => c.id === id) ? coinciden : elegida ? [elegida] : [];

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={tituloId}>
      <button type="button" aria-label="Cerrar guía" tabIndex={-1} onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-neutro-900/30" />
      <aside
        ref={asideRef}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-surface shadow-card focus:outline-none"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <div id={tituloId} className="text-[13px] font-semibold text-ink">
              ❓ Guía de esta pantalla
            </div>
            {conSelector && visibles.length > 1 && (
              <select
                value={elegida?.id ?? ""}
                onChange={(e) => setId(e.target.value)}
                className="mt-1 h-10 max-w-full rounded-md border border-line bg-white px-1.5 text-[16px] text-ink sm:h-7 sm:text-[11px]"
                aria-label="Ver la guía de otra pantalla"
              >
                {visibles.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.titulo}
                  </option>
                ))}
              </select>
            )}
            {enlaceGuiaCompleta && (
              <div className="mt-1 text-[12px] text-brand-fg sm:text-[11px] [&_a:hover]:underline [&_a]:inline-flex [&_a]:items-center [@media(pointer:coarse)]:[&_a]:min-h-[44px]">
                {enlaceGuiaCompleta}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
          >
            <IconoCerrar />
          </button>
        </div>
        {enPestanas && (
          <div className="flex flex-wrap gap-1 border-b border-line px-4 py-2" role="tablist" aria-label="Guías de esta pantalla">
            {coinciden.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={elegida?.id === g.id}
                onClick={() => setId(g.id)}
                className={cn(
                  "rounded-pill border px-2.5 py-1 text-[12px] transition-colors sm:text-[11px] [@media(pointer:coarse)]:min-h-[40px]",
                  elegida?.id === g.id ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:bg-neutro-50",
                )}
              >
                {g.titulo}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 space-y-8 overflow-y-auto px-4 py-4 sm:px-6">
          {aMostrar.map((g) => (
            <GuiaContenido key={g.id} guia={g} />
          ))}
          {aMostrar.length === 0 && <p className="text-[13px] text-subtle">Todavía no hay una guía para esta pantalla.</p>}
          {pie}
        </div>
      </aside>
    </div>
  );
}

/** Botón ❓ + panel. `variante="icono"` es el ❓ del encabezado; `variante="menu"` es la fila
 *  «❓ Guía de esta pantalla» del menú ☰ (no cierra el menú: el panel se abre encima).
 *  Con `open`/`onOpenChange` se controla desde afuera; `sinBoton` deja solo el panel. */
export function GuiaBoton({
  variante = "icono",
  className,
  ocultarEn,
  open: openProp,
  onOpenChange,
  sinBoton = false,
  ...panel
}: Omit<GuiaPanelProps, "open" | "onClose"> & {
  variante?: "icono" | "menu";
  className?: string;
  /** Rutas donde el botón no aparece (p. ej. la guía completa: `(p) => p.startsWith("/guia")`). */
  ocultarEn?: (path: string) => boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sinBoton?: boolean;
}) {
  const [openLocal, setOpenLocal] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? !!openProp : openLocal;
  const setOpen = (v: boolean) => (controlado ? onOpenChange?.(v) : setOpenLocal(v));

  if (ocultarEn?.(panel.path)) return null;

  return (
    <>
      {!sinBoton &&
        (variante === "menu" ? (
          <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={cn(mobileMenuItemClass(), className)}>
            <span aria-hidden>❓</span> Guía de esta pantalla
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="Guía de uso de esta pantalla"
            title="Guía de uso de esta pantalla"
            className={cn(
              "relative inline-flex items-center justify-center rounded-md p-2 text-subtle hover:bg-neutro-100 hover:text-ink [@media(pointer:coarse)]:p-3",
              className,
            )}
          >
            <IconoGuia />
          </button>
        ))}
      <GuiaPanel {...panel} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
