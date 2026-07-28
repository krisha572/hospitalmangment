using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.OPD;

public class GetAllOpdVisitsQuery : IRequest<List<OpdVisitDto>>
{
    public int? PatientId { get; init; }
    public int? DoctorId { get; init; }
    public DateTime? Date { get; init; }
}

public class GetAllOpdVisitsQueryHandler : IRequestHandler<GetAllOpdVisitsQuery, List<OpdVisitDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllOpdVisitsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<OpdVisitDto>> Handle(GetAllOpdVisitsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.OpdVisits.Include(o => o.Patient).Include(o => o.Doctor).AsQueryable();
        if (request.PatientId.HasValue) query = query.Where(o => o.PatientId == request.PatientId.Value);
        if (request.DoctorId.HasValue) query = query.Where(o => o.DoctorId == request.DoctorId.Value);
        if (request.Date.HasValue) query = query.Where(o => o.VisitDate.Date == request.Date.Value.Date);

        return await query.OrderByDescending(o => o.VisitDate)
            .Select(o => new OpdVisitDto
            {
                Id = o.Id, VisitNumber = o.VisitNumber, VisitDate = o.VisitDate,
                ChiefComplaint = o.ChiefComplaint, Diagnosis = o.Diagnosis, Prescription = o.Prescription,
                LabRequests = o.LabRequests, RadiologyRequests = o.RadiologyRequests, Notes = o.Notes,
                ConsultationFee = o.ConsultationFee, Status = o.Status, FollowUpDate = o.FollowUpDate,
                PatientId = o.PatientId,
                PatientName = o.Patient != null ? $"{o.Patient.FirstName} {o.Patient.LastName}" : "",
                PatientUHID = o.Patient != null ? o.Patient.UHID : "",
                DoctorId = o.DoctorId,
                DoctorName = o.Doctor != null ? $"Dr. {o.Doctor.FirstName} {o.Doctor.LastName}" : "",
                CreatedAt = o.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}

public class CreateOpdVisitCommand : IRequest<OpdVisitDto> { public OpdVisitCreateDto Dto { get; init; } = null!; }

public class CreateOpdVisitCommandHandler : IRequestHandler<CreateOpdVisitCommand, OpdVisitDto>
{
    private readonly HospitalDbContext _context;
    public CreateOpdVisitCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<OpdVisitDto> Handle(CreateOpdVisitCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var count = await _context.OpdVisits.CountAsync(cancellationToken);
        var visit = new OpdVisit
        {
            VisitNumber = $"OPD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}",
            ChiefComplaint = d.ChiefComplaint, Diagnosis = d.Diagnosis, Prescription = d.Prescription,
            LabRequests = d.LabRequests, RadiologyRequests = d.RadiologyRequests, Notes = d.Notes,
            ConsultationFee = d.ConsultationFee, FollowUpDate = d.FollowUpDate,
            PatientId = d.PatientId, DoctorId = d.DoctorId, AppointmentId = d.AppointmentId,
            Status = "Completed", VisitDate = DateTime.UtcNow, CreatedAt = DateTime.UtcNow
        };
        _context.OpdVisits.Add(visit);
        await _context.SaveChangesAsync(cancellationToken);
        var result = await _context.OpdVisits.Include(o => o.Patient).Include(o => o.Doctor)
            .FirstAsync(o => o.Id == visit.Id, cancellationToken);
        return new OpdVisitDto
        {
            Id = result.Id, VisitNumber = result.VisitNumber, VisitDate = result.VisitDate,
            ChiefComplaint = result.ChiefComplaint, Diagnosis = result.Diagnosis,
            Prescription = result.Prescription, ConsultationFee = result.ConsultationFee,
            Status = result.Status, PatientId = result.PatientId,
            PatientName = result.Patient != null ? $"{result.Patient.FirstName} {result.Patient.LastName}" : "",
            DoctorId = result.DoctorId,
            DoctorName = result.Doctor != null ? $"Dr. {result.Doctor.FirstName} {result.Doctor.LastName}" : "",
            CreatedAt = result.CreatedAt
        };
    }
}
