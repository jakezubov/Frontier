using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Frontier.Server.Functions;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ConfigController(ConfigDataAccess dbConfig) : ControllerBase
    {
        // Get Initialised Status
        [HttpGet("init")]
        public async Task<bool> GetInitialisedStatus() => await dbConfig.GetInitialisedStatus();

        // Update Initialised Status
        [HttpPost("init/update/{newStatus}")]
        public async Task<IActionResult> UpdateInitialisedStatus(bool newStatus)
        {
            string? role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (await dbConfig.GetInitialisedStatus() && role != "Admin") {
                return Forbid();
            }

            await dbConfig.UpdateInitialisedStatus(newStatus);
            return Ok();
        }

        // Generate Mongo Object ID
        [HttpGet("generate-id")]
        public string GenerateId() => Generic.GenerateId();
    }
}
