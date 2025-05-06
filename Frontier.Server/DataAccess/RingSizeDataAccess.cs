namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Models;
using MongoDB.Driver;

public class RingSizeDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo)
{
    private readonly string RingSizeCollection = configuration["Mongo:RingSizeCollection"]!;

    public async Task<List<RingSizeModel>> GetAllRingSizes()
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);
        var results = await collection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<RingSizeModel> GetRingSize(string letterSize, double numberSize)
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);
        var filter = Builders<RingSizeModel>.Filter.And(
        Builders<RingSizeModel>.Filter.Eq(r => r.LetterSize, letterSize),
        Builders<RingSizeModel>.Filter.Eq(r => r.NumberSize, numberSize)
        );
        var results = await collection.FindAsync(filter);
        return results.FirstOrDefault();
    }

    public Task CreateRingSize(RingSizeModel ringSize)
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);
        return collection.InsertOneAsync(ringSize);
    }

    public Task UpdateRingSize(RingSizeModel ringSize)
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);
        var filter = Builders<RingSizeModel>.Filter.Eq("Id", ringSize.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return collection.ReplaceOneAsync(filter, ringSize, options);
    }

    public async Task UpdateAllRingSizes(List<RingSizeModel> ringSizes)
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);

        // Extract the list of IDs from the provided ring size list
        var ringSizeIds = ringSizes.Select(r => r.Id).ToList();

        // Find and remove ring sizes that are not in the provided list
        var deleteFilter = Builders<RingSizeModel>.Filter.Nin("Id", ringSizeIds);
        var deleteTask = collection.DeleteManyAsync(deleteFilter);

        // Update or insert ring sizes in the provided list
        var updateTasks = new List<Task>();
        foreach (var ringSize in ringSizes)
        {
            var filter = Builders<RingSizeModel>.Filter.Eq("Id", ringSize.Id);
            ReplaceOptions options = new() { IsUpsert = true };
            var task = collection.ReplaceOneAsync(filter, ringSize, options);
            updateTasks.Add(task);
        }

        // Wait for all delete and update operations to complete
        await Task.WhenAll(deleteTask, Task.WhenAll(updateTasks));
    }

    public Task DeleteRingSize(RingSizeModel ringSize)
    {
        var collection = connectToMongo.Connect<RingSizeModel>(RingSizeCollection);
        return collection.DeleteOneAsync(r => r.Id == ringSize.Id);
    }
}
