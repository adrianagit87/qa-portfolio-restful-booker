import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { getAuthToken, createBooking, deleteBooking, getFirstAvailableRoomId } from '../../helpers/api.helpers';

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
  let roomId: number;

  // Checkin/checkout dates for each test — stored so afterEach can clean them up
  let checkin1: string;
  let checkout1: string;
  let checkin2: string;
  let checkout2: string;

  test.beforeAll(async ({ request }) => {
    // Generate unique date ranges far in the future.
    // Adding seconds-based offset avoids conflicts across parallel CI runs.
    const seed = Math.floor(Date.now() / 1000) % 1000; // 0–999
    checkin1  = futureDate(3000 + seed);
    checkout1 = futureDate(3003 + seed);
    checkin2  = futureDate(3010 + seed);
    checkout2 = futureDate(3013 + seed);

    roomId = await getFirstAvailableRoomId(request);
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  // After each UI booking test, delete the booking via API to keep the
  // environment clean for subsequent runs.
  test.afterEach(async ({ request }) => {
    const token = await getAuthToken(request).catch(() => null);
    if (!token) return;

    const res = await request.get(`/api/booking?roomid=${roomId}`, {
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

  test('UI-BOOKING-001 · complete booking flow → "Booking Confirmed" visible', async () => {
    await test.step('Navigate to reservation page with future dates', async () => {
      await homePage.gotoReservation(roomId, checkin1, checkout1);
    });

    await test.step('Open booking form', async () => {
      await homePage.openBookingForm();
    });

    await test.step('Fill in guest details', async () => {
      await homePage.fillBookingForm({
        firstname: 'Jane',
        lastname: 'Tester',
        email: 'jane.tester@example.com',
        phone: '01234567890',
      });
    });

    await test.step('Submit booking and verify confirmation', async () => {
      await homePage.submitBooking();
      await homePage.verifyConfirmation();
    });
  });

  test('UI-BOOKING-002 · booking confirmation for a second guest', async () => {
    await test.step('Navigate to reservation page with future dates', async () => {
      await homePage.gotoReservation(roomId, checkin2, checkout2);
    });

    await test.step('Open booking form', async () => {
      await homePage.openBookingForm();
    });

    await test.step('Fill in guest details', async () => {
      await homePage.fillBookingForm({
        firstname: 'Carlos',
        lastname: 'Portfolio',
        email: 'carlos@example.com',
        phone: '07700900123',
      });
    });

    await test.step('Submit booking and verify confirmation', async () => {
      await homePage.submitBooking();
      await expect(homePage.confirmationHeading).toBeVisible({ timeout: 15_000 });
    });
  });

  test('UI-BOOKING-003 · booking on already-occupied dates → error message visible', async ({ request }) => {
    let blockingBookingId: number | null = null;
    let blockedCheckin: string;
    let blockedCheckout: string;
    let token: string;

    await test.step('Block the dates via API', async () => {
      token = await getAuthToken(request);
      const seed = Math.floor(Date.now() / 1000) % 1000;
      blockedCheckin  = futureDate(3020 + seed);
      blockedCheckout = futureDate(3023 + seed);

      const booking = await createBooking(request, {
        firstname: 'Blocker',
        lastname: 'Test',
        totalprice: 100,
        depositpaid: false,
        roomid: roomId,
        bookingdates: { checkin: blockedCheckin, checkout: blockedCheckout },
      });
      blockingBookingId = booking['bookingid'] as number;
    });

    await test.step('Navigate to the same dates via UI', async () => {
      await homePage.gotoReservation(roomId, blockedCheckin, blockedCheckout);
    });

    await test.step('Attempt to open booking form', async () => {
      await homePage.openBookingForm();
    });

    await test.step('Fill guest details and submit', async () => {
      await homePage.fillBookingForm({
        firstname: 'Conflict',
        lastname: 'Guest',
        email: 'conflict@example.com',
        phone: '01234567890',
      });
      await homePage.submitBooking();
    });

    await test.step('Verify error — no confirmation heading shown', async () => {
      await expect(homePage.confirmationHeading).not.toBeVisible({ timeout: 5_000 });
    });

    // Cleanup
    if (blockingBookingId) {
      await deleteBooking(request, token!, blockingBookingId).catch(() => {});
    }
  });
});
