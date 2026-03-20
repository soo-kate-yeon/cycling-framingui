import { test, expect } from '@playwright/test';

test.describe('MCP Pipeline Smoke', () => {
  test('@mcp should render the MCP integration guide', async ({ page }) => {
    await page.goto('/docs/mcp', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toContainText('MCP Integration', { timeout: 30000 });
    await expect(page.locator('body')).toContainText('npx @framingui/mcp-server init', {
      timeout: 30000,
    });
    await expect(page.locator('body')).toContainText('list-themes', { timeout: 30000 });
    await expect(page.locator('body')).toContainText('preview-theme', { timeout: 30000 });
  });

  test('@mcp should render the homepage theme gallery entry points', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const templateCards = page.locator('main article');
    await expect(page.locator('body')).toContainText('Square Minimalism', { timeout: 30000 });
    await expect(templateCards).toHaveCount(8, { timeout: 30000 });
  });
});
