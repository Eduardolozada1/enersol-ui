/**
 * Preset de Tailwind de Enersol Distribución (submarca: amarillo solar + grafito; decisión de
 * Gerencia del 29/10/2026). Extiende el preset base y pisa SOLO los alias de marca: neutros,
 * semánticos (ámbar, verde, rojo), tipografías, radios y sombras quedan como en el resto del
 * ecosistema, y los componentes del paquete toman el amarillo sin cambiar.
 *
 *   import preset from "@enersol/ui/tailwind-preset-distribucion";
 *   export default { presets: [preset], content: [..., "./node_modules/@enersol/ui/dist/**\/*.js"] };
 *
 * Reglas de la marca (Guía UX/UI de Distribución): el amarillo nunca lleva texto blanco ni va
 * como texto sobre blanco (1,9:1). El botón principal es amarillo con texto grafito
 * (`text-brand-on`, 6,1:1) y el texto «de marca» sobre blanco es `brand-fg` (#865904, 6,1:1).
 */
const base = require("./tailwind-preset.cjs");

const amarillo = {
  50: "#FEF7E9",
  100: "#FEEFD3",
  200: "#FDDFA7",
  300: "#FBCA6F",
  400: "#FABA43",
  500: "#F9AE22",
  600: "#E99A06",
  700: "#B37605",
  800: "#865904",
  900: "#593B02",
};

module.exports = {
  presets: [base],
  theme: {
    extend: {
      colors: {
        // pisa el amarillo «gas» de Proyectos solo en Distribución
        amarillo: { ...amarillo, DEFAULT: "#F9AE22" },
        grafito: "#373A3C",
        acero: "#646D73", // texto secundario sobre blanco (5,3:1), íconos
        brand: {
          DEFAULT: "#F9AE22",
          on: "#373A3C",
          hover: "#E99A06",
          fg: "#865904",
          text: "#373A3C", // el acento del ítem activo es el subrayado amarillo (AppHeader indicador="subrayado")
          ring: "#FBCA6F",
          soft: "#FEF7E9",
          badge: "#865904",
          strong: "#593B02",
        },
        ink: "#373A3C",
      },
    },
  },
};
