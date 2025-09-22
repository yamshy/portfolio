import { defineConfig, devices } from '@playwright/test';

const colorSchemePreference =
  process.env.PLAYWRIGHT_COLOR_SCHEME === 'light' ||
  process.env.PLAYWRIGHT_COLOR_SCHEME === 'dark'
    ? process.env.PLAYWRIGHT_COLOR_SCHEME
    : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['dot']] : [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    colorScheme: colorSchemePreference,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm preview --host 0.0.0.0 --port 4321',
    port: 4321,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
