# dating-app

Learning project for building a dating app with a .NET API and Angular client.

## Current State

This repo is in an active build phase. Core auth and API plumbing are implemented, while several frontend feature pages are scaffolded but not fully wired.

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
- `AppUser` entity persisted in DB
- Account auth endpoints:
    - `POST /api/account/register`
    - `POST /api/account/login`
- JWT token generation via `ITokenService`/`TokenService`
- JWT auth configured in startup pipeline
- CORS enabled for:
    - `http://localhost:4200`
    - `https://localhost:4200`
- Members endpoints:
    - `GET /api/members` (public)
    - `GET /api/members/{id}` (requires auth)
- Central exception middleware (`ExceptionMiddleware`)
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
- Error testing page calls backend `buggy` endpoints
- Tailwind CSS + daisyUI configured

## Partially Implemented / Stubbed Areas

- `MemberList` and `MemberDetailed` components are present but currently stub components
- Error interceptor exists but currently passes requests through without custom handling
- No end-to-end or contract test setup is currently wired in this repo

## Local Run Instructions

### 1) Run the API

From `API/`:

```bash
dotnet run
```

The API is configured for `https://localhost:5001`.

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
