import { Given, When, Then } from '@cucumber/cucumber'; // import Cucumber step definition decorators
import { expect } from '@playwright/test'; // import Playwright's expect for assertions
import { getWorld } from '../support/world.js'; // import helper to access page objects from the Cucumber world

// Step definitions for the Checkout feature

When('I proceed to checkout', async function () {
  const { cartPage } = getWorld(this); // get cart page object from world context
  await cartPage.proceedToCheckout(); // click the Checkout button to navigate to step one
});

Then('I should see the checkout step one page', async function () {
  const { checkoutStepOnePage } = getWorld(this); // get checkout step one page object from world context
  await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information'); // assert step one page title
});

When('I fill in the form with first name {string}, last name {string}, and postal code {string}', async function (first, last, postal) {
  const { checkoutStepOnePage } = getWorld(this); // get checkout step one page object from world context
  await checkoutStepOnePage.fillCustomerInfo(first, last, postal); // fill in the customer information form
});

When('I continue checkout', async function () {
  const { checkoutStepOnePage } = getWorld(this); // get checkout step one page object from world context
  await checkoutStepOnePage.continue(); // click the Continue button to submit the form
});

Then('I should see a checkout form error {string}', async function (errorMsg) {
  const { checkoutStepOnePage } = getWorld(this); // get checkout step one page object from world context
  await expect(checkoutStepOnePage.errorMessage).toContainText(errorMsg); // assert the validation error message is shown
});

Then('I should see the checkout step two page', async function () {
  const { checkoutStepTwoPage } = getWorld(this); // get checkout step two page object from world context
  await expect(checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview'); // assert step two page title
});

Then('the form fields should be visible', async function () {
  const { checkoutStepOnePage } = getWorld(this); // get checkout step one page object from world context
  await expect(checkoutStepOnePage.firstNameInput).toBeVisible(); // assert first name input is visible
  await expect(checkoutStepOnePage.lastNameInput).toBeVisible(); // assert last name input is visible
  await expect(checkoutStepOnePage.postalCodeInput).toBeVisible(); // assert postal code input is visible
});
