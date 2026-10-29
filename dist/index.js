import { useState, useEffect, useMemo, useRef, Fragment, useId, useCallback } from 'react';
import { jsx, jsxs, Fragment as Fragment$1 } from 'react/jsx-runtime';

// src/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
var BUTTON_VARIANTS = {
  // Rojo manda pero no satura: primario sólido, el resto sobrio. UN primario por pantalla.
  primary: "bg-brand text-brand-on hover:bg-brand-hover focus-visible:ring-brand-ring",
  secondary: "bg-white text-ink border border-line hover:bg-neutro-50 focus-visible:ring-neutro-200",
  ghost: "bg-transparent text-ink hover:bg-neutro-100 focus-visible:ring-neutro-200",
  danger: "bg-rojo-600 text-white hover:bg-rojo-700 focus-visible:ring-rojo-300"
};
var BUTTON_SIZES = {
  sm: "h-8 px-3 text-caption",
  md: "h-9 px-4 text-[14px]"
};
var TACTIL = "[@media(pointer:coarse)]:min-h-[44px]";
function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium",
        TACTIL,
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      ),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("bg-surface border border-line rounded-card shadow-card", className), ...props });
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("px-5 py-4 border-b border-line", className), ...props });
}
function CardBody({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("px-5 py-4", className), ...props });
}
var BADGE_TONES = {
  neutro: "bg-neutro-100 text-neutro-900 border border-neutro-200",
  rojo: "bg-rojo-600 text-white",
  verde: "bg-verde-100 text-verde-600 border border-verde-300",
  atencion: "bg-ambar-100 text-ambar-700 border border-ambar-300",
  marca: "bg-white text-brand-badge border border-brand-ring"
};
function Badge({
  tone = "neutro",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption font-medium",
        BADGE_TONES[tone],
        className
      ),
      ...props
    }
  );
}
function Input({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      className: cn(
        "h-10 w-full rounded-md border border-line bg-white px-3 text-body text-ink",
        TACTIL,
        "placeholder:text-neutro-300",
        "focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand-ring",
        className
      ),
      ...props
    }
  );
}
function Select({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "select",
    {
      className: cn(
        "h-9 rounded-md border border-line bg-white px-3 text-base sm:text-caption text-ink",
        TACTIL,
        "focus:outline-none focus:ring-2 focus:ring-brand-ring",
        className
      ),
      ...props
    }
  );
}
function Spinner({ className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutro-200 border-t-brand",
        className
      ),
      role: "status",
      "aria-label": "Cargando"
    }
  );
}
function CenteredSpinner() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx(Spinner, { className: "h-7 w-7" }) });
}
function Logo({
  variant = "imagotipo-color",
  className,
  alt = "Enersol",
  base = "/brand"
}) {
  const [src, setSrc] = useState(`${base}/${variant}.svg`);
  useEffect(() => setSrc(`${base}/${variant}.svg`), [base, variant]);
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      className: cn("select-none", className),
      draggable: false,
      onError: () => {
        const png = `${base}/${variant}.png`;
        if (src !== png) setSrc(png);
      }
    }
  );
}
function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg"
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "bg-surface shadow-card w-full overflow-auto",
        // Celular: hoja que sube desde abajo, a lo ancho. Desde sm: ventana centrada de siempre.
        "max-h-[92vh] rounded-t-card sm:max-h-[90vh] sm:rounded-card",
        maxWidth
      ),
      style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-line flex items-center justify-between sticky top-0 bg-surface", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-h4 min-w-0", children: title }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-subtle hover:text-ink text-lg leading-none",
              "aria-label": "Cerrar",
              children: "\u2715"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-5 py-4", children })
      ]
    }
  ) });
}
function EmptyState({
  title,
  hint,
  action,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("py-10 text-center", className), children: [
    /* @__PURE__ */ jsx("div", { className: "text-caption font-medium text-ink", children: title }),
    hint && /* @__PURE__ */ jsx("p", { className: "mx-auto mt-1 max-w-md text-[12px] text-subtle", children: hint }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-center", children: action })
  ] });
}
function PageHeader({
  title,
  count,
  subtitle,
  filters,
  actions,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("mb-5", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-[22px] font-semibold leading-tight text-ink", children: title }),
        count != null && count !== "" && /* @__PURE__ */ jsx("span", { className: "text-caption text-subtle tnum whitespace-nowrap", children: count })
      ] }),
      filters && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2 [&>input]:w-auto [&>input]:max-w-full", children: filters }),
      actions && /* @__PURE__ */ jsx("div", { className: "ml-auto flex flex-wrap items-center gap-2", children: actions })
    ] }),
    subtitle && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[12px] text-subtle", children: subtitle })
  ] });
}
function CollapsibleCard({
  title,
  summary,
  right,
  defaultOpen = false,
  bodyClassName,
  className,
  children
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-surface border border-line rounded-card shadow-card overflow-hidden", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3 sm:px-5 sm:py-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen((o) => !o),
          "aria-expanded": open,
          className: "flex items-center gap-2 flex-1 min-w-[min(100%,16rem)] text-left",
          children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                viewBox: "0 0 20 20",
                "aria-hidden": true,
                className: cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-90"),
                children: /* @__PURE__ */ jsx("path", { d: "M7 5l6 5-6 5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-h4 shrink-0", children: title }),
              summary && /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate text-caption font-normal text-subtle", children: summary })
            ] })
          ]
        }
      ),
      right && /* @__PURE__ */ jsx("div", { className: "shrink-0 max-w-full", children: right })
    ] }),
    open && /* @__PURE__ */ jsx("div", { className: cn("px-4 py-3 sm:px-5 sm:py-4 border-t border-line", bodyClassName), children })
  ] });
}
var HIDE = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell"
};
function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  defaultSort,
  empty,
  dense = false,
  rowClassName,
  className,
  /** Altura del header fijo de la app (para que la cabecera de la tabla se pegue debajo). */
  stickyTopClassName = "top-14 lg:top-16",
  /** En el celular (< 640 px): "tarjetas" (cada fila es una tarjeta con sus datos) o
   *  "tabla" (la tabla de siempre, con scroll lateral dentro de su tarjeta). */
  movil = "tarjetas"
}) {
  const [sort, setSort] = useState(defaultSort ?? null);
  const ordenadas = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const sv = col.sortValue;
    const mul = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = sv(a);
      const vb = sv(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * mul;
      return String(va).localeCompare(String(vb), "es", { numeric: true, sensitivity: "base" }) * mul;
    });
  }, [rows, sort, columns]);
  function toggleSort(col) {
    if (!col.sortValue) return;
    setSort(
      (s) => s?.key === col.key ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: col.key, dir: col.align === "right" ? "desc" : "asc" }
    );
  }
  function onKey(e, row) {
    if (!onRowClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row);
    }
  }
  const pad = dense ? "px-3 py-2" : "px-4 py-3";
  const tarjetas = movil === "tarjetas";
  const colTitulo = columns.find((c) => c.tarjeta === "titulo") ?? columns.find((c) => c.tarjeta !== "oculta");
  const colDatos = columns.filter((c) => c !== colTitulo && c.tarjeta !== "oculta");
  const ordenables = columns.filter((c) => c.sortValue);
  const alignCls = (a) => a === "right" ? "text-right tnum" : a === "center" ? "text-center" : "text-left";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "bg-surface border border-line rounded-card shadow-card",
        // En celular la tabla scrollea de lado dentro de su tarjeta; en escritorio queda
        // visible para que la cabecera pueda pegarse arriba al scrollear la página.
        "overflow-x-auto lg:overflow-visible",
        className
      ),
      children: [
        tarjetas && /* @__PURE__ */ jsxs("div", { className: "sm:hidden", children: [
          ordenables.length > 0 && ordenadas.length > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-line px-4 py-2 text-caption text-subtle", children: [
            /* @__PURE__ */ jsx("span", { className: "shrink-0", children: "Ordenar" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                "aria-label": "Ordenar por",
                value: sort ? `${sort.key}:${sort.dir}` : "",
                onChange: (e) => {
                  const [key, dir] = e.target.value.split(":");
                  setSort(key ? { key, dir } : null);
                },
                className: "min-h-[44px] min-w-0 flex-1 rounded-md border border-line bg-white px-2 text-base text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Como vienen" }),
                  ordenables.map((c) => /* @__PURE__ */ jsxs("optgroup", { label: typeof c.header === "string" ? c.header : c.key, children: [
                    /* @__PURE__ */ jsxs("option", { value: `${c.key}:asc`, children: [
                      typeof c.header === "string" ? c.header : c.key,
                      " \u2191"
                    ] }),
                    /* @__PURE__ */ jsxs("option", { value: `${c.key}:desc`, children: [
                      typeof c.header === "string" ? c.header : c.key,
                      " \u2193"
                    ] })
                  ] }, c.key))
                ]
              }
            )
          ] }),
          ordenadas.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { title: empty?.title ?? "Nada por ac\xE1.", hint: empty?.hint, action: empty?.action }) : /* @__PURE__ */ jsx("ul", { children: ordenadas.map((row) => /* @__PURE__ */ jsxs(
            "li",
            {
              onClick: onRowClick ? () => onRowClick(row) : void 0,
              onKeyDown: onRowClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onRowClick(row)) : void 0,
              tabIndex: onRowClick ? 0 : void 0,
              role: onRowClick ? "button" : void 0,
              className: cn(
                "border-b border-line px-4 py-3 last:border-0",
                onRowClick && "cursor-pointer active:bg-neutro-50 focus:outline-none focus-visible:bg-neutro-50",
                rowClassName?.(row)
              ),
              children: [
                colTitulo && /* @__PURE__ */ jsx("div", { className: "min-w-0 text-[15px] font-medium text-ink", children: colTitulo.render(row) }),
                colDatos.length > 0 && /* @__PURE__ */ jsx("dl", { className: "mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-caption", children: colDatos.map((c) => /* @__PURE__ */ jsxs("div", { className: "contents", children: [
                  /* @__PURE__ */ jsx("dt", { className: "text-subtle", children: c.etiquetaTarjeta ?? c.header }),
                  /* @__PURE__ */ jsx("dd", { className: cn("min-w-0 break-words text-ink", c.align === "right" && "tnum"), children: c.render(row) })
                ] }, c.key)) })
              ]
            },
            rowKey(row)
          )) })
        ] }),
        /* @__PURE__ */ jsxs("table", { className: cn("w-full text-caption", tarjetas && "hidden sm:table"), children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-line", children: columns.map((c) => {
            const activa = sort?.key === c.key;
            return /* @__PURE__ */ jsx(
              "th",
              {
                style: c.width ? { width: c.width } : void 0,
                "aria-sort": activa ? sort.dir === "asc" ? "ascending" : "descending" : void 0,
                className: cn(
                  // Fija solo desde lg: abajo la tabla scrollea dentro de su tarjeta y una
                  // cabecera «sticky» con top-14 tapaba la primera fila.
                  "lg:sticky z-[5] bg-surface/95 backdrop-blur-sm",
                  stickyTopClassName,
                  "text-[11px] font-semibold uppercase tracking-wide text-subtle",
                  "border-b border-line",
                  pad,
                  alignCls(c.align),
                  c.hideBelow && HIDE[c.hideBelow]
                ),
                children: c.sortValue ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleSort(c),
                    className: cn("inline-flex items-center gap-1 hover:text-ink", activa && "text-ink"),
                    children: [
                      c.header,
                      /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn("text-[9px]", !activa && "opacity-30"), children: activa && sort.dir === "desc" ? "\u25BC" : "\u25B2" })
                    ]
                  }
                ) : c.header
              },
              c.key
            );
          }) }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            ordenadas.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "p-0", children: /* @__PURE__ */ jsx(EmptyState, { title: empty?.title ?? "Nada por ac\xE1.", hint: empty?.hint, action: empty?.action }) }) }),
            ordenadas.map((row) => /* @__PURE__ */ jsx(
              "tr",
              {
                onClick: onRowClick ? () => onRowClick(row) : void 0,
                onKeyDown: (e) => onKey(e, row),
                tabIndex: onRowClick ? 0 : void 0,
                className: cn(
                  "border-b border-line last:border-0",
                  onRowClick && "cursor-pointer hover:bg-neutro-50 focus:outline-none focus-visible:bg-neutro-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-ring",
                  rowClassName?.(row)
                ),
                children: columns.map((c) => /* @__PURE__ */ jsx("td", { className: cn(pad, alignCls(c.align), c.hideBelow && HIDE[c.hideBelow], c.className), children: c.render(row) }, c.key))
              },
              rowKey(row)
            ))
          ] })
        ] })
      ]
    }
  );
}
var HUB_URL = "https://app.enersol-sa.com";
var MODULOS_ENERSOL = [
  { clave: "plataforma", nombre: "App Enersol", url: HUB_URL, descripcion: "Inicio, accesos, mensajes y correos" },
  { clave: "operaciones", nombre: "Operaciones", url: "https://operaciones.enersol-sa.com", descripcion: "Obras, campo, postventa" },
  { clave: "propuestas", nombre: "Proyectos", url: "https://propuestas.enersol-sa.com", descripcion: "Cotizador, propuestas y CRM" },
  { clave: "marketing", nombre: "Marketing", url: "https://marketing.enersol-sa.com", descripcion: "Funnel, campa\xF1as y mensajer\xEDa" },
  { clave: "contabilidad", nombre: "Contabilidad", url: "https://contabilidad.enersol-sa.com", descripcion: "Contable, inventario y tesorer\xEDa" },
  { clave: "financiamiento", nombre: "Cuotas", url: "https://cuotas.enersol-sa.com", descripcion: "Pago en cuotas y cobranza" }
];
function AppsMenu({
  actual,
  hubUrl = HUB_URL,
  modulos = MODULOS_ENERSOL,
  className
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    const onKey = (e) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto]);
  return /* @__PURE__ */ jsxs("div", { ref, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setAbierto((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        "aria-label": "Cambiar de m\xF3dulo",
        title: "Cambiar de m\xF3dulo",
        className: cn(
          "rounded-md p-1.5 text-subtle transition-colors hover:bg-neutro-100 hover:text-ink",
          "[@media(pointer:coarse)]:p-2.5",
          abierto && "bg-neutro-100 text-ink"
        ),
        children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", className: "h-5 w-5", fill: "currentColor", "aria-hidden": true, children: [
          /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "10", cy: "4", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "16", cy: "4", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "4", cy: "10", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "10", cy: "10", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "16", cy: "10", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "4", cy: "16", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "10", cy: "16", r: "1.7" }),
          /* @__PURE__ */ jsx("circle", { cx: "16", cy: "16", r: "1.7" })
        ] })
      }
    ),
    abierto && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "menu",
        className: "absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-card border border-line bg-surface p-1.5 shadow-card",
        children: [
          /* @__PURE__ */ jsx("div", { className: "px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-subtle", children: "M\xF3dulos" }),
          modulos.map((m) => {
            const esActual = m.clave === actual;
            const href = m.clave === "plataforma" ? hubUrl : `${hubUrl}/ir/${m.clave}`;
            return /* @__PURE__ */ jsxs(
              "a",
              {
                role: "menuitem",
                href: esActual ? void 0 : href,
                "aria-current": esActual ? "page" : void 0,
                onClick: (e) => esActual && e.preventDefault(),
                className: cn(
                  "block rounded-md px-2.5 py-2 transition-colors [@media(pointer:coarse)]:py-3",
                  esActual ? "bg-neutro-100 cursor-default" : "hover:bg-neutro-50"
                ),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: cn("text-caption font-medium", esActual ? "text-brand-text" : "text-ink"), children: [
                    m.nombre,
                    esActual && /* @__PURE__ */ jsx("span", { className: "ml-2 text-[11px] font-normal text-subtle", children: "est\xE1s ac\xE1" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] text-subtle", children: m.descripcion })
                ]
              },
              m.clave
            );
          })
        ]
      }
    )
  ] });
}
function MobileMenu({
  children,
  title = "Men\xFA",
  footer,
  className
}) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [abierto]);
  function alTocar(e) {
    const el = e.target.closest("a, [data-cierra]");
    if (el) setAbierto(false);
  }
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setAbierto(true),
        "aria-haspopup": "dialog",
        "aria-expanded": abierto,
        "aria-label": "Abrir men\xFA",
        className: "inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-neutro-100",
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-6 w-6", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) })
      }
    ),
    abierto && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-ink/40", onClick: () => setAbierto(false), children: /* @__PURE__ */ jsxs(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": typeof title === "string" ? title : "Men\xFA",
        onClick: (e) => e.stopPropagation(),
        className: "absolute inset-y-0 right-0 flex w-[86vw] max-w-sm flex-col bg-surface shadow-card",
        style: { paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-line px-4 py-2", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-[17px] font-semibold text-ink", children: title }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setAbierto(false),
                "aria-label": "Cerrar men\xFA",
                className: "inline-flex h-11 w-11 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 hover:text-ink",
                children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-2 py-2", onClick: alTocar, children: /* @__PURE__ */ jsx("nav", { className: "flex flex-col", children }) }),
          footer && /* @__PURE__ */ jsx("div", { className: "border-t border-line px-2 py-2", onClick: alTocar, children: footer })
        ]
      }
    ) })
  ] });
}
function mobileMenuItemClass(activo = false) {
  return cn(
    "flex min-h-[48px] w-full items-center gap-3 rounded-md px-3 text-left text-[16px] font-medium transition-colors",
    activo ? "bg-neutro-100 text-brand-text" : "text-ink hover:bg-neutro-50"
  );
}
function MobileMenuSection({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "px-3 pb-1 pt-3 text-[12px] font-semibold uppercase tracking-wide text-subtle", children });
}
var DESDE = {
  lg: { flex: "lg:flex", block: "lg:block", contents: "lg:contents", oculto: "lg:hidden", gap: "lg:gap-4", gapAcciones: "lg:gap-3", px: "lg:px-6" },
  xl: { flex: "xl:flex", block: "xl:block", contents: "xl:contents", oculto: "xl:hidden", gap: "xl:gap-4", gapAcciones: "xl:gap-3", px: "xl:px-6" },
  "2xl": { flex: "2xl:flex", block: "2xl:block", contents: "2xl:contents", oculto: "2xl:hidden", gap: "2xl:gap-4", gapAcciones: "2xl:gap-3", px: "2xl:px-6" }
};
function isAppHeaderItemActive(item, path) {
  if (item.match?.(path)) return true;
  if (item.href === "/") return path === "/";
  const base = item.href.replace(/\/+$/, "");
  return path === base || path.startsWith(`${base}/`);
}
function groupAppHeaderItems(items) {
  const main = [];
  const grupos = /* @__PURE__ */ new Map();
  for (const item of items) {
    if (!item.group) main.push(item);
    else grupos.set(item.group, [...grupos.get(item.group) ?? [], item]);
  }
  return { main, groups: [...grupos.entries()] };
}
var enlacePorDefecto = ({ href, ...props }) => /* @__PURE__ */ jsx("a", { href, ...props });
var claseBarra = (activo, indicador = "texto") => cn(
  "whitespace-nowrap px-2 py-2 text-[13px] font-medium transition-colors",
  activo ? "text-brand-text" : "text-subtle hover:text-brand-text",
  // la barra va por ::after, pegada al borde de abajo del encabezado (tapa su línea de 1 px)
  indicador === "subrayado" && "relative inline-flex h-full items-center",
  indicador === "subrayado" && activo && "after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-t-sm after:bg-brand after:content-['']"
);
function MasSecciones({
  label,
  groups,
  path,
  renderLink,
  indicador
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  const activo = groups.some(([, items]) => items.some((i) => isAppHeaderItemActive(i, path)));
  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    const onKey = (e) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto]);
  useEffect(() => setAbierto(false), [path]);
  return /* @__PURE__ */ jsxs("div", { ref, className: cn("relative", indicador === "subrayado" && "flex h-full"), children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setAbierto((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        className: cn(claseBarra(activo, indicador), "inline-flex items-center gap-1"),
        children: [
          label,
          /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", className: cn("h-3.5 w-3.5 transition-transform", abierto && "rotate-180"), fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M5 8l5 5 5-5" }) })
        ]
      }
    ),
    abierto && /* @__PURE__ */ jsx(
      "div",
      {
        role: "menu",
        className: "absolute left-0 top-full z-30 mt-2 grid w-max max-w-[calc(100vw-1.5rem)] grid-cols-2 gap-x-6 gap-y-3 rounded-card border border-line bg-surface p-3 shadow-card",
        children: groups.map(([grupo, items]) => /* @__PURE__ */ jsxs("div", { className: "min-w-[10rem]", children: [
          /* @__PURE__ */ jsx("div", { className: "px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle", children: grupo }),
          items.map((item) => {
            const actual = isAppHeaderItemActive(item, path);
            return /* @__PURE__ */ jsx(Fragment, { children: renderLink({
              href: item.href,
              role: "menuitem",
              "aria-current": actual ? "page" : void 0,
              onClick: () => setAbierto(false),
              className: cn(
                "block whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                actual ? "bg-neutro-100 text-brand-text" : "text-ink hover:bg-neutro-50 hover:text-brand-text"
              ),
              children: item.label
            }) }, item.href);
          })
        ] }, grupo))
      }
    )
  ] });
}
function AppHeader({
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
  moreLabel = "M\xE1s",
  hubUrl = HUB_URL,
  indicador = "texto",
  mostrarApps = true,
  mostrarNombre = true,
  className
}) {
  const bp = DESDE[desktopFrom];
  const { main, groups } = groupAppHeaderItems(items);
  const enlaceMovil = (item) => {
    const actual = isAppHeaderItemActive(item, currentPath);
    return /* @__PURE__ */ jsx(Fragment, { children: renderLink({
      href: item.href,
      "aria-current": actual ? "page" : void 0,
      className: mobileMenuItemClass(actual),
      children: item.label
    }) }, item.href);
  };
  return /* @__PURE__ */ jsxs("header", { className: cn("sticky top-0 z-30 border-b border-neutro-200 bg-white", className), children: [
    notice && /* @__PURE__ */ jsx("div", { role: "status", className: "border-b border-ambar-300 bg-ambar-100 px-4 py-2 text-center text-[13px] font-medium text-ambar-700", children: notice }),
    /* @__PURE__ */ jsxs("div", { className: cn("flex h-16 items-center justify-between gap-2 px-3", bp.gap, bp.px), children: [
      /* @__PURE__ */ jsxs("div", { className: cn("flex min-w-0 items-center gap-2", bp.gap), children: [
        mostrarApps && /* @__PURE__ */ jsx(AppsMenu, { actual: moduleKey, hubUrl, className: "-ml-1.5 shrink-0" }),
        renderLink({ href: homeHref, className: "shrink-0", children: logo }),
        mostrarNombre && /* @__PURE__ */ jsx("span", { className: cn("min-w-0 truncate font-display text-[15px] font-semibold text-neutro-900", bp.oculto), children: moduleName }),
        /* @__PURE__ */ jsx("span", { className: cn("hidden h-6 w-px shrink-0 bg-neutro-200", bp.block), "aria-hidden": true }),
        mostrarNombre && /* @__PURE__ */ jsx("span", { className: cn("hidden shrink-0 whitespace-nowrap font-display text-[17px] font-semibold text-neutro-900", bp.block), children: moduleName }),
        /* @__PURE__ */ jsxs(
          "nav",
          {
            "aria-label": "Secciones del m\xF3dulo",
            className: cn("hidden shrink-0 items-center gap-1", bp.flex, indicador === "subrayado" && "self-stretch"),
            children: [
              main.map((item) => {
                const actual = isAppHeaderItemActive(item, currentPath);
                return /* @__PURE__ */ jsx(Fragment, { children: renderLink({
                  href: item.href,
                  "aria-current": actual ? "page" : void 0,
                  className: claseBarra(actual, indicador),
                  children: item.label
                }) }, item.href);
              }),
              groups.length > 0 && /* @__PURE__ */ jsx(MasSecciones, { label: moreLabel, groups, path: currentPath, renderLink, indicador })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("flex shrink-0 items-center gap-1", bp.gapAcciones), children: [
        persistentActions,
        /* @__PURE__ */ jsxs("span", { className: cn("hidden", bp.contents), children: [
          actions,
          user && /* @__PURE__ */ jsx("span", { className: "hidden whitespace-nowrap text-[13px] text-neutro-900 2xl:block", title: user.email, children: user.name }),
          onLogout && /* @__PURE__ */ jsx("button", { type: "button", onClick: onLogout, className: "px-2 py-1 text-[13px] text-subtle transition-colors hover:text-brand-text", children: "Salir" })
        ] }),
        /* @__PURE__ */ jsxs(
          MobileMenu,
          {
            className: bp.oculto,
            title: moduleName,
            footer: (user || mobileMenuFooter || onLogout) && /* @__PURE__ */ jsxs(Fragment$1, { children: [
              user && /* @__PURE__ */ jsxs("div", { className: "px-3 pb-2 pt-1", children: [
                /* @__PURE__ */ jsx("div", { className: "truncate text-[15px] font-medium text-ink", children: user.name }),
                user.email && /* @__PURE__ */ jsx("div", { className: "truncate text-[13px] text-subtle", children: user.email })
              ] }),
              mobileMenuFooter,
              onLogout && /* @__PURE__ */ jsx("button", { type: "button", "data-cierra": true, onClick: onLogout, className: mobileMenuItemClass(), children: "Salir" })
            ] }),
            children: [
              main.map(enlaceMovil),
              groups.map(([grupo, lista]) => /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(MobileMenuSection, { children: grupo }),
                lista.map(enlaceMovil)
              ] }, grupo))
            ]
          }
        )
      ] })
    ] })
  ] });
}
var ENFOCABLES = 'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
var mensajeDe = (e) => e instanceof Error && e.message ? e.message : typeof e === "string" && e ? e : "No se pudo completar. Prob\xE1 de nuevo.";
function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  reason,
  busy = false,
  error,
  onConfirm,
  onCancel
}) {
  const [texto, setTexto] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [fallo, setFallo] = useState(null);
  const tituloId = useId();
  const cuerpoId = useId();
  const cajaRef = useRef(null);
  const ocupado = busy || procesando;
  useEffect(() => {
    if (!open) return;
    setTexto("");
    setFallo(null);
    setProcesando(false);
    const previo = document.activeElement;
    return () => previo?.focus?.();
  }, [open]);
  const focoInicial = reason ? "motivo" : tone === "danger" ? "cancelar" : "confirmar";
  const focoRef = useRef(focoInicial);
  focoRef.current = focoInicial;
  useEffect(() => {
    if (!open) return;
    cajaRef.current?.querySelector(`[data-foco="${focoRef.current}"]`)?.focus();
  }, [open]);
  const cancelar = useCallback(() => {
    if (!ocupado) onCancel();
  }, [ocupado, onCancel]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && cancelar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cancelar]);
  if (!open) return null;
  const minimo = reason?.required ? Math.max(1, reason.minLength ?? 1) : 0;
  const motivoListo = texto.trim().length >= minimo;
  async function confirmar() {
    if (ocupado || !motivoListo) return;
    setFallo(null);
    try {
      const resultado = onConfirm(texto.trim());
      if (resultado && typeof resultado.then === "function") {
        setProcesando(true);
        await resultado;
      }
    } catch (e) {
      setFallo(mensajeDe(e));
    } finally {
      setProcesando(false);
    }
  }
  function atraparFoco(e) {
    if (e.key !== "Tab" || !cajaRef.current) return;
    const enfocables = [...cajaRef.current.querySelectorAll(ENFOCABLES)];
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }
  const errorVisible = fallo ?? error;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4",
      onClick: cancelar,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: cajaRef,
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": tituloId,
          "aria-describedby": children ? cuerpoId : void 0,
          "aria-busy": ocupado || void 0,
          className: cn(
            "w-full max-w-md overflow-auto bg-surface shadow-card",
            "max-h-[92vh] rounded-t-card sm:max-h-[90vh] sm:rounded-card"
          ),
          style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
          onClick: (e) => e.stopPropagation(),
          onKeyDown: atraparFoco,
          children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-line px-5 py-4", children: /* @__PURE__ */ jsx("h3", { id: tituloId, className: "text-h4 text-ink", children: title }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 px-5 py-4", children: [
              children && /* @__PURE__ */ jsx("div", { id: cuerpoId, className: "text-[14px] leading-relaxed text-ink", children }),
              reason && /* @__PURE__ */ jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxs("span", { className: "mb-1 block text-caption font-medium text-ink", children: [
                  reason.label,
                  reason.required && /* @__PURE__ */ jsx("span", { className: "font-normal text-subtle", children: " (obligatorio)" })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    "data-foco": "motivo",
                    value: texto,
                    onChange: (e) => setTexto(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) confirmar();
                    },
                    rows: 3,
                    placeholder: reason.placeholder,
                    disabled: ocupado,
                    className: "w-full rounded-md border border-line bg-white px-3 py-2 text-body text-ink placeholder:text-neutro-300 focus:border-brand-ring focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  }
                )
              ] }),
              errorVisible && /* @__PURE__ */ jsx("p", { role: "alert", className: "rounded-md border border-line bg-neutro-50 px-3 py-2 text-caption font-medium text-rojo-700", children: errorVisible }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
                /* @__PURE__ */ jsx(Button, { "data-foco": "cancelar", variant: "secondary", onClick: cancelar, disabled: ocupado, children: cancelLabel }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    "data-foco": "confirmar",
                    variant: tone === "danger" ? "danger" : "primary",
                    onClick: confirmar,
                    disabled: ocupado || !motivoListo,
                    children: ocupado ? "Procesando\u2026" : confirmLabel
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function useConfirm() {
  const [pedido, setPedido] = useState(null);
  const confirm = useCallback(
    (options) => new Promise((resolver) => {
      setPedido({ ...options, resolver });
    }),
    []
  );
  const cerrar = (r) => {
    pedido?.resolver(r);
    setPedido(null);
  };
  const dialog = /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      open: pedido !== null,
      title: pedido?.title ?? "",
      confirmLabel: pedido?.confirmLabel,
      cancelLabel: pedido?.cancelLabel,
      tone: pedido?.tone,
      reason: pedido?.reason,
      onConfirm: (reason) => cerrar({ confirmed: true, reason }),
      onCancel: () => cerrar({ confirmed: false, reason: "" }),
      children: pedido?.message
    }
  );
  return [confirm, dialog];
}
var entero = (v, minimo) => Number.isFinite(v) ? Math.max(minimo, Math.floor(v)) : minimo;
function paginationRange(total, pageSize, offset, siblings = 1) {
  const filas = entero(total, 0);
  const tam = entero(pageSize, 1);
  const pages = Math.max(1, Math.ceil(filas / tam));
  const page = Math.min(pages, Math.floor(entero(offset, 0) / tam) + 1);
  const from = filas === 0 ? 0 : (page - 1) * tam + 1;
  const to = Math.min(filas, page * tam);
  const visibles = /* @__PURE__ */ new Set([1, pages]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pages) visibles.add(p);
  const ordenadas = [...visibles].sort((a, b) => a - b);
  const items = [];
  ordenadas.forEach((p, i) => {
    const anterior = ordenadas[i - 1];
    if (anterior !== void 0 && p - anterior === 2) items.push(anterior + 1);
    else if (anterior !== void 0 && p - anterior > 2) items.push("\u2026");
    items.push(p);
  });
  return { page, pages, from, to, items };
}
var miles = (n) => n.toLocaleString("es-BO");
function Pagination({
  total,
  pageSize,
  offset,
  onChange,
  itemLabel = ["registro", "registros"],
  disabled = false,
  className
}) {
  const r = paginationRange(total, pageSize, offset);
  const tam = entero(pageSize, 1);
  const nombre = entero(total, 0) === 1 ? itemLabel[0] : itemLabel[1];
  const ir = (pagina) => {
    if (disabled || pagina < 1 || pagina > r.pages || pagina === r.page) return;
    onChange((pagina - 1) * tam);
  };
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "aria-label": "Paginaci\xF3n",
      className: cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-caption text-subtle", className),
      children: [
        /* @__PURE__ */ jsx("p", { className: "tnum", "aria-live": "polite", children: r.pages === 1 ? `${miles(entero(total, 0))} ${nombre}` : `Mostrando ${miles(r.from)}\u2013${miles(r.to)} de ${miles(entero(total, 0))} ${nombre}` }),
        r.pages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => ir(r.page - 1),
              disabled: disabled || r.page === 1,
              "aria-label": "P\xE1gina anterior",
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "tnum px-2 sm:hidden", children: [
            "P\xE1gina ",
            miles(r.page),
            " de ",
            miles(r.pages)
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hidden items-center gap-1 sm:flex", children: r.items.map(
            (p, i) => p === "\u2026" ? /* @__PURE__ */ jsx("span", { className: "px-1", "aria-hidden": true, children: "\u2026" }, `hueco-${i}`) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => ir(p),
                disabled,
                "aria-label": `P\xE1gina ${p}`,
                "aria-current": p === r.page ? "page" : void 0,
                className: cn(
                  "tnum h-8 min-w-[2rem] rounded-md px-2 text-caption font-medium transition-colors",
                  "[@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]",
                  "disabled:pointer-events-none disabled:opacity-50",
                  p === r.page ? "bg-neutro-100 text-brand-text" : "text-ink hover:bg-neutro-50"
                ),
                children: miles(p)
              },
              p
            )
          ) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => ir(r.page + 1),
              disabled: disabled || r.page === r.pages,
              "aria-label": "P\xE1gina siguiente",
              children: "Siguiente"
            }
          )
        ] })
      ]
    }
  );
}

