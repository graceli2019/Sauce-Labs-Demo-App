import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber'; // import Cucumber world utilities for custom context
import { Page } from '@playwright/test'; // import Playwright Page type for browser page reference
import { LoginPage } from '../../tests/pages/LoginPage.js'; // page object for the login page
import { InventoryPage } from '../../tests/pages/InventoryPage.js'; // page object for the inventory/products page
import { CartPage } from '../../tests/pages/CartPage.js'; // page object for the cart page
import { CheckoutStepOnePage } from '../../tests/pages/CheckoutStepOnePage.js'; // page object for checkout step one (customer info)
import { CheckoutStepTwoPage } from '../../tests/pages/CheckoutStepTwoPage.js'; // page object for checkout step two (order overview)
import { InventoryItemPage } from '../../tests/pages/InventoryItemPage.js'; // page object for the product detail page

// CustomWorld extends Cucumber's World to hold the Playwright page and all page objects
// — shared across all step definitions within the same scenario
export class CustomWorld extends World {
  page!: Page; // the active Playwright browser page for this scenario
  loginPage!: LoginPage; // page object for the login page
  inventoryPage!: InventoryPage; // page object for the inventory page
  cartPage!: CartPage; // page object for the cart page
  checkoutStepOnePage!: CheckoutStepOnePage; // page object for checkout step one
  checkoutStepTwoPage!: CheckoutStepTwoPage; // page object for checkout step two
  inventoryItemPage!: InventoryItemPage; // page object for the product detail page

  constructor(options: IWorldOptions) {
    super(options); // pass Cucumber options to base World constructor
  }
}

setWorldConstructor(CustomWorld); // register CustomWorld as the active Cucumber world

// Helper to lazily initialise all page objects on the world context
// — called at the start of each step to ensure page objects are ready before use
export function getWorld(ctx: any) {
  if (!ctx.loginPage) { // initialise page objects only once per scenario
    ctx.loginPage = new LoginPage(ctx.page);
    ctx.inventoryPage = new InventoryPage(ctx.page);
    ctx.cartPage = new CartPage(ctx.page);
    ctx.checkoutStepOnePage = new CheckoutStepOnePage(ctx.page);
    ctx.checkoutStepTwoPage = new CheckoutStepTwoPage(ctx.page);
    ctx.inventoryItemPage = new InventoryItemPage(ctx.page);
  }
  return ctx; // return the world context with all page objects attached
}
