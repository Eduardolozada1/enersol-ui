// Pruebas del paquete compilado (dist/): funciones puras y el HTML que dibujan los
// componentes nuevos de la 0.3.0. Sin navegador ni dependencias extra: node --test con
// react-dom/server. Correr con `npm test` (compila antes).
import assert from "node:assert/strict";
import { test } from "node:test";

import React from "react";
import ReactDOMServer from "react-dom/server";

import {
  AppHeader,
  ConfirmDialog,
  Pagination,
  groupAppHeaderItems,
  isAppHeaderItemActive,
  paginationRange,
} from "../dist/index.js";

const h = React.createElement;
const html = (el) => ReactDOMServer.renderToStaticMarkup(el);

// ── paginationRange ────────────────────────────────────────────────────────────

test("paginationRange: 251 filas de a 50, segunda página", () => {
  const r = paginationRange(251, 50, 50);
  assert.equal(r.page, 2);
  assert.equal(r.pages, 6);
  assert.equal(r.from, 51);
  assert.equal(r.to, 100);
  assert.deepEqual(r.items, [1, 2, 3, "…", 6]);
});

test("paginationRange: última página incompleta y huecos de una sola página como número", () => {
  const r = paginationRange(251, 50, 250);
  assert.equal(r.page, 6);
  assert.equal(r.from, 251);
  assert.equal(r.to, 251);
  assert.deepEqual(r.items, [1, "…", 5, 6]);
  assert.deepEqual(paginationRange(250, 50, 100).items, [1, 2, 3, 4, 5]);
});

test("paginationRange: sin filas, desplazamiento fuera de rango y valores raros", () => {
  assert.deepEqual(paginationRange(0, 50, 0), { page: 1, pages: 1, from: 0, to: 0, items: [1] });
  const fuera = paginationRange(120, 50, 5000);
  assert.equal(fuera.page, 3);
  assert.equal(fuera.from, 101);
  assert.equal(fuera.to, 120);
  const raro = paginationRange(Number.NaN, 0, -10);
  assert.equal(raro.page, 1);
  assert.equal(raro.pages, 1);
});

// ── Pagination ─────────────────────────────────────────────────────────────────

test("Pagination: dice qué se ve y de cuántas, con miles en es-BO", () => {
  const salida = html(h(Pagination, { total: 1251, pageSize: 50, offset: 50, onChange: () => {}, itemLabel: ["venta", "ventas"] }));
  assert.match(salida, /Mostrando 51–100 de 1\.251 ventas/);
  assert.match(salida, /aria-current="page"[^>]*>2</);
  assert.match(salida, /Página 2 de 26/);
  assert.match(salida, /Anterior/);
  assert.match(salida, /Siguiente/);
});

test("Pagination: con una sola página solo el total, sin botones", () => {
  const salida = html(h(Pagination, { total: 1, pageSize: 50, offset: 0, onChange: () => {}, itemLabel: ["venta", "ventas"] }));
  assert.match(salida, />1 venta</);
  assert.doesNotMatch(salida, /Siguiente/);
});

test("Pagination: en la primera página «Anterior» está deshabilitado", () => {
  const salida = html(h(Pagination, { total: 200, pageSize: 50, offset: 0, onChange: () => {} }));
  assert.match(salida, /<button[^>]*disabled=""[^>]*aria-label="Página anterior"/);
});

// ── AppHeader ──────────────────────────────────────────────────────────────────

const SECCIONES = [
  { href: "/tablero", label: "Tablero", match: (p) => p === "/" },
  { href: "/ventas", label: "Ventas" },
  { href: "/mayor", label: "Mayor", group: "Contabilidad" },
  { href: "/cierre", label: "Cierre", group: "Contabilidad" },
  { href: "/admin", label: "Administración", group: "Administración" },
];

test("isAppHeaderItemActive: exacta, subruta, match propio y la raíz", () => {
  assert.equal(isAppHeaderItemActive({ href: "/ventas", label: "" }, "/ventas"), true);
  assert.equal(isAppHeaderItemActive({ href: "/ventas", label: "" }, "/ventas/12"), true);
  assert.equal(isAppHeaderItemActive({ href: "/ventas", label: "" }, "/ventasx"), false);
  assert.equal(isAppHeaderItemActive(SECCIONES[0], "/"), true);
  assert.equal(isAppHeaderItemActive({ href: "/", label: "" }, "/ventas"), false);
});

