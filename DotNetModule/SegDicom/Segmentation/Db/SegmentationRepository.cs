namespace SegDicom.Segmentation.Db
{
    public class SegmentationRepository : ISegmentationRepository
    {
        public SegmentationRepository()
        {
            using AppDbContext context = new();
        }

        public List<Segmentation> GetAllSegmentations()
        {
            using AppDbContext context = new();
            return [.. context.Segmentations];
        }

        public async Task AddSegmentation(Segmentation @segmentation)
        {
            await using AppDbContext context = new();
            context.Segmentations.Add(@segmentation);
            await context.SaveChangesAsync();
        }

        public async Task DeleteSegmentation(Segmentation @segmentation)
        {
            await using AppDbContext context = new();
            context.Segmentations.Remove(@segmentation);
            await context.SaveChangesAsync();
        }
    }
}