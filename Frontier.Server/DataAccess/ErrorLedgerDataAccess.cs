namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class ErrorLedgerDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string ErrorCollection = "error_ledger";

    private IMongoCollection<ErrorLedgerModel> ConnectToMongo()
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<ErrorLedgerModel>(ErrorCollection);
    }

    public async Task<List<ErrorLedgerModel>> GetAllErrorLogs()
    {
        var collection = ConnectToMongo();
        var results = await collection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<ErrorLedgerModel> GetErrorLog(string id)
    {
        var collection = ConnectToMongo();
        var results = await collection.FindAsync(e => e.Id == id);
        return results.FirstOrDefault();
    }

    public async Task CreateErrorLog(ErrorLedgerModel error)
    {
        var collection = ConnectToMongo();
        await collection.InsertOneAsync(error);
    }

    public Task DeleteErrorLog(string id)
    {
        var collection = ConnectToMongo();
        return collection.DeleteOneAsync(e => e.Id == id);
    }
}
