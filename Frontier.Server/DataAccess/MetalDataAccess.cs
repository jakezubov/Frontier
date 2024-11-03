namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class MetalDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string MetalCollection = "metal_defaults";

    private IMongoCollection<MetalModel> ConnectToMongo()
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<MetalModel>(MetalCollection);
    }

    public async Task<List<MetalModel>> GetAllMetals()
    {
        var metalsCollection = ConnectToMongo();
        var results = await metalsCollection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<MetalModel> GetMetal(string name)
    {
        var metalsCollection = ConnectToMongo();
        var results = await metalsCollection.FindAsync(m => m.Name == name);
        return results.FirstOrDefault();
    }

    public Task CreateMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo();
        return metalsCollection.InsertOneAsync(metal);
    }

    public Task UpdateMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo();
        var filter = Builders<MetalModel>.Filter.Eq("Id", metal.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return metalsCollection.ReplaceOneAsync(filter, metal, options);
    }

    public async Task UpdateAllMetals(List<MetalModel> metals)
    {
        var metalsCollection = ConnectToMongo();

        // Extract the list of IDs from the provided metals list
        var metalIds = metals.Select(m => m.Id).ToList();

        // Find and remove metals that are not in the provided list
        var deleteFilter = Builders<MetalModel>.Filter.Nin("Id", metalIds);
        var deleteTask = metalsCollection.DeleteManyAsync(deleteFilter);

        // Update or insert metals in the provided list
        var updateTasks = new List<Task>();
        foreach (var metal in metals)
        {
            var filter = Builders<MetalModel>.Filter.Eq("Id", metal.Id);
            ReplaceOptions options = new() { IsUpsert = true };
            var task = metalsCollection.ReplaceOneAsync(filter, metal, options);
            updateTasks.Add(task);
        }

        // Wait for all delete and update operations to complete
        await Task.WhenAll(deleteTask, Task.WhenAll(updateTasks));
    }

    public Task DeleteMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo();
        return metalsCollection.DeleteOneAsync(m => m.Id == metal.Id);
    }
}
