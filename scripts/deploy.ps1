# Deploy Vite dist/ to the S3 website bucket, then invalidate CloudFront.
# Usage (required env vars — no hardcoded prod IDs):
#   $env:S3_BUCKET = "resume-website-saiful"
#   $env:CLOUDFRONT_DISTRIBUTION_ID = "E2ZAVM7W2WEI3R"
#   npm run deploy

$ErrorActionPreference = "Stop"

if (-not $env:S3_BUCKET) {
  Write-Error "Set S3_BUCKET before deploying (example: resume-website-saiful)."
}
if (-not $env:CLOUDFRONT_DISTRIBUTION_ID) {
  Write-Error "Set CLOUDFRONT_DISTRIBUTION_ID before deploying."
}

$bucket = $env:S3_BUCKET
$distId = $env:CLOUDFRONT_DISTRIBUTION_ID
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Write-Error "AWS CLI not found. Install it, then run: aws configure"
}

Write-Host "Building..."
Push-Location $root
npm run build
Pop-Location

if (-not (Test-Path $dist)) {
  Write-Error "dist/ missing after build."
}

Write-Host "Syncing $dist -> s3://$bucket ..."
aws s3 sync $dist "s3://$bucket" --delete

Write-Host "Invalidating CloudFront $distId ..."
aws cloudfront create-invalidation --distribution-id $distId --paths "/*"

Write-Host "Deploy complete."
