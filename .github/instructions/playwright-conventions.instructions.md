---
applyTo: "tests/**/*.ts"
description: "Playwright TypeScript conventions for robust, maintainable tests in this repository."
---
## Purpose
Keep Playwright tests reliable, debuggable, and easy to maintain.

## Selector Strategy
- Prefer semantic locators over CSS/XPath:
  - `getByRole` with accessible name first.
  - `getByLabel` and `getByPlaceholder` for forms.
  - `getByTestId` when semantic locators are not stable.
  - `getByText` only for stable, user-visible copy and prefer exact text when feasible.
- Avoid brittle selectors:
  - Deep CSS chains.
  - Positional selectors like `nth-child`.
  - Partial text matches for dynamic UI copy.
  - Selectors tied to presentational classes.

## Assertions and Waiting
- Use Playwright auto-waiting and web-first assertions (`expect(locator)...`) instead of manual sleeps.
- Do not use fixed delays (for example, `waitForTimeout`) in committed test code.
- If a temporary diagnostic delay is unavoidable, annotate it with a `TODO` and remove it before finalizing.
- Assert outcomes, not just intermediate UI states.
- Prefer one strong outcome assertion over many weak visibility checks.

## Test Structure
- Keep tests deterministic and isolated.
- Put reusable UI actions in page objects.
- Keep assertions near the behavior they validate.
- Use clear test titles with behavior and expected result.
- Keep one user journey per test unless the scenario explicitly validates cross-journey behavior.

## Data and Fixtures
- Keep test data explicit and local to scenario context.
- Reuse fixtures/helpers for setup and shared flows.
- Avoid hidden coupling between tests through shared mutable state.

## Failure Diagnostics
- On failure, provide context in assertion messages when practical.
- Prefer locators and assertions that produce clear error output.
- Keep retries as a last resort after root-cause fixes.
- When adding retries, document the specific flake signature being mitigated.
