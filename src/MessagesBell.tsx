import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "./cn";
import { safeHref } from "./enlaces";
import { mobileMenuItemClass } from "./MobileMenu";
import { iniciarSondeo, useSondeo } from "./sondeo";

// Sobre de MENSAJERÍA global del ecosistema. Los mensajes viven en el Hub: el Hub llama a
// `/msg/*` directo y cada módulo a `/mensajes/*` (o `/api/mensajes/*`) por su proxy. El
// paquete no conoce la API: el módulo pasa su cliente (`api.get` / `api.post`, que ya llevan
// la sesión) y el prefijo de las rutas.
//
// Badge con el contador de no leídos (rebota cuando hay algo), refresco cada 30 s (se pausa
// con la pestaña oculta). Panel con dos pestañas: Mensajes (chat 1 a 1) y Menciones (@ en
// notas, con link al contexto). En el celular el panel ocupa toda la pantalla, con título,
// «Cerrar» y safe-area; en escritorio es el desplegable de 380 px bajo el sobre.

/** Cliente de API del módulo. `get`/`post` reciben la ruta YA con el prefijo
 *  (`${prefijo}/unread`) y devuelven el JSON; si falla, rechazan la promesa. */
export type MensajesApi = {
  get: <T = unknown>(path: string) => Promise<T>;
  post: <T = unknown>(path: string, body: unknown) => Promise<T>;
};

export type MensajesHilo = {
  con_email: string;
  con_nombre: string;
  ultimo_cuerpo: string;
  ultimo_at: string;
  no_leidos: number;
};

export type MensajesMensaje = {
  id: number;
  de_email: string;
  de_nombre: string;
  para_email: string;
  tipo: string;
  cuerpo: string;
  context_url: string | null;
  context_label: string | null;
  leido: boolean;
  created_at: string;
};

export type MensajesPersona = { email: string; nombre: string };

/** Evento de ventana que abre el panel desde cualquier lado (p. ej. la fila «N mensajes sin
 *  leer» de Mi día): `window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_MENSAJES))`. */
export const EVENTO_ABRIR_MENSAJES = "enersol:abrir-mensajes";

/** Rutas que usa el sobre, a partir del prefijo («/msg», «/mensajes», «/api/mensajes»). */
export function rutasMensajes(prefijo: string) {
  const p = prefijo.replace(/\/+$/, "");
  return {
    unread: `${p}/unread`,
    threads: `${p}/threads`,
    thread: (conEmail: string) => `${p}/thread?con_email=${encodeURIComponent(conEmail)}`,
    menciones: `${p}/menciones`,
    leer: `${p}/leer`,
    leerThread: `${p}/leer-thread`,
    send: `${p}/send`,
    directorio: `${p}/directorio`,
  };
}

/** «99+» desde 100; vacío si no hay nada. */
export function textoContador(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return "";
  return total > 99 ? "99+" : String(Math.floor(total));
}

function fecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-BO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const POLL_MS = 30_000;

