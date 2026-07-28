namespace backend.Models;

public class Medicine
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string GenericName { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Tablet, Syrup, Injection, etc.
    public string Barcode { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal GSTPercent { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<MedicineStock> Stocks { get; set; } = new();
}

public class MedicineStock
{
    public int Id { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int Quantity { get; set; }
    public int LowStockThreshold { get; set; } = 10;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int MedicineId { get; set; }
    public Medicine Medicine { get; set; } = null!;
}
