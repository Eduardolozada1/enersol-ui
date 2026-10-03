import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";
import { EmptyState } from "./primitives";

/** Tabla de datos estándar del ecosistema: orden por columna, cabecera fija al hacer
 *  scroll, fila clicable (mouse y teclado), dígitos tabulares en las columnas numéricas y
 *  estado vacío. Toda lista "de trabajo" usa esta tabla para comportarse igual. */
export type Column<T> = {
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

const HIDE: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

export function DataTable<T>({
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
  movil = "tarjetas",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  empty?: { title: ReactNode; hint?: ReactNode; action?: ReactNode };
  dense?: boolean;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
  stickyTopClassName?: string;
  movil?: "tarjetas" | "tabla";
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(defaultSort ?? null);

  const ordenadas = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const sv = col.sortValue;
    const mul = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = sv(a);
      const vb = sv(b);
      // Los vacíos siempre al final, sin importar la dirección.
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * mul;
      return String(va).localeCompare(String(vb), "es", { numeric: true, sensitivity: "base" }) * mul;
    });
  }, [rows, sort, columns]);

  function toggleSort(col: Column<T>) {
    if (!col.sortValue) return;
    setSort((s) =>
      s?.key === col.key
        ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key: col.key, dir: col.align === "right" ? "desc" : "asc" },
    );
  }

  function onKey(e: KeyboardEvent<HTMLTableRowElement>, row: T) {
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
  const alignCls = (a?: Column<T>["align"]) =>
    a === "right" ? "text-right tnum" : a === "center" ? "text-center" : "text-left";

  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-card shadow-card",
        // En celular la tabla scrollea de lado dentro de su tarjeta; en escritorio queda
        // visible para que la cabecera pueda pegarse arriba al scrollear la página.
        "overflow-x-auto lg:overflow-visible",
        className,
      )}
    >
      {tarjetas && (
        <div className="sm:hidden">
          {ordenables.length > 0 && ordenadas.length > 1 && (
            <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-caption text-subtle">
              <span className="shrink-0">Ordenar</span>
              <select
                aria-label="Ordenar por"
                value={sort ? `${sort.key}:${sort.dir}` : ""}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(":");
                  setSort(key ? { key, dir: dir as "asc" | "desc" } : null);
                }}
                className="min-h-[44px] min-w-0 flex-1 rounded-md border border-line bg-white px-2 text-base text-ink"
              >
                <option value="">Como vienen</option>
                {ordenables.map((c) => (
                  <optgroup key={c.key} label={typeof c.header === "string" ? c.header : c.key}>
                    <option value={`${c.key}:asc`}>{typeof c.header === "string" ? c.header : c.key} ↑</option>
                    <option value={`${c.key}:desc`}>{typeof c.header === "string" ? c.header : c.key} ↓</option>
                  </optgroup>
                ))}
              </select>
            </div>
          )}
          {ordenadas.length === 0 ? (
            <EmptyState title={empty?.title ?? "Nada por acá."} hint={empty?.hint} action={empty?.action} />
          ) : (
            <ul>
              {ordenadas.map((row) => (
                <li
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onRowClick(row)) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                  className={cn(
                    "border-b border-line px-4 py-3 last:border-0",
                    onRowClick && "cursor-pointer active:bg-neutro-50 focus:outline-none focus-visible:bg-neutro-50",
                    rowClassName?.(row),
                  )}
                >
                  {colTitulo && <div className="min-w-0 text-[15px] font-medium text-ink">{colTitulo.render(row)}</div>}
                  {colDatos.length > 0 && (
                    <dl className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-caption">
                      {colDatos.map((c) => (
                        <div key={c.key} className="contents">
                          <dt className="text-subtle">{c.etiquetaTarjeta ?? c.header}</dt>
                          <dd className={cn("min-w-0 break-words text-ink", c.align === "right" && "tnum")}>{c.render(row)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <table className={cn("w-full text-caption", tarjetas && "hidden sm:table")}>
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => {
              const activa = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  aria-sort={activa ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn(
                    // Fija solo desde lg: abajo la tabla scrollea dentro de su tarjeta y una
                    // cabecera «sticky» con top-14 tapaba la primera fila.
                    "lg:sticky z-[5] bg-surface/95 backdrop-blur-sm",
                    stickyTopClassName,
                    "text-[11px] font-semibold uppercase tracking-wide text-subtle",
                    "border-b border-line",
                    pad,
                    alignCls(c.align),
                    c.hideBelow && HIDE[c.hideBelow],
                  )}
                >
                  {c.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c)}
                      className={cn("inline-flex items-center gap-1 hover:text-ink", activa && "text-ink")}
                    >
                      {c.header}
                      <span aria-hidden className={cn("text-[9px]", !activa && "opacity-30")}>
                        {activa && sort!.dir === "desc" ? "▼" : "▲"}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ordenadas.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState title={empty?.title ?? "Nada por acá."} hint={empty?.hint} action={empty?.action} />
              </td>
            </tr>
          )}
          {ordenadas.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={(e) => onKey(e, row)}
              tabIndex={onRowClick ? 0 : undefined}
              className={cn(
                "border-b border-line last:border-0",
                onRowClick &&
                  "cursor-pointer hover:bg-neutro-50 focus:outline-none focus-visible:bg-neutro-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rojo-300",
                rowClassName?.(row),
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn(pad, alignCls(c.align), c.hideBelow && HIDE[c.hideBelow], c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
