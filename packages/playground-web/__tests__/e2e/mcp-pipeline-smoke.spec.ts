import { test, expect } from '@playwright/test';
import { gotoAndAssertBrowserHealth } from './helpers/browser-health';

test.describe('MCP Pipeline Smoke', () => {
  test('@mcp should render the MCP integration guide', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/docs/mcp' });

    await expect(page).toHaveTitle(/MCP Integration \| framingui/i);
    await expect(page.getByRole('heading', { level: 1, name: /MCP Integration/i })).toBeVisible();
    await expect(page.getByText('npx @framingui/mcp-server init')).toBeVisible();
    await expect(page.getByText('list-themes')).toBeVisible();
    await expect(page.getByText('preview-theme')).toBeVisible();
  });

  test('@mcp should render the explore gallery entry points', async ({ page }) => {
    await gotoAndAssertBrowserHealth(page, { path: '/explore' });

    await expect(page).toHaveURL(/\/explore(?:\?.*)?$/);
    const templateCards = page.locator('.template-gallery article');
    await expect(templateCards.first()).toBeVisible();
    expect(await templateCards.count()).toBeGreaterThan(0);
  });
});
