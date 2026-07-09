using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Doctors;

// ── Queries ───────────────────────────────────────────────────────────────────
public class GetAllDoctorsQuery : IRequest<List<DoctorDto>> { }

public class GetAllDoctorsQueryHandler : IRequestHandler<GetAllDoctorsQuery, List<DoctorDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllDoctorsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<DoctorDto>> Handle(GetAllDoctorsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Doctors.Include(d => d.Department)
            .Select(d => new DoctorDto
            {
                Id = d.Id, DoctorCode = d.DoctorCode, FirstName = d.FirstName, LastName = d.LastName,
                Gender = d.Gender, DateOfBirth = d.DateOfBirth, ContactNumber = d.ContactNumber,
                Email = d.Email, Qualification = d.Qualification, Experience = d.Experience,
                Specialization = d.Specialization, MedicalRegistrationNumber = d.MedicalRegistrationNumber,
                ConsultationFee = d.ConsultationFee, EmergencyFee = d.EmergencyFee,
                WorkingDays = d.WorkingDays, WorkingHours = d.WorkingHours, Languages = d.Languages,
                Biography = d.Biography, ProfilePhoto = d.ProfilePhoto, IsActive = d.IsActive,
                DepartmentId = d.DepartmentId, DepartmentName = d.Department != null ? d.Department.Name : "",
                CreatedAt = d.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}

public class GetDoctorByIdQuery : IRequest<DoctorDto?> { public int Id { get; init; } }

public class GetDoctorByIdQueryHandler : IRequestHandler<GetDoctorByIdQuery, DoctorDto?>
{
    private readonly HospitalDbContext _context;
    public GetDoctorByIdQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<DoctorDto?> Handle(GetDoctorByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Doctors.Include(d => d.Department)
            .Where(d => d.Id == request.Id)
            .Select(d => new DoctorDto
            {
                Id = d.Id, DoctorCode = d.DoctorCode, FirstName = d.FirstName, LastName = d.LastName,
                Gender = d.Gender, DateOfBirth = d.DateOfBirth, ContactNumber = d.ContactNumber,
                Email = d.Email, Qualification = d.Qualification, Experience = d.Experience,
                Specialization = d.Specialization, MedicalRegistrationNumber = d.MedicalRegistrationNumber,
                ConsultationFee = d.ConsultationFee, EmergencyFee = d.EmergencyFee,
                WorkingDays = d.WorkingDays, WorkingHours = d.WorkingHours, Languages = d.Languages,
                Biography = d.Biography, ProfilePhoto = d.ProfilePhoto, IsActive = d.IsActive,
                DepartmentId = d.DepartmentId, DepartmentName = d.Department != null ? d.Department.Name : "",
                CreatedAt = d.CreatedAt
            }).FirstOrDefaultAsync(cancellationToken);
    }
}

// ── Commands ──────────────────────────────────────────────────────────────────
public class CreateDoctorCommand : IRequest<DoctorDto> { public DoctorCreateDto Dto { get; init; } = null!; }

public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, DoctorDto>
{
    private readonly HospitalDbContext _context;
    public CreateDoctorCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<DoctorDto> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var count = await _context.Doctors.CountAsync(cancellationToken);
        var doctor = new Doctor
        {
            DoctorCode = d.DoctorCode.Length > 0 ? d.DoctorCode : $"DOC-{(count + 1):D4}",
            FirstName = d.FirstName, LastName = d.LastName, Gender = d.Gender,
            DateOfBirth = d.DateOfBirth, ContactNumber = d.ContactNumber, Email = d.Email,
            Address = d.Address, Qualification = d.Qualification, Experience = d.Experience,
            Specialization = d.Specialization, MedicalRegistrationNumber = d.MedicalRegistrationNumber,
            LicenseNumber = d.LicenseNumber, ConsultationFee = d.ConsultationFee,
            EmergencyFee = d.EmergencyFee, WorkingDays = d.WorkingDays, WorkingHours = d.WorkingHours,
            Languages = d.Languages, Biography = d.Biography, ProfilePhoto = d.ProfilePhoto,
            DepartmentId = d.DepartmentId, IsActive = true, CreatedAt = DateTime.UtcNow
        };
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync(cancellationToken);
        return new DoctorDto { Id = doctor.Id, DoctorCode = doctor.DoctorCode,
            FirstName = doctor.FirstName, LastName = doctor.LastName,
            Specialization = doctor.Specialization, ConsultationFee = doctor.ConsultationFee,
            IsActive = doctor.IsActive, CreatedAt = doctor.CreatedAt };
    }
}

public class UpdateDoctorCommand : IRequest<bool> { public int Id { get; init; } public DoctorCreateDto Dto { get; init; } = null!; }

public class UpdateDoctorCommandHandler : IRequestHandler<UpdateDoctorCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateDoctorCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = await _context.Doctors.FindAsync(new object[] { request.Id }, cancellationToken);
        if (doctor == null) return false;
        var d = request.Dto;
        doctor.FirstName = d.FirstName; doctor.LastName = d.LastName; doctor.Gender = d.Gender;
        doctor.DateOfBirth = d.DateOfBirth; doctor.ContactNumber = d.ContactNumber; doctor.Email = d.Email;
        doctor.Address = d.Address; doctor.Qualification = d.Qualification; doctor.Experience = d.Experience;
        doctor.Specialization = d.Specialization; doctor.MedicalRegistrationNumber = d.MedicalRegistrationNumber;
        doctor.ConsultationFee = d.ConsultationFee; doctor.EmergencyFee = d.EmergencyFee;
        doctor.WorkingDays = d.WorkingDays; doctor.WorkingHours = d.WorkingHours;
        doctor.Languages = d.Languages; doctor.Biography = d.Biography; doctor.ProfilePhoto = d.ProfilePhoto;
        doctor.DepartmentId = d.DepartmentId;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public class DeleteDoctorCommand : IRequest<bool> { public int Id { get; init; } }

public class DeleteDoctorCommandHandler : IRequestHandler<DeleteDoctorCommand, bool>
{
    private readonly HospitalDbContext _context;
    public DeleteDoctorCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = await _context.Doctors.FindAsync(new object[] { request.Id }, cancellationToken);
        if (doctor == null) return false;
        doctor.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
