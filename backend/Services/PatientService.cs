using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PatientService : IPatientService
{
    private readonly HospitalDbContext _context;

    public PatientService(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
    {
        return await _context.Patients
            .Select(p => new PatientDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                DateOfBirth = p.DateOfBirth,
                ContactNumber = p.ContactNumber,
                Email = p.Email
            })
            .ToListAsync();
    }

    public async Task<PatientDto?> GetPatientByIdAsync(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return null;

        return new PatientDto
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            ContactNumber = patient.ContactNumber,
            Email = patient.Email
        };
    }

    public async Task<PatientDto> CreatePatientAsync(PatientCreateDto patientDto)
    {
        var patient = new Patient
        {
            FirstName = patientDto.FirstName,
            LastName = patientDto.LastName,
            DateOfBirth = patientDto.DateOfBirth,
            ContactNumber = patientDto.ContactNumber,
            Email = patientDto.Email
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return new PatientDto
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            ContactNumber = patient.ContactNumber,
            Email = patient.Email
        };
    }

    public async Task<bool> UpdatePatientAsync(int id, PatientCreateDto patientDto)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;

        patient.FirstName = patientDto.FirstName;
        patient.LastName = patientDto.LastName;
        patient.DateOfBirth = patientDto.DateOfBirth;
        patient.ContactNumber = patientDto.ContactNumber;
        patient.Email = patientDto.Email;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeletePatientAsync(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return true;
    }
}
