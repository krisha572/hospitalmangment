using backend.CQRS.OPD;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OpdController : ControllerBase
{
    private readonly IMediator _mediator;
    public OpdController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? patientId, [FromQuery] int? doctorId, [FromQuery] DateTime? date)
        => Ok(await _mediator.Send(new GetAllOpdVisitsQuery { PatientId = patientId, DoctorId = doctorId, Date = date }));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OpdVisitCreateDto dto)
        => Ok(await _mediator.Send(new CreateOpdVisitCommand { Dto = dto }));
}
