import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage'; // import BasePage to inherit header and burger menu

export class CheckoutCompletePage extends BasePage { // page object for the order confirmation page shown after checkout
  readonly pageTitle: Locator; // 'Checkout: Complete!' heading
  readonly completeHeader: Locator; // large confirmation heading (e.g. 'Thank you for your order!')
  readonly completeText: Locator; // body text describing the dispatch status of the order
  readonly ponyExpressImage: Locator; // pony express delivery image shown on the confirmation page
  readonly backHomeButton: Locator; // 'Back Home' button to return to the inventory page

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.locator('.title'); // locate page title by its CSS class
    this.completeHeader = page.locator('.complete-header'); // locate confirmation heading by its CSS class
    this.completeText = page.locator('.complete-text'); // locate confirmation body text by its CSS class
    this.ponyExpressImage = page.locator('.pony_express'); // locate pony express image by its CSS class
    this.backHomeButton = page.locator('[data-test="back-to-products"]'); // locate Back Home button by data-test attribute
  }

  /** Clicks the Back Home button, returning to the inventory page after a completed order. */
  async backToHome(): Promise<void> {
    await this.backHomeButton.click(); // click Back Home to navigate back to the inventory page
  }

  /** Returns the confirmation header text (e.g. 'Thank you for your order!'). */
  async getCompleteHeader(): Promise<string> {
    return await this.completeHeader.textContent() ?? ''; // read confirmation header text — fallback to empty string if not present
  }

  /** Returns the confirmation body text describing the dispatch status of the order. */
  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() ?? ''; // read confirmation body text — fallback to empty string if not present
  }
}
