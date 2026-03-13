import { expect, type Page, type Response } from '@playwright/test';

const NEXT_ERROR_TEXT =
  /Application error|Internal Server Error|Unhandled Runtime Error|This page could not be found/i;

interface BrowserHealthOptions {
  path: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
}

export async function gotoAndAssertBrowserHealth(
  page: Page,
  { path, waitUntil = 'domcontentloaded' }: BrowserHealthOptions
): Promise<Response> {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });

  const response = await page.goto(path, { waitUntil });
  expect(response, `missing response for ${path}`).not.toBeNull();
  expect(response?.ok(), `unexpected status for ${path}: ${response?.status()}`).toBeTruthy();

  await expect(page.locator('body')).toBeVisible();
  await expect(page.getByText(NEXT_ERROR_TEXT).first()).toHaveCount(0);

  const cssHealth = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const visibleContentNodes = Array.from(document.body.querySelectorAll('*')).filter(
      (element) => {
        const rect = element.getBoundingClientRect();
        const styles = getComputedStyle(element);

        return (
          rect.width > 0 &&
          rect.height > 0 &&
          styles.display !== 'none' &&
          styles.visibility !== 'hidden'
        );
      }
    ).length;

    return {
      styleSheetCount: document.styleSheets.length,
      bodyBackgroundColor: getComputedStyle(document.body).backgroundColor,
      rootBackgroundToken: rootStyles.getPropertyValue('--background').trim(),
      visibleContentNodes,
    };
  });

  expect(cssHealth.styleSheetCount, `no stylesheets loaded for ${path}`).toBeGreaterThan(0);
  expect(cssHealth.bodyBackgroundColor, `body background missing for ${path}`).not.toBe(
    'rgba(0, 0, 0, 0)'
  );
  expect(cssHealth.rootBackgroundToken, `missing root background token for ${path}`).not.toBe('');
  expect(
    cssHealth.visibleContentNodes,
    `no visible content nodes found for ${path}`
  ).toBeGreaterThan(0);
  expect(pageErrors, `page errors captured for ${path}`).toEqual([]);

  return response as Response;
}
