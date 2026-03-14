import { test, expect } from '@playwright/test';

test.describe('MCP Pipeline Smoke', () => {
  test('@mcp should render the MCP integration guide', async ({ page }) => {
    await page.goto('/docs/mcp', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { level: 1, name: 'MCP Integration' })).toBeVisible();
    await expect(page.getByText('npx @framingui/mcp-server init')).toBeVisible();
    await expect(page.getByText('list-themes')).toBeVisible();
    await expect(page.getByText('preview-theme')).toBeVisible();
  });

  test('@mcp should render the explore gallery entry points', async ({ page }) => {
    await page.goto('/explore', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 3, name: /Square Minimalism/i })).toBeVisible({
      timeout: 15000,
    });

    const templateCards = page.locator('main article');
    await expect(templateCards.first()).toBeVisible({ timeout: 15000 });
    await expect(templateCards).toHaveCount(8);
  });
});
