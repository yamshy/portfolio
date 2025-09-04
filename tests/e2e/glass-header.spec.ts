import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Sticky Glass Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('maintains visibility and backdrop blur during scroll', async ({ page }) => {
    const header = page.getByRole('banner');
    
    // Verify header is visible initially
    await expect(header).toBeVisible();
    
    // Check initial backdrop-filter (if supported)
    const initialBackdropFilter = await header.evaluate(
      el => getComputedStyle(el).backdropFilter
    );
    
    // Scroll down significantly
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(100); // Allow for smooth scrolling
    
    // Header should still be visible
    await expect(header).toBeVisible();
    
    // Backdrop filter should still be applied
    const scrolledBackdropFilter = await header.evaluate(
      el => getComputedStyle(el).backdropFilter
    );
    
    // In browsers that support backdrop-filter, it should contain 'blur'
    if (initialBackdropFilter !== 'none') {
      expect(scrolledBackdropFilter).toContain('blur');
    }
  });

  test('smooth scroll navigation works correctly', async ({ page }) => {
    // Test navigation to different sections
    const navLinks = [
      { text: 'Experience', targetId: '#evolution' },
      { text: 'Projects', targetId: '#projects' },
      { text: 'Contact', targetId: '#contact' }
    ];

    for (const link of navLinks) {
      await page.getByRole('link', { name: new RegExp(link.text, 'i') }).click();
      
      // Wait for smooth scroll to complete
      await page.waitForFunction((targetId) => {
        const element = document.querySelector(targetId);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 150; // Account for sticky header height
      }, link.targetId);
      
      // Verify the section is in viewport
      const targetSection = page.locator(link.targetId);
      await expect(targetSection).toBeInViewport();
    }
  });

  test('keyboard navigation works properly', async ({ page }) => {
    // Focus first navigation link
    await page.keyboard.press('Tab');
    const firstLink = page.getByRole('link', { name: /home/i });
    await expect(firstLink).toBeFocused();
    
    // Navigate through all links with Tab
    const navLinks = ['Experience', 'Projects', 'Contact'];
    
    for (const linkText of navLinks) {
      await page.keyboard.press('Tab');
      const link = page.getByRole('link', { name: new RegExp(linkText, 'i') });
      await expect(link).toBeFocused();
    }
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    
    // Should navigate to the contact section
    await page.waitForFunction(() => {
      const contactSection = document.querySelector('#contact');
      if (!contactSection) return false;
      const rect = contactSection.getBoundingClientRect();
      return rect.top <= 150;
    });
  });

  test('has proper ARIA attributes and roles', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    
    const navList = page.getByRole('list');
    await expect(navList).toBeVisible();
    
    // Check all navigation links have proper aria-labels
    const navLinks = page.getByRole('link');
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('Navigate to');
    }
  });

  test('passes accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('header[role="banner"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('adapts to reduced motion preferences', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    const navLink = page.getByRole('link', { name: /home/i });
    
    // In reduced motion mode, transitions should be disabled
    const transitionDuration = await navLink.evaluate(
      el => getComputedStyle(el).transitionDuration
    );
    
    // Should be '0s' or very short duration
    expect(parseFloat(transitionDuration)).toBeLessThan(0.1);
  });

  test('provides backdrop-filter fallback', async ({ page }) => {
    // Test fallback by checking computed styles
    const header = page.getByRole('banner');
    
    const backdropSupported = await page.evaluate(() => {
      return CSS.supports('backdrop-filter', 'blur(12px)');
    });
    
    if (!backdropSupported) {
      // Should have fallback background
      const backgroundColor = await header.evaluate(
        el => getComputedStyle(el).backgroundColor
      );
      
      // Should not be transparent
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('transparent');
    }
  });

  test('maintains contrast in high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    await page.reload();
    
    const navLinks = page.getByRole('link');
    const linkCount = await navLinks.count();
    
    // All links should remain visible and accessible
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      
      // Should have visible focus indicator
      await link.focus();
      const outlineWidth = await link.evaluate(
        el => getComputedStyle(el).outlineWidth
      );
      expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
    }
  });

  test('responsive behavior on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    
    // Navigation should still be accessible
    const navLinks = page.getByRole('link');
    const linkCount = await navLinks.count();
    expect(linkCount).toBe(4);
    
    // Links should be properly sized for touch
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const box = await link.boundingBox();
      
      // Minimum touch target size (44px)
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('visual regression - header appearance', async ({ page }) => {
    const header = page.getByRole('banner');
    
    // Take screenshot of header in initial state
    await expect(header).toHaveScreenshot('glass-header-initial.png');
    
    // Scroll and take another screenshot
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    await expect(header).toHaveScreenshot('glass-header-scrolled.png');
  });
});
