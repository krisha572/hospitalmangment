using backend.CQRS.IPD;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IpdController : ControllerBase
{
    private readonly IMediator _mediator;
    public IpdController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
        => Ok(await _mediator.Send(new GetAllIpdAdmissionsQuery { Status = status }));

    [HttpPost]
    public async Task<IActionResult> Admit([FromBody] IpdAdmissionCreateDto dto)
        => Ok(await _mediator.Send(new CreateIpdAdmissionCommand { Dto = dto }));

    [HttpPatch("{id}/discharge")]
    public async Task<IActionResult> Discharge(int id, [FromBody] DischargeDto dto)
    {
        var success = await _mediator.Send(new DischargePatientCommand { Id = id, DischargeSummary = dto.Summary });
        return success ? Ok() : NotFound();
    }
}

public class DischargeDto { public string Summary { get; set; } = ""; }
