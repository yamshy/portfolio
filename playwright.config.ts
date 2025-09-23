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
    baseURL: 'http://127.0.0.1:4321',
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
    command: 'pnpm build && pnpm preview --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
