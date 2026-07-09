namespace backend.Models;

public class Branch
{
    public int Id { get; set; }
    public string BranchCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string BranchManagerName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int HospitalId { get; set; }
    public Hospital Hospital { get; set; } = null!;
    public List<Department> Departments { get; set; } = new();
}
