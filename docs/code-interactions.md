# Code Interaction Map

This document maps how the current codebase parts interact.

## Diagram Key

Use this legend for all charts in this file.

| Shape in chart | Meaning in this project |
| --- | --- |
| Rectangle | Component, service, controller, or process step |
| Slanted route box | URL route path |
| Cylinder | Database storage (SQLite) |
| Diamond | Decision point / condition |
| Subgraph container | System boundary (Browser, Client, API) |
| Arrow | Direction of dependency, call, or flow |

## 1) High-Level Architecture

```mermaid
flowchart LR
    subgraph Browser[Browser]
      U[User]
    end

    subgraph Client[Angular Client]
      NAV[Nav Component]
      HOME[Home/Register Components]
      ROUTER[Router + authGuard]
      INIT[InitService]
      ACC[AccountService]
      HTTP[HttpClient]
      LS[localStorage]
      ERR[TestErrors Component]
    end

    subgraph Api[ASP.NET Core API]
      PIPE[Program Pipeline\nExceptionMiddleware + CORS + AuthN/AuthZ]
      AC[AccountController]
      MC[MembersController]
      BC[BuggyController]
      TOK[TokenService]
      DBCTX[AppDbContext]
      DB[(SQLite dating-app.db)]
    end

    U --> NAV
    U --> HOME
    NAV --> ACC
    HOME --> ACC
    ACC --> HTTP
    INIT --> LS
    INIT --> ACC
    ACC --> LS
    ROUTER --> ACC
    ERR --> HTTP

    HTTP --> PIPE
    PIPE --> AC
    PIPE --> MC
    PIPE --> BC

    AC --> DBCTX
    MC --> DBCTX
    DBCTX --> DB

    AC --> TOK
    TOK --> AC
    AC --> HTTP
    MC --> HTTP
    BC --> HTTP
```

## 2) Auth Login Sequence

```mermaid
sequenceDiagram
    actor User
    participant Nav as Nav Component
    participant Account as AccountService
    participant API as AccountController
    participant DB as SQLite via AppDbContext
    participant Token as TokenService
    participant Browser as localStorage

    User->>Nav: Submit email/password
    Nav->>Account: login(creds)
    Account->>API: POST /api/account/login
    API->>DB: Query user by email
    DB-->>API: User + hash/salt
    API->>API: Validate password hash
    API->>Token: Create JWT
    Token-->>API: token
    API-->>Account: UserDto(displayName,email,token)
    Account->>Browser: Save user in localStorage
    Account-->>Nav: currentUser signal updated
    Nav-->>User: Navigate to /members + toast
```

## 3) Route Protection Flow

```mermaid
flowchart TD
    A[User visits protected route] --> B[authGuard runs]
    B --> C{AccountService.currentUser exists?}
    C -- Yes --> D[Allow navigation]
    C -- No --> E[Toast error: You are not logged in]
    E --> F[Block navigation]
```

## 4) Route to Component Map

```mermaid
flowchart LR
    R0[/ /] --> C0[Home]
    R1[/members/] --> G1[authGuard] --> C1[MemberList]
    R2[/members/:id/] --> G2[authGuard] --> C2[MemberDetailed]
    R3[/lists/] --> G3[authGuard] --> C3[Lists]
    R4[/messages/] --> G4[authGuard] --> C4[Messages]
    R5[/errors/] --> C5[TestErrors]
  R6[Wildcard **] --> C6[Home]
```

## 5) Route to API Dependency Map

```mermaid
flowchart LR
    R0[/ /] --> C0[Home]
    C0 --> RC0[Register Component]
  RC0 --> A0["POST /api/account/register"]

    R1[/members/] --> G1[authGuard] --> C1[MemberList]
    C1 --> N1[No API call yet]

    R2[/members/:id/] --> G2[authGuard] --> C2[MemberDetailed]
    C2 --> N2[No API call yet]

    R3[/lists/] --> G3[authGuard] --> C3[Lists]
    C3 --> N3[No API call yet]

    R4[/messages/] --> G4[authGuard] --> C4[Messages]
    C4 --> N4[No API call yet]

    R5[/errors/] --> C5[TestErrors]
    C5 --> E1["GET /api/buggy/not-found"]
    C5 --> E2["GET /api/buggy/bad-request"]
    C5 --> E3["GET /api/buggy/server-error"]
    C5 --> E4["GET /api/buggy/auth"]
    C5 --> E5["POST /api/account/register - invalid payload test"]

    NAV[Nav Component] --> L1["POST /api/account/login"]
```
