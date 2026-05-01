import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Step definitions for the Login feature

When('I log in as {string} with password {string}', async function (username, password) {
  const { loginPage } = getWorld(this); // get login page object from world context
  await loginPage.login(username, password); // fill in credentials and click Login
});

Then('I should see the inventory page', async function () {
  const { page, inventoryPage } = getWorld(this); // get page objects from world context
  await expect(page).toHaveURL(/inventory/); // assert URL contains 'inventory'
  await expect(inventoryPage.pageTitle).toHaveText('Products'); // assert inventory page title shows 'Products'
});

Then('I should see an error message {string}', async function (errorMsg) {
  const { loginPage } = getWorld(this); // get login page object from world context
  const actual = await loginPage.getErrorMessage(); // read the error banner text
  expect(actual).toContain(errorMsg); // assert error message contains the expected text
});
