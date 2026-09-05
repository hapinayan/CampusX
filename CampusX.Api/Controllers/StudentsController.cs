using CampusX.Api.Data;
using CampusX.Api.DTOs;
using CampusX.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CampusX.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public StudentsController(CampusXDbContext context)
        {
            _context = context;
        }

        // Admin only - Get all students + search/filter
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetStudents(
            string? search,
            string? faculty)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(s =>
                    s.FullName.Contains(search) ||
                    s.IndexNumber.Contains(search) ||
                    s.Email.Contains(search)
                );
            }

            if (!string.IsNullOrWhiteSpace(faculty))
            {
                query = query.Where(s =>
                    s.Faculty == faculty
                );
            }

            var students = await query
                .Select(s => new
                {
                    s.Id,
                    s.IndexNumber,
                    s.FullName,
                    s.Email,
                    s.Faculty,
                    s.ContactNumber,
                    s.IsActive,
                    s.CreatedAt,
                    s.UpdatedAt
                })
                .ToListAsync();

            return Ok(students);
        }

        // Admin only - Get one student by ID
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _context.Students
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.IndexNumber,
                    s.FullName,
                    s.Email,
                    s.Faculty,
                    s.ContactNumber,
                    s.IsActive,
                    s.CreatedAt,
                    s.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            return Ok(student);
        }

        // Admin only - Deactivate student
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateStudent(int id)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            student.IsActive = false;
            student.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student deactivated successfully"
            });
        }

        // Admin only - Activate student
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateStudent(int id)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            student.IsActive = true;
            student.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student activated successfully"
            });
        }

        // Admin only - Delete student
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            _context.Students.Remove(student);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student deleted successfully"
            });
        }

        // Logged-in student profile
        [Authorize(Roles = "Student")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var studentIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (studentIdValue == null)
            {
                return Unauthorized();
            }

            var studentId = int.Parse(studentIdValue);

            var student = await _context.Students
                .Where(s => s.Id == studentId)
                .Select(s => new
                {
                    s.Id,
                    s.IndexNumber,
                    s.FullName,
                    s.Email,
                    s.Faculty,
                    s.ContactNumber,
                    s.IsActive,
                    s.CreatedAt,
                    s.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            return Ok(student);
        }

        // Logged-in student profile update
        [Authorize(Roles = "Student")]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            UpdateStudentDto dto)
        {
            var studentIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (studentIdValue == null)
            {
                return Unauthorized();
            }

            var studentId = int.Parse(studentIdValue);

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found"
                });
            }

            var emailExists = await _context.Students
                .AnyAsync(s =>
                    s.Email == dto.Email &&
                    s.Id != studentId
                );

            if (emailExists)
            {
                return BadRequest(new
                {
                    message = "Email already exists"
                });
            }

            student.FullName = dto.FullName;
            student.Email = dto.Email;
            student.Faculty = dto.Faculty;
            student.ContactNumber = dto.ContactNumber;
            student.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated successfully"
            });
        }

        // Student registration
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterStudentDto dto)
        {
            var indexExists = await _context.Students
                .AnyAsync(s =>
                    s.IndexNumber == dto.IndexNumber
                );

            if (indexExists)
            {
                return BadRequest(new
                {
                    message = "Index number already exists"
                });
            }

            var emailExists = await _context.Students
                .AnyAsync(s =>
                    s.Email == dto.Email
                );

            if (emailExists)
            {
                return BadRequest(new
                {
                    message = "Email already exists"
                });
            }

            var student = new Student
            {
                IndexNumber = dto.IndexNumber,
                FullName = dto.FullName,
                Email = dto.Email,
                Faculty = dto.Faculty,
                ContactNumber = dto.ContactNumber,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Students.Add(student);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student registered successfully"
            });
        }
    }
}