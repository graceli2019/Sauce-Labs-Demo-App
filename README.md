# Sauce Labs Demo App — Playwright Test Framework

[![Playwright Tests](https://github.com/graceli2019/Sauce-Labs-Demo-App/actions/workflows/playwright.yml/badge.svg)](https://github.com/graceli2019/Sauce-Labs-Demo-App/actions/workflows/playwright.yml)

An end-to-end test automation framework for [saucedemo.com](https://www.saucedemo.com), built with [Playwright](https://playwright.dev) and TypeScript using the **Page Object Model (POM)** pattern.

---

## Tech Stack

| Tool | Version |
|---|---|
| [Playwright](https://playwright.dev) | ^1.59.1 |
| TypeScript | via `@types/node` |
| Node.js | 20 (LTS) |
| CI | GitHub Actions |

---

## Project Structure

```
├── tests/
│   ├── pages/                  # Page Object classes
│   │   ├── BasePage.ts         # Shared header/burger menu methods
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── InventoryItemPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── fixtures/
│   │   ├── pageObjects.ts      # Extended test fixture — injects all page objects
│   │   ├── testData.ts         # Centralised test data (users, products, customer info, errors)
│   │   └── helpers.ts          # Reusable multi-step helper functions
│   ├── specs/                  # Test files
│   │   ├── login.spec.ts       # 14 test cases
│   │   ├── inventory.spec.ts   # 12 test cases
│   │   ├── inventoryItem.spec.ts # 7 test cases
│   │   ├── cart.spec.ts        # 9 test cases
│   │   ├── checkout.spec.ts    # 16 test cases
│   │   └── e2e.spec.ts         # 7 end-to-end journeys
│   └── scenarios/              # Plain-text test scenario files (Given/When/Then)
│       ├── login.txt
│       ├── inventory.txt
│       ├── inventoryItem.txt
│       ├── cart.txt
│       ├── checkout.txt
│       └── e2e.txt
├── playwright.config.ts
├── package.json
└── .github/
    └── workflows/
        └── playwright.yml      # GitHub Actions CI workflow
```

---

## Test Coverage

| Spec | Areas Covered | TCs |
|---|---|---|
| `login.spec.ts` | Successful login (all users), locked out, invalid credentials, empty fields, logout, UI visibility | 14 |
| `inventory.spec.ts` | Page title, product count, card elements, sorting (A-Z, Z-A, price), add/remove cart, navigation | 12 |
| `inventoryItem.spec.ts` | UI visibility, correct name/price, add/remove cart, button state, back navigation, cart icon | 7 |
| `cart.spec.ts` | Page title, empty cart, item display, multi-item count, remove item(s), continue shopping, checkout | 9 |
| `checkout.spec.ts` | Form validation, step one/two UI, order summary, totals, cancel/finish navigation, complete page | 16 |
| `e2e.spec.ts` | Sort → purchase, detail page → checkout, multi-item order, cart persistence, logout, alternate users | 7 |
| **Total** | | **65** |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- npm

### Install

```bash
npm ci
npx playwright install --with-deps
```

### Run All Tests

```bash
npx playwright test
```

### Run a Specific Spec File

```bash
npx playwright test tests/specs/login.spec.ts
```

### Run in a Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run in Headed Mode (see the browser)

```bash
npx playwright test --headed
```

### View the HTML Report

```bash
npx playwright show-report
```

---

## CI/CD

Tests run automatically on every push and pull request to `main` via **GitHub Actions**.

The workflow:
1. Checks out the code
2. Installs Node.js dependencies
3. Installs Playwright browsers
4. Runs all tests
5. Uploads the HTML report as a downloadable artifact (retained for 30 days)

View runs: [Actions tab](../../actions)

---

## Key Design Decisions

**Page Object Model** — each page has its own class with locators and action methods, keeping test logic clean and separate from page structure.

**Fixture injection** — `pageObjects.ts` extends Playwright's base `test` with all 7 page objects pre-instantiated, so every spec file receives them as parameters without manual `new` calls.

**Centralised test data** — `testData.ts` holds all users, product names, customer info, and error messages as typed constants, avoiding hardcoded strings scattered across spec files.

**Reusable helpers** — `helpers.ts` contains multi-step functions (e.g. `loginAsStandardUser`, `addItemsToCart`, `loginAndAddItemsToCart`) shared across specs to reduce duplication.

---

## Test Users

| Username | Behaviour |
|---|---|
| `standard_user` | Fully functional |
| `locked_out_user` | Blocked from logging in |
| `problem_user` | Some UI interactions behave incorrectly |
| `performance_glitch_user` | Login and actions are intentionally slow |
| `error_user` | Some actions produce errors |
| `visual_user` | Some UI elements display incorrectly |

All users share the password: `secret_sauce`
