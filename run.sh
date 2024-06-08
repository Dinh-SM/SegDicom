#!/bin/bash
./scripts/run/angular.run.sh &
./scripts/run/azurite.run.sh &
./scripts/run/dotnet.run.sh &
./scripts/run/azurefunction.run.sh &
wait