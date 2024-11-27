namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;

public class VerificaitonTemplate(string name, string code) : IBaseTemplate
{
    public string Title => "Email Verification";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Email Verification</h1>
        <p>Hello {name},</p>
        <p>We received a request to verify your email. You can do this by entering the code below into the website:</p>
        <h2>{code}</h2>
        <p>If you did not request an email change, please ignore this email.</p>
    ";
}
