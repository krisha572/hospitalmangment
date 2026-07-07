using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;

namespace backend.CQRS.Patients.Commands;

public class CreatePatientCommand : IRequest<PatientDto>
{
    public PatientCreateDto PatientDto { get; }

    public CreatePatientCommand(PatientCreateDto patientDto)
    {
        PatientDto = patientDto;
    }
}

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, PatientDto>
{
    private readonly HospitalDbContext _context;

    public CreatePatientCommandHandler(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<PatientDto> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        var patientDto = request.PatientDto;
        var patient = new Patient
        {
            UHID = patientDto.UHID,
            ProfilePhoto = patientDto.ProfilePhoto,
            FirstName = patientDto.FirstName,
            LastName = patientDto.LastName,
            Gender = patientDto.Gender,
            DateOfBirth = patientDto.DateOfBirth,
            BloodGroup = patientDto.BloodGroup,
            ContactNumber = patientDto.ContactNumber,
            Email = patientDto.Email,
            Address = patientDto.Address,
            Aadhaar = patientDto.Aadhaar,
            Passport = patientDto.Passport,
            Insurance = patientDto.Insurance,
            Occupation = patientDto.Occupation,
            EmergencyContact = patientDto.EmergencyContact,
            Allergies = patientDto.Allergies,
            MedicalHistory = patientDto.MedicalHistory,
            FamilyHistory = patientDto.FamilyHistory,
            PreviousSurgery = patientDto.PreviousSurgery,
            CurrentMedicine = patientDto.CurrentMedicine,
            Height = patientDto.Height,
            Weight = patientDto.Weight,
            BMI = patientDto.BMI,
            Smoking = patientDto.Smoking,
            Alcohol = patientDto.Alcohol,
            WalletBalance = patientDto.WalletBalance
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync(cancellationToken);

        return new PatientDto
        {
            Id = patient.Id,
            UHID = patient.UHID,
            ProfilePhoto = patient.ProfilePhoto,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Gender = patient.Gender,
            DateOfBirth = patient.DateOfBirth,
            BloodGroup = patient.BloodGroup,
            ContactNumber = patient.ContactNumber,
            Email = patient.Email,
            Address = patient.Address,
            Aadhaar = patient.Aadhaar,
            Passport = patient.Passport,
            Insurance = patient.Insurance,
            Occupation = patient.Occupation,
            EmergencyContact = patient.EmergencyContact,
            Allergies = patient.Allergies,
            MedicalHistory = patient.MedicalHistory,
            FamilyHistory = patient.FamilyHistory,
            PreviousSurgery = patient.PreviousSurgery,
            CurrentMedicine = patient.CurrentMedicine,
            Height = patient.Height,
            Weight = patient.Weight,
            BMI = patient.BMI,
            Smoking = patient.Smoking,
            Alcohol = patient.Alcohol,
            WalletBalance = patient.WalletBalance
        };
    }
}
