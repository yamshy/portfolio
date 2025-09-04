import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Professional Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('keyboard navigation through timeline phases', async ({ page }) => {
    // Navigate to timeline section
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForFunction(() => {
      const evolutionSection = document.querySelector('#evolution');
      const rect = evolutionSection?.getBoundingClientRect();
      return rect && rect.top <= 150;
    });

    // Focus first timeline phase
    const firstPhase = page.getByRole('button').first();
    await firstPhase.focus();
    await expect(firstPhase).toBeFocused();
    
    // Test Enter key activation
    await firstPhase.press('Enter');
    
    // Verify expansion
    const isExpanded = await firstPhase.getAttribute('aria-expanded');
    expect(isExpanded).toBe('true');
    
    // Find corresponding details section
    const controlsId = await firstPhase.getAttribute('aria-controls');
    const detailsSection = page.locator(`#${controlsId}`);
    const isHidden = await detailsSection.getAttribute('aria-hidden');
    expect(isHidden).toBe('false');
    
    // Test collapse with Escape
    await page.keyboard.press('Escape');
    
    // All phases should be collapsed after Escape
    const allTriggers = page.getByRole('button', { name: /2019|2021|2022|2024/ });
    const triggerCount = await allTriggers.count();
    
    for (let i = 0; i < triggerCount; i++) {
      const trigger = allTriggers.nth(i);
      const expanded = await trigger.getAttribute('aria-expanded');
      expect(expanded).toBe('false');
    }
  });

  test('arrow key navigation between phases', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    const phases = page.getByRole('button', { name: /2019|2021|2022|2024/ });
    const phaseCount = await phases.count();
    
    // Focus first phase
    await phases.first().focus();
    await expect(phases.first()).toBeFocused();
    
    // Navigate down with ArrowDown
    await page.keyboard.press('ArrowDown');
    await expect(phases.nth(1)).toBeFocused();
    
    // Navigate up with ArrowUp
    await page.keyboard.press('ArrowUp');
    await expect(phases.first()).toBeFocused();
    
    // Test Home key
    await phases.nth(2).focus();
    await page.keyboard.press('Home');
    await expect(phases.first()).toBeFocused();
    
    // Test End key
    await page.keyboard.press('End');
    await expect(phases.nth(phaseCount - 1)).toBeFocused();
  });

  test('expand/collapse functionality works correctly', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    const firstPhase = page.getByRole('button').first();
    
    // Initial state should be collapsed
    let expanded = await firstPhase.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
    
    // Click to expand
    await firstPhase.click();
    
    // Should now be expanded
    expanded = await firstPhase.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
    
    // Verify details are visible
    const controlsId = await firstPhase.getAttribute('aria-controls');
    const detailsSection = page.locator(`#${controlsId}`);
    await expect(detailsSection).toBeVisible();
    
    // Click again to collapse
    await firstPhase.click();
    
    // Should be collapsed again
    expanded = await firstPhase.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
  });

  test('displays all timeline phases with correct content', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Check that all expected phases are present
    const expectedPhases = [
      'Biology Research Associate',
      'Computational Integration', 
      'Technical Leadership',
      'Infrastructure & Data Engineering'
    ];

    for (const phaseTitle of expectedPhases) {
      await expect(page.getByRole('heading', { name: phaseTitle })).toBeVisible();
    }

    // Check time periods are displayed
    const expectedPeriods = ['2019-2021', '2021-2022', '2022-2024', '2024+'];
    
    for (const period of expectedPeriods) {
      await expect(page.getByText(period)).toBeVisible();
    }

    // Check current role badge
    await expect(page.getByText('Current')).toBeVisible();
  });

  test('skill tags are displayed when phase is expanded', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    const firstPhase = page.getByRole('button').first();
    await firstPhase.click();
    
    // Wait for expansion animation
    await page.waitForTimeout(300);
    
    // Check that skills are displayed
    const skillsSection = page.getByText('Key Skills & Technologies');
    await expect(skillsSection).toBeVisible();
    
    // Check for specific skills
    await expect(page.getByText('Molecular Biology')).toBeVisible();
    await expect(page.getByText('Research')).toBeVisible();
  });

  test('external links have proper attributes', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Expand a phase that has external links
    const lastPhase = page.getByRole('button').last();
    await lastPhase.click();
    await page.waitForTimeout(300);

    // Find external links
    const externalLinks = page.locator('a[target="_blank"]');
    const linkCount = await externalLinks.count();
    
    if (linkCount > 0) {
      const firstExternalLink = externalLinks.first();
      
      // Should have target="_blank"
      const target = await firstExternalLink.getAttribute('target');
      expect(target).toBe('_blank');
      
      // Should have rel="noopener noreferrer"
      const rel = await firstExternalLink.getAttribute('rel');
      expect(rel).toBe('noopener noreferrer');
      
      // Should have external icon
      const externalIcon = firstExternalLink.locator('.external-icon');
      await expect(externalIcon).toBeVisible();
    }
  });

  test('timeline is accessible to screen readers', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Check main timeline structure
    const timelineSection = page.locator('#evolution');
    await expect(timelineSection).toBeVisible();
    
    // Check ordered list structure
    const timelineList = page.getByRole('list');
    await expect(timelineList).toBeVisible();
    
    // Check that all phases are properly marked up as buttons
    const phaseButtons = page.getByRole('button');
    const buttonCount = await phaseButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Each button should have proper ARIA attributes
    for (let i = 0; i < buttonCount; i++) {
      const button = phaseButtons.nth(i);
      
      const ariaExpanded = await button.getAttribute('aria-expanded');
      expect(ariaExpanded).toBeTruthy();
      
      const ariaControls = await button.getAttribute('aria-controls');
      expect(ariaControls).toBeTruthy();
    }
  });

  test('passes accessibility audit', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#evolution')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('adapts to reduced motion preferences', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    const firstPhase = page.getByRole('button').first();
    
    // In reduced motion mode, transitions should be minimal or disabled
    const transitionDuration = await firstPhase.evaluate(
      el => getComputedStyle(el).transitionDuration
    );
    
    // Should be '0s' or very short duration
    const duration = parseFloat(transitionDuration);
    expect(duration).toBeLessThan(0.1);
  });

  test('responsive behavior on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Timeline should be visible on mobile
    const timeline = page.locator('#evolution');
    await expect(timeline).toBeVisible();
    
    // Phase buttons should be touch-friendly
    const phaseButtons = page.getByRole('button');
    const buttonCount = await phaseButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = phaseButtons.nth(i);
      const box = await button.boundingBox();
      
      // Minimum touch target size (44px)
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    
    // Timeline markers should be positioned correctly for mobile
    const markers = page.locator('.timeline-marker');
    const markerCount = await markers.count();
    
    if (markerCount > 0) {
      const firstMarker = markers.first();
      const markerBox = await firstMarker.boundingBox();
      
      // On mobile, markers should be positioned on the left
      expect(markerBox?.x).toBeLessThan(100);
    }
  });

  test('theme colors are applied correctly', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Check that timeline items have theme data attributes
    const timelineItems = page.locator('.timeline-item');
    const itemCount = await timelineItems.count();
    
    for (let i = 0; i < itemCount; i++) {
      const item = timelineItems.nth(i);
      const theme = await item.getAttribute('data-theme');
      
      expect(theme).toBeTruthy();
      expect(['coral', 'mocha', 'blue', 'yellow']).toContain(theme);
    }
  });

  test('scroll-based animations trigger correctly', async ({ page }) => {
    // Only test if motion is not reduced
    const prefersReducedMotion = await page.evaluate(() => 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    if (!prefersReducedMotion) {
      // Scroll to timeline section
      await page.getByRole('link', { name: /experience/i }).click();
      
      // Wait for scroll and potential animations
      await page.waitForTimeout(1000);
      
      // Timeline items should be visible after scrolling
      const timelineItems = page.locator('.timeline-item');
      const itemCount = await timelineItems.count();
      
      for (let i = 0; i < itemCount; i++) {
        const item = timelineItems.nth(i);
        await expect(item).toBeVisible();
      }
    }
  });

  test('visual regression - timeline appearance', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(1000);

    const timelineSection = page.locator('#evolution');
    
    // Take screenshot of collapsed timeline
    await expect(timelineSection).toHaveScreenshot('timeline-collapsed.png');
    
    // Expand first phase and take another screenshot
    const firstPhase = page.getByRole('button').first();
    await firstPhase.click();
    await page.waitForTimeout(500);
    
    await expect(timelineSection).toHaveScreenshot('timeline-expanded.png');
  });

  test('print styles work correctly', async ({ page }) => {
    await page.getByRole('link', { name: /experience/i }).click();
    await page.waitForTimeout(500);

    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    // In print mode, all details should be expanded
    const timelineSection = page.locator('#evolution');
    await expect(timelineSection).toBeVisible();
    
    // Timeline line and markers should be hidden in print
    const timelineLine = page.locator('.timeline-line');
    const isLineVisible = await timelineLine.isVisible();
    
    // In print mode, decorative elements should be hidden
    expect(isLineVisible).toBe(false);
  });
});
