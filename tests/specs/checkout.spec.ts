import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { PRODUCTS, CUSTOMER, CHECKOUT_ERRORS } from '../fixtures/testData'; // import product names, customer info, and error message constants
import { loginAndAddItemsToCart, assertInventoryPageTitle, assertCartContainsItems } from '../fixtures/helpers'; // import reusable helper that logs in and adds items to cart

test.describe('Checkout', () => { // group all checkout-related tests under 'Checkout'

  test.beforeEach(async ({ page, cartPage }) => {
    await loginAndAddItemsToCart(page, [PRODUCTS.backpack]); // log in, add Sauce Labs Backpack, and land on inventory page
    await cartPage.goto(); // navigate to the cart page
    await cartPage.proceedToCheckout(); // click Checkout to reach step one
  });

  // ── Checkout Step One — UI Visibility ──────────────────────────────────────

  test('TC01 - Checkout step one displays correct title and form fields', async ({ checkoutStepOnePage }) => {
    await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information'); // assert page title is correct
    await expect(checkoutStepOnePage.firstNameInput).toBeVisible(); // assert first name input is visible
    await expect(checkoutStepOnePage.lastNameInput).toBeVisible(); // assert last name input is visible
    await expect(checkoutStepOnePage.postalCodeInput).toBeVisible(); // assert postal code input is visible
    await expect(checkoutStepOnePage.cancelButton).toBeVisible(); // assert Cancel button is visible
    await expect(checkoutStepOnePage.continueButton).toBeVisible(); // assert Continue button is visible
  });

  // ── Checkout Step One — Form Validation ────────────────────────────────────

  const missingFieldCases = [ // test data for TC02-TC05 — each case leaves one field empty
    { tc: 'TC02', label: 'all fields empty',       info: { firstName: '',    lastName: '',    postalCode: '' },    error: CHECKOUT_ERRORS.firstNameRequired },
    { tc: 'TC03', label: 'missing first name',     info: CUSTOMER.missingFirstName,                               error: CHECKOUT_ERRORS.firstNameRequired },
    { tc: 'TC04', label: 'missing last name',      info: CUSTOMER.missingLastName,                                error: CHECKOUT_ERRORS.lastNameRequired },
    { tc: 'TC05', label: 'missing postal code',    info: CUSTOMER.missingPostalCode,                              error: CHECKOUT_ERRORS.postalCodeRequired },
  ];

  for (const { tc, label, info, error } of missingFieldCases) { // generate one test per missing field scenario
    test(`${tc} - Continue with ${label} shows error`, async ({ checkoutStepOnePage }) => {
      await checkoutStepOnePage.fillCustomerInfo(info.firstName, info.lastName, info.postalCode); // fill form with this scenario's data
      await checkoutStepOnePage.continue(); // click Continue to trigger validation
      await expect(checkoutStepOnePage.errorMessage).toContainText(error); // assert the correct error message is shown
    });
  }

  test('TC06 - Continue with all fields filled navigates to step two', async ({ checkoutStepOnePage, checkoutStepTwoPage, page }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill all fields with valid data
    await checkoutStepOnePage.continue(); // click Continue
    await expect(page).toHaveURL(/checkout-step-two/); // assert navigated to checkout step two
    await expect(checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview'); // assert page title is correct
  });

  // ── Checkout Step One — Navigation ─────────────────────────────────────────

  test('TC07 - Cancel on step one returns to cart page', async ({ checkoutStepOnePage, cartPage, page }) => {
    await checkoutStepOnePage.cancel(); // click Cancel on step one
    await expect(page).toHaveURL(/cart/); // assert navigated back to the cart page
    await expect(cartPage.pageTitle).toHaveText('Your Cart'); // assert page title shows 'Your Cart'
  });

  // ── Checkout Step Two — UI Visibility ──────────────────────────────────────

  test('TC08 - Checkout step two displays correct title and order summary', async ({ checkoutStepOnePage, checkoutStepTwoPage }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // complete step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await expect(checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview'); // assert page title is correct
    await expect(checkoutStepTwoPage.subtotalLabel).toBeVisible(); // assert subtotal is visible
    await expect(checkoutStepTwoPage.taxLabel).toBeVisible(); // assert tax is visible
    await expect(checkoutStepTwoPage.totalLabel).toBeVisible(); // assert total is visible
    await expect(checkoutStepTwoPage.cancelButton).toBeVisible(); // assert Cancel button is visible
    await expect(checkoutStepTwoPage.finishButton).toBeVisible(); // assert Finish button is visible
  });

  test('TC09 - Order summary shows correct items', async ({ page, cartPage, checkoutStepOnePage, checkoutStepTwoPage }) => {
    await cartPage.goto(); // go back to cart to add second item
    await cartPage.continueShopping(); // go to inventory page
    const { inventoryPage } = await (async () => { // add second item using inventory page
      const inventoryPage = { addItemToCartByName: async (name: string) => page.getByTestId('inventory-item').filter({ hasText: name }).getByRole('button', { name: 'Add to cart' }).click() };
      await inventoryPage.addItemToCartByName(PRODUCTS.bikeLight); // add Bike Light to cart
      return { inventoryPage };
    })();
    await cartPage.goto(); // return to cart
    await cartPage.proceedToCheckout(); // proceed to checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await expect(checkoutStepTwoPage.orderItemNames.filter({ hasText: PRODUCTS.backpack })).toBeVisible(); // assert Backpack is in order summary
    await expect(checkoutStepTwoPage.orderItemNames.filter({ hasText: PRODUCTS.bikeLight })).toBeVisible(); // assert Bike Light is in order summary
  });

  test('TC10 - Order summary shows correct subtotal', async ({ page, checkoutStepOnePage, checkoutStepTwoPage, cartPage }) => {
    await cartPage.goto(); // go to cart
    await cartPage.continueShopping(); // go to inventory
    await page.getByTestId('inventory-item').filter({ hasText: PRODUCTS.bikeLight }).getByRole('button', { name: 'Add to cart' }).click(); // add Bike Light ($9.99)
    await cartPage.goto(); // return to cart
    await cartPage.proceedToCheckout(); // proceed to checkout
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    const orderPriceTexts = await checkoutStepTwoPage.orderItemPrices.allTextContents(); // read item prices shown in the order summary
    const expectedSubtotal = orderPriceTexts
      .map((price) => parseFloat(price.replace(/[^0-9.]/g, '')))
      .reduce((sum, price) => sum + price, 0); // compute subtotal from the rendered item prices
    await expect(checkoutStepTwoPage.subtotalLabel).toContainText(`$${expectedSubtotal.toFixed(2)}`); // assert subtotal matches the rendered order item prices
  });

  test('TC11 - Order summary shows correct total (subtotal + tax)', async ({ checkoutStepOnePage, checkoutStepTwoPage }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    const subtotalText = await checkoutStepTwoPage.getSubtotal(); // get subtotal text
    const taxText = await checkoutStepTwoPage.getTax(); // get tax text
    const totalText = await checkoutStepTwoPage.getTotal(); // get total text
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, '')); // extract numeric subtotal value
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, '')); // extract numeric tax value
    const total = parseFloat(totalText.replace(/[^0-9.]/g, '')); // extract numeric total value
    expect(total).toBeCloseTo(subtotal + tax, 2); // assert total equals subtotal + tax (to 2 decimal places)
  });

  // ── Checkout Step Two — Navigation ─────────────────────────────────────────

  test('TC12 - Cancel on step two returns to inventory page', async ({ checkoutStepOnePage, checkoutStepTwoPage, inventoryPage, page }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.cancel(); // click Cancel on step two
    await expect(page).toHaveURL(/inventory\.html/); // assert navigated back to inventory page
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
  });

  test('TC13 - Finish button completes the order', async ({ checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage, page }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.finish(); // click Finish to place the order
    await expect(page).toHaveURL(/checkout-complete/); // assert navigated to checkout complete page
    await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!'); // assert page title is correct
  });

  // ── Checkout Complete ──────────────────────────────────────────────────────

  test('TC14 - Checkout complete page displays confirmation message', async ({ checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.finish(); // place the order
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!'); // assert confirmation header is correct
    await expect(checkoutCompletePage.completeText).toBeVisible(); // assert confirmation body text is visible
    await expect(checkoutCompletePage.ponyExpressImage).toBeVisible(); // assert pony express image is visible
  });

  test('TC15 - Back Home button returns to inventory page', async ({ checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage, inventoryPage, page }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.finish(); // place the order
    await checkoutCompletePage.backToHome(); // click Back Home button
    await expect(page).toHaveURL(/inventory\.html/); // assert navigated back to inventory page
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
    await expect(inventoryPage.cartBadge).not.toBeVisible(); // assert cart badge is no longer visible
  });

  // ── End-to-End Happy Path ──────────────────────────────────────────────────

  test('TC16 - Complete full checkout flow from login to order confirmation', async ({ checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage }) => {
    // beforeEach already logged in, added Sauce Labs Backpack, and navigated to checkout step one
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill all customer info fields
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.finish(); // place the order
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!'); // assert confirmation message is shown
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────

  test('TC17 - Dismiss error banner with X button clears the error', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.continue(); // click Continue without filling any fields to trigger validation error
    await expect(checkoutStepOnePage.errorMessage).toBeVisible(); // assert error banner is shown
    await checkoutStepOnePage.errorDismissButton.click(); // click the X button to dismiss the error
    await expect(checkoutStepOnePage.errorMessage).not.toBeVisible(); // assert error banner disappears after dismissal
  });

  test('TC18 - Cart item is preserved after cancelling checkout step one', async ({ checkoutStepOnePage, cartPage, page }) => {
    await checkoutStepOnePage.cancel(); // click Cancel on step one to return to cart
    await expect(page).toHaveURL(/cart/); // assert navigated back to cart page
    const count = await cartPage.getCartItemCount(); // get number of items in cart
    expect(count).toBe(1); // assert the backpack added in beforeEach is still in cart
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert the correct item is still listed
  });

  test('TC19 - Cart badge is correct after cancelling checkout step two', async ({ checkoutStepOnePage, checkoutStepTwoPage, inventoryPage }) => {
    await checkoutStepOnePage.fillCustomerInfo(CUSTOMER.valid.firstName, CUSTOMER.valid.lastName, CUSTOMER.valid.postalCode); // fill step one
    await checkoutStepOnePage.continue(); // proceed to step two
    await checkoutStepTwoPage.cancel(); // click Cancel on step two to return to inventory
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge still shows 1 — item not lost on cancel
  });

});
