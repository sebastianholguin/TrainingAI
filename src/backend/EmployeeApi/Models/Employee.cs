namespace EmployeeApi.Models;

/// <summary>
/// An employee record. Persisted only in the EF Core in-memory store,
/// so the whole set resets whenever the API restarts.
/// </summary>
public class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string NationalId { get; set; } = string.Empty;

    /// <summary>Phone country code, e.g. "+1". Stored separately from the number per the UI mockups.</summary>
    public string CountryCode { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string Gender { get; set; } = string.Empty;

    public DateOnly DateOfBirth { get; set; }

    public string OfficialTitle { get; set; } = string.Empty;

    public DateOnly HireDate { get; set; }
}
