@echo off
REM PDF to SVG Converter Batch Script
REM This script attempts to convert PDF to SVG using available tools

echo ========================================
echo PDF to SVG Converter
echo ========================================
echo.

set INPUT_PDF=C:\Users\Administrator\Downloads\test_svg_embed.pdf
set OUTPUT_DIR=svg-output
set OUTPUT_FILE=converted.svg

REM Create output directory
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo Checking for conversion tools...
echo.

REM Try Inkscape
where inkscape >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Inkscape found
    echo Converting with Inkscape...
    inkscape "%INPUT_PDF%" --export-filename="%OUTPUT_DIR%\%OUTPUT_FILE%" --export-type=svg
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Conversion complete!
        echo Output: %OUTPUT_DIR%\%OUTPUT_FILE%
        goto :success
    )
)

REM Try pdftocairo
where pdftocairo >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] pdftocairo found
    echo Converting with pdftocairo...
    pdftocairo -svg "%INPUT_PDF%" "%OUTPUT_DIR%\%OUTPUT_FILE%"
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Conversion complete!
        echo Output: %OUTPUT_DIR%\%OUTPUT_FILE%
        goto :success
    )
)

REM No tools found
echo [ERROR] No conversion tools found!
echo.
echo Please install one of the following:
echo   1. Inkscape: https://inkscape.org/
echo   2. Poppler (pdftocairo): choco install poppler
echo.
goto :end

:success
echo.
echo ========================================
echo Next Steps:
echo   1. Open svg-output\%OUTPUT_FILE%
echo   2. Copy SVG content
echo   3. Paste into DocMark
echo ========================================
echo.

:end
pause
