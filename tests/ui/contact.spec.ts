import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';
import { VALID_CONTACT } from '../../fixtures/test-data';

test.describe('Contact form — UI tests', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test('submit with all valid data → success heading displayed', async () => {
    await contactPage.fillForm(VALID_CONTACT);
    await contactPage.submit();
    await expect(contactPage.successHeading).toBeVisible({ timeout: 10_000 });
    await expect(contactPage.successHeading).toContainText('Thanks for getting in touch');
  });

  test('submit with invalid phone (too short) → phone validation error', async () => {
    await contactPage.fillForm({
      name: VALID_CONTACT.name,
      email: VALID_CONTACT.email,
      phone: '123',               // too short: must be 11–21 chars
      subject: VALID_CONTACT.subject,
      message: VALID_CONTACT.message,
    });
    await contactPage.submit();

    await expect(contactPage.errorAlert).toBeVisible({ timeout: 5_000 });
    await expect(contactPage.errorAlert).toContainText(/Phone must be between 11 and 21 characters/i);
  });

  test('submit without email → email validation error', async () => {
    await contactPage.fillForm({
      name: VALID_CONTACT.name,
      email: '',                  // blank
      phone: VALID_CONTACT.phone,
      subject: VALID_CONTACT.subject,
      message: VALID_CONTACT.message,
    });
    await contactPage.submit();

    await expect(contactPage.errorAlert).toBeVisible({ timeout: 5_000 });
    await expect(contactPage.errorAlert).toContainText(/Email may not be blank/i);
  });

  test('submit empty form → multiple validation errors', async () => {
    // Click Submit without filling any field
    await contactPage.submit();

    await expect(contactPage.errorAlert).toBeVisible({ timeout: 5_000 });
    // The alert concatenates every validation message: more than 50 chars means several errors
    await expect(contactPage.errorAlert).toHaveText(/[\s\S]{51,}/);
  });
});
