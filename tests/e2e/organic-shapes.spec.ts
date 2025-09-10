import { test, expect } from '@playwright/test';

test.describe('OrganicShapes Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render organic shapes container', async ({ page }) => {
    const organicShapes = page.locator('.organic-shapes');
    await expect(organicShapes).toBeVisible();
    await expect(organicShapes).toHaveAttribute('aria-hidden', 'true');
  });

  test('should render all blob elements', async ({ page }) => {
    // Wait for the organic shapes to be loaded
    await page.waitForSelector('.organic-shapes');

    // Check that all 13 blobs are present
    const blobs = page.locator('.blob');
    await expect(blobs).toHaveCount(13);

    // Check specific blob classes
    await expect(page.locator('.b0')).toBeVisible();
    await expect(page.locator('.b1')).toBeVisible();
    await expect(page.locator('.b12')).toBeVisible();
  });

  test('should render SVG connections', async ({ page }) => {
    const svg = page.locator('svg.connections');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('width', '100%');
    await expect(svg).toHaveAttribute('height', '100%');

    // Check for connection elements
    const linksGroup = page.locator('g.links');
    await expect(linksGroup).toBeVisible();
    await expect(linksGroup).toHaveAttribute('aria-hidden', 'true');
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    // Check that animations are disabled
    const connections = page.locator('.connections');
    await expect(connections).toHaveCSS('opacity', /0\.22/);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const organicShapes = page.locator('.organic-shapes');
    await expect(organicShapes).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(organicShapes).toBeVisible();

    // On very small screens, organic shapes should be hidden
    await page.setViewportSize({ width: 320, height: 568 });
    // The component should still exist but might be hidden via CSS
    await expect(organicShapes).toBeAttached();
  });

  test('should not interfere with page interactions', async ({ page }) => {
    // Organic shapes should have pointer-events: none
    const organicShapes = page.locator('.organic-shapes');
    await expect(organicShapes).toHaveCSS('pointer-events', 'none');

    // Should not block clicks on other elements
    const navButton = page.locator('.nav-organic-button').first();
    if (await navButton.isVisible()) {
      await expect(navButton).toBeEnabled();
    }
  });

  test('should handle page resize gracefully', async ({ page }) => {
    // Start with desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForSelector('.organic-shapes');

    // Resize to mobile
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wait a bit for resize handling
    await page.waitForTimeout(200);

    // Should still be visible and functional
    const organicShapes = page.locator('.organic-shapes');
    await expect(organicShapes).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForSelector('.organic-shapes');

    // Should not have any JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test('should have proper z-index layering', async ({ page }) => {
    const organicShapes = page.locator('.organic-shapes');

    // Should have z-index: 0 (behind content)
    await expect(organicShapes).toHaveCSS('z-index', '0');

    // Should be positioned fixed
    await expect(organicShapes).toHaveCSS('position', 'fixed');
  });
});
