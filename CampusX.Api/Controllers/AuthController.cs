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
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CampusXDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            CampusXDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s =>
                    s.Email == dto.Email &&
                    s.IsActive
                );

            if (student == null)
            {
                return BadRequest(new
                {
                    message = "Invalid email or password"
                });
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(
                dto.Password,
                student.PasswordHash
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
                    student.Id.ToString()
                ),
                new Claim(
                    ClaimTypes.Name,
                    student.FullName
                ),
                new Claim(
                    ClaimTypes.Email,
                    student.Email
                ),
                new Claim(
                    ClaimTypes.Role,
                    "Student"
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
                message = "Login successful",
                token = tokenString,
                studentId = student.Id,
                fullName = student.FullName,
                email = student.Email,
                role = "Student"
            });
        }
    }
}