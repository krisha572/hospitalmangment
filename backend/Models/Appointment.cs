namespace backend.Models;

public class Appointment
{
    public int Id { get; set; }
    public string TokenNumber { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string AppointmentType { get; set; } = "Walk-in"; // Walk-in, Online, Video
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Confirmed, Completed, Cancelled, No-Show
    public string CancellationReason { get; set; } = string.Empty;
    public bool ReminderSent { get; set; } = false;
    public DateTime? FollowUpDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }

    // Navigation properties
    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
}
