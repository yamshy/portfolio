import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero content and site navigation', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();

    await expect(page.locator('.hero__title')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Collaborate' })).toBeVisible();

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
    await expect(
      page.getByRole('link', { name: 'Read research-style case study →' }),
    ).toBeVisible();

    await expect(page.getByTestId('ic50-visualizer')).toBeVisible();
    await expect(
      page.getByRole('region', { name: 'Infrastructure health' }),
    ).toBeVisible();
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
      page.getByRole('heading', {
        name: 'Operating principles for reproducible, scalable science',
      }),
    ).toBeVisible();

    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Let’s design infrastructure that keeps pace with discovery',
      }),
    ).toBeVisible();
  });

  test('persists theme preference across reloads', async ({ page }) => {
    const html = page.locator('html');
    const initialTheme = (await html.getAttribute('data-theme')) ?? 'light';

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
