using CampusX.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CampusX.Api.Data
{
    public class CampusXDbContext : DbContext
    {
        public CampusXDbContext(
            DbContextOptions<CampusXDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }

        public DbSet<Admin> Admins { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<NotificationRead> NotificationReads { get; set; }
    }
}