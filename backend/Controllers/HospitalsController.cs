using backend.CQRS.Hospitals;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HospitalsController : ControllerBase
{
    private readonly IMediator _mediator;
    public HospitalsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetAllHospitalsQuery()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetHospitalByIdQuery { Id = id });
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HospitalCreateDto dto)
    {
        var result = await _mediator.Send(new CreateHospitalCommand { Dto = dto });
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] HospitalCreateDto dto)
    {
        var success = await _mediator.Send(new UpdateHospitalCommand { Id = id, Dto = dto });
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _mediator.Send(new DeleteHospitalCommand { Id = id });
        return success ? NoContent() : NotFound();
    }
}
