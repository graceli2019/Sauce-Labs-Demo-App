import { Before, After, setDefaultTimeout } from '@cucumber/cucumber'; // import Cucumber lifecycle hooks and timeout setter
import { chromium, Browser, selectors } from '@playwright/test'; // import Playwright browser launcher and selectors API

setDefaultTimeout(30_000); // set global step timeout to 30 seconds to allow Playwright actions to complete

let browser: Browser; // shared browser instance reused across Before/After hooks

// Before hook — runs before every scenario
// launches a new Chromium browser, creates a context with baseURL, and opens a fresh page
Before(async function () {
  selectors.setTestIdAttribute('data-test'); // override default testId attribute to match app's data-test attribute
  browser = await chromium.launch(); // launch a headless Chromium browser instance
  const context = await browser.newContext({ baseURL: 'https://www.saucedemo.com' }); // create a browser context with the app's base URL
  this.page = await context.newPage(); // open a new page and attach it to the Cucumber world
});

// After hook — runs after every scenario
// closes the page and browser to release resources
After(async function () {
  await this.page?.close(); // close the page if it was opened
  await browser?.close(); // close the browser instance
});
