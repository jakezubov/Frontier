namespace Frontier.Server.Models;

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class VerificationCodeModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public required string Email { get; set; }
    public required string Code { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
}
