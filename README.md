# dating-app

Learning project for building a dating app with a .NET API and Angular client.

## Current Functionality

This repository currently supports authenticated member browsing and profile management, including photo upload and main photo selection.

## Tech Stack

- Backend: ASP.NET Core Web API (.NET 10), EF Core, SQLite, JWT auth, Cloudinary, OpenAPI + Scalar
- Frontend: Angular 20 (standalone components + signals), Angular Router, Tailwind CSS v4, daisyUI

## Project Structure

- `API/`: ASP.NET Core Web API
- `client/`: Angular frontend
- `docs/`: design and architecture notes

## Backend Features (Implemented)

- Controller-based API with base route pattern `api/[controller]`
- SQLite persistence via `AppDbContext` and EF migrations
- Automatic migration + seed on startup in development
- Seed source: `API/Data/UserSeedData.json`
- JWT authentication and authorization
- Centralized exception middleware
- CORS for Angular dev origins:
    - `http://localhost:4200`
    - `https://localhost:4200`
- OpenAPI document and Scalar API reference available in development
- Member repository abstraction (`IMemberRepository` / `MemberRepository`)
- Cloudinary-backed image upload/delete service (`PhotoService`)

### API Endpoints

#### Account

- `POST /api/account/register`
- `POST /api/account/login`

#### Members (all require JWT auth)

- `GET /api/members`
- `GET /api/members/{id}`
- `GET /api/members/{id}/photos`
- `PUT /api/members` (update profile fields)
- `POST /api/members/add-photo` (multipart form upload)
- `PUT /api/members/set-main-photo/{photoId}`
- `DELETE /api/members/delete-photo/{photoId}`

#### Error Testing

- `GET /api/buggy/auth`
- `GET /api/buggy/not-found`
- `GET /api/buggy/server-error`
- `GET /api/buggy/bad-request`

## Frontend Features (Implemented)

- Auth flows: register, login, logout
- Auth state persisted in `localStorage` and restored at app bootstrap (`InitService`)
- JWT automatically attached to outgoing API requests (`jwtInterceptor`)
- Global HTTP error handling (`errorInterceptor`):
    - validation errors flattened from model state
    - unauthorized responses shown as toast
    - server errors routed to dedicated error page
- Protected app area via route guard (`authGuard`)
- Member list and member detail routes
- Member detail resolver preloads member data (`memberResolver`)
- Member detail tabs:
    - profile
    - photos
    - messages
- Profile editing with save flow and unsaved-change protection
    - route can-deactivate guard (`preventUnsavedChangesGuard`)
    - browser tab-close warning for dirty forms
- Photo management on member profile:
    - drag/drop upload preview
    - upload to API
    - set main photo
    - delete non-main photo
- Nav includes theme picker (daisyUI themes), persisted in `localStorage`

## Placeholder / In Progress

- `Lists` page is currently a placeholder view
- `Messages` page is currently a placeholder view
- Member detail `Messages` tab is currently a placeholder view
- No end-to-end test suite is configured yet

## Local Development

## Prerequisites

- .NET SDK 10
- Node.js (LTS recommended)
- npm

### HTTPS Certificates (required for local SSL)

This project uses HTTPS for both API and client in development:

- API: `https://localhost:5001` (ASP.NET Core development certificate)
- Client: `https://localhost:4200` (Angular uses `client/ssl/localhost.pem` and `client/ssl/localhost-key.pem`)

#### Trust the ASP.NET Core development certificate

Run from any terminal:

```bash
dotnet dev-certs https --trust
```

#### Generate client certificate files

From the `client/` folder, generate the cert and key files used by Angular:

```bash
mkcert -install
mkcert -key-file ssl/localhost-key.pem -cert-file ssl/localhost.pem localhost 127.0.0.1 ::1
```

If `mkcert` is not installed on Windows:

```bash
choco install mkcert
```

### 1) Run the API

From `API/`:

```bash
dotnet restore
dotnet run
```

API default URL:

- `https://localhost:5001`

Startup behavior:

- applies pending EF migrations
- seeds users when database is empty

Default development seed password:

- `00Password!`

### 2) Run the Angular client

From `client/`:

```bash
npm install
npm start
```

Client dev server:

- `https://localhost:4200` (SSL is enabled in Angular serve config)

## Configuration Notes

- Angular development environment points to `https://localhost:5001/api/`
- Photo upload/delete requires valid Cloudinary settings in API configuration
- `TokenKey` in development settings is for local learning only and should not be used in production

## Architecture Notes

- Code interaction map: [docs/code-interactions.md](docs/code-interactions.md)
