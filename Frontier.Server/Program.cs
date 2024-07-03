using Frontier.Server.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Register controllers

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

var app = builder.Build();

Defaults defaults = new();
await defaults.LoadMetalDefaults();
await defaults.LoadRingSizeDefaults();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection(); // Configure the HTTP request pipeline.

app.UseCors("AllowSpecificOrigins");

app.UseRouting(); // Enable routing

app.UseAuthorization(); // Enable authorization if needed

app.MapControllers(); // Map controller routes

app.MapFallbackToFile("/index.html");

app.Run();