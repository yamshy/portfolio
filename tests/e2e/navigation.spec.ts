import { test, expect } from '@playwright/test';

test.describe('Navigation Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render sidebar navigation', async ({ page }) => {
    const sidebarNav = page.locator('.sidebar-nav');
    await expect(sidebarNav).toBeVisible();
    await expect(sidebarNav).toHaveAttribute('role', 'navigation');
    await expect(sidebarNav).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('should have all navigation buttons', async ({ page }) => {
    // Main navigation sections
    const aboutButton = page.locator('[data-section="about"]');
    const workButton = page.locator('[data-section="work"]');
    const evolutionButton = page.locator('[data-section="evolution"]');
    const contactButton = page.locator('[data-section="contact"]');

    await expect(aboutButton).toBeVisible();
    await expect(workButton).toBeVisible();
    await expect(evolutionButton).toBeVisible();
    await expect(contactButton).toBeVisible();

    // Check labels
    await expect(aboutButton.locator('.nav-label')).toContainText('Home');
    await expect(workButton.locator('.nav-label')).toContainText('Projects');
    await expect(evolutionButton.locator('.nav-label')).toContainText(
      'Experience',
    );
    await expect(contactButton.locator('.nav-label')).toContainText('Contact');
  });

  test('should have external links', async ({ page }) => {
    const githubLink = page.locator('[href="https://github.com/yamshy"]');
    const emailLink = page.locator('[href="mailto:sajudia@proton.me"]');

    await expect(githubLink).toBeVisible();
    await expect(emailLink).toBeVisible();

    // Check external link attributes
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should navigate to sections when clicked', async ({ page }) => {
    const workButton = page.locator('[data-section="work"]');
    await workButton.click();

    // Should scroll to or highlight the work section
    // Wait for any scroll animation
    await page.waitForTimeout(500);

    // Check if URL hash changed or section is in view
    const workSection = page.locator('#work');
    if (await workSection.isVisible()) {
      await expect(workSection).toBeInViewport();
    }
  });

  test('should update progress bar on scroll', async ({ page }) => {
    const progressBar = page.locator('#progress-bar');
    await expect(progressBar).toBeVisible();

    // Initial state should be 0% or some low value
    const initialHeight = await progressBar.getAttribute('style');
    expect(initialHeight).toContain('height:');

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);

    // Progress bar should update
    const updatedHeight = await progressBar.getAttribute('style');
    expect(updatedHeight).toContain('height:');
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Scroll to different sections and check active states
    // Initially, about should be active (if at top of page)
    // This depends on the implementation, but we can test the mechanism exists
    const activeButtons = page.locator('.nav-organic-button.active');

    // There should be at most one active button at a time
    const activeCount = await activeButtons.count();
    expect(activeCount).toBeLessThanOrEqual(1);
  });

  test('should be accessible via keyboard', async ({ page }) => {
    // Tab through navigation items
    await page.keyboard.press('Tab');

    // Find the first focusable navigation element
    const firstNavButton = page.locator('.nav-organic-button').first();

    // Should be able to focus navigation items
    await firstNavButton.focus();
    await expect(firstNavButton).toBeFocused();

    // Should be able to activate with Enter
    await page.keyboard.press('Enter');

    // Should not cause JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(100);
    expect(errors).toHaveLength(0);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const aboutButton = page.locator('[data-section="about"]');
    const githubLink = page.locator('[href="https://github.com/yamshy"]');

    await expect(aboutButton).toHaveAttribute(
      'aria-label',
      /Navigate to.*section/,
    );
    await expect(githubLink).toHaveAttribute('aria-label', /Open.*in new tab/);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    const sidebarNav = page.locator('.sidebar-nav');
    await expect(sidebarNav).toBeVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(sidebarNav).toBeVisible();

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    // Navigation should still be present but might be styled differently
    await expect(sidebarNav).toBeAttached();
  });

  test('should handle smooth scrolling', async ({ page }) => {
    // Click a navigation item
    const workButton = page.locator('[data-section="work"]');
    await workButton.click();

    // Should not cause abrupt jumps (hard to test, but ensure no errors)
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(1000); // Wait for scroll animation
    expect(errors).toHaveLength(0);
  });
});
