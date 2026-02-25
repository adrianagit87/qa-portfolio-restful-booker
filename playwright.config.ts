import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://automationintesting.online',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        // No browser needed for API tests
        baseURL: 'https://automationintesting.online',
      },
    },
  ],
});
