/**
 * Preset de Tailwind del sistema de diseño Enersol 2026 — tokens OFICIALES del Manual de
 * Identidad, UNA sola vez para todos los módulos.
 *
 * Uso en cada módulo (tailwind.config.js):
 *   import preset from "@enersol/ui/tailwind-preset";
 *   export default {
 *     presets: [preset],
 *     content: ["./index.html", "./src/**\/*.{ts,tsx,js,jsx}", "./node_modules/@enersol/ui/dist/**\/*.js"],
 *   };
 *
 * Proporción cromática: 60% blanco / 30% neutros / 10% rojo. El rojo manda pero no satura.
 * Semántica (regla de Eduardo 2026-08-18): verde = OK/completado, ámbar = precaución/en
 * curso, rojo = solo error o la única acción primaria. El verde también es el acento ESG.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Escala roja (tintes y sombras derivados del #D62828 oficial · Pantone 1795 C)
        rojo: {
          50: "#FBEAEA",
          100: "#F7D4D4",
          200: "#EFA9A9",
          300: "#E67E7E",
          400: "#DE5353",
          500: "#D62828",
          600: "#AB2020",
          700: "#801818",
          800: "#561010",
          900: "#2B0808",
        },
        // Neutros (gris claro #D6D3D6 y gris oscuro #494C4A oficiales)
        neutro: {
          white: "#FFFFFF",
          50: "#F6F5F6",
          100: "#ECEAEC",
          200: "#D6D3D6",
          300: "#A6A5A6",
          500: "#909090",
          700: "#797979",
          900: "#494C4A",
        },
        // Ámbar · SEMÁNTICO: precaución / atención / pendiente
        ambar: {
          100: "#FEF3C7",
          300: "#FCD34D",
          500: "#F59E0B",
          700: "#B45309",
        },
        // Verde · ESG / sostenibilidad + semántico OK/completado (Pantone 377 C)
        verde: {
          100: "#E2E9CC",
          300: "#A9BE67",
          500: "#709302",
          600: "#5A7602",
        },
        // Amarillo Enersol (escenario "gas" en Proyectos)
        amarillo: { DEFAULT: "#FFC02E" },
        // Alias semánticos (lo que se usa en la UI)
        brand: { DEFAULT: "#D62828", fg: "#AB2020", strong: "#801818" },
        ink: "#494C4A", // texto principal
        subtle: "#5F6260", // texto secundario (6.2:1 sobre blanco · WCAG AA)
        line: "#DDDBDD", // bordes / divisores (visibles, no fantasmas)
        surface: "#FFFFFF",
        canvas: "#F6F5F6", // fondo de app
      },
      fontFamily: {
        // Sora: títulos y display. Roboto: cuerpo de texto.
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["39px", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["31px", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["25px", { lineHeight: "1.25", fontWeight: "600" }],
        h4: ["20px", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["16px", { lineHeight: "1.5" }],
        caption: ["13px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        card: "12px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(73,76,74,0.06), 0 1px 3px rgba(73,76,74,0.10)",
      },
    },
  },
};
