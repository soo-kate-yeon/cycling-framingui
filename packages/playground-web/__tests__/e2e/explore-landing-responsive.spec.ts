import { test, expect } from '@playwright/test';
import { gotoAndAssertBrowserHealth } from './helpers/browser-health';

const TEMPLATE_ROUTE = '/explore/template/bold-line';

test.describe('Template Landing Responsive Smoke', () => {
  test('@smoke should render the template landing page on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoAndAssertBrowserHealth(page, { path: TEMPLATE_ROUTE });

    await expect(page).toHaveURL(/\/explore\/template\/bold-line(?:\?.*)?$/);
    await expect(page.getByRole('heading', { level: 1, name: /Bold Line/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Documentation|Guide/i })).toBeVisible();

    const screenshots = page.locator('img[alt*="Bold Line screenshot"]');
    await expect(screenshots.first()).toBeVisible();
  });

  test('@smoke should render the template landing page on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoAndAssertBrowserHealth(page, { path: TEMPLATE_ROUTE });

    await expect(page).toHaveURL(/\/explore\/template\/bold-line(?:\?.*)?$/);
    await expect(page.getByRole('heading', { level: 1, name: /Bold Line/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Documentation|Guide/i })).toBeVisible();

    const featureHeadings = page.locator('h2');
    await expect(featureHeadings.filter({ hasText: /Features/i }).first()).toBeVisible();
  });

  test('@smoke should render the explore gallery', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/explore' });

    await expect(page).toHaveURL(/\/explore(?:\?.*)?$/);
    const templateCards = page.locator('.template-gallery article');
    await expect(templateCards.first()).toBeVisible();
    expect(await templateCards.count()).toBeGreaterThan(0);
  });
});
