# dating-app
dating app learning project - creating a dating app from scratch with dotnet backend and angular frontend. 
Trying out Postman too for API testing, playwright tests for the e2e and investigate contract testing for the API.

## Progress

### 17 May 2026

#### Backend
- setup the basic dotnet solution
- added AppUser entity class
- added EntityFramework with SQLite
    - added AppDbContext class
    - created my initial migration
    - ran the migration to create the db
    - added 5 test accounts to the database 
- created MembersController 
    - added two endpoints
        - api/members - outputs full member list
        - api/members/{id} - outputs individual member
    - setup Postman to more easily test endpoints
- configured CORS to allow frontend requests from localhost:4200

#### Frontend
- setup Angular
- add basic HttpClient and Get call to front end
- added simple render of members list from api call in front end
- added Tailwind and daisyUI
- added basic unit tests
