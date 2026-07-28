using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Wards;

public class GetAllWardsQuery : IRequest<List<WardDto>> { }

public class GetAllWardsQueryHandler : IRequestHandler<GetAllWardsQuery, List<WardDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllWardsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<WardDto>> Handle(GetAllWardsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Wards.Include(w => w.Beds)
            .Select(w => new WardDto
            {
                Id = w.Id, Name = w.Name, WardType = w.WardType, TotalBeds = w.TotalBeds,
                OccupiedBeds = w.Beds.Count(b => b.Status == "Occupied"),
                ChargePerDay = w.ChargePerDay, Description = w.Description, IsActive = w.IsActive
            }).ToListAsync(cancellationToken);
    }
}

public class CreateWardCommand : IRequest<WardDto> { public WardCreateDto Dto { get; init; } = null!; }

public class CreateWardCommandHandler : IRequestHandler<CreateWardCommand, WardDto>
{
    private readonly HospitalDbContext _context;
    public CreateWardCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<WardDto> Handle(CreateWardCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var ward = new Ward
        {
            Name = d.Name, WardType = d.WardType, TotalBeds = d.TotalBeds,
            ChargePerDay = d.ChargePerDay, Description = d.Description,
            IsActive = true, CreatedAt = DateTime.UtcNow
        };
        _context.Wards.Add(ward);
        await _context.SaveChangesAsync(cancellationToken);

        // Auto-create beds
        for (int i = 1; i <= d.TotalBeds; i++)
        {
            _context.Beds.Add(new Bed { BedNumber = $"{ward.Name[0]}{i:D2}", WardId = ward.Id, Status = "Available" });
        }
        await _context.SaveChangesAsync(cancellationToken);

        return new WardDto { Id = ward.Id, Name = ward.Name, WardType = ward.WardType,
            TotalBeds = ward.TotalBeds, OccupiedBeds = 0, ChargePerDay = ward.ChargePerDay,
            Description = ward.Description, IsActive = ward.IsActive };
    }
}

public class UpdateWardCommand : IRequest<bool> { public int Id { get; init; } public WardCreateDto Dto { get; init; } = null!; }

public class UpdateWardCommandHandler : IRequestHandler<UpdateWardCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateWardCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateWardCommand request, CancellationToken cancellationToken)
    {
        var ward = await _context.Wards.FindAsync(new object[] { request.Id }, cancellationToken);
        if (ward == null) return false;
        ward.Name = request.Dto.Name; ward.WardType = request.Dto.WardType;
        ward.ChargePerDay = request.Dto.ChargePerDay; ward.Description = request.Dto.Description;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Bed Handlers ─────────────────────────────────────────────────────────────
public class GetBedsByWardQuery : IRequest<List<BedDto>> { public int? WardId { get; init; } }

public class GetBedsByWardQueryHandler : IRequestHandler<GetBedsByWardQuery, List<BedDto>>
{
    private readonly HospitalDbContext _context;
    public GetBedsByWardQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<BedDto>> Handle(GetBedsByWardQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Beds.Include(b => b.Ward).AsQueryable();
        if (request.WardId.HasValue) query = query.Where(b => b.WardId == request.WardId.Value);
        return await query.Select(b => new BedDto
        {
            Id = b.Id, BedNumber = b.BedNumber, Status = b.Status,
            WardId = b.WardId, WardName = b.Ward.Name, WardType = b.Ward.WardType
        }).ToListAsync(cancellationToken);
    }
}

public class UpdateBedStatusCommand : IRequest<bool>
{
    public int Id { get; init; }
    public string Status { get; init; } = string.Empty;
}

public class UpdateBedStatusCommandHandler : IRequestHandler<UpdateBedStatusCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateBedStatusCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateBedStatusCommand request, CancellationToken cancellationToken)
    {
        var bed = await _context.Beds.FindAsync(new object[] { request.Id }, cancellationToken);
        if (bed == null) return false;
        bed.Status = request.Status;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
