using Azure.Storage.Blobs;
using FellowOakDicom;
using SegDicom.Segmentation.Db;
using System.Globalization;
using System.Text.RegularExpressions;

namespace SegDicom.Helper
{
    public class SegmentationHelper
    {
        public static async Task<List<Segmentation.Segmentation>> CreateSegmentations(List<IFormFile> dicoms, ISegmentationRepository segmentationRepository, BlobServiceClient blobServiceClient)
        {
            DicomHelper dicomParser = new();

            List<Segmentation.Segmentation> newSegmentations = [];

            string blobContainerId = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[^a-zA-Z0-9_.]+", "", RegexOptions.Compiled);

            foreach (FormFile dicom in dicoms)
            {
                string seriesInstanceUID = await dicomParser.GetTagValueAsync(dicom, DicomTag.SeriesInstanceUID);

                if (seriesInstanceUID != null)
                {
                    if (!newSegmentations.Any(segmentation => segmentation.SeriesInstanceUID == seriesInstanceUID))
                    {
                        Segmentation.Segmentation newSegmentation = await CreateSegmentation(dicom, seriesInstanceUID, newSegmentations, dicomParser);
                        newSegmentations.Add(newSegmentation);
                    }

                    // Create dicom url by uploading to db
                    string dicomUrl = await UploadDicom(dicom,
                        seriesInstanceUID.Replace(".","").Substring(0, 15),
                        blobContainerId.ToLower().Substring(0, 15),
                        blobServiceClient);

                    newSegmentations.Find(segmentation => segmentation.SeriesInstanceUID == seriesInstanceUID)?.DicomUrls.Add(dicomUrl);
                }
            }

            return newSegmentations;
        }

        private static async Task<Segmentation.Segmentation> CreateSegmentation(FormFile dicom, string seriesInstanceUID, List<Segmentation.Segmentation> newSegmentations, DicomHelper dicomParser)
        {
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;

            string patientName = (await dicomParser.GetTagValueAsync(dicom, DicomTag.PatientName))
                                    .Replace("^", " ")
                                    .Trim()
                                    .ToLower();

            string patientBirthDate = await dicomParser.GetTagValueAsync(dicom, DicomTag.PatientBirthDate);

            Segmentation.Segmentation newSegmentation = new()
            {
                SeriesInstanceUID = seriesInstanceUID,
                PatientName = textInfo.ToTitleCase(patientName),
                PatientSex = await dicomParser
                                .GetTagValueAsync(dicom, DicomTag.PatientSex),
                PatientBirthDate = patientBirthDate.Length > 0 ? DateTime.ParseExact(
                                    patientBirthDate,
                                    "yyyyMMdd",
                                    CultureInfo.InvariantCulture) :
                                    new(2000, 01, 01),
                BodyPart = await dicomParser.GetTagValueAsync(dicom, DicomTag.BodyPartExamined),
                DicomUrls = []
            };

            return newSegmentation;
        }

        private async static Task<string> UploadDicom(FormFile dicom, string seriesInstanceUID, string blobContainerId, BlobServiceClient blobServiceClient)
        {
            Helper.AzureHelper azureHelper = new(blobServiceClient);
            return await azureHelper.UploadDicomToAzureStorage(dicom, seriesInstanceUID, blobContainerId);
        }
    }
}
