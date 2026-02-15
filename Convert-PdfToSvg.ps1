# PDF to SVG Converter PowerShell Script
# Converts PDF with vector drawings to SVG format

param(
    [string]$InputPdf = "C:\Users\Administrator\Downloads\test_svg_embed.pdf",
    [string]$OutputDir = "svg-output",
    [string]$OutputName = "converted"
)

# Colors
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

Write-Host "`n========================================" -ForegroundColor $Cyan
Write-Host "   PDF to SVG Converter" -ForegroundColor $Cyan
Write-Host "========================================`n" -ForegroundColor $Cyan

# Check if input PDF exists
if (-not (Test-Path $InputPdf)) {
    Write-Host "[ERROR] PDF file not found: $InputPdf" -ForegroundColor $Red
    exit 1
}

Write-Host "[OK] Input PDF: $InputPdf" -ForegroundColor $Green

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "[OK] Output directory: $OutputDir`n" -ForegroundColor $Green

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

# Try Inkscape
if (Test-Command "inkscape") {
    Write-Host "[OK] Inkscape found" -ForegroundColor $Green
    Write-Host "Converting with Inkscape...`n" -ForegroundColor $Cyan
    
    $outputPath = Join-Path $OutputDir "$OutputName.svg"
    
    try {
        & inkscape $InputPdf --export-filename=$outputPath --export-type=svg 2>&1 | Out-Null
        
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length / 1KB
            Write-Host "`n========================================" -ForegroundColor $Green
            Write-Host "   CONVERSION SUCCESSFUL!" -ForegroundColor $Green
            Write-Host "========================================`n" -ForegroundColor $Green
            
            Write-Host "Output file: $outputPath" -ForegroundColor $Cyan
            Write-Host "File size: $([math]::Round($fileSize, 2)) KB`n" -ForegroundColor $Cyan
            
            Write-Host "Next Steps:" -ForegroundColor $Yellow
            Write-Host "  1. Open the SVG file in a text editor"
            Write-Host "  2. Copy the entire SVG content"
            Write-Host "  3. Paste into DocMark editor"
            Write-Host "  4. Wrap in a div for styling:`n"
            
            Write-Host '<div style="width: 100%; max-width: 800px; margin: 20px auto;">' -ForegroundColor $Cyan
            Write-Host '  <!-- Paste SVG content here -->' -ForegroundColor $Cyan
            Write-Host '</div>' -ForegroundColor $Cyan
            Write-Host ""
            
            exit 0
        }
    } catch {
        Write-Host "[ERROR] Inkscape conversion failed: $_" -ForegroundColor $Red
    }
}

# Try pdftocairo
if (Test-Command "pdftocairo") {
    Write-Host "[OK] pdftocairo found" -ForegroundColor $Green
    Write-Host "Converting with pdftocairo...`n" -ForegroundColor $Cyan
    
    $outputPath = Join-Path $OutputDir "$OutputName.svg"
    
    try {
        & pdftocairo -svg $InputPdf $outputPath 2>&1 | Out-Null
        
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length / 1KB
            Write-Host "`n========================================" -ForegroundColor $Green
            Write-Host "   CONVERSION SUCCESSFUL!" -ForegroundColor $Green
            Write-Host "========================================`n" -ForegroundColor $Green
            
            Write-Host "Output file: $outputPath" -ForegroundColor $Cyan
            Write-Host "File size: $([math]::Round($fileSize, 2)) KB`n" -ForegroundColor $Cyan
            
            Write-Host "Next Steps:" -ForegroundColor $Yellow
            Write-Host "  1. Run: node convert-with-pdf2svg.js"
            Write-Host "  2. Open: svg-output\svg-embed-codes.md"
            Write-Host "  3. Copy embed code"
            Write-Host "  4. Paste into DocMark`n"
            
            exit 0
        }
    } catch {
        Write-Host "[ERROR] pdftocairo conversion failed: $_" -ForegroundColor $Red
    }
}

# No tools found
Write-Host "`n[ERROR] No conversion tools found!`n" -ForegroundColor $Red
Write-Host "Please install one of the following:`n" -ForegroundColor $Yellow
Write-Host "Option 1: Inkscape (Recommended)" -ForegroundColor $Cyan
Write-Host "  Download: https://inkscape.org/release/"
Write-Host "  Or install: choco install inkscape`n"

Write-Host "Option 2: Poppler (pdftocairo)" -ForegroundColor $Cyan
Write-Host "  Install: choco install poppler`n"

Write-Host "After installation, run this script again.`n"

exit 1
