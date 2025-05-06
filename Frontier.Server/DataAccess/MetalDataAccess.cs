namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Models;
using MongoDB.Driver;

public class MetalDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo)
{
    private readonly string MetalCollection = configuration["Mongo:MetalCollection"]!;

    public async Task<List<MetalModel>> GetAllMetals()
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);
        var results = await collection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<MetalModel> GetMetal(string name)
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);
        var results = await collection.FindAsync(m => m.Name == name);
        return results.FirstOrDefault();
    }

    public Task CreateMetal(MetalModel metal)
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);
        return collection.InsertOneAsync(metal);
    }

    public Task UpdateMetal(MetalModel metal)
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);
        var filter = Builders<MetalModel>.Filter.Eq("Id", metal.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return collection.ReplaceOneAsync(filter, metal, options);
    }

    public async Task UpdateAllMetals(List<MetalModel> metals)
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);

        // Extract the list of IDs from the provided metals list
        var metalIds = metals.Select(m => m.Id).ToList();

        // Find and remove metals that are not in the provided list
        var deleteFilter = Builders<MetalModel>.Filter.Nin("Id", metalIds);
        var deleteTask = collection.DeleteManyAsync(deleteFilter);

        // Update or insert metals in the provided list
        var updateTasks = new List<Task>();
        foreach (var metal in metals)
        {
            var filter = Builders<MetalModel>.Filter.Eq("Id", metal.Id);
            ReplaceOptions options = new() { IsUpsert = true };
            var task = collection.ReplaceOneAsync(filter, metal, options);
            updateTasks.Add(task);
        }

        // Wait for all delete and update operations to complete
        await Task.WhenAll(deleteTask, Task.WhenAll(updateTasks));
    }

    public Task DeleteMetal(MetalModel metal)
    {
        var collection = connectToMongo.Connect<MetalModel>(MetalCollection);
        return collection.DeleteOneAsync(m => m.Id == metal.Id);
    }
}
