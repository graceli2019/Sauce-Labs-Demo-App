import { Page, Locator } from '@playwright/test'; // import Page (browser page) and Locator (element reference) types from Playwright

export class BasePage { // base class shared by all pages that have a header and burger menu
  readonly page: Page; // holds the Playwright browser page instance — used by all child pages

  // Header
  readonly cartIcon: Locator; // shopping cart icon in the top-right header
  readonly cartBadge: Locator; // red badge showing the number of items in the cart

  // Burger menu
  readonly burgerMenuButton: Locator; // hamburger icon button that opens the side menu
  readonly burgerMenuAllItems: Locator; // 'All Items' link inside the burger menu
  readonly burgerMenuAbout: Locator; // 'About' link inside the burger menu (navigates externally)
  readonly burgerMenuLogout: Locator; // 'Logout' link inside the burger menu
  readonly burgerMenuResetAppState: Locator; // 'Reset App State' link that clears cart and button states

  constructor(page: Page) { // constructor receives the Playwright page and stores it for all locators
    this.page = page; // save the page reference so child classes can access it via this.page

    this.cartIcon = page.getByTestId('shopping-cart-link'); // locate cart icon by stable test id
    this.cartBadge = page.getByTestId('shopping-cart-badge'); // locate cart count badge by stable test id

    this.burgerMenuButton = page.getByRole('button', { name: /open menu/i }); // locate burger menu button by accessible role and name
    this.burgerMenuAllItems = page.getByRole('link', { name: 'All Items' }); // locate All Items link by role and visible text
    this.burgerMenuAbout = page.getByRole('link', { name: 'About' }); // locate About link by role and visible text
    this.burgerMenuLogout = page.getByRole('link', { name: 'Logout' }); // locate Logout link by role and visible text
    this.burgerMenuResetAppState = page.getByRole('link', { name: 'Reset App State' }); // locate Reset App State link by role and visible text
  }

  /** Opens the burger (hamburger) side menu in the header. */
  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click(); // click the hamburger icon to expand the side menu
  }

  /** Opens the burger menu and clicks Logout, returning to the login page. */
  async logout(): Promise<void> {
    await this.openBurgerMenu(); // open the side menu first before clicking any menu item
    await this.burgerMenuLogout.click(); // click Logout — redirects to the login page
  }

  /** Opens the burger menu and clicks Reset App State, clearing cart and item states. */
  async resetAppState(): Promise<void> {
    await this.openBurgerMenu(); // open the side menu first before clicking any menu item
    await this.burgerMenuResetAppState.click(); // click Reset App State — clears cart and resets all buttons
  }

  /** Opens the burger menu and clicks All Items, navigating to the inventory page. */
  async goToAllItems(): Promise<void> {
    await this.openBurgerMenu(); // open the side menu first before clicking any menu item
    await this.burgerMenuAllItems.click(); // click All Items — navigates back to the inventory page
  }

  /** Clicks the cart icon in the header, navigating to the cart page. */
  async goToCart(): Promise<void> {
    await this.cartIcon.click(); // click the cart icon to navigate to the cart page
  }

  /** Returns the number displayed on the cart badge (item count). Returns '0' if the badge is not visible. */
  async getCartCount(): Promise<string> {
    return await this.cartBadge.textContent() ?? '0'; // read badge text — fallback to '0' if badge is hidden (empty cart)
  }
}
