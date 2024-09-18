namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class UserModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string FullName => $"{FirstName} {LastName}";
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string? Salt { get; set; }
    public int HistoryAmount { get; set; } = 5;
    public List<HistoryModel> History { get; set; } = [];
    public List<MetalModel> Metals { get; set; } = [];
    public List<RingSizeModel> RingSizes { get; set; } = [];
    public DateTime LastLoggedIn { get; set; } = DateTime.UtcNow;
    public bool LoggedInTF { get; set; } = false;
    public bool VerifiedTF { get; set; } = false;
    public bool AdminTF { get; set; } = false;
}
