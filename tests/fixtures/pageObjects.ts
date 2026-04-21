import { test as base } from '@playwright/test'; // import the base Playwright test runner — renamed to 'base' so we can extend it
import { LoginPage } from '../pages/LoginPage'; // import LoginPage class
import { InventoryPage } from '../pages/InventoryPage'; // import InventoryPage class
import { InventoryItemPage } from '../pages/InventoryItemPage'; // import InventoryItemPage class
import { CartPage } from '../pages/CartPage'; // import CartPage class
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage'; // import CheckoutStepOnePage class
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage'; // import CheckoutStepTwoPage class
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage'; // import CheckoutCompletePage class

/** All page objects available as fixture properties in tests. */
type PageFixtures = { // TypeScript type defining the shape of our custom fixtures — tells test what properties to expect
  loginPage: LoginPage; // fixture name and its type
  inventoryPage: InventoryPage;
  inventoryItemPage: InventoryItemPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

/** Extended test with all page objects pre-instantiated and ready to use. */
export const test = base.extend<PageFixtures>({ // extend the base test runner with our custom page object fixtures
  loginPage: async ({ page }, use) => { // page = Playwright's built-in browser page; use = hands the fixture to the test
    await use(new LoginPage(page)); // create a fresh LoginPage instance and provide it to the test
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page)); // create a fresh InventoryPage instance and provide it to the test
  },
  inventoryItemPage: async ({ page }, use) => {
    await use(new InventoryItemPage(page)); // create a fresh InventoryItemPage instance and provide it to the test
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page)); // create a fresh CartPage instance and provide it to the test
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page)); // create a fresh CheckoutStepOnePage instance and provide it to the test
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page)); // create a fresh CheckoutStepTwoPage instance and provide it to the test
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page)); // create a fresh CheckoutCompletePage instance and provide it to the test
  },
});

export { expect } from '@playwright/test'; // re-export expect so spec files only need to import from this file
