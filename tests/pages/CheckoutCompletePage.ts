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

    this.pageTitle = page.getByTestId('title'); // locate page title by stable test id
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' }); // locate confirmation heading by role and exact text
    this.completeText = page.getByText(/Your order has been dispatched/); // locate confirmation body text by stable visible copy
    this.ponyExpressImage = page.getByRole('img', { name: /pony express/i }); // locate pony express image by image role and name
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' }); // locate Back Home button by role and name
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
