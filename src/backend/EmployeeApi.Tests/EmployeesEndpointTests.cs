using System.Net;
using System.Net.Http.Json;
using EmployeeApi.Dtos;

namespace EmployeeApi.Tests;

public class EmployeesEndpointTests(EmployeeApiFactory factory) : IClassFixture<EmployeeApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);

    /// <summary>A payload that passes every rule; tests mutate one field to isolate a single failure.</summary>
    private static EmployeeRequest ValidRequest(string suffix = "") => new()
    {
        Name = $"Test Person {suffix}".Trim(),
        Email = $"test{suffix}@hrsystems.com",
        NationalId = $"100-00-{suffix.PadLeft(4, '0')}",
        CountryCode = "+1",
        Phone = "(555) 111-2222",
        Country = "United States",
        Gender = "Female",
        DateOfBirth = new DateOnly(1992, 6, 15),
        OfficialTitle = "Backend Engineer",
        HireDate = new DateOnly(2020, 2, 1)
    };

    [Fact]
    public async Task GetAll_ReturnsSeededEmployees()
    {
        var response = await _client.GetAsync("/employees");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var employees = await response.Content.ReadFromJsonAsync<List<EmployeeResponse>>();
        Assert.NotNull(employees);

        // Tests in this class share one in-memory database and run in an unspecified order,
        // so assert the seeded people are present rather than pinning an exact count.
        var emails = employees!.Select(e => e.Email).ToList();
        Assert.Contains("j.doe@hrsystems.com", emails);
        Assert.Contains("a.smith@hrsystems.com", emails);
        Assert.Contains("r.chen@hrsystems.com", emails);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenIdDoesNotExist()
    {
        var response = await _client.GetAsync("/employees/9999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAndPersistsEmployee()
    {
        var request = ValidRequest("01");

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<EmployeeResponse>();
        Assert.NotNull(created);
        Assert.True(created!.Id > 0);
        Assert.Equal(request.Email, created.Email);

        var fetched = await _client.GetAsync($"/employees/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, fetched.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenEmailIsInvalid()
    {
        var request = ValidRequest("02");
        request.Email = "not-an-email";

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenEmployeeIsUnderage()
    {
        var request = ValidRequest("03");
        request.DateOfBirth = Today.AddYears(-17);
        request.HireDate = Today;

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadAsStringAsync();
        Assert.Contains("18 years old", problem);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenHireDateIsInTheFuture()
    {
        var request = ValidRequest("04");
        request.HireDate = Today.AddDays(30);

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("future", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenGenderIsOutsideAllowedValues()
    {
        var request = ValidRequest("05");
        request.Gender = "Unspecified";

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTitleIsOutsideAllowedValues()
    {
        var request = ValidRequest("06");
        request.OfficialTitle = "Chief Vibes Officer";

        var response = await _client.PostAsJsonAsync("/employees", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsConflict_WhenEmailIsAlreadyUsed()
    {
        var first = ValidRequest("07");
        await _client.PostAsJsonAsync("/employees", first);

        var duplicate = ValidRequest("08");
        duplicate.Email = first.Email;

        var response = await _client.PostAsJsonAsync("/employees", duplicate);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsConflict_WhenNationalIdIsAlreadyUsed()
    {
        var first = ValidRequest("09");
        await _client.PostAsJsonAsync("/employees", first);

        var duplicate = ValidRequest("10");
        duplicate.NationalId = first.NationalId;

        var response = await _client.PostAsJsonAsync("/employees", duplicate);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReplacesEmployeeAndReturnsOk()
    {
        var created = await CreateAsync("11");

        var update = ValidRequest("11");
        update.Name = "Renamed Person";
        update.Country = "Canada";

        var response = await _client.PutAsJsonAsync($"/employees/{created.Id}", update);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<EmployeeResponse>();
        Assert.Equal("Renamed Person", updated!.Name);
        Assert.Equal("Canada", updated.Country);
    }

    [Fact]
    public async Task Update_AllowsKeepingItsOwnEmail()
    {
        var created = await CreateAsync("12");

        var update = ValidRequest("12");
        update.Name = "Same Email, New Name";

        var response = await _client.PutAsJsonAsync($"/employees/{created.Id}", update);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenIdDoesNotExist()
    {
        var response = await _client.PutAsJsonAsync("/employees/9999", ValidRequest("13"));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNoContentAndRemovesEmployee()
    {
        var created = await CreateAsync("14");

        var response = await _client.DeleteAsync($"/employees/{created.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var fetched = await _client.GetAsync($"/employees/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, fetched.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenIdDoesNotExist()
    {
        var response = await _client.DeleteAsync("/employees/9999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Options_ReturnsGendersAndTitles()
    {
        var response = await _client.GetAsync("/employee-options");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Female", body);
        Assert.Contains("Frontend Lead", body);
    }

    private async Task<EmployeeResponse> CreateAsync(string suffix)
    {
        var response = await _client.PostAsJsonAsync("/employees", ValidRequest(suffix));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<EmployeeResponse>())!;
    }
}
