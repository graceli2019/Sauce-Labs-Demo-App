import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage.js'; // import BasePage to inherit header and burger menu

export class CheckoutStepOnePage extends BasePage { // page object for checkout step one — customer info form
  readonly pageTitle: Locator; // 'Checkout: Your Information' heading
  readonly firstNameInput: Locator; // first name input field
  readonly lastNameInput: Locator; // last name input field
  readonly postalCodeInput: Locator; // postal/zip code input field
  readonly cancelButton: Locator; // Cancel button — returns to the cart page
  readonly continueButton: Locator; // Continue button — proceeds to the order summary page
  readonly errorMessage: Locator; // error banner shown when required fields are empty
  readonly errorDismissButton: Locator; // X button inside the error banner to dismiss it

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.getByTestId('title'); // locate page title by stable test id
    this.firstNameInput = page.getByPlaceholder('First Name'); // locate first name input by placeholder text
    this.lastNameInput = page.getByPlaceholder('Last Name'); // locate last name input by placeholder text
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code'); // locate postal code input by placeholder text
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }); // locate Cancel button by role and name
    this.continueButton = page.getByRole('button', { name: 'Continue' }); // locate Continue button by role and name
    this.errorMessage = page.getByRole('heading', { name: /error:/i }); // locate checkout error banner by heading text prefix
    this.errorDismissButton = page.getByTestId('error-button'); // locate error dismiss X button by stable test id
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
