using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SegDicom.Case.Dto
{
    public class CaseInputDto
    {
        [Required]
        public required string Name { get; set; }
        [DefaultValue("")]
        public string? Description { get; set; } = "";
        [Required]
        public required List<IFormFile> Dicoms { get; set; }
    }
}