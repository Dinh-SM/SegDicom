using SegDicom.Case.Dto;

namespace SegDicom.Case
{
    public interface ICaseController
    {
        public List<CaseOutputDto> GetAllCases();
        public CaseOutputDto GetCase(int id);
        public Task<int> CreateCase(CaseInputDto inputCase);
        public Task UpdateCase(Case editedCase);
        public Task DeleteCase(int id);
    }
}