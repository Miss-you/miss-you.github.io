import { test, expect } from '@playwright/test';
import { encodeShare } from '../src/share';
import { defaultOptions } from '../src/normalize';

const route = '/en/tools/text-diff-preview/';
async function fill(page: import('@playwright/test').Page, a: string, b: string) {
  await page.locator('.cm-content').nth(0).fill(a);
  await page.locator('.cm-content').nth(1).fill(b);
}

test('Chinese character highlights, language routes, and theme preserve document state', async ({ page }) => {
  await page.goto('/tools/text-diff-preview/');
  await expect(page.locator('#preview-title')).toHaveText('文本对比 · 预览版');
  await expect(page.locator('[data-view=unified]')).toHaveText('单栏');
  await fill(page, '今天计划发布旧文章。', '今天计划发布新文章。');
  await expect(page.locator('.cm-changedText').first()).toHaveText('旧');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('.cm-content').nth(0)).toHaveText('今天计划发布旧文章。');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.site-language-link')).toHaveAttribute('href', '/en/tools/text-diff-preview/');
});

test('default input is not written to local text storage or history', async ({ page }) => {
  await page.goto(route);
  const marker = 'YDD private marker 261110';
  await fill(page, marker + ' A', marker + ' B');
  await page.waitForTimeout(4500); // upstream automatic history timer is four seconds
  const stores = await page.evaluate(async () => ({
    local: JSON.stringify(localStorage),
    dbs: await indexedDB.databases(),
  }));
  expect(stores.local).not.toContain(marker);
  // Reading the library may create an empty DB; verify that no text records were written.
  const records = await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    if (!dbs.some(d => d.name === 'ydd-text-compare')) return [];
    return await new Promise<unknown[]>((resolve, reject) => {
      const req = indexedDB.open('ydd-text-compare');
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('items', 'readonly');
        const read = tx.objectStore('items').getAll();
        read.onsuccess = () => { resolve(read.result); db.close(); };
      };
    });
  });
  expect(records).toHaveLength(0);
  await page.reload();
  await expect(page.locator('.cm-content').nth(0)).not.toContainText(marker);
  await expect(page.locator('.cm-content').nth(1)).not.toContainText(marker);
});

test('share links restore text locally and discard the fragment without external requests', async ({ page }) => {
  const requests: string[] = [], errors: string[] = [];
  page.on('request', r => requests.push(r.url()));
  page.on('pageerror', e => errors.push(e.message));
  const hash = encodeShare({ l: '<img src=x onerror=alert(1)>', r: '<script>bad()</script>', o: { ...defaultOptions, ignorePatterns: ['(a+)+$'] } });
  await page.goto(route + '#' + hash);
  await expect(page.locator('.cm-content').nth(0)).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.cm-content').nth(1)).toContainText('<script>bad()</script>');
  await expect(page).toHaveURL(/\/en\/tools\/text-diff-preview\/$/);
  expect(requests.every(u => u.startsWith('http://127.0.0.1:43871/'))).toBe(true);
  expect(requests.some(u => u.includes('onerror') || u.includes('bad()'))).toBe(false);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then(r => r.length))).toBe(0);
});

test('merge, undo, collapse and patch download work in the final host', async ({ page }) => {
  await page.goto(route);
  const unchanged = Array.from({ length: 30 }, (_, i) => 'unchanged ' + i).join('\n');
  await fill(page, 'old\n' + unchanged, 'new\n' + unchanged);
  await page.click('#options-btn');
  await page.check('#opt-collapse');
  await page.click('#options-btn');
  await expect(page.locator('.cm-collapsedLines').first()).toBeVisible();
  await page.locator('.revert-btn').first().click();
  await expect(page.locator('.cm-content').nth(1)).toContainText('old');
  await page.locator('.cm-content').nth(1).press('ControlOrMeta+z');
  await expect(page.locator('.cm-content').nth(1)).toContainText('new');
  await page.click('#export-btn');
  const pending = page.waitForEvent('download');
  await page.click('[data-action=download-patch]');
  const download = await pending;
  const patch = await (await download.createReadStream()).toArray().then(chunks => Buffer.concat(chunks).toString());
  expect(patch).toContain('-old');
  expect(patch).toContain('+new');
});

test('HTML report printing uses a local frame with escaped document content', async ({ page }) => {
  await page.addInitScript(() => { window.print = () => { document.documentElement.dataset.printRequested = 'true'; }; });
  await page.goto(route);
  await fill(page, '<img src=x onerror=alert(1)>', '<script>bad()</script>');
  await page.click('#export-btn');
  await page.click('[data-action=print]');
  const report = page.frameLocator('.print-frame');
  await expect(report.locator('html')).toHaveAttribute('data-print-requested', 'true');
  await expect(report.locator('body')).toContainText('<img src=x onerror=alert(1)>');
  await expect(report.locator('img')).toHaveCount(0);
  await expect(report.locator('script')).toHaveCount(0);
});

