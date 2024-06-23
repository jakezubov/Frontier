namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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
    public List<HistoryModel> History { get; set; } = new List<HistoryModel>();
    public List<MetalModel> Metals { get; set; } = new List<MetalModel>();
    public List<RingSizeModel> RingSizes { get; set; } = new List<RingSizeModel>();
}
