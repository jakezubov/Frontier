namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Interfaces;
using Frontier.Server.Models;
using MongoDB.Driver;

public class ConfigDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo)
{
    private readonly string ConfigCollection = configuration["Mongo:ConfigCollection"]!;

    private async Task<ConfigModel> GetConfig()
    {
        var collection = connectToMongo.Connect<ConfigModel>(ConfigCollection);
        return await collection.Find(_ => true).FirstOrDefaultAsync();
    }

    public async Task CreateConfig(ConfigModel config)
    {
        var collection = connectToMongo.Connect<ConfigModel>(ConfigCollection);
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
        var collection = connectToMongo.Connect<ConfigModel>(ConfigCollection);
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
        var collection = connectToMongo.Connect<ConfigModel>(ConfigCollection);
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
        var collection = connectToMongo.Connect<ConfigModel>(ConfigCollection);
        await collection.ReplaceOneAsync(_ => true, config);
    }
}