// src/enlaces.ts
var DOMINIO_ENERSOL = "enersol-sa.com";
var LARGO_MAXIMO = 2048;
function tieneCaracteresRaros(s) {
  return /[\\\u0000-\u001f\u007f]/.test(s);
}
function origenActual(origen) {
  if (origen) return origen;
  if (typeof window !== "undefined" && window.location) return window.location.origin;
  return "http://localhost";
}
function origenDe(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
function rutaInterna(raw, origen) {
  if (!raw || raw.length > LARGO_MAXIMO || tieneCaracteresRaros(raw) || !raw.startsWith("/") || raw.startsWith("//")) {
    return "";
  }
  const base = origenActual(origen);
  try {
    const u = new URL(raw, base);
    if (u.origin !== new URL(base).origin) return "";
    return u.pathname + u.search + u.hash;
  } catch {
    return "";
  }
}
function destinoSeguro(next, origenesPermitidos = [], opciones = {}) {
  const porDefecto = opciones.porDefecto ?? "/";
  if (!next) return porDefecto;
  const v = next.trim();
  if (!v || v.length > LARGO_MAXIMO || tieneCaracteresRaros(v)) return porDefecto;
  if (v.startsWith("/")) return rutaInterna(v, opciones.origen) || porDefecto;
  if (origenesPermitidos.length === 0) return porDefecto;
  try {
    const u = new URL(v);
    if (u.username || u.password) return porDefecto;
    if (u.protocol !== "https:" && u.protocol !== "http:") return porDefecto;
    const permitidos = new Set(origenesPermitidos.map(origenDe).filter((o) => !!o));
    if (!permitidos.has(u.origin)) return porDefecto;
    return u.href;
  } catch {
    return porDefecto;
  }
}
function safeHref(raw, opciones = {}) {
  if (!raw) return void 0;
  const ruta = rutaInterna(raw, opciones.origen);
  if (ruta) return ruta;
  if (raw.length > LARGO_MAXIMO || tieneCaracteresRaros(raw)) return void 0;
  const dominio = (opciones.dominio ?? DOMINIO_ENERSOL).toLowerCase();
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (u.protocol !== "https:" || u.username || u.password) return void 0;
    if (host !== dominio && !host.endsWith("." + dominio)) return void 0;
    return u.href;
  } catch {
    return void 0;
  }
}
var MINIMO_MS = 1e3;
function documentoVisible() {
  return typeof document === "undefined" || document.visibilityState !== "hidden";
}
function iniciarSondeo(fn, opciones) {
  const ms = Number.isFinite(opciones.ms) ? Math.max(MINIMO_MS, opciones.ms) : MINIMO_MS;
  const visible = opciones.visible ?? documentoVisible;
  const programar = opciones.setInterval ?? ((f, t) => setInterval(f, t));
  const cancelar = opciones.clearInterval ?? ((id2) => clearInterval(id2));
  let enVuelo = false;
  let detenido = false;
  const vuelta = () => {
    if (detenido || enVuelo || !visible()) return;
    enVuelo = true;
    let r;
    try {
      r = fn();
    } catch {
      enVuelo = false;
      return;
    }
    if (r && typeof r.then === "function") {
      r.then(
        () => enVuelo = false,
        () => enVuelo = false
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
function useSondeo(fn, ms, activo = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!activo) return;
    return iniciarSondeo(() => ref.current(), { ms });
  }, [ms, activo]);
}

// src/reporteErrores.ts
var SIN_RED = /Failed to fetch|NetworkError|Load failed|network error/i;
function rutaActual() {
  return typeof window !== "undefined" && window.location ? window.location.pathname : "/";
}
function esPublica(ruta, prefijos) {
  return prefijos.some((pre) => {
    if (pre.endsWith("/")) return ruta.startsWith(pre) || ruta === pre.slice(0, -1);
    return ruta === pre || ruta.startsWith(pre + "/");
  });
}
function aError(err) {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error(err);
  try {
    return new Error(JSON.stringify(err));
  } catch {
    return new Error(String(err));
  }
}
function crearReporteErrores(opciones) {
  const enviados = /* @__PURE__ */ new Set();
  const maximo = opciones.maximo ?? 20;
  const ruta = opciones.ruta ?? rutaActual;
  const publicas = opciones.rutasPublicas ?? [];
  function reportar(err) {
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
      if (res && typeof res.catch === "function") res.catch(() => {
      });
    } catch {
    }
  }
  return { reportar };
}
var instalados = /* @__PURE__ */ new Map();
function instalarReporteErrores(opciones) {
  const previo = instalados.get(opciones.app);
  if (previo) return previo;
  const { reportar } = crearReporteErrores(opciones);
  const ignorar = opciones.ignorar;
  const enError = (ev) => {
    const motivo = ev.error ?? ev.message;
    if (ignorar?.(motivo)) return;
    reportar(motivo);
  };
  const enPromesa = (ev) => {
    const motivo = ev.reason;
    if (ignorar?.(motivo)) return;
    if (motivo && typeof motivo === "object" && motivo.deApi) return;
    reportar(motivo);
  };
  const conVentana = typeof window !== "undefined" && typeof window.addEventListener === "function";
  if (conVentana) {
    window.addEventListener("error", enError);
    window.addEventListener("unhandledrejection", enPromesa);
  }
  const instalado = {
    // Directo (ErrorBoundary): un error que rompió la pantalla se reporta siempre.
    reportar,
    desinstalar: () => {
      if (conVentana) {
        window.removeEventListener("error", enError);
        window.removeEventListener("unhandledrejection", enPromesa);
      }
      instalados.delete(opciones.app);
    }
  };
  instalados.set(opciones.app, instalado);
  return instalado;
}
var EVENTO_ABRIR_MENSAJES = "enersol:abrir-mensajes";
function rutasMensajes(prefijo) {
  const p = prefijo.replace(/\/+$/, "");
  return {
    unread: `${p}/unread`,
    threads: `${p}/threads`,
    thread: (conEmail) => `${p}/thread?con_email=${encodeURIComponent(conEmail)}`,
    menciones: `${p}/menciones`,
    leer: `${p}/leer`,
    leerThread: `${p}/leer-thread`,
    send: `${p}/send`,
    directorio: `${p}/directorio`
  };
}
function textoContador(total) {
  if (!Number.isFinite(total) || total <= 0) return "";
  return total > 99 ? "99+" : String(Math.floor(total));
}
function fecha(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-BO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
var POLL_MS = 3e4;
function IconoSobre({ className = "h-5 w-5" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className, fill: "none", stroke: "currentColor", strokeWidth: "1.8", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" }),
    /* @__PURE__ */ jsx("path", { d: "m3.5 7 8.5 6 8.5-6" })
  ] });
}
function IconoCerrar() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
}
var PANEL_DESDE = {
  // < sm: pantalla completa; desde sm, desplegable.
  sm: "fixed inset-0 z-[60] flex flex-col bg-surface sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:z-50 sm:mt-2 sm:block sm:w-[380px] sm:max-w-[92vw] sm:rounded-card sm:border sm:border-line sm:shadow-card",
  // < lg: pantalla completa (módulos cuyo encabezado pasa al menú ☰ recién en lg).
  lg: "fixed inset-0 z-[60] flex flex-col bg-surface lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:z-50 lg:mt-2 lg:block lg:w-[380px] lg:max-w-[92vw] lg:rounded-card lg:border lg:border-line lg:shadow-card",
  siempre: "fixed inset-0 z-[60] flex flex-col bg-surface"
};
var SOLO_MOVIL = { sm: "sm:hidden", lg: "lg:hidden", siempre: "" };
var LISTA_ALTO = { sm: "sm:max-h-[420px]", lg: "lg:max-h-[420px]", siempre: "" };
var CHAT_ALTO = { sm: "sm:h-[420px] sm:flex-none", lg: "lg:h-[420px] lg:flex-none", siempre: "" };
function MessagesBell({
  api: apiProp,
  selfEmail,
  prefijo = "/mensajes",
  pollMs = POLL_MS,
  enMenu = false,
  pantallaCompletaHasta = "sm",
  ocultarSiFalla = true,
  dominioEnlaces,
  className
}) {
  const rutas = useMemo(() => rutasMensajes(prefijo), [prefijo]);
  const apiRef = useRef(apiProp);
  apiRef.current = apiProp;
  const api = useMemo(
    () => ({
      get: (path) => apiRef.current.get(path),
      post: (path, body) => apiRef.current.post(path, body)
    }),
    []
  );
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("mensajes");
  const [threads, setThreads] = useState(null);
  const [menciones, setMenciones] = useState(null);
  const [chatCon, setChatCon] = useState(null);
  const [nuevoPara, setNuevoPara] = useState(false);
  const [disponible, setDisponible] = useState(true);
  const raizRef = useRef(null);
  const botonRef = useRef(null);
  const modo = enMenu ? "siempre" : pantallaCompletaHasta;
  const poll = useCallback(async () => {
    try {
      const r = await api.get(rutas.unread);
      setTotal(Number(r?.total) || 0);
      setDisponible(true);
    } catch {
      if (ocultarSiFalla) setDisponible(false);
    }
  }, [api, rutas.unread, ocultarSiFalla]);
  useSondeo(poll, pollMs);
  const cargarListas = useCallback(() => {
    api.get(rutas.threads).then(setThreads).catch(() => {
    });
    api.get(rutas.menciones).then(setMenciones).catch(() => {
    });
  }, [api, rutas.threads, rutas.menciones]);
  const cerrar = useCallback(() => {
    setOpen(false);
    setNuevoPara(false);
    botonRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!open) return;
    const fuera = (e) => {
      if (raizRef.current && !raizRef.current.contains(e.target)) setOpen(false);
    };
    const tecla = (e) => e.key === "Escape" && cerrar();
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [open, cerrar]);
  useEffect(() => {
    if (enMenu) return;
    const h = () => {
      setChatCon(null);
      setTab("mensajes");
      setOpen(true);
      cargarListas();
    };
    window.addEventListener(EVENTO_ABRIR_MENSAJES, h);
    return () => window.removeEventListener(EVENTO_ABRIR_MENSAJES, h);
  }, [cargarListas, enMenu]);
  function alternar() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    cargarListas();
  }
  async function marcarMencionesLeidas(items) {
    const ids = items.filter((m) => !m.leido).map((m) => m.id);
    if (ids.length === 0) return;
    await api.post(rutas.leer, { ids }).catch(() => {
    });
    setMenciones((ms) => ms?.map((m) => ({ ...m, leido: true })) ?? null);
    poll();
  }
  if (!disponible) return null;
  const contador = textoContador(total);
  const mencionesSinLeer = menciones?.filter((m) => !m.leido).length ?? 0;
  const etiqueta = contador ? `Mensajes (${contador} sin leer)` : "Mensajes";
  return /* @__PURE__ */ jsxs("div", { className: cn(!enMenu && "relative", className), ref: raizRef, children: [
    enMenu ? /* @__PURE__ */ jsxs("button", { ref: botonRef, type: "button", onClick: alternar, "aria-haspopup": "dialog", "aria-expanded": open, className: mobileMenuItemClass(), children: [
      /* @__PURE__ */ jsx(IconoSobre, {}),
      /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Mensajes" }),
      contador && /* @__PURE__ */ jsx("span", { className: "grid h-6 min-w-[24px] place-items-center rounded-pill bg-brand px-1.5 text-[12px] font-bold text-brand-on", "aria-label": `${contador} sin leer`, children: contador })
    ] }) : /* @__PURE__ */ jsxs(
      "button",
      {
        ref: botonRef,
        type: "button",
        onClick: alternar,
        "aria-label": etiqueta,
        title: etiqueta,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        className: "relative inline-flex items-center justify-center rounded-md p-2 text-subtle hover:bg-neutro-100 hover:text-ink [@media(pointer:coarse)]:p-3",
        children: [
          /* @__PURE__ */ jsx(IconoSobre, {}),
          contador && /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              className: "absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] animate-bounce place-items-center rounded-pill bg-brand px-1 text-[10px] font-bold text-brand-on motion-reduce:animate-none",
              children: contador
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs(
      "div",
      {
        role: "dialog",
        "aria-label": "Mensajes",
        className: PANEL_DESDE[modo],
        style: { paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-between border-b border-line px-4 py-1", SOLO_MOVIL[modo]), children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-[17px] font-semibold text-ink", children: "Mensajes" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: cerrar,
                "aria-label": "Cerrar mensajes",
                className: "-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 hover:text-ink",
                children: /* @__PURE__ */ jsx(IconoCerrar, {})
              }
            )
          ] }),
          chatCon ? /* @__PURE__ */ jsx(
            ChatView,
            {
              api,
              rutas,
              pollMs,
              con: chatCon,
              selfEmail,
              alto: CHAT_ALTO[modo],
              onBack: () => {
                setChatCon(null);
                api.get(rutas.threads).then(setThreads).catch(() => {
                });
                poll();
              }
            }
          ) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 px-3 pt-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex gap-1", role: "tablist", "aria-label": "Mensajes y menciones", children: ["mensajes", "menciones"].map((t) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": tab === t,
                  onClick: () => {
                    setTab(t);
                    if (t === "menciones" && menciones) marcarMencionesLeidas(menciones);
                  },
                  className: cn(
                    "rounded-md px-3 py-1.5 text-caption font-medium [@media(pointer:coarse)]:min-h-[44px]",
                    tab === t ? "bg-neutro-100 text-brand-fg" : "text-subtle hover:text-ink"
                  ),
                  children: [
                    t === "mensajes" ? "Mensajes" : "Menciones",
                    t === "menciones" && mencionesSinLeer > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 text-[11px] font-bold text-brand-text", children: mencionesSinLeer })
                  ]
                },
                t
              )) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setNuevoPara(true),
                  className: "rounded-md px-1 text-caption font-medium text-brand-fg hover:underline [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:px-2",
                  children: "+ Nuevo"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: cn("min-h-0 flex-1 overflow-y-auto p-2", LISTA_ALTO[modo]), children: [
              nuevoPara && /* @__PURE__ */ jsx(
                NuevoMensaje,
                {
                  api,
                  ruta: rutas.directorio,
                  onElegir: (d) => {
                    setNuevoPara(false);
                    setChatCon(d);
                  },
                  onCerrar: () => setNuevoPara(false)
                }
              ),
              tab === "mensajes" ? !threads || threads.length === 0 ? /* @__PURE__ */ jsx(Vacio, { texto: "Sin conversaciones. Toc\xE1 \xAB+ Nuevo\xBB para escribirle a alguien." }) : threads.map((t) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setChatCon({ email: t.con_email, nombre: t.con_nombre }),
                  className: "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-neutro-50 [@media(pointer:coarse)]:py-3",
                  children: [
                    /* @__PURE__ */ jsx(Avatar, { nombre: t.con_nombre }),
                    /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: cn("truncate text-caption text-ink", t.no_leidos > 0 && "font-semibold"), children: t.con_nombre }),
                        /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[12px] text-subtle sm:text-[10px]", children: fecha(t.ultimo_at) })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "block truncate text-[12px] text-subtle sm:text-[11px]", children: t.ultimo_cuerpo })
                    ] }),
                    t.no_leidos > 0 && /* @__PURE__ */ jsx("span", { className: "mt-1 grid h-4 min-w-[16px] shrink-0 place-items-center rounded-pill bg-brand px-1 text-[10px] font-bold text-brand-on", children: t.no_leidos })
                  ]
                },
                t.con_email
              )) : !menciones || menciones.length === 0 ? /* @__PURE__ */ jsx(Vacio, { texto: "Sin menciones. Cuando te tagueen con @ en una nota, aparece ac\xE1." }) : menciones.map((m) => {
                const href = safeHref(m.context_url, { dominio: dominioEnlaces });
                return /* @__PURE__ */ jsxs("div", { className: cn("rounded-md px-2 py-2", !m.leido && "bg-neutro-50"), children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-caption font-medium text-ink", children: m.de_nombre }),
                    /* @__PURE__ */ jsx("span", { className: "text-[12px] text-subtle sm:text-[10px]", children: fecha(m.created_at) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-0.5 whitespace-pre-line text-[13px] text-ink sm:text-[11px]", children: m.cuerpo }),
                  href && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href,
                      className: "text-[12px] font-medium text-brand-fg hover:underline sm:text-[11px] [@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:items-center",
                      children: [
                        "Abrir ",
                        m.context_label ?? "el contexto",
                        " \u2192"
                      ]
                    }
                  )
                ] }, m.id);
              })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function Vacio({ texto }) {
  return /* @__PURE__ */ jsx("p", { className: "px-2 py-6 text-center text-caption text-subtle", children: texto });
}
function Avatar({ nombre }) {
  const ini = nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-neutro-100 text-[11px] font-semibold text-subtle", children: ini });
}
function NuevoMensaje({
  api,
  ruta,
  onElegir,
  onCerrar
}) {
  const [dir, setDir] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    api.get(ruta).then(setDir).catch(() => {
    });
  }, [api, ruta]);
  const busca = q.trim().toLowerCase();
  const filtrados = dir.filter((d) => d.nombre.toLowerCase().includes(busca) || d.email.toLowerCase().includes(busca));
  return /* @__PURE__ */ jsxs("div", { className: "mb-2 rounded-md border border-line p-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          autoFocus: true,
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "\xBFA qui\xE9n le escrib\xEDs?",
          "aria-label": "\xBFA qui\xE9n le escrib\xEDs?",
          className: "min-w-0 flex-1 rounded-md border border-line px-2 py-1.5 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-caption"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCerrar,
          "aria-label": "Cerrar",
          className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
          children: /* @__PURE__ */ jsx(IconoCerrar, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 max-h-60 overflow-y-auto sm:max-h-40", children: filtrados.map((d) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => onElegir(d),
        className: "w-full rounded-md px-2 py-1.5 text-left text-caption text-ink hover:bg-neutro-50 [@media(pointer:coarse)]:py-3",
        children: [
          d.nombre,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[12px] text-subtle max-sm:break-all sm:text-[10px]", children: d.email })
        ]
      },
      d.email
    )) })
  ] });
}
function ChatView({
  api,
  rutas,
  pollMs,
  con,
  selfEmail,
  alto,
  onBack
}) {
  const [msgs, setMsgs] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const { thread, leerThread, send } = rutas;
  const cargar = useCallback(async () => {
    const r = await api.get(thread(con.email));
    setMsgs(Array.isArray(r) ? r : []);
    await api.post(leerThread, { con_email: con.email }).catch(() => {
    });
  }, [api, thread, leerThread, con.email]);
  useEffect(() => iniciarSondeo(() => cargar().catch(() => {
  }), { ms: pollMs }), [cargar, pollMs]);
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [msgs.length]);
  async function enviar() {
    const cuerpo = texto.trim();
    if (!cuerpo || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await api.post(send, { para_email: con.email, cuerpo });
      setTexto("");
      await cargar();
    } catch {
      setError("No se pudo enviar. Prob\xE1 de nuevo.");
    } finally {
      setEnviando(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: cn("flex min-h-0 flex-1 flex-col", alto), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-line px-3 py-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onBack,
          "aria-label": "Volver a las conversaciones",
          className: "-ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-caption font-medium text-brand-fg hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
          children: "\u2190"
        }
      ),
      /* @__PURE__ */ jsx(Avatar, { nombre: con.nombre }),
      /* @__PURE__ */ jsx("span", { className: "truncate text-caption font-semibold text-ink", children: con.nombre })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 overflow-y-auto p-3", "aria-live": "polite", children: [
      msgs.map((m) => {
        const mio = m.de_email === selfEmail;
        return /* @__PURE__ */ jsx("div", { className: cn("flex", mio ? "justify-end" : "justify-start"), children: /* @__PURE__ */ jsxs("div", { className: cn("max-w-[80%] whitespace-pre-line break-words rounded-card px-3 py-2 text-caption", mio ? "bg-brand text-brand-on" : "bg-neutro-100 text-ink"), children: [
          m.cuerpo,
          /* @__PURE__ */ jsx("div", { className: cn("mt-0.5 text-[11px] sm:text-[9px]", mio ? "text-brand-on/70" : "text-subtle"), children: fecha(m.created_at) })
        ] }) }, m.id);
      }),
      /* @__PURE__ */ jsx("div", { ref: endRef })
    ] }),
    error && /* @__PURE__ */ jsx("p", { role: "alert", className: "px-3 pb-1 text-[12px] text-rojo-600", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 border-t border-line p-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: texto,
          onChange: (e) => setTexto(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          },
          placeholder: "Escrib\xED un mensaje\u2026",
          "aria-label": "Escrib\xED un mensaje",
          className: "min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-caption"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: enviar,
          disabled: enviando || !texto.trim(),
          className: "rounded-md bg-brand px-4 text-caption font-medium text-brand-on hover:bg-brand-hover disabled:opacity-50 [@media(pointer:coarse)]:min-h-[44px]",
          children: "Enviar"
        }
      )
    ] })
  ] });
}
var SUGERENCIA_MAX_BYTES = 4 * 1024 * 1024;
var SUGERENCIA_TIPOS_CAPTURA = ["image/png", "image/jpeg", "image/webp"];
var MINIMO_DESCRIPCION = 5;
function validarSugerencia(datos, maxBytes = SUGERENCIA_MAX_BYTES) {
  if (datos.descripcion.trim().length < MINIMO_DESCRIPCION) {
    return `Contanos un poco m\xE1s (m\xEDnimo ${MINIMO_DESCRIPCION} caracteres).`;
  }
  const c = datos.captura;
  if (c) {
    if (c.type && !SUGERENCIA_TIPOS_CAPTURA.includes(c.type)) {
      return "La captura tiene que ser una imagen PNG, JPG o WEBP.";
    }
    if (c.size > maxBytes) {
      const mb = Math.round(maxBytes / (1024 * 1024) * 10) / 10;
      return `La captura pesa m\xE1s de ${String(mb).replace(".", ",")} MB.`;
    }
  }
  return null;
}
function leerComoBase64(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("No se pudo leer la imagen."));
    r.readAsDataURL(f);
  });
}
function pantallaActual() {
  return typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
}
var mensajeDe2 = (e) => e instanceof Error && e.message ? e.message : typeof e === "string" && e ? e : "No se pudo enviar. Prob\xE1 de nuevo.";
function SugerenciaBoton({
  onEnviar,
  variante = "boton",
  className,
  textoGracias,
  maxBytes
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        title: "Mandar una mejora o reportar un error",
        "aria-haspopup": "dialog",
        className: cn(
          variante === "menu" ? mobileMenuItemClass() : "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-line px-2 py-1 text-[12px] font-medium text-subtle transition-colors hover:border-brand hover:text-brand-fg [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:px-3",
          className
        ),
        children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u{1F4A1}" }),
          " ",
          variante === "menu" ? "Mejoras y errores" : "Mejoras"
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      SugerenciaModal,
      {
        open,
        onClose: () => setOpen(false),
        onEnviar,
        textoGracias,
        maxBytes
      }
    )
  ] });
}
function SugerenciaModal({
  open = true,
  onClose,
  onEnviar,
  textoGracias = "\xA1Gracias! Qued\xF3 registrado y le llega al equipo por correo.",
  maxBytes = SUGERENCIA_MAX_BYTES,
  url
}) {
  const [tipo, setTipo] = useState("mejora");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [listo, setListo] = useState(false);
  const idTexto = useId();
  const idArchivo = useId();
  useEffect(() => {
    if (!open) return;
    setTipo("mejora");
    setDescripcion("");
    setArchivo(null);
    setError(null);
    setListo(false);
    setBusy(false);
  }, [open]);
  async function enviar() {
    if (busy) return;
    const problema = validarSugerencia({ descripcion, captura: archivo }, maxBytes);
    if (problema) {
      setError(problema);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const captura = archivo ? await leerComoBase64(archivo) : null;
      await onEnviar({
        tipo,
        descripcion: descripcion.trim(),
        url: url ?? pantallaActual(),
        captura_b64: captura,
        captura_nombre: archivo?.name ?? null,
        captura_tipo: archivo?.type || null
      });
      setListo(true);
    } catch (e) {
      setError(mensajeDe2(e));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsx(Modal, { open, onClose, title: "Mejoras y errores", children: listo ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", role: "status", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[14px] text-ink", children: textoGracias }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: onClose, children: "Cerrar" }) })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[12px] text-subtle", children: "Cont\xE1 qu\xE9 mejorar\xEDas o qu\xE9 no funcion\xF3. Se manda con tu nombre y la pantalla en la que est\xE1s." }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", role: "group", "aria-label": "Tipo", children: ["mejora", "error"].map((t) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-pressed": tipo === t,
        onClick: () => setTipo(t),
        className: cn(
          "rounded-pill border px-3 py-1.5 text-[13px] [@media(pointer:coarse)]:min-h-[44px]",
          tipo === t ? "border-brand bg-brand text-brand-on" : "border-line bg-white text-ink hover:bg-neutro-50"
        ),
        children: t === "mejora" ? "\u{1F4A1} Mejora" : "\u{1F41E} Error"
      },
      t
    )) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: idTexto, className: "sr-only", children: tipo === "error" ? "Qu\xE9 pas\xF3" : "Qu\xE9 mejorar\xEDas" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: idTexto,
          value: descripcion,
          onChange: (e) => setDescripcion(e.target.value),
          rows: 5,
          placeholder: tipo === "error" ? "Qu\xE9 hiciste, qu\xE9 esperabas y qu\xE9 pas\xF3\u2026" : "Qu\xE9 te gustar\xEDa que haga o cambie\u2026",
          className: "w-full rounded-md border border-line px-3 py-2 text-[16px] text-ink placeholder:text-neutro-300 focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-[14px]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: idArchivo, className: "block text-[13px] text-ink", children: "Captura de pantalla (opcional)" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: idArchivo,
          type: "file",
          accept: SUGERENCIA_TIPOS_CAPTURA.join(","),
          className: "mt-1 block w-full text-[13px] text-subtle sm:text-[12px]",
          onChange: (e) => setArchivo(e.target.files?.[0] ?? null)
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[12px] text-subtle sm:text-[11px]", children: [
        "PNG, JPG o WEBP, hasta ",
        Math.round(maxBytes / (1024 * 1024)),
        " MB."
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-[13px] text-rojo-600", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, children: "Cancelar" }),
      /* @__PURE__ */ jsx(Button, { onClick: enviar, disabled: busy, children: busy ? "Enviando\u2026" : "Enviar" })
    ] })
  ] }) });
}
function normalizarRuta(path) {
  const sinConsulta = path.split(/[?#]/)[0] || "/";
  return sinConsulta.replace(/\/+$/, "") || "/";
}
function guiasPorRuta(guias, path) {
  const p = normalizarRuta(path);
  return guias.filter((g) => {
    try {
      return g.match(p);
    } catch {
      return false;
    }
  });
}
function rutaEmpieza(prefijo) {
  const pre = normalizarRuta(prefijo);
  return (p) => p === pre || p.startsWith(pre === "/" ? "/" : pre + "/");
}
function partirNegritas(texto) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return partes.map((p, i) => ({ texto: p, negrita: i % 2 === 1 })).filter((p) => p.texto !== "");
}
function conNegritas(texto) {
  return partirNegritas(texto).map((p, i) => p.negrita ? /* @__PURE__ */ jsx("b", { children: p.texto }, i) : /* @__PURE__ */ jsx("span", { children: p.texto }, i));
}
function IconoGuia({ className = "h-5 w-5" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className, fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "17", r: ".6", fill: "currentColor" })
  ] });
}
function IconoCerrar2() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
}
function GuiaContenido({ guia }) {
  if (guia.render) return /* @__PURE__ */ jsx(Fragment$1, { children: guia.render() });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      guia.icono && /* @__PURE__ */ jsx("span", { className: "text-[20px]", "aria-hidden": true, children: guia.icono }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-[17px] font-semibold text-ink", children: guia.titulo })
    ] }),
    guia.intro && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[13px] text-subtle", children: conNegritas(guia.intro) }),
    guia.quien && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-[12px] text-subtle sm:text-[11px]", children: [
      /* @__PURE__ */ jsx("b", { children: "Qui\xE9n lo ve:" }),
      " ",
      conNegritas(guia.quien)
    ] }),
    guia.pasos && guia.pasos.length > 0 && /* @__PURE__ */ jsx("ol", { className: "mt-4 space-y-3", children: guia.pasos.map((p, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-brand-on", "aria-hidden": true, children: i + 1 }),
      /* @__PURE__ */ jsx("p", { className: "min-w-0 text-[14px] leading-relaxed text-ink sm:text-[13px]", children: conNegritas(p) })
    ] }, i)) }),
    guia.notas && guia.notas.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: guia.notas.map((n, i) => /* @__PURE__ */ jsx("div", { className: "rounded-md border border-line bg-neutro-50 px-3 py-2 text-[13px] text-ink sm:text-[12px]", children: conNegritas(n) }, i)) })
  ] });
}
function GuiaPanel({
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
  pie
}) {
  const coinciden = useMemo(() => {
    const forzada = guiaId ? guias.find((g) => g.id === guiaId) : void 0;
    if (forzada) return [forzada];
    const m = guiasPorRuta(guias, path);
    if (m.length > 0) return m;
    const def = porDefecto && guias.find((g) => g.id === porDefecto) || guias[0];
    return def ? [def] : [];
  }, [guias, path, porDefecto, guiaId]);
  const principal = coinciden[0]?.id ?? "";
  const [id, setId] = useState(principal);
  useEffect(() => {
    setId(principal);
  }, [principal, open]);
  const conSelector = elegirOtra ?? guias.some((g) => !g.render);
  const visibles = useMemo(
    () => guias.filter((g) => coinciden.some((c) => c.id === g.id) || !filtrar || filtrar(g)),
    [guias, coinciden, filtrar]
  );
  const asideRef = useRef(null);
  const tituloId = useId();
  const cerrarRef = useRef(onClose);
  cerrarRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement;
    const h = (e) => e.key === "Escape" && cerrarRef.current();
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
  const aMostrar = multiples === "todas" && coinciden.some((c) => c.id === id) ? coinciden : elegida ? [elegida] : [];
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60]", role: "dialog", "aria-modal": "true", "aria-labelledby": tituloId, children: [
    /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Cerrar gu\xEDa", tabIndex: -1, onClick: onClose, className: "absolute inset-0 h-full w-full cursor-default bg-neutro-900/30" }),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        ref: asideRef,
        tabIndex: -1,
        className: "absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-surface shadow-card focus:outline-none",
        style: { paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-line px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { id: tituloId, className: "text-[13px] font-semibold text-ink", children: "\u2753 Gu\xEDa de esta pantalla" }),
              conSelector && visibles.length > 1 && /* @__PURE__ */ jsx(
                "select",
                {
                  value: elegida?.id ?? "",
                  onChange: (e) => setId(e.target.value),
                  className: "mt-1 h-10 max-w-full rounded-md border border-line bg-white px-1.5 text-[16px] text-ink sm:h-7 sm:text-[11px]",
                  "aria-label": "Ver la gu\xEDa de otra pantalla",
                  children: visibles.map((x) => /* @__PURE__ */ jsx("option", { value: x.id, children: x.titulo }, x.id))
                }
              ),
              enlaceGuiaCompleta && /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] text-brand-fg sm:text-[11px] [&_a:hover]:underline [&_a]:inline-flex [&_a]:items-center [@media(pointer:coarse)]:[&_a]:min-h-[44px]", children: enlaceGuiaCompleta })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Cerrar",
                className: "-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
                children: /* @__PURE__ */ jsx(IconoCerrar2, {})
              }
            )
          ] }),
          enPestanas && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 border-b border-line px-4 py-2", role: "tablist", "aria-label": "Gu\xEDas de esta pantalla", children: coinciden.map((g) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": elegida?.id === g.id,
              onClick: () => setId(g.id),
              className: cn(
                "rounded-pill border px-2.5 py-1 text-[12px] transition-colors sm:text-[11px] [@media(pointer:coarse)]:min-h-[40px]",
                elegida?.id === g.id ? "border-brand bg-brand text-brand-on" : "border-line bg-white text-ink hover:bg-neutro-50"
              ),
              children: g.titulo
            },
            g.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-8 overflow-y-auto px-4 py-4 sm:px-6", children: [
            aMostrar.map((g) => /* @__PURE__ */ jsx(GuiaContenido, { guia: g }, g.id)),
            aMostrar.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-[13px] text-subtle", children: "Todav\xEDa no hay una gu\xEDa para esta pantalla." }),
            pie
          ] })
        ]
      }
    )
  ] });
}
function GuiaBoton({
  variante = "icono",
  className,
  ocultarEn,
  open: openProp,
  onOpenChange,
  sinBoton = false,
  ...panel
}) {
  const [openLocal, setOpenLocal] = useState(false);
  const controlado = openProp !== void 0;
  const open = controlado ? !!openProp : openLocal;
  const setOpen = (v) => controlado ? onOpenChange?.(v) : setOpenLocal(v);
  if (ocultarEn?.(panel.path)) return null;
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    !sinBoton && (variante === "menu" ? /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setOpen(true), "aria-haspopup": "dialog", className: cn(mobileMenuItemClass(), className), children: [
      /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u2753" }),
      " Gu\xEDa de esta pantalla"
    ] }) : /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        "aria-haspopup": "dialog",
        "aria-label": "Gu\xEDa de uso de esta pantalla",
        title: "Gu\xEDa de uso de esta pantalla",
        className: cn(
          "relative inline-flex items-center justify-center rounded-md p-2 text-subtle hover:bg-neutro-100 hover:text-ink [@media(pointer:coarse)]:p-3",
          className
        ),
        children: /* @__PURE__ */ jsx(IconoGuia, {})
      }
    )),
    /* @__PURE__ */ jsx(GuiaPanel, { ...panel, open, onClose: () => setOpen(false) })
  ] });
}

export { AppHeader, AppsMenu, Badge, Button, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, ConfirmDialog, DOMINIO_ENERSOL, DataTable, EVENTO_ABRIR_MENSAJES, EmptyState, GuiaBoton, GuiaContenido, GuiaPanel, HUB_URL, IconoGuia, Input, Logo, MODULOS_ENERSOL, MessagesBell, MobileMenu, MobileMenuSection, Modal, PageHeader, Pagination, SUGERENCIA_MAX_BYTES, SUGERENCIA_TIPOS_CAPTURA, Select, Spinner, SugerenciaBoton, SugerenciaModal, cn, conNegritas, crearReporteErrores, destinoSeguro, groupAppHeaderItems, guiasPorRuta, iniciarSondeo, instalarReporteErrores, isAppHeaderItemActive, mobileMenuItemClass, normalizarRuta, paginationRange, partirNegritas, rutaEmpieza, rutaInterna, rutasMensajes, safeHref, textoContador, useConfirm, useSondeo, validarSugerencia };
