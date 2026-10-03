import { useState, useEffect, useMemo, useRef } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

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
  { clave: "financiamiento", nombre: "Financiamiento", url: "https://propuestas.enersol-sa.com/financiamiento", descripcion: "Cr\xE9ditos a clientes y cobranza" }
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

export { AppsMenu, Badge, Button, Card, CardBody, CardHeader, CenteredSpinner, CollapsibleCard, DataTable, EmptyState, HUB_URL, Input, Logo, MODULOS_ENERSOL, MobileMenu, MobileMenuSection, Modal, PageHeader, Select, Spinner, cn, mobileMenuItemClass };
