// Compara la galería entre dos versiones del paquete, píxel a píxel.
//
//   cd galeria && npm ci && node comparar.mjs [--antes v0.4.0]
//
// «antes» sale de la etiqueta (dist/, tailwind-preset.cjs y theme.css tal como se publicaron) y
// «después» del árbol de trabajo (compila el paquete antes). Cada una se dibuja como la usan los
// módulos: Tailwind v3 con el preset (Operaciones, Hub, Marketing, Cuotas) y Tailwind v4 con
// theme.css (Proyectos, Contabilidad), en escritorio (1440 px) y en celular (390 px, táctil), y
// en varios estados (foco, hover, menús y diálogos abiertos). Las capturas de la marca Enersol
// tienen que ser IDÉNTICAS; las de Distribución (preset y theme de la división, solo «después»)
// quedan para mirar. Salida en galeria/salida/ (resumen.json + PNG); sale con código 1 si algo
// difiere.
//
// Necesita Playwright con Chromium (en el entorno de la nube ya está: require("playwright")).
import { execFileSync, execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const TRABAJO = join(AQUI, ".trabajo");
const SALIDA = join(AQUI, "salida");
const require = createRequire(import.meta.url);

const arg = (nombre, porDefecto) => {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 ? process.argv[i + 1] : porDefecto;
};
const ANTES = arg("antes", execSync("git describe --tags --abbrev=0", { cwd: RAIZ }).toString().trim());

const ARCHIVOS = ["dist/index.js", "tailwind-preset.cjs", "theme.css"];
const ARCHIVOS_DISTRIBUCION = ["tailwind-preset-distribucion.cjs", "theme-distribucion.css"];

// ── 1. Las dos versiones del paquete ────────────────────────────────────────────────────────

function preparar() {
  rmSync(TRABAJO, { recursive: true, force: true });
  rmSync(SALIDA, { recursive: true, force: true });
  mkdirSync(SALIDA, { recursive: true });
  execSync("npm run build", { cwd: RAIZ, stdio: "inherit" });
  for (const archivo of ARCHIVOS) {
    const destino = join(TRABAJO, "antes", archivo);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, execFileSync("git", ["show", `${ANTES}:${archivo}`], { cwd: RAIZ }));
  }
  for (const archivo of [...ARCHIVOS, ...ARCHIVOS_DISTRIBUCION]) {
    cpSync(join(RAIZ, archivo), join(TRABAJO, "despues", archivo));
  }
}

// ── 2. Una variante = versión × Tailwind × marca ────────────────────────────────────────────

const VARIANTES = [
  { id: "antes-v3", version: "antes", tailwind: 3, marca: "enersol" },
  { id: "despues-v3", version: "despues", tailwind: 3, marca: "enersol" },
  { id: "antes-v4", version: "antes", tailwind: 4, marca: "enersol" },
  { id: "despues-v4", version: "despues", tailwind: 4, marca: "enersol" },
  { id: "distribucion-v3", version: "despues", tailwind: 3, marca: "distribucion" },
  { id: "distribucion-v4", version: "despues", tailwind: 4, marca: "distribucion" },
];
const PARES = [
  ["antes-v3", "despues-v3"],
  ["antes-v4", "despues-v4"],
];

async function armar(v) {
  const dir = join(TRABAJO, v.id);
  const paquete = join(TRABAJO, v.version);
  mkdirSync(dir, { recursive: true });
  const modulos = (nombre) => dirname(require.resolve(`${nombre}/package.json`));
  await build({
    entryPoints: [join(AQUI, "Galeria.jsx")],
    bundle: true,
    format: "esm",
    jsx: "automatic",
    outfile: join(dir, "app.js"),
    logLevel: "error",
    define: { "process.env.NODE_ENV": '"production"' },
    // un solo React para la galería y el paquete
    alias: { "@enersol/ui": join(paquete, "dist/index.js"), react: modulos("react"), "react-dom": modulos("react-dom") },
  });

  const contenido = [join(AQUI, "Galeria.jsx"), join(paquete, "dist/index.js")];
  if (v.tailwind === 3) {
    const preset = join(paquete, v.marca === "distribucion" ? "tailwind-preset-distribucion.cjs" : "tailwind-preset.cjs");
    writeFileSync(
      join(dir, "tailwind.config.cjs"),
      `module.exports = { presets: [require(${JSON.stringify(preset)})], content: ${JSON.stringify(contenido)} };\n`,
    );
    writeFileSync(join(dir, "entrada.css"), "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n");
    execFileSync(process.execPath, [
      require.resolve("tailwindcss3/lib/cli.js"),
      "-c", join(dir, "tailwind.config.cjs"), "-i", join(dir, "entrada.css"), "-o", join(dir, "estilos.css"),
    ], { stdio: "pipe" });
  } else {
    const tema = join(paquete, v.marca === "distribucion" ? "theme-distribucion.css" : "theme.css");
    writeFileSync(
      join(dir, "entrada.css"),
      [
        '@import "tailwindcss";',
        `@import ${JSON.stringify(tema)};`,
        ...contenido.map((c) => `@source ${JSON.stringify(c)};`),
        "",
      ].join("\n"),
    );
    execFileSync(process.execPath, [
      join(modulosDe("@tailwindcss/cli"), "dist/index.mjs"), "-i", join(dir, "entrada.css"), "-o", join(dir, "estilos.css"),
    ], { stdio: "pipe", cwd: AQUI });
  }

  writeFileSync(
    join(dir, "index.html"),
    `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="/node_modules/@fontsource/roboto/400.css" />
<link rel="stylesheet" href="/node_modules/@fontsource/roboto/500.css" />
<link rel="stylesheet" href="/node_modules/@fontsource/roboto/700.css" />
<link rel="stylesheet" href="/node_modules/@fontsource/sora/600.css" />
<link rel="stylesheet" href="/node_modules/@fontsource/sora/700.css" />
<link rel="stylesheet" href="estilos.css" />
<script>window.GALERIA_MODO = ${JSON.stringify(v.marca)};</script>
</head><body><div id="raiz"></div><script type="module" src="app.js"></script></body></html>
`,
  );
}

