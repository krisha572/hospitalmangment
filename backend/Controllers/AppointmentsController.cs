using backend.CQRS.Appointments;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AppointmentsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? date, [FromQuery] int? doctorId, [FromQuery] int? patientId)
        => Ok(await _mediator.Send(new GetAllAppointmentsQuery { Date = date, DoctorId = doctorId, PatientId = patientId }));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
    {
        var result = await _mediator.Send(new CreateAppointmentCommand { Dto = dto });
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var success = await _mediator.Send(new UpdateAppointmentStatusCommand { Id = id, Status = dto.Status, CancellationReason = dto.Reason });
        return success ? Ok() : NotFound();
    }
}

public class UpdateStatusDto { public string Status { get; set; } = ""; public string? Reason { get; set; } }
