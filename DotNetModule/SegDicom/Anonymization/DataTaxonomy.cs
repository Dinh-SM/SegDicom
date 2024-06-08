using Microsoft.Extensions.Compliance.Classification;

namespace DataProtection;

public static class DataTaxonomy
{
    public static string TaxonomyName { get; } = typeof(DataTaxonomy).FullName!;
    public static DataClassification SensitiveData { get; } = new(TaxonomyName, nameof(SensitiveData));
}

public class SensitiveDataAttribute : DataClassificationAttribute
{
    public SensitiveDataAttribute() : base(DataTaxonomy.SensitiveData)
    {
    }
}