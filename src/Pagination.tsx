import { cn } from "./cn";
import { Button } from "./primitives";

/** Página de un listado: qué filas se ven y qué botones de página dibujar. Función pura
 *  (sin React) para que cada módulo la pueda usar y probar igual que el componente. */
export type PaginationRange = {
  /** Página actual, desde 1. */
  page: number;
  /** Cantidad de páginas (al menos 1, aunque no haya filas). */
  pages: number;
  /** Número (desde 1) de la primera fila que se ve; 0 si no hay filas. */
  from: number;
  /** Número de la última fila que se ve. */
  to: number;
  /** Botones de página a dibujar: números y "…" donde se saltan páginas. */
  items: Array<number | "…">;
};

const entero = (v: number, minimo: number) => (Number.isFinite(v) ? Math.max(minimo, Math.floor(v)) : minimo);

export function paginationRange(total: number, pageSize: number, offset: number, siblings = 1): PaginationRange {
  const filas = entero(total, 0);
  const tam = entero(pageSize, 1);
  const pages = Math.max(1, Math.ceil(filas / tam));
  const page = Math.min(pages, Math.floor(entero(offset, 0) / tam) + 1);
  const from = filas === 0 ? 0 : (page - 1) * tam + 1;
  const to = Math.min(filas, page * tam);

  // Siempre la primera, la última y la actual con `siblings` vecinas a cada lado. Un hueco
  // de una sola página se muestra como número (no tiene sentido «…» en lugar de un botón).
  const visibles = new Set<number>([1, pages]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pages) visibles.add(p);
  const ordenadas = [...visibles].sort((a, b) => a - b);
  const items: Array<number | "…"> = [];
  ordenadas.forEach((p, i) => {
    const anterior = ordenadas[i - 1];
    if (anterior !== undefined && p - anterior === 2) items.push(anterior + 1);
    else if (anterior !== undefined && p - anterior > 2) items.push("…");
    items.push(p);
  });
  return { page, pages, from, to, items };
}

const miles = (n: number) => n.toLocaleString("es-BO");

/** Paginación de un listado con total: «Mostrando 51–100 de 251 ventas» y los botones
 *  Anterior / páginas / Siguiente. Trabaja con `offset` (desplazamiento) y `pageSize`
 *  (límite), igual que la API: `onChange` recibe el nuevo desplazamiento.
 *
 *  En el celular (< 640 px) los números de página se reemplazan por «Página 2 de 6» para
 *  que nunca haya scroll lateral; los botones miden 44 px con puntero táctil. Con una sola
 *  página solo se muestra el total. */
export function Pagination({
  total,
  pageSize,
  offset,
  onChange,
  itemLabel = ["registro", "registros"],
  disabled = false,
  className,
}: {
  total: number;
  pageSize: number;
  offset: number;
  onChange: (offset: number) => void;
  /** Cómo se llaman las filas, en singular y plural: ["venta", "ventas"]. */
  itemLabel?: [string, string];
  /** Mientras carga la página nueva, para no pedir dos a la vez. */
  disabled?: boolean;
  className?: string;
}) {
  const r = paginationRange(total, pageSize, offset);
  const tam = entero(pageSize, 1);
  const nombre = entero(total, 0) === 1 ? itemLabel[0] : itemLabel[1];
  const ir = (pagina: number) => {
    if (disabled || pagina < 1 || pagina > r.pages || pagina === r.page) return;
    onChange((pagina - 1) * tam);
  };

  return (
    <nav
      aria-label="Paginación"
      className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-caption text-subtle", className)}
    >
      <p className="tnum" aria-live="polite">
        {r.pages === 1
          ? `${miles(entero(total, 0))} ${nombre}`
          : `Mostrando ${miles(r.from)}–${miles(r.to)} de ${miles(entero(total, 0))} ${nombre}`}
      </p>
      {r.pages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => ir(r.page - 1)}
            disabled={disabled || r.page === 1}
            aria-label="Página anterior"
          >
            Anterior
          </Button>
          <span className="tnum px-2 sm:hidden">
            Página {miles(r.page)} de {miles(r.pages)}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            {r.items.map((p, i) =>
              p === "…" ? (
                <span key={`hueco-${i}`} className="px-1" aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => ir(p)}
                  disabled={disabled}
                  aria-label={`Página ${p}`}
                  aria-current={p === r.page ? "page" : undefined}
                  className={cn(
                    "tnum h-8 min-w-[2rem] rounded-md px-2 text-caption font-medium transition-colors",
                    "[@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]",
                    "disabled:pointer-events-none disabled:opacity-50",
                    p === r.page ? "bg-neutro-100 text-brand" : "text-ink hover:bg-neutro-50",
                  )}
                >
                  {miles(p)}
                </button>
              ),
            )}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => ir(r.page + 1)}
            disabled={disabled || r.page === r.pages}
            aria-label="Página siguiente"
          >
            Siguiente
          </Button>
        </div>
      )}
    </nav>
  );
}
