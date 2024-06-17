namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class RingSizeDataAccess
{
    private string ConnectionString = "mongodb://localhost:27017";
    private string DatabaseName = "frontier";
    private string RingSizeCollection = "ring_size_defaults";

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
        return ringSizesCollection.ReplaceOneAsync(filter, ringSize, new ReplaceOptions { IsUpsert = true });
    }

    public Task DeleteRingSize(RingSizeModel ringSize)
    {
        var ringSizesCollection = ConnectToMongo<RingSizeModel>(RingSizeCollection);
        return ringSizesCollection.DeleteOneAsync(r => r.Id == ringSize.Id);
    }
}
