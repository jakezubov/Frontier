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
        readonly MetalDataAccess dbMetals = new();
        readonly RingSizeDataAccess dbRingSizes = new();

        // Get Default Metals
        [HttpGet("metals")]
        public async Task<IEnumerable<MetalModel>> GetDefaultMetals() => await dbMetals.GetAllMetals();

        // Get Default Ring Sizes
        [HttpGet("ring-sizes")]
        public async Task<IEnumerable<RingSizeModel>> GetDefaultRingSizes() => await dbRingSizes.GetAllRingSizes();

        // Generate Mongo Object ID
        [HttpGet("generate-id")]
        public string GenerateId() => ObjectId.GenerateNewId().ToString();
    }
}
