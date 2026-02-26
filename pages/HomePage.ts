import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the Restful-Booker reservation page.
 * Flow: /reservation/{roomId}?checkin=...&checkout=...
 *   → click "Reserve Now" (opens form)
 *   → fill Firstname / Lastname / Email / Phone
 *   → click "Reserve Now" again (submits)
 *   → heading "Booking Confirmed" appears
 */
export class HomePage {
  readonly page: Page;

  readonly reserveNowButton: Locator;
  readonly cancelButton: Locator;
  readonly firstnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.reserveNowButton = page.getByRole('button', { name: 'Reserve Now' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    this.firstnameInput = page.locator('input[placeholder="Firstname"]');
    this.lastnameInput = page.locator('input[placeholder="Lastname"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.phoneInput = page.locator('input[placeholder="Phone"]');

    this.confirmationHeading = page.getByRole('heading', { name: 'Booking Confirmed' });
  }

  /**
   * Navigate to the reservation page for a specific room with pre-set dates.
   */
  async gotoReservation(roomId = 1, checkin = '2026-06-10', checkout = '2026-06-13') {
    await this.page.goto(`/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`);
    await this.reserveNowButton.first().waitFor({ state: 'visible', timeout: 15_000 });
  }

  /**
   * Opens the booking form by clicking the first "Reserve Now" button.
   */
  async openBookingForm() {
    await this.reserveNowButton.click();
    await this.firstnameInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Fills in the guest details form.
   */
  async fillBookingForm(details: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  }) {
    await this.firstnameInput.fill(details.firstname);
    await this.lastnameInput.fill(details.lastname);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  /**
   * Submits the booking by clicking "Reserve Now" a second time.
   */
  async submitBooking() {
    await this.reserveNowButton.click();
  }

  /**
   * Asserts that the booking confirmation heading is visible.
   */
  async verifyConfirmation() {
    await expect(this.confirmationHeading).toBeVisible({ timeout: 15_000 });
  }
}
