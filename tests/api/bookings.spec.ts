import { test, expect } from '@playwright/test';
import { getAuthToken, createBooking, deleteBooking } from '../../helpers/api.helpers';
import { VALID_BOOKING, INVALID_BOOKING_DATES } from '../../fixtures/test-data';

test.describe('POST /api/booking — Create booking', () => {
  let token: string;
  const createdBookingIds: number[] = [];

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.afterEach(async ({ request }) => {
    for (const id of createdBookingIds) {
      await deleteBooking(request, token, id).catch(() => {/* already deleted */});
    }
    createdBookingIds.length = 0;
  });

  test('valid booking data → 201 and booking returned', async ({ request }) => {
    const response = await request.post('/api/booking', {
      data: VALID_BOOKING,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      bookingid: expect.any(Number),
      roomid: VALID_BOOKING.roomid,
      firstname: VALID_BOOKING.firstname,
      lastname: VALID_BOOKING.lastname,
    });

    createdBookingIds.push(body.bookingid as number);
  });

  test('invalid dates (checkout before checkin) → 409', async ({ request }) => {
    const response = await request.post('/api/booking', {
      data: INVALID_BOOKING_DATES,
    });

    expect(response.status()).toBe(409);
  });
});

test.describe('GET /api/booking — List bookings (auth required)', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('with valid token → 200 and bookings array', async ({ request }) => {
    // Requires roomid as query param
    const response = await request.get('/api/booking?roomid=1', {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('bookings');
    expect(Array.isArray(body.bookings)).toBe(true);
  });

  test('without token → 401', async ({ request }) => {
    const response = await request.get('/api/booking?roomid=1');
    expect(response.status()).toBe(401);
  });
});

test.describe('DELETE /api/booking/:id', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('delete a just-created booking → 200', async ({ request }) => {
    // Use a different date range to avoid conflicts with the POST test (2026-06-01/05)
    const deleteTestBooking = {
      ...VALID_BOOKING,
      bookingdates: { checkin: '2026-09-01', checkout: '2026-09-05' },
    };

    const booking = await createBooking(request, deleteTestBooking);
    const bookingId = booking['bookingid'] as number;

    const response = await request.delete(`/api/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);
  });
});
