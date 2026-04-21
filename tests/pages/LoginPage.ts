import { Page, Locator } from '@playwright/test'; // import Page and Locator types from Playwright

export class LoginPage { // page object for the login page — does not extend BasePage as it has no header
  readonly page: Page; // holds the Playwright browser page instance

  readonly usernameInput: Locator; // username text input field
  readonly passwordInput: Locator; // password text input field
  readonly loginButton: Locator; // Login submit button
  readonly errorMessage: Locator; // error banner shown when login fails
  readonly logo: Locator; // Swag Labs logo at the top of the login page
  readonly credentialsHint: Locator; // accepted usernames hint text at the bottom of the page
  readonly passwordHint: Locator; // password hint text at the bottom of the page

  constructor(page: Page) { // constructor receives the Playwright page and assigns all locators
    this.page = page; // store the page reference for navigation in goto()

    this.usernameInput = page.locator('#user-name'); // locate username input by its ID
    this.passwordInput = page.locator('#password'); // locate password input by its ID
    this.loginButton = page.locator('#login-button'); // locate login button by its ID
    this.errorMessage = page.locator('[data-test="error"]'); // locate error message by data-test attribute
    this.logo = page.locator('.login_logo'); // locate Swag Labs logo by its class
    this.credentialsHint = page.locator('.login_credentials'); // locate accepted usernames hint by its class
    this.passwordHint = page.locator('.login_password'); // locate password hint by its class
  }

  /** Navigates directly to the login page (/). */
  async goto(): Promise<void> {
    await this.page.goto('/'); // navigate to the root path — combined with baseURL in playwright.config.ts
  }

  /** Fills in the username and password fields, then clicks the Login button. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username); // type the username into the username input field
    await this.passwordInput.fill(password); // type the password into the password input field
    await this.loginButton.click(); // click the Login button to submit the form
  }

  /** Returns the text of the error message shown after a failed login attempt. */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() ?? ''; // read error message text — fallback to empty string if not present
  }
}
