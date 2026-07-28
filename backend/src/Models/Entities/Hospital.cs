namespace backend.Models;

public class Hospital
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string GSTNumber { get; set; } = string.Empty;
    public string PANNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public string Currency { get; set; } = "INR";
    public string HospitalType { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    public string BankDetails { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Branch> Branches { get; set; } = new();
}
