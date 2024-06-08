using Microsoft.EntityFrameworkCore;

namespace SegDicom.Case.Db
{
    public class CaseRepository : ICaseRepository
    {
        public CaseRepository()
        {
            using AppDbContext context = new AppDbContext();
            if (!context.Cases.Any())
            {
                List<Case> cases =
                [
                    new()
                    {
                        Name = "Test Case 1",
                        Description = "This is first test case",
                        CreationDate = new DateTime(1991, 1, 1),
                        Segmentations = []
                    },
                    new()
                    {
                        Name = "Test Case 2",
                        Description = "This is second test case",
                        CreationDate = new DateTime(1992, 2, 2),
                        Segmentations = []
                    },
                    new()
                    {
                        Name = "Test Case 3",
                        Description = "This is third test case",
                        CreationDate = new DateTime(1993, 3, 3),
                        Segmentations = []
                    },
                    new()
                    {
                        Name = "Test Case 4",
                        Description = "This is fourth test case",
                        CreationDate = new DateTime(1994, 4, 4),
                        Segmentations = []
                    },
                    new()
                    {
                        Name = "Test Case 5",
                        Description = "This is fifth test case",
                        CreationDate = new DateTime(1995, 5, 5),
                        Segmentations = []
                    }
                ];

                context.Cases.AddRange(cases);
                context.SaveChanges();
            }
        }

        public List<Case> GetAllCases()
        {
            using AppDbContext context = new();
            return [.. context.Cases.Include(c => c.Segmentations)];
        }

        public async Task AddCase(Case @case)
        {
            await using AppDbContext context = new();
            context.Segmentations.AddRange(@case.Segmentations);
            context.Cases.Add(@case);
            await context.SaveChangesAsync();
        }

        public async Task UpdateCase(Case @case)
        {
            await using AppDbContext context = new();
            context.Cases.Update(@case);
            await context.SaveChangesAsync();
        }

        public async Task DeleteCase(Case @case)
        {
            await using AppDbContext context = new();
            context.Segmentations.RemoveRange(@case.Segmentations);
            context.Cases.Remove(@case);
            await context.SaveChangesAsync();
        }
    }
}