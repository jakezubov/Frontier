namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;

public class PasswordResetTemplate(string email) : IBaseTemplate
{
    public string Title => "Password Reset";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. You can create a new password by clicking the button below:</p>
        <a class=""button"" href=""https://localhost:5173/account/email/ResetPassword?email={email}"">Reset Password</a>
        <p>If you did not request this change, please ignore this email.</p>
    ";
}
