import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  testDir: 'e2e-ydd', workers: 2, timeout: 30_000,
  use: { channel: process.env.PLAYWRIGHT_CHANNEL, baseURL: 'http://127.0.0.1:43871', viewport: { width: 1440, height: 1000 } },
  webServer: {
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    command: 'node scripts/build-text-compare.mjs && hugo --minify --buildFuture && python3 -m http.server 43871 --bind 127.0.0.1 --directory public',
    url: 'http://127.0.0.1:43871/en/tools/text-diff-preview/', reuseExistingServer: false, timeout: 120_000,
  },
});
