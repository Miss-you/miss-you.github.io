import { test, expect } from '@playwright/test';

const route = '/en/tools/text-diff-preview/';
async function fill(page: import('@playwright/test').Page, a = '旧内容', b = '新内容') {
  const editors = page.locator('.cm-content');
  await editors.nth(0).fill(a);
  await editors.nth(1).fill(b);
}

test('view and comparison options preserve both independent undo histories', async ({ page }) => {
  await page.goto(route);
  await fill(page);
  await page.click('#options-btn');
  await page.check('input[name=gran][value=word]');
  await page.click('#options-btn');
  await page.click('[data-view=unified]');
  await page.click('[data-view=split]');
  const editors = page.locator('.cm-content');
  await expect(editors.nth(0)).toHaveText('旧内容');
  await expect(editors.nth(1)).toHaveText('新内容');
  await editors.nth(0).press('ControlOrMeta+z');
  await expect(editors.nth(0).locator('.cm-placeholder')).toBeVisible();
  await editors.nth(1).press('ControlOrMeta+z');
  await expect(editors.nth(1).locator('.cm-placeholder')).toBeVisible();
});

test('accepting a unified change can be undone after returning to split', async ({ page }) => {
  await page.goto(route);
  await fill(page);
  await page.click('[data-view=unified]');
  await page.locator('.cm-chunkButtons button').first().click();
  await page.click('[data-view=split]');
  const editors = page.locator('.cm-content');
  await expect(editors.nth(0)).toHaveText('新内容');
  await editors.nth(1).press('ControlOrMeta+z');
  await expect(editors.nth(0)).toHaveText('旧内容');
});

for (const undoView of ['split', 'unified']) {
  test(`undoing an accepted change in ${undoView} preserves later independent A edits`, async ({ page }) => {
    await page.goto(route);
    await fill(page, 'original line\nkeep', 'changed line\nkeep');
    await page.click('[data-view=unified]');
    await page.locator('.cm-chunkButtons button').first().click();
    await page.click('[data-view=split]');
    const a = page.locator('.cm-content').nth(0);
    await a.press('ControlOrMeta+End');
    await a.press('End');
    await page.keyboard.insertText('\nmy new note');
    if (undoView === 'unified') await page.click('[data-view=unified]');
    await page.locator('.cm-content').last().press('ControlOrMeta+z');
    if (undoView === 'unified') await page.click('[data-view=split]');
    await expect(page.locator('.cm-content').nth(0)).toContainText('original line');
    await expect(page.locator('.cm-content').nth(0)).toContainText('my new note');
    await page.locator('.cm-content').nth(1).press('ControlOrMeta+Shift+z');
    await expect(page.locator('.cm-content').nth(0)).toContainText('changed line');
    await expect(page.locator('.cm-content').nth(0)).toContainText('my new note');
  });
}
