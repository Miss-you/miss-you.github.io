import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    // its own output folder, so running the tests never replaces the site served from dist/
    command: "npx vite build --outDir dist-e2e && npx vite preview --outDir dist-e2e --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
