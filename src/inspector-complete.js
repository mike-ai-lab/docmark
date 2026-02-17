// COMPLETE HTML Inspector
let selectedElement = null;
let targetDocument = null;
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let isDragging = false;
let dragStartPos = { x: 0, y: 0 };
let hasMoved = false;
const DRAG_THRESHOLD = 5;
let lockedElements = new Set();
let copiedStyles = null;
export function initInspector(doc) {
    if (!doc) return;
    targetDocument = doc;
    const oldStyle = doc.querySelector('style[data-inspector=\"true\"]');
    if (oldStyle) oldStyle.remove();
    const style = doc.createElement('style');
    style.setAttribute('data-inspector', 'true');
    style.textContent = '* { transition: outline 0.1s; } *.active-inspect { outline: 3px solid #ff9800 !important; outline-offset: -3px; } *.locked-element { outline: 2px dashed #ff5722 !important; } .dragging { opacity: 0.8; cursor: move !important; } *:hover { outline: 2px dashed #ff9800 !important; cursor: pointer; }';
    doc.head.appendChild(style);
    const oldBody = doc.body;
    const newBody = oldBody.cloneNode(true);
    oldBody.parentNode.replaceChild(newBody, oldBody);
    newBody.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const clickedElement = e.target;
        if (['HTML', 'BODY', 'SCRIPT', 'STYLE'].includes(clickedElement.tagName)) return;
        if(selectedElement) selectedElement.classList.remove('active-inspect');
        selectedElement = clickedElement;
        selectedElement.classList.add('active-inspect');
        showEditor(selectedElement);
    }, true);
    enableDragDrop(doc);
}
function enableDragDrop(doc) {
    doc.body.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        const element = e.target;
        if (isElementLocked(element)) return;
        if (['BODY', 'HTML', 'SCRIPT', 'STYLE'].includes(element.tagName)) return;
        draggedElement = element;
        dragStartPos.x = e.clientX;
        dragStartPos.y = e.clientY;
        hasMoved = false;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    });
    doc.body.addEventListener('mousemove', (e) => {
        if (!draggedElement) return;
        const deltaX = Math.abs(e.clientX - dragStartPos.x);
        const deltaY = Math.abs(e.clientY - dragStartPos.y);
        if (!isDragging && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD)) {
            isDragging = true;
            hasMoved = true;
            const computed = window.getComputedStyle(draggedElement);
            if (computed.position === 'static' || computed.position === 'relative') {
                const rect = draggedElement.getBoundingClientRect();
                const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
                const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
                draggedElement.style.position = 'absolute';
                draggedElement.style.left = (rect.left + scrollX) + 'px';
                draggedElement.style.top = (rect.top + scrollY) + 'px';
                draggedElement.style.width = rect.width + 'px';
                draggedElement.style.height = rect.height + 'px';
                draggedElement.style.margin = '0';
            }
            draggedElement.classList.add('dragging');
            draggedElement.style.cursor = 'move';
            draggedElement.style.zIndex = '9999';
        }
        if (!isDragging) return;
        e.preventDefault();
        const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
        const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
        const newLeft = e.clientX - dragOffset.x + scrollX;
        const newTop = e.clientY - dragOffset.y + scrollY;
        draggedElement.style.left = newLeft + 'px';
        draggedElement.style.top = newTop + 'px';
    });
    doc.body.addEventListener('mouseup', (e) => {
        if (!draggedElement) return;
        if (!hasMoved) {
            draggedElement = null;
            isDragging = false;
            return;
        }
        if (isDragging) {
            isDragging = false;
            draggedElement.classList.remove('dragging');
            draggedElement.style.cursor = '';
        }
        draggedElement = null;
    });
}
function showEditor(el) {
    const emptyMsg = document.getElementById('inspector-empty');
    const editorUI = document.getElementById('inspector-editor');
    if (!emptyMsg || !editorUI) return;
    emptyMsg.style.display = 'none';
    editorUI.style.display = 'block';
    const style = window.getComputedStyle(el);
    setValue('inspector-tag', el.tagName.toLowerCase());
    setValue('inspector-text', el.innerText || '');
    setValue('inspector-font-family', style.fontFamily);
    setValue('inspector-font-size', parseInt(style.fontSize));
    setValue('inspector-font-weight', style.fontWeight);
    setValue('inspector-text-align', style.textAlign);
    setValue('inspector-color', rgbToHex(style.color));
    setValue('inspector-bg-color', rgbToHex(style.backgroundColor));
    setValue('inspector-padding', parseInt(style.padding) || 0);
    setValue('inspector-margin', parseInt(style.margin) || 0);
    setValue('inspector-width', style.width === 'auto' ? 'auto' : parseInt(style.width));
    setValue('inspector-height', style.height === 'auto' ? 'auto' : parseInt(style.height));
    setValue('inspector-display', style.display);
    setValue('inspector-border-width', parseInt(style.borderWidth) || 0);
    setValue('inspector-border-style', style.borderStyle);
    setValue('inspector-border-color', rgbToHex(style.borderColor));
    setValue('inspector-border-radius', parseInt(style.borderRadius) || 0);
    updateLockButton();
}
function setValue(id, value) {
    const input = document.getElementById(id);
    if (input) input.value = value;
}
function isElementLocked(element) {
    return lockedElements.has(element) || element.hasAttribute('data-locked');
}
function updateLockButton() {
    const btn = document.getElementById('inspector-lock-btn');
    if (!btn || !selectedElement) return;
    const isLocked = isElementLocked(selectedElement);
    btn.textContent = isLocked ? 'Unlock Element' : 'Lock Element';
}
function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
    const res = rgb.match(/\d+/g);
    return res ? '#' + res.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#ffffff';
}
export function initializeInspector() {
    setupInputListeners();
    setupLockButton();
    setupCopyPasteButtons();
    setupArrangeButtons();
}
export function setupInputListeners() {
    const styleUpdaters = {
        'inspector-text': (el, val) => { if(el && !isElementLocked(el)) el.innerText = val; },
        'inspector-font-family': (el, val) => { if(el && !isElementLocked(el)) el.style.fontFamily = val; },
        'inspector-font-size': (el, val) => { if(el && !isElementLocked(el)) el.style.fontSize = val + 'px'; },
        'inspector-font-weight': (el, val) => { if(el && !isElementLocked(el)) el.style.fontWeight = val; },
        'inspector-color': (el, val) => { if(el && !isElementLocked(el)) el.style.color = val; },
        'inspector-bg-color': (el, val) => { if(el && !isElementLocked(el)) el.style.backgroundColor = val; },
        'inspector-padding': (el, val) => { if(el && !isElementLocked(el)) el.style.padding = val + 'px'; },
        'inspector-margin': (el, val) => { if(el && !isElementLocked(el)) el.style.margin = val + 'px'; },
        'inspector-width': (el, val) => { if(el && !isElementLocked(el)) el.style.width = val === 'auto' ? 'auto' : val + 'px'; },
        'inspector-height': (el, val) => { if(el && !isElementLocked(el)) el.style.height = val === 'auto' ? 'auto' : val + 'px'; },
        'inspector-border-width': (el, val) => { if(el && !isElementLocked(el)) el.style.borderWidth = val + 'px'; },
        'inspector-border-style': (el, val) => { if(el && !isElementLocked(el)) el.style.borderStyle = val; },
        'inspector-border-color': (el, val) => { if(el && !isElementLocked(el)) el.style.borderColor = val; },
        'inspector-border-radius': (el, val) => { if(el && !isElementLocked(el)) el.style.borderRadius = val + 'px'; },
        'inspector-text-align': (el, val) => { if(el && !isElementLocked(el)) el.style.textAlign = val; },
        'inspector-display': (el, val) => { if(el && !isElementLocked(el)) el.style.display = val; }
    };
    Object.keys(styleUpdaters).forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', (e) => {
            if(!selectedElement) return;
            styleUpdaters[id](selectedElement, e.target.value);
        });
    });
}
export function setupLockButton() {
    const btn = document.getElementById('inspector-lock-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (!selectedElement) return;
        const isLocked = lockedElements.has(selectedElement);
        if (isLocked) {
            lockedElements.delete(selectedElement);
            selectedElement.classList.remove('locked-element');
            selectedElement.removeAttribute('data-locked');
            btn.textContent = 'Lock Element';
        } else {
            lockedElements.add(selectedElement);
            selectedElement.classList.add('locked-element');
            selectedElement.setAttribute('data-locked', 'true');
            btn.textContent = 'Unlock Element';
        }
    });
}
export function setupCopyPasteButtons() {
    const copyBtn = document.getElementById('inspector-copy-style-btn');
    const pasteBtn = document.getElementById('inspector-paste-style-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!selectedElement) return;
            const style = window.getComputedStyle(selectedElement);
            copiedStyles = {
                color: style.color,
                backgroundColor: style.backgroundColor,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                padding: style.padding,
                margin: style.margin,
                width: style.width,
                height: style.height,
                display: style.display,
                borderWidth: style.borderWidth,
                borderStyle: style.borderStyle,
                borderColor: style.borderColor,
                borderRadius: style.borderRadius
            };
            if (pasteBtn) pasteBtn.style.display = 'block';
        });
    }
    if (pasteBtn) {
        pasteBtn.addEventListener('click', () => {
            if (!selectedElement || !copiedStyles) return;
            if (isElementLocked(selectedElement)) return;
            Object.keys(copiedStyles).forEach(prop => {
                selectedElement.style[prop] = copiedStyles[prop];
            });
            showEditor(selectedElement);
        });
    }
}
export function setupArrangeButtons() {
    setupButton('inspector-bring-front-btn', () => {
        if (!selectedElement) return;
        const maxZ = getMaxZIndex();
        selectedElement.style.zIndex = maxZ + 1;
    });
    setupButton('inspector-send-back-btn', () => {
        if (!selectedElement) return;
        const minZ = getMinZIndex();
        selectedElement.style.zIndex = minZ - 1;
    });
    setupButton('inspector-bring-forward-btn', () => {
        if (!selectedElement) return;
        const currentZ = parseInt(selectedElement.style.zIndex || 0);
        selectedElement.style.zIndex = currentZ + 1;
    });
    setupButton('inspector-send-backward-btn', () => {
        if (!selectedElement) return;
        const currentZ = parseInt(selectedElement.style.zIndex || 0);
        selectedElement.style.zIndex = currentZ - 1;
    });
}
function setupButton(id, callback) {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', callback);
}
function getMaxZIndex() {
    if (!targetDocument) return 0;
    let maxZ = 0;
    targetDocument.querySelectorAll('*').forEach(el => {
        const z = parseInt(el.style.zIndex || 0);
        if (z > maxZ) maxZ = z;
    });
    return maxZ;
}
function getMinZIndex() {
    if (!targetDocument) return 0;
    let minZ = 0;
    targetDocument.querySelectorAll('*').forEach(el => {
        const z = parseInt(el.style.zIndex || 0);
        if (z < minZ) minZ = z;
    });
    return minZ;
}
function updateMultiSelectCounter() {}
function updateGroupButtons() {}
