using FellowOakDicom;

namespace SegDicom.Helper
{
    public class DicomHelper
    {
        public async Task<string> GetTagValueAsync(FormFile dicom, DicomTag tag, int index = 0)
        {
            using Stream stream = dicom.OpenReadStream();
            DicomFile dicomFile = await DicomFile.OpenAsync(stream);
            string value = dicomFile.Dataset.GetValueOrDefault<string>(tag, index, string.Empty);
            return value;
        }
    }
}