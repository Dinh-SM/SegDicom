using Microsoft.EntityFrameworkCore;

namespace SegDicom
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase("MyDatabase");
        }

        public DbSet<Case.Case> Cases { get; set; }
        public DbSet<Segmentation.Segmentation> Segmentations { get; set; }
    }
}