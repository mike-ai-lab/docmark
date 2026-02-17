// Utility Functions

// Convert RGB to Hex
function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
    const res = rgb.match(/\d+/g);
    return res ? "#" + res.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#ffffff';
}

// Show indicator message
function showIndicator(message, color = '#2e7d32') {
    const indicator = document.getElementById('copyIndicator');
    indicator.textContent = message;
    indicator.style.background = color;
    indicator.style.display = 'block';
    setTimeout(() => {
        indicator.style.display = 'none';
        indicator.style.background = '#2e7d32';
    }, 2000);
}

// Normalize z-index value
function normalizeZIndex(element) {
    const computed = window.getComputedStyle(element);
    let zIndex = parseInt(element.style.zIndex) || parseInt(computed.zIndex) || 0;
    if (isNaN(zIndex)) zIndex = 0;
    return zIndex;
}

// Check if element is locked
function isElementLocked(element) {
    const state = window.InspectorState;
    return state.getLockedElements().has(element) || element.hasAttribute('data-locked');
}

// Export utilities
window.InspectorUtils = {
    rgbToHex,
    showIndicator,
    normalizeZIndex,
    isElementLocked
};
