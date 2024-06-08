using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SegDicom.Case
{
    public class Case
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [DefaultValue("")]
        public string? Description { get; set; } = "";
        [Required]
        public DateTime CreationDate { get; set; }
        [DefaultValue(null)]
        public DateTime? LastModificationDate { get; set; } = null;
        [Required]
        public required List<Segmentation.Segmentation> Segmentations { get; set; }
    }
}