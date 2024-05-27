namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using DataAccess;

public class UserModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string? Salt { get; set; }
    public int HistoryAmount { get; set; } = 10;
    public List<MetalModel> MetalModels { get; set; } = Defaults.Metals;
    public List<RingSizeModel> RingSizes { get; set; } = Defaults.RingSizes;

    // history

}
