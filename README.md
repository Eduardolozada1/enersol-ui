# @enersol/ui

Componentes y tokens de diseño compartidos del ecosistema Enersol (Operaciones,
Plataforma, Proyectos, Marketing, Contabilidad). Un cambio de diseño se hace **una vez**
acá y llega a todos los módulos al subir la versión.

Contiene solo UI (sin lógica de negocio ni secretos), por eso el repo es público y los
módulos lo instalan como dependencia de git **sin registro npm ni tokens**.

## Uso en un módulo

```jsonc
// package.json
"dependencies": { "@enersol/ui": "github:Eduardolozada1/enersol-ui#v0.1.0" }
```

```js
// tailwind.config.js
import preset from "@enersol/ui/tailwind-preset";
export default {
  presets: [preset],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./node_modules/@enersol/ui/dist/**/*.js"],
};
```

```tsx
import { Button, DataTable, PageHeader, AppsMenu } from "@enersol/ui";
```

Con **Tailwind v4** (Proyectos, Contabilidad) no hay preset: los tokens van por CSS.

```css
@import "tailwindcss";
@import "@enersol/ui/theme.css";
@source "../node_modules/@enersol/ui/dist";
```

**Enersol Distribución** (submarca amarillo solar + grafito, desde la 0.5.0) usa el preset de la
división, que extiende el base y pisa solo los alias de marca:

```js
import preset from "@enersol/ui/tailwind-preset-distribucion";   // Tailwind v3
```

```css
@import "@enersol/ui/theme-distribucion.css";                      /* Tailwind v4 */
```

El Dockerfile del frontend necesita `git` para que `npm ci` pueda traer el paquete:
`RUN apk add --no-cache git` antes de `npm ci` (imagen `node:20-alpine`).

## Qué incluye

- Tokens: `tailwind-preset.cjs` (paleta oficial, Sora + Roboto, radios, sombras).
- Primitivos: `Button`, `Card`/`CardHeader`/`CardBody`, `Badge` (neutro · rojo · verde ·
  atencion · marca), `Input`, `Select`, `Spinner`/`CenteredSpinner`, `Logo`, `Modal`.
- Patrones: `PageHeader` (cabecera compacta de una línea), `EmptyState`, `CollapsibleCard`
  (acordeón con resumen visible), `DataTable` (orden, cabecera fija, fila clicable,
  dígitos tabulares), `AppsMenu` (saltar entre módulos vía el Hub).
- Piezas del encabezado (0.4.0): `MessagesBell`, `SugerenciaBoton`/`SugerenciaModal`, `GuiaBoton`/`GuiaPanel`,
  `instalarReporteErrores`, `destinoSeguro` (ver abajo).
- Desde 0.3.0: `AppHeader` (encabezado unificado con menú ☰ en celular y «Más» en
  escritorio), `ConfirmDialog` + `useConfirm` (en lugar de `window.confirm`/`prompt`) y
  `Pagination` + `paginationRange` (listados con total).

## Verificar un cambio del paquete: la galería

`galeria/` dibuja todos los componentes (foco, hover, menús y diálogos abiertos) con la última
etiqueta y con el árbol de trabajo, como los usan los módulos (Tailwind v3 con el preset y v4 con
`theme.css`), en escritorio y en celular, y compara las capturas píxel a píxel. Un cambio que no
debe verse en los módulos tiene que dar «0 distintas»:

```bash
cd galeria && npm ci && node comparar.mjs        # o --antes v0.4.0
```

Las capturas quedan en `galeria/salida/` (también las de Distribución, para mirar). Necesita
Playwright con Chromium.

## Publicar una versión

```bash
npm run build          # regenera dist/ (se commitea)
git commit -am "..."
git tag v0.1.1 && git push --tags && git push
```

Después, en cada módulo: subir la etiqueta en `package.json` y `npm install`.

## Reglas de diseño (regla de Eduardo)

- Verde = OK/completado · ámbar = precaución/en curso · rojo = solo error o LA acción
  primaria de la pantalla. `Badge tone="marca"` es identidad (contorno rojo), no error.
- El contenido usa todo el ancho: tablas y tableros a lo ancho; formularios y texto en
  columna de lectura; tarjetas en grilla, nunca una sola tarjeta al 100 %.
