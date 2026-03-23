// Floating button state
let floatingButton = null;
let visualEditorButton = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let buttonStartX = 0;
let buttonStartY = 0;

// Load visual editor script
const visualEditorScript = document.createElement('script');
visualEditorScript.src = chrome.runtime.getURL('visual-editor.js');
(document.head || document.documentElement).appendChild(visualEditorScript);

// Create the floating hot reload button
function createFloatingButton() {
  if (floatingButton) return;

  floatingButton = document.createElement('div');
  floatingButton.id = 'dev-wand-floating-btn';
  floatingButton.innerHTML = '';
  floatingButton.title = 'Left-click: Hot Reload | Right-click & drag: Move';
  
  // Apply styles
  Object.assign(floatingButton.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '999999',
    userSelect: 'none',
    border: '2px solid white'
  });

  // Hover effect
  floatingButton.addEventListener('mouseenter', () => {
    if (!isDragging) {
      floatingButton.style.transform = 'scale(1.1)';
      floatingButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    }
  });

  floatingButton.addEventListener('mouseleave', () => {
    if (!isDragging) {
      floatingButton.style.transform = 'scale(1)';
      floatingButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }
  });

  // Right-click drag functionality
  floatingButton.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Right mouse button
      e.preventDefault();
      isDragging = true;
      
      // Store initial mouse position
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      
      // Get current button position
      const rect = floatingButton.getBoundingClientRect();
      buttonStartX = rect.left;
      buttonStartY = rect.top;
      
      floatingButton.style.cursor = 'grabbing';
      floatingButton.style.transition = 'none'; // Disable transition during drag
    }
  });

  // Left-click to reload
  floatingButton.addEventListener('click', (e) => {
    if (e.button === 0 && !isDragging) { // Left mouse button
      performHotReload();
    }
  });

  // Prevent context menu on the button
  floatingButton.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  document.body.appendChild(floatingButton);
  
  // Create Visual Editor button
  createVisualEditorButton();
}

// Create Visual Editor button
function createVisualEditorButton() {
  if (visualEditorButton) return;
  
  visualEditorButton = document.createElement('div');
  visualEditorButton.id = 'dev-wand-visual-editor-btn';
  visualEditorButton.innerHTML = '🎨';
  visualEditorButton.title = 'Toggle Visual Editor';
  
  Object.assign(visualEditorButton.style, {
    position: 'fixed',
    bottom: '130px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#9c27b0',
    color: 'white',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '999999',
    userSelect: 'none',
    border: '2px solid white',
    transition: 'transform 0.2s, box-shadow 0.2s'
  });
  
  visualEditorButton.addEventListener('mouseenter', () => {
    visualEditorButton.style.transform = 'scale(1.1)';
    visualEditorButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
  });
  
  visualEditorButton.addEventListener('mouseleave', () => {
    visualEditorButton.style.transform = 'scale(1)';
    visualEditorButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });
  
  visualEditorButton.addEventListener('click', () => {
    // Wait for script to load
    if (window.devWandVisualEditor) {
      window.devWandVisualEditor.init();
      
      // Update button color
      if (window.devWandVisualEditor.isActive()) {
        visualEditorButton.style.backgroundColor = '#ff9800';
      } else {
        visualEditorButton.style.backgroundColor = '#9c27b0';
      }
    } else {
      alert('Visual Editor is loading... Please try again in a moment.');
    }
  });
  
  document.body.appendChild(visualEditorButton);
}

// Remove the floating button
function removeFloatingButton() {
  if (floatingButton) {
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('contextmenu', preventContextMenu);
    
    floatingButton.remove();
    floatingButton = null;
  }
  
  // Remove visual editor button
  if (visualEditorButton) {
    visualEditorButton.remove();
    visualEditorButton = null;
  }
  
  // Deactivate visual editor if active
  if (window.devWandVisualEditor && window.devWandVisualEditor.isActive()) {
    window.devWandVisualEditor.deactivate();
  }
}

// Handle mouse move for dragging
function handleMouseMove(e) {
  if (isDragging && floatingButton) {
    e.preventDefault();
    
    // Calculate new position
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    const newX = buttonStartX + deltaX;
    const newY = buttonStartY + deltaY;
    
    // Update button position using left/top instead of transform
    floatingButton.style.left = newX + 'px';
    floatingButton.style.top = newY + 'px';
    floatingButton.style.right = 'auto';
    floatingButton.style.bottom = 'auto';
  }
}

// Handle mouse up to end dragging
function handleMouseUp(e) {
  if (isDragging && floatingButton) {
    isDragging = false;
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.transition = 'transform 0.2s, box-shadow 0.2s'; // Re-enable transition
  }
}

// Prevent context menu during drag
function preventContextMenu(e) {
  if (isDragging) {
    e.preventDefault();
  }
}

// Add global event listeners
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('contextmenu', preventContextMenu);

// Perform hot reload
async function performHotReload() {
  // Get the current reload mode from storage
  chrome.storage.local.get(['reloadMode'], (result) => {
    const mode = result.reloadMode || 'soft';
    
    // Visual feedback - pulse effect
    const currentTransform = floatingButton.style.transform;
    floatingButton.style.animation = 'pulse 0.3s ease-in-out';
    
    setTimeout(() => {
      floatingButton.style.animation = '';
      floatingButton.style.transform = currentTransform;
    }, 300);
    
    // Update button color based on mode
    if (mode === 'soft') {
      floatingButton.style.backgroundColor = '#28a745'; // Green
    } else if (mode === 'medium') {
      floatingButton.style.backgroundColor = '#ffc107'; // Yellow
    } else if (mode === 'hard') {
      floatingButton.style.backgroundColor = '#dc3545'; // Red
    }
    
    // Send message to background script to perform reload
    chrome.runtime.sendMessage({ action: 'hotReload', mode: mode }, (response) => {
      if (response && response.success) {
        // Page will reload, so this might not execute
        console.log('Hot reload initiated with mode:', mode);
      }
    });
  });
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;
document.head.appendChild(style);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleWorkflowMode') {
    if (request.enabled) {
      createFloatingButton();
    } else {
      removeFloatingButton();
    }
    sendResponse({ success: true });
  } else if (request.action === 'updateReloadMode') {
    // Update button color based on mode
    if (floatingButton) {
      const mode = request.mode;
      if (mode === 'soft') {
        floatingButton.style.backgroundColor = '#28a745'; // Green
      } else if (mode === 'medium') {
        floatingButton.style.backgroundColor = '#ffc107'; // Yellow
      } else if (mode === 'hard') {
        floatingButton.style.backgroundColor = '#dc3545'; // Red
      }
    }
    sendResponse({ success: true });
  }
});

// Check if workflow mode is enabled on page load
chrome.storage.local.get(['workflowModeEnabled', 'reloadMode'], (result) => {
  if (result.workflowModeEnabled) {
    createFloatingButton();
    // Update button color based on mode
    const mode = result.reloadMode || 'soft';
    if (floatingButton) {
      if (mode === 'soft') {
        floatingButton.style.backgroundColor = '#28a745'; // Green
      } else if (mode === 'medium') {
        floatingButton.style.backgroundColor = '#ffc107'; // Yellow
      } else if (mode === 'hard') {
        floatingButton.style.backgroundColor = '#dc3545'; // Red
      }
    }
  }
});
