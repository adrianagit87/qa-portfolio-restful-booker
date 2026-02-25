import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { getAuthToken, deleteBooking } from '../../helpers/api.helpers';

/**
 * Generates a future date string (YYYY-MM-DD) offset by `daysFromNow`.
 * Using large offsets (3000+ days) ensures the dates are unlikely to be
 * already booked in this shared test environment.
 */
function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

test.describe('Booking widget — UI tests', () => {
  let homePage: HomePage;

  // Checkin/checkout dates for each test — stored so afterEach can clean them up
  let checkin1: string;
  let checkout1: string;
  let checkin2: string;
  let checkout2: string;

  test.beforeAll(() => {
    // Generate unique date ranges far in the future.
    // Adding seconds-based offset avoids conflicts across parallel CI runs.
    const seed = Math.floor(Date.now() / 1000) % 1000; // 0–999
    checkin1  = futureDate(3000 + seed);
    checkout1 = futureDate(3003 + seed);
    checkin2  = futureDate(3010 + seed);
    checkout2 = futureDate(3013 + seed);
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  // After each UI booking test, delete the booking via API to keep the
  // environment clean for subsequent runs.
  test.afterEach(async ({ request }) => {
    const token = await getAuthToken(request).catch(() => null);
    if (!token) return;

    // Fetch bookings for room 1 and delete any that match our test dates
    const res = await request.get('/api/booking?roomid=1', {
      headers: { Cookie: `token=${token}` },
    }).catch(() => null);
    if (!res?.ok()) return;

    const body = await res.json() as { bookings: Array<{ bookingid: number; bookingdates: { checkin: string; checkout: string } }> };
    const testDates = [
      { checkin: checkin1, checkout: checkout1 },
      { checkin: checkin2, checkout: checkout2 },
    ];

    for (const booking of body.bookings) {
      const isTestBooking = testDates.some(
        d => d.checkin === booking.bookingdates?.checkin &&
             d.checkout === booking.bookingdates?.checkout
      );
      if (isTestBooking) {
        await deleteBooking(request, token, booking.bookingid).catch(() => {/* already gone */});
      }
    }
  });

  test('complete booking flow → "Booking Confirmed" heading visible', async () => {
    await homePage.gotoReservation(1, checkin1, checkout1);
    await homePage.openBookingForm();
    await homePage.fillBookingForm({
      firstname: 'Jane',
      lastname: 'Tester',
      email: 'jane.tester@example.com',
      phone: '01234567890',
    });
    await homePage.submitBooking();
    await homePage.verifyConfirmation();
  });

  test('booking confirmation shows "Booking Confirmed" for a different guest', async () => {
    await homePage.gotoReservation(1, checkin2, checkout2);
    await homePage.openBookingForm();
    await homePage.fillBookingForm({
      firstname: 'Carlos',
      lastname: 'Portfolio',
      email: 'carlos@example.com',
      phone: '07700900123',
    });
    await homePage.submitBooking();
    await expect(homePage.confirmationHeading).toBeVisible({ timeout: 15_000 });
  });
});
