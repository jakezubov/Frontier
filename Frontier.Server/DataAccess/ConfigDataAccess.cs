namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class ConfigDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string ConfigCollection = "site_config";

    private IMongoCollection<ConfigModel> ConnectToMongo()
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<ConfigModel>(ConfigCollection);
    }

    public async Task<ConfigModel> GetConfig()
    {
        var collection = ConnectToMongo();
        return await collection.Find(_ => true).FirstOrDefaultAsync();
    }

    public async Task UpsertConfig(ConfigModel config)
    {
        var collection = ConnectToMongo();
        var existingDocument = await collection.Find(_ => true).FirstOrDefaultAsync();

        if (existingDocument != null) {
            config.Id = existingDocument.Id;
            await collection.ReplaceOneAsync(x => x.Id == existingDocument.Id, config);
        }
        else {
            await collection.InsertOneAsync(config);
        }
    }
}
