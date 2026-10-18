<#
Scrape Engnovate Cambridge IELTS reading pages (seeded in database/archive/sql/reading-cambridge-seed.sql)
and import passages into local Postgres.

Usage example (from repo root in PowerShell):
  powershell -ExecutionPolicy Bypass -File .\tools\content\scrape-and-import-passages.ps1 \
    -DbName my_note -DbUser postgres -DbPass YOUR_PASSWORD -Port 5432 \
    -PsqlPath "C:\Program Files\PostgreSQL\18\bin\psql.exe"

The script:
 - reads database/archive/sql/reading-cambridge-seed.sql for lines containing (slug, title, source_url)
 - for each source_url it fetches the page, extracts the main article HTML (.entry-content or <article>)
 - removes images/figures and script/style tags, converts to plain text
 - splits content into passages using bolded headings (**Title**) or <h2>/<h3> if present
 - writes idempotent INSERT ... ON CONFLICT SQL into database/exports/auto_import_reading_passages_generated.sql
 - runs psql to apply the SQL (if -Apply switch is present)

Notes:
 - This is a heuristic parser intended for local imports and QA. Review generated SQL before applying
 - Images are skipped as requested (only textual content imported)
 - Requires internet access and Invoke-WebRequest availability
#>
param(
    [string]$SeedFile = "database/archive/sql/reading-cambridge-seed.sql",
    [string]$OutSql = "database/exports/auto_import_reading_passages_generated.sql",
    [string]$DbName = "my_note",
    [string]$DbUser = "postgres",
    [string]$DbPass = "",
    [int]$Port = 5432,
    [string]$PsqlPath = "psql",
    [switch]$Apply
)

Write-Host "Reading seed file: $SeedFile"
if (-not (Test-Path $SeedFile)) { Write-Error "Seed file not found: $SeedFile"; exit 1 }
$seedText = Get-Content $SeedFile -Raw

# Regex to extract (slug, title, source, ... 'url') groups from the VALUES list
# Matches patterns like ('slug', 'Title', 'Source', 'https://engnovate.com/xxx/', ...)
$pattern = "\('(.*?)'\s*,\s*'(.*?)'\s*,\s*'(.*?)'\s*,\s*'(https?://[^']+)'"
$matches = [regex]::Matches($seedText, $pattern)
if ($matches.Count -eq 0) { Write-Error "No seed rows found with the expected pattern."; exit 1 }

$rows = @()
foreach ($m in $matches) {
    $slug = $m.Groups[1].Value
    $title = $m.Groups[2].Value
    $source = $m.Groups[3].Value
    $url = $m.Groups[4].Value
    $rows += [PSCustomObject]@{slug=$slug; title=$title; source=$source; url=$url}
}

Write-Host "Found $($rows.Count) seed rows. Starting fetch + parse..."

# Prepare output file
$header = @"
-- Auto-generated passage import
-- Generated: $(Get-Date -Format o)
\set ON_ERROR_STOP on
BEGIN;
"@
Set-Content -Path $OutSql -Value $header -Encoding UTF8

function HtmlToText([string]$html) {
    # Remove script/style blocks
    $html = [regex]::Replace($html, '<script.*?>.*?</script>', '', 'Singleline,IgnoreCase')
    $html = [regex]::Replace($html, '<style.*?>.*?</style>', '', 'Singleline,IgnoreCase')
    # Remove figure and img tags entirely
    $html = [regex]::Replace($html, '<figure.*?>.*?</figure>', '', 'Singleline,IgnoreCase')
    $html = [regex]::Replace($html, '<img[^>]*>', '', 'Singleline,IgnoreCase')
    # Replace block-level tags with newlines
    $html = [regex]::Replace($html, '</(p|div|br|h[1-6]|li|section|article)>', "\n", 'IgnoreCase')
    # Remove remaining tags
    $text = [regex]::Replace($html, '<[^>]+>', '')
    # Decode HTML entities
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    # Normalize whitespace and trim
    $text = [regex]::Replace($text, '\r|\n', "\n")
    $text = [regex]::Replace($text, "[\t ]+", ' ')
    $text = $text -split "\n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' } | Out-String
    return $text.Trim()
}

