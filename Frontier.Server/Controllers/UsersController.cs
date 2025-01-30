using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Frontier.Server.Functions;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserDataAccess db = new();
        private readonly ConfigDataAccess dbConfig = new();
        private readonly ConfigController defaults = new();
        private readonly Misc functions = new();

        #region User CRUD APIs
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
                    LastLoggedIn = user.LastLoggedIn,
                    LoggedInTF = user.LoggedInTF,
                    AdminTF = user.AdminTF
                };

                userDetailsList.Add(userDetails);
            }

            return userDetailsList.AsEnumerable();
        } 

        // Get User
        [HttpGet("{base64UserId}")]
        public async Task<IActionResult> GetUser(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Remove Salt and PasswordHash
                UserDetailsModel userDetails = new() {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    ApiToken = user.ApiToken,
                    HistoryAmount = user.HistoryAmount,
                    LastLoggedIn = user.LastLoggedIn,
                    LoggedInTF = user.LoggedInTF,
                    AdminTF = user.AdminTF
                };
                return Ok(userDetails);
            }
            return BadRequest("No User Id Supplied");
        }

        // Create User
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(UserModel user)
        {
            if (user.AdminTF && await dbConfig.GetInitialisedStatus() && (user.ApiToken != null && !await db.GetAdminStatus(user.ApiToken) || user.ApiToken == null)) {
                return Forbid();
            }

            // Hash the password and add the salt to the user
            string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
            user.Salt = salt;
            user.Email = user.Email.ToLower();
            user.ApiToken = functions.CreateApiToken();

            await db.CreateUser(user);
            return Created();
        }

        // Update User Details
        [HttpPut("{base64UserId}/update")]
        public async Task<IActionResult> UpdateUser(string base64UserId, UserModel updateUser)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists in MongoDB
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
            return BadRequest("No User Id Supplied");
        }

        // Update Password
        [HttpPut("{base64UserId}/update/password")]
        public async Task<IActionResult> UpdatePassword(string base64UserId, CredentialsModel credentials)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists in MongoDB
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(credentials.Password, salt);
                user.Salt = salt;

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Delete User
        [HttpDelete("{base64UserId}/delete")]
        public async Task<IActionResult> DeleteUser(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                await db.DeleteUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
        #endregion


        #region Utility APIs
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

            return Ok(functions.ConvertToBase64(user.Id));
        }

        // Check If Email Already Exists
        [HttpPost("check-email/{base64Email}")]
        public async Task<IActionResult> CheckEmail(string base64Email)
        {
            if (base64Email != null) {
                string email = functions.ConvertFromBase64(base64Email);

                // Get the user from the email
                UserModel user = await db.ValidateUser(email.ToLower());
                if (user == null) return Ok(null);

                return Ok(functions.ConvertToBase64(user.Id));
            }
            return BadRequest("No Email Supplied");
        }

        // Switch Admin Status
        [HttpPut("{base64UserId}/admin/{base64ApiToken}")]
        public async Task<IActionResult> SwitchAdmin(string base64UserId, string base64ApiToken)
        {
            if (base64UserId != null && base64ApiToken != null) {
                string userId = functions.ConvertFromBase64(base64UserId);
                string apiToken = functions.ConvertFromBase64(base64ApiToken);

                if (await db.GetAdminStatus(apiToken))
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
                else return Forbid();
            }
            return BadRequest("No User Id and/or API Token Supplied");
        }

        // Changes on login
        [HttpPut("{base64UserId}/login")]
        public async Task<IActionResult> OnLogin(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.LastLoggedIn = DateTime.UtcNow;
                user.LoggedInTF = true;

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Changes on logout
        [HttpPut("{base64UserId}/logout")]
        public async Task<IActionResult> OnLogout(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists in MongoDB
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.LoggedInTF = false;

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Regenerate User API Token
        [HttpPut("{base64UserId}/regenerate-api-token")]
        public async Task<IActionResult> RegenerateUserAPIToken(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists in MongoDB
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.ApiToken = functions.CreateApiToken();

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
        
        #endregion


        #region History APIs
        // Get History
        [HttpGet("{base64UserId}/history")]
        public async Task<IActionResult> GetHistory(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists and if it does return the history
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.History);
            }
            return BadRequest("No User Id Supplied");
        }

        // Add History
        [HttpPut("{base64UserId}/history/create")]
        public async Task<IActionResult> CreateHistory(string base64UserId, HistoryModel newHistory)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

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
            return BadRequest("No User Id Supplied");
        }

        // Delete History
        [HttpDelete("{base64UserId}/history/delete")]
        public async Task<IActionResult> DeleteHistory(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Clear the history and update
                user.History.Clear();
                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
        #endregion


        #region Metal APIs
        // Get Metals
        [HttpGet("{base64UserId}/metals")]
        public async Task<IActionResult> GetMetals(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists and if it does return the metals
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.Metals);
            }
            return BadRequest("No User Id Supplied");
        }

        // Update Metals
        [HttpPut("{base64UserId}/metals/update")]
        public async Task<IActionResult> UpdateMetals(string base64UserId, List<MetalModel> updatedMetals)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.Metals = updatedMetals;
                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Reset Metals
        [HttpPut("{base64UserId}/metals/reset")]
        public async Task<IActionResult> ResetMetals(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Get the default metals and replace current ones
                IEnumerable<MetalModel> metals = await defaults.GetDefaultMetals();
                user.Metals = metals.ToList();

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
        #endregion


        #region Ring Size APIs
        // Get Ring Sizes
        [HttpGet("{base64UserId}/ring-sizes")]
        public async Task<IActionResult> GetRingSizes(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists and if it does return the ring sizes
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");
                return Ok(user.RingSizes);
            }
            return BadRequest("No User Id Supplied");
        }

        // Update Ring Sizes
        [HttpPut("{base64UserId}/ring-sizes/update")]
        public async Task<IActionResult> UpdateRingSizes(string base64UserId, List<RingSizeModel> updatedRingSizes)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.RingSizes = updatedRingSizes;
                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Reset Ring Sizes
        [HttpPut("{base64UserId}/ring-sizes/reset")]
        public async Task<IActionResult> ResetRingSizes(string base64UserId)
        {
            if (base64UserId != null) {
                string userId = functions.ConvertFromBase64(base64UserId);

                // Check if the user exists
                UserModel user = await db.GetUser(userId);
                if (user == null) return NotFound("User not found");

                // Get the default ring sizes and replace current ones
                IEnumerable<RingSizeModel> ringSizes = await defaults.GetDefaultRingSizes();
                user.RingSizes = ringSizes.ToList();

                await db.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }
        #endregion
    }
}
