namespace SegDicom.Segmentation.Db
{
    public interface ISegmentationRepository
    {
        public List<Segmentation> GetAllSegmentations();
        public Task AddSegmentation(Segmentation @segmentation);
        public Task DeleteSegmentation(Segmentation @segmentation);
    }
}