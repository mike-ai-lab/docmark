/**
 * INSPECTOR ACTIONS - USAGE EXAMPLE
 * This file demonstrates how to integrate the InspectorActions class into your app
 */

// ===== STEP 1: INITIALIZE =====

const inspector = new InspectorActions({
    maxHistory: 50,
    maxClipboardHistory: 10,
    dragThreshold: 5,
    
    // Callback for state changes (undo/redo)
    onStateChange: (action, index, total) => {
        console.log(`History: ${action} - ${index}/${total}`);
        updateUndoRedoButtons(inspector.canUndo(), inspector.canRedo());
    },
    
    // Callback for user feedback
    onFeedback: (message, type) => {
        showNotification(message, type);
    }
});

// ===== STEP 2: WIRE UP YOUR UI BUTTONS =====

// Get the iframe document (or your main document)
const iframe = document.getElementById('viewer');
const doc = iframe.contentWindow.document;

// Arrange buttons
document.getElementById('bringToFrontBtn').addEventListener('click', () => {
    inspector.bringToFront(inspector.selectedElement, doc);
});

document.getElementById('bringForwardBtn').addEventListener('click', () => {
    inspector.bringForward(inspector.selectedElement, doc);
});

document.getElementById('sendBackwardBtn').addEventListener('click', () => {
    inspector.sendBackward(inspector.selectedElement, doc);
});

document.getElementById('sendToBackBtn').addEventListener('click', () => {
    inspector.sendToBack(inspector.selectedElement, doc);
});

document.getElementById('bringAboveElementBtn').addEventListener('click', () => {
    inspector.startArrangeMode(inspector.selectedElement);
    showArrangeBanner();
});

// Lock button
document.getElementById('lockBtn').addEventListener('click', () => {
    const isLocked = inspector.toggleLock(inspector.selectedElement);
    updateLockButton(isLocked);
});

// Multi-select button
document.getElementById('multiSelectBtn').addEventListener('click', () => {
    inspector.startMultiSelectMode();
    showMultiSelectBanner();
});

// Copy style button
document.getElementById('copyStyleBtn').addEventListener('click', () => {
    // Show modal to select categories
    showCopyStyleModal((selectedCategories) => {
        inspector.copyStyle(inspector.selectedElement, selectedCategories);
    });
});

// Paste style button
document.getElementById('pasteStyleBtn').addEventListener('click', () => {
    // Show modal to select which categories to paste
    showPasteStyleModal((selectedCategories) => {
        inspector.pasteStyle(inspector.selectedElement, selectedCategories, doc);
    });
});

// Batch paste button
document.getElementById('batchPasteBtn').addEventListener('click', () => {
    inspector.startBatchPasteMode();
    showBatchPasteBanner();
});

// Group buttons
document.getElementById('groupBtn').addEventListener('click', () => {
    inspector.groupSelectedElements(doc);
});

document.getElementById('ungroupBtn').addEventListener('click', () => {
    inspector.ungroupElement(inspector.selectedElement, doc);
});

// Delete button
document.getElementById('deleteBtn').addEventListener('click', () => {
    if (confirm('Delete this element?')) {
        inspector.deleteElement(inspector.selectedElement, doc);
    }
});

// Copy HTML button
document.getElementById('copyBtn').addEventListener('click', () => {
    const html = inspector.copyHTML(inspector.selectedElement);
    navigator.clipboard.writeText(html).then(() => {
        showNotification('HTML COPIED!', 'success');
    });
});

// Export button
document.getElementById('exportBtn').addEventListener('click', () => {
    const result = inspector.exportDocument(doc, 'my-design.html');
    downloadFile(result.blob, result.filename);
});

// Undo/Redo buttons
document.getElementById('undoBtn').addEventListener('click', () => {
    inspector.undo(doc);
});

document.getElementById('redoBtn').addEventListener('click', () => {
    inspector.redo(doc);
});

// ===== STEP 3: HANDLE ELEMENT CLICKS =====

