using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Departments;

// ── Queries ───────────────────────────────────────────────────────────────────
public class GetAllDepartmentsQuery : IRequest<List<DepartmentDto>> { }

public class GetAllDepartmentsQueryHandler : IRequestHandler<GetAllDepartmentsQuery, List<DepartmentDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllDepartmentsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<DepartmentDto>> Handle(GetAllDepartmentsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Departments.Include(d => d.Doctors)
            .Select(d => new DepartmentDto
            {
                Id = d.Id, Name = d.Name, Description = d.Description,
                HeadOfDepartment = d.HeadOfDepartment, IsActive = d.IsActive,
                BranchId = d.BranchId, DoctorCount = d.Doctors.Count
            }).ToListAsync(cancellationToken);
    }
}

// ── Commands ──────────────────────────────────────────────────────────────────
public class CreateDepartmentCommand : IRequest<DepartmentDto> { public DepartmentCreateDto Dto { get; init; } = null!; }

public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, DepartmentDto>
{
    private readonly HospitalDbContext _context;
    public CreateDepartmentCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<DepartmentDto> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = new Department
        {
            Name = request.Dto.Name, Description = request.Dto.Description,
            HeadOfDepartment = request.Dto.HeadOfDepartment, BranchId = request.Dto.BranchId,
            IsActive = true, CreatedAt = DateTime.UtcNow
        };
        _context.Departments.Add(dept);
        await _context.SaveChangesAsync(cancellationToken);
        return new DepartmentDto { Id = dept.Id, Name = dept.Name, Description = dept.Description,
            HeadOfDepartment = dept.HeadOfDepartment, IsActive = dept.IsActive };
    }
}

public class UpdateDepartmentCommand : IRequest<bool>
{
    public int Id { get; init; }
    public DepartmentCreateDto Dto { get; init; } = null!;
}

public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateDepartmentCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = await _context.Departments.FindAsync(new object[] { request.Id }, cancellationToken);
        if (dept == null) return false;
        dept.Name = request.Dto.Name; dept.Description = request.Dto.Description;
        dept.HeadOfDepartment = request.Dto.HeadOfDepartment; dept.BranchId = request.Dto.BranchId;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public class DeleteDepartmentCommand : IRequest<bool> { public int Id { get; init; } }

public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand, bool>
{
    private readonly HospitalDbContext _context;
    public DeleteDepartmentCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = await _context.Departments.FindAsync(new object[] { request.Id }, cancellationToken);
        if (dept == null) return false;
        dept.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
