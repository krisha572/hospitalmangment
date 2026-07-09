namespace backend.Models;

public class Bed
{
    public int Id { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Available"; // Available, Occupied, Cleaning, Reserved
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int WardId { get; set; }
    public Ward Ward { get; set; } = null!;
    public List<IpdAdmission> IpdAdmissions { get; set; } = new();
}
