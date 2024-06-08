using Microsoft.AspNetCore.Mvc;
using SegDicom.Segmentation.Db;
using SegDicom.Segmentation.Dto;

namespace SegDicom.Segmentation
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SegmentationController : ISegmentationController
    {
        private readonly ILogger<SegmentationController> _logger;
        private readonly ISegmentationRepository _segmentationRepository;

        public SegmentationController(
            ILogger<SegmentationController> logger,
            ISegmentationRepository segmentationRepository)
        {
            _logger = logger;
            _segmentationRepository = segmentationRepository;
        }

        /// <summary>
        /// Fetches the list of all the Segmentations stored in the database.
        /// </summary>
        /// <returns>The list of all the Segmentations stored in the database</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /Segmentation/GetAll
        ///
        /// </remarks>
        /// <response code="200">Returns list of all the Segmentations</response>
        /// <response code="400">If it failed</response>
        [HttpGet(template: "GetAll", Name = "GetAllSegmentations")]
        public List<SegmentationDto> GetAllSegmentations()
        {
            List<SegmentationDto> allSegmentations = [];
            _segmentationRepository.GetAllSegmentations().ForEach(s => allSegmentations.Add(new SegmentationDto(s)));
            return allSegmentations;
        }
    }
}