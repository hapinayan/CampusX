namespace CampusX.Api.Models
{
    public class Student
    {
        public int Id { get; set; }

        public string IndexNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Faculty { get; set; } = string.Empty;

        public string? ContactNumber { get; set; }

        public string PasswordHash { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}