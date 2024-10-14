namespace Frontier.Server.Models;

using Frontier.Server.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class AzureClientModel : IEmailClientModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public EmailClientType ClientType { get; set; } = EmailClientType.Azure;
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public required string TenantId { get; set; }
    public required string SendingEmail { get; set; }
    public required string ContactFormRecipient { get; set; }
}
