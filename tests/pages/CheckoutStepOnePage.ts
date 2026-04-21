import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage'; // import BasePage to inherit header and burger menu

export class CheckoutStepOnePage extends BasePage { // page object for checkout step one — customer info form
  readonly pageTitle: Locator; // 'Checkout: Your Information' heading
  readonly firstNameInput: Locator; // first name input field
  readonly lastNameInput: Locator; // last name input field
  readonly postalCodeInput: Locator; // postal/zip code input field
  readonly cancelButton: Locator; // Cancel button — returns to the cart page
  readonly continueButton: Locator; // Continue button — proceeds to the order summary page
  readonly errorMessage: Locator; // error banner shown when required fields are empty

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.locator('.title'); // locate page title by its CSS class
    this.firstNameInput = page.locator('[data-test="firstName"]'); // locate first name input by data-test attribute
    this.lastNameInput = page.locator('[data-test="lastName"]'); // locate last name input by data-test attribute
    this.postalCodeInput = page.locator('[data-test="postalCode"]'); // locate postal code input by data-test attribute
    this.cancelButton = page.locator('[data-test="cancel"]'); // locate Cancel button by data-test attribute
    this.continueButton = page.locator('[data-test="continue"]'); // locate Continue button by data-test attribute
    this.errorMessage = page.locator('[data-test="error"]'); // locate error message by data-test attribute
  }

  /** Fills in the first name, last name, and postal code fields on the checkout info form. */
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName); // type the first name into the first name input field
    await this.lastNameInput.fill(lastName); // type the last name into the last name input field
    await this.postalCodeInput.fill(postalCode); // type the postal code into the postal code input field
  }

  /** Clicks the Continue button to proceed to the order summary page. */
  async continue(): Promise<void> {
    await this.continueButton.click(); // click Continue to move to checkout step two (order summary)
  }

  /** Clicks the Cancel button, returning to the cart page. */
  async cancel(): Promise<void> {
    await this.cancelButton.click(); // click Cancel to go back to the cart page without proceeding
  }

  /** Returns the text of the error message shown when required fields are missing or invalid. */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() ?? ''; // read error message text — fallback to empty string if not present
  }
}
