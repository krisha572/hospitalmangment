using backend.CQRS.Patients.Commands;
using backend.CQRS.Patients.Queries;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PatientsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
    {
        var patients = await _mediator.Send(new GetAllPatientsQuery());
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetById(int id)
    {
        var patient = await _mediator.Send(new GetPatientByIdQuery(id));
        if (patient == null) return NotFound();
        return Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> Create(PatientCreateDto patientDto)
    {
        var createdPatient = await _mediator.Send(new CreatePatientCommand(patientDto));
        return CreatedAtAction(nameof(GetById), new { id = createdPatient.Id }, createdPatient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PatientCreateDto patientDto)
    {
        var updated = await _mediator.Send(new UpdatePatientCommand(id, patientDto));
        if (!updated) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _mediator.Send(new DeletePatientCommand(id));
        if (!deleted) return NotFound();
        
        return NoContent();
    }
}
