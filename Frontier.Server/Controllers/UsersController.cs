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

        // Get All Users
        [HttpGet]
        public async Task<IEnumerable<UserModel>> Get() => await db.GetAllUsers();

        // Get User
        [HttpGet("{id}")]
        public async Task<UserModel> Get(string id) => await db.GetUser(id);

        // Validate User
        [HttpGet("Validate")]
        public async Task<IActionResult> Get(string email, string password)
        {
            UserModel user = await db.ValidateUser(email);
            if (user == null) {
                return Unauthorized(null);
            }
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, user.Salt);
            bool isValid = passwordHash == user.PasswordHash;
            if (!isValid) {
                return Unauthorized(null);
            }
            return Ok(user.Id);
        }

        // Create User
        [HttpPost]
        public void Post(UserModel user)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
            user.Salt = salt;
            db.CreateUser(user);
        }

        // Update User
        [HttpPut("{id}")]
        public void Put(UserModel user, bool isNewPassword)
        {
            if (isNewPassword) {
                string salt = BCrypt.Net.BCrypt.GenerateSalt(10);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash, salt);
                user.Salt = salt;
            }
            db.UpdateUser(user);
        }

        // Delete User
        [HttpDelete("{id}")]
        public void Delete(UserModel user) => db.DeleteUser(user);
    }
}
