Feature: Inventory Item
  As a user, I want to view product details and manage cart from the product detail page

  Scenario: Product detail page displays all elements
    Given I am logged in
    And I am viewing the details for "Sauce Labs Backpack"
    Then I should see the product name, description, price, image, Add to Cart button, and Back to Products button

  Scenario: Add item to cart from product detail page
    Given I am logged in
    And I am viewing the details for "Sauce Labs Backpack"
    When I add the item to the cart
    Then the cart badge should show 1
    And the Remove button should be visible

  Scenario: Remove item from cart on product detail page
    Given I am logged in
    And I am viewing the details for "Sauce Labs Backpack"
    And I add the item to the cart
    When I remove the item from the cart
    Then the cart badge should not be visible
    And the Add to Cart button should be visible
