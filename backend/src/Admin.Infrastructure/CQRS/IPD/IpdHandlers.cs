using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.IPD;

public class GetAllIpdAdmissionsQuery : IRequest<List<IpdAdmissionDto>>
{
    public string? Status { get; init; }
}

public class GetAllIpdAdmissionsQueryHandler : IRequestHandler<GetAllIpdAdmissionsQuery, List<IpdAdmissionDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllIpdAdmissionsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<IpdAdmissionDto>> Handle(GetAllIpdAdmissionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.IpdAdmissions
            .Include(i => i.Patient).Include(i => i.Doctor).Include(i => i.Bed).ThenInclude(b => b != null ? b.Ward : null)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Status))
            query = query.Where(i => i.Status == request.Status);

        return await query.OrderByDescending(i => i.AdmissionDate)
            .Select(i => new IpdAdmissionDto
            {
                Id = i.Id, AdmissionNumber = i.AdmissionNumber, AdmissionDate = i.AdmissionDate,
                DischargeDate = i.DischargeDate, AdmissionType = i.AdmissionType,
                Diagnosis = i.Diagnosis, Status = i.Status, TotalAmount = i.TotalAmount,
                PatientId = i.PatientId,
                PatientName = i.Patient != null ? $"{i.Patient.FirstName} {i.Patient.LastName}" : "",
                PatientUHID = i.Patient != null ? i.Patient.UHID : "",
                DoctorId = i.DoctorId,
                DoctorName = i.Doctor != null ? $"Dr. {i.Doctor.FirstName} {i.Doctor.LastName}" : "",
                BedId = i.BedId,
                BedNumber = i.Bed != null ? i.Bed.BedNumber : "",
                WardName = i.Bed != null ? i.Bed.Ward.Name : "",
                CreatedAt = i.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}

public class CreateIpdAdmissionCommand : IRequest<IpdAdmissionDto> { public IpdAdmissionCreateDto Dto { get; init; } = null!; }

public class CreateIpdAdmissionCommandHandler : IRequestHandler<CreateIpdAdmissionCommand, IpdAdmissionDto>
{
    private readonly HospitalDbContext _context;
    public CreateIpdAdmissionCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<IpdAdmissionDto> Handle(CreateIpdAdmissionCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var count = await _context.IpdAdmissions.CountAsync(cancellationToken);
        var admission = new IpdAdmission
        {
            AdmissionNumber = $"IPD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}",
            AdmissionType = d.AdmissionType, Diagnosis = d.Diagnosis,
            PatientId = d.PatientId, DoctorId = d.DoctorId, BedId = d.BedId,
            Status = "Admitted", AdmissionDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow
        };
        _context.IpdAdmissions.Add(admission);

        // Mark bed as occupied
        if (d.BedId.HasValue)
        {
            var bed = await _context.Beds.FindAsync(new object[] { d.BedId.Value }, cancellationToken);
            if (bed != null) bed.Status = "Occupied";
        }

        await _context.SaveChangesAsync(cancellationToken);
        var result = await _context.IpdAdmissions.Include(i => i.Patient).Include(i => i.Doctor)
            .Include(i => i.Bed).ThenInclude(b => b != null ? b.Ward : null)
            .FirstAsync(i => i.Id == admission.Id, cancellationToken);
        return new IpdAdmissionDto
        {
            Id = result.Id, AdmissionNumber = result.AdmissionNumber, AdmissionDate = result.AdmissionDate,
            AdmissionType = result.AdmissionType, Diagnosis = result.Diagnosis, Status = result.Status,
            PatientId = result.PatientId,
            PatientName = result.Patient != null ? $"{result.Patient.FirstName} {result.Patient.LastName}" : "",
            DoctorId = result.DoctorId,
            DoctorName = result.Doctor != null ? $"Dr. {result.Doctor.FirstName} {result.Doctor.LastName}" : "",
            BedId = result.BedId, BedNumber = result.Bed != null ? result.Bed.BedNumber : "",
            WardName = result.Bed != null ? result.Bed.Ward.Name : "", CreatedAt = result.CreatedAt
        };
    }
}

public class DischargePatientCommand : IRequest<bool> { public int Id { get; init; } public string DischargeSummary { get; init; } = ""; }

public class DischargePatientCommandHandler : IRequestHandler<DischargePatientCommand, bool>
{
    private readonly HospitalDbContext _context;
    public DischargePatientCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(DischargePatientCommand request, CancellationToken cancellationToken)
    {
        var admission = await _context.IpdAdmissions.FindAsync(new object[] { request.Id }, cancellationToken);
        if (admission == null) return false;
        admission.Status = "Discharged"; admission.DischargeDate = DateTime.UtcNow;
        admission.DischargeSummary = request.DischargeSummary;

        if (admission.BedId.HasValue)
        {
            var bed = await _context.Beds.FindAsync(new object[] { admission.BedId.Value }, cancellationToken);
            if (bed != null) bed.Status = "Cleaning";
        }
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
