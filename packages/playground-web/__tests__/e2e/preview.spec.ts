import { test, expect } from '@playwright/test';
import { gotoAndAssertBrowserHealth } from './helpers/browser-health';

test.describe('Preview and Documentation Smoke', () => {
  test('@smoke should render the homepage with framingui metadata', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/' });

    await expect(page).toHaveTitle(/framingui/i);
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('@smoke should render the docs installation page', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/docs/installation' });

    await expect(page).toHaveTitle(/Installation \| framingui/i);
    await expect(page.getByRole('heading', { level: 1, name: 'Installation' })).toBeVisible();
    await expect(page.getByText('npx @framingui/mcp-server init')).toBeVisible();
  });

  test('@smoke should render the login page', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/auth/login' });

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with GitHub/i })).toBeVisible();
  });

  test('@smoke should render the docs landing page', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/docs' });

    await expect(page).toHaveTitle(/Documentation \| framingui/i);
    await expect(
      page.getByRole('heading', { level: 1, name: /framingui Documentation/i })
    ).toBeVisible();
  });
});
