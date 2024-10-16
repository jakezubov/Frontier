using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using MongoDB.Bson;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultsController : ControllerBase
    {
        private readonly MetalDataAccess dbMetals = new();
        private readonly RingSizeDataAccess dbRingSizes = new();
        private readonly Defaults defaults = new();

        // Get Default Metals
        [HttpGet("metals")]
        public async Task<IEnumerable<MetalModel>> GetDefaultMetals() => await dbMetals.GetAllMetals();

        // Update All Default Metals
        [HttpPut("metals/update")]
        public async Task<IActionResult> UpdateMetals(List<MetalModel> updatedMetals)
        {
            await dbMetals.UpdateAllMetals(updatedMetals);
            return Ok();
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
        [HttpPut("ring-sizes/update")]
        public async Task<IActionResult> UpdateRingSizes(List<RingSizeModel> updatedRingSizes)
        {
            await dbRingSizes.UpdateAllRingSizes(updatedRingSizes);
            return Ok();
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
