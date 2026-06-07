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
      ROUTER[Router + authGuard + memberResolver]
      INIT[InitService]
      ACC[AccountService]
      MEM[MemberService]
      INT[HTTP Interceptors\njwt + error + loading]
      HTTP[HttpClient]
      LS[localStorage]
      PROF[MemberProfile Component]
      PHOTOS[MemberPhotos Component]
      ERR[TestErrors Component]
    end

    subgraph Api[ASP.NET Core API]
      PIPE[Program Pipeline\nExceptionMiddleware + CORS + AuthN/AuthZ]
      AC[AccountController]
      MC[MembersController]
      BC[BuggyController]
      TOK[TokenService]
      PS[PhotoService]
      CLD[(Cloudinary)]
      DBCTX[AppDbContext]
      DB[(SQLite dating-app.db)]
    end

    U --> NAV
    U --> HOME
    NAV --> ACC
    NAV --> ROUTER
    HOME --> ACC
    ROUTER --> MEM
    ACC --> HTTP
    MEM --> HTTP
    INT --> HTTP
    INIT --> LS
    INIT --> ACC
    ACC --> LS
    ACC --> INT
    MEM --> INT
    PROF --> MEM
    PHOTOS --> MEM
    ERR --> HTTP

    HTTP --> PIPE
    PIPE --> AC
    PIPE --> MC
    PIPE --> BC

    AC --> DBCTX
    MC --> DBCTX
    DBCTX --> DB

    AC --> TOK
    MC --> PS
    PS --> CLD
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
    R2[/members/:id/] --> G2[authGuard] --> RS[memberResolver] --> C2[MemberDetailed]
    C2 --> T0[/members/:id/profile/] --> C20[MemberProfile + preventUnsavedChangesGuard]
    C2 --> T1[/members/:id/photos/] --> C21[MemberPhotos]
    C2 --> T2[/members/:id/messages/] --> C22[MemberMessages placeholder]
    R3[/lists/] --> G3[authGuard] --> C3[Lists]
    R4[/messages/] --> G4[authGuard] --> C4[Messages]
    R5[/errors/] --> C5[TestErrors]
    R6[/server-error/] --> C6[ServerError]
    R7[Wildcard **] --> C7[NotFound]
```

## 5) Route to API Dependency Map

```mermaid
flowchart LR
    R0[/ /] --> C0[Home]
    C0 --> RC0[Register Component]
    C0 --> NAV[Nav Login Form]
    RC0 --> A0["POST /api/account/register"]
    NAV --> A1["POST /api/account/login"]

    R1[/members/] --> G1[authGuard] --> C1[MemberList]
    C1 --> M1["GET /api/members"]

    R2[/members/:id/] --> G2[authGuard] --> RS[memberResolver]
    RS --> M2["GET /api/members/{id}"]

    P0[/members/:id/profile/] --> CP0[MemberProfile]
    CP0 --> M3["PUT /api/members"]

    P1[/members/:id/photos/] --> CP1[MemberPhotos]
    CP1 --> M4["GET /api/members/{id}/photos"]
    CP1 --> M5["POST /api/members/add-photo"]
    CP1 --> M6["PUT /api/members/set-main-photo/{photoId}"]
    CP1 --> M7["DELETE /api/members/delete-photo/{photoId}"]

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
```

## 6) Member Detail Data Load Sequence

```mermaid
sequenceDiagram
    actor User
    participant Router as Angular Router
    participant Guard as authGuard
    participant Resolver as memberResolver
    participant MemberSvc as MemberService
    participant API as MembersController
    participant DB as SQLite via MemberRepository
    participant UI as MemberDetailed Component

    User->>Router: Navigate to /members/:id
    Router->>Guard: canActivate
    Guard-->>Router: allow
    Router->>Resolver: resolve(member)
    Resolver->>MemberSvc: getMember(id)
    MemberSvc->>API: GET /api/members/{id}
    API->>DB: Query member by id
    DB-->>API: Member
    API-->>MemberSvc: Member payload
    MemberSvc-->>Resolver: set member signal + return member
    Resolver-->>Router: resolved data
    Router-->>UI: Activate MemberDetailed + child route
```

## 7) Profile Update + Unsaved Guard Flow

```mermaid
flowchart TD
    A[User edits profile form] --> B[Form dirty state true]
    B --> C{User navigates away?}
    C -- No --> D[Stay on page]
    C -- Yes --> E[preventUnsavedChangesGuard confirm dialog]
    E --> F{User confirms?}
    F -- No --> G[Cancel navigation]
    F -- Yes --> H[Allow navigation]

    B --> I[User clicks Save]
    I --> J[PUT /api/members]
    J --> K[MembersController UpdateMember]
    K --> L[MemberRepository SaveAllAsync]
    L --> M[NoContent]
    M --> N[Update client member + currentUser display name]
    N --> O[Form reset pristine]
```

## 8) Photo Upload and Main Photo Flow

```mermaid
sequenceDiagram
    actor User
    participant Photos as MemberPhotos Component
    participant Upload as ImageUpload Component
    participant MemberSvc as MemberService
    participant API as MembersController
    participant PhotoSvc as PhotoService
    participant Cloud as Cloudinary
    participant DB as SQLite via MemberRepository
    participant Account as AccountService

    User->>Upload: Drag and drop file
    Upload-->>Photos: emit file
    Photos->>MemberSvc: uploadPhoto(file)
    MemberSvc->>API: POST /api/members/add-photo
    API->>PhotoSvc: UploadPhotoAsync(file)
    PhotoSvc->>Cloud: Upload image
    Cloud-->>PhotoSvc: secureUrl + publicId
    PhotoSvc-->>API: upload result
    API->>DB: Save photo to member
    API-->>MemberSvc: Photo payload
    MemberSvc-->>Photos: append photo in UI

    User->>Photos: Set as main photo
    Photos->>MemberSvc: setMainPhoto(photo)
    MemberSvc->>API: PUT /api/members/set-main-photo/{photoId}
    API->>DB: Update member image url
    API-->>MemberSvc: NoContent
    MemberSvc-->>Photos: success
    Photos->>Account: setCurrentUser(imageUrl)
```
