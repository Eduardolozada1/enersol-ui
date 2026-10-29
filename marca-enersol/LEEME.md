# Archivos de marca Enersol (Identidad 2026)

Archivos oficiales en rojo plano `#D62828`, generados desde el Manual de Identidad Corporativa
Enersol · Edición 2026. Solo estáticos: no forman parte del paquete publicado (`files` de
`package.json`) hasta que se decida incluirlos.

| Carpeta | Para qué |
|---|---|
| `brand/` | Reemplazo directo de `frontend/public/brand/` de cada módulo. Mismos nombres y mismo margen interno que los archivos anteriores (el logo ocupa la misma altura en el encabezado). El componente `Logo` usa el `.svg` y cae al `.png`. |
| `favicon/` | `favicon.svg`, `favicon-32/48.png`, `apple-touch-icon-180.png`, `icon-192/512.png` e `icon-maskable-512.png` (zona segura del 80 %). En el `manifest`: `theme_color` `#FFFFFF`, `background_color` `#F6F5F6`. |
| `logos/` | Imagotipo (color, negativo, gris), isotipo (rojo, blanco), firma de marca y piezas del aniversario 40 años (firma y sello) en SVG, para la web y documentos. |

Reglas: usar los archivos tal cual (sin recolorear, estirar ni agregar efectos). Rojo nunca sobre
gris oscuro: ahí va la versión blanca. El sello y la firma 40 años se usan solo durante 2026 y nunca
en el encabezado de los módulos.
