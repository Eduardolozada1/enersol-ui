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
