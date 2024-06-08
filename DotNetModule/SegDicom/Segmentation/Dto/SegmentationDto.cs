using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using DataProtection;

namespace SegDicom.Segmentation.Dto
{
    public class SegmentationDto
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [SensitiveData]
        public string SeriesInstanceUID { get; set; }
        [Required]
        [SensitiveData]
        public string PatientName { get; set; }
        [Required]
        public string PatientSex { get; set; }
        [Required]
        [SensitiveData]
        public DateTime PatientBirthDate { get; set; }
        [DefaultValue("")]
        public string BodyPart { get; set; }
        [Required]
        public List<string> DicomUrls { get; set; }

        public SegmentationDto(Segmentation outputSegmentation)
        {
            Id = outputSegmentation.Id;
            SeriesInstanceUID = outputSegmentation.SeriesInstanceUID;
            PatientName = Regex.Replace(outputSegmentation.PatientName, @"([a-z])", "*");
            PatientSex = outputSegmentation.PatientSex;
            PatientBirthDate = outputSegmentation.PatientBirthDate;
            BodyPart = outputSegmentation.BodyPart;
            DicomUrls = outputSegmentation.DicomUrls;
        }
    }
}