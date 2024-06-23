using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        UserDataAccess db = new UserDataAccess();

        #region User APIs
        // Get All Users
        [HttpGet]
        public async Task<IEnumerable<UserModel>> GetAllUsers() => await db.GetAllUsers();

        // Get User
        [HttpGet("{id}")]
        public async Task<UserModel> GetUser(string id) => await db.GetUser(id);

        // Validate User
        [HttpGet("validate")]
        public async Task<IActionResult> ValidateUser(string email, string password)
        {
            // Get the user from the email
            UserModel user = await db.ValidateUser(email);
            if (user == null) return NotFound("User not found");

            // Hash supplied password and check if it matches the user password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, user.Salt);
            bool isValid = passwordHash == user.PasswordHash;
            if (!isValid) return Unauthorized("Password is incorrect");

            return Ok(user.Id);
        }

        // Create User
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserModel user)
        {
            // Hash the password and add the salt to the user
            string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
            user.Salt = salt;

            await db.CreateUser(user);
            return Created();
        }

        // Update User Details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromBody] UserModel updateUser, bool isNewPassword)
        {
            // Check if the user exists in MongoDB
            if (updateUser.Id != null) {
                UserModel user = await db.GetUser(updateUser.Id);
                if (user == null) return NotFound("User not found");

                // If the HistoryAmount becomes less then current amount remove all old values down to the current amount
                if (updateUser.HistoryAmount < user.HistoryAmount) {
                    var uniqueHistoryTypes = user.History.Select(h => h.HistoryType).Distinct().ToList();
                    foreach (var type in uniqueHistoryTypes) {
                        while (user.History.Where(h => h.HistoryType == type).ToList().Count > updateUser.HistoryAmount) {
                            var oldestHistory = user.History
                                .Where(h => h.HistoryType == type)
                                .OrderBy(h => h.Timestamp)
                                .FirstOrDefault();
                            if (oldestHistory != null) user.History.Remove(oldestHistory);
                        }
                    }
                }

                // Update the users details
                user.FirstName = updateUser.FirstName;
                user.LastName = updateUser.LastName;
                user.Email = updateUser.Email;
                user.HistoryAmount = updateUser.HistoryAmount;

                // Check if the user has changed password, if so hash the password and add the new salt to the user
                if (isNewPassword) {
                    string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUser.PasswordHash, salt);
                    user.Salt = salt;
                }

                await db.UpdateUser(user);
                return Ok();
            }
            else return NotFound("ERROR: User has no Id");
        }

        // Delete User
        [HttpDelete("{id}")]
        public void DeleteUser(UserModel user) => db.DeleteUser(user);
        #endregion

        #region History APIs
        // Get History
        [HttpGet("history/{id}")]
        public async Task<IActionResult> GetHistory(string id)
        {
            // Check if the user exists and if it does return the history
            UserModel user = await db.GetUser(id);
            if (user == null) return NotFound("User not found");
            return Ok(user.History);
        }

        // Add History
        [HttpPut("history/{id}")]
        public async Task<IActionResult> PutHistory(string id, HistoryModel newHistory)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(id);
            if (user == null) return NotFound("User not found");

            // Count the number of history entries of the same type
            int historyCount = user.History.Count(h => h.HistoryType == newHistory.HistoryType);

            // Remove the oldest history entry of the same type if required
            if (historyCount >= user.HistoryAmount) {
                var oldestHistory = user.History
                    .Where(h => h.HistoryType == newHistory.HistoryType)
                    .OrderBy(h => h.Timestamp)
                    .FirstOrDefault();
                if (oldestHistory != null) user.History.Remove(oldestHistory);
            }
            user.History.Insert(0, newHistory);

            await db.UpdateUser(user);
            return Ok();
        }

        // Delete History
        [HttpDelete("history/{id}")]
        public async Task<IActionResult> DeleteHistory(string id)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(id);
            if (user == null) return NotFound("User not found");

            // Clear the history and update
            user.History.Clear();
            await db.UpdateUser(user);
            return Ok();
        }
        #endregion
    }
}
