using EmployeeApi.Data;
using EmployeeApi.Dtos;
using EmployeeApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("employees")]
public class EmployeesController(EmployeeDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeResponse>>> GetAll()
    {
        // Materialise first, then map. Projecting through ToResponse inside the query only
        // works because the in-memory provider evaluates arbitrary methods client-side;
        // a relational provider would fail to translate it.
        var employees = await db.Employees.OrderBy(e => e.Name).ToListAsync();

        return Ok(employees.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeResponse>> GetById(int id)
    {
        var employee = await db.Employees.FindAsync(id);
        return employee is null ? NotFoundEmployee(id) : Ok(ToResponse(employee));
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeResponse>> Create(EmployeeRequest request)
    {
        if (Validate(request) is { } validationError)
        {
            return validationError;
        }

        if (await FindConflictAsync(request, excludeId: null) is { } conflict)
        {
            return conflict;
        }

        var employee = new Employee();
        Apply(request, employee);

        db.Employees.Add(employee);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, ToResponse(employee));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<EmployeeResponse>> Update(int id, EmployeeRequest request)
    {
        var employee = await db.Employees.FindAsync(id);
        if (employee is null)
        {
            return NotFoundEmployee(id);
        }

        if (Validate(request) is { } validationError)
        {
            return validationError;
        }

        if (await FindConflictAsync(request, excludeId: id) is { } conflict)
        {
            return conflict;
        }

        Apply(request, employee);
        await db.SaveChangesAsync();

        return Ok(ToResponse(employee));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var employee = await db.Employees.FindAsync(id);
        if (employee is null)
        {
            return NotFoundEmployee(id);
        }

        db.Employees.Remove(employee);
        await db.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Rules that DataAnnotations can't express: closed value sets, and dates that only make
    /// sense relative to each other. Returns null when everything checks out.
    /// </summary>
    private ActionResult? Validate(EmployeeRequest request)
    {
        var errors = new Dictionary<string, string[]>();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (!EmployeeOptions.Genders.Contains(request.Gender))
        {
            errors[nameof(request.Gender)] =
                [$"Gender must be one of: {string.Join(", ", EmployeeOptions.Genders)}."];
        }

        if (!EmployeeOptions.Titles.Contains(request.OfficialTitle))
        {
            errors[nameof(request.OfficialTitle)] =
                [$"Official title must be one of: {string.Join(", ", EmployeeOptions.Titles)}."];
        }

        if (request.DateOfBirth >= today)
        {
            errors[nameof(request.DateOfBirth)] = ["Date of birth must be in the past."];
        }
        else if (request.DateOfBirth.AddYears(EmployeeOptions.MinimumAgeYears) > today)
        {
            errors[nameof(request.DateOfBirth)] =
                [$"Employee must be at least {EmployeeOptions.MinimumAgeYears} years old."];
        }

        var hireDateErrors = new List<string>();
        if (request.HireDate > today)
        {
            hireDateErrors.Add("Hire date cannot be in the future.");
        }

        if (request.HireDate < request.DateOfBirth.AddYears(EmployeeOptions.MinimumAgeYears))
        {
            hireDateErrors.Add(
                $"Hire date cannot be before the employee turned {EmployeeOptions.MinimumAgeYears}.");
        }

        if (hireDateErrors.Count > 0)
        {
            errors[nameof(request.HireDate)] = [.. hireDateErrors];
        }

        return errors.Count == 0 ? null : ValidationProblem(new ValidationProblemDetails(errors));
    }

    /// <summary>
    /// Email and national ID identify a person, so a duplicate is a conflict with an existing
    /// record rather than a malformed request — hence 409 instead of 400.
    /// </summary>
    private async Task<ActionResult?> FindConflictAsync(EmployeeRequest request, int? excludeId)
    {
        var errors = new Dictionary<string, string[]>();

        var emailTaken = await db.Employees.AnyAsync(e =>
            e.Id != excludeId && e.Email.ToLower() == request.Email.ToLower());
        if (emailTaken)
        {
            errors[nameof(request.Email)] = ["Another employee already uses this email address."];
        }

        var nationalIdTaken = await db.Employees.AnyAsync(e =>
            e.Id != excludeId && e.NationalId == request.NationalId);
        if (nationalIdTaken)
        {
            errors[nameof(request.NationalId)] = ["Another employee already uses this national ID."];
        }

        if (errors.Count == 0)
        {
            return null;
        }

        return Conflict(new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Duplicate employee details."
        });
    }

    private ActionResult NotFoundEmployee(int id) => NotFound(new ProblemDetails
    {
        Status = StatusCodes.Status404NotFound,
        Title = "Employee not found.",
        Detail = $"No employee exists with id {id}."
    });

    private static void Apply(EmployeeRequest request, Employee employee)
    {
        // EmployeeRequest trims on assignment, so these are already normalised —
        // and crucially were normalised before validation and the duplicate check ran.
        employee.Name = request.Name;
        employee.Email = request.Email;
        employee.NationalId = request.NationalId;
        employee.CountryCode = request.CountryCode;
        employee.Phone = request.Phone;
        employee.Country = request.Country;
        employee.Gender = request.Gender;
        employee.DateOfBirth = request.DateOfBirth;
        employee.OfficialTitle = request.OfficialTitle;
        employee.HireDate = request.HireDate;
    }

    private static EmployeeResponse ToResponse(Employee e) => new(
        e.Id, e.Name, e.Email, e.NationalId, e.CountryCode, e.Phone,
        e.Country, e.Gender, e.DateOfBirth, e.OfficialTitle, e.HireDate);
}
