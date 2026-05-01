import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Step definitions for the Inventory feature

Then('I should see the inventory title {string}', async function (title) {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  await expect(inventoryPage.pageTitle).toHaveText(title); // assert the inventory page heading matches the expected title
});

Then('I should see all products listed', async function () {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  const count = await inventoryPage.getItemCount(); // count the number of product cards on the page
  expect(count).toBeGreaterThan(0); // assert at least one product is displayed
});

Then('each product card should show name, price, and Add to Cart button', async function () {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  const itemCount = await inventoryPage.getItemCount(); // get the total number of product cards
  for (let i = 0; i < itemCount; i++) { // iterate over each product card
    const item = inventoryPage.inventoryItems.nth(i); // get the nth product card
    await expect(item.getByTestId('inventory-item-name')).toBeVisible(); // assert product name is visible
    await expect(item.getByTestId('inventory-item-price')).toBeVisible(); // assert product price is visible
    await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible(); // assert Add to Cart button is visible
  }
});

Then('products should be sorted A-Z by default', async function () {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  const names = await inventoryPage.inventoryItemNames.allTextContents(); // get all product name texts
  const sorted = [...names].sort(); // create a copy sorted A-Z
  expect(names).toEqual(sorted); // assert displayed order matches A-Z sorted order
});
