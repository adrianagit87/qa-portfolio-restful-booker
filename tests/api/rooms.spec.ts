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
    const response = await request.post('/api/room', {
      data: VALID_ROOM,
    });

    expect(response.status()).toBe(401);
  });

  test('with valid token → 200 and success response', async ({ request }) => {
    const room = await createRoom(request, token);

    // createRoom helper finds the created room in the list — must have a numeric ID
    expect(typeof room['roomid']).toBe('number');
    expect(room['type']).toBe(VALID_ROOM.type);
    expect(room['roomPrice']).toBe(VALID_ROOM.roomPrice);

    createdRoomIds.push(room['roomid'] as number);
  });
});

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
});
