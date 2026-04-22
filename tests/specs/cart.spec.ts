import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { PRODUCTS } from '../fixtures/testData'; // import product name constants
import { loginAsStandardUser, addItemsToCart, assertCartContainsItems, assertInventoryPageTitle } from '../fixtures/helpers'; // import reusable helper functions

test.describe('Cart Page', () => { // group all cart-related tests under 'Cart Page'

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page); // log in as standard user and land on inventory page before every test
  });

  // ── UI Visibility ──────────────────────────────────────────────────────────

  test('TC01 - Cart page displays correct title', async ({ cartPage, page }) => {
    await cartPage.goto(); // navigate directly to the cart page
    await expect(cartPage.pageTitle).toHaveText('Your Cart'); // assert page title shows 'Your Cart'
  });

  test('TC02 - Empty cart shows no items', async ({ cartPage, page }) => {
    await cartPage.goto(); // navigate to cart without adding any items
    const count = await cartPage.getCartItemCount(); // get number of items in cart
    expect(count).toBe(0); // assert no items are displayed
  });

  test('TC03 - Cart page displays added items correctly', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Sauce Labs Backpack to cart
    await cartPage.goto(); // navigate to the cart page
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert backpack is listed
    await expect(cartPage.cartItemQuantities.first()).toHaveText('1'); // assert quantity shows 1
    await expect(cartPage.cartItemPrices.first()).toHaveText('$29.99'); // assert correct price is shown
  });

  // ── Item Management ────────────────────────────────────────────────────────

  test('TC04 - Cart shows correct count for multiple items', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack, PRODUCTS.bikeLight]); // add two items
    await cartPage.goto(); // navigate to the cart page
    const count = await cartPage.getCartItemCount(); // get number of cart items
    expect(count).toBe(2); // assert 2 items are listed
    await expect(cartPage.cartBadge).toHaveText('2'); // assert cart badge shows 2
  });

  test('TC05 - Remove a single item from cart', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Sauce Labs Backpack
    await cartPage.goto(); // navigate to cart page
    await cartPage.removeItemByName(PRODUCTS.backpack); // click Remove on Sauce Labs Backpack
    const count = await cartPage.getCartItemCount(); // get updated cart item count
    expect(count).toBe(0); // assert cart is now empty
    await expect(cartPage.cartBadge).not.toBeVisible(); // assert cart badge disappears
  });

  test('TC06 - Remove one of multiple items from cart', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack, PRODUCTS.bikeLight]); // add two items
    await cartPage.goto(); // navigate to cart page
    await cartPage.removeItemByName(PRODUCTS.backpack); // remove only Sauce Labs Backpack
    await assertCartContainsItems(cartPage, [PRODUCTS.bikeLight]); // assert Bike Light remains
    await expect(cartPage.cartItemNames.filter({ hasText: PRODUCTS.backpack })).not.toBeVisible(); // assert Backpack is gone
    await expect(cartPage.cartBadge).toHaveText('1'); // assert cart badge shows 1
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test('TC07 - Continue Shopping button returns to inventory page', async ({ cartPage, inventoryPage, page }) => {
    await cartPage.goto(); // navigate to cart page
    await cartPage.continueShopping(); // click Continue Shopping
    await expect(page).toHaveURL(/inventory\.html/); // assert navigated back to inventory page
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
  });

  test('TC08 - Previously added items are retained after continuing shopping', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack]); // add Sauce Labs Backpack
    await cartPage.goto(); // navigate to cart page
    await cartPage.continueShopping(); // click Continue Shopping
    await cartPage.goto(); // navigate back to cart page
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert Backpack is still in cart
  });

  test('TC09 - Checkout button navigates to checkout step one', async ({ cartPage, checkoutStepOnePage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack]); // add at least one item to cart
    await cartPage.goto(); // navigate to cart page
    await cartPage.proceedToCheckout(); // click Checkout button
    await expect(page).toHaveURL(/checkout-step-one/); // assert navigated to checkout step one
    await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information'); // assert page title is correct
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────

  test('TC10 - Checkout with empty cart still navigates to step one', async ({ cartPage, checkoutStepOnePage, page }) => {
    await cartPage.goto(); // navigate to cart without adding any items
    await cartPage.proceedToCheckout(); // click Checkout with zero items in cart
    await expect(page).toHaveURL(/checkout-step-one/); // assert Sauce Demo allows proceeding (no client-side guard)
    await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information'); // assert step one page loads
  });

  test('TC11 - Remove all items from cart leaves cart empty with no badge', async ({ cartPage, page }) => {
    await addItemsToCart(page, [PRODUCTS.backpack, PRODUCTS.bikeLight]); // add two items
    await cartPage.goto(); // navigate to cart page
    await cartPage.removeItemByName(PRODUCTS.backpack); // remove first item
    await cartPage.removeItemByName(PRODUCTS.bikeLight); // remove second item
    const count = await cartPage.getCartItemCount(); // get updated cart item count
    expect(count).toBe(0); // assert cart is completely empty
    await expect(cartPage.cartBadge).not.toBeVisible(); // assert cart badge disappears when all items are removed
  });

});
