namespace backend.Models;

public class Ward
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WardType { get; set; } = string.Empty; // General, Semi-Private, Private, Deluxe, ICU, NICU
    public int TotalBeds { get; set; }
    public decimal ChargePerDay { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Bed> Beds { get; set; } = new();
}