test("groupAppHeaderItems: barra y grupos en el orden en que vienen", () => {
  const { main, groups } = groupAppHeaderItems(SECCIONES);
  assert.deepEqual(main.map((i) => i.href), ["/tablero", "/ventas"]);
  assert.deepEqual(groups.map(([g, items]) => [g, items.map((i) => i.href)]), [
    ["Contabilidad", ["/mayor", "/cierre"]],
    ["Administración", ["/admin"]],
  ]);
});

const encabezado = (props = {}) =>
  html(
    h(AppHeader, {
      moduleKey: "contabilidad",
      moduleName: "Contabilidad",
      logo: h("img", { alt: "Enersol", src: "/logo.png" }),
      items: SECCIONES,
      currentPath: "/ventas/3",
      user: { name: "Ana Pérez", email: "ana@example.com" },
      onLogout: () => {},
      desktopFrom: "xl",
      ...props,
    }),
  );

test("AppHeader: barra de escritorio desde el corte pedido y menú ☰ por debajo", () => {
  const salida = encabezado();
  assert.match(salida, /<nav aria-label="Secciones del módulo" class="hidden[^"]*xl:flex/);
  assert.match(salida, /<div class="xl:hidden"><button[^>]*aria-label="Abrir menú"/);
  // Nada de scroll lateral en el encabezado.
  assert.doesNotMatch(salida, /overflow-x-auto/);
});

test("AppHeader: la sección actual en text-brand con aria-current; las agrupadas en «Más»", () => {
  const salida = encabezado();
  assert.match(salida, /<a href="\/ventas" aria-current="page" class="[^"]*text-brand/);
  assert.match(salida, /<a href="\/tablero" class="[^"]*text-subtle/);
  assert.match(salida, /aria-haspopup="menu"[^>]*>Más/);
  // Las agrupadas no van sueltas en la barra (se ven al abrir «Más» o el menú ☰).
  assert.doesNotMatch(salida, /href="\/mayor"/);
});

test("AppHeader: «Más» se marca como actual si la sección está adentro", () => {
  const salida = encabezado({ currentPath: "/mayor" });
  assert.match(salida, /aria-haspopup="menu" aria-expanded="false" class="[^"]*text-brand/);
});

test("AppHeader: el aviso va en ámbar (no es un error) y renderLink arma los links", () => {
  const salida = encabezado({
    notice: "Tu usuario aún no tiene permisos",
    renderLink: ({ href, children, ...p }) => h("a", { ...p, href: `#${href}`, "data-router": "si" }, children),
  });
  assert.match(salida, /<div role="status" class="[^"]*bg-ambar-100[^"]*text-ambar-700[^"]*">Tu usuario aún no tiene permisos/);
  assert.doesNotMatch(salida, /bg-rojo/);
  assert.match(salida, /href="#\/ventas" data-router="si"/);
});

// ── ConfirmDialog ──────────────────────────────────────────────────────────────

test("ConfirmDialog: cerrado no dibuja nada", () => {
  assert.equal(html(h(ConfirmDialog, { open: false, title: "x", onConfirm: () => {}, onCancel: () => {} })), "");
});

test("ConfirmDialog: abierto es un alertdialog con título, mensaje y botones", () => {
  const salida = html(
    h(ConfirmDialog, { open: true, title: "¿Registrar la compra?", confirmLabel: "Registrar", onConfirm: () => {}, onCancel: () => {} }, "Se generan los asientos."),
  );
  assert.match(salida, /role="alertdialog" aria-modal="true"/);
  assert.match(salida, /¿Registrar la compra\?/);
  assert.match(salida, /Se generan los asientos\./);
  assert.match(salida, /Cancelar/);
  // Confirmación normal: botón primario, nunca el rojo destructivo.
  assert.match(salida, /<button class="[^"]*bg-brand[^"]*" data-foco="confirmar">Registrar</);
  assert.doesNotMatch(salida, /bg-rojo-600/);
});

test("ConfirmDialog: lo destructivo va en rojo y el motivo obligatorio deshabilita confirmar", () => {
  const salida = html(
    h(ConfirmDialog, {
      open: true,
      title: "¿Anular la venta?",
      tone: "danger",
      confirmLabel: "Anular",
      reason: { label: "Motivo", required: true },
      onConfirm: () => {},
      onCancel: () => {},
    }),
  );
  assert.match(salida, /<button class="[^"]*bg-rojo-600[^"]*" data-foco="confirmar" disabled="">Anular</);
  assert.match(salida, /<button class="[^"]*bg-white[^"]*" data-foco="cancelar">Cancelar</);
  assert.match(salida, /Motivo<span[^>]*> \(obligatorio\)/);
  assert.match(salida, /<textarea data-foco="motivo"/);
});
