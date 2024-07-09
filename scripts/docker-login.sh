#!/bin/bash

# Ensure environment variables are set
if [[ -z "$ACR_USERNAME" || -z "$ACR_PASSWORD" ]]; then
  echo "ACR_USERNAME and ACR_PASSWORD must be set"
  exit 1
fi

# Log in to Azure using service principal
echo "Logging in to Azure..."
az login --service-principal -u $ACR_USERNAME -p $ACR_PASSWORD --tenant 8775661c-d343-4930-a990-8a3360e2ca1f
if [[ $? -ne 0 ]]; then
  echo "Azure login failed"
  exit 1
fi

# Get the access token
echo "Retrieving access token..."
TOKEN=$(az acr login --name ecristudenthubacr --expose-token | jq -r '.accessToken')
if [[ -z "$TOKEN" ]]; then
  echo "Failed to retrieve access token"
  exit 1
fi

# Login to Docker using the token
echo "Logging in to Docker..."
echo $TOKEN | docker login ecristudenthubacr.azurecr.io -u 00000000-0000-0000-0000-000000000000 --password-stdin
if [[ $? -ne 0 ]]; then
  echo "Docker login failed"
  exit 1
fi

echo "Docker login successful"
