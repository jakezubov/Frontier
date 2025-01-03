namespace Frontier.Server.Models;

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class ErrorLedgerModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public required string UserDetails { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public required string Stack { get; set; }
    public DateTime ErrorTime { get; set; } = DateTime.UtcNow;
}
