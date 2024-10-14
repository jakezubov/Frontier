namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;

public class VerificaitonTemplate(string name, string email) : IBaseTemplate
{
    public string Title => "Account Verification";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Account Verification Request</h1>
        <p>Hello {name},</p>
        <p>We received a request to verify your account. You can do this by clicking the button below:</p>
        <a class=""button"" href=""https://localhost:5173/account/email/VerifyAccount?email={email}"">Verify Account</a>
        <p>If you did not request it, please ignore this email.</p>
    ";
}
