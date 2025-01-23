using Frontier.Server.DataAccess;
using Frontier.Server.Models;

namespace Frontier.Server.Functions;

public class Setup
{
    private readonly ConfigDataAccess dbConfig = new();
    private readonly MetalDataAccess dbMetals = new();
    private readonly RingSizeDataAccess dbRingSizes = new();
    private readonly Defaults defaults = new();

    public async void CheckFirstTimeSetup()
    {
        bool result = await dbConfig.GetInitialisedStatus();
        if (!result) {
            RunFirstTimeSetup();
        }
    }

    private async void RunFirstTimeSetup()
    {
        ConfigModel config = new();

        await dbConfig.CreateConfig(config);
        await dbMetals.UpdateAllMetals(defaults.Metals);
        await dbRingSizes.UpdateAllRingSizes(defaults.RingSizes);
    }
}
