using backend.CQRS.Billing;
using backend.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly IMediator _mediator;
    public BillingController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? patientId, [FromQuery] string? status)
        => Ok(await _mediator.Send(new GetAllInvoicesQuery { PatientId = patientId, Status = status }));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] InvoiceCreateDto dto)
        => Ok(await _mediator.Send(new CreateInvoiceCommand { Dto = dto }));
}
