namespace Frontier.Server.DataAccess;

using Frontier.Server.Interfaces;
using Frontier.Server.Models;
using MongoDB.Driver;

public class AzureClientDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string EmailClientCollection = "email_clients";

    private IMongoCollection<AzureClientModel> ConnectToMongo()
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<AzureClientModel>(EmailClientCollection);
    }

    public async Task<AzureClientModel> GetAzureClient()
    {
        var collection = ConnectToMongo();
        var filter = Builders<AzureClientModel>.Filter.Eq(e => e.ClientType, EmailClientType.Azure);
        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task UpsertAzureClient(AzureClientModel client)
    {
        if (client.ClientType == EmailClientType.Azure)
        {
            var collection = ConnectToMongo();
            var filter = Builders<AzureClientModel>.Filter.Eq(e => e.ClientType, EmailClientType.Azure);

            var existingDocument = await collection.Find(filter).FirstOrDefaultAsync();

            if (existingDocument != null)
            {
                client.Id = existingDocument.Id;
                await collection.ReplaceOneAsync(filter, client);
            }
            else
            {
                await collection.InsertOneAsync(client);
            }
        }
    }
}
