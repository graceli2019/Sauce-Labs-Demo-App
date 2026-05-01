import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage.js'; // import BasePage to inherit header and burger menu

export class InventoryItemPage extends BasePage { // page object for the individual product detail page
  readonly itemName: Locator; // product name heading on the detail page
  readonly itemDescription: Locator; // product description text on the detail page
  readonly itemPrice: Locator; // product price label on the detail page
  readonly itemImage: Locator; // product image on the detail page
  readonly addToCartButton: Locator; // Add to Cart button — visible when item is not yet in cart
  readonly removeButton: Locator; // Remove button — visible when item is already in cart
  readonly backToProductsButton: Locator; // back button to return to the inventory page

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.itemName = page.getByTestId('inventory-item-name'); // locate product name by stable test id
    this.itemDescription = page.getByTestId('inventory-item-desc'); // locate product description by stable test id
    this.itemPrice = page.getByTestId('inventory-item-price'); // locate product price by stable test id
    this.itemImage = page.getByTestId(/^item-.*-img$/); // locate product detail image by data-test pattern — works for any product detail page
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' }); // locate Add to Cart button by role and name
    this.removeButton = page.getByRole('button', { name: 'Remove' }); // locate Remove button by role and name
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' }); // locate back button by role and name
  }

  /** Clicks the Add to Cart button on the product detail page. */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click(); // click Add to Cart — button will switch to 'Remove' after clicking
  }

  /** Clicks the Remove button to remove the current product from the cart. */
  async removeFromCart(): Promise<void> {
    await this.removeButton.click(); // click Remove — button will switch back to 'Add to Cart' after clicking
  }

  /** Clicks the Back to Products button, returning to the inventory page. */
  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click(); // click back button to navigate back to the inventory page
  }

  /** Returns the name of the product displayed on the detail page. */
  async getItemName(): Promise<string> {
    return await this.itemName.textContent() ?? ''; // read the product name text — fallback to empty string if not found
  }

  /** Returns the price of the product displayed on the detail page. */
  async getItemPrice(): Promise<string> {
    return await this.itemPrice.textContent() ?? ''; // read the product price text — fallback to empty string if not found
  }
}
