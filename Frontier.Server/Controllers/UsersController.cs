using Microsoft.AspNetCore.Mvc;
using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Frontier.Server.Functions;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController(TokenProvider tokenProvider, UserDataAccess dbUsers, ConfigDataAccess dbConfig) : ControllerBase
    {
        #region User CRUD APIs

        // Get All Users
        [HttpGet]
        public async Task<IEnumerable<UserDetailsModel>> GetAllUsers()
        {
            List<UserModel> users = await dbUsers.GetAllUsers();
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
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            if (userId != null) {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
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
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(UserModel user)
        {
            string? role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (user.AdminTF && await dbConfig.GetInitialisedStatus() && role != "Admin") {
                return Forbid();
            }

            // Hash the password and add the salt to the user
            string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
            user.Salt = salt;
            user.Email = user.Email.ToLower();

            await dbUsers.CreateUser(user);
            return Created();
        }

        // Update User Details
        [HttpPost("{userId}/update")]
        public async Task<IActionResult> UpdateUser(string userId, UserModel updateUser)
        {
            if (userId != null) {
                // Check if the user exists in MongoDB
                UserModel user = await dbUsers.GetUser(userId);
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

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Update Password
        [HttpPost("{userId}/update/password")]
        public async Task<IActionResult> UpdatePassword(string userId, CredentialsModel credentials)
        {
            if (userId != null) {
                // Check if the user exists in MongoDB
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(credentials.Password, salt);
                user.Salt = salt;

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Delete User
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (userId != null) {
                // Check if the user exists
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                await dbUsers.DeleteUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        #endregion

        #region Utility APIs
        
        // Check If Email Already Exists
        [AllowAnonymous]
        [HttpPost("check-email/{email}")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            if (email != null) {
                // Get the user from the email
                UserModel user = await dbUsers.ValidateUser(email.ToLower());
                if (user == null) return Ok(null);

                return Ok(user.Id);
            }
            return BadRequest("No Email Supplied");
        }

        // Switch Admin Status
        [HttpPost("{userId}/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SwitchAdmin(string userId)
        {
            if (userId != null) {
                // Check if the user exists in MongoDB
                if (userId != null)
                {
                    UserModel user = await dbUsers.GetUser(userId);
                    if (user == null) return NotFound("User not found");

                    user.AdminTF = !user.AdminTF;

                    await dbUsers.UpdateUser(user);
                    return Ok();
                }
                else return NotFound("ERROR: User has no Id");
            }
            return BadRequest("No User Id Supplied");
        }

        // Refresh token endpoint
        [HttpPost("refresh-user-token")]
        public async Task<IActionResult> RefreshToken()
        {
            // Get the current user ID from claims
            string? userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId)) {
                return Unauthorized("Invalid token");
            }

            // Get the user from database
            UserModel user = await dbUsers.GetUser(userId);
            if (user == null) return NotFound("User not found");

            // Generate a new token
            string token = tokenProvider.GenerateJwtToken(user);

            // Return the new token
            return Ok(new { Token = token });
        }

        #endregion
    }
}
