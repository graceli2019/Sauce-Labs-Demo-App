import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { PRODUCTS } from '../fixtures/testData'; // import product name constants
import { loginAsStandardUser, assertInventoryPageTitle, assertCartContainsItems } from '../fixtures/helpers'; // import reusable login helper

test.describe('Inventory Item Page', () => { // group all product detail page tests under 'Inventory Item Page'

  test.beforeEach(async ({ page, inventoryPage }) => {
    await loginAsStandardUser(page); // log in as standard user and land on inventory page
    await inventoryPage.clickItemByName(PRODUCTS.backpack); // navigate to Sauce Labs Backpack detail page
  });

  // ── UI Visibility ──────────────────────────────────────────────────────────

  test('TC01 - Product detail page displays all elements', async ({ inventoryItemPage }) => {
    await expect(inventoryItemPage.itemName).toBeVisible(); // assert product name is visible
    await expect(inventoryItemPage.itemDescription).toBeVisible(); // assert product description is visible
    await expect(inventoryItemPage.itemPrice).toBeVisible(); // assert product price is visible
    await expect(inventoryItemPage.itemImage).toBeVisible(); // assert product image is visible
    await expect(inventoryItemPage.addToCartButton).toBeVisible(); // assert Add to Cart button is visible
    await expect(inventoryItemPage.backToProductsButton).toBeVisible(); // assert Back to Products button is visible
  });

  test('TC02 - Product detail page shows correct product name and price', async ({ inventoryItemPage }) => {
    await expect(inventoryItemPage.itemName).toHaveText(PRODUCTS.backpack); // assert product name matches Sauce Labs Backpack
    await expect(inventoryItemPage.itemPrice).toHaveText('$29.99'); // assert product price is correct
  });

  // ── Add to Cart / Remove ───────────────────────────────────────────────────

  test('TC03 - Add item to cart from product detail page', async ({ inventoryItemPage }) => {
    await inventoryItemPage.addToCart(); // click Add to Cart on the detail page
    await expect(inventoryItemPage.cartBadge).toHaveText('1'); // assert cart badge shows 1
    await expect(inventoryItemPage.removeButton).toBeVisible(); // assert button changed to Remove
  });

  test('TC04 - Remove item from cart on product detail page', async ({ inventoryItemPage }) => {
    await inventoryItemPage.addToCart(); // add the item to cart first
    await inventoryItemPage.removeFromCart(); // then click Remove
    await expect(inventoryItemPage.cartBadge).not.toBeVisible(); // assert cart badge disappears
    await expect(inventoryItemPage.addToCartButton).toBeVisible(); // assert button changed back to Add to Cart
  });

  test('TC05 - Add to cart button state is consistent between inventory and detail page', async ({ inventoryPage, inventoryItemPage }) => {
    await inventoryItemPage.addToCart(); // add Sauce Labs Backpack from the detail page
    await inventoryItemPage.backToProducts(); // navigate back to inventory page
    const item = inventoryPage.inventoryItems.filter({ hasText: PRODUCTS.backpack }); // find the backpack product card
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible(); // assert button shows Remove on inventory page too
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge shows 1 on inventory page
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test('TC06 - Back to products button returns to inventory page', async ({ inventoryItemPage, inventoryPage, page }) => {
    await inventoryItemPage.backToProducts(); // click Back to Products button
    await expect(page).toHaveURL(/inventory\.html/); // assert navigated back to the inventory page
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
  });

  test('TC07 - Navigate to cart from product detail page via cart icon', async ({ inventoryItemPage, page }) => {
    await inventoryItemPage.goToCart(); // click the cart icon in the header
    await expect(page).toHaveURL(/cart/); // assert navigated to the cart page
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────

  test('TC08 - Item added from detail page appears correctly in cart', async ({ inventoryItemPage, cartPage }) => {
    await inventoryItemPage.addToCart(); // add Sauce Labs Backpack from the detail page
    await inventoryItemPage.goToCart(); // navigate to cart via the cart icon
    const count = await cartPage.getCartItemCount(); // get number of items in cart
    expect(count).toBe(1); // assert exactly 1 item is in cart
    await assertCartContainsItems(cartPage, [PRODUCTS.backpack]); // assert the correct product is listed in cart
  });

  test('TC09 - Item added from inventory page can be removed on its detail page', async ({ inventoryPage, inventoryItemPage }) => {
    await inventoryItemPage.backToProducts(); // return to inventory page
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack); // add Sauce Labs Backpack from the inventory page
    await expect(inventoryPage.cartBadge).toHaveText('1'); // assert cart badge shows 1
    await inventoryPage.clickItemByName(PRODUCTS.backpack); // navigate to the backpack detail page
    await inventoryItemPage.removeFromCart(); // click Remove on the detail page
    await expect(inventoryItemPage.cartBadge).not.toBeVisible(); // assert cart badge disappears
    await expect(inventoryItemPage.addToCartButton).toBeVisible(); // assert button reverted to Add to Cart
  });

});
