import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { PRODUCTS } from '../fixtures/testData'; // import product name and user constants
import { loginAsStandardUser, assertInventoryPageTitle } from '../fixtures/helpers'; // import reusable login helper

test.describe('Inventory Page', () => { // group all inventory-related tests under 'Inventory Page'

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page); // log in as standard user and land on inventory page before every test
  });

  // ── UI Visibility ──────────────────────────────────────────────────────────

  test('TC01 - Inventory page displays correct title', async ({ inventoryPage }) => {
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
  });

  test('TC02 - Inventory page displays 6 products', async ({ inventoryPage }) => {
    const count = await inventoryPage.getItemCount(); // get total number of product cards
    expect(count).toBe(6); // assert exactly 6 products are displayed
  });

  test('TC03 - Each product card displays name, price and Add to Cart button', async ({ inventoryPage }) => {
    const itemCount = await inventoryPage.getItemCount(); // get number of product cards
    for (let i = 0; i < itemCount; i++) { // iterate over each product card
      const item = inventoryPage.inventoryItems.nth(i); // get the nth product card
      await expect(item.getByTestId('inventory-item-name')).toBeVisible(); // assert product name is visible
      await expect(item.getByTestId('inventory-item-price')).toBeVisible(); // assert product price is visible
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible(); // assert Add to Cart button is visible
    }
  });

  // ── Sorting ────────────────────────────────────────────────────────────────

  test('TC04 - Products are sorted A-Z by default', async ({ inventoryPage }) => {
    const names = await inventoryPage.inventoryItemNames.allTextContents(); // get all product name texts
    const sorted = [...names].sort(); // create a sorted copy A-Z
    expect(names).toEqual(sorted); // assert the displayed order matches A-Z sorted order
  });

  test('TC05 - Sort products by name Z-A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za'); // select Z-A sort option
    const names = await inventoryPage.inventoryItemNames.allTextContents(); // get all product name texts after sorting
    const sorted = [...names].sort().reverse(); // create a sorted copy Z-A
    expect(names).toEqual(sorted); // assert the displayed order matches Z-A sorted order
  });

  test('TC06 - Sort products by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi'); // select price low-to-high sort option
    const priceTexts = await inventoryPage.inventoryItemPrices.allTextContents(); // get all price texts
    const prices = priceTexts.map(p => parseFloat(p.replace('$', ''))); // convert price strings to numbers
    const sorted = [...prices].sort((a, b) => a - b); // create ascending sorted copy
    expect(prices).toEqual(sorted); // assert prices are displayed in ascending order
  });

  test('TC07 - Sort products by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo'); // select price high-to-low sort option
    const priceTexts = await inventoryPage.inventoryItemPrices.allTextContents(); // get all price texts
    const prices = priceTexts.map(p => parseFloat(p.replace('$', ''))); // convert price strings to numbers
    const sorted = [...prices].sort((a, b) => b - a); // create descending sorted copy
    expect(prices).toEqual(sorted); // assert prices are displayed in descending order
  });

  // ── Add to Cart ────────────────────────────────────────────────────────────

  test('TC08 - Add a single item to cart from inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack); // click Add to Cart for Sauce Labs Backpack
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge shows 1
    const item = inventoryPage.inventoryItems.filter({ hasText: PRODUCTS.backpack }); // find the backpack product card
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible(); // assert button changed to Remove
  });

  test('TC09 - Add multiple items to cart from inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack); // add Sauce Labs Backpack
    await inventoryPage.addItemToCartByName(PRODUCTS.bikeLight); // add Sauce Labs Bike Light
    await expect(inventoryPage.cartBadge).toHaveText('2'); // assert cart badge shows 2
  });

  test('TC10 - Remove an item from cart via inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack); // add Sauce Labs Backpack first
    await inventoryPage.removeItemFromCartByName(PRODUCTS.backpack); // click Remove on that product card
    await expect(inventoryPage.cartBadge).not.toBeVisible(); // assert cart badge disappears
    const item = inventoryPage.inventoryItems.filter({ hasText: PRODUCTS.backpack }); // find the backpack product card
    await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible(); // assert button changed back to Add to Cart
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test('TC11 - Click product name navigates to product detail page', async ({ inventoryPage, inventoryItemPage, page }) => {
    await inventoryPage.clickItemByName(PRODUCTS.backpack); // click on Sauce Labs Backpack product name
    await expect(page).toHaveURL(/inventory-item/); // assert navigated to the product detail page
    await expect(inventoryItemPage.itemName).toHaveText(PRODUCTS.backpack); // assert product name matches on detail page
  });

  test('TC12 - Navigate to cart via cart icon', async ({ inventoryPage, page }) => {
    await inventoryPage.goToCart(); // click the cart icon in the header
    await expect(page).toHaveURL(/cart/); // assert navigated to the cart page
  });

  // ── Cart badge initial state ───────────────────────────────────────────────

  test('TC13 - Cart badge is not visible when no items are in the cart', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).not.toBeVisible(); // assert no badge shown on a fresh session
  });

  test('TC14 - Add all 6 items to cart shows badge count of 6', async ({ inventoryPage }) => {
    for (const name of Object.values(PRODUCTS)) { // iterate over all 6 product names
      await inventoryPage.addItemToCartByName(name); // add each product to the cart
    }
    await expect(inventoryPage.cartBadge).toHaveText('6'); // assert badge shows 6
  });

  // ── Sort dropdown ──────────────────────────────────────────────────────────

  test('TC15 - Sort dropdown is visible and has 4 options', async ({ inventoryPage }) => {
    await expect(inventoryPage.sortDropdown).toBeVisible(); // assert sort dropdown is present
    await expect(inventoryPage.sortDropdown.locator('option')).toHaveCount(4); // assert exactly 4 sort options exist
  });

  test('TC16 - Default sort option is A to Z', async ({ inventoryPage }) => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az'); // assert default selected value is az (A-Z)
  });

});

// ── Access control (no login required) ──────────────────────────────────────

test.describe('Inventory Page - Access Control', () => {

  test('TC17 - Unauthenticated user is redirected from inventory to login page', async ({ page }) => {
    await page.goto('/inventory.html'); // attempt to navigate directly to inventory without logging in
    await expect(page).toHaveURL('/'); // assert redirected back to the login page
  });

});
