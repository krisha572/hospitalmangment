namespace backend.Models;

public class LabTest
{
    public int Id { get; set; }
    public string TestCode { get; set; } = string.Empty;
    public string TestName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Hematology, Biochemistry, Microbiology, etc.
    public string SampleType { get; set; } = string.Empty; // Blood, Urine, Stool, etc.
    public string NormalRange { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<LabResult> Results { get; set; } = new();
}

public class LabResult
{
    public int Id { get; set; }
    public DateTime CollectionDate { get; set; } = DateTime.UtcNow;
    public DateTime? ReportDate { get; set; }
    public string Result { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Collected, Completed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int LabTestId { get; set; }
    public LabTest LabTest { get; set; } = null!;
}
