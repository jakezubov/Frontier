using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserDataAccess db = new();
        private readonly DefaultsController defaults = new();

        #region User APIs
        // Get All Users
        [HttpGet]
        public async Task<IEnumerable<UserDetailsModel>> GetAllUsers()
        {
            List<UserModel> users = await db.GetAllUsers();
            List<UserDetailsModel> userDetailsList = [];

            foreach (UserModel user in users)
            {
                var userDetails = new UserDetailsModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    HistoryAmount = user.HistoryAmount,
                    History = user.History,
                    Metals = user.Metals,
                    RingSizes = user.RingSizes,
                    LastLoggedIn = user.LastLoggedIn,
                    LoggedInTF = user.LoggedInTF,
                    VerifiedTF = user.VerifiedTF,
                    AdminTF = user.AdminTF
                };

                userDetailsList.Add(userDetails);
            }

            return userDetailsList.AsEnumerable();
        } 

        // Get User
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            // Remove Salt and PasswordHash
            UserDetailsModel userDetails = new() {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                HistoryAmount = user.HistoryAmount,
                History = user.History,
                Metals = user.Metals,
                RingSizes = user.RingSizes,
                LastLoggedIn = user.LastLoggedIn,
                LoggedInTF = user.LoggedInTF,
                VerifiedTF = user.VerifiedTF,
                AdminTF = user.AdminTF
            };
            return Ok(userDetails);
        }

        // Create User
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(UserModel user)
        {
            // Hash the password and add the salt to the user
            string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
            user.Salt = salt;
            user.Email = user.Email.ToLower();

            await db.CreateUser(user);
            return Created();
        }

        // Update User Details
        [HttpPut("{userId}/update")]
        public async Task<IActionResult> UpdateUser(string userId, UserModel updateUser)
        {
            // Check if the user exists in MongoDB
            if (userId != null) {
                UserModel user = await db.GetUser(userId);
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
                user.Email = updateUser.Email.ToLower();
                user.HistoryAmount = updateUser.HistoryAmount;

                await db.UpdateUser(user);
                return Ok();
            }
            else return NotFound("ERROR: User has no Id");
        }

        // Update Password
        [HttpPut("{userId}/update/password")]
        public async Task<IActionResult> UpdatePassword(string userId, [FromBody] CredentialsModel credentials)
        {
            // Check if the user exists in MongoDB
            if (userId != null)
            {
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(credentials.Password, salt);
                user.Salt = salt;

                await db.UpdateUser(user);
                return Ok();
            }
            else return NotFound("ERROR: User has no Id");
        }

        // Delete User
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            await db.DeleteUser(user);
            return Ok();
        }

        // Switch Admin Status
        [HttpPut("{userId}/admin")]
        public async Task<IActionResult> SwitchAdmin(string userId)
        {
            // Check if the user exists in MongoDB
            if (userId != null)
            {
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.AdminTF = !user.AdminTF;

                await db.UpdateUser(user);
                return Ok();
            }
            else return NotFound("ERROR: User has no Id");
        }

        // Changes on login
        [HttpPut("{userId}/login")]
        public async Task<IActionResult> OnLogin(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            user.LastLoggedIn = DateTime.UtcNow;
            user.LoggedInTF = true;

            await db.UpdateUser(user);
            return Ok();
        }

        // Changes on logout
        [HttpPut("{userId}/logout")]
        public async Task<IActionResult> OnLogout(string userId)
        {
            // Check if the user exists in MongoDB
            if (userId != null)
            {
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.LoggedInTF = false;

                await db.UpdateUser(user);
                return Ok();
            }
            else return NotFound("ERROR: User has no Id");
        }
        #endregion


        #region Validation APIs
        // Validate User
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateUser([FromBody] CredentialsModel credentials)
        {
            // Get the user from the email
            UserModel user = await db.ValidateUser(credentials.Email.ToLower());
            if (user == null) return Ok(null);

            // Hash supplied password and check if it matches the user password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(credentials.Password, user.Salt);
            bool isValid = passwordHash == user.PasswordHash;
            if (!isValid) return Ok(null);

            return Ok(user.Id);
        }

        // Check If Email Already Exists
        [HttpPost("check-email/{email}")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            // Get the user from the email
            UserModel user = await db.ValidateUser(email.ToLower());
            if (user == null) return Ok(null);

            return Ok(user.Id);
        }

        // Verify User Account
        [HttpPut("verify-email/{email}")]
        public async Task<IActionResult> VerifyUser(string email)
        {
            // Get the user from the email
            UserModel user = await db.ValidateUser(email.ToLower());
            if (user == null) return Ok(null);

            user.VerifiedTF = true;
            await db.UpdateUser(user);
            return Ok();
        }

        // Unverify User Account
        [HttpPut("unverify-email/{email}")]
        public async Task<IActionResult> UnverifyUser(string email)
        {
            // Get the user from the email
            UserModel user = await db.ValidateUser(email.ToLower());
            if (user == null) return Ok(null);

            user.VerifiedTF = false;
            await db.UpdateUser(user);
            return Ok();
        }
        #endregion


        #region History APIs
        // Get History
        [HttpGet("{userId}/history")]
        public async Task<IActionResult> GetHistory(string userId)
        {
            // Check if the user exists and if it does return the history
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");
            return Ok(user.History);
        }

        // Add History
        [HttpPut("{userId}/history/create")]
        public async Task<IActionResult> CreateHistory(string userId, HistoryModel newHistory)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
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
        [HttpDelete("{userId}/history/delete")]
        public async Task<IActionResult> DeleteHistory(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            // Clear the history and update
            user.History.Clear();
            await db.UpdateUser(user);
            return Ok();
        }
        #endregion


        #region Metal APIs
        // Get Metals
        [HttpGet("{userId}/metals")]
        public async Task<IActionResult> GetMetals(string userId)
        {
            // Check if the user exists and if it does return the metals
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");
            return Ok(user.Metals);
        }

        // Update Metals
        [HttpPut("{userId}/metals/update")]
        public async Task<IActionResult> UpdateMetals(string userId, List<MetalModel> updatedMetals)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            user.Metals = updatedMetals;
            await db.UpdateUser(user);
            return Ok();
        }

        // Reset Metals
        [HttpPut("{userId}/metals/reset")]
        public async Task<IActionResult> ResetMetals(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            // Get the default metals and replace current ones
            IEnumerable<MetalModel> metals = await defaults.GetDefaultMetals();
            user.Metals = metals.ToList();

            await db.UpdateUser(user);
            return Ok();
        }
        #endregion


        #region Ring Size APIs
        // Get Ring Sizes
        [HttpGet("{userId}/ring-sizes")]
        public async Task<IActionResult> GetRingSizes(string userId)
        {
            // Check if the user exists and if it does return the ring sizes
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");
            return Ok(user.RingSizes);
        }

        // Update Ring Sizes
        [HttpPut("{userId}/ring-sizes/update")]
        public async Task<IActionResult> UpdateRingSizes(string userId, List<RingSizeModel> updatedRingSizes)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            user.RingSizes = updatedRingSizes;
            await db.UpdateUser(user);
            return Ok();
        }

        // Reset Ring Sizes
        [HttpPut("{userId}/ring-sizes/reset")]
        public async Task<IActionResult> ResetRingSizes(string userId)
        {
            // Check if the user exists
            UserModel user = await db.GetUser(userId);
            if (user == null) return NotFound("User not found");

            // Get the default ring sizes and replace current ones
            IEnumerable<RingSizeModel> ringSizes = await defaults.GetDefaultRingSizes();
            user.RingSizes = ringSizes.ToList();

            await db.UpdateUser(user);
            return Ok();
        }
        #endregion
    }
}
