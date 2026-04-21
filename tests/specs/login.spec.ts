import { test, expect } from '../fixtures/pageObjects'; // import extended test runner with all page objects and expect assertion
import { USERS, LOGIN_ERRORS } from '../fixtures/testData'; // import user credentials and error message constants
import { loginAs, loginAsStandardUser, assertOnLoginPage, assertLoginError, assertInventoryPageTitle } from '../fixtures/helpers'; // import reusable helper functions

test.describe('Login Page', () => { // group all login-related tests under 'Login Page'

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto(); // navigate to the login page before every test
  });

  // ── Successful logins ──────────────────────────────────────────────────────

  test('TC01 - Successful login with standard user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password); // fill in credentials and click Login
    await assertInventoryPageTitle(inventoryPage); // assert page title shows 'Products'
  });

  const otherSuccessUsers = [ // test data for TC02-TC05 — same structure, different user each time
    { tc: 'TC02', label: 'problem user',           user: USERS.problem },
    { tc: 'TC03', label: 'performance glitch user', user: USERS.performanceGlitch },
    { tc: 'TC04', label: 'error user',              user: USERS.error },
    { tc: 'TC05', label: 'visual user',             user: USERS.visual },
  ];

  for (const { tc, label, user } of otherSuccessUsers) { // generate one test per user
    test(`${tc} - Successful login with ${label}`, async ({ page }) => {
      await loginAs(page, user.username, user.password); // login with this user's credentials and land on inventory page
    });
  }

  // ── Failed logins ──────────────────────────────────────────────────────────

  test('TC06 - Locked out user cannot login', async ({ loginPage, page }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password); // attempt login as locked_out_user
    await assertOnLoginPage(page); // assert user stays on the login page
    await assertLoginError(loginPage, LOGIN_ERRORS.lockedOut); // assert locked out error message
  });

  const invalidCredentialCases = [ // test data for TC07/TC08/TC09 — all expect the same error, with different credential combinations
    { tc: 'TC07', label: 'wrong password',                    username: USERS.standard.username, password: 'Wr0ng@Pass!' },
    { tc: 'TC08', label: 'wrong username',                    username: 'Invalid@User#1',        password: USERS.standard.password },
    { tc: 'TC09', label: 'both username and password wrong',  username: 'Invalid@User#1',        password: 'Wr0ng@Pass!' },
  ];

  for (const { tc, label, username, password } of invalidCredentialCases) { // generate one test per invalid credential combination
    test(`${tc} - Login with ${label}`, async ({ loginPage, page }) => {
      await loginPage.login(username, password); // attempt login with this invalid combination
      await assertOnLoginPage(page); // assert user stays on the login page
      await assertLoginError(loginPage, LOGIN_ERRORS.invalidCredentials); // assert credentials mismatch error
    });
  }

  // ── Empty field validation ─────────────────────────────────────────────────

  test('TC10 - Login with empty username', async ({ loginPage, page }) => {
    await loginPage.login('', USERS.standard.password); // submit form with username left empty
    await assertOnLoginPage(page); // assert user stays on the login page
    await assertLoginError(loginPage, LOGIN_ERRORS.usernameRequired); // assert username required error
  });

  test('TC11 - Login with empty password', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard.username, ''); // submit form with password left empty
    await assertOnLoginPage(page); // assert user stays on the login page
    await assertLoginError(loginPage, LOGIN_ERRORS.passwordRequired); // assert password required error
  });

  test('TC12 - Login with both fields empty', async ({ loginPage, page }) => {
    await loginPage.login('', ''); // submit form with both fields empty
    await assertOnLoginPage(page); // assert user stays on the login page
    await assertLoginError(loginPage, LOGIN_ERRORS.usernameRequired); // assert username is checked first
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  test('TC13 - Logout and return to login page', async ({ loginPage, inventoryPage, page }) => {
    await loginAsStandardUser(page); // login as standard user and land on inventory page
    await inventoryPage.logout(); // open burger menu and click Logout
    await assertOnLoginPage(page); // assert redirected back to login page
    await expect(loginPage.usernameInput).toHaveValue(''); // assert username field is cleared after logout
    await expect(loginPage.passwordInput).toHaveValue(''); // assert password field is cleared after logout
  });

  // ── UI visibility ──────────────────────────────────────────────────────────

  test('TC14 - Login page UI elements are visible', async ({ loginPage }) => {
    await expect(loginPage.logo).toBeVisible(); // assert Swag Labs logo is visible
    await expect(loginPage.usernameInput).toBeVisible(); // assert username input field is visible
    await expect(loginPage.passwordInput).toBeVisible(); // assert password input field is visible
    await expect(loginPage.loginButton).toBeVisible(); // assert Login button is visible
    await expect(loginPage.credentialsHint).toBeVisible(); // assert accepted usernames hint is visible
    await expect(loginPage.passwordHint).toBeVisible(); // assert password hint is visible
  });

});
