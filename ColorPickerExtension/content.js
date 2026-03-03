// Floating button state
let floatingButton = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Create the floating hot reload button
function createFloatingButton() {
  if (floatingButton) return;

  floatingButton = document.createElement('div');
  floatingButton.id = 'dev-wand-floating-btn';
  floatingButton.innerHTML = '';
  floatingButton.title = 'Hot Reload (Drag to move)';
  
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
    cursor: 'move',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '999999',
    userSelect: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
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

  // Drag functionality
  floatingButton.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  // Click to hot reload (only if not dragging)
  floatingButton.addEventListener('click', (e) => {
    if (!isDragging) {
      performHotReload();
    }
  });

  document.body.appendChild(floatingButton);
}

// Remove the floating button
function removeFloatingButton() {
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
}

// Drag functions
function dragStart(e) {
  initialX = e.clientX - xOffset;
  initialY = e.clientY - yOffset;

  if (e.target === floatingButton) {
    isDragging = true;
    floatingButton.style.cursor = 'grabbing';
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, floatingButton);
  }
}

function dragEnd(e) {
  if (isDragging) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    floatingButton.style.cursor = 'move';
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// Perform hot reload
async function performHotReload() {
  // Visual feedback - pulse effect
  floatingButton.style.animation = 'pulse 0.3s ease-in-out';
  
  // Send message to background script to perform reload
  chrome.runtime.sendMessage({ action: 'hotReload' }, (response) => {
    if (response && response.success) {
      // Page will reload, so this might not execute
      console.log('Hot reload initiated');
    }
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
  }
});

// Check if workflow mode is enabled on page load
chrome.storage.local.get(['workflowModeEnabled'], (result) => {
  if (result.workflowModeEnabled) {
    createFloatingButton();
  }
});
