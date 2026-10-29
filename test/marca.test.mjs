// Alias de marca (0.5.0): los componentes usan SOLO alias para la identidad, el preset base los
// define con los valores de antes (los módulos del ecosistema se ven idénticos) y el de
// Distribución los pisa con el amarillo solar + grafito. Correr con `npm test` (compila antes).
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";

import React from "react";
import ReactDOMServer from "react-dom/server";

import { AppHeader, Badge, Button } from "../dist/index.js";

const require = createRequire(import.meta.url);
const base = require("../tailwind-preset.cjs");
const distribucion = require("../tailwind-preset-distribucion.cjs");

const h = React.createElement;
const html = (el) => ReactDOMServer.renderToStaticMarkup(el);
const raiz = new URL("..", import.meta.url);
const leer = (archivo) => readFileSync(new URL(archivo, raiz), "utf8");

const colores = base.theme.extend.colors;
const coloresDistribucion = distribucion.theme.extend.colors;

// ── Preset base: los alias valen exactamente lo que valían las clases de antes ──────────────

test("preset base: cada alias nuevo reproduce la clase que reemplaza", () => {
  const { brand, rojo } = colores;
  assert.equal(brand.DEFAULT, "#D62828");
  assert.equal(brand.on, "#FFFFFF"); // text-white
  assert.equal(brand.hover, brand.fg); // hover:bg-brand-fg
  assert.equal(brand.text, brand.DEFAULT); // text-brand
  assert.equal(brand.ring, rojo[300]); // ring-rojo-300 / border-rojo-300
  assert.equal(brand.soft, rojo[50]);
  assert.equal(brand.badge, rojo[700]); // text-rojo-700 del Badge «marca»
  assert.equal(brand.fg, "#AB2020");
  assert.equal(brand.strong, "#801818");
  assert.equal(colores.ink, "#494C4A");
});

