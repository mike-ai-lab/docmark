# Alignment Diagnostic Tool

This tool will measure and report the exact positioning of elements to diagnose the coordinate system issue.

<div id="diagnostic-results" style="background: #f0f0f0; padding: 20px; margin: 20px 0; font-family: monospace; white-space: pre-wrap; border: 2px solid #333;"></div>

<script>
function runDiagnostic() {
    const results = [];
    results.push("=== COORDINATE ALIGNMENT DIAGNOSTIC ===");
    results.push("Timestamp: " + new Date().toISOString());
    results.push("");
    
    // Get paper page dimensions
    const paperPage = document.querySelector('.paper-page');
    if (paperPage) {
        const pageRect = paperPage.getBoundingClientRect();
        const pageStyle = window.getComputedStyle(paperPage);
        
        results.push("PAPER PAGE MEASUREMENTS:");
        results.push(`- Width: ${pageRect.width}px (should be 794px for A4)`);
        results.push(`- Height: ${pageRect.height}px (should be 1123px for A4)`);
        results.push(`- CSS Padding: ${pageStyle.paddingTop} ${pageStyle.paddingRight} ${pageStyle.paddingBottom} ${pageStyle.paddingLeft}`);
        results.push(`- Position: ${pageStyle.position}`);
        results.push("");
    }
    
    // Get paper content dimensions
    const paperContent = document.querySelector('.paper-content');
    if (paperContent) {
        const contentRect = paperContent.getBoundingClientRect();
        const contentStyle = window.getComputedStyle(paperContent);
        
        results.push("PAPER CONTENT MEASUREMENTS:");
        results.push(`- Width: ${contentRect.width}px`);
        results.push(`- Height: ${contentRect.height}px`);
        results.push(`- CSS Padding: ${contentStyle.paddingTop} ${contentStyle.paddingRight} ${contentStyle.paddingBottom} ${contentStyle.paddingLeft}`);
        results.push(`- Box Sizing: ${contentStyle.boxSizing}`);
        results.push("");
    }
    
    // Test absolute positioning
    const testDiv = document.createElement('div');
    testDiv.style.cssText = 'position: absolute; top: 0; left: 0; width: 10px; height: 10px; background: red; z-index: 9999;';
    if (paperPage) {
        paperPage.appendChild(testDiv);
        const testRect = testDiv.getBoundingClientRect();
        const pageRect = paperPage.getBoundingClientRect();
        
        results.push("ABSOLUTE POSITIONING TEST:");
        results.push(`- Test div position: ${testRect.left}, ${testRect.top}`);
        results.push(`- Paper page position: ${pageRect.left}, ${pageRect.top}`);
        results.push(`- Offset from page origin: ${testRect.left - pageRect.left}px, ${testRect.top - pageRect.top}px`);
        results.push(`- Expected offset: 0px, 0px (if coordinate system is correct)`);
        results.push("");
        
        paperPage.removeChild(testDiv);
    }
    
    // Check current margin settings
    try {
        const settings = JSON.parse(localStorage.getItem('com.markdownlivepreview.pdf_font_settings') || '{}');
        results.push("CURRENT MARGIN SETTINGS:");
        results.push(`- Top: ${settings.margins?.top || 'unknown'}mm`);
        results.push(`- Right: ${settings.margins?.right || 'unknown'}mm`);
        results.push(`- Bottom: ${settings.margins?.bottom || 'unknown'}mm`);
        results.push(`- Left: ${settings.margins?.left || 'unknown'}mm`);
        results.push("");
    } catch (e) {
        results.push("MARGIN SETTINGS: Could not read from localStorage");
        results.push("");
    }
    
    // Viewport info
    results.push("VIEWPORT INFO:");
    results.push(`- Window size: ${window.innerWidth}x${window.innerHeight}`);
    results.push(`- Device pixel ratio: ${window.devicePixelRatio}`);
    results.push("");
    
    results.push("=== END DIAGNOSTIC ===");
    
    // Display results
    const resultsDiv = document.getElementById('diagnostic-results');
    if (resultsDiv) {
        resultsDiv.textContent = results.join('\n');
    }
    
    // Also log to console
    console.log(results.join('\n'));
    
    return results.join('\n');
}

// Auto-run diagnostic after page loads
setTimeout(() => {
    runDiagnostic();
}, 1000);

// Add button to re-run
document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = 'Re-run Diagnostic';
    button.style.cssText = 'padding: 10px 20px; margin: 10px 0; font-size: 16px; background: #007cba; color: white; border: none; cursor: pointer;';
    button.onclick = runDiagnostic;
    
    const resultsDiv = document.getElementById('diagnostic-results');
    if (resultsDiv && resultsDiv.parentNode) {
        resultsDiv.parentNode.insertBefore(button, resultsDiv);
    }
});
</script>

## Instructions:

1. Enable Paper Layout mode
2. Set margins to 0mm (all sides)
3. Wait for the diagnostic to run automatically
4. Copy the entire diagnostic output from the gray box above
5. Paste it in your response so I can analyze the measurements

The diagnostic will show:
- Exact pixel measurements of page and content areas
- Current padding values applied by CSS/JS
- Absolute positioning test results
- Current margin settings from localStorage

This will give us precise data about what's happening with the coordinate system!