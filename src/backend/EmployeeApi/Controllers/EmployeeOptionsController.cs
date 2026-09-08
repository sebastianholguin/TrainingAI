using EmployeeApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

/// <summary>
/// Serves the dropdown/radio choices to the frontend so the two can't drift apart —
/// if a title is added here, the form picks it up without a frontend change.
/// </summary>
[ApiController]
[Route("employee-options")]
public class EmployeeOptionsController : ControllerBase
{
    [HttpGet]
    public ActionResult<object> Get() => Ok(new
    {
        genders = EmployeeOptions.Genders,
        titles = EmployeeOptions.Titles,
        minimumAgeYears = EmployeeOptions.MinimumAgeYears,
        countryCodePattern = EmployeeOptions.CountryCodePattern,
        maxLengths = EmployeeOptions.MaxLengths
    });
}
