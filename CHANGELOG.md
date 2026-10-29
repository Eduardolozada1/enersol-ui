# Cambios de @enersol/ui

Cada versión se publica con su etiqueta (`vX.Y.Z`); los módulos la adoptan subiendo la
etiqueta en su `package.json`. Detalle y ejemplos de uso en el README.

## 0.6.0 — 29/10/2026

Ajustes de contraste aprobados por Eduardo (29/10/2026). **Cambian a propósito cómo se ven
los campos, la pastilla verde y el foco en todos los módulos que suban de versión.** La galería
contra la 0.5.0 marca solo eso: 42 de 46 capturas distintas, porque hay campos en casi todas.

- **Pastilla «verde»**: token nuevo `verde-700` (`#4D6502`) y el Badge `tone="verde"` con
  `text-verde-700` (5,3:1 sobre `verde-100`; antes `verde-600`, 4,16:1).
- **Campos** (`Input`, `Select` y los campos del paquete: confirmación con motivo, Mejoras,
  mensajes, orden de `DataTable` en el celular, selector de la guía): borde `neutro-500`
  (`#909090`, 3,2:1; antes `line`, 1,4:1) y texto de ayuda `neutro-700` (4,35:1; antes
  `neutro-300`, 2,45:1). Tarjetas y tablas siguen con `line`.
- **Foco**: `brand-ring` pasa a `rojo-400` (`#DE5353`, 3,8:1; antes `#E67E7E`, 2,75:1) y el
  del botón destructivo a `ring-rojo-400`. En Distribución, `amarillo-700` (`#B37605`, 3,8:1;
  antes `#FBCA6F`, 1,5:1).
- **Alias nuevo `brand-line`**: el contorno del Badge «marca», con el valor de antes
  (`#E67E7E`; `#FBCA6F` en Distribución), así esa pastilla no cambia. `brand-ring` queda solo
  para el foco: un módulo que lo use como borde decorativo pasa a `brand-line`.
- `npm test`: 3 pruebas nuevas de contraste (53 en total).

## 0.5.0 — 29/10/2026

Sin cambios visibles en los módulos (la galería da las mismas 46 capturas que la 0.4.0, en
Tailwind v3 y v4, escritorio y celular). Para la submarca de Enersol Distribución:

- Alias de marca `brand-on`, `brand-hover`, `brand-text`, `brand-ring`, `brand-soft` y
  `brand-badge` en el preset y en `theme.css`, con los valores de siempre; los componentes los usan
  (Button, Input, Select, Badge «marca», AppHeader, MobileMenu, AppsMenu, Pagination, DataTable,
  ConfirmDialog, Guia, MessagesBell, Sugerencia).
- `AppHeader`: `indicador` («texto» | «subrayado»), `mostrarApps` y `mostrarNombre`.
- `Logo`: variantes `bloque-color` y `bloque-negativo`.
- `tailwind-preset-distribucion.cjs` y `theme-distribucion.css` (amarillo solar + grafito).
- `galeria/`: comparación píxel a píxel entre la última etiqueta y el árbol de trabajo.
- `npm test`: 12 pruebas nuevas (50 en total).

## 0.4.0 — 29/10/2026

Aditivo (nada de lo anterior cambia). Piezas que cada módulo tenía copiadas y divergentes:

- `MessagesBell`: sobre de mensajes del Hub, configurable con `api` (`get`/`post` del módulo),
  `prefijo` (`/msg` en el Hub, `/mensajes` o `/api/mensajes` en los módulos), `pollMs`,
  `enMenu` (fila del menú ☰) y `pantallaCompletaHasta` (`sm`/`lg`). Unifica lo mejor de las
  copias: pantalla completa en el celular con título, «Cerrar» y safe-area; Escape cierra;
  evento `enersol:abrir-mensajes`; links de menciones filtrados; sondeo en pausa con la
  pestaña oculta y sin consultas superpuestas; error visible si un mensaje no se pudo enviar.
- `SugerenciaBoton` (`variante: "boton" | "menu"`) y `SugerenciaModal` con `onEnviar(payload)`;
  `validarSugerencia` (mínimo 5 letras, PNG/JPG/WEBP, 4 MB).
- `GuiaBoton` (`variante: "icono" | "menu"`) y `GuiaPanel`: guías de datos (`pasos` con
  `**negritas**`) y con `render()`, varias por ruta (`pestanas` o `todas`), `match(path)`,
  `porDefecto`, `filtrar`, `ocultarEn`, enlace a la guía completa, modo controlado. Funciones
  puras `guiasPorRuta`, `normalizarRuta`, `rutaEmpieza`, `partirNegritas`, `conNegritas`.
- `instalarReporteErrores({ enviar, app, … })` y `crearReporteErrores`: errores de pantalla a
  `/api/salud/error-pantalla` de cada módulo, una vez por error y ruta.
- `destinoSeguro(next, origenesPermitidos)`, `rutaInterna`, `safeHref`: destino seguro del SSO
  y links que vienen de la base.
- `iniciarSondeo` / `useSondeo`: el polling que usa el sobre, reutilizable.
- `npm test`: 23 pruebas nuevas (38 en total).

Cambio de texto: el agradecimiento de Mejoras dice «le llega al equipo por correo» (antes
nombraba a una persona); cada módulo puede pasar su texto con `textoGracias`.

## 0.3.0 — 16/10/2026

`AppHeader`, `ConfirmDialog` + `useConfirm`, `Pagination` + `paginationRange`; `npm test`.

## 0.2.x — 03/10/2026

Celular: táctil de 44 px, `Modal` como hoja, `DataTable` en tarjetas, `MobileMenu`.
`AppsMenu`: Cuotas en su dominio propio.

## 0.1.x

Tokens (preset de Tailwind y `theme.css`) y primitivos del sistema Enersol 2026.
