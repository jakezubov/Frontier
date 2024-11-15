namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MetalModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public required string Name { get; set; }
    public required double SpecificGravity { get; set; }
    public required int ListIndex { get; set; }
}
