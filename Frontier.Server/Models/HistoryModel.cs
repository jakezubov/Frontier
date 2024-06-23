namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class HistoryModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public required string HistoryType { get; set; }
    public required string Content { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
