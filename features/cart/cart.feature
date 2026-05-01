Feature: Cart
  As a user, I want to manage my cart in the Sauce Labs Demo App

  Scenario: Cart page displays correct title
    Given I am logged in
    When I go to the cart page
    Then I should see the cart title "Your Cart"

  Scenario: Empty cart shows no items
    Given I am logged in
    When I go to the cart page
    Then the cart should be empty

  Scenario: Cart page displays added items correctly
    Given I am logged in
    And I add "Sauce Labs Backpack" to the cart
    When I go to the cart page
    Then the cart should contain "Sauce Labs Backpack"

  Scenario: Remove a single item from cart
    Given I am logged in
    And I add "Sauce Labs Backpack" to the cart
    When I go to the cart page
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
