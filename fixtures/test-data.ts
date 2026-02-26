export const ADMIN_CREDENTIALS = {
  username: process.env['ADMIN_USERNAME'] ?? 'admin',
  password: process.env['ADMIN_PASSWORD'] ?? 'password',
};

export const INVALID_CREDENTIALS = {
  username: process.env['ADMIN_USERNAME'] ?? 'admin',
  password: 'wrongpassword',
};

// Room data for POST /api/room
export const VALID_ROOM = {
  roomName: '101',
  type: 'Single',
  accessible: false,
  roomPrice: 100,
  features: ['WiFi', 'TV'],
  description: 'A cozy single room',
  image: 'https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg',
};

// roomid 1 is a permanent room on the platform ("101")
export const VALID_BOOKING = {
  firstname: 'Jane',
  lastname: 'Doe',
  totalprice: 150,
  depositpaid: true,
  roomid: 1,
  bookingdates: {
    checkin: '2026-06-01',
    checkout: '2026-06-05',
  },
};

export const INVALID_BOOKING_DATES = {
  firstname: 'John',
  lastname: 'Smith',
  totalprice: 100,
  depositpaid: false,
  roomid: 1,
  bookingdates: {
    // checkout before checkin → should trigger 409
    checkin: '2026-06-10',
    checkout: '2026-06-05',
  },
};

// Contact form data
export const VALID_CONTACT = {
  name: 'Alice Tester',
  email: 'alice@example.com',
  phone: '01234567890',
  subject: 'Test enquiry about rooms',
  message: 'Hello, I would like to know more about room availability for next month.',
};
