import { test, expect } from '@playwright/test';

test.describe('Component Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render all main components', async ({ page }) => {
    // Check for main layout components
    const baseLayout = page.locator('body');
    await expect(baseLayout).toBeAttached();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');

    // Check for hero and header content instead of the retired navigation shell
    const siteHeader = page.locator('.site-header');
    await expect(siteHeader).toHaveCount(1);

    const heroSection = page.locator('section.hero');
    await expect(heroSection).toHaveCount(1);

    const mainElement = page.locator('main');
    await expect(mainElement).toHaveCount(1);

    const mainSections = page.locator('main section');
    await expect(mainSections.first()).toBeAttached();
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
    // Toggle the theme switcher
    const themeToggle = page.locator('button.toggle');
    if ((await themeToggle.count()) > 0) {
      const initialTheme = await page.evaluate(
        () => document.documentElement.dataset.theme ?? 'light',
      );
      await themeToggle.first().click();
      await expect
        .poll(async () =>
          page.evaluate(
            () => document.documentElement.dataset.theme ?? 'light',
          ),
        )
        .not.toBe(initialTheme);
    }

    // Interact with hero CTA links if present
    const heroCta = page.locator('.hero__cta').first();
    if ((await heroCta.count()) > 0) {
      await heroCta.click();
      await page.waitForTimeout(100);
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
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for main landmark structure
    const main = page.locator('main');
    const mainCount = await main.count();
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
    const nonCriticalPatterns = [
      /favicon/i,
      /404/,
      /net::ERR_/,
      /Failed to load resource: the server responded with a status of 403/,
      /dynamically imported module/,
      /Importing a module script failed/,
      /ThemeToggle/,
    ];

    const criticalErrors = errors.filter(
      (error) => !nonCriticalPatterns.some((pattern) => pattern.test(error)),
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
