import { test, expect } from '@playwright/test';

test.describe('Adaptive NGS case study', () => {
  test('surfaces hero metrics and interactive visualisations', async ({
    page,
  }) => {
    await page.goto('/case-studies/adaptive-ngs');

    await expect(
      page.getByRole('heading', { name: 'Adaptive NGS Orchestrator' }),
    ).toBeVisible();
    await expect(page.locator('.case-study__metrics div')).toHaveCount(3);

    await page.locator('#results').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('ic50-visualizer')).toBeVisible();

    await page.locator('#operations').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('region', { name: 'Infrastructure health' }),
    ).toBeVisible();
  });

  test('navigates to the case study from the home page hero CTA', async ({
    page,
  }) => {
    await page.goto('/');

    const caseStudyLink = page.getByRole('link', {
      name: 'View flagship case study',
    });
    await expect(caseStudyLink).toBeVisible();
    await caseStudyLink.click();

    await expect(page).toHaveURL(/\/case-studies\/adaptive-ngs/);
    await expect(
      page.getByRole('heading', { name: 'Adaptive NGS Orchestrator' }),
    ).toBeVisible();
  });
});
