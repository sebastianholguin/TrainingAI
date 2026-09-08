namespace EmployeeApi.Models;

/// <summary>
/// The closed sets of values the UI offers as dropdowns / radio groups.
/// They live here rather than only in the frontend so the API can reject
/// anything outside the list — the client is a convenience, not a gatekeeper.
/// </summary>
public static class EmployeeOptions
{
    public static readonly string[] Genders = ["Male", "Female", "Other"];

    /// <summary>
    /// Job titles offered in the "Job Title" dropdown. The mockups show the control
    /// but not the list; these are the titles visible in the directory mockup plus a
    /// few common ones. Confirm with the business if the real list matters.
    /// </summary>
    public static readonly string[] Titles =
    [
        "Senior Systems Architect",
        "Principal Designer",
        "Frontend Lead",
        "Backend Engineer",
        "QA Engineer",
        "Product Manager",
        "HR Specialist"
    ];

    public const int MinimumAgeYears = 18;

    /// <summary>
    /// Also applied as a <c>[RegularExpression]</c> on <c>EmployeeRequest.CountryCode</c>.
    /// Served to the client so the form's schema can't quietly drift from the server's rule.
    /// </summary>
    public const string CountryCodePattern = @"^\+\d{1,4}$";

    /// <summary>Field length caps, mirrored to the client so it can flag over-long input before a round trip.</summary>
    public static readonly Dictionary<string, int> MaxLengths = new()
    {
        ["name"] = 120,
        ["email"] = 200,
        ["nationalId"] = 40,
        ["phone"] = 30,
        ["country"] = 80,
    };
}
