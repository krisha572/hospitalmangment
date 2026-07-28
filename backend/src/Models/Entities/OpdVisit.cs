namespace backend.Models;

public class OpdVisit
{
    public int Id { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public DateTime VisitDate { get; set; } = DateTime.UtcNow;
    public string ChiefComplaint { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string LabRequests { get; set; } = string.Empty;
    public string RadiologyRequests { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled
    public DateTime? FollowUpDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
}
