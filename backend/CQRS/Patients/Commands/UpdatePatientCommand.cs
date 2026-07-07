using backend.Data;
using backend.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Patients.Commands;

public class UpdatePatientCommand : IRequest<bool>
{
    public int Id { get; }
    public PatientCreateDto PatientDto { get; }

    public UpdatePatientCommand(int id, PatientCreateDto patientDto)
    {
        Id = id;
        PatientDto = patientDto;
    }
}

public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand, bool>
{
    private readonly HospitalDbContext _context;

    public UpdatePatientCommandHandler(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    {
        var patient = await _context.Patients.FindAsync(new object[] { request.Id }, cancellationToken);
        if (patient == null) return false;

        var dto = request.PatientDto;
        
        patient.UHID = dto.UHID;
        patient.ProfilePhoto = dto.ProfilePhoto;
        patient.FirstName = dto.FirstName;
        patient.LastName = dto.LastName;
        patient.Gender = dto.Gender;
        patient.DateOfBirth = dto.DateOfBirth;
        patient.BloodGroup = dto.BloodGroup;
        patient.ContactNumber = dto.ContactNumber;
        patient.Email = dto.Email;
        patient.Address = dto.Address;
        patient.Aadhaar = dto.Aadhaar;
        patient.Passport = dto.Passport;
        patient.Insurance = dto.Insurance;
        patient.Occupation = dto.Occupation;
        patient.EmergencyContact = dto.EmergencyContact;
        patient.Allergies = dto.Allergies;
        patient.MedicalHistory = dto.MedicalHistory;
        patient.FamilyHistory = dto.FamilyHistory;
        patient.PreviousSurgery = dto.PreviousSurgery;
        patient.CurrentMedicine = dto.CurrentMedicine;
        patient.Height = dto.Height;
        patient.Weight = dto.Weight;
        patient.BMI = dto.BMI;
        patient.Smoking = dto.Smoking;
        patient.Alcohol = dto.Alcohol;
        patient.WalletBalance = dto.WalletBalance;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
