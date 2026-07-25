# ==========================================
# Git Commit & Push Helper
# ==========================================
./scripts/prisma

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "        Git Commit & Push Helper"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------
# Check if this is a new project
# -------------------------------------------------
$isNew = Read-Host "Is this a NEW project? (Y/N, default: N)"

if ([string]::IsNullOrWhiteSpace($isNew)) {
    $isNew = "N"
}

if ($isNew -match '^[Yy]$') {
    if (-not (Test-Path ".git")) {
        Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
        git init

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to initialize Git." -ForegroundColor Red
            exit 1
        }
    }
}

# -------------------------------------------------
# Stage all files
# -------------------------------------------------
Write-Host "`nStaging all changes..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to stage files." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------
# Generate commit-diff.txt
# -------------------------------------------------
$diff = git diff --staged

if ([string]::IsNullOrWhiteSpace($diff)) {
    Write-Host "No staged changes found." -ForegroundColor Red
    exit 1
}

$outFile = "./scripts/temp/commit-diff.txt"

@"
=== COMMIT DIFF ===
Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Author: Niraj
-------------------

Give me a Git commit message to copy-paste.
It should not be too short and not too detailed.
And add a line in the end with text 'END'

"@ | Out-File $outFile -Encoding utf8

$diff | Out-File $outFile -Append -Encoding utf8

Write-Host ""
Write-Host "commit-diff.txt generated." -ForegroundColor Green
Write-Host "Generate your commit message using it."
Write-Host ""

# -------------------------------------------------
# Read commit message
# -------------------------------------------------
Write-Host ""
Write-Host "Paste the commit message below."
Write-Host "When you're done, type a line containing only END and press Enter."
Write-Host ""

$lines = @()

while ($true) {
    $line = Read-Host
    if ($line -eq "END") {
        break
    }
    $lines += $line
}

$commitMessage = $lines -join "`n"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "Commit message cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Commit Message"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host $commitMessage
Write-Host ""

$confirm = Read-Host "Proceed with commit? (Y/N, default: Y)"

if ([string]::IsNullOrWhiteSpace($confirm)) {
    $confirm = "Y"
}

if ($confirm -notmatch '^[Yy]$') {
    Write-Host "Cancelled."
    exit 0
}

# -------------------------------------------------
# Commit
# -------------------------------------------------
Write-Host "`nCreating commit..." -ForegroundColor Yellow
git commit -m "$commitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------
# New Project Workflow
# -------------------------------------------------
if ($isNew -match '^[Yy]$') {

    Write-Host "`nRenaming branch to main..." -ForegroundColor Yellow
    git branch -M main

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to rename branch." -ForegroundColor Red
        exit 1
    }

    $repo = Read-Host "Enter GitHub repository URL"

    if ([string]::IsNullOrWhiteSpace($repo)) {
        Write-Host "Repository URL cannot be empty." -ForegroundColor Red
        exit 1
    }

    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin "$repo"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to add remote." -ForegroundColor Red
        exit 1
    }

    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed." -ForegroundColor Red
        exit 1
    }
}
else {

    Write-Host "`nPushing changes..." -ForegroundColor Yellow
    git push

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Done! Commit and push completed."
Write-Host "=========================================" -ForegroundColor Green