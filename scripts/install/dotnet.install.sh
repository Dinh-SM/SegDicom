#!/bin/bash
cd "DotNetModule/SegDicom" || exit
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 8.0.3
dotnet add package Azure.Storage.Blobs --version 12.19.1
dotnet add package Azure.Storage.Files.Shares --version 12.17.1
dotnet add package Azure.Storage.Queues --version 12.17.1
dotnet add package Microsoft.Extensions.Azure --version 1.7.2
dotnet add package Microsoft.OpenApi --version 1.6.14
dotnet add package Microsoft.Extensions.Telemetry --version 8.4.0
dotnet add package Microsoft.Extensions.Compliance.Redaction --version 8.4.0
dotnet add package fo-dicom --version 5.1.2