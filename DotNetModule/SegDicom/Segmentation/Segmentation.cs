using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using DataProtection;

namespace SegDicom.Segmentation
{
    public class Segmentation
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [SensitiveData]
        public required string SeriesInstanceUID { get; set; }
        [Required]
        [SensitiveData]
        public required string PatientName { get; set; }
        [Required]
        public required string PatientSex { get; set; }
        [Required]
        [SensitiveData]
        public DateTime PatientBirthDate { get; set; }
        [DefaultValue("")]
        public string BodyPart { get; set; } = "";
        [Required]
        public required List<string> DicomUrls { get; set; }
    }
}