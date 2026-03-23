// Visual Editor Mode - Injected into pages
// Wrapped in IIFE to avoid global scope pollution
(function() {
  'use strict';
  
  let visualEditorActive = false;
  let selectedElement = null;
  let editorPanel = null;
  let copiedStyles = null;
  let styleClipboardHistory = [];
  let batchPasteMode = false;
  let batchPastedElements = [];
  let lockedElements = new Set();
  let multiSelectMode = false;
  let selectedElements = [];
  let arrangeMode = false;
  let arrangeTargetElement = null;
  let arrangedElements = [];

  // Initialize Visual Editor
  function initVisualEditor() {
    if (visualEditorActive) {
      deactivateVisualEditor();
      return;
    }
    
    visualEditorActive = true;
    createEditorPanel();
    injectInspectorStyles();
    attachInspectorEvents();
    
    showNotification('✨ Visual Editor Activated! Click any element to edit.');
  }

  // Create floating editor panel
  function createEditorPanel() {
    editorPanel = document.createElement('div');
    editorPanel.id = 'dev-wand-editor-panel';
    editorPanel.innerHTML = `
      <div class="dw-panel-header">
        <span>🎨 Visual Editor</span>
        <button id="dw-close-editor" title="Close Editor">✕</button>
      </div>
      
      <div id="dw-editor-content" style="display:none;">
        <!-- TEXT & CONTENT -->
        <div class="dw-section-header">📝 TEXT & CONTENT</div>
        <div class="dw-editor-group">
          <label>Text Content</label>
          <input type="text" id="dw-prop-text">
        </div>
        
        <!-- TYPOGRAPHY -->
        <div class="dw-section-header">🔤 TYPOGRAPHY</div>
        <div class="dw-editor-group">
          <label>Font Size (px)</label>
          <input type="number" id="dw-prop-fontsize">
        </div>
        <div class="dw-editor-group">
          <label>Font Weight</label>
          <select id="dw-prop-fontweight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="700">700</option>
          </select>
        </div>
        
        <!-- COLORS -->
        <div class="dw-section-header">🎨 COLORS</div>
        <div class="dw-editor-group">
          <label>Text Color</label>
          <input type="color" id="dw-prop-color">
        </div>
        <div class="dw-editor-group">
          <label>Background</label>
          <input type="color" id="dw-prop-bg">
        </div>
        
        <!-- SPACING -->
        <div class="dw-section-header">📏 SPACING</div>
        <div class="dw-editor-group">
          <label>Padding (px)</label>
          <input type="number" id="dw-prop-padding">
        </div>
        <div class="dw-editor-group">
          <label>Margin (px)</label>
          <input type="number" id="dw-prop-margin">
        </div>
        
        <!-- DIMENSIONS -->
        <div class="dw-section-header">📐 DIMENSIONS</div>
        <div class="dw-editor-group">
          <label>Width (px)</label>
          <input type="text" id="dw-prop-width" placeholder="auto">
        </div>
        <div class="dw-editor-group">
          <label>Height (px)</label>
          <input type="text" id="dw-prop-height" placeholder="auto">
        </div>
        
        <!-- BORDER -->
        <div class="dw-section-header">🔲 BORDER</div>
        <div class="dw-editor-group">
          <label>Border Width (px)</label>
          <input type="number" id="dw-prop-borderwidth" min="0">
        </div>
        <div class="dw-editor-group">
          <label>Border Radius (px)</label>
          <input type="number" id="dw-prop-borderradius" min="0">
        </div>
        <div class="dw-editor-group">
          <label>Border Color</label>
          <input type="color" id="dw-prop-bordercolor">
        </div>
        
        <!-- ACTIONS -->
        <div class="dw-section-header">⚡ ACTIONS</div>
        <button class="dw-action-btn" id="dw-copy-style">🎨 Copy Style</button>
        <button class="dw-action-btn" id="dw-paste-style" style="display:none;">📋 Paste Style</button>
        <button class="dw-action-btn" id="dw-duplicate">📑 Duplicate</button>
        <button class="dw-action-btn" id="dw-lock">🔒 Lock</button>
        <button class="dw-action-btn" id="dw-delete" style="background:#d32f2f;">🗑️ Delete</button>
        <button class="dw-action-btn" id="dw-copy-html" style="background:#ff9800;">📋 Copy HTML</button>
        
        <!-- Z-INDEX CONTROLS -->
        <div class="dw-section-header">📚 ARRANGE (LAYERING)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
          <button class="dw-action-btn-sm" id="dw-to-front">⬆️ Front</button>
          <button class="dw-action-btn-sm" id="dw-forward">↑ Forward</button>
          <button class="dw-action-btn-sm" id="dw-backward">↓ Backward</button>
          <button class="dw-action-btn-sm" id="dw-to-back">⬇️ Back</button>
        </div>
      </div>
      
      <div id="dw-empty-msg" class="dw-empty-state">
        Click any element on the page to edit it
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #dev-wand-editor-panel {
        position: fixed;
        top: 60px;
        right: 20px;
        width: 320px;
        max-height: 80vh;
        background: #040608;
        border: 2px solid #444;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        z-index: 999998;
        font-family: 'Segoe UI', sans-serif;
        color: #eee;
        overflow-y: auto;
      }
      
      .dw-panel-header {
        background: #2b2b2b;
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #444;
        font-weight: bold;
        font-size: 14px;
      }
      
      #dw-close-editor {
        background: #d32f2f;
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
      }
      
      #dw-close-editor:hover {
        background: #f44336;
      }
      
      #dw-editor-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .dw-section-header {
        background: #2b2b2b;
        color: #ff9800;
        padding: 8px 10px;
        font-size: 11px;
        font-weight: bold;
        border-radius: 4px;
        margin-top: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .dw-editor-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .dw-editor-group label {
        font-size: 10px;
        color: #aaa;
        text-transform: uppercase;
        font-weight: bold;
      }
      
      .dw-editor-group input,
      .dw-editor-group select {
        background: #2b2b2b;
        border: 1px solid #444;
        color: white;
        padding: 6px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .dw-editor-group input:focus,
      .dw-editor-group select:focus {
        outline: none;
        border-color: #ff9800;
      }
      
      .dw-action-btn {
        background: #9c27b0;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        font-size: 12px;
        margin-top: 5px;
      }
      
      .dw-action-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .dw-action-btn-sm {
        background: #1976d2;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }
      
      .dw-action-btn-sm:hover {
        background: #2196f3;
      }
      
      .dw-empty-state {
        padding: 40px 20px;
        text-align: center;
        color: #666;
        font-style: italic;
        font-size: 13px;
      }
      
      /* Inspector styles */
      .dw-active-inspect {
        outline: 3px solid #ff9800 !important;
        outline-offset: -3px;
      }
      
      .dw-locked-element {
        outline: 2px dashed #ff5722 !important;
        outline-offset: -2px;
      }
      
      .dw-locked-element::before {
        content: '🔒';
        position: absolute;
        top: 2px;
        right: 2px;
        background: #ff5722;
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 2px;
        z-index: 10000;
        pointer-events: none;
      }
      
      body.dw-editor-active *:hover {
        outline: 2px dashed #ff9800 !important;
        cursor: pointer;
      }
      
      /* Notification */
      .dw-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2e7d32;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000000;
        font-size: 14px;
        animation: slideDown 0.3s ease;
      }
      
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); }
        to { transform: translateX(-50%) translateY(0); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(editorPanel);
    
    // Setup event listeners
    setupEditorListeners();
  }

  // Inject inspector styles
  function injectInspectorStyles() {
    const style = document.createElement('style');
    style.id = 'dw-inspector-styles';
    style.textContent = `
      * { transition: outline 0.1s; }
    `;
    document.head.appendChild(style);
    
    // Add class to body to enable hover effects
    document.body.classList.add('dw-editor-active');
  }

  // Attach inspector click events
  function attachInspectorEvents() {
    document.addEventListener('click', handleElementClick, true);
    document.addEventListener('dblclick', handleElementDoubleClick, true);
  }

  // Handle element click
  function handleElementClick(e) {
    if (!visualEditorActive) return;
    
    // Ignore clicks on editor panel
    if (e.target.closest('#dev-wand-editor-panel') || e.target.closest('#dev-wand-floating-btn') || e.target.closest('#dev-wand-visual-editor-btn')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const clickedElement = e.target;
    
    // Deselect previous
    if (selectedElement) {
      selectedElement.classList.remove('dw-active-inspect');
    }
    
    // Select new
    selectedElement = clickedElement;
    selectedElement.classList.add('dw-active-inspect');
    
    showEditor(selectedElement);
  }

  // Handle double-click to copy HTML
  function handleElementDoubleClick(e) {
    if (!visualEditorActive) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    element.classList.remove('dw-active-inspect');
    const code = element.outerHTML;
    element.classList.add('dw-active-inspect');
    
    navigator.clipboard.writeText(code).then(() => {
      showNotification('📋 HTML Copied!');
    });
  }

  // Show editor with element properties
  function showEditor(el) {
    document.getElementById('dw-empty-msg').style.display = 'none';
    document.getElementById('dw-editor-content').style.display = 'flex';
    
    const style = window.getComputedStyle(el);
    
    document.getElementById('dw-prop-text').value = el.innerText || '';
    document.getElementById('dw-prop-fontsize').value = parseInt(style.fontSize);
    document.getElementById('dw-prop-fontweight').value = style.fontWeight;
    document.getElementById('dw-prop-color').value = rgbToHex(style.color);
    document.getElementById('dw-prop-bg').value = rgbToHex(style.backgroundColor);
    document.getElementById('dw-prop-padding').value = parseInt(style.padding) || 0;
    document.getElementById('dw-prop-margin').value = parseInt(style.margin) || 0;
    document.getElementById('dw-prop-width').value = style.width === 'auto' ? 'auto' : parseInt(style.width);
    document.getElementById('dw-prop-height').value = style.height === 'auto' ? 'auto' : parseInt(style.height);
    document.getElementById('dw-prop-borderwidth').value = parseInt(style.borderWidth) || 0;
    document.getElementById('dw-prop-borderradius').value = parseInt(style.borderRadius) || 0;
    document.getElementById('dw-prop-bordercolor').value = rgbToHex(style.borderColor);
    
    // Update lock button
    updateLockButton();
  }

  // Setup editor listeners
  function setupEditorListeners() {
    // Close button
    document.getElementById('dw-close-editor').addEventListener('click', deactivateVisualEditor);
    
    // Live style updates
    const styleUpdaters = {
      'dw-prop-text': (el, val) => { if(el && !isLocked(el)) el.innerText = val; },
      'dw-prop-fontsize': (el, val) => { if(el && !isLocked(el)) el.style.fontSize = val + 'px'; },
      'dw-prop-fontweight': (el, val) => { if(el && !isLocked(el)) el.style.fontWeight = val; },
      'dw-prop-color': (el, val) => { if(el && !isLocked(el)) el.style.color = val; },
      'dw-prop-bg': (el, val) => { if(el && !isLocked(el)) el.style.backgroundColor = val; },
      'dw-prop-padding': (el, val) => { if(el && !isLocked(el)) el.style.padding = val + 'px'; },
      'dw-prop-margin': (el, val) => { if(el && !isLocked(el)) el.style.margin = val + 'px'; },
      'dw-prop-width': (el, val) => { if(el && !isLocked(el)) el.style.width = val === 'auto' ? 'auto' : val + 'px'; },
      'dw-prop-height': (el, val) => { if(el && !isLocked(el)) el.style.height = val === 'auto' ? 'auto' : val + 'px'; },
      'dw-prop-borderwidth': (el, val) => { if(el && !isLocked(el)) el.style.borderWidth = val + 'px'; },
      'dw-prop-borderradius': (el, val) => { if(el && !isLocked(el)) el.style.borderRadius = val + 'px'; },
      'dw-prop-bordercolor': (el, val) => { if(el && !isLocked(el)) el.style.borderColor = val; }
    };
    
    Object.keys(styleUpdaters).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', (e) => {
          if (selectedElement) {
            styleUpdaters[id](selectedElement, e.target.value);
          }
        });
      }
    });
    
    // Action buttons
    document.getElementById('dw-copy-style').addEventListener('click', copyStyle);
    document.getElementById('dw-paste-style').addEventListener('click', pasteStyle);
    document.getElementById('dw-duplicate').addEventListener('click', duplicateElement);
    document.getElementById('dw-lock').addEventListener('click', toggleLock);
    document.getElementById('dw-delete').addEventListener('click', deleteElement);
    document.getElementById('dw-copy-html').addEventListener('click', copyHTML);
    
    // Z-index controls
    document.getElementById('dw-to-front').addEventListener('click', () => bringToFront());
    document.getElementById('dw-forward').addEventListener('click', () => bringForward());
    document.getElementById('dw-backward').addEventListener('click', () => sendBackward());
    document.getElementById('dw-to-back').addEventListener('click', () => sendToBack());
  }

  // Action functions
  function copyStyle() {
    if (!selectedElement) return;
    
    const style = window.getComputedStyle(selectedElement);
    copiedStyles = {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      padding: style.padding,
      margin: style.margin,
      borderWidth: style.borderWidth,
      borderRadius: style.borderRadius,
      borderColor: style.borderColor
    };
    
    document.getElementById('dw-paste-style').style.display = 'block';
    showNotification('🎨 Style Copied!');
  }

  function pasteStyle() {
    if (!selectedElement || !copiedStyles) return;
    if (isLocked(selectedElement)) {
      showNotification('🔒 Element is locked!');
      return;
    }
    
    Object.keys(copiedStyles).forEach(prop => {
      selectedElement.style[prop] = copiedStyles[prop];
    });
    
    showEditor(selectedElement);
    showNotification('📋 Style Pasted!');
  }

  function duplicateElement() {
    if (!selectedElement) return;
    
    const clone = selectedElement.cloneNode(true);
    clone.classList.remove('dw-active-inspect', 'dw-locked-element');
    selectedElement.parentNode.insertBefore(clone, selectedElement.nextSibling);
    
    selectedElement.classList.remove('dw-active-inspect');
    selectedElement = clone;
    selectedElement.classList.add('dw-active-inspect');
    
    showEditor(selectedElement);
    showNotification('📑 Element Duplicated!');
  }

  function toggleLock() {
    if (!selectedElement) return;
    
    const isLocked = lockedElements.has(selectedElement);
    
    if (isLocked) {
      lockedElements.delete(selectedElement);
      selectedElement.classList.remove('dw-locked-element');
      showNotification('🔓 Element Unlocked!');
    } else {
      lockedElements.add(selectedElement);
      selectedElement.classList.add('dw-locked-element');
      showNotification('🔒 Element Locked!');
    }
    
    updateLockButton();
  }

  function deleteElement() {
    if (!selectedElement) return;
    if (isLocked(selectedElement)) {
      showNotification('🔒 Cannot delete locked element!');
      return;
    }
    
    if (confirm('Delete this element?')) {
      lockedElements.delete(selectedElement);
      selectedElement.remove();
      selectedElement = null;
      document.getElementById('dw-editor-content').style.display = 'none';
      document.getElementById('dw-empty-msg').style.display = 'block';
      showNotification('🗑️ Element Deleted!');
    }
  }

  function copyHTML() {
    if (!selectedElement) return;
    
    selectedElement.classList.remove('dw-active-inspect');
    const code = selectedElement.outerHTML;
    selectedElement.classList.add('dw-active-inspect');
    
    navigator.clipboard.writeText(code).then(() => {
      showNotification('📋 HTML Copied!');
    });
  }

  // Z-index functions
  function bringToFront() {
    if (!selectedElement) return;
    const siblings = Array.from(selectedElement.parentElement.children);
    let maxZ = 0;
    siblings.forEach(el => {
      const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });
    selectedElement.style.zIndex = maxZ + 1;
    showNotification('⬆️ Brought to Front!');
  }

  function bringForward() {
    if (!selectedElement) return;
    const currentZ = parseInt(selectedElement.style.zIndex) || 0;
    selectedElement.style.zIndex = currentZ + 1;
    showNotification('↑ Brought Forward!');
  }

  function sendBackward() {
    if (!selectedElement) return;
    const currentZ = parseInt(selectedElement.style.zIndex) || 0;
    selectedElement.style.zIndex = currentZ - 1;
    showNotification('↓ Sent Backward!');
  }

  function sendToBack() {
    if (!selectedElement) return;
    const siblings = Array.from(selectedElement.parentElement.children);
    let minZ = 0;
    siblings.forEach(el => {
      const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
      if (z < minZ) minZ = z;
    });
    selectedElement.style.zIndex = minZ - 1;
    showNotification('⬇️ Sent to Back!');
  }

  // Helper functions
  function isLocked(el) {
    return lockedElements.has(el);
  }

  function updateLockButton() {
    if (!selectedElement) return;
    const btn = document.getElementById('dw-lock');
    if (isLocked(selectedElement)) {
      btn.textContent = '🔓 Unlock';
      btn.style.background = '#4caf50';
    } else {
      btn.textContent = '🔒 Lock';
      btn.style.background = '#ff5722';
    }
  }

  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
    const res = rgb.match(/\d+/g);
    return res ? "#" + res.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#ffffff';
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'dw-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Deactivate visual editor
  function deactivateVisualEditor() {
    visualEditorActive = false;
    
    // Remove panel
    if (editorPanel) {
      editorPanel.remove();
      editorPanel = null;
    }
    
    // Remove styles
    const inspectorStyles = document.getElementById('dw-inspector-styles');
    if (inspectorStyles) inspectorStyles.remove();
    
    // Remove body class
    document.body.classList.remove('dw-editor-active');
    
    // Remove event listeners
    document.removeEventListener('click', handleElementClick, true);
    document.removeEventListener('dblclick', handleElementDoubleClick, true);
    
    // Clear selection
    if (selectedElement) {
      selectedElement.classList.remove('dw-active-inspect');
      selectedElement = null;
    }
    
    // Clear locked elements visual
    lockedElements.forEach(el => {
      el.classList.remove('dw-locked-element');
    });
    
    showNotification('👋 Visual Editor Deactivated');
  }

  // Export for use in content script
  window.devWandVisualEditor = {
    init: initVisualEditor,
    deactivate: deactivateVisualEditor,
    isActive: () => visualEditorActive
  };
})();
