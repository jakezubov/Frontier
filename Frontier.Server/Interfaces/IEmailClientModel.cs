namespace Frontier.Server.Interfaces;

public interface IEmailClientModel
{
    public EmailClientType ClientType { get; set; }
    public string SendingEmail { get; set; }
    public string ContactFormRecipient { get; set; }
}

public enum EmailClientType {
    None,
    Azure,
}