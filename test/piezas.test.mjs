// Pruebas de las piezas compartidas de la 0.4.0 (sobre de mensajes, Mejoras, guías, reporte
// de errores y destino seguro del SSO) sobre el dist/ compilado. Sin navegador: lógica pura
// y el HTML que dibujan con react-dom/server. `npm test` compila antes.
import assert from "node:assert/strict";
import { test } from "node:test";

import React from "react";
import ReactDOMServer from "react-dom/server";

import {
  GuiaBoton,
  GuiaPanel,
  MessagesBell,
  SUGERENCIA_MAX_BYTES,
  SugerenciaBoton,
  SugerenciaModal,
  conNegritas,
  crearReporteErrores,
  destinoSeguro,
  guiasPorRuta,
  iniciarSondeo,
  instalarReporteErrores,
  normalizarRuta,
  partirNegritas,
  rutaEmpieza,
  rutaInterna,
  rutasMensajes,
  safeHref,
  textoContador,
  validarSugerencia,
} from "../dist/index.js";

const h = React.createElement;
const html = (el) => ReactDOMServer.renderToStaticMarkup(el);
const ORIGEN = "https://operaciones.enersol-sa.com";

// ── destinoSeguro / rutaInterna / safeHref ─────────────────────────────────────

test("destinoSeguro: rutas del mismo sitio pasan tal cual (con consulta y fragmento)", () => {
  assert.equal(destinoSeguro("/obras/3?tab=cobros#x", [], { origen: ORIGEN }), "/obras/3?tab=cobros#x");
  assert.equal(destinoSeguro("/", [], { origen: ORIGEN }), "/");
  assert.equal(destinoSeguro("  /obras  ", [], { origen: ORIGEN }), "/obras");
});

test("destinoSeguro: todo lo que lleva a otro dominio cae en «/»", () => {
  const malos = [
    null,
    undefined,
    "",
    "//evil.com",
    "/\\evil.com",
    "/\tevil.com",
    "/\nevil.com",
    "\\\\evil.com",
    "https://evil.com",
    "javascript:alert(1)",
    "data:text/html,<b>x</b>",
    "obras/3",
    "https://operaciones.enersol-sa.com.evil.com/",
    "/" + "a".repeat(3000),
  ];
  for (const m of malos) assert.equal(destinoSeguro(m, [], { origen: ORIGEN }), "/", String(m));
});

test("destinoSeguro: URL completa solo si su origen está permitido, sin usuario ni clave", () => {
  const permitidos = ["https://operaciones.enersol-sa.com/", "https://app.enersol-sa.com"];
  assert.equal(
    destinoSeguro("https://operaciones.enersol-sa.com/obras/3", permitidos, { origen: "https://app.enersol-sa.com" }),
    "https://operaciones.enersol-sa.com/obras/3",
  );
  assert.equal(destinoSeguro("https://marketing.enersol-sa.com/", permitidos), "/");
  assert.equal(destinoSeguro("http://operaciones.enersol-sa.com/", permitidos), "/");
  assert.equal(destinoSeguro("https://user:pw@operaciones.enersol-sa.com/", permitidos), "/");
  assert.equal(destinoSeguro("https://operaciones.enersol-sa.com:8443/", permitidos), "/");
});

test("destinoSeguro: porDefecto propio", () => {
  assert.equal(destinoSeguro("//evil.com", [], { origen: ORIGEN, porDefecto: "/inicio" }), "/inicio");
  assert.equal(destinoSeguro(null, [], { porDefecto: "/inicio" }), "/inicio");
});

