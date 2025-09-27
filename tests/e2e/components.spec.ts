import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero content and site navigation', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const header = page.locator('.site-header');
    await expect(header).toHaveAttribute('data-js', 'site-header');

    const navigation = page.getByRole('navigation', {
      name: 'Primary navigation',
    });
    const navToggle = page.locator('[data-js="nav-toggle"]');

    if (await navToggle.isVisible()) {
      await navToggle.click();
      await expect(navigation).toBeVisible();
    } else {
      await expect(navigation).toBeVisible();
    }

    const navLabels = [
      'Overview',
      'Experience',
      'Projects',
      'Interactive Lab',
      'Skills',
      'Contact',
    ];

    for (const label of navLabels) {
      await expect(navigation.getByRole('link', { name: label })).toBeVisible();
    }

    await expect(page.locator('.hero__title')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Collaborate' })).toBeVisible();
    const seeMoreLink = page.getByRole('link', { name: 'See more' });
    await expect(seeMoreLink).toBeVisible();
    await expect(seeMoreLink).toHaveAttribute('href', '#experience');

    await expect(page.locator('.hero__metric')).toHaveCount(3);
  });

  test('supports toggling primary navigation on small screens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.reload();

    const toggle = page.getByRole('button', { name: /navigation menu/i });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    const navigation = page.getByRole('navigation', {
      name: 'Primary navigation',
    });
    await expect(navigation).not.toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName(/close navigation menu/i);
    await expect(navigation).toBeVisible();

    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName(/open navigation menu/i);
    await expect(navigation).not.toBeVisible();
  });

  test('displays featured projects and interactive modules', async ({
    page,
  }) => {
    const projectsSection = page.locator('#projects');
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();

    await expect(page.locator('.projects__grid .project-card')).toHaveCount(3);
    const sourceLinks = projectsSection.getByRole('link', {
      name: 'Source code →',
    });
    await expect(sourceLinks).toHaveCount(3);
    for (const index of [0, 1, 2]) {
      await expect(sourceLinks.nth(index)).toBeVisible();
    }

    const insightsSection = page.locator('#insights');
    await insightsSection.scrollIntoViewIfNeeded();
    await expect(insightsSection).toBeVisible();

    const workbench = page.getByRole('region', {
      name: 'Sequence analysis tool',
    });
    await expect(workbench).toBeVisible();
    await expect(
      workbench.getByRole('heading', { name: 'Sequence Workbench' }),
    ).toBeVisible();
    await expect(workbench.getByLabel('DNA Sequence')).toBeVisible();
  });

  test('highlights skills, experience, and contact sections', async ({
    page,
  }) => {
    const skills = page.locator('#skills');
    await skills.scrollIntoViewIfNeeded();
    await expect(skills).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Capabilities organised/i }),
    ).toBeVisible();

    const experience = page.locator('#experience');
    await experience.scrollIntoViewIfNeeded();
    await expect(experience).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Career progression from research to technical operations leadership/i,
      }),
    ).toBeVisible();

    const insights = page.locator('#insights');
    await insights.scrollIntoViewIfNeeded();
    await expect(insights).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Interactive Lab' }),
    ).toBeVisible();

    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Scale your genomics infrastructure with scientific context/i,
      }),
    ).toBeVisible();
  });

  test('persists theme preference across reloads', async ({ page }) => {
    const html = page.locator('html');
    const initialTheme = (await html.getAttribute('data-theme')) ?? 'light';

    const navToggle = page.locator('[data-js="nav-toggle"]');
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
