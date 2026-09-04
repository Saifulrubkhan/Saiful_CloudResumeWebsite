# Deploy Vite dist/ to the S3 website bucket, then invalidate CloudFront.
# Usage:
#   $env:S3_BUCKET = "khansaiful.com"
#   $env:CLOUDFRONT_DISTRIBUTION_ID = "E123..."   # optional
#   npm run deploy

$ErrorActionPreference = "Stop"

$bucket = if ($env:S3_BUCKET) { $env:S3_BUCKET } else { "web-host-aws-s3" }
$distId = if ($env:CLOUDFRONT_DISTRIBUTION_ID) { $env:CLOUDFRONT_DISTRIBUTION_ID } else { "E3C4EH97T5RVFS" }
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Write-Error "AWS CLI not found. Install it, then run: aws configure"
}

if (-not (Test-Path $dist)) {
  Write-Error "dist/ missing. Run: npm run build"
}

Write-Host "Building..."
Push-Location $root
npm run build
Pop-Location

Write-Host "Syncing $dist -> s3://$bucket ..."
aws s3 sync $dist "s3://$bucket" --delete

if ($distId) {
  Write-Host "Invalidating CloudFront $distId ..."
  aws cloudfront create-invalidation --distribution-id $distId --paths "/*"
} else {
  Write-Host "Skipped CloudFront invalidation (set CLOUDFRONT_DISTRIBUTION_ID to enable)."
}

Write-Host "Deploy complete: https://$bucket"
