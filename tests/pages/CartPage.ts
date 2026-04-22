import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage'; // import BasePage to inherit header and burger menu

export class CartPage extends BasePage { // page object for the shopping cart page
  readonly pageTitle: Locator; // 'Your Cart' heading at the top of the page
  readonly cartItems: Locator; // all item rows currently in the cart
  readonly cartItemNames: Locator; // product name labels inside each cart row
  readonly cartItemPrices: Locator; // product price labels inside each cart row
  readonly cartItemQuantities: Locator; // quantity numbers inside each cart row
  readonly continueShoppingButton: Locator; // button to go back to the inventory page
  readonly checkoutButton: Locator; // button to proceed to the checkout flow

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.getByTestId('title'); // locate page title by stable test id
    this.cartItems = page.getByTestId('inventory-item'); // locate all cart rows by stable test id
    this.cartItemNames = page.getByTestId('inventory-item-name'); // locate all cart item names by stable test id
    this.cartItemPrices = page.getByTestId('inventory-item-price'); // locate all cart item prices by stable test id
    this.cartItemQuantities = page.getByTestId('item-quantity'); // locate all quantity values by stable test id
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' }); // locate Continue Shopping button by role and name
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' }); // locate Checkout button by role and name
  }

  /** Navigates directly to the cart page (/cart.html). */
  async goto(): Promise<void> {
    await this.page.goto('/cart.html'); // navigate to the cart path using baseURL from playwright.config.ts
  }

  /** Finds a cart item by name and clicks its Remove button to remove it from the cart. */
  async removeItemByName(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName }); // find the cart row that contains the given product name
    await item.getByRole('button', { name: 'Remove' }).click(); // click the Remove button inside that row
  }

  /** Clicks the Continue Shopping button, returning to the inventory page. */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click(); // click Continue Shopping to go back to the inventory page
  }

  /** Clicks the Checkout button, navigating to the first checkout step. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click(); // click Checkout to start the checkout flow (goes to step one)
  }

  /** Returns the total number of items currently in the cart. */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count(); // count how many cart item rows are present on the page
  }
}
