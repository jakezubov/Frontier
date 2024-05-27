namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class MetalDataAccess
{
    private string ConnectionString = "mongodb://localhost:27017";
    private string DatabaseName = "frontier";
    private string MetalCollection = "metals";

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

    public Task DeleteMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        return metalsCollection.DeleteOneAsync(m => m.Id == metal.Id);
    }

    public async Task<bool> ValidateMetal(MetalModel metal)
    {
        var metalsCollection = ConnectToMongo<MetalModel>(MetalCollection);
        var filter = Builders<MetalModel>.Filter.And(
            Builders<MetalModel>.Filter.Eq(m => m.Name, metal.Name),
            Builders<MetalModel>.Filter.Eq(m => m.SpecificGravity, metal.SpecificGravity));
        var results = await metalsCollection.FindAsync(filter);
        return results.Any();
    }
}
