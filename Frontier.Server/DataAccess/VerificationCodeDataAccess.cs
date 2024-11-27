namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class VerificationCodeDataAccess
{
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string ConfigCollection = "verification_codes";

    private IMongoCollection<VerificationCodeModel> ConnectToMongo()
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<VerificationCodeModel>(ConfigCollection);
    }

    public async Task<VerificationCodeModel> GetVerificationCode(string email)
    {
        var collection = ConnectToMongo();
        return await collection.Find(c => c.Email == email).FirstOrDefaultAsync();
    }

    public async Task CreateVerificationCode(VerificationCodeModel code)
    {
        var collection = ConnectToMongo();
        var existingDocument = await collection.Find(c => c.Email == code.Email).FirstOrDefaultAsync();

        if (existingDocument != null) {
            code.Id = existingDocument.Id;
            await collection.ReplaceOneAsync(x => x.Id == existingDocument.Id, code);
        }
        else {
            await collection.InsertOneAsync(code);
        }
    }

    public async Task DeleteVerificationCode(string email)
    {
        var collection = ConnectToMongo();
        await collection.DeleteOneAsync(c => c.Email == email);
    }
}
