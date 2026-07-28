namespace backend.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public string UHID { get; set; } = string.Empty;
    public string ProfilePhoto { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Aadhaar { get; set; } = string.Empty;
    public string Passport { get; set; } = string.Empty;
    public string Insurance { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    
    public string Allergies { get; set; } = string.Empty;
    public string MedicalHistory { get; set; } = string.Empty;
    public string FamilyHistory { get; set; } = string.Empty;
    public string PreviousSurgery { get; set; } = string.Empty;
    public string CurrentMedicine { get; set; } = string.Empty;
    
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public decimal? BMI { get; set; }
    public bool Smoking { get; set; }
    public bool Alcohol { get; set; }
    
    public decimal WalletBalance { get; set; }
}

public class PatientCreateDto
{
    public string UHID { get; set; } = string.Empty;
    public string ProfilePhoto { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Aadhaar { get; set; } = string.Empty;
    public string Passport { get; set; } = string.Empty;
    public string Insurance { get; set; } = string.Empty;
    public string Occupation { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    
    public string Allergies { get; set; } = string.Empty;
    public string MedicalHistory { get; set; } = string.Empty;
    public string FamilyHistory { get; set; } = string.Empty;
    public string PreviousSurgery { get; set; } = string.Empty;
    public string CurrentMedicine { get; set; } = string.Empty;
    
    public decimal? Height { get; set; }
    public decimal? Weight { get; set; }
    public decimal? BMI { get; set; }
    public bool Smoking { get; set; }
    public bool Alcohol { get; set; }
    
    public decimal WalletBalance { get; set; }
}
