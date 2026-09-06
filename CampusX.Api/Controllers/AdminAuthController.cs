using CampusX.Api.Data;
using CampusX.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CampusX.Api.Controllers
{
    [ApiController]
    [Route("api/admin-auth")]
    public class AdminAuthController : ControllerBase
    {
        private readonly CampusXDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminAuthController(
            CampusXDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminLoginDto dto)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a =>
                    a.Email == dto.Email &&
                    a.IsActive
                );

            if (admin == null)
            {
                return BadRequest(new
                {
                    message = "Invalid email or password"
                });
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(
                dto.Password,
                admin.PasswordHash
            );

            if (!passwordValid)
            {
                return BadRequest(new
                {
                    message = "Invalid email or password"
                });
            }

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    admin.Id.ToString()
                ),
                new Claim(
                    ClaimTypes.Name,
                    admin.FullName
                ),
                new Claim(
                    ClaimTypes.Email,
                    admin.Email
                ),
                new Claim(
                    ClaimTypes.Role,
                    "Admin"
                )
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                )
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return Ok(new
            {
                message = "Admin login successful",
                token = tokenString,
                adminId = admin.Id,
                fullName = admin.FullName,
                email = admin.Email,
                role = "Admin"
            });
        }
    }
}