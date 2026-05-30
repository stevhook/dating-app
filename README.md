# dating-app

Learning project for building a dating app with a .NET API and Angular client.

## Current State

This repo is in an active build phase. Core auth and API plumbing are implemented, and the backend now includes richer member profile data, photos, repository-backed member queries, and automatic seed data.

## Tech Stack

- Backend: ASP.NET Core (`net10.0`), Entity Framework Core, SQLite, JWT auth
- Frontend: Angular 20, Signals, Angular Router, Tailwind CSS v4, daisyUI

## Project Structure

- `API/`: ASP.NET Core Web API
- `client/`: Angular frontend
- `docs/`: requirement notes and supporting docs

## Implemented Backend Features

- API bootstrapped with controller-based routing
- `AppDbContext` + SQLite connection and EF migrations
- Domain entities for:
    - `AppUser`
    - `Member`
    - `Photo`
- Account auth endpoints:
    - `POST /api/account/register`
    - `POST /api/account/login`
- JWT token generation via `ITokenService`/`TokenService`
- JWT auth configured in startup pipeline
- Repository abstraction for member data via `IMemberRepository` and `MemberRepository`
- CORS enabled for:
    - `http://localhost:4200`
    - `https://localhost:4200`
- Members endpoints (JWT protected):
    - `GET /api/members`
    - `GET /api/members/{id}` (requires auth)
    - `GET /api/members/{id}/photos` (requires auth)
- Member data now includes profile fields such as date of birth, gender, description, city, country, created date, and last active date
- Member photos are related through the `Photo` entity
- Central exception middleware (`ExceptionMiddleware`)
- Automatic database migration on API startup
- Development seed process on API startup using `Data/UserSeedData.json`
- Test error endpoints (`/api/buggy/*`) for frontend error handling work

## Implemented Frontend Features

- Angular app scaffolded with route-based feature structure
- Navigation component with login/logout flow
- Registration UI and API call wiring
- Auth state stored in `localStorage` and restored at app init (`InitService`)
- Route guard for protected routes (`authGuard`)
- Routes configured for:
    - home
    - members list/detail
    - lists
    - messages
    - errors test page
    - server error page
    - wildcard not found page
- Error testing page calls backend `buggy` endpoints
- HTTP error interceptor handling:
    - 400 validation errors mapped to model state array
    - 401 shown as toast
    - 404 redirected to not found page
    - 500 redirected to server error page with error payload in router state
- Shared error UI components added for not found and server error screens
- Tailwind CSS + daisyUI configured

## Partially Implemented / Stubbed Areas

- `MemberList` and `MemberDetailed` components are present but currently stub components
- No end-to-end or contract test setup is currently wired in this repo

## Local Run Instructions

### 1) Run the API

From `API/`:

```bash
dotnet run
```

The API is configured for `https://localhost:5001`.

On startup the API will automatically:

- apply pending EF migrations
- seed development users if the database is empty

The current seed data comes from `API/Data/UserSeedData.json` and uses the default development password `00Password!`.

### 2) Run the Angular client

From `client/`:

```bash
npm install
npm start
```

## Notes

- Development token key is currently stored in `API/appsettings.Development.json` for local learning use.
- Existing controllers like weather are scaffold leftovers and not part of the auth/member flow.

## Architecture Diagram

- Code interaction map: [docs/code-interactions.md](docs/code-interactions.md)
