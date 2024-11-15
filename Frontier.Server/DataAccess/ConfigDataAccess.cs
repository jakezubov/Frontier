namespace Frontier.Server.DataAccess;

using Frontier.Server.Interfaces;
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

    public async Task CreateConfig(ConfigModel config)
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

    public async Task<EmailClientType> GetCurrentClientType()
    {
        ConfigModel config = await GetConfig();
        return config.CurrentClientType;
    }

    public async Task UpdateCurrentClientType(EmailClientType newClientType)
    {
        ConfigModel config = await GetConfig();

        config.CurrentClientType = newClientType;
        var collection = ConnectToMongo();
        await collection.ReplaceOneAsync(_ => true, config);
    }

    public async Task<IEmailClientModel?> GetEmailClient(EmailClientType type)
    {
        ConfigModel config = await GetConfig();

        if (type == EmailClientType.Azure) { return config.AzureClient; }
        else return null;
    }

    public async Task UpdateAzureClient(AzureClientModel client)
    {
        ConfigModel config = await GetConfig();

        config.AzureClient = client;
        var collection = ConnectToMongo();
        await collection.ReplaceOneAsync(_ => true, config);
    }

    public async Task<bool> GetInitialisedStatus()
    {
        ConfigModel config = await GetConfig();

        if (config == null) {
            return false;
        }
        return config.InitialisedTF;
    }

    public async Task UpdateInitialisedStatus(bool newStatus)
    {
        ConfigModel config = await GetConfig();

        config.InitialisedTF = newStatus;
        var collection = ConnectToMongo();
        await collection.ReplaceOneAsync(_ => true, config);
    }
}
