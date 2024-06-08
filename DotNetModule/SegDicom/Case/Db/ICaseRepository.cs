namespace SegDicom.Case.Db
{
    public interface ICaseRepository
    {
        public List<Case> GetAllCases();
        public Task AddCase(Case @case);
        public Task UpdateCase(Case @case);
        public Task DeleteCase(Case @case);
    }
}