using Frontier.Server.DataAccess;
using Frontier.Server.Functions;
using Frontier.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RingSizesController(RingSizeDataAccess dbRingSizes, UserDataAccess dbUsers) : ControllerBase
    {
        // Get Ring Sizes
        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetRingSizes(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists and if it does return the ring sizes
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.RingSizes);
            }
            return BadRequest("No User Id Supplied");
        }

        // Update Ring Sizes
        [HttpPost("{userId}/update")]
        public async Task<IActionResult> UpdateRingSizes(string userId, List<RingSizeModel> updatedRingSizes)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.RingSizes = updatedRingSizes;
                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Reset Ring Sizes
        [HttpPost("{userId}/reset")]
        public async Task<IActionResult> ResetRingSizes(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Get the default ring sizes and replace current ones
                IEnumerable<RingSizeModel> ringSizes = await GetDefaultRingSizes();
                user.RingSizes = ringSizes.ToList();

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Get Default Ring Sizes
        [HttpGet("")]
        [AllowAnonymous]
        public async Task<IEnumerable<RingSizeModel>> GetDefaultRingSizes() => await dbRingSizes.GetAllRingSizes();

        // Update All Default Ring Sizes
        [HttpPost("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRingSizes(List<RingSizeModel> updatedRingSizes)
        {
            await dbRingSizes.UpdateAllRingSizes(updatedRingSizes);
            return Ok();
        }

        // Reset To Default Ring Sizes
        [HttpPost("reset")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetDefaultRingSizes()
        {
            await dbRingSizes.UpdateAllRingSizes(Defaults.RingSizes);
            return Ok();
        }
    }
}
