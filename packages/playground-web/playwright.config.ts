/**
 * Playwright Configuration
 * SPEC-PLAYGROUND-001 Milestone 7: Integration Testing
 * SPEC-DEPLOY-001: CI/CD에서 chromium만 사용하여 실행 시간 단축
 */

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // CI에서는 chromium만 실행 (시간 절약)
    // 로컬 개발 시 모든 브라우저 테스트 가능
    ...(!process.env.CI
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
          /* Mobile viewports */
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
          },
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
        ]
      : []),
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
