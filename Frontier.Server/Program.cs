using MongoDB.Driver;
using Frontier.Server;
using Frontier.Server.Models;
using Frontier.Server.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

UserDataAccess db = new UserDataAccess();




app.MapFallbackToFile("/index.html");

app.Run();