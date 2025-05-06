using Frontier.Server.DataAccess;
using Frontier.Server.Functions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Singleton Functions
builder.Services.AddSingleton<TokenProvider>();
builder.Services.AddSingleton<ConnectToMongo>();
builder.Services.AddSingleton<Setup>();

// Singleton DataAccess
builder.Services.AddSingleton<ConfigDataAccess>();
builder.Services.AddSingleton<ErrorLedgerDataAccess>();
builder.Services.AddSingleton<MetalDataAccess>();
builder.Services.AddSingleton<RingSizeDataAccess>();
builder.Services.AddSingleton<UserDataAccess>();
builder.Services.AddSingleton<VerificationCodeDataAccess>();

builder.Services.AddDataProtection()
    .SetApplicationName("JCS")
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "JCS-keys")))
    .SetDefaultKeyLifetime(TimeSpan.FromDays(30)); // Add key lifetime

builder.Services.AddAuthorization();
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });

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
                .WithMethods("GET", "POST", "DELETE", "OPTIONS")
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

// Order matters for middleware
app.UseCors("AllowSpecificOrigins");
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Services.GetRequiredService<Setup>().CheckFirstTimeSetup();

app.Run();