test('mobile uses unified view and keeps the document within viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/text-diff-preview/');
  await expect(page.locator('.cm-content')).toHaveCount(1);
  await page.locator('.cm-content').fill('中文长段落。'.repeat(100));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.click('#options-btn');
  await expect(page.locator('#opt-wrap')).toBeVisible();
  await page.click('#options-close');
  await expect(page.locator('#options-panel')).toBeHidden();
});

test('large Chinese input stays editable and preserves content through a view switch', async ({ page }) => {
  await page.goto(route);
  const original = '这是需要保持完整的中文段落。'.repeat(1500);
  const changed = original.replace('需要', '必须') + '\n新增内容。';
  await page.locator('.cm-content').nth(0).click();
  await page.keyboard.insertText(original);
  await page.locator('.cm-content').nth(1).click();
  await page.keyboard.insertText(changed);
  await page.click('[data-view=unified]', { timeout: 10000 });
  await page.click('[data-view=split]');
  // CodeMirror virtualizes off-screen DOM. Verify complete content through the
  // actual download action rather than mistaking its viewport for the document.
  for (const [side, expected] of [['a', original], ['b', changed]]) {
    await page.click('#export-btn');
    const pending = page.waitForEvent('download');
    await page.click(`[data-action=download-${side}]`);
    const file = await pending;
    const text = await (await file.createReadStream()).toArray().then(chunks => Buffer.concat(chunks).toString());
    expect(text).toBe(expected);
  }
  await page.click('#options-btn');
  await expect(page.locator('#options-panel')).toBeVisible();
});

test('local saving is explicit and reopens unchanged document data', async ({ page }) => {
  await page.goto('/tools/text-diff-preview/');
  await fill(page, 'Save 原始内容', 'Changed 修改内容');
  await page.click('#save-btn');
  const dialog = page.locator('dialog.modal-dialog');
  await dialog.locator('input[required]').fill('Original');
  await dialog.locator('button[type=submit]').click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await page.click('#library-btn');
  await expect(page.locator('#library')).toContainText('Original');
  await page.locator('#library .item-open').first().click();
  await expect(page.locator('.cm-content').nth(0)).toContainText('Save 原始内容');
  await expect(page.locator('.cm-content').nth(1)).toContainText('Changed 修改内容');
});

test('turning off reopening cancels a pending private-text save', async ({ page }) => {
  await page.goto(route);
  await fill(page, 'private original', 'private changed');
  await page.click('#options-btn');
  await page.check('#opt-remember');
  await page.uncheck('#opt-remember');
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => localStorage.getItem('ydd-text-compare:docs'))).toBeNull();
});


test('opting into history records and reopens the original document data', async ({ page }) => {
  await page.goto(route);
  await fill(page, 'history left Original', 'history right Changed');
  await page.click('#options-btn');
  await page.check('#opt-history');
  await page.click('#options-close');
  await page.waitForTimeout(4500);
  await page.reload();
  await page.click('#library-btn');
  await page.click('#library [data-tab=history]');
  await expect(page.locator('#library .item-open')).toHaveCount(1);
  await page.locator('#library .item-open').click();
  await expect(page.locator('.cm-content').nth(0)).toContainText('history left Original');
  await expect(page.locator('.cm-content').nth(1)).toContainText('history right Changed');
});

test('next and previous controls navigate separate changes', async ({ page }) => {
  await page.goto(route);
  const middle = Array.from({ length: 30 }, (_, i) => `same line ${i}`).join('\n');
  await fill(page, `old one\n${middle}\nold two`, `new one\n${middle}\nnew two`);
  await page.click('#next');
  await expect(page.locator('#position')).toHaveText('1 of 2');
  await page.click('#next');
  await expect(page.locator('#position')).toHaveText('2 of 2');
  await page.click('#prev');
  await expect(page.locator('#position')).toHaveText('1 of 2');
});

test('copy link creates a reusable URL for the current language route', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(route);
  await fill(page, 'share 原始文本', 'share 修改文本');
  await page.click('#share');
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain(route + '#v1:');
  await page.goto(link);
  await expect(page.locator('.cm-content').nth(0)).toContainText('share 原始文本');
  await expect(page.locator('.cm-content').nth(1)).toContainText('share 修改文本');
  await expect(page).toHaveURL(/\/en\/tools\/text-diff-preview\/$/);
});
