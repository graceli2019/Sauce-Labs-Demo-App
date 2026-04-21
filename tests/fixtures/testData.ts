/** Credentials for all available Sauce Demo users. */
export const USERS = { // centralised user credentials — avoids hardcoding in test files
  standard: { username: 'standard_user', password: 'secret_sauce' }, // fully functional user
  locked: { username: 'locked_out_user', password: 'secret_sauce' }, // blocked from logging in
  problem: { username: 'problem_user', password: 'secret_sauce' }, // some UI elements behave incorrectly
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' }, // login and actions are intentionally slow
  error: { username: 'error_user', password: 'secret_sauce' }, // some actions produce errors
  visual: { username: 'visual_user', password: 'secret_sauce' }, // some UI elements display incorrectly
};

/** Product names available in the Sauce Demo inventory. */
export const PRODUCTS = { // centralised product names — avoids hardcoding strings in test files
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
};

/** Customer info used for checkout form tests. */
export const CUSTOMER = { // centralised customer data for checkout form — covers valid and invalid scenarios
  valid: { firstName: 'John', lastName: 'Doe', postalCode: '12345' }, // all fields filled correctly
  missingFirstName: { firstName: '', lastName: 'Doe', postalCode: '12345' }, // first name left empty
  missingLastName: { firstName: 'John', lastName: '', postalCode: '12345' }, // last name left empty
  missingPostalCode: { firstName: 'John', lastName: 'Doe', postalCode: '' }, // postal code left empty
};

/** Expected error messages displayed on the login page. */
export const LOGIN_ERRORS = { // centralised login error strings — avoids hardcoding repeated messages in test files
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.', // shown when locked_out_user attempts to login
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service', // shown when username or password is wrong
  usernameRequired: 'Epic sadface: Username is required', // shown when username field is empty
  passwordRequired: 'Epic sadface: Password is required', // shown when password field is empty
};

/** Expected error messages displayed on the checkout step one form. */
export const CHECKOUT_ERRORS = { // centralised checkout error strings — avoids hardcoding in test files
  firstNameRequired: 'Error: First Name is required', // shown when first name field is empty
  lastNameRequired: 'Error: Last Name is required', // shown when last name field is empty
  postalCodeRequired: 'Error: Postal Code is required', // shown when postal code field is empty
};
