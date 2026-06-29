namespace backend.Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled
    
    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    
    // Navigation properties
    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
}
