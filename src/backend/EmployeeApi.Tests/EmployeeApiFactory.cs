using EmployeeApi.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeApi.Tests;

/// <summary>
/// Spins up the real API with its own isolated in-memory database per test class,
/// so tests can create and delete freely without one test's writes leaking into another's.
/// </summary>
public class EmployeeApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"EmployeeDb-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<EmployeeDbContext>));
            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<EmployeeDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
        });
    }
}
