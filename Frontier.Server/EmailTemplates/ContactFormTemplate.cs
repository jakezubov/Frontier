namespace Frontier.Server.EmailTemplates;

using Frontier.Server.Interfaces;
using Frontier.Server.Models;

public class ContactFormTemplate(ContactFormModel details) : IBaseTemplate
{
    public string Title => "Contact Form";

    public string Content => $@"
        <h1 style=""font-size: 24px; color #333;"">Contact Form Request</h1>
        <p>A new contact form has been submitted.</p>
        <p>Name: {details.Name}</p>
        <p>Email: {details.Email}</p>
        <p>Message: {details.Message}</p>
    ";
}

