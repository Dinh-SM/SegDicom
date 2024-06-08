using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using SegDicom.Segmentation.Dto;

namespace SegDicom.Case.Dto
{
    public class CaseOutputDto
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [DefaultValue("")]
        public string? Description { get; set; } = "";
        [Required]
        public DateTime CreationDate { get; set; }
        [DefaultValue(null)]
        public DateTime? LastModificationDate { get; set; } = null;
        [Required]
        public List<Segmentation.Dto.SegmentationDto> Segmentations { get; set; }

        public CaseOutputDto(Case outputCase)
        {
            Id = outputCase.Id;
            Name = outputCase.Name;
            Description = outputCase.Description;
            CreationDate = outputCase.CreationDate;
            LastModificationDate = outputCase.LastModificationDate;

            List<SegmentationDto> segmentationDtos = [];
            outputCase.Segmentations?.ForEach(s => segmentationDtos.Add(new SegmentationDto(s)));
            Segmentations = segmentationDtos;
        }
    }
}