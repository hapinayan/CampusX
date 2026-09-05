using System.ComponentModel.DataAnnotations;

namespace CampusX.Api.DTOs
{
    public class RegisterStudentDto
    {
        [Required(ErrorMessage = "Index number is required")]
        [StringLength(
            50,
            ErrorMessage = "Index number cannot exceed 50 characters"
        )]
        public string IndexNumber { get; set; } = string.Empty;


        [Required(ErrorMessage = "Full name is required")]
        [StringLength(
            100,
            MinimumLength = 2,
            ErrorMessage = "Full name must be between 2 and 100 characters"
        )]
        public string FullName { get; set; } = string.Empty;


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(
            100,
            ErrorMessage = "Email cannot exceed 100 characters"
        )]
        public string Email { get; set; } = string.Empty;


        [Required(ErrorMessage = "Faculty is required")]
        [StringLength(
            100,
            ErrorMessage = "Faculty cannot exceed 100 characters"
        )]
        public string Faculty { get; set; } = string.Empty;


        [StringLength(
            20,
            ErrorMessage = "Contact number cannot exceed 20 characters"
        )]
        public string? ContactNumber { get; set; }


        [Required(ErrorMessage = "Password is required")]
        [MinLength(
            6,
            ErrorMessage = "Password must be at least 6 characters"
        )]
        public string Password { get; set; } = string.Empty;
    }
}