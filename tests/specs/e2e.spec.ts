import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { USERS, PRODUCTS, CUSTOMER } from '../fixtures/testData'; // import user credentials, product names, and customer info constants
import { loginAs, loginAsStandardUser, addItemsToCart, assertCartContainsItems, assertInventoryPageTitle, assertOrderSummaryContainsItems } from '../fixtures/helpers'; // import reusable helper functions

test.describe('End-to-End Journeys', () => { // group all cross-feature E2E tests under 'End-to-End Journeys'

  // ── Full Purchase Flow ─────────────────────────────────────────────────────

  test('TC01 - Sort products then purchase the cheapest item', async ({
    page, inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage
  }) => {
    await loginAsStandardUser(page); // log in as standard user and land on inventory page
    await inventoryPage.sortBy('lohi'); // sort products by price low to high
    const cheapestItemName = (await inventoryPage.inventoryItemNames.first().textContent())?.trim(); // get and normalize the name of the first (cheapest) product
    expect(cheapestItemName).toBeTruthy(); // assert the sorted list exposed a usable product name before using it
    await inventoryPage.addItemToCartByName(cheapestItemName!); // add the cheapest product to cart
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge shows 1
    await cartPage.goto(); // navigate to the cart page
    await assertCartContainsItems(cartPage, [cheapestItemName!]); // assert the cheapest product is in the cart
    await cartPage.proceedToCheckout(); // click Checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill customer info
    await checkoutStepOnePage.continue(); // proceed to step two
    await assertOrderSummaryContainsItems(checkoutStepTwoPage, [cheapestItemName!]); // assert correct item appears in order summary
    await checkoutStepTwoPage.finish(); // place the order
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!'); // assert order confirmation is shown
  });

  test('TC02 - Purchase item navigated to from product detail page', async ({
    page, inventoryPage, inventoryItemPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage
  }) => {
    await loginAsStandardUser(page); // log in as standard user
    await inventoryPage.clickItemByName(PRODUCTS.fleeceJacket); // navigate to the Fleece Jacket detail page
    await expect(inventoryItemPage.itemName).toHaveText(PRODUCTS.fleeceJacket); // assert we are on the correct product page
    await inventoryItemPage.addToCart(); // add the item from the detail page
    await expect(inventoryItemPage.cartBadge).toHaveText('1'); // assert cart badge updates
    await inventoryItemPage.goToCart(); // click the cart icon to go to the cart
    await assertCartContainsItems(cartPage, [PRODUCTS.fleeceJacket]); // assert the selected item is present in the cart
    await cartPage.proceedToCheckout(); // click Checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill customer info
    await checkoutStepOnePage.continue(); // proceed to step two
    await assertOrderSummaryContainsItems(checkoutStepTwoPage, [PRODUCTS.fleeceJacket]); // assert the selected item appears in the order summary
    await checkoutStepTwoPage.finish(); // place the order
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!'); // assert order confirmation is shown
  });

  test('TC03 - Purchase multiple items then verify cart is empty after order', async ({
    page, inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage
  }) => {
    await loginAsStandardUser(page); // log in as standard user
    await addItemsToCart(page, [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.boltTShirt]); // add three items to the cart
    await expect(inventoryPage.cartBadge).toHaveText('3'); // assert cart badge shows 3
    await cartPage.goto(); // navigate to the cart page
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.boltTShirt]); // assert all expected items are present in cart before checkout
    await cartPage.proceedToCheckout(); // click Checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill customer info
    await checkoutStepOnePage.continue(); // proceed to step two
    const count = await checkoutStepTwoPage.orderItems.count(); // count items listed in the order summary
    expect(count).toBe(3); // assert all 3 items appear in the summary
    await checkoutStepTwoPage.finish(); // place the order
    await checkoutCompletePage.backToHome(); // click Back Home
    await assertInventoryPageTitle(inventoryPage); // assert we are back on the inventory page
    await expect(inventoryPage.cartBadge).not.toBeVisible(); // assert cart badge is gone — cart is now empty
  });

  // ── Session & State ────────────────────────────────────────────────────────

  test('TC04 - Cart persists after navigating away and returning', async ({
    page, inventoryPage, cartPage
  }) => {
    await loginAsStandardUser(page); // log in as standard user
    await addItemsToCart(page, [PRODUCTS.backpack, PRODUCTS.onesie]); // add two items to cart
    await cartPage.goto(); // navigate to cart page
    await cartPage.continueShopping(); // go back to inventory page
    await assertInventoryPageTitle(inventoryPage); // assert we are on the inventory page
    await expect(inventoryPage.cartBadge).toHaveText('2'); // assert cart badge still reflects both items after navigating back
    await cartPage.goto(); // navigate back to the cart page
    const count = await cartPage.getCartItemCount(); // check how many items are still in the cart
    expect(count).toBe(2); // assert both items are still there
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack, PRODUCTS.onesie]); // assert both items are still in cart
  });

  test('TC05 - Cart persists after logout and re-login', async ({
    page, inventoryPage, cartPage
  }) => {
    await loginAsStandardUser(page); // log in as standard user
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Backpack to cart
    await expect(inventoryPage.cartBadge).toHaveText('1'); // confirm cart badge shows 1 before logout
    await inventoryPage.logout(); // log out via the burger menu
    await expect(page).toHaveURL('/'); // assert redirected to the login page
    await loginAsStandardUser(page); // log back in as the same user
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge still shows 1 — Sauce Demo retains cart state across sessions
    await cartPage.goto(); // navigate to cart after re-login
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert the same item persisted across logout/login
  });

  // ── Alternative Users ──────────────────────────────────────────────────────

  test('TC06 - Performance glitch user can complete full checkout', async ({
    page, inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage
  }) => {
    await loginAs(page, USERS.performanceGlitch.username, USERS.performanceGlitch.password); // log in as performance glitch user (slow but functional)
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Backpack to cart
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert the item was added before leaving inventory
    await cartPage.goto(); // navigate to the cart page
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert the expected item is present in cart
    await cartPage.proceedToCheckout(); // click Checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill customer info
    await checkoutStepOnePage.continue(); // proceed to step two
    await assertOrderSummaryContainsItems(checkoutStepTwoPage, [PRODUCTS.backpack]); // assert the same item appears in order summary
    await checkoutStepTwoPage.finish(); // place the order
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!'); // assert performance glitch user can complete checkout despite slowness
  });

  test('TC07 - Visual user sees correct product names in cart and order summary', async ({
    page, inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage
  }) => {
    await loginAs(page, USERS.visual.username, USERS.visual.password); // log in as visual user (may have UI anomalies but core data should be correct)
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Backpack to cart
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge updates before leaving inventory
    await cartPage.goto(); // navigate to cart page
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert correct product name is shown in cart
    await cartPage.proceedToCheckout(); // click Checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill customer info
    await checkoutStepOnePage.continue(); // proceed to step two
    await assertOrderSummaryContainsItems(checkoutStepTwoPage, [PRODUCTS.backpack]); // assert correct product name appears in order summary
  });

});
