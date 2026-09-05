namespace CampusX.Api.DTOs
{
    public class UpdateStudentDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Faculty { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
    }
}