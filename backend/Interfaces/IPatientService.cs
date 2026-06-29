using backend.DTOs;

namespace backend.Interfaces;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
    Task<PatientDto?> GetPatientByIdAsync(int id);
    Task<PatientDto> CreatePatientAsync(PatientCreateDto patientDto);
    Task<bool> UpdatePatientAsync(int id, PatientCreateDto patientDto);
    Task<bool> DeletePatientAsync(int id);
}
