import { Page, expect } from '@playwright/test'; // import Page type for function parameter typing and expect for assertions
import { LoginPage } from '../pages/LoginPage'; // import LoginPage to perform login actions
import { InventoryPage } from '../pages/InventoryPage'; // import InventoryPage to add items to cart
import { CartPage } from '../pages/CartPage'; // import CartPage for reusable cart assertions
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage'; // import CheckoutStepTwoPage for reusable summary assertions
import { USERS } from './testData'; // import USERS constants to avoid hardcoding credentials

/**
 * Logs in with the given username and password, then waits for the inventory page to load.
 * Use this in beforeEach hooks for tests that require an authenticated state.
 */
export async function loginAs(page: Page, username: string, password: string): Promise<void> {
  const loginPage = new LoginPage(page); // create a LoginPage instance using the provided browser page
  await loginPage.goto(); // navigate to the login page
  await loginPage.login(username, password); // fill in credentials and click Login
  await page.waitForURL('**/inventory.html'); // wait until the browser reaches the inventory page before continuing
}

/**
 * Shortcut to log in as the standard (fully functional) user.
 */
export async function loginAsStandardUser(page: Page): Promise<void> {
  await loginAs(page, USERS.standard.username, USERS.standard.password); // call loginAs with standard_user credentials from testData
}

/**
 * Adds multiple products to the cart by name from the inventory page.
 * Assumes the browser is already on the inventory page.
 */
export async function addItemsToCart(page: Page, itemNames: string[]): Promise<void> {
  const inventoryPage = new InventoryPage(page); // create an InventoryPage instance to access add-to-cart methods
  for (const name of itemNames) { // loop through each product name in the provided array
    await inventoryPage.addItemToCartByName(name); // click Add to Cart for each product by name
  }
}

/**
 * Logs in as standard user and adds the given items to the cart.
 * Leaves the browser on the inventory page after completion.
 */
export async function loginAndAddItemsToCart(page: Page, itemNames: string[]): Promise<void> {
  await loginAsStandardUser(page); // log in as standard_user first
  await addItemsToCart(page, itemNames); // then add all specified items to the cart
}

/**
 * Asserts that the browser is currently on the inventory page.
 */
export async function assertOnInventoryPage(page: Page): Promise<void> {
  await expect(page).toHaveURL(/inventory\.html/); // assert URL contains inventory.html
}

/**
 * Asserts that the browser is currently on the login page.
 */
export async function assertOnLoginPage(page: Page): Promise<void> {
  await expect(page).toHaveURL('/'); // assert URL is the root login page
}

/**
 * Asserts that the login error message contains the expected text.
 */
export async function assertLoginError(loginPage: LoginPage, message: string): Promise<void> {
  await expect(loginPage.errorMessage).toContainText(message); // assert the error banner contains the expected message
}

/**
 * Asserts that the inventory page title shows 'Products'.
 */
export async function assertInventoryPageTitle(inventoryPage: InventoryPage): Promise<void> {
  await expect(inventoryPage.pageTitle).toHaveText('Products'); // assert page title shows 'Products'
}

/**
 * Asserts that all expected item names are visible in the cart.
 */
export async function assertCartContainsItems(cartPage: CartPage, itemNames: string[]): Promise<void> {
  for (const itemName of itemNames) { // assert each expected cart item individually for clearer failures
    await expect(cartPage.cartItemNames.filter({ hasText: itemName })).toBeVisible();
  }
}

/**
 * Asserts that all expected item names are visible in the checkout order summary.
 */
export async function assertOrderSummaryContainsItems(checkoutStepTwoPage: CheckoutStepTwoPage, itemNames: string[]): Promise<void> {
  for (const itemName of itemNames) { // assert each expected summary item individually for clearer failures
    await expect(checkoutStepTwoPage.orderItemNames.filter({ hasText: itemName })).toBeVisible();
  }
}
