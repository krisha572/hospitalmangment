namespace backend.Models;

public class IpdAdmission
{
    public int Id { get; set; }
    public string AdmissionNumber { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; } = DateTime.UtcNow;
    public DateTime? DischargeDate { get; set; }
    public string AdmissionType { get; set; } = "General"; // General, Emergency, Surgery
    public string Diagnosis { get; set; } = string.Empty;
    public string DoctorNotes { get; set; } = string.Empty;
    public string NurseNotes { get; set; } = string.Empty;
    public string DischargeSummary { get; set; } = string.Empty;
    public string Status { get; set; } = "Admitted"; // Admitted, Transferred, Discharged
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
    public int? BedId { get; set; }
    public Bed? Bed { get; set; }
}
