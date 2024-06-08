using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using SegDicom.Case.Db;
using SegDicom.Case.Dto;
using SegDicom.Helper;
using SegDicom.Segmentation.Db;

namespace SegDicom.Case
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CaseController : ControllerBase, ICaseController
    {
        private readonly ILogger<CaseController> _logger;
        private readonly ICaseRepository _caseRepository;
        private readonly ISegmentationRepository _segmentationRepository;
        private readonly BlobServiceClient _blobServiceClient;

        public CaseController(
            ILogger<CaseController> logger,
            ICaseRepository caseRepository,
            ISegmentationRepository segmentationRepository,
            BlobServiceClient blobServiceClient)
        {
            _logger = logger;
            _caseRepository = caseRepository;
            _segmentationRepository = segmentationRepository;
            _blobServiceClient = blobServiceClient;
        }

        /// <summary>
        /// Fetches the list of all the Cases stored in the database.
        /// </summary>
        /// <returns>The list of all the Cases stored in the database</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /Case/GetAll
        ///
        /// </remarks>
        /// <response code="200">Returns list of all the Cases</response>
        /// <response code="400">If it failed</response>
        [HttpGet(template: "GetAll", Name = "GetAllCases")]
        public List<CaseOutputDto> GetAllCases()
        {
            List<CaseOutputDto> allCases = [];
            _caseRepository.GetAllCases().ForEach(c => allCases.Add(new CaseOutputDto(c)));
            return allCases;
        }

        /// <summary>
        /// Fetches a specific Case stored in the database.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The requested Case</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /Case/Get/1
        ///
        /// </remarks>
        /// <response code="200">Returns the Case</response>
        /// <response code="400">If the Case does not exist</response>
        [HttpGet(template: "Get/{id}", Name = "GetCase")]
        public CaseOutputDto GetCase(int id)
        {
            Case? caseToGet = _caseRepository.GetAllCases().Find(c => c.Id == id);

            if (caseToGet is null) {
                string errorMessage = $"GetCase: Case with id {id} not found wtf!";
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }

            CaseOutputDto caseDto = new(caseToGet);
            return caseDto;
        }

        /// <summary>
        /// Creates a Case in the database.
        /// </summary>
        /// <param name="inputCase"></param>
        /// <returns>The id of the newly created Case</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /Case/Create
        ///     {
        ///         "name": "Bob",
        ///         "description": "This is the Bob case, very Bob",
        ///         "dicoms": []
        ///     }
        ///
        /// </remarks>
        /// <response code="200">Returns the id of the newly created Case</response>
        /// <response code="400">If the Case creation failed</response>
        [HttpPost(template: "Create", Name = "CreateCase")]
        [RequestSizeLimit(100_000_000_000_000)]
        public async Task<int> CreateCase([FromForm] CaseInputDto inputCase)
        {
            List<IFormFile> dicoms = inputCase.Dicoms;

            if (dicoms is null)
            {
                string errorMessage = $"CreateCase: No dicoms found wtf!";
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }

            dicoms = [.. dicoms.OrderBy(d => d.FileName)];

            List<Segmentation.Segmentation> segmentations = [];

            try
            {
                segmentations = await SegmentationHelper.CreateSegmentations(dicoms, _segmentationRepository, _blobServiceClient);
            }
            catch  (Exception ex)
            {
                string errorMessage = $"CreateCase: Unable to create segmentations for the new case wtf! -> " + ex;
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }

            Case @newCase = new()
            {
                Name = inputCase.Name,
                Description = inputCase.Description,
                CreationDate = DateTime.Now,
                Segmentations = segmentations
            };

            try
            {
                await _caseRepository.AddCase(@newCase);
            }
            catch  (Exception ex)
            {
                string errorMessage = $"CreateCase: Unable to create the new case wtf! -> " + ex;
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }
            return @newCase.Id;
        }

        /// <summary>
        /// Updates a specific Case.
        /// </summary>
        /// <param name="editedCase"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /Case/Update
        ///     {
        ///         [edited case properties]
        ///     }
        ///
        /// </remarks>
        /// <response code="200">The Case was updated</response>
        /// <response code="400">If the Case does not exist</response>
        [HttpPut(template: "Update", Name = "UpdateCase")]
        public async Task UpdateCase(Case editedCase)
        {
            try
            {
                await _caseRepository.UpdateCase(@editedCase);
            }
            catch  (Exception ex)
            {
                string errorMessage = $"UpdateCase: Unable to update the case with id {editedCase.Id} wtf! -> " + ex;
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }
        }

        /// <summary>
        /// Deletes a specific Case.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /Case/Delete/1
        ///
        /// </remarks>
        /// <response code="200">The Case was deleted</response>
        /// <response code="400">If the Case does not exist</response>
        [HttpDelete(template: "Delete/{id}", Name = "DeleteCase")]
        public async Task DeleteCase(int id)
        {
            Case? caseToDelete = _caseRepository.GetAllCases().Find(c => c.Id == id);

            if (caseToDelete is null)
            {
                string errorMessage = $"DeleteCase: Case with id {id} not found wtf!";
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }
            
            Helper.AzureHelper azureHelper = new(_blobServiceClient);

            try
            {
                await azureHelper.DeleteCaseContainers(caseToDelete);
            }
            catch  (Exception ex)
            {
                string errorMessage = $"DeleteCase: Unable to delete case containers for case with id {id} wtf! -> " + ex;
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }

            try
            {
                await _caseRepository.DeleteCase(caseToDelete);
            }
            catch  (Exception ex)
            {
                string errorMessage = $"DeleteCase: Unable to delete the case with id {caseToDelete.Id} wtf! -> " + ex;
                _logger.LogError(errorMessage);
                throw new Exception(errorMessage);
            }
        }
    }
}