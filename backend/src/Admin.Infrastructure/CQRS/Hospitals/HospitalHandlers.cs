using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Hospitals;

// ── Queries ───────────────────────────────────────────────────────────────────
public class GetAllHospitalsQuery : IRequest<List<HospitalDto>> { }

public class GetAllHospitalsQueryHandler : IRequestHandler<GetAllHospitalsQuery, List<HospitalDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllHospitalsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<HospitalDto>> Handle(GetAllHospitalsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Hospitals
            .Include(h => h.Branches)
            .Select(h => new HospitalDto
            {
                Id = h.Id, Name = h.Name, RegistrationNumber = h.RegistrationNumber,
                LicenseNumber = h.LicenseNumber, GSTNumber = h.GSTNumber, PANNumber = h.PANNumber,
                Email = h.Email, Phone = h.Phone, Website = h.Website, Address = h.Address,
                Country = h.Country, State = h.State, City = h.City, PostalCode = h.PostalCode,
                TimeZone = h.TimeZone, Currency = h.Currency, HospitalType = h.HospitalType,
                WorkingHours = h.WorkingHours, EmergencyContact = h.EmergencyContact,
                LogoUrl = h.LogoUrl, IsActive = h.IsActive, CreatedAt = h.CreatedAt,
                BranchCount = h.Branches.Count
            }).ToListAsync(cancellationToken);
    }
}

public class GetHospitalByIdQuery : IRequest<HospitalDto?> { public int Id { get; init; } }

public class GetHospitalByIdQueryHandler : IRequestHandler<GetHospitalByIdQuery, HospitalDto?>
{
    private readonly HospitalDbContext _context;
    public GetHospitalByIdQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<HospitalDto?> Handle(GetHospitalByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Hospitals.Include(h => h.Branches)
            .Where(h => h.Id == request.Id)
            .Select(h => new HospitalDto
            {
                Id = h.Id, Name = h.Name, RegistrationNumber = h.RegistrationNumber,
                LicenseNumber = h.LicenseNumber, GSTNumber = h.GSTNumber, PANNumber = h.PANNumber,
                Email = h.Email, Phone = h.Phone, Website = h.Website, Address = h.Address,
                Country = h.Country, State = h.State, City = h.City, PostalCode = h.PostalCode,
                TimeZone = h.TimeZone, Currency = h.Currency, HospitalType = h.HospitalType,
                WorkingHours = h.WorkingHours, EmergencyContact = h.EmergencyContact,
                LogoUrl = h.LogoUrl, IsActive = h.IsActive, CreatedAt = h.CreatedAt,
                BranchCount = h.Branches.Count
            }).FirstOrDefaultAsync(cancellationToken);
    }
}

// ── Commands ──────────────────────────────────────────────────────────────────
public class CreateHospitalCommand : IRequest<HospitalDto> { public HospitalCreateDto Dto { get; init; } = null!; }

public class CreateHospitalCommandHandler : IRequestHandler<CreateHospitalCommand, HospitalDto>
{
    private readonly HospitalDbContext _context;
    public CreateHospitalCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<HospitalDto> Handle(CreateHospitalCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var h = new Hospital
        {
            Name = d.Name, RegistrationNumber = d.RegistrationNumber, LicenseNumber = d.LicenseNumber,
            GSTNumber = d.GSTNumber, PANNumber = d.PANNumber, Email = d.Email, Phone = d.Phone,
            Website = d.Website, Address = d.Address, Country = d.Country, State = d.State,
            City = d.City, PostalCode = d.PostalCode, TimeZone = d.TimeZone, Currency = d.Currency,
            HospitalType = d.HospitalType, WorkingHours = d.WorkingHours,
            EmergencyContact = d.EmergencyContact, BankDetails = d.BankDetails, LogoUrl = d.LogoUrl,
            IsActive = true, CreatedAt = DateTime.UtcNow
        };
        _context.Hospitals.Add(h);
        await _context.SaveChangesAsync(cancellationToken);
        return new HospitalDto { Id = h.Id, Name = h.Name, Email = h.Email, Phone = h.Phone,
            City = h.City, State = h.State, Country = h.Country, IsActive = h.IsActive,
            CreatedAt = h.CreatedAt, HospitalType = h.HospitalType };
    }
}

public class UpdateHospitalCommand : IRequest<bool> { public int Id { get; init; } public HospitalCreateDto Dto { get; init; } = null!; }

public class UpdateHospitalCommandHandler : IRequestHandler<UpdateHospitalCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateHospitalCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateHospitalCommand request, CancellationToken cancellationToken)
    {
        var h = await _context.Hospitals.FindAsync(new object[] { request.Id }, cancellationToken);
        if (h == null) return false;
        var d = request.Dto;
        h.Name = d.Name; h.RegistrationNumber = d.RegistrationNumber; h.LicenseNumber = d.LicenseNumber;
        h.GSTNumber = d.GSTNumber; h.PANNumber = d.PANNumber; h.Email = d.Email; h.Phone = d.Phone;
        h.Website = d.Website; h.Address = d.Address; h.Country = d.Country; h.State = d.State;
        h.City = d.City; h.PostalCode = d.PostalCode; h.HospitalType = d.HospitalType;
        h.WorkingHours = d.WorkingHours; h.EmergencyContact = d.EmergencyContact; h.LogoUrl = d.LogoUrl;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public class DeleteHospitalCommand : IRequest<bool> { public int Id { get; init; } }

public class DeleteHospitalCommandHandler : IRequestHandler<DeleteHospitalCommand, bool>
{
    private readonly HospitalDbContext _context;
    public DeleteHospitalCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteHospitalCommand request, CancellationToken cancellationToken)
    {
        var h = await _context.Hospitals.FindAsync(new object[] { request.Id }, cancellationToken);
        if (h == null) return false;
        h.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
