# Cambios de @enersol/ui

Cada versión se publica con su etiqueta (`vX.Y.Z`); los módulos la adoptan subiendo la
etiqueta en su `package.json`. Detalle y ejemplos de uso en el README.

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
