using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Appointments;

public class GetAllAppointmentsQuery : IRequest<List<AppointmentDto>>
{
    public DateTime? Date { get; init; }
    public int? DoctorId { get; init; }
    public int? PatientId { get; init; }
}

public class GetAllAppointmentsQueryHandler : IRequestHandler<GetAllAppointmentsQuery, List<AppointmentDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllAppointmentsQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<AppointmentDto>> Handle(GetAllAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Appointments
            .Include(a => a.Patient).Include(a => a.Doctor).AsQueryable();

        if (request.Date.HasValue)
            query = query.Where(a => a.AppointmentDate.Date == request.Date.Value.Date);
        if (request.DoctorId.HasValue)
            query = query.Where(a => a.DoctorId == request.DoctorId.Value);
        if (request.PatientId.HasValue)
            query = query.Where(a => a.PatientId == request.PatientId.Value);

        return await query.OrderByDescending(a => a.AppointmentDate)
            .Select(a => new AppointmentDto
            {
                Id = a.Id, TokenNumber = a.TokenNumber, AppointmentDate = a.AppointmentDate,
                TimeSlot = a.TimeSlot, AppointmentType = a.AppointmentType, Reason = a.Reason,
                Status = a.Status, PatientId = a.PatientId,
                PatientName = a.Patient != null ? $"{a.Patient.FirstName} {a.Patient.LastName}" : "",
                PatientUHID = a.Patient != null ? a.Patient.UHID : "",
                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null ? $"Dr. {a.Doctor.FirstName} {a.Doctor.LastName}" : "",
                DoctorSpecialization = a.Doctor != null ? a.Doctor.Specialization : "",
                FollowUpDate = a.FollowUpDate, CreatedAt = a.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}

public class CreateAppointmentCommand : IRequest<AppointmentDto> { public AppointmentCreateDto Dto { get; init; } = null!; }

public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, AppointmentDto>
{
    private readonly HospitalDbContext _context;
    public CreateAppointmentCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<AppointmentDto> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var count = await _context.Appointments.CountAsync(a => a.AppointmentDate.Date == d.AppointmentDate.Date, cancellationToken);
        var appointment = new Appointment
        {
            TokenNumber = $"TKN-{d.AppointmentDate:yyyyMMdd}-{(count + 1):D3}",
            AppointmentDate = d.AppointmentDate, TimeSlot = d.TimeSlot,
            AppointmentType = d.AppointmentType, Reason = d.Reason,
            Status = "Scheduled", PatientId = d.PatientId, DoctorId = d.DoctorId,
            CreatedAt = DateTime.UtcNow
        };
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(cancellationToken);

        var result = await _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor)
            .FirstAsync(a => a.Id == appointment.Id, cancellationToken);

        return new AppointmentDto
        {
            Id = result.Id, TokenNumber = result.TokenNumber, AppointmentDate = result.AppointmentDate,
            TimeSlot = result.TimeSlot, AppointmentType = result.AppointmentType,
            Reason = result.Reason, Status = result.Status, PatientId = result.PatientId,
            PatientName = result.Patient != null ? $"{result.Patient.FirstName} {result.Patient.LastName}" : "",
            PatientUHID = result.Patient != null ? result.Patient.UHID : "",
            DoctorId = result.DoctorId,
            DoctorName = result.Doctor != null ? $"Dr. {result.Doctor.FirstName} {result.Doctor.LastName}" : "",
            CreatedAt = result.CreatedAt
        };
    }
}

public class UpdateAppointmentStatusCommand : IRequest<bool>
{
    public int Id { get; init; }
    public string Status { get; init; } = string.Empty;
    public string? CancellationReason { get; init; }
}

public class UpdateAppointmentStatusCommandHandler : IRequestHandler<UpdateAppointmentStatusCommand, bool>
{
    private readonly HospitalDbContext _context;
    public UpdateAppointmentStatusCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(UpdateAppointmentStatusCommand request, CancellationToken cancellationToken)
    {
        var appt = await _context.Appointments.FindAsync(new object[] { request.Id }, cancellationToken);
        if (appt == null) return false;
        appt.Status = request.Status;
        if (request.CancellationReason != null) appt.CancellationReason = request.CancellationReason;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
