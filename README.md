# To-Do Application

A full-stack To-Do application built with **ASP.NET Core (.NET 10)** and **Angular**, using a layered architecture, EF Core, JWT authentication, and Bootstrap.

## Tech Stack

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (SQL Server)
- JWT Bearer Authentication
- Swagger / OpenAPI (Swashbuckle)

**Frontend**
- Angular
- Bootstrap 5
- Reactive Forms
- RxJS

## Features

- User registration & login (JWT-based auth)
- Create, view, edit, delete tasks
- Categories for tasks (create, delete, filter by category)
- Search tasks by title
- Pagination on the task list
- Mark tasks complete/incomplete

## Architecture

The backend follows a 4-layer architecture:

```
Controllers  →  Services  →  Repositories (Data Access)  →  Database (EF Core)
```

| Layer | Project | Responsibility |
|---|---|---|
| Presentation | `TodoApp.Api` | Controllers, JWT auth, Swagger, DI wiring |
| Business Logic | `TodoApp.Services` | Services, DTOs mapping, validation rules |
| Data Access | `TodoApp.DataAccess` | Repositories, `AppDbContext`, EF Core config |
| Domain | `TodoApp.Domain` | Entities (`User`, `Category`, `TaskItem`) |
| Contracts | `TodoApp.DTOs` | Request/response DTOs shared across layers |

Each layer depends only on interfaces of the layer below it, which keeps the code testable and decoupled.

## Getting Started

### Prerequisites

- .NET SDK 10
- SQL Server (Express, Developer edition, or Docker)
- Node.js + Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Update the connection string in `TodoApp.Api/appsettings.json` if needed:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=TodoAppDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

3. Set the JWT signing key via User Secrets (never committed to source control):
   ```bash
   cd TodoApp.Api
   dotnet user-secrets init
   dotnet user-secrets set "Jwt:Key" "<your-own-random-40+-character-secret>"
   cd ..
   ```

4. Apply EF Core migrations to create the database:
   ```bash
   dotnet ef database update --project TodoApp.DataAccess --startup-project TodoApp.Api
   ```

5. Run the API:
   ```bash
   dotnet run --project TodoApp.Api
   ```

6. Swagger UI available at: `http://localhost:5077/swagger` (port may vary — check console output)

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```

2. Confirm the API URL in `src/environments/environment.development.ts` matches your backend's port:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5077/api'
   };
   ```

3. Run the app:
   ```bash
   ng serve
   ```

4. Open `http://localhost:4200`

## Project Structure

```
/
├── backend/
│   ├── TodoApp.Api/            # Controllers, Program.cs, appsettings
│   ├── TodoApp.Services/       # Business logic, DTO mapping
│   ├── TodoApp.DataAccess/     # Repositories, DbContext, migrations
│   ├── TodoApp.Domain/         # Entities
│   ├── TodoApp.DTOs/           # Shared DTOs
│   └── TodoApp.sln
└── frontend/
    └── src/app/
        ├── core/                # Auth service, interceptor, guard
        ├── features/
        │   ├── auth/            # Login, Register
        │   └── tasks/           # Task list, task form, category manager
        └── shared/              # Reusable components (confirm dialog)
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns JWT | No |
| GET | `/api/tasks` | Paged task list (supports `search`, `categoryId`, `pageNumber`, `pageSize`) | Yes |
| GET | `/api/tasks/{id}` | Get a single task | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/{id}` | Update a task | Yes |
| DELETE | `/api/tasks/{id}` | Delete a task | Yes |
| GET | `/api/categories` | List categories | Yes |
| POST | `/api/categories` | Create a category | Yes |
| DELETE | `/api/categories/{id}` | Delete a category | Yes |

## Notes on Production Readiness

This project was built as a test task and includes some deliberate simplifications.