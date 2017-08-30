@thisone
Feature: As a user, I can select reddit options.

  Scenario: As a user, I can select reddit options.
    Given I go to the home page
    Then I should see the genre select drop down on the page
    And I should see the subreddit select drop down on the page
    And I should see the post count select drop down on the page
    And I should see the post category select drop down on the page