doc.body.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clickedElement = e.target;
    
    // Handle multi-select mode
    if (inspector.multiSelectMode) {
        const count = inspector.toggleMultiSelect(clickedElement);
        updateMultiSelectCounter(count);
        return;
    }
    
    // Handle arrange mode
    if (inspector.arrangeMode) {
        inspector.arrangeAboveElement(clickedElement, doc);
        updateArrangeCounter(inspector.arrangedElements.length);
        return;
    }
    
    // Handle batch paste mode
    if (inspector.batchPasteMode) {
        const count = inspector.batchPasteToElement(clickedElement, doc);
        updateBatchPasteCounter(count);
        return;
    }
    
    // Normal selection
    inspector.selectElement(clickedElement);
    showElementEditor(clickedElement);
}, true);

// ===== STEP 4: HANDLE MODE BANNERS =====

// Arrange mode banner
function showArrangeBanner() {
    const banner = document.getElementById('arrangeModeBanner');
    banner.classList.add('active');
    
    document.getElementById('arrangeDoneBtn').onclick = () => {
        inspector.exitArrangeMode(true, doc);
        banner.classList.remove('active');
    };
    
    document.getElementById('arrangeCancelBtn').onclick = () => {
        inspector.cancelArrangeMode();
        banner.classList.remove('active');
    };
    
    document.getElementById('arrangeUndoBtn').onclick = () => {
        inspector.undoLastArrange();
        updateArrangeCounter(inspector.arrangedElements.length);
    };
}

// Batch paste mode banner
function showBatchPasteBanner() {
    const banner = document.getElementById('batchModeBanner');
    banner.classList.add('active');
    
    document.getElementById('batchDoneBtn').onclick = () => {
        inspector.exitBatchPasteMode(true, doc);
        banner.classList.remove('active');
    };
    
    document.getElementById('batchCancelBtn').onclick = () => {
        inspector.cancelBatchPasteMode();
        banner.classList.remove('active');
    };
    
    document.getElementById('batchUndoBtn').onclick = () => {
        inspector.undoLastBatchPaste();
        updateBatchPasteCounter(inspector.batchPastedElements.length);
    };
}

// Multi-select mode banner
function showMultiSelectBanner() {
    const banner = document.getElementById('multiselectModeBanner');
    banner.classList.add('active');
    
    document.getElementById('multiselectCancelBtn').onclick = () => {
        inspector.exitMultiSelectMode();
        banner.classList.remove('active');
    };
    
    document.getElementById('clearSelectionBtn').onclick = () => {
        inspector.clearMultiSelection();
        updateMultiSelectCounter(0);
    };
    
    document.getElementById('distributeBtn').onclick = () => {
        showDistributeModal();
    };
}

// ===== STEP 5: HELPER FUNCTIONS =====

function showNotification(message, type = 'success') {
    const indicator = document.getElementById('copyIndicator');
    indicator.textContent = message;
    indicator.style.background = type === 'error' ? '#d32f2f' : '#2e7d32';
    indicator.style.display = 'block';
    setTimeout(() => {
        indicator.style.display = 'none';
        indicator.style.background = '#2e7d32';
    }, 2000);
}

function updateUndoRedoButtons(canUndo, canRedo) {
    document.getElementById('undoBtn').disabled = !canUndo;
    document.getElementById('redoBtn').disabled = !canRedo;
}

function updateLockButton(isLocked) {
    const btn = document.getElementById('lockBtn');
    btn.textContent = isLocked ? '🔓 UNLOCK ELEMENT' : '🔒 LOCK ELEMENT';
}

function updateMultiSelectCounter(count) {
    document.getElementById('multiselectCounter').textContent = count;
}

function updateArrangeCounter(count) {
    document.getElementById('arrangeCounter').textContent = count;
}

function updateBatchPasteCounter(count) {
    document.getElementById('batchCounter').textContent = count;
}

