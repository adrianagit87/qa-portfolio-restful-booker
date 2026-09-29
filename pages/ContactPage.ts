import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the Contact section on the Restful-Booker home page.
 * Inputs are identified by their `id` attribute (no placeholder text).
 * Success: h3 "Thanks for getting in touch {name}!"
 * Errors:  single .alert.alert-danger element with concatenated error text.
 */
export class ContactPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.subjectInput = page.locator('#subject');
    this.messageInput = page.locator('#description');
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // h3 that contains "Thanks for getting in touch" — appears after successful submission
    this.successHeading = page.locator('h3').filter({ hasText: /Thanks for getting in touch/i });

    // Single div that contains all validation errors concatenated
    this.errorAlert = page.locator('.alert.alert-danger');
  }

  async goto() {
    await this.page.goto('/');
    // Scroll the contact section into view once the form is in the DOM
    await this.nameInput.scrollIntoViewIfNeeded();
    await this.nameInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Fills all contact form fields.
   */
  async fillForm(details: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.subjectInput.fill(details.subject);
    await this.messageInput.fill(details.message);
  }

  /**
   * Submits the contact form.
   */
  async submit() {
    await this.submitButton.click();
  }
}
