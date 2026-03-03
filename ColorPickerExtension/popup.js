// Function to convert HEX color string to RGB format
function hexToRgb(hex) {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
}

// Function to convert HEX color string to HSL format
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// Initialize workflow mode toggle state
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['workflowModeEnabled'], (result) => {
    const toggle = document.getElementById('workflow-mode-toggle');
    toggle.checked = result.workflowModeEnabled || false;
  });
});

// Handle workflow mode toggle
document.getElementById('workflow-mode-toggle').addEventListener('change', async (e) => {
  const enabled = e.target.checked;
  
  // Save state
  await chrome.storage.local.set({ workflowModeEnabled: enabled });
  
  // Send message to all tabs to show/hide floating button
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggleWorkflowMode',
      enabled: enabled
    }).catch(() => {
      // Ignore errors for tabs that don't have content script
    });
  });
  
  // Show feedback
  const msg = document.getElementById('copy-message');
  msg.textContent = enabled ? 'Workflow mode enabled!' : 'Workflow mode disabled!';
  msg.classList.remove('hidden');
  setTimeout(() => {
    msg.classList.add('hidden');
    msg.textContent = 'Copied to clipboard!';
  }, 1500);
});

// Function to copy text to the user's clipboard
async function copyToClipboard(text) {
  if (!text || text === '-') return; // Do not copy empty values
  
  try {
    await navigator.clipboard.writeText(text);
    
    // Show brief feedback to the user
    const msg = document.getElementById('copy-message');
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden');
    }, 1500);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Initialize the EyeDropper API when the button is clicked
document.getElementById('pick-color-btn').addEventListener('click', async () => {
  // Check if the browser supports the EyeDropper API
  if (!window.EyeDropper) {
    alert("Your browser does not support the EyeDropper API.");
    return;
  }

  const eyeDropper = new EyeDropper();
  
  try {
    // Open the color picker tool
    const result = await eyeDropper.open();
    const hexColor = result.sRGBHex;
    
    // Generate the other color formats
    const rgbColor = hexToRgb(hexColor);
    const hslColor = hexToHsl(hexColor);

    // Update the visual display block
    document.getElementById('color-display').style.backgroundColor = hexColor;

    // Update the text values in the UI
    document.getElementById('hex-value').textContent = hexColor;
    document.getElementById('rgb-value').textContent = rgbColor;
    document.getElementById('hsl-value').textContent = hslColor;
    
  } catch (e) {
    // The user pressed Escape or cancelled the picker
    console.log("Color selection cancelled.");
  }
});

// Setup click-to-copy event listeners for each color format container
document.getElementById('hex-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('hex-value').textContent);
});

document.getElementById('rgb-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('rgb-value').textContent);
});

document.getElementById('hsl-container').addEventListener('click', () => {
  copyToClipboard(document.getElementById('hsl-value').textContent);
});

// Hot Reload: Hard refresh + clear cache for current tab
document.getElementById('hot-reload-btn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      alert('No active tab found');
      return;
    }

    // Extract the origin (protocol + hostname + port) from the tab URL
    const url = new URL(tab.url);
    const origins = [url.origin];

    // Clear cache for the current tab's origin
    await chrome.browsingData.removeCache({
      origins: origins
    });

    // Also clear other storage types that might affect dev workflow
    await chrome.browsingData.remove({
      origins: origins
    }, {
      cacheStorage: true,
      serviceWorkers: true
    });

    // Hard reload the page (bypass cache)
    await chrome.tabs.reload(tab.id, { bypassCache: true });

    // Show feedback
    const msg = document.getElementById('copy-message');
    msg.textContent = 'Hot reloaded!';
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden');
      msg.textContent = 'Copied to clipboard!';
    }, 1500);

  } catch (err) {
    console.error('Hot reload failed:', err);
    alert('Hot reload failed: ' + err.message);
  }
});

// Clear Cache: Clear all cache for current tab's origin
document.getElementById('clear-cache-btn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      alert('No active tab found');
      return;
    }

    // Extract the origin from the tab URL
    const url = new URL(tab.url);
    const origins = [url.origin];

    // Clear comprehensive cache data
    await chrome.browsingData.removeCache({
      origins: origins
    });

    await chrome.browsingData.remove({
      origins: origins
    }, {
      cacheStorage: true,
      serviceWorkers: true,
      localStorage: true,
      indexedDB: true
    });

    // Show feedback
    const msg = document.getElementById('copy-message');
    msg.textContent = 'Cache cleared!';
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden');
      msg.textContent = 'Copied to clipboard!';
    }, 1500);

  } catch (err) {
    console.error('Clear cache failed:', err);
    alert('Clear cache failed: ' + err.message);
  }
});