- Nunca esconder el estado detrás de un clic: los acordeones llevan `summary`.

## 0.2.0 — Celular (Fase 1 de la app móvil, 03/10/2026)

Todo condicionado a pantallas chicas o táctiles: **en escritorio nada cambia**.

- `Button`, `Input`, `Select`: 44 px de alto mínimo con puntero táctil (`[@media(pointer:coarse)]`),
  `Button` sin partir el texto (`whitespace-nowrap`), `Select` con letra de 16 px en celular (iPhone no
  hace zoom al tocarlo).
- `Modal`: en celular es una hoja que sube desde abajo, a lo ancho; desde `sm` sigue igual.
- `DataTable`: la cabecera fija solo desde `lg` (en celular tapaba la primera fila) y, por debajo de
  `sm`, **modo tarjetas** por defecto (`movil="tarjetas"`): la primera columna (o la marcada
  `tarjeta: "titulo"`) encabeza cada tarjeta y el resto va como etiqueta/valor; `tarjeta: "oculta"`
  la saca de la tarjeta y `etiquetaTarjeta` cambia la etiqueta. Con `movil="tabla"` se mantiene la tabla.
- `MobileMenu` + `mobileMenuItemClass` + `MobileMenuSection`: menú ☰ del encabezado para celular/tablet
  (usar con `lg:hidden`; la barra de escritorio de cada módulo pasa a `hidden lg:flex`).
- `AppsMenu`: área táctil más grande y el desplegable nunca más ancho que la pantalla.

## 0.3.0 — Encabezado, confirmación y paginación compartidos (16/10/2026)

Aditivo: nada de lo anterior cambia. Cada módulo lo adopta cuando sube la etiqueta.

- `AppHeader`: el encabezado unificado (blanco, `border-b`, Apps + logo h-7 + separador +
  nombre del módulo, navegación en texto con la actual en `text-brand`, usuario y «Salir»).
  Sin router propio: el módulo pasa `renderLink` (p. ej. `({ href, ...p }) => <Link to={href} {...p} />`)
  y `currentPath`. Por debajo de `desktopFrom` (`lg` por defecto; `xl` o `2xl` si el módulo
  tiene muchas secciones) la barra se reemplaza por el menú ☰ con todas las secciones: en el
  celular nunca hay scroll lateral. Las secciones con `group` van en el desplegable «Más» de
  la barra y bajo su título en el menú ☰. `notice` muestra un aviso en ámbar arriba de todo;
  `persistentActions` se ven también en el celular (mensajes, guía), `actions` solo en
  escritorio y `mobileMenuFooter` agrega filas al pie del menú ☰.
- `ConfirmDialog`: confirmación accesible (alertdialog, foco atrapado, Escape cancela) con
  motivo opcional u obligatorio; `tone="danger"` pone el botón en rojo solo para lo
  destructivo. Si `onConfirm` devuelve una promesa muestra «Procesando…» y bloquea el doble
  clic; si falla, el error queda en el diálogo. `useConfirm()` da la versión con promesa
  (`const r = await confirm({...}); if (r.confirmed) …`).
- `Pagination`: «Mostrando 51–100 de 251 ventas» + Anterior / páginas / Siguiente, con
  `offset` y `pageSize` (los mismos `desplazamiento` y `limite` de la API); en el celular,
  «Página 2 de 6». `paginationRange(total, pageSize, offset)` es la cuenta pura.
- `npm test` compila y prueba el `dist/` con `node --test` (sin navegador).

## 0.4.0 — Piezas compartidas del encabezado (29/10/2026)

Aditivo: nada de lo anterior cambia. Reemplaza las copias que cada módulo tenía del sobre de
mensajes, el botón Mejoras, el botón ❓ de guías, el reportador de errores de pantalla y el
destino seguro del SSO. El paquete **no conoce la API de ningún módulo**: cada uno pasa sus
funciones (`api.get/post`, `onEnviar`, `enviar`) con su sesión y su prefijo.

### `MessagesBell` — sobre de mensajes del Hub

