# Download Google Fonts locally for offline use
$fontsDir = ".\fonts"
if (!(Test-Path $fontsDir)) { New-Item -ItemType Directory -Path $fontsDir | Out-Null }

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

Write-Host "Fetching font CSS from Google Fonts..."
$cssUrl = "https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap"
$cssContent = (Invoke-WebRequest -Uri $cssUrl -UserAgent $ua).Content

$urlPattern = 'url\(([^)]+\.woff2)\)'
$fontMatches = [regex]::Matches($cssContent, $urlPattern)

$downloadedFiles = @{}
$counter = 0

Write-Host "Found $($fontMatches.Count) font files..."

foreach ($m in $fontMatches) {
    $fontUrl = $m.Groups[1].Value
    $counter++
    $fileName = "font_$counter.woff2"
    $outPath = Join-Path $fontsDir $fileName
    if (!(Test-Path $outPath)) {
        try {
            Invoke-WebRequest -Uri $fontUrl -OutFile $outPath -UserAgent $ua
            Write-Host "Downloaded: $fileName"
        } catch {
            Write-Host "Failed: $fontUrl"
        }
    } else {
        Write-Host "Exists: $fileName"
    }
    $downloadedFiles[$fontUrl] = $fileName
}

$localCss = $cssContent
foreach ($url in $downloadedFiles.Keys) {
    $localCss = $localCss -replace [regex]::Escape($url), "../fonts/$($downloadedFiles[$url])"
}

$localCss | Out-File -FilePath ".\css\fonts.css" -Encoding UTF8
Write-Host "Done! fonts.css created."
