# Dating App Requirements

## Refined requirements

- **User Registration**
	- Feature: User Registration
	- As a visitor, I want to register for an account so that I can create a personal profile and access member-only features.
	- Acceptance criteria:

```gherkin
Feature: User Registration

	Scenario: Successful registration
		Given I am a visitor on the registration page
		When I submit a valid email and password
		Then an account is created for me
		And I am redirected to my profile page
```

- **User Login**
	- Feature: User Login
	- As a registered user, I want to log in so that I can access my profile and protected features.
	- Acceptance criteria:

```gherkin
Feature: User Login

	Scenario: Successful login
		Given I am a registered user
		When I enter valid credentials on the login form
		Then I am authenticated
		And I can access protected routes
```

```gherkin
Feature: User Login

	Scenario: Access protected routes while unauthenticated
		Given I am not logged in
		When I attempt to access a protected route
		Then I am redirected to the login page
		And I receive an unauthorized response from the API
```

## To be refined

The following features require further refinement and design before implementation.

- **View Other Users**
	- Feature: View Users
	- As a logged-in user, I want to view other user profiles so that I can discover and browse potential matches.
	- Acceptance criteria:

```gherkin
Feature: View Users

	Scenario: Browse user directory
		Given I am logged in
		When I navigate to the users directory
		Then I see a list of user profiles with public information
		And I can open a specific user's profile from the list
```

- **Private Messaging**
	- Feature: Private Messaging
	- As a logged-in user, I want to privately message another user so that I can have one-to-one conversations.
	- Acceptance criteria:

```gherkin
Feature: Private Messaging

	Scenario: Send a private message
		Given I am logged in and on another user's profile or conversation view
		When I send a message to that user
		Then the message appears in the conversation thread
		And the message is persisted in the backend
		And only the conversation participants can view the messages
```

- **Favourite / Block Users**
	- Feature: Favourite or Block Users
	- As a logged-in user, I want to mark other users as favourites or block them so that I can manage who I interact with.
	- Acceptance criteria:

```gherkin
Feature: Favourite or Block Users

	Scenario: Mark a user as favourite
		Given I am logged in and viewing another user's profile
		When I click the 'favourite' action
		Then that user is added to my favourites list
		And I can view my favourites list from my profile

	Scenario: Block a user
		Given I am logged in and viewing another user's profile
		When I click the 'block' action
		Then that user is prevented from messaging me
		And they do not appear in my discovery lists
```

- **Upload Photos**
	- Feature: Upload Photos
	- As a logged-in user, I want to upload photos to my profile so that I can show myself to other users.
	- Acceptance criteria:

```gherkin
Feature: Upload Photos

	Scenario: Upload a profile photo
		Given I am logged in and on my profile edit page
		When I upload an image file and save
		Then the image is stored and shown on my profile
		And invalid file types are rejected with an error message
```

- **Edit Profile**
	- Feature: Edit Profile
	- As a logged-in user, I want to edit my profile information so that I can keep my details up to date.
	- Acceptance criteria:

```gherkin
Feature: Edit Profile

	Scenario: Update profile information
		Given I am logged in and on my profile edit page
		When I change my display name and bio and save
		Then the updated information is visible on my profile
		And the changes are persisted in the backend
```
