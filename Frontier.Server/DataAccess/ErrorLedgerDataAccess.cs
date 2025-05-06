namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Models;
using MongoDB.Driver;

public class ErrorLedgerDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo)
{
    private readonly string ErrorCollection = configuration["Mongo:ErrorCollection"]!;

    public async Task<List<ErrorLedgerModel>> GetAllErrorLogs()
    {
        var collection = connectToMongo.Connect<ErrorLedgerModel>(ErrorCollection);
        var results = await collection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<ErrorLedgerModel> GetErrorLog(string id)
    {
        var collection = connectToMongo.Connect<ErrorLedgerModel>(ErrorCollection);
        var results = await collection.FindAsync(e => e.Id == id);
        return results.FirstOrDefault();
    }

    public async Task CreateErrorLog(ErrorLedgerModel error)
    {
        var collection = connectToMongo.Connect<ErrorLedgerModel>(ErrorCollection);
        await collection.InsertOneAsync(error);
    }

    public Task DeleteErrorLog(string id)
    {
        var collection = connectToMongo.Connect<ErrorLedgerModel>(ErrorCollection);
        return collection.DeleteOneAsync(e => e.Id == id);
    }
}
