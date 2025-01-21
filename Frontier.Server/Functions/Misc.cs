namespace Frontier.Server.Functions;

using System.Text;

public class Misc
{
    public string ConvertFromBase64(string base64)
    {
        byte[] bytes = Convert.FromBase64String(base64);
        return Encoding.UTF8.GetString(bytes);
    }

    public string ConvertToBase64(string plainText)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(plainText);
        return Convert.ToBase64String(bytes);
    }

    public string CreateApiToken()
    {
        string datetime = DateTime.UtcNow.ToString();
        string hash = BCrypt.Net.BCrypt.HashPassword(datetime);
        return hash.Replace("+", "-").Replace("/", "_");
    }

    public string GenerateVerificationCode()
    {
        Random random = new();
        string code = "";
        int lastDigit = -1;

        for (int i = 0; i < 6; i++)
        {
            int newDigit;
            do
            {
                newDigit = random.Next(0, 10);
            } while (newDigit == lastDigit);

            code += newDigit.ToString();
            lastDigit = newDigit;
        }
        return code;
    }
}
