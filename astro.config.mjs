// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Estático puro: no hay adapter porque no hay nada que renderizar en servidor.
// Los sabores se resuelven en build (con fallback horneado) y se refrescan en
// cliente contra crm-app. Ver src/lib/carta.ts.
export default defineConfig({
  site: "https://www.trabixgranizados.xyz",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: { plugins: [tailwindcss()] },
});
