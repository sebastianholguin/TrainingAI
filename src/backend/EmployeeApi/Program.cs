using EmployeeApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// In-memory only, per the lab constraint: no migrations, no connection string,
// and the data resets every time the process restarts.
builder.Services.AddDbContext<EmployeeDbContext>(options =>
    options.UseInMemoryDatabase("EmployeeDb"));

const string DevCorsPolicy = "DevCors";
builder.Services.AddCors(options => options.AddPolicy(DevCorsPolicy, policy => policy
    .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EmployeeDbContext>();
    EmployeeDbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(DevCorsPolicy);
app.MapControllers();

app.Run();

/// <summary>Exposed so the integration tests can spin up the API with WebApplicationFactory.</summary>
public partial class Program;
