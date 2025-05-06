namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Models;
using MongoDB.Driver;

public class VerificationCodeDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo)
{
    private readonly string VerificationCodeCollection = configuration["Mongo:VerificationCodeCollection"]!;

    public async Task<VerificationCodeModel> GetVerificationCode(string email)
    {
        var collection = connectToMongo.Connect<VerificationCodeModel>(VerificationCodeCollection);
        return await collection.Find(c => c.Email == email).FirstOrDefaultAsync();
    }

    public async Task CreateVerificationCode(VerificationCodeModel code)
    {
        var collection = connectToMongo.Connect<VerificationCodeModel>(VerificationCodeCollection);
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
        var collection = connectToMongo.Connect<VerificationCodeModel>(VerificationCodeCollection);
        await collection.DeleteOneAsync(c => c.Email == email);
    }
}
