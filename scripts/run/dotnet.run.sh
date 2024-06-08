#!/bin/bash
cd "DotNetModule/SegDicom" || exit
export ASPNETCORE_ENVIRONMENT="https"
dotnet build
dotnet run --project "SegDicom.csproj" --configuration Debug --launch-profile "https" --additional-profiles "DotNetModule/SegDicom/Properties/launchSettings.json"