$index = 0
foreach ($row in $rows) {
    $index++
    Write-Host "[$index/$($rows.Count)] Fetching $($row.url)"
    try {
        $r = Invoke-WebRequest -Uri $row.url -UseBasicParsing -TimeoutSec 30
        $html = $r.Content
    } catch {
        Write-Warning "Failed to fetch $($row.url): $_"
        continue
    }

    # Try extract article main content. Common WordPress class 'entry-content' or <article>
    $contentHtml = ''
    $m = [regex]::Match($html, '<div[^>]+class="entry-content[^"]*"[^>]*>(.*?)</div>', 'Singleline,IgnoreCase')
    if ($m.Success) { $contentHtml = $m.Groups[1].Value }
    else {
        $m2 = [regex]::Match($html, '<article[^>]*>(.*?)</article>', 'Singleline,IgnoreCase')
        if ($m2.Success) { $contentHtml = $m2.Groups[1].Value }
        else { $contentHtml = $html }
    }

    # Remove images/figures explicitly
    $contentHtml = [regex]::Replace($contentHtml, '<figure.*?>.*?</figure>', '', 'Singleline,IgnoreCase')
    $contentHtml = [regex]::Replace($contentHtml, '<img[^>]*>', '', 'Singleline,IgnoreCase')

    # Convert to text with preserved paragraphs
    $plain = HtmlToText $contentHtml

    # Split into passage blocks by lines that look like headings
    # Heuristic: headings are lines that are surrounded by ** ** in the page markdown (e.g., **Title**), or are short lines in Title Case / All Caps
    $lines = $plain -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }

    $passages = @()
    $currentTitle = ''
    $currentBody = ''

    foreach ($ln in $lines) {
        # detect bold-marked heading e.g. **The White Horse of Uffington** or lines that are shorter than 60 chars and start with capital
        if ($ln -match '^\*\*(.+)\*\*$') {
            # push existing
            if ($currentBody -ne '') { $passages += [PSCustomObject]@{title=$currentTitle; body=$currentBody.Trim()}; $currentBody = '' }
            $currentTitle = $Matches[1].Trim() -replace "'", "''"
            continue
        }
        # if the line is short (<=60 chars) and looks like a heading (starts with capital letter)
        if ($ln.Length -le 60 -and $ln -match '^[A-Z]') {
            if ($currentBody -ne '') { $passages += [PSCustomObject]@{title=$currentTitle; body=$currentBody.Trim()}; $currentBody = '' }
            $currentTitle = $ln -replace "'", "''"
            continue
        }
        # otherwise append to body
        if ($currentBody -eq '') { $currentBody = $ln } else { $currentBody = $currentBody + "\n\n" + $ln }
    }
    if ($currentBody -ne '') { $passages += [PSCustomObject]@{title=$currentTitle; body=$currentBody.Trim()} }

    if ($passages.Count -eq 0) {
        Write-Warning "No passage blocks parsed for $($row.slug). Skipping."
        continue
    }

    # Build SQL for this test's passages
    $order = 0
    foreach ($p in $passages) {
        $order++
        $titleSql = if ($p.title -ne '') { "'" + ($p.title -replace "'", "''") + "'" } else { "NULL" }
        $contentSql = "'" + ($p.body -replace "'", "''") + "'"
        $wordCount = ($p.body -split '\s+' | Where-Object { $_ -ne '' }).Count
        $sql = "INSERT INTO reading_passages (test_id, passage_order, title, content, word_count, created_at) VALUES ((SELECT id FROM reading_tests WHERE slug = '$($row.slug)'), $order, $titleSql, $contentSql, $wordCount, now()) ON CONFLICT (test_id, passage_order) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, word_count = EXCLUDED.word_count;"
        Add-Content -Path $OutSql -Value $sql -Encoding UTF8
    }

    Write-Host "Parsed $($passages.Count) passage(s) for $($row.slug)"
}

Add-Content -Path $OutSql -Value "COMMIT;" -Encoding UTF8
Write-Host "SQL generated at: $OutSql"

if ($Apply) {
    # Run psql
    Write-Host "Applying SQL to database $DbName on port $Port as $DbUser"
    $env:PGPASSWORD = $DbPass
    try {
        & $PsqlPath -h localhost -p $Port -U $DbUser -d $DbName -f $OutSql
        $rc = $LASTEXITCODE
        if ($rc -ne 0) { Write-Error "psql exited with code $rc" }
        else { Write-Host "SQL applied successfully." }
    } catch {
        Write-Error "Failed running psql: $_"
    } finally {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Review the generated SQL file. To apply directly pass the -Apply switch to the script."
}
