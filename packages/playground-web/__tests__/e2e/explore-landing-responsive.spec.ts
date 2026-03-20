import { test, expect } from '@playwright/test';

const TEMPLATE_ROUTE = '/explore/template/bold-line';

test.describe('Template Landing Responsive Smoke', () => {
  test('@smoke should render the template landing page on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(TEMPLATE_ROUTE);

    await expect(page.getByRole('heading', { level: 1, name: /Bold Line/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Documentation|Guide/i })).toBeVisible();

    const screenshots = page.locator('img[alt*="Bold Line screenshot"]');
    await expect(screenshots.first()).toBeVisible();
  });

  test('@smoke should render the template landing page on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TEMPLATE_ROUTE);

    await expect(page.getByRole('heading', { level: 1, name: /Bold Line/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Documentation|Guide/i })).toBeVisible();

    const featureHeadings = page.locator('h2');
    await expect(featureHeadings.filter({ hasText: /Features/i }).first()).toBeVisible();
  });

  test('@smoke should render the homepage theme gallery', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const templateCards = page.locator('main article');
    await expect(page.locator('body')).toContainText('Square Minimalism', { timeout: 30000 });
    await expect(templateCards).toHaveCount(8, { timeout: 30000 });
  });
});
