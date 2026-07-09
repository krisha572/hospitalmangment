using backend.CQRS.Wards;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WardsController : ControllerBase
{
    private readonly IMediator _mediator;
    public WardsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetAllWardsQuery()));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] WardCreateDto dto)
        => Ok(await _mediator.Send(new CreateWardCommand { Dto = dto }));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] WardCreateDto dto)
    {
        var success = await _mediator.Send(new UpdateWardCommand { Id = id, Dto = dto });
        return success ? NoContent() : NotFound();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BedsController : ControllerBase
{
    private readonly IMediator _mediator;
    public BedsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? wardId)
        => Ok(await _mediator.Send(new GetBedsByWardQuery { WardId = wardId }));

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] BedStatusDto dto)
    {
        var success = await _mediator.Send(new UpdateBedStatusCommand { Id = id, Status = dto.Status });
        return success ? Ok() : NotFound();
    }
}

public class BedStatusDto { public string Status { get; set; } = ""; }