function modulosDe(nombre) {
  return dirname(require.resolve(`${nombre}/package.json`));
}

// ── 3. Servidor estático de galeria/ ────────────────────────────────────────────────────────

const TIPOS = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff" };

function servir() {
  return new Promise((ok) => {
    const servidor = createServer((req, res) => {
      const ruta = join(AQUI, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!ruta.startsWith(AQUI) || !existsSync(ruta)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "content-type": TIPOS[extname(ruta)] ?? "application/octet-stream" });
      res.end(readFileSync(ruta));
    });
    servidor.listen(0, "127.0.0.1", () => ok(servidor));
  });
}

// ── 4. Escenas ──────────────────────────────────────────────────────────────────────────────

const PANTALLAS = {
  escritorio: { viewport: { width: 1440, height: 900 } },
  celular: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

const seccion = (page, id) => page.locator(`[data-seccion="${id}"]`);
const abrir = (page, id) => page.locator(`[data-abrir="${id}"]`).click();

const ESCENAS = [
  { nombre: "pagina", completa: true },
  { nombre: "foco-campo", hacer: (p) => p.locator('[data-prueba="input"]').focus(), recorte: (p) => seccion(p, "campos") },
  { nombre: "foco-select", hacer: (p) => p.locator('[data-prueba="select"]').focus(), recorte: (p) => seccion(p, "campos") },
  { nombre: "hover-primario", solo: "escritorio", hacer: (p) => p.locator('[data-prueba="primario"]').hover(), recorte: (p) => seccion(p, "botones") },
  { nombre: "foco-fila", solo: "escritorio", hacer: (p) => p.locator("tbody tr").first().focus(), recorte: (p) => seccion(p, "tabla") },
  { nombre: "mas", solo: "escritorio", hacer: (p) => p.getByRole("button", { name: "Más", exact: true }).click() },
  { nombre: "apps", solo: "escritorio", marca: "enersol", hacer: (p) => p.getByLabel("Cambiar de módulo").click() },
  { nombre: "menu", solo: "celular", hacer: (p) => p.getByLabel("Abrir menú").click() },
  { nombre: "mensajes", hacer: (p) => p.getByRole("button", { name: /Mensajes/ }).first().click() },
  {
    nombre: "chat",
    hacer: async (p) => {
      await p.getByRole("button", { name: /Mensajes/ }).first().click();
      await p.getByText("Luis Rojas").first().click();
      await p.getByLabel("Escribí un mensaje").focus();
    },
  },
  { nombre: "confirmar", hacer: async (p) => { await abrir(p, "confirmar"); await p.locator('[data-foco="motivo"]').focus(); } },
  { nombre: "modal", hacer: (p) => abrir(p, "modal") },
  { nombre: "guia", hacer: (p) => abrir(p, "guia") },
  { nombre: "sugerencia", hacer: async (p) => { await abrir(p, "sugerencia"); await p.locator("textarea").first().focus(); } },
];

async function contextoDe(browser, pantalla) {
  return browser.newContext({
    ...PANTALLAS[pantalla], deviceScaleFactor: 1, locale: "es-BO", timezoneId: "America/La_Paz", reducedMotion: "reduce",
  });
}

async function fotografiar(page, url, escena, archivo) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (escena.hacer) await escena.hacer(page);
  await page.waitForTimeout(150);
  mkdirSync(dirname(archivo), { recursive: true });
  if (escena.recorte) await escena.recorte(page).screenshot({ path: archivo, animations: "disabled", caret: "hide" });
  else await page.screenshot({ path: archivo, fullPage: !!escena.completa, animations: "disabled", caret: "hide" });
}

const urlDe = (v) => `${base}/.trabajo/${v.id}/index.html`;

