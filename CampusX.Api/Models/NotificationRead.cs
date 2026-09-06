namespace CampusX.Api.Models
{
    public class NotificationRead
    {
        public int Id { get; set; }

        public int NotificationId { get; set; }

        public int StudentId { get; set; }

        public DateTime ReadAt { get; set; }
    }
}