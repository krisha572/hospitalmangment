namespace backend.Models;

public class Nurse
{
    public int Id { get; set; }
    public string NurseId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;
    public int Experience { get; set; }
    public string Shift { get; set; } = string.Empty; // Morning, Evening, Night
    public string Department { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime JoiningDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
