namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class RingSizeDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string RingSizeCollection = "ring_size_defaults";

    private IMongoCollection<T> ConnectToMongo<T>(in string collection)
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<T>(collection);
    }

    public async Task<List<RingSizeModel>> GetAllRingSizes()
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        var results = await ringSizesCollection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<RingSizeModel> GetRingSize(string letterSize, double numberSize)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        var filter = Builders<RingSizeModel>.Filter.And(
        Builders<RingSizeModel>.Filter.Eq(r => r.LetterSize, letterSize),
        Builders<RingSizeModel>.Filter.Eq(r => r.NumberSize, numberSize)
        );
        var results = await ringSizesCollection.FindAsync(filter);
        return results.FirstOrDefault();
    }

    public Task CreateRingSize(RingSizeModel ringSize)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        return ringSizesCollection.InsertOneAsync(ringSize);
    }

    public Task UpdateRingSize(RingSizeModel ringSize)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        var filter = Builders<RingSizeModel>.Filter.Eq("Id", ringSize.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return ringSizesCollection.ReplaceOneAsync(filter, ringSize, options);
    }

    public async Task UpdateAllRingSizes(List<RingSizeModel> ringSizes)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);

        // Extract the list of IDs from the provided ring size list
        var ringSizeIds = ringSizes.Select(r => r.Id).ToList();

        // Find and remove ring sizes that are not in the provided list
        var deleteFilter = Builders<RingSizeModel>.Filter.Nin("Id", ringSizeIds);
        var deleteTask = ringSizesCollection.DeleteManyAsync(deleteFilter);

        // Update or insert ring sizes in the provided list
        var updateTasks = new List<Task>();
        foreach (var ringSize in ringSizes)
        {
            var filter = Builders<RingSizeModel>.Filter.Eq("Id", ringSize.Id);
            ReplaceOptions options = new() { IsUpsert = true };
            var task = ringSizesCollection.ReplaceOneAsync(filter, ringSize, options);
            updateTasks.Add(task);
        }

        // Wait for all delete and update operations to complete
        await Task.WhenAll(deleteTask, Task.WhenAll(updateTasks));
    }

    public Task DeleteRingSize(RingSizeModel ringSize)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        return ringSizesCollection.DeleteOneAsync(r => r.Id == ringSize.Id);
    }
}
