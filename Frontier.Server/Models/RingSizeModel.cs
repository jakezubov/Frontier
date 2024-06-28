namespace Frontier.Server.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class RingSizeModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Name => $"{LetterSize} / {NumberSize}";
    public required string LetterSize { get; set; }
    public required double NumberSize { get; set; }
    public required double Diameter { get; set; }
}