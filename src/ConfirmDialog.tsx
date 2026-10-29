import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";
import { Button } from "./primitives";

/** Tono de la confirmación: "primary" para confirmar algo normal (registrar, aprobar) y
 *  "danger" para lo destructivo o irreversible (anular, revertir, borrar): solo ahí el botón
 *  va en rojo, y el foco arranca en «Cancelar». */
export type ConfirmTone = "primary" | "danger";

/** Motivo escrito obligatorio u opcional (anulaciones, reaperturas): queda en auditoría. */
export type ConfirmReason = {
  label: ReactNode;
  placeholder?: string;
  /** Si es obligatorio, «Confirmar» no se habilita hasta que tenga `minLength` letras. */
  required?: boolean;
  minLength?: number;
};

const ENFOCABLES = 'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const mensajeDe = (e: unknown) =>
  e instanceof Error && e.message ? e.message : typeof e === "string" && e ? e : "No se pudo completar. Probá de nuevo.";

/** Diálogo de confirmación del ecosistema: reemplaza a window.confirm / window.prompt.
 *  Dice qué va a pasar, pide el motivo si hace falta y, si `onConfirm` devuelve una
 *  promesa, muestra «Procesando…» y bloquea los botones hasta que termine (un doble clic
 *  no manda dos veces); si la promesa falla, el error se ve en el diálogo y sigue abierto.
 *  Escape o tocar afuera cancelan (salvo mientras procesa); el foco queda adentro (Tab da
 *  la vuelta) y al cerrar vuelve a donde estaba. En el celular es una hoja que sube desde
 *  abajo, como Modal. */
export function ConfirmDialog({
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
  onCancel,
}: {
  open: boolean;
  title: ReactNode;
  /** Qué va a pasar y qué no se puede deshacer. */
  children?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  tone?: ConfirmTone;
  reason?: ConfirmReason;
  /** Procesando desde afuera (además del estado propio cuando onConfirm es async). */
  busy?: boolean;
  /** Error que viene de afuera (además del que captura de onConfirm). */
  error?: ReactNode;
  onConfirm: (reason: string) => void | Promise<unknown>;
  onCancel: () => void;
}) {
  const [texto, setTexto] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);
  const tituloId = useId();
  const cuerpoId = useId();
  const cajaRef = useRef<HTMLDivElement>(null);
  const ocupado = busy || procesando;

  // Cada vez que se abre arranca limpio; al cerrarse, el foco vuelve a donde estaba.
  useEffect(() => {
    if (!open) return;
    setTexto("");
    setFallo(null);
    setProcesando(false);
    const previo = document.activeElement as HTMLElement | null;
    return () => previo?.focus?.();
  }, [open]);

  // Foco inicial (solo al abrir, aunque la pantalla se vuelva a dibujar): el motivo si hay;
  // si no, «Cancelar» en lo destructivo y «Confirmar» en lo normal.
  const focoInicial = reason ? "motivo" : tone === "danger" ? "cancelar" : "confirmar";
  const focoRef = useRef(focoInicial);
  focoRef.current = focoInicial;
  useEffect(() => {
    if (!open) return;
    cajaRef.current?.querySelector<HTMLElement>(`[data-foco="${focoRef.current}"]`)?.focus();
  }, [open]);

  const cancelar = useCallback(() => {
    if (!ocupado) onCancel();
  }, [ocupado, onCancel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancelar();
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
      if (resultado && typeof (resultado as Promise<unknown>).then === "function") {
        setProcesando(true);
        await resultado;
      }
    } catch (e) {
      setFallo(mensajeDe(e));
    } finally {
      setProcesando(false);
    }
  }

  // Tab y Shift+Tab dan la vuelta dentro del diálogo (no se escapa a la página de atrás).
  function atraparFoco(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !cajaRef.current) return;
    const enfocables = [...cajaRef.current.querySelectorAll<HTMLElement>(ENFOCABLES)];
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
      onClick={cancelar}
    >
      <div
        ref={cajaRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={children ? cuerpoId : undefined}
        aria-busy={ocupado || undefined}
        className={cn(
          "w-full max-w-md overflow-auto bg-surface shadow-card",
          "max-h-[92vh] rounded-t-card sm:max-h-[90vh] sm:rounded-card",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={atraparFoco}
      >
        <div className="border-b border-line px-5 py-4">
          <h3 id={tituloId} className="text-h4 text-ink">
            {title}
          </h3>
        </div>
        <div className="space-y-4 px-5 py-4">
          {children && (
            <div id={cuerpoId} className="text-[14px] leading-relaxed text-ink">
              {children}
            </div>
          )}
          {reason && (
            <label className="block">
              <span className="mb-1 block text-caption font-medium text-ink">
                {reason.label}
                {reason.required && <span className="font-normal text-subtle"> (obligatorio)</span>}
              </span>
              <textarea
                data-foco="motivo"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) confirmar();
                }}
                rows={3}
                placeholder={reason.placeholder}
                disabled={ocupado}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-body text-ink placeholder:text-neutro-300 focus:border-brand-ring focus:outline-none focus:ring-2 focus:ring-brand-ring"
              />
            </label>
          )}
          {errorVisible && (
            <p role="alert" className="rounded-md border border-line bg-neutro-50 px-3 py-2 text-caption font-medium text-rojo-700">
              {errorVisible}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button data-foco="cancelar" variant="secondary" onClick={cancelar} disabled={ocupado}>
              {cancelLabel}
            </Button>
            <Button
              data-foco="confirmar"
              variant={tone === "danger" ? "danger" : "primary"}
              onClick={confirmar}
              disabled={ocupado || !motivoListo}
            >
              {ocupado ? "Procesando…" : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type ConfirmOptions = {
  title: ReactNode;
  message?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  tone?: ConfirmTone;
  reason?: ConfirmReason;
};

/** Resultado de `confirm(...)`: si confirmó y el motivo escrito (vacío si no se pidió). */
export type ConfirmResult = { confirmed: boolean; reason: string };

/** Confirmación como promesa, para reemplazar `window.confirm` / `window.prompt` sin armar
 *  estado en cada pantalla:
 *
 *    const [confirm, dialog] = useConfirm();
 *    const r = await confirm({ title: "¿Anular la venta?", tone: "danger", reason: { label: "Motivo", required: true } });
 *    if (r.confirmed) await api.post(..., { motivo: r.reason });
 *    …
 *    return <>{dialog}…</>;
 *
 *  La acción corre DESPUÉS de cerrar el diálogo: sus errores los muestra la pantalla. */
export function useConfirm(): [(options: ConfirmOptions) => Promise<ConfirmResult>, ReactNode] {
  const [pedido, setPedido] = useState<(ConfirmOptions & { resolver: (r: ConfirmResult) => void }) | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<ConfirmResult>((resolver) => {
        setPedido({ ...options, resolver });
      }),
    [],
  );

  const cerrar = (r: ConfirmResult) => {
    pedido?.resolver(r);
    setPedido(null);
  };

  const dialog = (
    <ConfirmDialog
      open={pedido !== null}
      title={pedido?.title ?? ""}
      confirmLabel={pedido?.confirmLabel}
      cancelLabel={pedido?.cancelLabel}
      tone={pedido?.tone}
      reason={pedido?.reason}
      onConfirm={(reason) => cerrar({ confirmed: true, reason })}
      onCancel={() => cerrar({ confirmed: false, reason: "" })}
    >
      {pedido?.message}
    </ConfirmDialog>
  );

  return [confirm, dialog];
}
