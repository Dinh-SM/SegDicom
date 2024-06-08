using SegDicom.Segmentation.Dto;

namespace SegDicom.Segmentation
{
    public interface ISegmentationController
    {
        public List<SegmentationDto> GetAllSegmentations();
    }
}