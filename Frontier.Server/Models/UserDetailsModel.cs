namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class UserDetailsModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public int HistoryAmount { get; set; }
    public DateTime LastLoggedIn { get; set; }
    public bool LoggedInTF { get; set; }
    public bool AdminTF { get; set; }
}
