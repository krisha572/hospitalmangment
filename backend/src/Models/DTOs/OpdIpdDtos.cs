namespace backend.DTOs;

public class OpdVisitDto
{
    public int Id { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public DateTime VisitDate { get; set; }
    public string ChiefComplaint { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string LabRequests { get; set; } = string.Empty;
    public string RadiologyRequests { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? FollowUpDate { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientUHID { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class OpdVisitCreateDto
{
    public string ChiefComplaint { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string LabRequests { get; set; } = string.Empty;
    public string RadiologyRequests { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int? AppointmentId { get; set; }
}

public class IpdAdmissionDto
{
    public int Id { get; set; }
    public string AdmissionNumber { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; }
    public DateTime? DischargeDate { get; set; }
    public string AdmissionType { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientUHID { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public int? BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class IpdAdmissionCreateDto
{
    public string AdmissionType { get; set; } = "General";
    public string Diagnosis { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int? BedId { get; set; }
}
