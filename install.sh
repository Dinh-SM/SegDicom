#!/bin/bash
./scripts/install/dotnet.install.sh &
./scripts/install/azurite.install.sh &
./scripts/install/azurefunction.install.sh &
./scripts/install/angular.install.sh &
./scripts/install/python.install.sh &
wait