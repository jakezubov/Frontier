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
using Frontier.Server.Functions;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class EmailController(ConfigDataAccess dbConfig, UserDataAccess dbUsers, VerificationCodeDataAccess dbVerify) : ControllerBase
{
    private GraphServiceClient? graphClient;

    #region Emails

    [HttpPost("send/contact-form")]
    [AllowAnonymous]
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
    [AllowAnonymous]
    public async Task<IActionResult> PasswordReset(string email)
    {
        if (email != null) {
            UserModel user = await dbUsers.ValidateUser(email.ToLower());
            if (user == null) return BadRequest("Not a registered email");

            IEmailClientModel? client = await GetCurrentClient();
            if (client != null) {
                PasswordResetTemplate emailType = new(email);
                BaseTemplate emailContents = new(emailType);
                string subject = "Password Reset";
                return await SendEmail(subject, emailContents, email, client.SendingEmail);
            }
            return BadRequest("Emailing Not Setup Correctly");
        }
        return BadRequest("No Email Supplied");
    }

    [HttpPost("send/registration/{name}/{email}")]
    [AllowAnonymous]
    public async Task<IActionResult> Registration(string name, string email)
    {
        if (name != null && email != null)
        {
            IEmailClientModel? client = await GetCurrentClient();
            if (client != null)
            {
                string code = await NewVerificationCode(email);
                RegistrationTemplate emailType = new(name, code);
                BaseTemplate emailContents = new(emailType);
                string subject = "Account Registration";
                return await SendEmail(subject, emailContents, email, client.SendingEmail);
            }
            return BadRequest("Emailing Not Setup Correctly");
        }
        return BadRequest("No Email and/or Name Supplied");
    }

    [HttpPost("send/verification/{name}/{email}")]
    public async Task<IActionResult> Verification(string name, string email)
    {
        if (name != null && email != null)
        {
            IEmailClientModel? client = await GetCurrentClient();
            Console.WriteLine(client);
            if (client != null)
            {
                string code = await NewVerificationCode(email);
                VerificaitonTemplate emailType = new(name, code);
                BaseTemplate emailContents = new(emailType);
                string subject = "Account Verification";
                return await SendEmail(subject, emailContents, email, client.SendingEmail);
            }
            return BadRequest("Emailing Not Setup Correctly");
        }
        return BadRequest("No Email and/or Name Supplied");
    }

    [HttpDelete("verification/{email}/{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckVerificationCode(string email, string code)
    {
        if (email != null && code != null)
        {
            VerificationCodeModel result = await dbVerify.GetVerificationCode(email);

            if (result != null && result.Code == code)
            {
                await dbVerify.DeleteVerificationCode(email);
                return Ok();
            }
            return NoContent();
        }
        else return BadRequest("No Email and/or Codes Supplied");
    }

    private async Task<IActionResult> SendEmail(string subject, BaseTemplate emailContents, string recipient, string sendingEmail)
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

        if (graphClient != null)
        {
            try
            {
                await graphClient.Users[sendingEmail]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = message
                    });

                graphClient = null;
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

    private async Task<string> NewVerificationCode(string email)
    {
        string code = Generic.GenerateVerificationCode();
        VerificationCodeModel newVerification = new()
        {
            Email = email,
            Code = code
        };
        await dbVerify.CreateVerificationCode(newVerification);
        return code;
    }

    #endregion

    #region Clients

    [HttpGet("client-type")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCurrentClientType()
    {
        EmailClientType result = await dbConfig.GetCurrentClientType();
        return Ok(result);
    }

    [HttpPost("client-type/update/{newClientType}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCurrentClientType(EmailClientType newClientType)
    {
        await dbConfig.UpdateCurrentClientType(newClientType);
        return Ok();
    }

    [HttpGet("{type}/client")]
    public async Task<IEmailClientModel?> GetEmailClient(EmailClientType type)
    {
        if (type == EmailClientType.Azure) { return await dbConfig.GetEmailClient(type) as AzureClientModel; }
        else return null;
    }

    [HttpPost("azure/client/update")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAzureClient(AzureClientModel client)
    {
        await dbConfig.UpdateAzureClient(client);
        await dbConfig.UpdateCurrentClientType(EmailClientType.Azure);
        return Ok();
    }

    [HttpPost("azure/test")]
    [Authorize(Roles = "Admin")]
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

    private async Task<IEmailClientModel?> GetCurrentClient()
    {
        EmailClientType currentEmailClient = await dbConfig.GetCurrentClientType();

        if (currentEmailClient == EmailClientType.Azure && await GetEmailClient(currentEmailClient) is AzureClientModel client)
        {
            LoadAzureClient(client);
            return client;
        }
        return null;
    }

    private void LoadAzureClient(AzureClientModel client)
    {
        ClientSecretCredentialOptions options = new() { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };
        ClientSecretCredential clientSecretCredential = new(client.TenantId, client.ClientId, client.ClientSecret, options);

        graphClient = new(clientSecretCredential, ["https://graph.microsoft.com/.default"]);
    }

    #endregion
}