/** Colores de un @theme (Tailwind v4): { "brand-on": "#FFFFFF", … }. */
function variablesDeColor(css) {
  const salida = {};
  for (const [, nombre, valor] of css.matchAll(/--color-([\w-]+):\s*(#[0-9A-Fa-f]{3,8})\s*;/g)) {
    salida[nombre] = valor.toUpperCase();
  }
  return salida;
}

/** Colores de un preset (Tailwind v3) con los nombres de las clases: { "brand-on": "#FFFFFF", … }. */
function coloresPlanos(objeto) {
  const salida = {};
  for (const [nombre, valor] of Object.entries(objeto)) {
    if (typeof valor === "string") salida[nombre] = valor.toUpperCase();
    else {
      for (const [paso, hex] of Object.entries(valor)) {
        salida[paso === "DEFAULT" ? nombre : `${nombre}-${paso}`] = hex.toUpperCase();
      }
    }
  }
  return salida;
}

test("theme.css (Tailwind v4) tiene los mismos colores que el preset (Tailwind v3)", () => {
  // Proyectos y Contabilidad usan theme.css: si le faltara un alias, al subir de versión sus
  // componentes quedarían sin color.
  assert.deepEqual(variablesDeColor(leer("theme.css")), coloresPlanos(colores));
});

test("theme-distribucion.css pisa lo mismo que el preset de Distribución", () => {
  const css = leer("theme-distribucion.css");
  assert.match(css, /@import "\.\/theme\.css";/);
  assert.deepEqual(variablesDeColor(css), coloresPlanos(coloresDistribucion));
});

// ── Preset de Distribución ───────────────────────────────────────────────────────────────

test("preset de Distribución: extiende el base y pisa solo la marca", () => {
  assert.deepEqual(distribucion.presets, [base]);
  const { brand, amarillo } = coloresDistribucion;
  assert.equal(brand.DEFAULT, "#F9AE22");
  assert.equal(brand.on, "#373A3C"); // texto grafito sobre amarillo (6,1:1), nunca blanco
  assert.equal(brand.hover, "#E99A06");
  assert.equal(brand.fg, "#865904"); // texto de marca sobre blanco (6,1:1)
  assert.equal(brand.text, "#373A3C");
  assert.equal(brand.ring, "#FBCA6F");
  assert.equal(brand.soft, "#FEF7E9");
  assert.equal(amarillo[500], brand.DEFAULT);
  assert.equal(amarillo.DEFAULT, brand.DEFAULT);
  assert.equal(coloresDistribucion.grafito, "#373A3C");
  assert.equal(coloresDistribucion.acero, "#646D73");
  // Neutros y semánticos: los del ecosistema (no se pisan).
  for (const escala of ["neutro", "ambar", "verde", "rojo"]) assert.equal(coloresDistribucion[escala], undefined);
  // Los alias del base y los de la división son los mismos (nadie queda sin definir).
  assert.deepEqual(Object.keys(brand).sort(), Object.keys(colores.brand).sort());
});

/** Contraste WCAG 2.1 entre dos colores #RRGGBB. */
function contraste(a, b) {
  const lum = (hex) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

test("contrastes AA de los alias, en las dos marcas", () => {
  for (const { brand } of [colores, coloresDistribucion]) {
    assert.ok(contraste(brand.on, brand.DEFAULT) >= 4.5, `texto sobre brand ${brand.DEFAULT}`);
    assert.ok(contraste(brand.on, brand.hover) >= 4.5, `texto sobre hover ${brand.hover}`);
    assert.ok(contraste(brand.fg, "#FFFFFF") >= 4.5, `brand-fg ${brand.fg} sobre blanco`);
    assert.ok(contraste(brand.text, "#FFFFFF") >= 4.5, `brand-text ${brand.text} sobre blanco`);
    assert.ok(contraste(brand.badge, "#FFFFFF") >= 4.5, `brand-badge ${brand.badge} sobre blanco`);
  }
  // Por qué existen brand-on y brand-text: el amarillo no sirve como texto ni con texto blanco.
  assert.ok(contraste("#FFFFFF", coloresDistribucion.brand.DEFAULT) < 3);
});

// ── Componentes: identidad solo por alias ──────────────────────────────────────────────────

const fuentes = readdirSync(new URL("src/", raiz)).filter((f) => f.endsWith(".tsx"));
const codigo = fuentes.map((f) => [f, leer(`src/${f}`)]);

test("ningún componente pone texto blanco sobre bg-brand ni usa text-brand como texto", () => {
  for (const [archivo, src] of codigo) {
    for (const [cadena] of src.matchAll(/"[^"\n]*bg-brand(?![-\w])[^"\n]*"/g)) {
      assert.doesNotMatch(cadena, /\btext-white\b/, `${archivo}: ${cadena}`);
    }
    // text-brand a secas es el relleno (amarillo en Distribución): como texto va brand-text o brand-fg
    assert.doesNotMatch(src, /\btext-brand(?![-\w])/, archivo);
    assert.doesNotMatch(src, /hover:bg-brand-fg/, archivo);
  }
});

test("el rojo queda solo para errores y lo destructivo: el foco es brand-ring", () => {
  for (const [archivo, src] of codigo) {
    for (const linea of src.split("\n").filter((l) => /rojo-300/.test(l))) {
      // la única excepción: el botón destructivo, cuyo foco sigue en rojo
      assert.match(linea, /danger: "bg-rojo-600/, `${archivo}: ${linea.trim()}`);
    }
  }
});

test("Button primario y Badge «marca» salen de los alias", () => {
  assert.match(html(h(Button, null, "Confirmar")), /class="[^"]*bg-brand text-brand-on hover:bg-brand-hover focus-visible:ring-brand-ring/);
  assert.match(html(h(Badge, { tone: "marca" }, "Nivel Oro")), /bg-white text-brand-badge border border-brand-ring/);
});

// ── AppHeader: indicador, Apps y nombre ─────────────────────────────────────────────────────

const SECCIONES = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/pedidos", label: "Pedidos" },
  { href: "/admin", label: "Administración", group: "Enersol" },
];

const encabezado = (props = {}) =>
  html(
    h(AppHeader, {
      moduleKey: "distribucion",
      moduleName: "Distribución",
      logo: h("img", { alt: "Enersol Distribución", src: "/brand/imagotipo-color.svg" }),
      items: SECCIONES,
      currentPath: "/pedidos/7",
      ...props,
    }),
  );

test("AppHeader por defecto: igual que antes (Apps, nombre y la actual en texto)", () => {
  const salida = encabezado();
  assert.match(salida, /aria-label="Cambiar de módulo"/);
  assert.match(salida, />Distribución<\/span>/);
  assert.match(salida, /<a href="\/pedidos" aria-current="page" class="whitespace-nowrap px-2 py-2 text-\[13px\] font-medium transition-colors text-brand-text">/);
  assert.doesNotMatch(salida, /after:/);
  assert.doesNotMatch(salida, /self-stretch/);
});

test("AppHeader indicador=\"subrayado\": barra amarilla de 3 px pegada al borde inferior", () => {
  const salida = encabezado({ indicador: "subrayado" });
  assert.match(salida, /<nav aria-label="Secciones del módulo" class="[^"]*self-stretch/);
  // la fila que contiene la barra también ocupa todo el alto (si no, la barra flota sobre el borde)
  assert.match(salida, /<div class="flex min-w-0 items-center gap-2 lg:gap-4 self-stretch">/);
  const actual = salida.match(/<a href="\/pedidos" aria-current="page" class="([^"]*)"/)[1];
  assert.match(actual, /text-brand-text/);
  assert.match(actual, /h-full/);
  assert.match(actual, /after:-bottom-px after:h-\[3px\][^"]*after:bg-brand after:content-\[(?:''|&#x27;&#x27;)\]/);
  const otra = salida.match(/<a href="\/catalogo" class="([^"]*)"/)[1];
  assert.doesNotMatch(otra, /after:/);
  // «Más» con una sección actual adentro también se subraya
  assert.match(encabezado({ indicador: "subrayado", currentPath: "/admin" }), /aria-haspopup="menu" aria-expanded="false" class="[^"]*after:bg-brand/);
});

test("AppHeader mostrarApps={false}: sin menú de módulos (clientes externos)", () => {
  assert.doesNotMatch(encabezado({ mostrarApps: false }), /Cambiar de módulo/);
});

test("AppHeader mostrarNombre={false}: el logo ya dice el nombre; no se repite", () => {
  const salida = encabezado({ mostrarNombre: false });
  assert.doesNotMatch(salida, />Distribución<\/span>/);
  // el separador entre el logo y la navegación sigue
  assert.match(salida, /<span class="hidden h-6 w-px shrink-0 bg-neutro-200 lg:block" aria-hidden="true"><\/span>/);
});
