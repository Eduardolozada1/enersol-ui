import { defineConfig } from "tsup";

// El dist se COMMITEA: los módulos instalan este paquete como dependencia de git fijada a
// una etiqueta (sin registro npm ni tokens), así que tiene que venir compilado.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: false,
  target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  treeshake: true,
});
