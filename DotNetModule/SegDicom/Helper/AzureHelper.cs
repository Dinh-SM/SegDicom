using Azure;
using Azure.Storage.Blobs;

namespace SegDicom.Helper
{
    public class AzureHelper
    {
        private readonly BlobServiceClient _blobServiceClient;

        public AzureHelper(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task<string> UploadDicomToAzureStorage(FormFile dicom, string seriesInstanceUID, string blobContainerId)
        {
            try
            {
                string containerName = $"segmentation-{seriesInstanceUID}-{blobContainerId}";
                BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                await containerClient.CreateIfNotExistsAsync();
                await containerClient.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

                BlobClient blobClient = containerClient.GetBlobClient(dicom.FileName);

                using Stream stream = dicom.OpenReadStream();
                await blobClient.UploadAsync(stream, true);
                return blobClient.Uri.AbsoluteUri.ToString();
            }
            catch (RequestFailedException ex)
            {
                string errorMessage = "UploadDicomToAzureStorage: Failed to upload the dicom to Azure Storage wtf!";
                throw new RequestFailedException(errorMessage + " -> " + ex);
            }
        }

        public async Task<Task> DeleteCaseContainers(Case.Case caseToDelete)
        {
            string containerName = "";
            try
            {
                foreach(Segmentation.Segmentation segmentation in caseToDelete.Segmentations)
                {
                    BlobClient client = new(new Uri(segmentation.DicomUrls[0]));
                    containerName = client.BlobContainerName;
                    BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                    await containerClient.DeleteIfExistsAsync();
                }
                return Task.CompletedTask;
            }
            catch (RequestFailedException ex)
            {
                string errorMessage = $"DeleteCaseContainers: Failed to remove Azure Storage container {containerName} wtf!";
                throw new RequestFailedException(errorMessage + " -> " + ex);
            }
        }
    }
}
