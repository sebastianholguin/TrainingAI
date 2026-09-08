using EmployeeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Data;

public class EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
}

public static class EmployeeDbSeeder
{
    /// <summary>
    /// Seeds the three employees shown in the directory mockup. The in-memory store starts
    /// empty on every restart, so without this the first thing anyone sees is an empty table.
    /// </summary>
    public static void Seed(EmployeeDbContext db)
    {
        if (db.Employees.Any())
        {
            return;
        }

        db.Employees.AddRange(
            new Employee
            {
                Name = "Johnathan Doe",
                Email = "j.doe@hrsystems.com",
                NationalId = "482-99-1022",
                CountryCode = "+1",
                Phone = "(555) 010-1234",
                Country = "United States",
                Gender = "Male",
                DateOfBirth = new DateOnly(1985, 4, 18),
                OfficialTitle = "Senior Systems Architect",
                HireDate = new DateOnly(2021, 1, 12)
            },
            new Employee
            {
                Name = "Alice Smith",
                Email = "a.smith@hrsystems.com",
                NationalId = "931-44-8821",
                CountryCode = "+44",
                Phone = "(555) 020-5566",
                Country = "United Kingdom",
                Gender = "Female",
                DateOfBirth = new DateOnly(1990, 9, 3),
                OfficialTitle = "Principal Designer",
                HireDate = new DateOnly(2022, 3, 22)
            },
            new Employee
            {
                Name = "Robert Chen",
                Email = "r.chen@hrsystems.com",
                NationalId = "221-88-3341",
                CountryCode = "+1",
                Phone = "(555) 030-7788",
                Country = "Canada",
                Gender = "Male",
                DateOfBirth = new DateOnly(1993, 12, 30),
                OfficialTitle = "Frontend Lead",
                HireDate = new DateOnly(2023, 11, 5)
            });

        db.SaveChanges();
    }
}
