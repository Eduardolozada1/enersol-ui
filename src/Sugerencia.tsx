import { useEffect, useId, useState } from "react";
import { cn } from "./cn";
import { mobileMenuItemClass } from "./MobileMenu";
import { Button, Modal } from "./primitives";

// «💡 Mejoras»: el botón al lado del nombre del usuario en todos los módulos (pedido de Eduardo
// 2026-09-16). Manda tipo, descripción, la pantalla actual y una captura opcional. El paquete
// no conoce la API: el Hub la manda directo y cada módulo a su backend, que la reenvía al Hub.

export type SugerenciaTipo = "mejora" | "error";

/** Lo que espera `POST /sugerencias` (Hub y módulos). */
export type SugerenciaPayload = {
  tipo: SugerenciaTipo;
  descripcion: string;
  /** Pantalla desde donde se mandó (pathname + search). */
  url: string;
  /** data URL («data:image/png;base64,…») o null. */
  captura_b64: string | null;
  captura_nombre: string | null;
  captura_tipo: string | null;
};

/** Tope de la captura: 4 MB (el Hub rechaza lo que pase de ahí). */
export const SUGERENCIA_MAX_BYTES = 4 * 1024 * 1024;
/** Formatos de captura que acepta el Hub. */
export const SUGERENCIA_TIPOS_CAPTURA = ["image/png", "image/jpeg", "image/webp"] as const;
const MINIMO_DESCRIPCION = 5;

/** Valida antes de mandar. Devuelve el mensaje de error (en español) o null si está bien. */
export function validarSugerencia(
  datos: { descripcion: string; captura?: { size: number; type?: string } | null },
  maxBytes: number = SUGERENCIA_MAX_BYTES,
): string | null {
  if (datos.descripcion.trim().length < MINIMO_DESCRIPCION) {
    return `Contanos un poco más (mínimo ${MINIMO_DESCRIPCION} caracteres).`;
  }
  const c = datos.captura;
  if (c) {
    if (c.type && !(SUGERENCIA_TIPOS_CAPTURA as readonly string[]).includes(c.type)) {
      return "La captura tiene que ser una imagen PNG, JPG o WEBP.";
    }
    if (c.size > maxBytes) {
      const mb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
      return `La captura pesa más de ${String(mb).replace(".", ",")} MB.`;
    }
  }
  return null;
}

function leerComoBase64(f: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("No se pudo leer la imagen."));
    r.readAsDataURL(f);
  });
}

function pantallaActual(): string {
  return typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
}

const mensajeDe = (e: unknown) =>
  e instanceof Error && e.message ? e.message : typeof e === "string" && e ? e : "No se pudo enviar. Probá de nuevo.";

export type SugerenciaEnviar = (payload: SugerenciaPayload) => unknown;

/** Botón «💡 Mejoras» + su modal. `variante="boton"` va en el encabezado de escritorio;
 *  `variante="menu"` es la fila del menú ☰ del celular («💡 Mejoras y errores», 48 px). */
export function SugerenciaBoton({
  onEnviar,
  variante = "boton",
  className,
  textoGracias,
  maxBytes,
}: {
  /** Manda el payload a la API del módulo. Si la promesa falla, su `message` se muestra. */
  onEnviar: SugerenciaEnviar;
  variante?: "boton" | "menu";
  className?: string;
  textoGracias?: string;
  maxBytes?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Mandar una mejora o reportar un error"
        aria-haspopup="dialog"
        className={cn(
          variante === "menu"
            ? mobileMenuItemClass()
            : "inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-line px-2 py-1 text-[12px] font-medium text-subtle transition-colors hover:border-brand hover:text-brand-fg [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:px-3",
          className,
        )}
      >
        <span aria-hidden>💡</span> {variante === "menu" ? "Mejoras y errores" : "Mejoras"}
      </button>
      <SugerenciaModal
        open={open}
        onClose={() => setOpen(false)}
        onEnviar={onEnviar}
        textoGracias={textoGracias}
        maxBytes={maxBytes}
      />
    </>
  );
}

/** El formulario de «Mejoras y errores» suelto (para abrirlo desde otro lado, p. ej. una fila
 *  del menú ☰ que cierra el menú antes de abrirlo). */
export function SugerenciaModal({
  open = true,
  onClose,
  onEnviar,
  textoGracias = "¡Gracias! Quedó registrado y le llega al equipo por correo.",
  maxBytes = SUGERENCIA_MAX_BYTES,
  url,
}: {
  open?: boolean;
  onClose: () => void;
  onEnviar: SugerenciaEnviar;
  textoGracias?: string;
  maxBytes?: number;
  /** Pantalla que se informa (por defecto la actual: pathname + search). */
  url?: string;
}) {
  const [tipo, setTipo] = useState<SugerenciaTipo>("mejora");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const idTexto = useId();
  const idArchivo = useId();

  // Cada vez que se abre arranca limpio.
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
        captura_tipo: archivo?.type || null,
      });
      setListo(true);
    } catch (e) {
      setError(mensajeDe(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Mejoras y errores">
      {listo ? (
        <div className="space-y-4" role="status">
          <p className="text-[14px] text-ink">{textoGracias}</p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[12px] text-subtle">
            Contá qué mejorarías o qué no funcionó. Se manda con tu nombre y la pantalla en la que estás.
          </p>
          <div className="flex gap-2" role="group" aria-label="Tipo">
            {(["mejora", "error"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tipo === t}
                onClick={() => setTipo(t)}
                className={cn(
                  "rounded-pill border px-3 py-1.5 text-[13px] [@media(pointer:coarse)]:min-h-[44px]",
                  tipo === t ? "border-brand bg-brand text-brand-on" : "border-line bg-white text-ink hover:bg-neutro-50",
                )}
              >
                {t === "mejora" ? "💡 Mejora" : "🐞 Error"}
              </button>
            ))}
          </div>
          <div>
            <label htmlFor={idTexto} className="sr-only">
              {tipo === "error" ? "Qué pasó" : "Qué mejorarías"}
            </label>
            <textarea
              id={idTexto}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              placeholder={tipo === "error" ? "Qué hiciste, qué esperabas y qué pasó…" : "Qué te gustaría que haga o cambie…"}
              className="w-full rounded-md border border-line px-3 py-2 text-[16px] text-ink placeholder:text-neutro-300 focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-[14px]"
            />
          </div>
          <div>
            <label htmlFor={idArchivo} className="block text-[13px] text-ink">
              Captura de pantalla (opcional)
            </label>
            <input
              id={idArchivo}
              type="file"
              accept={SUGERENCIA_TIPOS_CAPTURA.join(",")}
              className="mt-1 block w-full text-[13px] text-subtle sm:text-[12px]"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-[12px] text-subtle sm:text-[11px]">PNG, JPG o WEBP, hasta {Math.round(maxBytes / (1024 * 1024))} MB.</p>
          </div>
          {error && (
            <p role="alert" className="text-[13px] text-rojo-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={enviar} disabled={busy}>
              {busy ? "Enviando…" : "Enviar"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
