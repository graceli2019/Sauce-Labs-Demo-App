Feature: Inventory
  As a user, I want to view and sort products on the inventory page

  Scenario: Inventory page displays correct title
    Given I am logged in
    When I am on the inventory page
    Then I should see the inventory title "Products"

  Scenario: Inventory page displays the correct number of products
    Given I am logged in
    When I am on the inventory page
    Then I should see all products listed

  Scenario: Each product card displays name, price and Add to Cart button
    Given I am logged in
    When I am on the inventory page
    Then each product card should show name, price, and Add to Cart button

  Scenario: Products are sorted A-Z by default
    Given I am logged in
    When I am on the inventory page
    Then products should be sorted A-Z by default
