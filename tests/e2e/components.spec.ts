import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero content and site navigation', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const header = page.getByTestId('site-header');
    await expect(header).toBeAttached();
    await expect(header).toHaveClass(/site-header/);
    await expect(header).toHaveAttribute('data-js', 'site-header');

    const navigation = page.getByTestId('primary-navigation');
    const navToggle = page.getByTestId('primary-nav-toggle');

    if (await navToggle.isVisible()) {
      await navToggle.click();
      await expect(navigation).toBeVisible();
    } else {
      await expect(navigation).toBeVisible();
    }

    const navLinkIds = [
      'overview',
      'experience',
      'projects',
      'skills',
      'contact',
    ];

    for (const id of navLinkIds) {
      await expect(page.getByTestId(`primary-nav-link-${id}`)).toBeVisible();
    }

    await expect(page.getByTestId('hero-title')).toBeVisible();
    await expect(page.getByTestId('hero-cta')).toBeVisible();
    const seeMoreLink = page.getByTestId('hero-see-more');
    await expect(seeMoreLink).toBeVisible();
    await expect(seeMoreLink).toHaveAttribute('href', '#experience');

    await expect(page.getByTestId('hero-metric')).toHaveCount(3);
  });

  test('supports toggling primary navigation on small screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.reload();

    const toggle = page.getByTestId('primary-nav-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    const navigation = page.getByTestId('primary-navigation');
    await expect(navigation).not.toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName(/close navigation menu/i);
    await expect(navigation).toBeVisible();

    await page.getByTestId('primary-nav-link-projects').click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName(/open navigation menu/i);
    await expect(navigation).not.toBeVisible();
  });

  test('closes primary navigation when tapping outside on small screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.reload();

    const toggle = page.getByTestId('primary-nav-toggle');
    const navigation = page.getByTestId('primary-navigation');
    const pageMain = page.getByTestId('page-main');

    await expect(toggle).toBeVisible();
    await expect(navigation).not.toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(navigation).toBeVisible();

    await pageMain.click({ position: { x: 10, y: 10 } });

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(navigation).toBeHidden();
  });

  test('displays featured projects', async ({ page }) => {
    const projectsSection = page.getByTestId('projects-section');
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();

    await expect(
      page.getByTestId('projects-grid').getByTestId('project-card'),
    ).toHaveCount(3);
    const sourceLinks = page.getByTestId('project-source-link');
    await expect(sourceLinks).toHaveCount(3);
    for (const index of [0, 1, 2]) {
      await expect(sourceLinks.nth(index)).toBeVisible();
    }
  });

  test('highlights skills, experience, and contact sections', async ({
    page,
  }) => {
    const skills = page.getByTestId('skills-section');
    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toBeVisible();
    await expect(page.getByTestId('skills-header')).toBeVisible();

    const experience = page.getByTestId('experience-section');
    await experience.scrollIntoViewIfNeeded();
    await expect(experience).toBeVisible();
    await expect(page.getByTestId('experience-header')).toBeVisible();

    const contact = page.getByTestId('contact-section');
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    await expect(page.getByTestId('contact-heading')).toBeVisible();
    await expect(page.getByTestId('contact-card')).toBeVisible();
  });

  test('persists theme preference across reloads', async ({ page }) => {
    const html = page.locator('html');
    const initialTheme = (await html.getAttribute('data-theme')) ?? 'light';

    const navToggle = page.getByTestId('primary-nav-toggle');
    if (await navToggle.isVisible()) {
      await navToggle.click();
    }

    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
    await expect(html).toHaveAttribute('data-theme', expectedTheme);

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('portfolio-theme'),
    );
    expect(storedTheme).toBe(expectedTheme);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', expectedTheme);
    if (await navToggle.isVisible()) {
      await navToggle.click();
    }
    await expect(
      page.getByRole('button', {
        name: new RegExp(`Switch to ${initialTheme} mode`, 'i'),
      }),
    ).toBeVisible();
  });

  test('has no critical console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

  test('passes automated accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules('scrollable-region-focusable')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
