namespace backend.Models;

public class Doctor
{
    public int Id { get; set; }
    public string DoctorCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;
    public int Experience { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public string MedicalRegistrationNumber { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public decimal EmergencyFee { get; set; }
    public string WorkingDays { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string Languages { get; set; } = string.Empty;
    public string Biography { get; set; } = string.Empty;
    public string ProfilePhoto { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }

    // Navigation properties
    public List<Appointment> Appointments { get; set; } = new();
    public List<OpdVisit> OpdVisits { get; set; } = new();
    public List<IpdAdmission> IpdAdmissions { get; set; } = new();
}
