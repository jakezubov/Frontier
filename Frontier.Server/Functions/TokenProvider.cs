using Frontier.Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Frontier.Server.Functions
{
    public class TokenProvider(IConfiguration configuration)
    {
        // Generate JWT token
        public string GenerateJwtToken(UserModel user)
        {
            string secretKey = configuration["Jwt:SecretKey"]!;
            SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(secretKey));
            SigningCredentials credentials = new(securityKey, SecurityAlgorithms.HmacSha256);

            // Create claims list
            List<Claim> claims = [
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Name, user.FirstName),
                new(JwtRegisteredClaimNames.FamilyName, user.LastName),
                new(JwtRegisteredClaimNames.Email, user.Email),
            ];

            // Add admin role if applicable
            if (user.AdminTF) {
                claims.Add(new(ClaimTypes.Role, "Admin"));
            }

            SecurityTokenDescriptor tokenDescriptor = new() {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(configuration.GetValue<int>("Jwt:ExpirationInDays")),
                SigningCredentials = credentials,
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };

            JwtSecurityTokenHandler handler = new();
            SecurityToken token = handler.CreateToken(tokenDescriptor);
            string tokenString = handler.WriteToken(token);
            return tokenString;
        }
    }
}
