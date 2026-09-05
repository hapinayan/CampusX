namespace CampusX.Api.DTOs
{
    public class CreateNotificationDto
    {
        public int? StudentId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }
}