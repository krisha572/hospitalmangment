using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.CQRS.Patients.Commands;

public class DeletePatientCommand : IRequest<bool>
{
    public int Id { get; }

    public DeletePatientCommand(int id)
    {
        Id = id;
    }
}

public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand, bool>
{
    private readonly HospitalDbContext _context;

    public DeletePatientCommandHandler(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeletePatientCommand request, CancellationToken cancellationToken)
    {
        var patient = await _context.Patients.FindAsync(new object[] { request.Id }, cancellationToken);
        if (patient == null) return false;

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
