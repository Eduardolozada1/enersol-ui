# Galería de @enersol/ui

Página con todos los componentes del paquete y los estados que dependen del color de marca:
botones (también en hover), pastillas, campos con foco, tarjetas, tabla con una fila enfocada,
paginación, encabezado con «Más», Apps y el menú ☰, mensajes y chat, confirmación, modal, guía y
Mejoras. No se publica con el paquete (`files` de package.json).

```bash
cd galeria && npm ci && node comparar.mjs              # contra la última etiqueta
node comparar.mjs --antes v0.4.0                       # contra otra
```

`comparar.mjs` compila el paquete, toma `dist/`, el preset y `theme.css` de la etiqueta y del
árbol de trabajo, arma la galería con Tailwind v3 (preset: Operaciones, Hub, Marketing, Cuotas) y
con Tailwind v4 (`theme.css`: Proyectos, Contabilidad), la captura en escritorio (1440 px) y en
celular (390 px, táctil) y compara cada par píxel a píxel. Sale con código 1 si alguna difiere.

Chromium no siempre suaviza igual algunos bordes redondeados (el anillo de foco de un textarea:
hasta 6 px entre dos capturas de la misma versión). Cuando un par difiere, se vuelve a capturar
cada lado hasta 4 veces y cuenta como igual si alguna captura de un lado coincide exacto con
alguna del otro; el resumen dice cuánto ruido se midió.

También dibuja la galería con la marca de Enersol Distribución (preset y theme de la división,
`AppHeader` con `indicador="subrayado"`, sin Apps y sin el nombre al lado del logo), solo para
mirar: `salida/distribucion-v3/` y `salida/distribucion-v4/`.

Los logos de `brand/` son los archivos públicos de cada marca (Enersol desde Operaciones y
Distribución desde el paquete de marca de Gerencia).
