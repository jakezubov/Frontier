using Frontier.Server.Interfaces;

namespace Frontier.Server.EmailTemplates;

public class BaseTemplate(IBaseTemplate email)
{
    private const string imageUrl = "https://static-00.iconduck.com/assets.00/gem-icon-2048x1820-nw1vrj8g.png";
    private const string companyName = "Zubov Innovations";
    private const string contactEmail = "support@zubov.com.au";

    public readonly string html = $@"
        <!DOCTYPE html>
        <html lang=""en"">
            <head>
                <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>{email.Title}</title>
            </head>
            <style>
                body {{ font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                .preheader {{ display: none; max-height: 0px; overflow: hidden; }}
                .container {{ max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }}
                .img {{ display: inline-block; width: 80px; height: auto; padding-bottom: 20px; }}
                .content {{ font-size: 16px; line-height: 1.5; }}
                .content-heading {{ font-size: 24px; color #333; }}
                .button {{ display: inline-block; padding: 10px 20px; font-size: 16px; color: #007bff; text-decoration: none; border-radius: 4px; text-align: center; }}
                .footer {{ text-align: center; font-size: 14px; color: #888; padding-top: 20px; }}
                .link {{ color: #007bff; }}
            </style>
            <body>
                <div clas=""preheader"">Jewellery Calculation Suite</div>
                <table class=""container"" align=""center"" width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"">
                    <tr>
                        <td class""img-container"" align=""center"">
                            <img class=""img"" src=""{imageUrl}"" alt=""Company Logo"" width=""80"" height=""80"">
                        </td>
                    </tr>
                    <tr>
                        <td class=""content"">
                            {email.Content}
                        </td>
                    </tr>
                    <tr>
                        <td class=""footer"">
                            <p>Kind Regards,</p>
                            <p>Jewellery Calculation Suite</p>
                            <p>{companyName}</p>
                            <p>Contact us at <a class=""link"" href=""mailto:{contactEmail}"">{contactEmail}</a></p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    ";
}