test("rutaInterna y safeHref: mismas reglas que el Hub", () => {
  assert.equal(rutaInterna("/obras/1", ORIGEN), "/obras/1");
  assert.equal(rutaInterna("//x.com", ORIGEN), "");
  assert.equal(rutaInterna("https://operaciones.enersol-sa.com/obras/1", ORIGEN), "");
  assert.equal(safeHref("/obras/1", { origen: ORIGEN }), "/obras/1");
  assert.equal(safeHref("https://operaciones.enersol-sa.com/obras/1"), "https://operaciones.enersol-sa.com/obras/1");
  assert.equal(safeHref("https://enersol-sa.com/"), "https://enersol-sa.com/");
  for (const malo of ["javascript:alert(1)", "http://enersol-sa.com/", "https://enersol-sa.com.evil.com/", "https://evilenersol-sa.com/", "/\\x.com", null]) {
    assert.equal(safeHref(malo, { origen: ORIGEN }), undefined, String(malo));
  }
});

// ── Guías ──────────────────────────────────────────────────────────────────────

const GUIAS = [
  { id: "inicio", icono: "🏠", titulo: "Inicio", intro: "La **puerta** de entrada.", pasos: ["Tocá **Abrir módulo →**.", "Listo."], notas: ["Ojo **acá**."], match: (p) => p === "/" },
  { id: "obras", titulo: "Obras", pasos: ["Lista"], match: rutaEmpieza("/obras") },
  { id: "cobros", titulo: "Cobros de la obra", render: () => h("div", { "data-guia": "cobros" }, "JSX propio"), match: (p) => /^\/obras\/\d+$/.test(p) },
  { id: "rota", titulo: "Rota", pasos: [], match: () => { throw new Error("x"); } },
  { id: "admin", titulo: "Solo super-admin", pasos: ["x"], match: (p) => p === "/admin" },
];

test("normalizarRuta y guiasPorRuta: barra final, consulta y varias por ruta", () => {
  assert.equal(normalizarRuta("/obras/3/"), "/obras/3");
  assert.equal(normalizarRuta("///"), "/");
  assert.equal(normalizarRuta("/obras?x=1"), "/obras");
  assert.deepEqual(guiasPorRuta(GUIAS, "/").map((g) => g.id), ["inicio"]);
  assert.deepEqual(guiasPorRuta(GUIAS, "/obras/").map((g) => g.id), ["obras"]);
  assert.deepEqual(guiasPorRuta(GUIAS, "/obras/12").map((g) => g.id), ["obras", "cobros"]);
  assert.deepEqual(guiasPorRuta(GUIAS, "/obrasx").map((g) => g.id), []);
  // Un match que tira error no rompe: se trata como «no corresponde».
  assert.deepEqual(guiasPorRuta(GUIAS, "/nada").map((g) => g.id), []);
});

test("partirNegritas y conNegritas", () => {
  assert.deepEqual(partirNegritas("Tocá **Enviar** y **listo**."), [
    { texto: "Tocá ", negrita: false },
    { texto: "Enviar", negrita: true },
    { texto: " y ", negrita: false },
    { texto: "listo", negrita: true },
    { texto: ".", negrita: false },
  ]);
  assert.deepEqual(partirNegritas("sin cerrar **ojo"), [{ texto: "sin cerrar **ojo", negrita: false }]);
  assert.deepEqual(partirNegritas("**todo**"), [{ texto: "todo", negrita: true }]);
  assert.equal(html(h("p", null, conNegritas("a **b** c"))), "<p><span>a </span><b>b</b><span> c</span></p>");
});

