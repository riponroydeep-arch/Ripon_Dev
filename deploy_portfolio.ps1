param(
    [string]$Owner = "riponroydeep-arch",
    [string]$RepoName = "Ripon_Dev",
    [string]$Branch = "main",
    [string]$Token = $env:GH_TOKEN
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
    throw "No GitHub token provided. Set GH_TOKEN or pass -Token."
}

$repoFull = "$Owner/$RepoName"
$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $ghPath)) {
    throw "GitHub CLI was not found at $ghPath. Install GitHub CLI first."
}

# Authenticate with the token
$Token | & $ghPath auth login --with-token

# Verify auth state before continuing
& $ghPath auth status
if ($LASTEXITCODE -ne 0) {
    throw "GitHub authentication failed. Verify the token and account permissions."
}

Set-Location $PSScriptRoot

git config user.name "Ripon Roy"
git config user.email "riponroy.dev@gmail.com"

# Ensure repo exists; create it if needed
$repoExists = & $ghPath repo view $repoFull --json name --jq ".name" 2>$null
if (-not $repoExists) {
    Write-Host "Creating GitHub repository $repoFull"
    & $ghPath repo create $repoFull --public --source=. --remote=origin --push
}
else {
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$repoFull.git"
}

# Ensure main branch exists and is checked out
if (git show-ref --verify --quiet "refs/heads/$Branch") {
    git checkout $Branch
}
else {
    git checkout -b $Branch
}

# Stage and commit
git add .
$hasStaged = git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "Automated portfolio update"
}
else {
    Write-Host "No changes to commit."
}

# Pull/rebase from remote and push
git pull --rebase origin $Branch 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote branch not ready for rebase yet; continuing with push attempt."
}

git push -u origin $Branch

# Enable GitHub Pages if not already configured
$pagesCheck = & $ghPath api "repos/$repoFull/pages" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Enabling GitHub Pages for $repoFull"
    & $ghPath api --method POST "repos/$repoFull/pages" -f source='{"branch":"main","path":"/"}' -H "Accept: application/vnd.github+json"
}

Write-Host "GitHub repo and Pages setup complete."
Write-Host "Repo URL: https://github.com/$repoFull"
Write-Host "Live Pages URL: https://$Owner.github.io/$RepoName/"
