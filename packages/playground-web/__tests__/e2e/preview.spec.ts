import { test, expect } from '@playwright/test';

test.describe('Preview and Documentation Smoke', () => {
  test('@smoke should render the homepage with framingui metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/framingui/i);
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('@smoke should render the docs installation page', async ({ page }) => {
    await page.goto('/docs/installation');

    await expect(page).toHaveTitle(/Installation \| framingui/i);
    await expect(page.getByRole('heading', { level: 1, name: 'Installation' })).toBeVisible();
    await expect(page.getByText('npx @framingui/mcp-server init')).toBeVisible();
  });

  test('@smoke should render the login page', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with GitHub/i })).toBeVisible();
  });

  test('@smoke should render the docs landing page', async ({ page }) => {
    await page.goto('/docs');

    await expect(page).toHaveTitle(/Documentation \| framingui/i);
    await expect(
      page.getByRole('heading', { level: 1, name: /framingui Documentation/i })
    ).toBeVisible();
  });
});
