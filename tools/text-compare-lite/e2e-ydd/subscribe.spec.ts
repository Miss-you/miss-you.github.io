import { expect, test } from '@playwright/test';

test('RSS navigation opens the localized subscription page and copies each feed URL', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  for (const locale of [
    { home: '/', heading: 'RSS 订阅', label: '复制地址', copied: '已复制地址', feeds: ['中文博客', '英文博客', '一千零一夜'] },
    { home: '/en/', heading: 'RSS subscriptions', label: 'Copy URL', copied: 'URL copied', feeds: ['Chinese blog', 'English blog', '1001 Nights'] },
  ]) {
    await page.goto(locale.home);
    await page.locator('#site-menu').getByRole('link', { name: 'RSS', exact: true }).click();
    await expect(page).toHaveURL(locale.home + 'subscribe/');
    await expect(page.getByRole('heading', { name: locale.heading })).toBeVisible();
    await expect(page.locator('#site-menu').getByRole('link', { name: 'RSS', exact: true })).toHaveAttribute('aria-current', 'page');

    for (const [index, path] of ['index.xml', 'en/index.xml', 'stories/index.xml'].entries()) {
      const url = 'https://yousali.com/' + path;
      const heading = page.getByRole('heading', { name: locale.feeds[index], exact: true });
      const row = page.getByRole('listitem').filter({ has: heading });
      await expect(row.getByRole('link', { name: url, exact: true })).toHaveAttribute('href', url);
      await row.getByRole('button', { name: locale.label, exact: false }).click();
      await expect(row.getByRole('status')).toHaveText(locale.copied);
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(url);
    }
  }
});

test('a blocked clipboard leaves the feed address selected for manual copying', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new DOMException('Clipboard blocked', 'NotAllowedError')) },
    });
  });
  await page.goto('/subscribe/');
  const heading = page.getByRole('heading', { name: '一千零一夜', exact: true });
  const row = page.getByRole('listitem').filter({ has: heading });
  await row.getByRole('button', { name: '复制地址', exact: false }).click();
  await expect(row.getByRole('status')).toContainText('请手动复制');
  await expect(row.getByRole('link')).toBeFocused();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('https://yousali.com/stories/index.xml');
});
