using Frontier.Server.DataAccess;
using Frontier.Server.Models;

namespace Frontier.Server.Functions;

public class Setup(ConfigDataAccess dbConfig, MetalDataAccess dbMetals, RingSizeDataAccess dbRingSizes)
{
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
        await dbMetals.UpdateAllMetals(Defaults.Metals);
        await dbRingSizes.UpdateAllRingSizes(Defaults.RingSizes);
    }
}
