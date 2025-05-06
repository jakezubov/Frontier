using Frontier.Server.DataAccess;
using Frontier.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Frontier.Server.Functions;
using Microsoft.AspNetCore.Authorization;

namespace Frontier.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController(TokenProvider tokenProvider, UserDataAccess dbUsers) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CredentialsModel credentials)
        {
            var user = await dbUsers.AuthenticateUser(credentials.Email, credentials.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            user.LastLoggedIn = DateTime.UtcNow;
            user.LoggedInTF = true;

            await dbUsers.UpdateUser(user);

            // Generate JWT token
            string token = tokenProvider.GenerateJwtToken(user);

            return Ok(new
            {
                UserId = user.Id,
                Token = token
            });
        }

        [HttpPost("{userId}/logout")]
        public async Task<IActionResult> Logout(string userId)
        {
            if (userId != null)
            {
                // Check if the user exists in MongoDB
                UserModel user = await dbUsers.GetUser(userId);
                if (user == null) return NotFound("User not found");

                user.LoggedInTF = false;

                await dbUsers.UpdateUser(user);
                return Ok();
            }
            return BadRequest("No User Id Supplied");
        }

        // Validate User
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateUser([FromBody] CredentialsModel credentials)
        {
            var user = await dbUsers.AuthenticateUser(credentials.Email, credentials.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(user.Id);
        }
    }
}
