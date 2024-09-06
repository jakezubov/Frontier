namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class MetalDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string MetalCollection = "metal_defaults";

    private IMongoCollection<T> ConnectToMongo<T>(in string collection)
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<T>(collection);
    }

    public async Task<List<MetalModel>> GetAllMetals()
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        var results = await metalsCollection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<MetalModel> GetMetal(string name)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        var results = await metalsCollection.FindAsync(m => m.Name == name);
        return results.FirstOrDefault();
    }

    public Task CreateMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        return metalsCollection.InsertOneAsync(metal);
    }

    public Task UpdateMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        var filter = Builders<MetalModel>.Filter.Eq("Id", metal.Id);
        return metalsCollection.ReplaceOneAsync(filter, metal, new ReplaceOptions { IsUpsert = true });
    }

    public async Task UpdateAllMetals(List<MetalModel> metals)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);

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
            var task = metalsCollection.ReplaceOneAsync(filter, metal, new ReplaceOptions { IsUpsert = true });
            updateTasks.Add(task);
        }

        // Wait for all delete and update operations to complete
        await Task.WhenAll(deleteTask, Task.WhenAll(updateTasks));
    }

    public Task DeleteMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        return metalsCollection.DeleteOneAsync(m => m.Id == metal.Id);
    }
}