```tsx
// Operaciones / Marketing (TSX): su cliente `api<T>(path, { method, json })`, prefijo /mensajes
import { MessagesBell, type MensajesApi } from "@enersol/ui";
const mensajesApi: MensajesApi = {
  get: (p) => api(p),
  post: (p, body) => api(p, { method: "POST", json: body }),
};
<MessagesBell api={mensajesApi} selfEmail={me.email} />            // encabezado
<MessagesBell api={mensajesApi} selfEmail={me.email} enMenu />     // fila del menú ☰
```

```jsx
// Proyectos (JSX): su `api.get/api.post` ya reciben la ruta completa
<MessagesBell api={api} prefijo="/api/mensajes" selfEmail={me.email} pantallaCompletaHasta="lg" />
// Hub: los mensajes viven ahí → prefijo="/msg"
```

- Contador cada `pollMs` (30 s por defecto), sin dos consultas a la vez y **en pausa con la
  pestaña oculta** (consulta al volver). Si el Hub no responde, el sobre se esconde
  (`ocultarSiFalla`, por defecto sí).
- Panel: Mensajes (chat 1 a 1, «+ Nuevo» con buscador) y Menciones (links filtrados por
  `safeHref`: solo rutas propias o https de `*.enersol-sa.com`). En el celular ocupa toda la
  pantalla con título, **✕ Cerrar mensajes** y safe-area; `pantallaCompletaHasta="lg"` lo
  extiende a tablet. Escape cierra. El evento `EVENTO_ABRIR_MENSAJES`
  (`"enersol:abrir-mensajes"`) lo abre desde cualquier lado (fila de Mi día).
- Rutas usadas (`rutasMensajes(prefijo)`): `unread`, `threads`, `thread?con_email=`,
  `menciones`, `leer`, `leer-thread`, `send`, `directorio`.

### `SugerenciaBoton` / `SugerenciaModal` — «💡 Mejoras»

```tsx
<SugerenciaBoton onEnviar={(p) => api("/sugerencias", { method: "POST", json: p })} />
<SugerenciaBoton variante="menu" onEnviar={enviarSugerencia} />   // fila «💡 Mejoras y errores»
<SugerenciaModal open={abierto} onClose={() => setAbierto(false)} onEnviar={enviarSugerencia} />
```

```jsx
// Proyectos (JSX)
<SugerenciaBoton onEnviar={(p) => api.post("/api/sugerencias", p)} />
```

`onEnviar` recibe `{ tipo: "mejora" | "error", descripcion, url, captura_b64, captura_nombre,
captura_tipo }`; si rechaza, el `message` del error se muestra en el modal. Valida antes de
mandar (`validarSugerencia`): mínimo 5 letras, captura PNG/JPG/WEBP de hasta 4 MB
(`SUGERENCIA_MAX_BYTES`). `textoGracias` cambia el mensaje final.

### `GuiaBoton` / `GuiaPanel` — botón ❓

Una guía es `{ id, titulo, icono?, intro?, quien?, pasos?, notas?, render?, match(path) }`:
de **datos** (pasos con `**negritas**`) o con **`render()`** (JSX propio). Pueden convivir y
puede haber varias por ruta (`match` recibe la ruta sin barra final).

```tsx
// Hub / Marketing (datos, TSX)
import { GuiaBoton, rutaEmpieza, type Guia } from "@enersol/ui";
export const GUIAS: Guia[] = [
  { id: "obras", icono: "🏗️", titulo: "Obras", intro: "Todas las obras.",
    pasos: ["Tocá **Nueva obra**…"], match: rutaEmpieza("/obras") },
];
const { pathname } = useLocation();
<GuiaBoton guias={GUIAS} path={pathname} porDefecto="launcher"
  filtrar={(g) => me?.is_superadmin || !g.quien?.startsWith("Solo super-admin")} />
<GuiaBoton guias={GUIAS} path={pathname} variante="menu" />          // fila del menú ☰
```

```jsx
// Operaciones / Cuotas (render, JSX): varias guías por ruta, sin lista de otras pantallas
const GUIAS = [
  { id: "cobros", titulo: "Cobros", match: (p) => /^\/obras\/\d+$/.test(p), render: () => <SeccionCobros /> },
];
<GuiaBoton guias={GUIAS} path={pathname} multiples="todas"
  ocultarEn={(p) => p.startsWith("/guia")}
  enlaceGuiaCompleta={<Link to="/guia">Abrir la guía completa →</Link>} />
```

