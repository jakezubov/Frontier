namespace Frontier.Server.DataAccess;

using Frontier.Server.Functions;
using Frontier.Server.Models;
using MongoDB.Driver;

public class UserDataAccess(IConfiguration configuration, ConnectToMongo connectToMongo, MetalDataAccess metalDataAccess, RingSizeDataAccess ringSizeDataAccess)
{
    private readonly string UserCollection = configuration["Mongo:UserCollection"]!;

    public async Task<List<UserModel>> GetAllUsers()
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        var results = await collection.FindAsync(_ => true);
        return results.ToList();
    }

    public async Task<UserModel> GetUser(string id)
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        var results = await collection.FindAsync(u => u.Id == id);
        return results.FirstOrDefault();
    }

    public async Task<UserModel> ValidateUser(string email)
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        var results = await collection.FindAsync(u => u.Email == email);
        return results.FirstOrDefault();
    }

    public async Task<Task> CreateUser(UserModel user)
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        user.Metals = await metalDataAccess.GetAllMetals();
        user.RingSizes = await ringSizeDataAccess.GetAllRingSizes();
        return collection.InsertOneAsync(user);
    }

    public Task UpdateUser(UserModel user)
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        var filter = Builders<UserModel>.Filter.Eq("Id", user.Id);
        ReplaceOptions options = new() { IsUpsert = true };
        return collection.ReplaceOneAsync(filter, user, options);
    }

    public Task DeleteUser(UserModel user)
    {
        var collection = connectToMongo.Connect<UserModel>(UserCollection);
        return collection.DeleteOneAsync(u => u.Id == user.Id);
    }

    public async Task<UserModel?> AuthenticateUser(string email, string password)
    {
        // Get the user from the email
        UserModel user = await ValidateUser(email.ToLower());
        if (user == null) return null;

        // Hash supplied password and check if it matches the user password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, user.Salt);
        bool isValid = passwordHash == user.PasswordHash;
        if (!isValid) return null;

        return user;
    }
}
