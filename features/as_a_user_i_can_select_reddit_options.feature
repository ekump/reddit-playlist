@thisone
Feature: As a user, I can select reddit options.

  Scenario: As a user, I can select reddit options.
    Given reddit returns the musicsubreddits.json file
    And the spotify API returns the following for a GET request to the me endpoint:
      | display_name | Ryan McKenney |
      | id           | 666           |
    When I go to the home page
    Then I should see the genre select drop down on the page
    And I should see the subreddit select drop down on the page
    And I should see the post count select drop down on the page
    And I should see the post category select drop down on the page
