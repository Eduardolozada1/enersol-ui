import { useState, useEffect, useMemo, useRef, Fragment, useId, useCallback } from 'react';
import { jsx, jsxs, Fragment as Fragment$1 } from 'react/jsx-runtime';

// src/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
var BUTTON_VARIANTS = {
  // Rojo manda pero no satura: primario sólido, el resto sobrio. UN primario por pantalla.
  primary: "bg-brand text-white hover:bg-brand-fg focus-visible:ring-rojo-300",
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
  marca: "bg-white text-rojo-700 border border-rojo-300"
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
        "focus:outline-none focus:ring-2 focus:ring-rojo-300 focus:border-rojo-300",
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
        "focus:outline-none focus:ring-2 focus:ring-rojo-300",
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
                  onRowClick && "cursor-pointer hover:bg-neutro-50 focus:outline-none focus-visible:bg-neutro-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rojo-300",
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
                  /* @__PURE__ */ jsxs("div", { className: cn("text-caption font-medium", esActual ? "text-brand" : "text-ink"), children: [
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
    activo ? "bg-neutro-100 text-brand" : "text-ink hover:bg-neutro-50"
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
var claseBarra = (activo) => cn(
  "whitespace-nowrap px-2 py-2 text-[13px] font-medium transition-colors",
  activo ? "text-brand" : "text-subtle hover:text-brand"
);
function MasSecciones({
  label,
  groups,
  path,
  renderLink
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
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setAbierto((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        className: cn(claseBarra(activo), "inline-flex items-center gap-1"),
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
                actual ? "bg-neutro-100 text-brand" : "text-ink hover:bg-neutro-50 hover:text-brand"
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
        /* @__PURE__ */ jsx(AppsMenu, { actual: moduleKey, hubUrl, className: "-ml-1.5 shrink-0" }),
        renderLink({ href: homeHref, className: "shrink-0", children: logo }),
        /* @__PURE__ */ jsx("span", { className: cn("min-w-0 truncate font-display text-[15px] font-semibold text-neutro-900", bp.oculto), children: moduleName }),
        /* @__PURE__ */ jsx("span", { className: cn("hidden h-6 w-px shrink-0 bg-neutro-200", bp.block), "aria-hidden": true }),
        /* @__PURE__ */ jsx("span", { className: cn("hidden shrink-0 whitespace-nowrap font-display text-[17px] font-semibold text-neutro-900", bp.block), children: moduleName }),
        /* @__PURE__ */ jsxs("nav", { "aria-label": "Secciones del m\xF3dulo", className: cn("hidden shrink-0 items-center gap-1", bp.flex), children: [
          main.map((item) => {
            const actual = isAppHeaderItemActive(item, currentPath);
            return /* @__PURE__ */ jsx(Fragment, { children: renderLink({
              href: item.href,
              "aria-current": actual ? "page" : void 0,
              className: claseBarra(actual),
              children: item.label
            }) }, item.href);
          }),
          groups.length > 0 && /* @__PURE__ */ jsx(MasSecciones, { label: moreLabel, groups, path: currentPath, renderLink })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("flex shrink-0 items-center gap-1", bp.gapAcciones), children: [
        persistentActions,
        /* @__PURE__ */ jsxs("span", { className: cn("hidden", bp.contents), children: [
          actions,
          user && /* @__PURE__ */ jsx("span", { className: "hidden whitespace-nowrap text-[13px] text-neutro-900 2xl:block", title: user.email, children: user.name }),
          onLogout && /* @__PURE__ */ jsx("button", { type: "button", onClick: onLogout, className: "px-2 py-1 text-[13px] text-subtle transition-colors hover:text-brand", children: "Salir" })
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
                    className: "w-full rounded-md border border-line bg-white px-3 py-2 text-body text-ink placeholder:text-neutro-300 focus:border-rojo-300 focus:outline-none focus:ring-2 focus:ring-rojo-300"
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
                  p === r.page ? "bg-neutro-100 text-brand" : "text-ink hover:bg-neutro-50"
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

export { AppHeader, AppsMenu, Badge, Button, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, ConfirmDialog, DataTable, EmptyState, HUB_URL, Input, Logo, MODULOS_ENERSOL, MobileMenu, MobileMenuSection, Modal, PageHeader, Pagination, Select, Spinner, cn, groupAppHeaderItems, isAppHeaderItemActive, mobileMenuItemClass, paginationRange, useConfirm };
