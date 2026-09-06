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
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public NotificationsController(CampusXDbContext context)
        {
            _context = context;
        }


        // ADMIN - CREATE NOTIFICATION
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNotification(
            CreateNotificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new
                {
                    message = "Title and message are required"
                });
            }

            if (dto.StudentId != null)
            {
                var studentExists =
                    await _context.Students
                        .AnyAsync(s =>
                            s.Id == dto.StudentId);

                if (!studentExists)
                {
                    return NotFound(new
                    {
                        message = "Student not found"
                    });
                }
            }

            var notification = new Notification
            {
                StudentId = dto.StudentId,
                Title = dto.Title,
                Message = dto.Message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Notification created successfully"
            });
        }


        // STUDENT - GET OWN NOTIFICATIONS
        [HttpGet("my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var studentIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (!int.TryParse(
                studentIdClaim,
                out int studentId
            ))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid student token"
                });
            }

            var notifications =
                await _context.Notifications
                    .Where(n =>
                        n.StudentId == studentId ||
                        n.StudentId == null)
                    .OrderByDescending(
                        n => n.CreatedAt
                    )
                    .Select(n => new
                    {
                        n.Id,
                        n.Title,
                        n.Message,

                        IsRead =
                            _context.NotificationReads
                                .Any(r =>
                                    r.NotificationId == n.Id &&
                                    r.StudentId == studentId
                                ),

                        n.CreatedAt
                    })
                    .ToListAsync();

            return Ok(notifications);
        }


        // STUDENT - MARK AS READ
        [HttpPut("{id}/read")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MarkAsRead(
            int id
        )
        {
            var studentIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (!int.TryParse(
                studentIdClaim,
                out int studentId
            ))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid student token"
                });
            }

            var notification =
                await _context.Notifications
                    .FirstOrDefaultAsync(n =>
                        n.Id == id &&
                        (
                            n.StudentId == studentId ||
                            n.StudentId == null
                        )
                    );

            if (notification == null)
            {
                return NotFound(new
                {
                    message =
                        "Notification not found"
                });
            }

            var alreadyRead =
                await _context.NotificationReads
                    .AnyAsync(r =>
                        r.NotificationId == id &&
                        r.StudentId == studentId
                    );

            if (!alreadyRead)
            {
                var notificationRead =
                    new NotificationRead
                    {
                        NotificationId = id,
                        StudentId = studentId,
                        ReadAt = DateTime.UtcNow
                    };

                _context.NotificationReads.Add(
                    notificationRead
                );

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message =
                    "Notification marked as read"
            });
        }


        // STUDENT - GET UNREAD COUNT
        [HttpGet("unread-count")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var studentIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (!int.TryParse(
                studentIdClaim,
                out int studentId
            ))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid student token"
                });
            }

            var count =
                await _context.Notifications
                    .Where(n =>
                        n.StudentId == studentId ||
                        n.StudentId == null)
                    .CountAsync(n =>
                        !_context.NotificationReads
                            .Any(r =>
                                r.NotificationId == n.Id &&
                                r.StudentId == studentId
                            )
                    );

            return Ok(new
            {
                unreadCount = count
            });
        }


        // ADMIN - GET ALL NOTIFICATIONS
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            GetAllNotifications()
        {
            var notifications =
                await _context.Notifications
                    .OrderByDescending(
                        n => n.CreatedAt
                    )
                    .Select(n => new
                    {
                        n.Id,
                        n.StudentId,
                        n.Title,
                        n.Message,
                        n.CreatedAt
                    })
                    .ToListAsync();

            return Ok(notifications);
        }


        // ADMIN - DELETE NOTIFICATION
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            DeleteNotification(int id)
        {
            var notification =
                await _context.Notifications
                    .FirstOrDefaultAsync(
                        n => n.Id == id
                    );

            if (notification == null)
            {
                return NotFound(new
                {
                    message =
                        "Notification not found"
                });
            }

            _context.Notifications.Remove(
                notification
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Notification deleted successfully"
            });
        }
    }
}