using Frontier.Server.Functions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Register controllers

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins(
                "http://localhost:5173",
                "http://192.168.0.131:5173",
                "http://100.71.111.37:5173",
                "https://jewellery.zubov.com.au"
                )
                .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .WithHeaders("Authorization", "Content-Type")
                .AllowCredentials()
                .SetIsOriginAllowedToAllowWildcardSubdomains();
        });
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5221); // Only need HTTP since Cloudflare handles HTTPS
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

app.UseRouting(); // Enable routing

app.UseAuthorization(); // Enable authorization if needed

app.MapControllers(); // Map controller routes

app.MapFallbackToFile("/index.html");

Setup initialSetupCheck = new();
initialSetupCheck.CheckFirstTimeSetup();

app.Run();