import { test, expect } from '@playwright/test';
import { getAuthToken, createBooking, deleteBooking } from '../../helpers/api.helpers';
import { VALID_BOOKING, INVALID_BOOKING_DATES } from '../../fixtures/test-data';

// ── POST ─────────────────────────────────────────────────────────────────────
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

  test('BOOK-006 · missing firstname → 400', async ({ request }) => {
    const { firstname, ...bookingWithoutFirstname } = VALID_BOOKING as Record<string, unknown>;
    void firstname;

    const response = await request.post('/api/booking', {
      data: {
        ...bookingWithoutFirstname,
        bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
      },
    });

    expect(response.status()).not.toBe(201);
  });

  test('BOOK-007 · missing roomid → 400', async ({ request }) => {
    const { roomid, ...bookingWithoutRoomid } = VALID_BOOKING as Record<string, unknown>;
    void roomid;

    const response = await request.post('/api/booking', {
      data: {
        ...bookingWithoutRoomid,
        bookingdates: { checkin: '2026-10-06', checkout: '2026-10-10' },
      },
    });

    expect(response.status()).not.toBe(201);
  });

  test('BOOK-008 · checkin equals checkout → 409 or validation error', async ({ request }) => {
    const response = await request.post('/api/booking', {
      data: {
        ...VALID_BOOKING,
        bookingdates: { checkin: '2026-11-01', checkout: '2026-11-01' },
      },
    });

    expect(response.status()).not.toBe(201);
  });
});

// ── GET ──────────────────────────────────────────────────────────────────────
test.describe('GET /api/booking — List bookings (auth required)', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('with valid token → 200 and bookings array', async ({ request }) => {
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

  test('BOOK-009 · get booking by ID with valid token → 200', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.get(`/api/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);

    // Cleanup
    await deleteBooking(request, token, bookingId).catch(() => {});
  });

  test('BOOK-010 · get non-existent booking ID → 404', async ({ request }) => {
    const response = await request.get('/api/booking/99999', {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(404);
  });
});

// ── DELETE ───────────────────────────────────────────────────────────────────
test.describe('DELETE /api/booking/:id', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('delete a just-created booking → 200', async ({ request }) => {
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

  test('BOOK-011 · delete without auth token → 401', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      bookingdates: { checkin: '2026-09-10', checkout: '2026-09-15' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.delete(`/api/booking/${bookingId}`);
    expect(response.status()).toBe(401);

    // Cleanup
    await deleteBooking(request, token, bookingId).catch(() => {});
  });
});
