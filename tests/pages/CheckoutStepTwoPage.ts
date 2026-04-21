import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage'; // import BasePage to inherit header and burger menu

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

    this.pageTitle = page.locator('.title'); // locate page title by its CSS class
    this.orderItems = page.locator('.cart_item'); // locate all order item rows by CSS class
    this.orderItemNames = page.locator('.inventory_item_name'); // locate all product name labels
    this.orderItemPrices = page.locator('.inventory_item_price'); // locate all product price labels
    this.subtotalLabel = page.locator('.summary_subtotal_label'); // locate subtotal label by its CSS class
    this.taxLabel = page.locator('.summary_tax_label'); // locate tax label by its CSS class
    this.totalLabel = page.locator('.summary_total_label'); // locate total label by its CSS class
    this.cancelButton = page.locator('[data-test="cancel"]'); // locate Cancel button by data-test attribute
    this.finishButton = page.locator('[data-test="finish"]'); // locate Finish button by data-test attribute
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
