# ==========================================
# Prisma Migration Helper
# ==========================================

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      Prisma Migration Helper"
Write-Host "=========================================" -ForegroundColor Cyan

# Check if schema exists
if (-not (Test-Path "prisma/schema.prisma")) {
    Write-Host "prisma/schema.prisma not found." -ForegroundColor Red
    exit 1
}

# Generate schema diff
$diff = git diff -- prisma/schema.prisma

if ([string]::IsNullOrWhiteSpace($diff)) {
    Write-Host "No changes found in prisma/schema.prisma." -ForegroundColor Yellow
    exit 0
}

$outFile = "./scripts/temp/schema-diff.txt"

@"
=== PRISMA SCHEMA DIFF ===
Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Generate a short Prisma migration name.

Examples:
- add_user_roles
- create_campaign_logs
- add_email_status
- update_campaign_model
- remove_unused_fields

Return ONLY the migration name.
Do not use spaces.
Use lowercase_with_underscores.

"@ | Set-Content $outFile -Encoding utf8

$diff | Add-Content $outFile

Write-Host ""
Write-Host "schema-diff.txt generated." -ForegroundColor Green
Write-Host "Generate a migration name from it."
Write-Host ""

$migrationName = Read-Host "Migration name"

if ([string]::IsNullOrWhiteSpace($migrationName)) {
    Write-Host "Migration name cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host "`nValidating schema..." -ForegroundColor Yellow
npx prisma validate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Schema validation failed." -ForegroundColor Red
    exit 1
}

Write-Host "`nRunning migration..." -ForegroundColor Yellow
npx prisma migrate dev --name $migrationName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed." -ForegroundColor Red
    exit 1
}

Write-Host "`nGenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Prisma Client generation failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Migration completed successfully."
Write-Host "=========================================" -ForegroundColor Green