import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Step definitions for the Cart feature

When('I add {string} to the cart', async function (itemName) {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  await inventoryPage.addItemToCartByName(itemName); // find the product card by name and click Add to Cart
});

Then('the cart should be empty', async function () {
  const { cartPage } = getWorld(this); // get cart page object from world context
  const count = await cartPage.getCartItemCount(); // count items currently listed in the cart
  expect(count).toBe(0); // assert no items are shown
});

Then('the cart should contain {string}', async function (itemName) {
  const { cartPage } = getWorld(this); // get cart page object from world context
  await expect(cartPage.cartItemNames.filter({ hasText: itemName })).toBeVisible(); // assert the named item is listed in the cart
});

When('I remove {string} from the cart', async function (itemName) {
  const { cartPage } = getWorld(this); // get cart page object from world context
  await cartPage.removeItemByName(itemName); // click the Remove button for the named item
});

Then('I should see the cart title {string}', async function (title) {
  const { cartPage } = getWorld(this); // get cart page object from world context
  await expect(cartPage.pageTitle).toHaveText(title); // assert the cart page heading matches the expected title
});
