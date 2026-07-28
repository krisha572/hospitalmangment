using backend.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace backend.Admin.Infrastructure.Services;

public static class AdminDbSeeder
{
    public static void SeedDatabase(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<HospitalDbContext>();
        var logger = scope.ServiceProvider.GetService<ILogger<HospitalDbContext>>();

        try
        {
            context.Database.EnsureCreated();
            logger?.LogInformation("Database initialized and seeded successfully.");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}
