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
///
/// Every string trims on assignment. This matters more than it looks: model binding runs the
/// setters before DataAnnotations and before the controller's uniqueness lookup, so trimming
/// here is what makes validation, the duplicate check, and the stored value all agree on the
/// same string. Trimming later instead let " x " satisfy a 3-character minimum and let
/// " existing@email.com " slip past the duplicate check and land as an exact duplicate.
/// </summary>
public class EmployeeRequest
{
    private string _name = string.Empty;
    private string _email = string.Empty;
    private string _nationalId = string.Empty;
    private string _countryCode = string.Empty;
    private string _phone = string.Empty;
    private string _country = string.Empty;
    private string _gender = string.Empty;
    private string _officialTitle = string.Empty;

    [Required(ErrorMessage = "Name is required.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 120 characters.")]
    public string Name
    {
        get => _name;
        set => _name = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
    [StringLength(200, ErrorMessage = "Email must be at most 200 characters.")]
    public string Email
    {
        get => _email;
        set => _email = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "National ID is required.")]
    [StringLength(40, MinimumLength = 3, ErrorMessage = "National ID must be between 3 and 40 characters.")]
    public string NationalId
    {
        get => _nationalId;
        set => _nationalId = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Country code is required.")]
    [RegularExpression(@"^\+\d{1,4}$", ErrorMessage = "Country code must start with '+' followed by 1-4 digits, e.g. +1.")]
    public string CountryCode
    {
        get => _countryCode;
        set => _countryCode = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Phone number is required.")]
    [StringLength(30, MinimumLength = 5, ErrorMessage = "Phone number must be between 5 and 30 characters.")]
    public string Phone
    {
        get => _phone;
        set => _phone = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Country is required.")]
    [StringLength(80, MinimumLength = 2, ErrorMessage = "Country must be between 2 and 80 characters.")]
    public string Country
    {
        get => _country;
        set => _country = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Gender is required.")]
    public string Gender
    {
        get => _gender;
        set => _gender = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Date of birth is required.")]
    public DateOnly DateOfBirth { get; set; }

    [Required(ErrorMessage = "Official title is required.")]
    public string OfficialTitle
    {
        get => _officialTitle;
        set => _officialTitle = value?.Trim() ?? string.Empty;
    }

    [Required(ErrorMessage = "Hire date is required.")]
    public DateOnly HireDate { get; set; }
}
