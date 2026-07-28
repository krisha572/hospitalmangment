namespace backend.Models;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
    public string InvoiceType { get; set; } = string.Empty; // OPD, IPD, Pharmacy, Lab, Radiology, OT
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GSTAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal DueAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; // Cash, UPI, Card, Insurance
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Partial, Paid, Refunded
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public List<InvoiceItem> Items { get; set; } = new();
}

public class InvoiceItem
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string ItemType { get; set; } = string.Empty; // Service, Medicine, Lab, Radiology, Bed, Doctor
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal GSTPercent { get; set; }
    public decimal Total { get; set; }

    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
}
