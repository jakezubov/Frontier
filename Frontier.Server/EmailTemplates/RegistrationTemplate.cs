namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;

public class RegistrationTemplate(string name, string email) : IBaseTemplate
{
    public string Title => "Account Registration";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Account Registration Request</h1>
        <p>Hello {name},</p>
        <p>We received a request to create your account. As part of this request could you please verify your email by clicking the button below:</p>
        <a class=""button"" href=""https://jewellery.zubov.com.au/account/email/VerifyAccount?email={email}"">Verify Account</a>
        <p>If you did not create an account, please ignore this email.</p>
    ";
}
