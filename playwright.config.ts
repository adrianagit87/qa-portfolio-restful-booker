import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config(); // loads .env if present; no-op if file doesn't exist

const BASE_URL = process.env['BASE_URL'] ?? 'https://automationintesting.online';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: BASE_URL,
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
      use: { baseURL: BASE_URL },
    },
  ],
});
