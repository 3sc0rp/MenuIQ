# Test script for uploading menu data
$uri = "http://localhost:3001/api/menu/upload"
$filePath = "sample-menu.json"

# Read the JSON file
$jsonContent = Get-Content $filePath -Raw

# Create the multipart form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"",
    "",
    "Enhanced Test Menu",
    "--$boundary",
    "Content-Disposition: form-data; name=`"userId`"",
    "",
    "1",
    "--$boundary",
    "Content-Disposition: form-data; name=`"menu`"; filename=`"sample-menu.json`"",
    "Content-Type: application/json",
    "",
    $jsonContent,
    "--$boundary--"
) -join $LF

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "Upload successful:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Upload failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response
} 