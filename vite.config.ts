import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite configuration
export default defineConfig(() => ({
  server: {
    host: "::",   // Allow external connections (IPv6 compatible)
    port: 8080,   // Development server port
  },
  plugins: [
    react(), // React + SWC plugin for fast builds
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Path alias for cleaner imports
    },
  },
}));
