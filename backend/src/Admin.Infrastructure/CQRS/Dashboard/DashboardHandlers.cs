using backend.Data;
using backend.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Dashboard;

public class GetDashboardQuery : IRequest<DashboardDto> { }

public class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    private readonly HospitalDbContext _context;
    public GetDashboardQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        var totalPatients = await _context.Patients.CountAsync(cancellationToken);
        var totalDoctors = await _context.Doctors.CountAsync(d => d.IsActive, cancellationToken);
        var totalDepts = await _context.Departments.CountAsync(d => d.IsActive, cancellationToken);
        var todayAppts = await _context.Appointments.CountAsync(a => a.AppointmentDate.Date == today, cancellationToken);
        var todayAdmissions = await _context.IpdAdmissions.CountAsync(i => i.AdmissionDate.Date == today, cancellationToken);
        var todayDischarges = await _context.IpdAdmissions.CountAsync(i => i.DischargeDate.HasValue && i.DischargeDate.Value.Date == today, cancellationToken);
        var opdToday = await _context.OpdVisits.CountAsync(o => o.VisitDate.Date == today, cancellationToken);
        var totalBeds = await _context.Beds.CountAsync(cancellationToken);
        var occupiedBeds = await _context.Beds.CountAsync(b => b.Status == "Occupied", cancellationToken);
        var pendingBills = await _context.Invoices.CountAsync(i => i.PaymentStatus == "Pending" || i.PaymentStatus == "Partial", cancellationToken);

        var todayRevenue = await _context.Invoices
            .Where(i => i.InvoiceDate.Date == today)
            .SumAsync(i => i.PaidAmount, cancellationToken);

        var monthStart = new DateTime(today.Year, today.Month, 1);
        var monthRevenue = await _context.Invoices
            .Where(i => i.InvoiceDate >= monthStart)
            .SumAsync(i => i.PaidAmount, cancellationToken);

        var recentAppts = await _context.Appointments
            .Include(a => a.Patient).Include(a => a.Doctor)
            .Where(a => a.AppointmentDate.Date == today)
            .OrderBy(a => a.TimeSlot)
            .Take(5)
            .Select(a => new RecentAppointmentDto
            {
                PatientName = a.Patient != null ? $"{a.Patient.FirstName} {a.Patient.LastName}" : "",
                DoctorName = a.Doctor != null ? $"Dr. {a.Doctor.FirstName} {a.Doctor.LastName}" : "",
                TimeSlot = a.TimeSlot,
                Status = a.Status
            }).ToListAsync(cancellationToken);

        var bedOccupancy = await _context.Wards.Include(w => w.Beds)
            .Where(w => w.IsActive)
            .Select(w => new BedOccupancyDto
            {
                WardName = w.Name,
                Total = w.Beds.Count,
                Occupied = w.Beds.Count(b => b.Status == "Occupied")
            }).ToListAsync(cancellationToken);

        return new DashboardDto
        {
            TotalPatients = totalPatients, TotalDoctors = totalDoctors,
            TotalDepartments = totalDepts, TodayAppointments = todayAppts,
            TodayAdmissions = todayAdmissions, TodayDischarges = todayDischarges,
            OpdVisitsToday = opdToday, TotalBeds = totalBeds, OccupiedBeds = occupiedBeds,
            AvailableBeds = totalBeds - occupiedBeds, TodayRevenue = todayRevenue,
            MonthlyRevenue = monthRevenue, PendingBills = pendingBills,
            EmergencyCases = 0, RecentAppointments = recentAppts, BedOccupancy = bedOccupancy
        };
    }
}
