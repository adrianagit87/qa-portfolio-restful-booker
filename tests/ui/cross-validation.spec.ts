import { test, expect } from '@playwright/test';
import { getAuthToken, createBooking, deleteBooking, createRoom, deleteRoom } from '../../helpers/api.helpers';
import { VALID_BOOKING } from '../../fixtures/test-data';

/**
 * Validación cruzada UI vs API
 * Verifica consistencia entre lo que retorna la API y lo que refleja la UI.
 * Requiere browser (Chromium) — se ejecuta con: npm run test:ui o npm test
 */

test.describe('Cross-validation — UI vs API consistency', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('CROSS-001 · booking created via UI flow appears in API', async ({ request, page }) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 3500);
    const checkin  = baseDate.toISOString().split('T')[0];
    baseDate.setDate(baseDate.getDate() + 4);
    const checkout = baseDate.toISOString().split('T')[0];

    // Create booking via UI
    await page.goto(`/reservation/1?checkin=${checkin}&checkout=${checkout}`);
    await page.getByRole('button', { name: 'Reserve Now' }).first().click();
    await page.getByPlaceholder('Firstname').fill('CrossTest');
    await page.getByPlaceholder('Lastname').fill('UIvsAPI');
    await page.getByPlaceholder('Email').fill('cross@example.com');
    await page.getByPlaceholder('Phone').fill('01234567890');
    await page.getByRole('button', { name: 'Reserve Now' }).last().click();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible({ timeout: 10000 });

    // Verify booking appears in API
    const apiResponse = await request.get('/api/booking?roomid=1', {
      headers: { Cookie: `token=${token}` },
    });
    expect(apiResponse.status()).toBe(200);

    const body = await apiResponse.json();
    const found = body.bookings?.some(
      (b: { firstname: string; lastname: string }) =>
        b.firstname === 'CrossTest' && b.lastname === 'UIvsAPI'
    );
    expect(found).toBe(true);

    // Cleanup
    const booking = body.bookings?.find(
      (b: { firstname: string; bookingid: number }) => b.firstname === 'CrossTest'
    );
    if (booking) await deleteBooking(request, token, booking.bookingid).catch(() => {});
  });

  test('CROSS-002 · booking deleted via API disappears from admin UI', async ({ request, page }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      bookingdates: { checkin: '2027-03-01', checkout: '2027-03-05' },
    });
    const bookingId = booking['bookingid'] as number;

    // Delete via API
    await deleteBooking(request, token, bookingId);

    // Verify not visible in admin report
    await page.goto('/admin');
    await page.getByPlaceholder('Username').fill('admin');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/admin/rooms');
    await page.goto('/admin/report');

    await expect(page.locator(`text=${bookingId}`)).not.toBeVisible();
  });

  test('CROSS-003 · room created via API appears in admin UI', async ({ request, page }) => {
    const room = await createRoom(request, token);
    const roomId   = room['roomid']   as number;
    const roomName = room['roomName'] as string;

    // Verify in admin UI
    await page.goto('/admin');
    await page.getByPlaceholder('Username').fill('admin');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/admin/rooms');

    await expect(page.locator(`text=${roomName}`)).toBeVisible();

    // Cleanup
    await deleteRoom(request, token, roomId).catch(() => {});
  });

  test('CROSS-004 · room price from API matches price shown in UI', async ({ request, page }) => {
    const apiResponse = await request.get('/api/room');
    const body = await apiResponse.json();
    const room = body.rooms[0];

    expect(typeof room.roomPrice).toBe('number');
    expect(room.roomPrice).toBeGreaterThan(0);

    // Navigate to home and verify price is displayed
    await page.goto('/');
    await expect(page.locator(`text=£${room.roomPrice}`)).toBeVisible({ timeout: 8000 });
  });
});
