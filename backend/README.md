# 🏥 Hospital Management System - Layered CQRS Backend Architecture

The backend solution (`HospitalManagement.slnx`) follows a clean, decoupled, layered **CQRS (Command Query Responsibility Segregation)** multi-project architecture divided into 8 projects:

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

## 🛠️ Building & Running

### Build All Projects
```bash
dotnet build HospitalManagement.slnx
```

### Run Public/User API
```bash
dotnet run --project src/API/API.csproj
```

### Run Admin API
```bash
dotnet run --project src/Admin.API/Admin.API.csproj
```
