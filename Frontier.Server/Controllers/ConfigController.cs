using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Frontier.Server.Functions;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly MetalDataAccess dbMetals = new();
        private readonly RingSizeDataAccess dbRingSizes = new();
        private readonly UserDataAccess dbUsers = new();
        private readonly ConfigDataAccess dbConfig = new();
        private readonly Defaults defaults = new();
        private readonly Misc functions = new();

        // Get Initialised Status
        [HttpGet("init")]
        public async Task<bool> GetInitialisedStatus()
        {
            return await dbConfig.GetInitialisedStatus();
        }

        // Update Initialised Status
        [HttpPut("init/update/{newStatus}/{base64ApiToken}")]
        public async Task<IActionResult> UpdateInitialisedStatus(bool newStatus, string base64ApiToken)
        {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken)) {
                await dbConfig.UpdateInitialisedStatus(newStatus);
                return Ok();
            }
            else return Forbid();
        }

        // Get Default Metals
        [HttpGet("metals")]
        public async Task<IEnumerable<MetalModel>> GetDefaultMetals() => await dbMetals.GetAllMetals();

        // Update All Default Metals
        [HttpPut("metals/update/{base64ApiToken}")]
        public async Task<IActionResult> UpdateMetals(List<MetalModel> updatedMetals, string base64ApiToken)
        {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken)) {
                await dbMetals.UpdateAllMetals(updatedMetals);
                return Ok();
            }
            else return Forbid();
        }

        // Reset To Default Metals
        [HttpPut("metals/reset")]
        public async Task<IActionResult> ResetMetals()
        {
            await dbMetals.UpdateAllMetals(defaults.Metals);
            return Ok();
        }

        // Get Default Ring Sizes
        [HttpGet("ring-sizes")]
        public async Task<IEnumerable<RingSizeModel>> GetDefaultRingSizes() => await dbRingSizes.GetAllRingSizes();

        // Update All Default Ring Sizes
        [HttpPut("ring-sizes/update/{base64ApiToken}")]
        public async Task<IActionResult> UpdateRingSizes(List<RingSizeModel> updatedRingSizes, string base64ApiToken)
        {
            string apiToken = functions.ConvertFromBase64(base64ApiToken);

            if (await dbUsers.GetAdminStatus(apiToken)) {
                await dbRingSizes.UpdateAllRingSizes(updatedRingSizes);
                return Ok();
            }
            else return Forbid();
        }

        // Reset To Default Ring Sizes
        [HttpPut("ring-sizes/reset")]
        public async Task<IActionResult> ResetRingSizes()
        {
            await dbRingSizes.UpdateAllRingSizes(defaults.RingSizes);
            return Ok();
        }

        // Generate Mongo Object ID
        [HttpGet("generate-id")]
        public string GenerateId() => ObjectId.GenerateNewId().ToString();
    }
}