function IconoSobre({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
      <path d="m3.5 7 8.5 6 8.5-6" />
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

// Clases literales (Tailwind solo ve lo que está escrito entero).
const PANEL_DESDE = {
  // < sm: pantalla completa; desde sm, desplegable.
  sm: "fixed inset-0 z-[60] flex flex-col bg-surface sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:z-50 sm:mt-2 sm:block sm:w-[380px] sm:max-w-[92vw] sm:rounded-card sm:border sm:border-line sm:shadow-card",
  // < lg: pantalla completa (módulos cuyo encabezado pasa al menú ☰ recién en lg).
  lg: "fixed inset-0 z-[60] flex flex-col bg-surface lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:z-50 lg:mt-2 lg:block lg:w-[380px] lg:max-w-[92vw] lg:rounded-card lg:border lg:border-line lg:shadow-card",
  siempre: "fixed inset-0 z-[60] flex flex-col bg-surface",
} as const;
const SOLO_MOVIL = { sm: "sm:hidden", lg: "lg:hidden", siempre: "" } as const;
const LISTA_ALTO = { sm: "sm:max-h-[420px]", lg: "lg:max-h-[420px]", siempre: "" } as const;
const CHAT_ALTO = { sm: "sm:h-[420px] sm:flex-none", lg: "lg:h-[420px] lg:flex-none", siempre: "" } as const;

export type MessagesBellProps = {
  /** Cliente de API del módulo (con la sesión). */
  api: MensajesApi;
  /** Email del usuario (para saber qué burbujas son suyas). */
  selfEmail: string;
  /** Prefijo de las rutas: «/msg» en el Hub, «/mensajes» en los módulos (por defecto). */
  prefijo?: string;
  /** Cada cuánto se consulta el contador (ms). Por defecto 30 s. */
  pollMs?: number;
  /** Versión fila del menú ☰ («✉ Mensajes» + contador); el panel se abre a pantalla completa
   *  encima del menú. */
  enMenu?: boolean;
  /** Hasta qué ancho el panel ocupa toda la pantalla: «sm» (por defecto) o «lg». */
  pantallaCompletaHasta?: "sm" | "lg";
  /** Si el Hub no responde, el sobre se esconde solo (por defecto sí). */
  ocultarSiFalla?: boolean;
  /** Dominio aceptado en los links de las menciones (además de las rutas del mismo sitio). */
  dominioEnlaces?: string;
  className?: string;
};

export function MessagesBell({
  api: apiProp,
  selfEmail,
  prefijo = "/mensajes",
  pollMs = POLL_MS,
  enMenu = false,
  pantallaCompletaHasta = "sm",
  ocultarSiFalla = true,
  dominioEnlaces,
  className,
}: MessagesBellProps) {
  const rutas = useMemo(() => rutasMensajes(prefijo), [prefijo]);
  // El módulo puede pasar un objeto nuevo en cada render: se usa siempre el último sin
  // reiniciar los sondeos ni recargar el chat.
  const apiRef = useRef(apiProp);
  apiRef.current = apiProp;
  const api = useMemo<MensajesApi>(
    () => ({
      get: <T,>(path: string) => apiRef.current.get<T>(path),
      post: <T,>(path: string, body: unknown) => apiRef.current.post<T>(path, body),
    }),
    [],
  );
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"mensajes" | "menciones">("mensajes");
  const [threads, setThreads] = useState<MensajesHilo[] | null>(null);
  const [menciones, setMenciones] = useState<MensajesMensaje[] | null>(null);
  const [chatCon, setChatCon] = useState<MensajesPersona | null>(null);
  const [nuevoPara, setNuevoPara] = useState(false);
  const [disponible, setDisponible] = useState(true);
  const raizRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const modo = enMenu ? "siempre" : pantallaCompletaHasta;

  const poll = useCallback(async () => {
    try {
      const r = await api.get<{ total: number }>(rutas.unread);
      setTotal(Number(r?.total) || 0);
      setDisponible(true);
    } catch {
      if (ocultarSiFalla) setDisponible(false); // Hub caído: el sobre se esconde solo
    }
  }, [api, rutas.unread, ocultarSiFalla]);

  useSondeo(poll, pollMs);

  const cargarListas = useCallback(() => {
    api.get<MensajesHilo[]>(rutas.threads).then(setThreads).catch(() => {});
    api.get<MensajesMensaje[]>(rutas.menciones).then(setMenciones).catch(() => {});
  }, [api, rutas.threads, rutas.menciones]);

  const cerrar = useCallback(() => {
    setOpen(false);
    setNuevoPara(false);
    botonRef.current?.focus();
  }, []);

  // Cerrar al tocar afuera (desplegable) y con Escape.
  useEffect(() => {
    if (!open) return;
    const fuera = (e: MouseEvent) => {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) setOpen(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [open, cerrar]);

  // Abrir desde afuera (fila «N mensajes sin leer» de Mi día).
  useEffect(() => {
    if (enMenu) return; // lo abre el sobre del encabezado, no la fila del menú
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

  async function marcarMencionesLeidas(items: MensajesMensaje[]) {
    const ids = items.filter((m) => !m.leido).map((m) => m.id);
    if (ids.length === 0) return;
    await api.post(rutas.leer, { ids }).catch(() => {});
    setMenciones((ms) => ms?.map((m) => ({ ...m, leido: true })) ?? null);
    poll();
  }

  if (!disponible) return null;

  const contador = textoContador(total);
  const mencionesSinLeer = menciones?.filter((m) => !m.leido).length ?? 0;
  const etiqueta = contador ? `Mensajes (${contador} sin leer)` : "Mensajes";

  return (
    <div className={cn(!enMenu && "relative", className)} ref={raizRef}>
      {enMenu ? (
        <button ref={botonRef} type="button" onClick={alternar} aria-haspopup="dialog" aria-expanded={open} className={mobileMenuItemClass()}>
          <IconoSobre />
          <span className="flex-1">Mensajes</span>
          {contador && (
            <span className="grid h-6 min-w-[24px] place-items-center rounded-pill bg-brand px-1.5 text-[12px] font-bold text-brand-on" aria-label={`${contador} sin leer`}>
              {contador}
            </span>
          )}
        </button>
      ) : (
        <button
          ref={botonRef}
          type="button"
          onClick={alternar}
          aria-label={etiqueta}
          title={etiqueta}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="relative inline-flex items-center justify-center rounded-md p-2 text-subtle hover:bg-neutro-100 hover:text-ink [@media(pointer:coarse)]:p-3"
        >
          <IconoSobre />
          {contador && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] animate-bounce place-items-center rounded-pill bg-brand px-1 text-[10px] font-bold text-brand-on motion-reduce:animate-none"
            >
              {contador}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Mensajes"
          className={PANEL_DESDE[modo]}
          style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {/* Pantalla completa: título y «Cerrar» (el panel tapa todo). */}
          <div className={cn("flex items-center justify-between border-b border-line px-4 py-1", SOLO_MOVIL[modo])}>
            <span className="font-display text-[17px] font-semibold text-ink">Mensajes</span>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar mensajes"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 hover:text-ink"
            >
              <IconoCerrar />
            </button>
          </div>
          {chatCon ? (
            <ChatView
              api={api}
              rutas={rutas}
              pollMs={pollMs}
              con={chatCon}
              selfEmail={selfEmail}
              alto={CHAT_ALTO[modo]}
              onBack={() => {
                setChatCon(null);
                api.get<MensajesHilo[]>(rutas.threads).then(setThreads).catch(() => {});
                poll();
              }}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 px-3 pt-3">
                <div className="flex gap-1" role="tablist" aria-label="Mensajes y menciones">
                  {(["mensajes", "menciones"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={tab === t}
                      onClick={() => {
                        setTab(t);
                        if (t === "menciones" && menciones) marcarMencionesLeidas(menciones);
                      }}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-caption font-medium [@media(pointer:coarse)]:min-h-[44px]",
                        tab === t ? "bg-neutro-100 text-brand-fg" : "text-subtle hover:text-ink",
                      )}
                    >
                      {t === "mensajes" ? "Mensajes" : "Menciones"}
                      {t === "menciones" && mencionesSinLeer > 0 && (
                        <span className="ml-1 text-[11px] font-bold text-brand-text">{mencionesSinLeer}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setNuevoPara(true)}
                  className="rounded-md px-1 text-caption font-medium text-brand-fg hover:underline [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:px-2"
                >
                  + Nuevo
                </button>
              </div>

              <div className={cn("min-h-0 flex-1 overflow-y-auto p-2", LISTA_ALTO[modo])}>
                {nuevoPara && (
                  <NuevoMensaje
                    api={api}
                    ruta={rutas.directorio}
                    onElegir={(d) => {
                      setNuevoPara(false);
                      setChatCon(d);
                    }}
                    onCerrar={() => setNuevoPara(false)}
                  />
                )}
                {tab === "mensajes" ? (
                  !threads || threads.length === 0 ? (
                    <Vacio texto="Sin conversaciones. Tocá «+ Nuevo» para escribirle a alguien." />
                  ) : (
                    threads.map((t) => (
                      <button
                        key={t.con_email}
                        type="button"
                        onClick={() => setChatCon({ email: t.con_email, nombre: t.con_nombre })}
                        className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-neutro-50 [@media(pointer:coarse)]:py-3"
                      >
                        <Avatar nombre={t.con_nombre} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className={cn("truncate text-caption text-ink", t.no_leidos > 0 && "font-semibold")}>{t.con_nombre}</span>
                            <span className="shrink-0 text-[12px] text-subtle sm:text-[10px]">{fecha(t.ultimo_at)}</span>
                          </span>
                          <span className="block truncate text-[12px] text-subtle sm:text-[11px]">{t.ultimo_cuerpo}</span>
                        </span>
                        {t.no_leidos > 0 && (
                          <span className="mt-1 grid h-4 min-w-[16px] shrink-0 place-items-center rounded-pill bg-brand px-1 text-[10px] font-bold text-brand-on">
                            {t.no_leidos}
                          </span>
                        )}
                      </button>
                    ))
                  )
                ) : !menciones || menciones.length === 0 ? (
                  <Vacio texto="Sin menciones. Cuando te tagueen con @ en una nota, aparece acá." />
                ) : (
                  menciones.map((m) => {
                    const href = safeHref(m.context_url, { dominio: dominioEnlaces });
                    return (
                      <div key={m.id} className={cn("rounded-md px-2 py-2", !m.leido && "bg-neutro-50")}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-caption font-medium text-ink">{m.de_nombre}</span>
                          <span className="text-[12px] text-subtle sm:text-[10px]">{fecha(m.created_at)}</span>
                        </div>
                        <p className="mt-0.5 whitespace-pre-line text-[13px] text-ink sm:text-[11px]">{m.cuerpo}</p>
                        {href && (
                          <a
                            href={href}
                            className="text-[12px] font-medium text-brand-fg hover:underline sm:text-[11px] [@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:items-center"
                          >
                            Abrir {m.context_label ?? "el contexto"} →
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Vacio({ texto }: { texto: string }) {
  return <p className="px-2 py-6 text-center text-caption text-subtle">{texto}</p>;
}

function Avatar({ nombre }: { nombre: string }) {
  const ini = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-neutro-100 text-[11px] font-semibold text-subtle">
      {ini}
    </span>
  );
}

function NuevoMensaje({
  api,
  ruta,
  onElegir,
  onCerrar,
}: {
  api: MensajesApi;
  ruta: string;
  onElegir: (d: MensajesPersona) => void;
  onCerrar: () => void;
}) {
  const [dir, setDir] = useState<MensajesPersona[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    api.get<MensajesPersona[]>(ruta).then(setDir).catch(() => {});
  }, [api, ruta]);
  const busca = q.trim().toLowerCase();
  const filtrados = dir.filter((d) => d.nombre.toLowerCase().includes(busca) || d.email.toLowerCase().includes(busca));
  return (
    <div className="mb-2 rounded-md border border-line p-2">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="¿A quién le escribís?"
          aria-label="¿A quién le escribís?"
          className="min-w-0 flex-1 rounded-md border border-neutro-500 px-2 py-1.5 text-[16px] text-ink placeholder:text-neutro-700 focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-caption"
        />
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
        >
          <IconoCerrar />
        </button>
      </div>
      <div className="mt-1 max-h-60 overflow-y-auto sm:max-h-40">
        {filtrados.map((d) => (
          <button
            key={d.email}
            type="button"
            onClick={() => onElegir(d)}
            className="w-full rounded-md px-2 py-1.5 text-left text-caption text-ink hover:bg-neutro-50 [@media(pointer:coarse)]:py-3"
          >
            {d.nombre} <span className="text-[12px] text-subtle max-sm:break-all sm:text-[10px]">{d.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatView({
  api,
  rutas,
  pollMs,
  con,
  selfEmail,
  alto,
  onBack,
}: {
  api: MensajesApi;
  rutas: ReturnType<typeof rutasMensajes>;
  pollMs: number;
  con: MensajesPersona;
  selfEmail: string;
  alto: string;
  onBack: () => void;
}) {
  const [msgs, setMsgs] = useState<MensajesMensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { thread, leerThread, send } = rutas;

  const cargar = useCallback(async () => {
    const r = await api.get<MensajesMensaje[]>(thread(con.email));
    setMsgs(Array.isArray(r) ? r : []);
    await api.post(leerThread, { con_email: con.email }).catch(() => {});
  }, [api, thread, leerThread, con.email]);

  useEffect(() => iniciarSondeo(() => cargar().catch(() => {}), { ms: pollMs }), [cargar, pollMs]);

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
      setError("No se pudo enviar. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", alto)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a las conversaciones"
          className="-ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-caption font-medium text-brand-fg hover:bg-neutro-100 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
        >
          ←
        </button>
        <Avatar nombre={con.nombre} />
        <span className="truncate text-caption font-semibold text-ink">{con.nombre}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        {msgs.map((m) => {
          const mio = m.de_email === selfEmail;
          return (
            <div key={m.id} className={cn("flex", mio ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] whitespace-pre-line break-words rounded-card px-3 py-2 text-caption", mio ? "bg-brand text-brand-on" : "bg-neutro-100 text-ink")}>
                {m.cuerpo}
                <div className={cn("mt-0.5 text-[11px] sm:text-[9px]", mio ? "text-brand-on/70" : "text-subtle")}>{fecha(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      {error && (
        <p role="alert" className="px-3 pb-1 text-[12px] text-rojo-600">
          {error}
        </p>
      )}
      <div className="flex gap-2 border-t border-line p-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          placeholder="Escribí un mensaje…"
          aria-label="Escribí un mensaje"
          className="min-w-0 flex-1 rounded-md border border-neutro-500 px-3 py-2 text-[16px] text-ink placeholder:text-neutro-700 focus:outline-none focus:ring-2 focus:ring-brand-ring sm:text-caption"
        />
        <button
          type="button"
          onClick={enviar}
          disabled={enviando || !texto.trim()}
          className="rounded-md bg-brand px-4 text-caption font-medium text-brand-on hover:bg-brand-hover disabled:opacity-50 [@media(pointer:coarse)]:min-h-[44px]"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
