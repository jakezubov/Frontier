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

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly ConfigDataAccess db = new();
    private readonly UserDataAccess dbUsers = new();
    private readonly VerificationCodeDataAccess dbVerify = new();
    private GraphServiceClient? graphClient;
    private readonly Misc functions = new();

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

    [HttpPost("send/password-reset/{base64Email}")]
    public async Task<IActionResult> PasswordReset(string base64Email)
    {
        if (base64Email != null) {
            string email = functions.ConvertFromBase64(base64Email);

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

    [HttpPost("send/registration/{base64Name}/{base64Email}")]
    public async Task<IActionResult> Registration(string base64Name, string base64Email)
    {
        if (base64Email != null && base64Name != null) {
            string name = functions.ConvertFromBase64(base64Name);
            string email = functions.ConvertFromBase64(base64Email);

            IEmailClientModel? client = await GetCurrentClient();
            if (client != null) {
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

    [HttpPost("send/verification/{base64Name}/{base64Email}")]
    public async Task<IActionResult> Verification(string base64Name, string base64Email)
    {
        if (base64Email != null && base64Name != null) {
            string name = functions.ConvertFromBase64(base64Name);
            string email = functions.ConvertFromBase64(base64Email);

            IEmailClientModel? client = await GetCurrentClient();
            Console.WriteLine(client);
            if (client != null) {
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

    [HttpPut("test/azure/{base64ApiToken}")]
    public async Task<IActionResult> TestAzureClient(AzureClientModel client, string base64ApiToken)
    {
        if (base64ApiToken != null) {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken)) {
                LoadAzureClient(client);
                IActionResult response = await TestClient(client);

                if (response is OkResult) return Ok();
                return NoContent();
            }
            else return Forbid();
        }
        return BadRequest("No API Token Supplied");
    }

    private async Task<IActionResult> TestClient(IEmailClientModel client)
    {
        ContactFormModel contactTest = new() {
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

        if (graphClient != null)
        {
            try
            {
                await graphClient.Users[sendingEmail]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody {
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

    #endregion

    #region Clients

    [HttpGet("get/{type}/client")]
    public async Task<IEmailClientModel?> GetEmailClient(EmailClientType type)
    {
        if (type == EmailClientType.Azure) { return await db.GetEmailClient(type) as AzureClientModel; }
        else return null;
    }

    [HttpPost("update/azure/client/{base64ApiToken}")]
    public async Task<IActionResult> UpdateAzureClient(AzureClientModel client, string base64ApiToken)
    {
        if (base64ApiToken != null) {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken)) {
                await db.UpdateAzureClient(client);
                await db.UpdateCurrentClientType(EmailClientType.Azure);
                return Ok();
            }
            else return Forbid();
        }
        else return BadRequest("No API Token Supplied");
    }

    [HttpGet("client-type")]
    public async Task<IActionResult> GetCurrentClientType()
    {
        EmailClientType result = await db.GetCurrentClientType();
        return Ok(result);
    }

    [HttpPut("client-type/update/{newClientType}/{base64ApiToken}")]
    public async Task<IActionResult> UpdateCurrentClientType(EmailClientType newClientType, string base64ApiToken)
    {
        if (base64ApiToken != null && Enum.IsDefined(typeof(EmailClientType), newClientType)) {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken))
            {
                await db.UpdateCurrentClientType(newClientType);
                return Ok();
            }
            else return Forbid();
        }
        else return BadRequest("No API Token and/or Client Type Supplied");
    }

    private async Task<IEmailClientModel?> GetCurrentClient()
    {
        EmailClientType currentEmailClient = await db.GetCurrentClientType();

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

    #region Verification

    [HttpDelete("verification/{base64Email}/{base64Code}")]
    public async Task<IActionResult> CheckVerificationCode(string base64Email, string base64Code)
    {
        if (base64Email != null && base64Code != null) {
            string email = functions.ConvertFromBase64(base64Email);
            string code = functions.ConvertFromBase64(base64Code);
        
            VerificationCodeModel result = await dbVerify.GetVerificationCode(email);

            if (result != null && result.Code == code) {
                await dbVerify.DeleteVerificationCode(email);
                return Ok();
            }
            return NoContent();
        }
        else return BadRequest("No Email and/or Codes Supplied");
    }

    private async Task<string> NewVerificationCode(string email)
    {
        string code = functions.GenerateVerificationCode();
        VerificationCodeModel newVerification = new() {
            Email = email,
            Code = code
        };
        await dbVerify.CreateVerificationCode(newVerification);
        return code;
    }

    #endregion
}