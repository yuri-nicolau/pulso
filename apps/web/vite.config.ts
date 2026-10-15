import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Stable libraries get their own long-cached chunks; pages are split by route.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "tanstack", test: /node_modules[\\/]@tanstack[\\/]/ },
            {
              name: "motion",
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    // Local API (apps/api); production calls VITE_API_URL directly.
    proxy: {
      "/api": { target: process.env.API_PROXY_TARGET ?? "http://localhost:3000" },
    },
  },
});
