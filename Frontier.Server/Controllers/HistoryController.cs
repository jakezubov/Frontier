using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HistoryController(UserDataAccess dbUsers) : ControllerBase
    {
        // Get History
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetHistory(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists and if it does return the history
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.History);
            }
            return BadRequest("No User Id Supplied");
        }

        // Add History
        [HttpPost("{userId}/create")]
        public async Task<IActionResult> CreateHistory(string userId, HistoryModel newHistory)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Count the number of history entries of the same type
                int historyCount = user.History.Count(h => h.HistoryType == newHistory.HistoryType);

                // Remove the oldest history entry of the same type if required
                if (historyCount >= user.HistoryAmount)
                {
                    var oldestHistory = user.History
                        .Where(h => h.HistoryType == newHistory.HistoryType)
                        .OrderBy(h => h.Timestamp)
                        .FirstOrDefault();
                    if (oldestHistory != null) user.History.Remove(oldestHistory);
                }
                user.History.Insert(0, newHistory);

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Delete History
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> DeleteHistory(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Clear the history and update
                user.History.Clear();
                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
    }
}
