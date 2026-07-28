# 🏥 Hospital Management System - Layered CQRS Architecture

A modern, enterprise-grade Hospital Management System (HMS) built with **ASP.NET Core 8**, **CQRS pattern with MediatR**, **Entity Framework Core**, and a **React (Vite)** frontend.

---

## 🏗️ Backend Architecture Overview

The backend solution (`backend/HospitalManagement.slnx`) follows a clean, decoupled, layered **CQRS (Command Query Responsibility Segregation)** multi-project architecture divided into 8 projects:

```
                                  ┌──────────────────────────┐     ┌──────────────────────────┐
                                  │       Admin.API          │     │          API             │
                                  │   (Admin Controllers)    │     │  (User/Public API)       │
                                  └────────────┬─────────────┘     └────────────┬─────────────┘
                                               │                                │
                                               ▼                                ▼
                                  ┌──────────────────────────┐     ┌──────────────────────────┐
                                  │   Admin.Infrastructure   │     │      Infrastructure      │
                                  │  (Admin CQRS, JWT, Seed) │     │ (User CQRS, OTP Service) │
                                  └────────────┬─────────────┘     └────────────┬─────────────┘
                                               │                                │
                                               ├───────────────┬────────────────┤
                                               │               │                │
                                               ▼               ▼                ▼
                                  ┌──────────────────┐  ┌─────────────┐  ┌──────────────┐
                                  │   EmailService   │  │    Data     │  │   Shared     │
                                  │ (Background Job) │  │(AppDbContext│  │(File, Twilio,│
                                  └────────┬─────────┘  │ Migrations) │  │  UserContext)│
                                           │            └──────┬──────┘  └──────┬───────┘
                                           │                   │                │
                                           └───────────────────┴────────────────┘
                                                               │
                                                               ▼
                                                    ┌──────────────────┐
                                                    │      Models      │
                                                    │ (Entities, DTOs, │
                                                    │ Request/Response)│
                                                    └──────────────────┘
```

---

## 📁 Solution & Project Structure

```
backend/
├── HospitalManagement.slnx
└── src/
    ├── Admin.API/                  # Admin REST Web API layer exposing administrative endpoints
    │   ├── Controllers/            # Admin Controllers (Hospitals, Doctors, Wards, Departments, Dashboard)
    │   ├── Program.cs              # Admin API bootstrap, JWT Auth & Swagger UI setup
    │   └── appsettings.json
    │
    ├── Admin.Infrastructure/       # Admin infrastructure logic & CQRS
    │   ├── CQRS/                   # Admin Commands, Queries, and MediatR Handlers
    │   └── Services/               # JwtTokenService, AdminDbSeeder
    │
    ├── API/                        # User/Public REST Web API layer exposing end-user operations
    │   ├── Controllers/            # Public Controllers (Auth, Patients, Appointments, OPD, IPD, Billing)
    │   ├── Program.cs              # User API bootstrap, JWT Auth & Swagger UI setup
    │   └── appsettings.json
    │
    ├── Infrastructure/             # User-facing infrastructure logic & CQRS
    │   ├── CQRS/                   # User Commands, Queries, and MediatR Handlers
    │   └── Services/               # OtpService (SMS OTP generation & verification)
    │
    ├── Data/                       # Data Access Layer
    │   └── HospitalDbContext.cs    # EF Core DbContext, Fluent API mappings, DB Seed initializers
    │
    ├── Models/                     # Core Data Transfer Objects & Domain Models
    │   ├── Entities/               # Domain Entities (Hospital, Patient, Doctor, Appointment, Invoice, User, etc.)
    │   ├── DTOs/                   # Request/Response DTOs
    │   └── Common/                 # Result<T> generic response wrapper
    │
    ├── Shared/                     # Cross-cutting utilities & shared services
    │   └── Services/               # CurrentUserService, FileService, TwilioService (ISmsService)
    │
    └── EmailService/               # Background Email Service
        └── EmailBackgroundService.cs # BackgroundService with thread-safe ConcurrentQueue
```

---

## 🚀 Projects Description & Responsibilities

| Project Name | Project Type | Responsibilities | Key Dependencies |
| :--- | :--- | :--- | :--- |
| **`Admin.API`** | Web API | Exposes endpoints for administrative operations (Hospitals, Wards, Departments, Doctors, Analytics, Seeding). | `Admin.Infrastructure`, `Data`, `Models`, `Shared`, `EmailService` |
| **`Admin.Infrastructure`** | Class Library | Admin CQRS Commands, Queries, Handlers, `JwtTokenService`, `AdminDbSeeder`. | `Data`, `Models`, `Shared`, `MediatR`, `AutoMapper`, `BCrypt.Net-Next` |
| **`API`** | Web API | Exposes endpoints for end-user operations (Registration, Patient Portal, Appointments, OPD/IPD, Billing). | `Infrastructure`, `Data`, `Models`, `Shared`, `EmailService` |
| **`Infrastructure`** | Class Library | User-facing CQRS Commands, Queries, Handlers, and `OtpService`. | `Data`, `Models`, `Shared`, `MediatR`, `AutoMapper`, `BCrypt.Net-Next` |
| **`Data`** | Class Library | `HospitalDbContext`, EF Core configurations, entity relationships, seeding base records. | `Models`, `Microsoft.EntityFrameworkCore.SqlServer`, `InMemory` |
| **`Models`** | Class Library | Domain entities, Request/Response DTOs, Enums, and generic `Result<T>` wrapper. | Standard .NET 8 libraries |
| **`Shared`** | Class Library | Cross-cutting services: `CurrentUserService`, `FileService`, `TwilioService`. | `Models`, `Microsoft.AspNetCore.App` |
| **`EmailService`** | Class Library / Hosted | Background service handling queued email deliveries asynchronously. | `Models`, `Shared`, `Microsoft.Extensions.Hosting.Abstractions` |

---

## 🛠️ Getting Started & Running Locally

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or higher
- [Node.js](https://nodejs.org/) (v18+)

### Building the Solution

To build all 8 projects in the backend solution:

```bash
cd backend
dotnet build HospitalManagement.slnx
```

### Running the Public API
To start the User/Public Web API:

```bash
dotnet run --project src/API/API.csproj
```
- Swagger UI will be available at: `http://localhost:5000/swagger` (or configured port)

### Running the Admin API
To start the Admin Web API:

```bash
dotnet run --project src/Admin.API/Admin.API.csproj
```
- Swagger UI will be available at: `http://localhost:5001/swagger` (or configured port)

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Default Credentials (Seeded Data)

- **SuperAdmin Account**:
  - **Username**: `superadmin`
  - **Email**: `admin@hospital.com`
  - **Password**: `Admin@123`
