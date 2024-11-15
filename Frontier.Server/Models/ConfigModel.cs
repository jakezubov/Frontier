namespace Frontier.Server.Models;

using Frontier.Server.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class ConfigModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public bool InitialisedTF { get; set; } = false;
    public EmailClientType CurrentClientType { get; set; }
    public AzureClientModel? AzureClient { get; set; }
}
