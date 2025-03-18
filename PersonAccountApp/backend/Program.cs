using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PersonAccountApp.Data;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;
using System;
using PersonAccountApp;

var builder = WebApplication.CreateBuilder(args);

// Test database connection first
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
TestDbConnection.Test(connectionString);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Add DbContext with error handling
try
{
    Console.WriteLine("Configuring database connection...");
    Console.WriteLine($"Connection string: {connectionString}");
    
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(connectionString));
    
    Console.WriteLine("Database connection configured successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"Error configuring database connection: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
    // Keep console open
    Console.WriteLine("Press any key to continue...");
    Console.ReadKey();
    throw; // Re-throw to stop application startup
}

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Account Management API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Account Management API v1"));
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    try
    {
        Console.WriteLine("Checking if database exists...");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Database created or already exists.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error creating database: {ex.Message}");
        Console.WriteLine(ex.StackTrace);
    }
}

try
{
    Console.WriteLine("Starting application...");
    app.Run();
    Console.WriteLine("Application stopped normally.");
}
catch (Exception ex)
{
    Console.WriteLine($"Application failed to start: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
    // Keep the console window open
    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();
}
