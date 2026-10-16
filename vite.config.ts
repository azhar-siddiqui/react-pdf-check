import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [analyzer(), react(), tailwindcss()],
  build: {
    minify: true,
    cssMinify: true,

    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("@react-pdf/renderer") ||
            id.includes("yoga-layout")
          ) {
            return "pdf-generator-engine";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
