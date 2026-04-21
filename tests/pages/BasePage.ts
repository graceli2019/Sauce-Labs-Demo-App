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

    this.cartIcon = page.locator('.shopping_cart_link'); // locate cart icon by its CSS class
    this.cartBadge = page.locator('.shopping_cart_badge'); // locate cart count badge by its CSS class

    this.burgerMenuButton = page.locator('#react-burger-menu-btn'); // locate burger menu button by its ID
    this.burgerMenuAllItems = page.locator('#inventory_sidebar_link'); // locate All Items link by its ID
    this.burgerMenuAbout = page.locator('#about_sidebar_link'); // locate About link by its ID
    this.burgerMenuLogout = page.locator('#logout_sidebar_link'); // locate Logout link by its ID
    this.burgerMenuResetAppState = page.locator('#reset_sidebar_link'); // locate Reset App State link by its ID
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
