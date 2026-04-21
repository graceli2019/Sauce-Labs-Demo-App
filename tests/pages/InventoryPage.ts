import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright
import { BasePage } from './BasePage'; // import BasePage to inherit header and burger menu

export class InventoryPage extends BasePage { // page object for the products listing page
  readonly pageTitle: Locator; // 'Products' heading at the top of the page
  readonly sortDropdown: Locator; // dropdown to sort products by name or price
  readonly inventoryItems: Locator; // all product cards on the page
  readonly inventoryItemNames: Locator; // product name links inside each card
  readonly inventoryItemPrices: Locator; // product price labels inside each card

  constructor(page: Page) {
    super(page); // call BasePage constructor to initialise shared header and burger menu locators

    this.pageTitle = page.locator('.title'); // locate page title by its CSS class
    this.sortDropdown = page.locator('[data-test="product-sort-container"]'); // locate sort dropdown by data-test attribute
    this.inventoryItems = page.locator('.inventory_item'); // locate all product cards — returns a list of elements
    this.inventoryItemNames = page.locator('.inventory_item_name'); // locate all product name links
    this.inventoryItemPrices = page.locator('.inventory_item_price'); // locate all product price labels
  }

  /** Navigates directly to the inventory/products page (/inventory.html). */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html'); // navigate to the inventory path using baseURL from playwright.config.ts
  }

  /** Selects a sort option from the dropdown. Options: 'az' (A-Z), 'za' (Z-A), 'lohi' (price low-high), 'hilo' (price high-low). */
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option); // select a value from the sort dropdown by its option value
  }

  /** Finds a product card by name and clicks its Add to Cart button. */
  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName }); // filter all product cards to find the one matching the given name
    await item.locator('button[data-test^="add-to-cart"]').click(); // click the Add to Cart button inside that card
  }

  /** Finds a product card by name and clicks its Remove button to remove it from the cart. */
  async removeItemFromCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName }); // filter all product cards to find the one matching the given name
    await item.locator('button[data-test^="remove"]').click(); // click the Remove button inside that card
  }

  /** Clicks the product name link to navigate to that product's detail page. */
  async clickItemByName(itemName: string): Promise<void> {
    await this.inventoryItemNames.filter({ hasText: itemName }).click(); // filter name links by text and click the matching one
  }

  /** Returns the total number of product cards displayed on the inventory page. */
  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count(); // count how many product card elements are on the page
  }
}
