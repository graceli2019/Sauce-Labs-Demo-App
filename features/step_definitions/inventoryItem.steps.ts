import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Step definitions for the Inventory Item (product detail) feature

Given('I am viewing the details for {string}', async function (itemName) {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  await inventoryPage.clickItemByName(itemName); // click the product name link to navigate to its detail page
});

Then('I should see the product name, description, price, image, Add to Cart button, and Back to Products button', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await expect(inventoryItemPage.itemName).toBeVisible(); // assert product name is visible
  await expect(inventoryItemPage.itemDescription).toBeVisible(); // assert product description is visible
  await expect(inventoryItemPage.itemPrice).toBeVisible(); // assert product price is visible
  await expect(inventoryItemPage.itemImage).toBeVisible(); // assert product image is visible
  await expect(inventoryItemPage.addToCartButton).toBeVisible(); // assert Add to Cart button is visible
  await expect(inventoryItemPage.backToProductsButton).toBeVisible(); // assert Back to Products button is visible
});

When('I add the item to the cart', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await inventoryItemPage.addToCart(); // click the Add to Cart button on the detail page
});

Then('the cart badge should show 1', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await expect(inventoryItemPage.cartBadge).toHaveText('1'); // assert cart badge counter shows 1
});

Then('the Remove button should be visible', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await expect(inventoryItemPage.removeButton).toBeVisible(); // assert button changed to Remove after adding to cart
});

When('I remove the item from the cart', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await inventoryItemPage.removeFromCart(); // click the Remove button on the detail page
});

Then('the cart badge should not be visible', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await expect(inventoryItemPage.cartBadge).not.toBeVisible(); // assert cart badge disappears after removal
});

Then('the Add to Cart button should be visible', async function () {
  const { inventoryItemPage } = getWorld(this); // get product detail page object from world context
  await expect(inventoryItemPage.addToCartButton).toBeVisible(); // assert button reverts to Add to Cart after removal
});
