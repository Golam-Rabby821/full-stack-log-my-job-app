import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react-hook-form",
      "@hookform/resolvers/zod",
      "zod",
      "@dnd-kit/core",
      "@dnd-kit/utilities",
      "recharts",
      "cmdk",
      "@tanstack/react-query",
    ],
  },
}));
