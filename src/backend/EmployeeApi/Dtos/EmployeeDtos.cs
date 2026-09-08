using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.Dtos;

/// <summary>What the API returns. Separate from the entity so the storage shape can move independently.</summary>
public record EmployeeResponse(
    int Id,
    string Name,
    string Email,
    string NationalId,
    string CountryCode,
    string Phone,
    string Country,
    string Gender,
    DateOnly DateOfBirth,
    string OfficialTitle,
    DateOnly HireDate);

/// <summary>
/// What the API accepts for create and update. DataAnnotations cover the per-field rules;
/// cross-field rules (age, hire date vs birth date) and uniqueness are checked in the
/// controller, since they need the whole payload or a database lookup.
/// </summary>
public class EmployeeRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 120 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "National ID is required.")]
    [StringLength(40, MinimumLength = 3, ErrorMessage = "National ID must be between 3 and 40 characters.")]
    public string NationalId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Country code is required.")]
    [RegularExpression(@"^\+\d{1,4}$", ErrorMessage = "Country code must start with '+' followed by 1-4 digits, e.g. +1.")]
    public string CountryCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    [StringLength(30, MinimumLength = 5, ErrorMessage = "Phone number must be between 5 and 30 characters.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Country is required.")]
    [StringLength(80)]
    public string Country { get; set; } = string.Empty;

    [Required(ErrorMessage = "Gender is required.")]
    public string Gender { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date of birth is required.")]
    public DateOnly DateOfBirth { get; set; }

    [Required(ErrorMessage = "Official title is required.")]
    public string OfficialTitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hire date is required.")]
    public DateOnly HireDate { get; set; }
}