test("GuiaPanel: guía de datos con pasos numerados, negritas, notas y lista de otras pantallas", () => {
  const s = html(h(GuiaPanel, { open: true, onClose: () => {}, guias: GUIAS, path: "/" }));
  assert.match(s, /role="dialog" aria-modal="true"/);
  assert.match(s, /Guía de esta pantalla/);
  assert.match(s, /<h2[^>]*>Inicio<\/h2>/);
  assert.match(s, /<b>puerta<\/b>/);
  assert.match(s, /<b>Abrir módulo →<\/b>/);
  assert.match(s, />2<\/span>/);
  assert.match(s, /aria-label="Ver la guía de otra pantalla"/);
  assert.match(s, /env\(safe-area-inset-top/);
  // Sin azul en ningún lado.
  assert.doesNotMatch(s, /blue|sky-|indigo/);
});

test("GuiaPanel: varias guías en la ruta → pestañas; la de render() dibuja su JSX", () => {
  const s = html(h(GuiaPanel, { open: true, onClose: () => {}, guias: GUIAS, path: "/obras/12", guiaId: null }));
  assert.match(s, /role="tablist"/);
  assert.match(s, /role="tab" aria-selected="true"[^>]*>Obras</);
  assert.match(s, /role="tab" aria-selected="false"[^>]*>Cobros de la obra</);
  const todas = html(h(GuiaPanel, { open: true, onClose: () => {}, guias: GUIAS, path: "/obras/12", multiples: "todas" }));
  assert.doesNotMatch(todas, /role="tablist"/);
  assert.match(todas, /<div data-guia="cobros">JSX propio<\/div>/);
  assert.match(todas, /<h2[^>]*>Obras<\/h2>/);
});

test("GuiaPanel: sin guía para la ruta usa porDefecto; filtrar esconde guías de la lista", () => {
  const s = html(
    h(GuiaPanel, { open: true, onClose: () => {}, guias: GUIAS, path: "/nada", porDefecto: "obras", filtrar: (g) => g.id !== "admin" }),
  );
  assert.match(s, /<h2[^>]*>Obras<\/h2>/);
  assert.doesNotMatch(s, /Solo super-admin/);
  // Con guías render-only no hay selector (como Operaciones y Cuotas).
  const soloRender = html(h(GuiaPanel, { open: true, onClose: () => {}, guias: [GUIAS[2]], path: "/obras/1" }));
  assert.doesNotMatch(soloRender, /<select/);
  assert.equal(html(h(GuiaPanel, { open: false, onClose: () => {}, guias: GUIAS, path: "/" })), "");
});

test("GuiaBoton: ícono ❓, fila del menú ☰ y oculto donde se pide", () => {
  assert.match(html(h(GuiaBoton, { guias: GUIAS, path: "/" })), /aria-label="Guía de uso de esta pantalla"/);
  const menu = html(h(GuiaBoton, { guias: GUIAS, path: "/", variante: "menu" }));
  assert.match(menu, /min-h-\[48px\]/);
  assert.match(menu, /Guía de esta pantalla/);
  assert.doesNotMatch(menu, /data-cierra/);
  assert.equal(html(h(GuiaBoton, { guias: GUIAS, path: "/guia", ocultarEn: (p) => p.startsWith("/guia") })), "");
  // Controlado desde afuera, sin botón (Proyectos abre la guía desde el menú ☰).
  const controlado = html(h(GuiaBoton, { guias: GUIAS, path: "/", open: true, sinBoton: true }));
  assert.doesNotMatch(controlado, /aria-label="Guía de uso de esta pantalla"/);
  assert.match(controlado, /role="dialog"/);
});

// ── Mejoras ────────────────────────────────────────────────────────────────────

test("validarSugerencia: mínimo 5 letras, tope de 4 MB y solo PNG/JPG/WEBP", () => {
  assert.equal(SUGERENCIA_MAX_BYTES, 4 * 1024 * 1024);
  assert.match(validarSugerencia({ descripcion: "  hol  " }), /mínimo 5 caracteres/);
  assert.equal(validarSugerencia({ descripcion: "Anda lento" }), null);
  assert.equal(validarSugerencia({ descripcion: "Anda lento", captura: { size: SUGERENCIA_MAX_BYTES, type: "image/png" } }), null);
  assert.equal(
    validarSugerencia({ descripcion: "Anda lento", captura: { size: SUGERENCIA_MAX_BYTES + 1, type: "image/png" } }),
    "La captura pesa más de 4 MB.",
  );
  assert.match(validarSugerencia({ descripcion: "Anda lento", captura: { size: 10, type: "application/pdf" } }), /PNG, JPG o WEBP/);
  assert.equal(validarSugerencia({ descripcion: "Anda lento", captura: { size: 2 * 1024 * 1024 + 1 } }, 2 * 1024 * 1024), "La captura pesa más de 2 MB.");
});

test("SugerenciaBoton: botón del encabezado y fila del menú ☰", () => {
  const boton = html(h(SugerenciaBoton, { onEnviar: async () => {} }));
  assert.match(boton, /title="Mandar una mejora o reportar un error"/);
  assert.match(boton, /Mejoras<\/button>/);
  const menu = html(h(SugerenciaBoton, { onEnviar: async () => {}, variante: "menu" }));
  assert.match(menu, /min-h-\[48px\]/);
  assert.match(menu, /Mejoras y errores/);
});

test("SugerenciaModal: tipo, texto, captura (solo imágenes) y botones; error en rojo, sin azul", () => {
  const s = html(h(SugerenciaModal, { onClose: () => {}, onEnviar: async () => {} }));
  assert.match(s, /Mejoras y errores/);
  assert.match(s, /aria-pressed="true"[^>]*>💡 Mejora/);
  assert.match(s, /🐞 Error/);
  assert.match(s, /accept="image\/png,image\/jpeg,image\/webp"/);
  assert.match(s, /Cancelar/);
  assert.match(s, />Enviar</);
  assert.doesNotMatch(s, /blue|sky-|indigo/);
  assert.equal(html(h(SugerenciaModal, { open: false, onClose: () => {}, onEnviar: async () => {} })), "");
});

// ── Sondeo (polling) ───────────────────────────────────────────────────────────

function relojFalso() {
  let fn = null;
  let ms = null;
  let cancelado = false;
  return {
    setInterval: (f, t) => {
      fn = f;
      ms = t;
      return 7;
    },
    clearInterval: (id) => {
      assert.equal(id, 7);
      cancelado = true;
    },
    tic: () => fn?.(),
    get ms() {
      return ms;
    },
    get cancelado() {
      return cancelado;
    },
  };
}

test("iniciarSondeo: llama al arrancar y en cada vuelta; detener corta el reloj", () => {
  const reloj = relojFalso();
  let n = 0;
  const detener = iniciarSondeo(() => n++, { ...reloj, ms: 30_000, visible: () => true });
  assert.equal(n, 1);
  assert.equal(reloj.ms, 30_000);
  reloj.tic();
  reloj.tic();
  assert.equal(n, 3);
  detener();
  assert.equal(reloj.cancelado, true);
  reloj.tic();
  assert.equal(n, 3);
});

test("iniciarSondeo: nunca dos consultas en vuelo; con la pestaña oculta no consulta", async () => {
  const reloj = relojFalso();
  let n = 0;
  let resolver;
  let visible = true;
  iniciarSondeo(
    () => {
      n++;
      return new Promise((r) => (resolver = r));
    },
    { ...reloj, ms: 5_000, visible: () => visible },
  );
  assert.equal(n, 1);
  reloj.tic(); // la primera sigue en vuelo: se salta
  assert.equal(n, 1);
  resolver();
  await new Promise((r) => setImmediate(r));
  reloj.tic();
  assert.equal(n, 2);
  resolver();
  await new Promise((r) => setImmediate(r));
  visible = false;
  reloj.tic();
  assert.equal(n, 2);
});

test("iniciarSondeo: errores tragados, sin inmediato y mínimo de 1 s", async () => {
  const reloj = relojFalso();
  let n = 0;
  iniciarSondeo(
    () => {
      n++;
      return Promise.reject(new Error("Hub caído"));
    },
    { ...reloj, ms: 10, inmediato: false, visible: () => true },
  );
  assert.equal(n, 0);
  assert.equal(reloj.ms, 1000);
  reloj.tic();
  await new Promise((r) => setImmediate(r));
  reloj.tic();
  assert.equal(n, 2);
});

// ── Sobre de mensajes ──────────────────────────────────────────────────────────

test("rutasMensajes y textoContador", () => {
  const r = rutasMensajes("/msg/");
  assert.equal(r.unread, "/msg/unread");
  assert.equal(r.thread("ana+x@enersol.com"), "/msg/thread?con_email=ana%2Bx%40enersol.com");
  assert.equal(rutasMensajes("/api/mensajes").leerThread, "/api/mensajes/leer-thread");
  assert.equal(textoContador(0), "");
  assert.equal(textoContador(7), "7");
  assert.equal(textoContador(100), "99+");
  assert.equal(textoContador(Number.NaN), "");
});

const apiFalsa = { get: async () => ({ total: 0 }), post: async () => ({}) };

test("MessagesBell: sobre del encabezado y fila del menú ☰", () => {
  const sobre = html(h(MessagesBell, { api: apiFalsa, selfEmail: "a@b.c" }));
  assert.match(sobre, /aria-label="Mensajes"/);
  assert.match(sobre, /aria-expanded="false"/);
  assert.doesNotMatch(sobre, /role="dialog"/);
  const menu = html(h(MessagesBell, { api: apiFalsa, selfEmail: "a@b.c", enMenu: true }));
  assert.match(menu, /min-h-\[48px\]/);
  assert.match(menu, /<span class="flex-1">Mensajes<\/span>/);
});

// ── Reporte de errores ─────────────────────────────────────────────────────────

test("crearReporteErrores: una vez por error y ruta, recorta y manda la app", () => {
  const enviados = [];
  let ruta = "/obras/3";
  const { reportar } = crearReporteErrores({ app: "operaciones", enviar: (e, c) => enviados.push([e, c]), ruta: () => ruta });
  const err = new TypeError("x is undefined");
  reportar(err);
  reportar(err);
  assert.equal(enviados.length, 1);
  const [e, c] = enviados[0];
  assert.equal(e.mensaje, "TypeError: x is undefined");
  assert.equal(e.ruta, "/obras/3");
  assert.ok(e.pila.length > 0);
  assert.deepEqual(c, { app: "operaciones" });
  ruta = "/obras/4";
  reportar(err);
  reportar("texto suelto");
  reportar({ raro: 1 });
  assert.equal(enviados.length, 4);
  assert.equal(enviados[3][0].mensaje, 'Error: {"raro":1}');
  reportar(new Error("y".repeat(5000)));
  assert.equal(enviados[4][0].mensaje.length, 1900);
});

test("crearReporteErrores: sin sesión, rutas públicas, cortes de red y tope por sesión", () => {
  const enviados = [];
  let sesion = false;
  let ruta = "/obras";
  const { reportar } = crearReporteErrores({
    app: "proyectos",
    enviar: (e) => enviados.push(e),
    activo: () => sesion,
    rutasPublicas: ["/login", "/p/"],
    ruta: () => ruta,
    maximo: 3,
  });
  reportar(new Error("a"));
  assert.equal(enviados.length, 0);
  sesion = true;
  for (const r of ["/login", "/login/otp", "/p/abc", "/p"]) {
    ruta = r;
    reportar(new Error("b"));
  }
  assert.equal(enviados.length, 0);
  ruta = "/loginx";
  reportar(new TypeError("Failed to fetch"));
  assert.equal(enviados.length, 0);
  for (const m of ["1", "2", "3", "4"]) reportar(new Error(m));
  assert.equal(enviados.length, 3);
});

test("crearReporteErrores: si enviar falla (o rechaza) la pantalla no se entera", async () => {
  const { reportar } = crearReporteErrores({ app: "hub", enviar: () => { throw new Error("sin red"); }, ruta: () => "/" });
  assert.doesNotThrow(() => reportar(new Error("z")));
  const { reportar: r2 } = crearReporteErrores({ app: "hub", enviar: () => Promise.reject(new Error("500")), ruta: () => "/" });
  assert.doesNotThrow(() => r2(new Error("z")));
  await new Promise((r) => setImmediate(r));
});

test("instalarReporteErrores: uno por app (no duplica) y se puede desinstalar", () => {
  const a = instalarReporteErrores({ app: "cuotas", enviar: () => {} });
  const b = instalarReporteErrores({ app: "cuotas", enviar: () => {} });
  assert.equal(a, b);
  a.desinstalar();
  const c = instalarReporteErrores({ app: "cuotas", enviar: () => {} });
  assert.notEqual(a, c);
  c.desinstalar();
});
