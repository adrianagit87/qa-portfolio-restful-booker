import { test, expect } from '@playwright/test';
import { getAuthToken, createRoom, deleteRoom } from '../../helpers/api.helpers';
import { VALID_ROOM } from '../../fixtures/test-data';

test.describe('GET /api/room — List rooms (public)', () => {
  test('returns 200 with a rooms array', async ({ request }) => {
    const response = await request.get('/api/room');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('rooms');
    expect(Array.isArray(body.rooms)).toBe(true);
  });

  test('each room has required schema fields', async ({ request }) => {
    const response = await request.get('/api/room');
    const body = await response.json();

    if (body.rooms.length > 0) {
      const room = body.rooms[0];
      expect(room).toMatchObject({
        roomid: expect.any(Number),
        roomName: expect.any(String),
        type: expect.any(String),
        roomPrice: expect.any(Number),
      });
    }
  });
});

// ── ROOM-006 / ROOM-007 ──────────────────────────────────────────────────────
test.describe('GET /api/room/:id — Get room by ID', () => {
  test('ROOM-006 · existing room ID → 200 and room data', async ({ request }) => {
    const listResponse = await request.get('/api/room');
    const body = await listResponse.json();
    const roomId = body.rooms[0]?.roomid;

    const response = await request.get(`/api/room/${roomId}`);
    expect(response.status()).toBe(200);

    const room = await response.json();
    expect(room).toMatchObject({
      roomid: expect.any(Number),
      roomName: expect.any(String),
      type: expect.any(String),
      roomPrice: expect.any(Number),
    });
  });

  test('ROOM-007 · non-existent room ID → non-200 or timeout', async ({ request }) => {
    let status: number | null = null;
    try {
      const response = await request.get('/api/room/99999', { timeout: 5000 });
      status = response.status();
    } catch {
      // Timeout documents real API behavior — acceptable
      status = null;
    }
    expect(status).not.toBe(200);
  });
});

// ── POST ─────────────────────────────────────────────────────────────────────
test.describe('POST /api/room — Create room', () => {
  let token: string;
  const createdRoomIds: number[] = [];

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.afterEach(async ({ request }) => {
    for (const id of createdRoomIds) {
      await deleteRoom(request, token, id).catch(() => {/* already deleted */});
    }
    createdRoomIds.length = 0;
  });

  test('without auth token → 401', async ({ request }) => {
    const response = await request.post('/api/room', { data: VALID_ROOM });
    expect(response.status()).toBe(401);
  });

  test('with valid token → 200 and success response', async ({ request }) => {
    const room = await createRoom(request, token);

    expect(typeof room['roomid']).toBe('number');
    expect(room['type']).toBe(VALID_ROOM.type);
    expect(room['roomPrice']).toBe(VALID_ROOM.roomPrice);

    createdRoomIds.push(room['roomid'] as number);
  });

  test('ROOM-008 · negative price → non-200', async ({ request }) => {
    const response = await request.post('/api/room', {
      headers: { Cookie: `token=${token}` },
      data: { ...VALID_ROOM, roomPrice: -50 },
    });
    expect(response.status()).not.toBe(200);
  });

  test('ROOM-009 · duplicate room name → documents real behavior', async ({ request }) => {
    // Create first room — helper generates unique name internally
    const first = await createRoom(request, token);
    const roomName = first['roomName'] as string;
    createdRoomIds.push(first['roomid'] as number);

    // Attempt duplicate using same name via direct POST
    const response = await request.post('/api/room', {
      headers: { Cookie: `token=${token}` },
      data: { ...VALID_ROOM, roomName },
    });

    if (response.status() === 200) {
      // Duplicates allowed — find and cleanup
      const listRes = await request.get('/api/room');
      const listBody = await listRes.json();
      const duplicates = listBody.rooms.filter(
        (r: { roomName: string; roomid: number }) =>
          r.roomName === roomName && r.roomid !== first['roomid']
      );
      for (const d of duplicates) createdRoomIds.push(d.roomid);
    }

    expect([200, 409]).toContain(response.status());
  });
});

// ── DELETE ───────────────────────────────────────────────────────────────────
test.describe('DELETE /api/room/:id — Delete room', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('delete a just-created room → 200', async ({ request }) => {
    const room = await createRoom(request, token);
    const roomId = room['roomid'] as number;

    const response = await request.delete(`/api/room/${roomId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(response.status()).toBe(200);
  });

  test('ROOM-010 · delete without auth token → 401', async ({ request }) => {
    const room = await createRoom(request, token);
    const roomId = room['roomid'] as number;

    const response = await request.delete(`/api/room/${roomId}`);
    expect(response.status()).toBe(401);

    await deleteRoom(request, token, roomId).catch(() => {});
  });
});
