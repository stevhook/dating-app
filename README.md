# dating-app
dating app learning project - creating a dating app from scratch with dotnet backend and angular frontend

## Progress

### 17 May 2026
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