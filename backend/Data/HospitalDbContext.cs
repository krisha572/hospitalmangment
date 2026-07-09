using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class HospitalDbContext : DbContext
{
    public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options) { }

    // Core
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Hospital> Hospitals { get; set; } = null!;
    public DbSet<Branch> Branches { get; set; } = null!;
    public DbSet<Department> Departments { get; set; } = null!;

    // Clinical Staff
    public DbSet<Doctor> Doctors { get; set; } = null!;
    public DbSet<Nurse> Nurses { get; set; } = null!;
    public DbSet<Staff> Staff { get; set; } = null!;

    // Patient
    public DbSet<Patient> Patients { get; set; } = null!;

    // Appointments
    public DbSet<Appointment> Appointments { get; set; } = null!;

    // OPD & IPD
    public DbSet<OpdVisit> OpdVisits { get; set; } = null!;
    public DbSet<IpdAdmission> IpdAdmissions { get; set; } = null!;

    // Ward & Bed
    public DbSet<Ward> Wards { get; set; } = null!;
    public DbSet<Bed> Beds { get; set; } = null!;

    // Pharmacy
    public DbSet<Medicine> Medicines { get; set; } = null!;
    public DbSet<MedicineStock> MedicineStocks { get; set; } = null!;

    // Laboratory
    public DbSet<LabTest> LabTests { get; set; } = null!;
    public DbSet<LabResult> LabResults { get; set; } = null!;

    // Billing
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<InvoiceItem> InvoiceItems { get; set; } = null!;

    // Security
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relationships
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OpdVisit>()
            .HasOne(o => o.Patient)
            .WithMany()
            .HasForeignKey(o => o.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OpdVisit>()
            .HasOne(o => o.Doctor)
            .WithMany(d => d.OpdVisits)
            .HasForeignKey(o => o.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<IpdAdmission>()
            .HasOne(i => i.Patient)
            .WithMany()
            .HasForeignKey(i => i.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<IpdAdmission>()
            .HasOne(i => i.Doctor)
            .WithMany(d => d.IpdAdmissions)
            .HasForeignKey(i => i.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<IpdAdmission>()
            .HasOne(i => i.Bed)
            .WithMany(b => b.IpdAdmissions)
            .HasForeignKey(i => i.BedId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Patient)
            .WithMany()
            .HasForeignKey(i => i.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        // Decimal precision
        modelBuilder.Entity<Medicine>()
            .Property(m => m.PurchasePrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Medicine>()
            .Property(m => m.SellingPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");

        // Seed Roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "SuperAdmin", Description = "Full system access" },
            new Role { Id = 2, Name = "HospitalAdmin", Description = "Hospital level admin" },
            new Role { Id = 3, Name = "BranchAdmin", Description = "Branch level admin" },
            new Role { Id = 4, Name = "Doctor", Description = "Doctor access" },
            new Role { Id = 5, Name = "Receptionist", Description = "Front desk access" },
            new Role { Id = 6, Name = "Nurse", Description = "Nursing access" },
            new Role { Id = 7, Name = "Pharmacist", Description = "Pharmacy access" },
            new Role { Id = 8, Name = "LabTechnician", Description = "Lab access" },
            new Role { Id = 9, Name = "Accountant", Description = "Finance access" },
            new Role { Id = 10, Name = "Patient", Description = "Patient portal" }
        );

        // Seed default Hospital
        modelBuilder.Entity<Hospital>().HasData(
            new Hospital
            {
                Id = 1,
                Name = "City General Hospital",
                RegistrationNumber = "HOS-2024-001",
                LicenseNumber = "LIC-2024-001",
                GSTNumber = "27AABCU9603R1ZX",
                Email = "admin@citygeneral.com",
                Phone = "022-12345678",
                Address = "123 Healthcare Street",
                Country = "India",
                State = "Maharashtra",
                City = "Mumbai",
                PostalCode = "400001",
                TimeZone = "Asia/Kolkata",
                Currency = "INR",
                HospitalType = "Multi-Specialty",
                WorkingHours = "24x7",
                EmergencyContact = "022-9999999",
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1)
            }
        );

        // Seed Departments
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "General Medicine", HeadOfDepartment = "Dr. Admin", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 2, Name = "Cardiology", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 3, Name = "Neurology", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 4, Name = "Orthopedics", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 5, Name = "Pediatrics", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 6, Name = "Emergency", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 7, Name = "Radiology", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 8, Name = "Laboratory", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Department { Id = 9, Name = "Pharmacy", HeadOfDepartment = "", IsActive = true, CreatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Wards
        modelBuilder.Entity<Ward>().HasData(
            new Ward { Id = 1, Name = "General Ward A", WardType = "General", TotalBeds = 20, ChargePerDay = 500, IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Ward { Id = 2, Name = "Private Ward", WardType = "Private", TotalBeds = 10, ChargePerDay = 2000, IsActive = true, CreatedAt = new DateTime(2024, 1, 1) },
            new Ward { Id = 3, Name = "ICU", WardType = "ICU", TotalBeds = 8, ChargePerDay = 5000, IsActive = true, CreatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed default SuperAdmin user (password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "superadmin",
                Email = "admin@hospital.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "Super Administrator",
                RoleId = 1,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1)
            }
        );
    }
}
