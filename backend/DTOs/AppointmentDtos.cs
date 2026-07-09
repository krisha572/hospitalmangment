namespace backend.DTOs;

public class AppointmentDto
{
    public int Id { get; set; }
    public string TokenNumber { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string AppointmentType { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientUHID { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorSpecialization { get; set; } = string.Empty;
    public DateTime? FollowUpDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AppointmentCreateDto
{
    public DateTime AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string AppointmentType { get; set; } = "Walk-in";
    public string Reason { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
}

public class WardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WardType { get; set; } = string.Empty;
    public int TotalBeds { get; set; }
    public int OccupiedBeds { get; set; }
    public int AvailableBeds => TotalBeds - OccupiedBeds;
    public decimal ChargePerDay { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class WardCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string WardType { get; set; } = string.Empty;
    public int TotalBeds { get; set; }
    public decimal ChargePerDay { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class BedDto
{
    public int Id { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int WardId { get; set; }
    public string WardName { get; set; } = string.Empty;
    public string WardType { get; set; } = string.Empty;
}

public class BedCreateDto
{
    public string BedNumber { get; set; } = string.Empty;
    public int WardId { get; set; }
}
