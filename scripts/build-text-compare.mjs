/** Build the vendored app once for both Hugo language routes. No remote assets. */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from '../tools/text-compare-lite/node_modules/vite/dist/node/index.js';

const repo = fileURLToPath(new URL('../', import.meta.url));
const app = path.join(repo, 'tools/text-compare-lite');
const output = path.join(repo, 'static/assets/text-compare');
const partials = path.join(repo, 'layouts/partials/generated/text-compare');
await build({
  configFile: false, root: app, base: '/assets/text-compare/', publicDir: false,
  build: { outDir: output, emptyOutDir: true, target: 'es2022', manifest: true, chunkSizeWarningLimit: 1600 },
});
const built = await readFile(path.join(output, 'index.html'), 'utf8');
const body = built.match(/<body>([\s\S]*)<\/body>/)?.[1];
if (!body || !body.includes('id="editor"')) throw new Error('Missing complete application markup');
const manifest = JSON.parse(await readFile(path.join(output, '.vite/manifest.json'), 'utf8'));
const entry = manifest['index.html'];
const integrity = async (file) => 'sha384-' + createHash('sha384').update(await readFile(path.join(output, file))).digest('base64');
const tags = [];
for (const file of entry.css ?? []) tags.push(`<link rel="stylesheet" href="/assets/text-compare/${file}" integrity="${await integrity(file)}" crossorigin="anonymous">`);
tags.push(`<script type="module" src="/assets/text-compare/${entry.file}" integrity="${await integrity(entry.file)}" crossorigin="anonymous"></script>`);
await mkdir(partials, { recursive: true });
await writeFile(path.join(partials, 'assets.html'), tags.join('\n'));
await writeFile(path.join(partials, 'app.html'), body);
// Publish license texts alongside the distributed runtime, including fonts.
const lock = JSON.parse(await readFile(path.join(app, 'package-lock.json'), 'utf8'));
const notices = ['YDD text comparison preview — third-party license texts\n'];
for (const [location, info] of Object.entries(lock.packages)) {
  if (!location || info.dev) continue;
  const dir = path.join(app, location);
  let files;
  try { files = await readdir(dir); } catch { continue; } // uninstalled platform optional
  const licenses = files.filter(name => /^(licen[sc]e|copying|ofl)(\.|$)/i.test(name));
  const metadata = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
  notices.push(`\n--- ${metadata.name} ${metadata.version} (${info.license ?? 'see text'}) ---\n`);
  for (const name of licenses) notices.push(await readFile(path.join(dir, name), 'utf8'));
}
await writeFile(path.join(output, 'third-party-notices.txt'), notices.join('\n'));
await copyFile(path.join(app, 'src/icon.svg'), path.join(output, 'icon.svg'));
await rm(path.join(output, 'index.html'));
await rm(path.join(output, '.vite'), { recursive: true });
console.log('Built text-compare-lite assets and Hugo markup.');
