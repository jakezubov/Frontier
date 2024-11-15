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
public class EmailController : ControllerBase
{
    private readonly ConfigDataAccess _db = new();
    private GraphServiceClient? _graphClient;

    #region Sending Emails

    [HttpPost("send/contact-form")]
    public async Task<IActionResult> ContactForm(ContactFormModel newSubmission)
    {
        IEmailClientModel? client = await GetCurrentClient();
        if (client != null) {
            ContactFormTemplate emailType = new(newSubmission);
            BaseTemplate emailContents = new(emailType);
            string subject = $"Submission from {newSubmission.Name}";
            return await SendEmail(subject, emailContents, client.ContactFormRecipient, client.SendingEmail);
        }
        return BadRequest("Emailing Not Setup Correctly");
    }

    [HttpPost("send/password-reset/{email}")]
    public async Task<IActionResult> PasswordReset(string email)
    {
        IEmailClientModel? client = await GetCurrentClient();
        if (client != null) {
            PasswordResetTemplate emailType = new(email);
            BaseTemplate emailContents = new(emailType);
            string subject = "Password Reset";
            return await SendEmail(subject, emailContents, email, client.SendingEmail);
        }
        return BadRequest("Emailing Not Setup Correctly");
    }

    [HttpPost("send/registration/{name}/{email}")]
    public async Task<IActionResult> Registration(string name, string email)
    {
        IEmailClientModel? client = await GetCurrentClient();
        if (client != null) {
            RegistrationTemplate emailType = new(name, email);
            BaseTemplate emailContents = new(emailType);
            string subject = "Account Registration";
            return await SendEmail(subject, emailContents, email, client.SendingEmail);
        }
        return BadRequest("Emailing Not Setup Correctly");
    }

    [HttpPost("send/verification/{name}/{email}")]
    public async Task<IActionResult> Verification(string name, string email)
    {
        IEmailClientModel? client = await GetCurrentClient();
        if (client != null) {
            VerificaitonTemplate emailType = new(name, email);
            BaseTemplate emailContents = new(emailType);
            string subject = "Account Verification";
            return await SendEmail(subject, emailContents, email, client.SendingEmail);
        }
        return BadRequest("Emailing Not Setup Correctly");
    }

    [HttpPut("test/azure")]
    public async Task<IActionResult> TestAzureClient(AzureClientModel client)
    {
        LoadAzureClient(client);
        IActionResult response = await TestClient(client);

        if (response is OkResult) return Ok();
        return NoContent();
    }

    private async Task<IActionResult> TestClient(IEmailClientModel client)
    {
        ContactFormModel contactTest = new()
        {
            Name = "Email Tester",
            Email = client.ContactFormRecipient,
            Message = "This is a test email"
        };

        ContactFormTemplate emailType = new(contactTest);
        BaseTemplate emailContents = new(emailType);
        string subject = $"Test Email from {contactTest.Name}";
        IActionResult response = await SendEmail(subject, emailContents, client.ContactFormRecipient, client.SendingEmail);

        if (response is OkResult) return Ok();
        return NoContent();
    }

    private async Task<IActionResult> SendEmail(string subject, BaseTemplate emailContents, string recipient, string sendingEmail)
    {
        Message message = new() {
            Subject = subject,
            Body = new ItemBody {
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

        if (_graphClient != null)
        {
            try
            {
                await _graphClient.Users[sendingEmail]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody {
                        Message = message
                    });

                _graphClient = null;
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

    #endregion

    #region Clients

    private async Task<IEmailClientModel?> GetCurrentClient()
    {
        EmailClientType currentEmailClient = await _db.GetCurrentClientType();

        if (currentEmailClient == EmailClientType.Azure && await GetEmailClient(currentEmailClient) is AzureClientModel client) {
            LoadAzureClient(client);
            return client;
        }
        return null;
    }

    private void LoadAzureClient(AzureClientModel client)
    {
        ClientSecretCredentialOptions options = new() { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };
        ClientSecretCredential clientSecretCredential = new(client.TenantId, client.ClientId, client.ClientSecret, options);

        _graphClient = new(clientSecretCredential, ["https://graph.microsoft.com/.default"]);
    }

    [HttpGet("get/{type}/client")]
    public async Task<IEmailClientModel?> GetEmailClient(EmailClientType type)
    {
        if (type == EmailClientType.Azure) { return await _db.GetEmailClient(type) as AzureClientModel; }
        else return null;
    }

    [HttpPost("update/azure/client")]
    public async Task<IActionResult> UpdateAzureClient(AzureClientModel client)
    {
        await _db.UpdateAzureClient(client);
        return Ok();
    }

    [HttpGet("client-type")]
    public async Task<EmailClientType> GetCurrentClientType()
    {
        return await _db.GetCurrentClientType();
    }

    [HttpPut("client-type/update/{newClientType}")]
    public async Task<IActionResult> UpdateCurrentClientType(EmailClientType newClientType)
    {
        await _db.UpdateCurrentClientType(newClientType);
        return Ok();
    }

    #endregion
}