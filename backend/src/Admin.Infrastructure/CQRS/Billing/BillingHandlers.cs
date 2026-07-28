using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Billing;

public class GetAllInvoicesQuery : IRequest<List<InvoiceDto>>
{
    public int? PatientId { get; init; }
    public string? Status { get; init; }
}

public class GetAllInvoicesQueryHandler : IRequestHandler<GetAllInvoicesQuery, List<InvoiceDto>>
{
    private readonly HospitalDbContext _context;
    public GetAllInvoicesQueryHandler(HospitalDbContext context) => _context = context;

    public async Task<List<InvoiceDto>> Handle(GetAllInvoicesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Invoices.Include(i => i.Patient).Include(i => i.Items).AsQueryable();
        if (request.PatientId.HasValue) query = query.Where(i => i.PatientId == request.PatientId.Value);
        if (!string.IsNullOrEmpty(request.Status)) query = query.Where(i => i.PaymentStatus == request.Status);

        return await query.OrderByDescending(i => i.InvoiceDate)
            .Select(i => new InvoiceDto
            {
                Id = i.Id, InvoiceNumber = i.InvoiceNumber, InvoiceDate = i.InvoiceDate,
                InvoiceType = i.InvoiceType, SubTotal = i.SubTotal, DiscountAmount = i.DiscountAmount,
                GSTAmount = i.GSTAmount, TotalAmount = i.TotalAmount, PaidAmount = i.PaidAmount,
                DueAmount = i.DueAmount, PaymentMethod = i.PaymentMethod, PaymentStatus = i.PaymentStatus,
                Notes = i.Notes, PatientId = i.PatientId,
                PatientName = i.Patient != null ? $"{i.Patient.FirstName} {i.Patient.LastName}" : "",
                PatientUHID = i.Patient != null ? i.Patient.UHID : "",
                Items = i.Items.Select(it => new InvoiceItemDto
                {
                    Id = it.Id, ItemName = it.ItemName, ItemType = it.ItemType,
                    Quantity = it.Quantity, UnitPrice = it.UnitPrice, GSTPercent = it.GSTPercent, Total = it.Total
                }).ToList(),
                CreatedAt = i.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}

public class CreateInvoiceCommand : IRequest<InvoiceDto> { public InvoiceCreateDto Dto { get; init; } = null!; }

public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDto>
{
    private readonly HospitalDbContext _context;
    public CreateInvoiceCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<InvoiceDto> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var count = await _context.Invoices.CountAsync(cancellationToken);

        var items = d.Items.Select(i => new InvoiceItem
        {
            ItemName = i.ItemName, ItemType = i.ItemType, Quantity = i.Quantity,
            UnitPrice = i.UnitPrice, GSTPercent = i.GSTPercent,
            Total = i.Quantity * i.UnitPrice * (1 + i.GSTPercent / 100)
        }).ToList();

        var subTotal = items.Sum(i => i.Quantity * i.UnitPrice);
        var gstAmount = items.Sum(i => i.Quantity * i.UnitPrice * (i.GSTPercent / 100));
        var total = subTotal + gstAmount - d.DiscountAmount;
        var due = total - d.PaidAmount;

        var invoice = new Invoice
        {
            InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}",
            InvoiceType = d.InvoiceType, SubTotal = subTotal, DiscountAmount = d.DiscountAmount,
            GSTAmount = gstAmount, TotalAmount = total, PaidAmount = d.PaidAmount, DueAmount = due,
            PaymentMethod = d.PaymentMethod, PaymentStatus = due <= 0 ? "Paid" : d.PaidAmount > 0 ? "Partial" : "Pending",
            Notes = d.Notes, PatientId = d.PatientId, Items = items, CreatedAt = DateTime.UtcNow
        };
        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync(cancellationToken);

        var result = await _context.Invoices.Include(i => i.Patient).Include(i => i.Items)
            .FirstAsync(i => i.Id == invoice.Id, cancellationToken);
        return new InvoiceDto
        {
            Id = result.Id, InvoiceNumber = result.InvoiceNumber, InvoiceDate = result.InvoiceDate,
            InvoiceType = result.InvoiceType, SubTotal = result.SubTotal, DiscountAmount = result.DiscountAmount,
            GSTAmount = result.GSTAmount, TotalAmount = result.TotalAmount, PaidAmount = result.PaidAmount,
            DueAmount = result.DueAmount, PaymentMethod = result.PaymentMethod, PaymentStatus = result.PaymentStatus,
            PatientId = result.PatientId,
            PatientName = result.Patient != null ? $"{result.Patient.FirstName} {result.Patient.LastName}" : "",
            PatientUHID = result.Patient != null ? result.Patient.UHID : "",
            Items = result.Items.Select(it => new InvoiceItemDto
            {
                Id = it.Id, ItemName = it.ItemName, ItemType = it.ItemType,
                Quantity = it.Quantity, UnitPrice = it.UnitPrice, GSTPercent = it.GSTPercent, Total = it.Total
            }).ToList(),
            CreatedAt = result.CreatedAt
        };
    }
}
