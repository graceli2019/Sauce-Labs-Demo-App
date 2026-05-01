import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Shared Given steps reused across multiple feature files

Given('I am on the login page', async function () {
  const { loginPage } = getWorld(this); // get login page object from world context
  await loginPage.goto(); // navigate to the login page
});

Given('I am logged in', async function () {
  const { page, loginPage, inventoryPage } = getWorld(this); // get page objects from world context
  await loginPage.goto(); // navigate to the login page
  await loginPage.login('standard_user', 'secret_sauce'); // log in as the standard user
  await expect(page).toHaveURL(/inventory/); // assert redirected to the inventory page
  await expect(inventoryPage.pageTitle).toHaveText('Products'); // assert inventory page title is visible
});

Given('I am logged in and have items in my cart', async function () {
  const { loginPage, inventoryPage, cartPage } = getWorld(this); // get page objects from world context
  await loginPage.goto(); // navigate to the login page
  await loginPage.login('standard_user', 'secret_sauce'); // log in as the standard user
  await inventoryPage.addItemToCartByName('Sauce Labs Backpack'); // add Sauce Labs Backpack to the cart
  await cartPage.goto(); // navigate to the cart page
});

When('I go to the cart page', async function () {
  const { cartPage } = getWorld(this); // get cart page object from world context
  await cartPage.goto(); // navigate directly to the cart page
});

When('I am on the inventory page', async function () {
  const { inventoryPage } = getWorld(this); // get inventory page object from world context
  await inventoryPage.goto(); // navigate directly to the inventory page
});
