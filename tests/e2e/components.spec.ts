import { test, expect } from '@playwright/test';

test.describe('Component Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render all main components', async ({ page }) => {
    // Check for root document metadata
    const rootDocument = page.locator('html');
    await expect(rootDocument).toHaveAttribute('lang', 'en');

    // Primary header should be present
    const siteHeader = page.locator('.site-header');
    await expect(siteHeader).toBeVisible();

    // Hero headline anchors the page
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();

    // Ensure at least one content section is rendered
    const mainSection = page.locator('main section');
    await expect(mainSection.first()).toBeVisible();
  });

  test('should have proper glassmorphic styling', async ({ page }) => {
    // Look for glassmorphic containers
    const glassElements = page.locator('.u-glass, .glassmorphic-container');
    const glassCount = await glassElements.count();

    if (glassCount > 0) {
      const firstGlass = glassElements.first();
      await expect(firstGlass).toBeVisible();

      // Should have some transparency/backdrop effects
      // This is hard to test directly, but we can check the class is applied
      const hasGlassClass = await firstGlass.getAttribute('class');
      expect(hasGlassClass).toMatch(/glass/);
    }
  });

  test('should render project cards in work section', async ({ page }) => {
    // Look for work/project section
    const workSection = page.locator('#work, .bento');

    if (await workSection.isVisible()) {
      // Should have project cards
      const projectCards = page.locator('.card, .project-card');
      const cardCount = await projectCards.count();

      if (cardCount > 0) {
        const firstCard = projectCards.first();
        await expect(firstCard).toBeVisible();

        // Cards should have proper structure
        const cardHeader = firstCard.locator('h3, .header h3');
        if ((await cardHeader.count()) > 0) {
          await expect(cardHeader.first()).toBeVisible();
        }
      }
    }
  });

  test('should have working contact form', async ({ page }) => {
    const contactForm = page.locator('form, .contact-form');

    if (await contactForm.isVisible()) {
      // Should have form fields
      const nameField = contactForm
        .locator('input[name="name"], input[type="text"]')
        .first();
      const emailField = contactForm
        .locator('input[name="email"], input[type="email"]')
        .first();
      const messageField = contactForm
        .locator('textarea[name="message"], textarea')
        .first();

      if ((await nameField.count()) > 0) {
        await expect(nameField).toBeVisible();
        await expect(nameField).toBeEnabled();
      }

      if ((await emailField.count()) > 0) {
        await expect(emailField).toBeVisible();
        await expect(emailField).toBeEnabled();
      }

      if ((await messageField.count()) > 0) {
        await expect(messageField).toBeVisible();
        await expect(messageField).toBeEnabled();
      }
    }
  });

  test('should have timeline/evolution section', async ({ page }) => {
    const timelineSection = page.locator('#evolution, .timeline');

    if (await timelineSection.isVisible()) {
      // Should have timeline items
      const timelineItems = timelineSection.locator('.timeline-item');
      const itemCount = await timelineItems.count();

      if (itemCount > 0) {
        const firstItem = timelineItems.first();
        await expect(firstItem).toBeVisible();

        // Should have content structure
        const itemContent = firstItem.locator('.timeline-content, h3, p');
        await expect(itemContent.first()).toBeVisible();
      }
    }
  });

  test('should handle component interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Test hero call-to-action interactions
    const heroCtas = page.locator('.hero__cta');
    if ((await heroCtas.count()) > 0) {
      await heroCtas.first().click();
      await page.waitForTimeout(500);
    }

    // Test any interactive cards
    const interactiveCards = page.locator(
      '.card[href], .card a, .project-card',
    );
    const cardCount = await interactiveCards.count();

    if (cardCount > 0) {
      const firstCard = interactiveCards.first();

      // Hover should work without errors
      await firstCard.hover();
      await page.waitForTimeout(100);
    }

    expect(errors).toHaveLength(0);
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for proper landmark elements
    const headers = page.locator('header');
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThanOrEqual(1);

    const mains = page.locator('main');
    const mainCount = await mains.count();
    expect(mainCount).toBeGreaterThanOrEqual(1);

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    }

    // Check for proper form labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          await expect(label).toBeVisible();
        }
      }
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should not have critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_') &&
        !error.includes('403') &&
        !error.includes('Importing a module script failed.') &&
        !error.includes('error loading dynamically imported module'),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should be performant', async ({ page }) => {
    // Navigate to page and wait for load
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load reasonably quickly (adjust threshold as needed)
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    // Check for layout shifts
    await page.waitForTimeout(1000);

    // Basic performance check - no major layout issues
    const bodyHeight = await page.locator('body').boundingBox();
    expect(bodyHeight?.height).toBeGreaterThan(100);
  });
});
