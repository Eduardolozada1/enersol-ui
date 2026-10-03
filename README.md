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

El Dockerfile del frontend necesita `git` para que `npm ci` pueda traer el paquete:
`RUN apk add --no-cache git` antes de `npm ci` (imagen `node:20-alpine`).

## Qué incluye

- Tokens: `tailwind-preset.cjs` (paleta oficial, Sora + Roboto, radios, sombras).
- Primitivos: `Button`, `Card`/`CardHeader`/`CardBody`, `Badge` (neutro · rojo · verde ·
  atencion · marca), `Input`, `Select`, `Spinner`/`CenteredSpinner`, `Logo`, `Modal`.
- Patrones: `PageHeader` (cabecera compacta de una línea), `EmptyState`, `CollapsibleCard`
  (acordeón con resumen visible), `DataTable` (orden, cabecera fija, fila clicable,
  dígitos tabulares), `AppsMenu` (saltar entre módulos vía el Hub).

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
