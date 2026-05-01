import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage.js'; // import BasePage to inherit header and burger menu

export class CheckoutStepTwoPage extends BasePage { // page object for checkout step two — order summary and review
  readonly pageTitle: Locator; // 'Checkout: Overview' heading
  readonly orderItems: Locator; // all item rows in the order summary
  readonly orderItemNames: Locator; // product name labels in the order summary
  readonly orderItemPrices: Locator; // product price labels in the order summary
  readonly subtotalLabel: Locator; // subtotal row showing item prices before tax
  readonly taxLabel: Locator; // tax row showing the calculated tax amount
  readonly totalLabel: Locator; // total row showing the final amount (subtotal + tax)
  readonly cancelButton: Locator; // Cancel button — returns to the inventory page
  readonly finishButton: Locator; // Finish button — places the order and navigates to the confirmation page

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.getByTestId('title'); // locate page title by stable test id
    this.orderItems = page.getByTestId('inventory-item'); // locate all order rows by stable test id
    this.orderItemNames = page.getByTestId('inventory-item-name'); // locate all order item names by stable test id
    this.orderItemPrices = page.getByTestId('inventory-item-price'); // locate all order item prices by stable test id
    this.subtotalLabel = page.getByText(/^Item total:/); // locate subtotal label by stable visible text prefix
    this.taxLabel = page.getByText(/^Tax:/); // locate tax label by stable visible text prefix
    this.totalLabel = page.getByText(/^Total:/); // locate total label by stable visible text prefix
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }); // locate Cancel button by role and name
    this.finishButton = page.getByRole('button', { name: 'Finish' }); // locate Finish button by role and name
  }

  /** Clicks the Finish button to place the order and navigate to the confirmation page. */
  async finish(): Promise<void> {
    await this.finishButton.click(); // click Finish to submit the order and navigate to the confirmation page
  }

  /** Clicks the Cancel button, returning to the inventory page without placing the order. */
  async cancel(): Promise<void> {
    await this.cancelButton.click(); // click Cancel to abandon checkout and return to the inventory page
  }

  /** Returns the subtotal text (item prices before tax) shown in the order summary. */
  async getSubtotal(): Promise<string> {
    return await this.subtotalLabel.textContent() ?? ''; // read subtotal text — fallback to empty string if not present
  }

  /** Returns the tax amount text shown in the order summary. */
  async getTax(): Promise<string> {
    return await this.taxLabel.textContent() ?? ''; // read tax text — fallback to empty string if not present
  }

  /** Returns the total amount text (subtotal + tax) shown in the order summary. */
  async getTotal(): Promise<string> {
    return await this.totalLabel.textContent() ?? ''; // read total text — fallback to empty string if not present
  }
}