function showElementEditor(element) {
    const styles = inspector.getElementStyles(element);
    
    // Populate your editor UI with the styles
    document.getElementById('propText').value = styles.text;
    document.getElementById('propFontSize').value = styles.fontSize;
    document.getElementById('propColor').value = styles.color;
    // ... populate other fields
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function showCopyStyleModal(callback) {
    // Show your modal UI
    // When user clicks "Copy Selected", call:
    const selectedCategories = {
        colors: document.getElementById('cat-colors').checked,
        typography: document.getElementById('cat-typography').checked,
        spacing: document.getElementById('cat-spacing').checked,
        dimensions: document.getElementById('cat-dimensions').checked,
        border: document.getElementById('cat-border').checked,
        radius: document.getElementById('cat-radius').checked,
        display: document.getElementById('cat-display').checked
    };
    callback(selectedCategories);
}

function showPasteStyleModal(callback) {
    // Show your modal UI
    // Check compatibility
    const warnings = inspector.checkCompatibility(inspector.selectedElement, inspector.copiedStyles);
    if (warnings.length > 0) {
        displayWarnings(warnings);
    }
    
    // When user clicks "Paste Selected", call:
    const selectedCategories = ['colors', 'typography']; // example
    callback(selectedCategories);
}

function showDistributeModal() {
    // Show your modal UI
    // When user clicks "Apply", call:
    const direction = document.getElementById('distributeDirection').value;
    const gap = parseInt(document.getElementById('distributeGap').value);
    const alignment = document.getElementById('distributeAlign').value;
    
    inspector.distributeElements(direction, gap, alignment, doc);
}

function displayWarnings(warnings) {
    const warningDiv = document.getElementById('compatWarning');
    warningDiv.innerHTML = warnings.join('<br>');
    warningDiv.classList.add('show');
}

// ===== STEP 6: INITIALIZE DRAG & DROP =====

inspector.initDragDrop(doc);

// ===== STEP 7: KEYBOARD SHORTCUTS =====

document.addEventListener('keydown', (e) => {
    // Undo/Redo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        inspector.undo(doc);
    } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        inspector.redo(doc);
    }
    
    // Delete
    if (e.key === 'Delete' && inspector.selectedElement) {
        e.preventDefault();
        if (confirm('Delete this element?')) {
            inspector.deleteElement(inspector.selectedElement, doc);
        }
    }
    
    // Escape to exit modes
    if (e.key === 'Escape') {
        if (inspector.batchPasteMode) {
            inspector.cancelBatchPasteMode();
            document.getElementById('batchModeBanner').classList.remove('active');
        }
        if (inspector.arrangeMode) {
            inspector.cancelArrangeMode();
            document.getElementById('arrangeModeBanner').classList.remove('active');
        }
        if (inspector.multiSelectMode) {
            inspector.exitMultiSelectMode();
            document.getElementById('multiselectModeBanner').classList.remove('active');
        }
    }
});

// ===== STEP 8: CLIPBOARD HISTORY UI =====

function renderClipboardHistory() {
    const history = inspector.getClipboardHistory();
    const historyList = document.getElementById('historyList');
    
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-name">${item.name}</div>
            <div class="history-item-timestamp">${item.timestamp}</div>
            <button onclick="pasteFromHistory(${item.id})">Paste</button>
            <button onclick="deleteFromHistory(${item.id})">Delete</button>
        `;
        historyList.appendChild(div);
    });
}

function pasteFromHistory(id) {
    inspector.pasteFromHistory(id, inspector.selectedElement, doc);
}

function deleteFromHistory(id) {
    inspector.deleteFromHistory(id);
    renderClipboardHistory();
}

// ===== STEP 9: LIVE STYLE UPDATES =====

// When user changes a style input, update the element live
document.getElementById('propFontSize').addEventListener('input', (e) => {
    if (inspector.selectedElement && !inspector.isElementLocked(inspector.selectedElement)) {
        inspector.selectedElement.style.fontSize = e.target.value + 'px';
    }
});

// On change (not input), save state for undo
document.getElementById('propFontSize').addEventListener('change', () => {
    inspector.saveState(doc);
});

// Repeat for all style inputs...

console.log('Inspector Actions initialized and ready!');
