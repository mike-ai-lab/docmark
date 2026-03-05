/**
 * PDF Settings Live Update Handler
 * Triggers paper layout re-render when settings change
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for modal to exist
    const checkModal = setInterval(() => {
        const modal = document.getElementById('pdf-settings-modal');
        if (modal) {
            clearInterval(checkModal);
            setupLiveUpdates();
        }
    }, 100);
});

function setupLiveUpdates() {
    const applyUpdate = () => {
        if (window.applyPdfSettingsToPaperLayout) {
            window.applyPdfSettingsToPaperLayout();
        }
    };
    
    // Alignment buttons
    document.querySelectorAll('.pdf-align-btn').forEach(btn => {
        btn.addEventListener('click', applyUpdate);
    });
    
    // Page number position buttons
    document.querySelectorAll('.pdf-page-num-btn').forEach(btn => {
        btn.addEventListener('click', applyUpdate);
    });
    
    // Margin inputs
    ['top', 'right', 'bottom', 'left'].forEach(side => {
        const input = document.getElementById(`pdf-margin-${side}`);
        if (input) {
            input.addEventListener('input', applyUpdate);
        }
    });
    
    // Margin guides toggle
    const guidesCheckbox = document.getElementById('show-margin-guides');
    if (guidesCheckbox) {
        guidesCheckbox.addEventListener('change', (e) => {
            const settings = loadPdfLayoutSettings();
            settings.showMarginGuides = e.target.checked;
            savePdfLayoutSettings(settings);
            applyUpdate();
        });
    }
}

function loadPdfLayoutSettings() {
    try {
        const raw = localStorage.getItem('com.markdownlivepreview.pdf_layout_settings');
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        textAlign: 'left',
        pageNumberPosition: 'center',
        margins: { top: 15, right: 15, bottom: 15, left: 15 },
        showMarginGuides: true
    };
}

function savePdfLayoutSettings(settings) {
    try {
        localStorage.setItem('com.markdownlivepreview.pdf_layout_settings', JSON.stringify(settings));
    } catch (e) {}
}
