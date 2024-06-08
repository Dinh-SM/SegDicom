using SegDicom.Case.Db;
using SegDicom.Segmentation.Db;
using Microsoft.Extensions.Azure;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.Extensions.Compliance.Classification;
using DataProtection;
using System.Text.Json;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "SegDicom API",
        Description = "Small and lightweight API learning project for case creation with DICOM series stored in in-memory database and Azurite Blob Storage."
    });
    
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddScoped<ICaseRepository, CaseRepository>();
builder.Services.AddScoped<ISegmentationRepository, SegmentationRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(builder.Configuration.GetValue<string>("Hosts:Angular") ?? "")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});

builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration["AzureDicomStorage:blob"] ?? "", preferMsi: true);
});

builder.Logging.EnableRedaction();
builder.Services.AddRedaction(x =>
{
    x.SetRedactor<StarRedactor>(new DataClassificationSet(DataTaxonomy.SensitiveData));
});

builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole(option => option.JsonWriterOptions = new JsonWriterOptions
{
    Indented = true
});


WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run(builder.Configuration.GetValue<string>("Hosts:DotNet") ?? "");