async function capturar(browser, v) {
  const capturas = {};
  for (const pantalla of Object.keys(PANTALLAS)) {
    const contexto = await contextoDe(browser, pantalla);
    const page = await contexto.newPage();
    for (const escena of ESCENAS) {
      if (escena.solo && escena.solo !== pantalla) continue;
      if (escena.marca && escena.marca !== v.marca) continue;
      const archivo = join(SALIDA, v.id, `${pantalla}-${escena.nombre}.png`);
      await fotografiar(page, urlDe(v), escena, archivo);
      capturas[`${pantalla}-${escena.nombre}`] = { archivo, pantalla, escena };
    }
    await contexto.close();
  }
  return capturas;
}

/** Chromium no siempre dibuja igual el borde suavizado de algunos elementos (p. ej. el anillo de
 *  foco de un textarea en la hoja de Mejoras del celular: 0 o 6 px entre dos capturas de la MISMA
 *  versión). Si un par difiere, se vuelve a capturar cada lado hasta REINTENTOS veces: es igual si
 *  alguna captura de «antes» coincide con alguna de «después», y se informa el ruido medido entre
 *  capturas de la misma versión. */
const REINTENTOS = 4;

async function otrasCapturas(browser, v, c) {
  const contexto = await contextoDe(browser, c.pantalla);
  const page = await contexto.newPage();
  const archivos = [c.archivo];
  for (let i = 1; i <= REINTENTOS; i += 1) {
    const archivo = join(TRABAJO, "reintentos", v.id, `${c.pantalla}-${c.escena.nombre}-${i}.png`);
    await fotografiar(page, urlDe(v), c.escena, archivo);
    archivos.push(archivo);
  }
  await contexto.close();
  return archivos;
}

function diferencia(a, b, destino) {
  const [ia, ib] = [PNG.sync.read(readFileSync(a)), PNG.sync.read(readFileSync(b))];
  if (ia.width !== ib.width || ia.height !== ib.height) {
    return { pixeles: -1, motivo: `tamaño ${ia.width}×${ia.height} contra ${ib.width}×${ib.height}` };
  }
  const salida = new PNG({ width: ia.width, height: ia.height });
  const pixeles = pixelmatch(ia.data, ib.data, salida.data, ia.width, ia.height, { threshold: 0 });
  if (pixeles > 0 && destino) writeFileSync(destino, PNG.sync.write(salida));
  return { pixeles, tamano: `${ia.width}×${ia.height}` };
}

// ── 5. Todo junto ───────────────────────────────────────────────────────────────────────────

preparar();
for (const v of VARIANTES) await armar(v);
const servidor = await servir();
const base = `http://127.0.0.1:${servidor.address().port}`;
const { chromium } = require("playwright");
const browser = await chromium.launch();
const capturas = {};
for (const v of VARIANTES) capturas[v.id] = await capturar(browser, v);

const variante = (id) => VARIANTES.find((v) => v.id === id);
const resumen = { antes: ANTES, comparaciones: [] };
let distintas = 0;
for (const [a, b] of PARES) {
  for (const [nombre, c] of Object.entries(capturas[a])) {
    const otro = capturas[b][nombre];
    let r = diferencia(c.archivo, otro.archivo, join(SALIDA, `diferencia-${b}-${nombre}.png`));
    if (r.pixeles !== 0) {
      const de = await otrasCapturas(browser, variante(a), c);
      const contra = await otrasCapturas(browser, variante(b), otro);
      const coincide = de.some((x) => contra.some((y) => diferencia(x, y, null).pixeles === 0));
      const ruido = Math.max(...[de, contra].flatMap((lado) => lado.slice(1).map((x) => diferencia(lado[0], x, null).pixeles)));
      if (coincide) rmSync(join(SALIDA, `diferencia-${b}-${nombre}.png`), { force: true });
      if (coincide) r = { ...r, pixeles: 0, nota: `render inestable de Chromium: hasta ${ruido} px entre capturas de la misma versión; con ${REINTENTOS} reintentos coinciden` };
    }
    if (r.pixeles !== 0) distintas += 1;
    resumen.comparaciones.push({ par: `${a} → ${b}`, escena: nombre, ...r });
  }
}
await browser.close();
servidor.close();

resumen.capturas_comparadas = resumen.comparaciones.length;
resumen.distintas = distintas;
writeFileSync(join(SALIDA, "resumen.json"), JSON.stringify(resumen, null, 2));
for (const c of resumen.comparaciones) {
  console.log(`${c.pixeles === 0 ? "igual   " : "DISTINTA"}  ${c.par}  ${c.escena}  ${c.tamano ?? c.motivo}  (${c.pixeles} px)${c.nota ? `  ${c.nota}` : ""}`);
}
console.log(`\n${resumen.capturas_comparadas} capturas comparadas contra ${ANTES}: ${distintas} distintas.`);
process.exit(distintas ? 1 : 0);
