Feature: Login
  As a user, I want to log in to the Sauce Labs Demo App

  Scenario Outline: Successful login with valid user
    Given I am on the login page
    When I log in as "<username>" with password "<password>"
    Then I should see the inventory page

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |
      | error_user              | secret_sauce |
      | visual_user             | secret_sauce |

  Scenario: Locked out user cannot login
    Given I am on the login page
    When I log in as "locked_out_user" with password "secret_sauce"
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."

  Scenario Outline: Login fails with invalid credentials
    Given I am on the login page
    When I log in as "<username>" with password "<password>"
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

    Examples:
      | username      | password     |
      | standard_user | wrong_pass   |
      | wrong_user    | secret_sauce |
      | wrong_user    | wrong_pass   |

  Scenario: Login with empty username
    Given I am on the login page
    When I log in as "" with password "secret_sauce"
    Then I should see an error message "Epic sadface: Username is required"
