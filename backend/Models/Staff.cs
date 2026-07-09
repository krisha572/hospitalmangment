namespace backend.Models;

public class Staff
{
    public int Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string StaffType { get; set; } = string.Empty; // Receptionist, Ward Boy, Cleaner, Security, Driver, HR, Accountant, IT
    public string Department { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime JoiningDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
