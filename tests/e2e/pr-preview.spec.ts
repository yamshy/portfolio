import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const shouldCapture = process.env.PREVIEW_SCREENSHOT === 'true';
const defaultPath = 'test-results/previews/pr-home.jpg';

test.describe('pr preview screenshot', () => {
  test.skip(!shouldCapture, 'Preview screenshot generation runs only in CI');

  test('captures the homepage preview', async ({ page }) => {
    const screenshotTarget = process.env.PREVIEW_SCREENSHOT_PATH ?? defaultPath;
    const absolutePath = resolve(screenshotTarget);
    mkdirSync(dirname(absolutePath), { recursive: true });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();

    const buffer = await page.screenshot({
      path: absolutePath,
      fullPage: true,
      type: 'jpeg',
      quality: 80,
    });

    test.info().attach('preview-screenshot', {
      body: buffer,
      contentType: 'image/jpeg',
    });
  });
});
