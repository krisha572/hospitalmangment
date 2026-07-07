using backend.Data;
using backend.DTOs;
using MediatR;

namespace backend.CQRS.Patients.Queries;

public class GetPatientByIdQuery : IRequest<PatientDto?>
{
    public int Id { get; }

    public GetPatientByIdQuery(int id)
    {
        Id = id;
    }
}

public class GetPatientByIdQueryHandler : IRequestHandler<GetPatientByIdQuery, PatientDto?>
{
    private readonly HospitalDbContext _context;

    public GetPatientByIdQueryHandler(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<PatientDto?> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
    {
        var p = await _context.Patients.FindAsync(new object[] { request.Id }, cancellationToken);
        if (p == null) return null;

        return new PatientDto
        {
            Id = p.Id,
            UHID = p.UHID,
            ProfilePhoto = p.ProfilePhoto,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Gender = p.Gender,
            DateOfBirth = p.DateOfBirth,
            BloodGroup = p.BloodGroup,
            ContactNumber = p.ContactNumber,
            Email = p.Email,
            Address = p.Address,
            Aadhaar = p.Aadhaar,
            Passport = p.Passport,
            Insurance = p.Insurance,
            Occupation = p.Occupation,
            EmergencyContact = p.EmergencyContact,
            Allergies = p.Allergies,
            MedicalHistory = p.MedicalHistory,
            FamilyHistory = p.FamilyHistory,
            PreviousSurgery = p.PreviousSurgery,
            CurrentMedicine = p.CurrentMedicine,
            Height = p.Height,
            Weight = p.Weight,
            BMI = p.BMI,
            Smoking = p.Smoking,
            Alcohol = p.Alcohol,
            WalletBalance = p.WalletBalance
        };
    }
}
