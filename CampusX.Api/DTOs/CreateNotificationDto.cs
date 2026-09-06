using System.ComponentModel.DataAnnotations;

namespace CampusX.Api.DTOs
{
    public class CreateNotificationDto
    {
        public int? StudentId { get; set; }


        [Required(ErrorMessage = "Title is required")]
        [StringLength(
            150,
            ErrorMessage = "Title cannot exceed 150 characters"
        )]
        public string Title { get; set; } = string.Empty;


        [Required(ErrorMessage = "Message is required")]
        [StringLength(
            500,
            ErrorMessage = "Message cannot exceed 500 characters"
        )]
        public string Message { get; set; } = string.Empty;
    }
}