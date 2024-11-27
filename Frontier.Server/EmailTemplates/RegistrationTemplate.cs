namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;

public class RegistrationTemplate(string name, string code) : IBaseTemplate
{
    public string Title => "Account Registration";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Account Registration Request</h1>
        <p>Hello {name},</p>
        <p>We received a request to create your account. To setup your account can you please enter the code below into the website:</p>
        <h2>{code}</h2>
        <p>If you did not create an account, please ignore this email.</p>
    ";
}
