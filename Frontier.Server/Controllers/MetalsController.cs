using Frontier.Server.DataAccess;
using Frontier.Server.Functions;
using Frontier.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MetalsController(UserDataAccess dbUsers, MetalDataAccess dbMetals) : ControllerBase
    {
        // Get Metals
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMetals(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists and if it does return the metals
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.Metals);
            }
            return BadRequest("No User Id Supplied");
        }

        // Update Metals
        [HttpPost("{userId}/update")]
        public async Task<IActionResult> UpdateMetals(string userId, List<MetalModel> updatedMetals)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.Metals = updatedMetals;
                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Reset Metals
        [HttpPost("{userId}/reset")]
        public async Task<IActionResult> ResetMetals(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Get the default metals and replace current ones
                IEnumerable<MetalModel> metals = await GetDefaultMetals();
                user.Metals = metals.ToList();

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Get Default Metals
        [HttpGet("")]
        [AllowAnonymous]
        public async Task<IEnumerable<MetalModel>> GetDefaultMetals() => await dbMetals.GetAllMetals();

        // Update All Default Metals
        [HttpPost("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMetals(List<MetalModel> updatedMetals)
        {
            await dbMetals.UpdateAllMetals(updatedMetals);
            return Ok();
        }

        // Reset To Default Metals
        [HttpPost("reset")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetDefaultMetals()
        {
            await dbMetals.UpdateAllMetals(Defaults.Metals);
            return Ok();
        }
    }
}
