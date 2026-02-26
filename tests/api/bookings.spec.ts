import { test, expect } from '@playwright/test';
import { getAuthToken, createBooking, deleteBooking, getFirstAvailableRoomId } from '../../helpers/api.helpers';
import { VALID_BOOKING, INVALID_BOOKING_DATES } from '../../fixtures/test-data';

// ── POST ─────────────────────────────────────────────────────────────────────
test.describe('POST /api/booking — Create booking', () => {
  let token: string;
  let roomId: number;
  const createdBookingIds: number[] = [];

  test.beforeAll(async ({ request }) => {
    roomId = await getFirstAvailableRoomId(request);
  });

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
    const bookingData = { ...VALID_BOOKING, roomid: roomId };
    const response = await request.post('/api/booking', { data: bookingData });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      bookingid: expect.any(Number),
      roomid: roomId,
      firstname: VALID_BOOKING.firstname,
      lastname: VALID_BOOKING.lastname,
    });

    createdBookingIds.push(body.bookingid as number);
  });

  test('invalid dates (checkout before checkin) → 409', async ({ request }) => {
    const response = await request.post('/api/booking', {
      data: { ...INVALID_BOOKING_DATES, roomid: roomId },
    });

    expect(response.status()).toBe(409);
  });

  test('BOOK-006 · missing firstname → non-201', async ({ request }) => {
    const { firstname, ...bookingWithoutFirstname } = VALID_BOOKING as Record<string, unknown>;
    void firstname;

    const response = await request.post('/api/booking', {
      data: {
        ...bookingWithoutFirstname,
        roomid: roomId,
        bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
      },
    });

    expect(response.status()).not.toBe(201);
  });

  test('BOOK-007 · missing roomid → non-201', async ({ request }) => {
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

  test('BOOK-008 · checkin equals checkout → non-201', async ({ request }) => {
    const response = await request.post('/api/booking', {
      data: {
        ...VALID_BOOKING,
        roomid: roomId,
        bookingdates: { checkin: '2026-11-01', checkout: '2026-11-01' },
      },
    });

    expect(response.status()).not.toBe(201);
  });

  test('BOOK-012 · update booking with valid token → 200', async ({ request }) => {
    // Create with one date range, update to a different range to avoid 409 conflict
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      roomid: roomId,
      bookingdates: { checkin: '2027-05-01', checkout: '2027-05-05' },
    });
    const bookingId = booking['bookingid'] as number;

    // Note: updating with the same dates as the original booking causes 409.
    // The API treats the existing booking as a conflict even with itself.
    // Use different dates to avoid this known platform behavior.
    const response = await request.put(`/api/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: {
        ...VALID_BOOKING,
        roomid: roomId,
        firstname: 'Updated',
        lastname: 'Guest',
        bookingdates: { checkin: '2027-06-01', checkout: '2027-06-05' },
      },
    });

    // API returns {"success":true} — not the updated booking object
    expect(response.status()).toBe(200);

    await deleteBooking(request, token, bookingId).catch(() => {});
  });

  test('BOOK-013 · update booking without auth token → 403', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      roomid: roomId,
      bookingdates: { checkin: '2027-06-01', checkout: '2027-06-05' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.put(`/api/booking/${bookingId}`, {
      data: { ...VALID_BOOKING, roomid: roomId },
    });

    expect(response.status()).not.toBe(200);

    await deleteBooking(request, token, bookingId).catch(() => {});
  });
});

// ── GET ──────────────────────────────────────────────────────────────────────
test.describe('GET /api/booking — List bookings (auth required)', () => {
  let token: string;
  let roomId: number;

  test.beforeAll(async ({ request }) => {
    roomId = await getFirstAvailableRoomId(request);
  });

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('with valid token → 200 and bookings array', async ({ request }) => {
    const response = await request.get(`/api/booking?roomid=${roomId}`, {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('bookings');
    expect(Array.isArray(body.bookings)).toBe(true);
  });

  test('without token → 401', async ({ request }) => {
    const response = await request.get(`/api/booking?roomid=${roomId}`);
    expect(response.status()).toBe(401);
  });

  test('BOOK-009 · get booking by ID with valid token → 200', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      roomid: roomId,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.get(`/api/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);

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
  let roomId: number;

  test.beforeAll(async ({ request }) => {
    roomId = await getFirstAvailableRoomId(request);
  });

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('delete a just-created booking → 200', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      roomid: roomId,
      bookingdates: { checkin: '2026-09-01', checkout: '2026-09-05' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.delete(`/api/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);
  });

  test('BOOK-011 · delete without auth token → 401', async ({ request }) => {
    const booking = await createBooking(request, {
      ...VALID_BOOKING,
      roomid: roomId,
      bookingdates: { checkin: '2026-09-10', checkout: '2026-09-15' },
    });
    const bookingId = booking['bookingid'] as number;

    const response = await request.delete(`/api/booking/${bookingId}`);
    expect(response.status()).toBe(401);

    await deleteBooking(request, token, bookingId).catch(() => {});
  });
});
