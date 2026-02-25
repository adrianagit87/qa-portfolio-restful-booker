import { APIRequestContext } from '@playwright/test';
import { ADMIN_CREDENTIALS, VALID_ROOM } from '../fixtures/test-data';

/**
 * Authenticates with the admin account and returns the session token.
 * Endpoint: POST /api/auth/login
 */
export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/api/auth/login', {
    data: ADMIN_CREDENTIALS,
  });

  if (!response.ok()) {
    throw new Error(`Auth failed: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json();
  return body.token as string;
}

/**
 * Creates a room via the API.
 * POST /api/room returns {"success":true} — no roomid in response.
 * We fetch the full room list after creation and find the room by name.
 */
export async function createRoom(
  request: APIRequestContext,
  token: string,
  data: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  // Use a unique name so we can identify this room after creation
  const uniqueName = `Test-${Date.now()}`;
  const roomData = { ...VALID_ROOM, roomName: uniqueName, ...data };

  const createResponse = await request.post('/api/room', {
    data: roomData,
    headers: { Cookie: `token=${token}` },
  });

  if (!createResponse.ok()) {
    throw new Error(`createRoom failed: ${createResponse.status()} ${await createResponse.text()}`);
  }

  // Fetch the room list and locate the newly created room by name
  const listResponse = await request.get('/api/room');
  const list = await listResponse.json() as { rooms: Record<string, unknown>[] };
  const created = list.rooms.find(r => r['roomName'] === uniqueName);

  if (!created) {
    throw new Error(`createRoom: could not find room "${uniqueName}" after creation`);
  }

  return created;
}

/**
 * Deletes a room by ID. Returns void; throws on failure.
 */
export async function deleteRoom(
  request: APIRequestContext,
  token: string,
  id: number
): Promise<void> {
  const response = await request.delete(`/api/room/${id}`, {
    headers: { Cookie: `token=${token}` },
  });

  if (!response.ok()) {
    throw new Error(`deleteRoom failed: ${response.status()} ${await response.text()}`);
  }
}

/**
 * Creates a booking (public endpoint). Returns the created booking object.
 * Note: data must include a valid `roomid`.
 */
export async function createBooking(
  request: APIRequestContext,
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const response = await request.post('/api/booking', {
    data,
  });

  if (!response.ok()) {
    throw new Error(`createBooking failed: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}

/**
 * Deletes a booking by ID. Requires auth token.
 */
export async function deleteBooking(
  request: APIRequestContext,
  token: string,
  id: number
): Promise<void> {
  const response = await request.delete(`/api/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });

  if (!response.ok()) {
    throw new Error(`deleteBooking failed: ${response.status()} ${await response.text()}`);
  }
}
