using Frontier.Server.Controllers;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;

namespace Frontier.Server.Functions;

public class Setup
{
    private readonly ConfigController _configController = new();
    private readonly ConfigDataAccess _configDataAccess = new();

    public async void CheckFirstTimeSetup()
    {
        bool result = await _configController.GetInitialisedStatus();
        if (!result) {
            RunFirstTimeSetup();
        }
    }

    private async void RunFirstTimeSetup()
    {
        ConfigModel config = new();

        await _configDataAccess.CreateConfig(config);
        await _configController.ResetMetals();
        await _configController.ResetRingSizes();
    }
}
