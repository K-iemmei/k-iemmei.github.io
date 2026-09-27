# Import local Postgres helper for reading schema + seed
# Usage: .\scripts\import-local-postgres.ps1 -PgConnection "Host=localhost;Port=5432;Username=postgres;Password=secret;Database=mydb"
param(
    [Parameter(Mandatory=$true)]
    [string]$PgConnection
)

function Check-CommandExists([string]$cmd) {
    $which = Get-Command $cmd -ErrorAction SilentlyContinue
    return $which -ne $null
}

if (-not (Check-CommandExists psql)) {
    Write-Host "psql not found in PATH. Please install PostgreSQL client or add psql to PATH." -ForegroundColor Yellow
    Write-Host "If you prefer, run these files inside a Docker Postgres container or use PG Admin." -ForegroundColor Yellow
    exit 2
}

# Parse connection string into psql-friendly parameters
# Accept both libpq connection string or DSN keypairs
$psqlArgs = ""
if ($PgConnection -match "host=") {
    # split on spaces
    $pairs = $PgConnection -split '\s+'
    foreach ($p in $pairs) {
        if ($p -match "^host=(.+)") { $psqlArgs += " -h $($Matches[1])" }
        elseif ($p -match "^port=(.+)") { $psqlArgs += " -p $($Matches[1])" }
        elseif ($p -match "^user=|^username=(.+)") { $psqlArgs += " -U $($Matches[1])" }
        elseif ($p -match "^dbname=|^database=(.+)") { $psqlArgs += " -d $($Matches[1])" }
        else { }
    }
    # psql will prompt for password if needed via PGPASSWORD env var
    if ($PgConnection -match "password=(.+)") { $env:PGPASSWORD = $Matches[1] }
} else {
    # assume DSN like host=.. user=.. dbname=..
    $psqlArgs = "-d '$PgConnection'"
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$schemaFile = Join-Path $root "..\data\sql\reading-db.sql"
$seedFile = Join-Path $root "..\data\sql\reading-cambridge-seed.sql"
$attemptsFile = Join-Path $root "..\data\sql\reading-attempts.sql"

Write-Host "Running schema import: $schemaFile" -ForegroundColor Cyan
& psql $psqlArgs -f $schemaFile
if ($LASTEXITCODE -ne 0) { Write-Error "Schema import failed (exit $LASTEXITCODE)"; exit $LASTEXITCODE }

Write-Host "Running seed import: $seedFile" -ForegroundColor Cyan
& psql $psqlArgs -f $seedFile
if ($LASTEXITCODE -ne 0) { Write-Error "Seed import failed (exit $LASTEXITCODE)"; exit $LASTEXITCODE }

if (Test-Path $attemptsFile) {
    Write-Host "Running attempts import: $attemptsFile" -ForegroundColor Cyan
    & psql $psqlArgs -f $attemptsFile
}

Write-Host "Local import completed. Review the imported rows and run the publish SQL if ready." -ForegroundColor Green
Write-Host "To publish all Cambridge tests (after QA): UPDATE reading_tests SET status = 'published' WHERE slug LIKE 'cambridge-ielts-%';" -ForegroundColor Yellow

# Unset PGPASSWORD if we set it
if ($env:PGPASSWORD) { Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue }
