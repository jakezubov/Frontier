namespace Frontier.Server.Controllers;

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Azure.Identity;
using Microsoft.Graph.Models;
using Frontier.Server.Models;
using Frontier.Server.EmailTemplates;
using Frontier.Server.DataAccess;
using Frontier.Server.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class AzureController : ControllerBase
{
    private readonly AzureClientDataAccess _db = new();
    private GraphServiceClient? _graphClient;

    [HttpPost("send/contact-form")]
    public async Task<IActionResult> ContactForm(ContactFormModel newSubmission)
    {
        IEmailClientModel client = await LoadAzureClient();
        if (client == null) {
            return BadRequest("Emailing Not Setup Correctly");
        }

        ContactFormTemplate emailType = new(newSubmission);
        BaseTemplate emailContents = new(emailType);
        string subject = $"Submission from {newSubmission.Name}";
        return await SendEmail(subject, emailContents, client.ContactFormRecipient, client.SendingEmail);
    }

    [HttpPost("send/password-reset/{email}")]
    public async Task<IActionResult> PasswordReset(string email)
    {
        IEmailClientModel client = await LoadAzureClient();
        if (client == null) {
            return BadRequest("Emailing Not Setup Correctly");
        }

        PasswordResetTemplate emailType = new(email);
        BaseTemplate emailContents = new(emailType);
        string subject = "Password Reset";
        return await SendEmail(subject, emailContents, email, client.SendingEmail);
    }

    [HttpPost("send/registration/{name}/{email}")]
    public async Task<IActionResult> Registration(string name, string email)
    {
        IEmailClientModel client = await LoadAzureClient();
        if (client == null) {
            return BadRequest("Emailing Not Setup Correctly");
        }

        RegistrationTemplate emailType = new(name, email);
        BaseTemplate emailContents = new(emailType);
        string subject = "Account Registration";
        return await SendEmail(subject, emailContents, email, client.SendingEmail);
    }

    [HttpPost("send/verification/{name}/{email}")]
    public async Task<IActionResult> Verification(string name, string email)
    {
        IEmailClientModel client = await LoadAzureClient();
        if (client == null) {
            return BadRequest("Emailing Not Setup Correctly");
        }

        VerificaitonTemplate emailType = new(name, email);
        BaseTemplate emailContents = new(emailType);
        string subject = "Account Verification";
        return await SendEmail(subject, emailContents, email, client.SendingEmail);
    }

    [HttpGet("get/client")]
    public async Task<AzureClientModel> GetAzureClient()
    {
        return await _db.GetAzureClient();
    }

    private async Task<AzureClientModel> LoadAzureClient()
    {
        AzureClientModel client = await _db.GetAzureClient();

        ClientSecretCredentialOptions options = new() { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };
        ClientSecretCredential clientSecretCredential = new(client.TenantId, client.ClientId, client.ClientSecret, options);

        _graphClient = new GraphServiceClient(clientSecretCredential, ["https://graph.microsoft.com/.default"]);

        return client;
    }

    [HttpPost("update/client")]
    public async Task<IActionResult> UpsertEmailClient(AzureClientModel client)
    {
        await _db.UpsertAzureClient(client);
        return Ok();
    }

    private async Task<IActionResult> SendEmail(string subject, BaseTemplate emailContents, string recipient, string sendingEmail)
    {
        if (_graphClient != null) {
            try
            {
                Message message = new()
                {
                    Subject = subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = emailContents.html,
                    },
                    ToRecipients = [
                        new() {
                        EmailAddress = new EmailAddress {
                            Address = recipient
                        }
                    }
                    ]
                };

                await _graphClient.Users[sendingEmail]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = message
                    });

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error sending an email: {e}");
                return StatusCode(500, $"An error occurred while sending an email: {e.Message}");
            }
        }
        return BadRequest("Emailing Not Setup Correctly");
    }
}