- Panel lateral de 520 px; en el celular a pantalla completa con safe-area. Escape o tocar
  afuera cierran; el foco entra al panel y vuelve al botón.
- Varias guías en la ruta: `multiples="pestanas"` (por defecto) o `"todas"` (una debajo de
  otra). Sin coincidencias: `porDefecto` (id) o la primera.
- «Ver la guía de otra pantalla» (`elegirOtra`): por defecto aparece si el catálogo tiene
  guías de datos. Controlado desde afuera: `open` + `onOpenChange` (+ `sinBoton`).
- La fila del menú ☰ no cierra el menú: el panel se abre encima (z-60).
- Funciones puras: `guiasPorRuta(guias, path)`, `normalizarRuta`, `rutaEmpieza`,
  `partirNegritas`, `conNegritas`.

### `instalarReporteErrores` — errores de pantalla

```ts
// main.tsx
import { instalarReporteErrores } from "@enersol/ui";
export const { reportar } = instalarReporteErrores({
  app: "operaciones",
  activo: () => !!getToken(),
  rutasPublicas: ["/login", "/sso", "/n/"],
  ignorar: (e) => e instanceof ApiError,       // ya se muestran en pantalla
  enviar: (error) =>
    fetch("/api/salud/error-pantalla", {
      method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(error),               // { mensaje, ruta, pila }
    }),
});
// ErrorBoundary: componentDidCatch(e) { reportar(e) }
```

Escucha `error` y `unhandledrejection`; una vez por error y ruta, hasta 20 por sesión; ignora
cortes de red («Failed to fetch»…) y los `deApi` de Proyectos; recorta mensaje (1900) y pila
(7900); nunca rompe la pantalla. Llamarlo dos veces con la misma `app` no duplica listeners.

### `destinoSeguro` — adónde ir después del SSO

```ts
const next = destinoSeguro(params.get("next"));                       // "/obras/3" o "/"
const ir = destinoSeguro(next, ["https://operaciones.enersol-sa.com"]); // URL completa solo a esos orígenes
```

Rechaza `//x`, `/\x`, tabs y saltos de línea, `javascript:`, otros dominios y URLs con
usuario/clave; ante la duda, `"/"` (o `porDefecto`). También `rutaInterna(raw)` y
`safeHref(raw)` (los del Hub).

## 0.5.0 — Alias de marca y Enersol Distribución (29/10/2026)

Nada cambia en los módulos que ya usan el paquete: la galería da las mismas capturas que la
0.4.0 (46 de 46, Tailwind v3 y v4, escritorio y celular). Para la submarca de Distribución
(decisión de Gerencia del 29/10/2026; Guía UX/UI de Distribución, sección 3):

- **Alias de marca** en el preset y en `theme.css`, con los valores de siempre: `brand-on` (texto
  sobre `bg-brand`), `brand-hover`, `brand-text` (ítem activo del encabezado, del menú ☰ y de la
  paginación), `brand-ring` (anillo y borde de foco), `brand-soft` y `brand-badge` (texto del
  Badge «marca»). Los componentes los usan en lugar de `text-white`, `text-brand`,
  `hover:bg-brand-fg` y `ring-rojo-300`; el rojo queda para el botón destructivo y los errores.
  Una ruta nueva o un componente nuevo usa los alias: lo controla `test/marca.test.mjs`.
- **`AppHeader`**: `indicador="subrayado"` (la sección actual con una barra `bg-brand` de 3 px
  pegada al borde inferior y texto `brand-text`), `mostrarApps={false}` (sin el menú de módulos:
  para clientes externos) y `mostrarNombre={false}` (cuando el logo ya dice el nombre del módulo).
  Por defecto, todo igual que antes.
- `Logo`: variantes `bloque-color` y `bloque-negativo` (logo principal de una división).
- **`tailwind-preset-distribucion.cjs` y `theme-distribucion.css`**: amarillo solar `#F9AE22` y
  grafito `#373A3C`, con texto grafito sobre amarillo (6,1:1) y `#865904` como texto de marca
  sobre blanco. Neutros, semánticos, letras, radios y sombras: los del ecosistema.
- `galeria/`: la comparación píxel a píxel de arriba.

