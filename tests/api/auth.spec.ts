import { test, expect } from '@playwright/test';
import { ADMIN_CREDENTIALS, INVALID_CREDENTIALS } from '../../fixtures/test-data';

test.describe('POST /api/auth/login — Authentication', () => {
  test('valid credentials → 200 and token returned', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: ADMIN_CREDENTIALS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('wrong password → 401 (or connection rejected)', async ({ request }) => {
    // The platform returns 401 for invalid credentials.
    // Some Cloudflare configurations close the connection before the response
    // is fully received by Playwright, which surfaces as ECONNRESET.
    // Both outcomes confirm the request was rejected — the test accepts either.
    try {
      const response = await request.post('/api/auth/login', {
        data: INVALID_CREDENTIALS,
      });
      expect(response.status()).toBe(401);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      expect(message).toMatch(/ECONNRESET|connection/i);
    }
  });

  test('empty body → error (non-200)', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {},
    });

    expect(response.status()).not.toBe(200);
  });
});
