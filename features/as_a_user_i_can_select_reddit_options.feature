Feature: As a user, I can select reddit options.

  Scenario: As a user, I can select reddit options.
    Given reddit returns the musicsubreddits.json file
    And I am logged into spotify as:
      | token_response/access_token  | at-1234 |
    And the spotify API returns the following for a GET request to the me endpoint:
      | display_name | Ryan McKenney |
      | id           | 666           |
      | images/0/url |               |
    When I auth using the spotify strategy
    And I go to the home page
    And the reddit API returns the following for a GET request to the /r/altrap hot endpoint:
      | data/children/0/data/title | Test Title |
      | data/children/0/data/media | Test Media |
    And I choose "Hip-hop" from the genre select drop down
    And I wait 5
    And I choose "/r/altrap" from the subreddit select drop down
    And I wait 5
    Then I should see "Test Title" in the page
