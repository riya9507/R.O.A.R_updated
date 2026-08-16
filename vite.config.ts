import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Renderer build. base: "./" is required so Electron can load the built
// index.html via file:// with no internet connection.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: { outDir: "dist" },
});
