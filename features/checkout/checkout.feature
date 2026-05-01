Feature: Checkout
  As a user, I want to complete the checkout process

  Scenario: Checkout step one displays correct title and form fields
    Given I am logged in and have items in my cart
    When I proceed to checkout
    Then I should see the checkout step one page
    And the form fields should be visible

  Scenario Outline: Form validation for missing fields
    Given I am logged in and have items in my cart
    When I proceed to checkout
    And I fill in the form with first name "<firstName>", last name "<lastName>", and postal code "<postalCode>"
    And I continue checkout
    Then I should see a checkout form error "<error>"

    Examples:
      | firstName | lastName | postalCode | error                        |
      |           |          |           | Error: First Name is required |
      |           | Doe      | 12345     | Error: First Name is required |
      | John      |          | 12345     | Error: Last Name is required  |
      | John      | Doe      |           | Error: Postal Code is required|

  Scenario: Continue with all fields filled navigates to step two
    Given I am logged in and have items in my cart
    When I proceed to checkout
    And I fill in the form with first name "John", last name "Doe", and postal code "12345"
    And I continue checkout
    Then I should see the checkout step two page

  Scenario: Checkout step two displays payment and shipping information
    Given I am logged in and have items in my cart
    When I proceed to checkout
    And I fill in the form with first name "John", last name "Doe", and postal code "12345"
    And I continue checkout
    Then I should see the payment info "SauceCard #31337"
    And I should see the shipping info "Free Pony Express Delivery!"
