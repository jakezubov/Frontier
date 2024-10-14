namespace Frontier.Server.DataAccess;

using Frontier.Server.Models;
using MongoDB.Driver;

public class UserDataAccess
{
    private readonly MetalDataAccess metalDataAccess = new();
    private readonly RingSizeDataAccess ringSizeDataAccess = new();
    private readonly string ConnectionString = "mongodb://localhost:27017";
    private readonly string DatabaseName = "frontier";
    private readonly string UserCollection = "users";

    private IMongoCollection<T> ConnectToMongo<T>(in string collection)
    {
        var client = new MongoClient(ConnectionString);
        var db = client.GetDatabase(DatabaseName);
        return db.GetCollection<T>(collection);
    }

    public async Task<List<UserModel>> GetAllUsers()
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        var results = await usersCollection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<UserModel> GetUser(string id)
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        var results = await usersCollection.FindAsync(u => u.Id == id);
        return results.FirstOrDefault();
    }

    public async Task<UserModel> ValidateUser(string email)
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        var results = await usersCollection.FindAsync(u => u.Email == email);
        return results.FirstOrDefault();
    }

    public async Task<Task> CreateUser(UserModel user)
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        user.Metals = await metalDataAccess.GetAllMetals();
        user.RingSizes = await ringSizeDataAccess.GetAllRingSizes();
        return usersCollection.InsertOneAsync(user);
    }

    public Task UpdateUser(UserModel user)
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        var filter = Builders<UserModel>.Filter.Eq("Id", user.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return usersCollection.ReplaceOneAsync(filter, user, options);
    }

    public Task DeleteUser(UserModel user)
    {
        var usersCollection = ConnectToMongo<UserModel>(UserCollection);
        return usersCollection.DeleteOneAsync(u => u.Id == user.Id);
    }
}
