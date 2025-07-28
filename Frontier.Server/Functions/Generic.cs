namespace Frontier.Server.Functions;

using MongoDB.Bson;

public class Generic()
{
    static public string GenerateVerificationCode()
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

    static public string GenerateId() => ObjectId.GenerateNewId().ToString();
}
