using backend.Data;
using backend.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Patients.Queries;

public class GetAllPatientsQuery : IRequest<IEnumerable<PatientDto>>
{
}

public class GetAllPatientsQueryHandler : IRequestHandler<GetAllPatientsQuery, IEnumerable<PatientDto>>
{
    private readonly HospitalDbContext _context;

    public GetAllPatientsQueryHandler(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PatientDto>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Patients
            .Select(p => new PatientDto
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
            })
            .ToListAsync(cancellationToken);
    }
}
