namespace backend.DTOs;

public class InvoiceDto
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string InvoiceType { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GSTAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal DueAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientUHID { get; set; } = string.Empty;
    public List<InvoiceItemDto> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class InvoiceItemDto
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string ItemType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal GSTPercent { get; set; }
    public decimal Total { get; set; }
}

public class InvoiceCreateDto
{
    public string InvoiceType { get; set; } = "OPD";
    public decimal DiscountAmount { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public decimal PaidAmount { get; set; }
    public string Notes { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public List<InvoiceItemCreateDto> Items { get; set; } = new();
}

public class InvoiceItemCreateDto
{
    public string ItemName { get; set; } = string.Empty;
    public string ItemType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal GSTPercent { get; set; }
}

public class DashboardDto
{
    public int TotalPatients { get; set; }
    public int TodayAppointments { get; set; }
    public int TodayAdmissions { get; set; }
    public int TodayDischarges { get; set; }
    public int TotalDoctors { get; set; }
    public int TotalBeds { get; set; }
    public int OccupiedBeds { get; set; }
    public int AvailableBeds { get; set; }
    public decimal TodayRevenue { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public int PendingBills { get; set; }
    public int TotalDepartments { get; set; }
    public int OpdVisitsToday { get; set; }
    public int EmergencyCases { get; set; }
    public List<RecentAppointmentDto> RecentAppointments { get; set; } = new();
    public List<BedOccupancyDto> BedOccupancy { get; set; } = new();
}

public class RecentAppointmentDto
{
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string TimeSlot { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class BedOccupancyDto
{
    public string WardName { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Occupied { get; set; }
}
