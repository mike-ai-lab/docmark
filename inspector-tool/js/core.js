// Core State Management & Global Variables

// DOM Elements
let viewer, editorUI, emptyMsg, selectedElement;

// State Variables
let lastLoadedHTML = null;
let lastLoadedFilePath = null;
let loadedCSSFiles = [];
let copiedStyles = null;
let styleClipboardHistory = [];
let batchPastedElements = [];
let arrangedElements = [];
let selectedElements = [];
let lockedElements = new Set();
let groups = new Map();

// Mode Flags
let batchPasteMode = false;
let arrangeMode = false;
let multiSelectMode = false;
let isDragging = false;
let isDragSelecting = false;

// Mode Targets
let arrangeTargetElement = null;
let draggedElement = null;
let dragSelectBox = null;

// Constants
const MAX_CLIPBOARD_HISTORY = 10;
const MAX_HISTORY = 50;
const DRAG_THRESHOLD = 5;

// Counters
let groupIdCounter = 0;

// Drag State
let dragOffset = { x: 0, y: 0 };
let dragStartPos = { x: 0, y: 0 };
let dragSelectStart = { x: 0, y: 0 };
let hasMoved = false;

// Initialize DOM references
function initDOMReferences() {
    viewer = document.getElementById('viewer');
    editorUI = document.getElementById('editorUI');
    emptyMsg = document.getElementById('emptyMsg');
}

// Export state for other modules
window.InspectorState = {
    // Getters
    getViewer: () => viewer,
    getEditorUI: () => editorUI,
    getEmptyMsg: () => emptyMsg,
    getSelectedElement: () => selectedElement,
    getLastLoadedHTML: () => lastLoadedHTML,
    getLoadedCSSFiles: () => loadedCSSFiles,
    getCopiedStyles: () => copiedStyles,
    getClipboardHistory: () => styleClipboardHistory,
    getBatchPastedElements: () => batchPastedElements,
    getArrangedElements: () => arrangedElements,
    getSelectedElements: () => selectedElements,
    getLockedElements: () => lockedElements,
    getGroups: () => groups,
    
    // Mode flags
    isBatchPasteMode: () => batchPasteMode,
    isArrangeMode: () => arrangeMode,
    isMultiSelectMode: () => multiSelectMode,
    isDragging: () => isDragging,
    isDragSelecting: () => isDragSelecting,
    
    // Mode targets
    getArrangeTargetElement: () => arrangeTargetElement,
    getDraggedElement: () => draggedElement,
    getDragSelectBox: () => dragSelectBox,
    
    // Drag state
    getDragOffset: () => dragOffset,
    getDragStartPos: () => dragStartPos,
    getDragSelectStart: () => dragSelectStart,
    getHasMoved: () => hasMoved,
    
    // Counters
    getGroupIdCounter: () => groupIdCounter,
    incrementGroupIdCounter: () => ++groupIdCounter,
    
    // Setters
    setSelectedElement: (el) => { selectedElement = el; },
    setLastLoadedHTML: (html) => { lastLoadedHTML = html; },
    setLoadedCSSFiles: (files) => { loadedCSSFiles = files; },
    setCopiedStyles: (styles) => { copiedStyles = styles; },
    setClipboardHistory: (history) => { styleClipboardHistory = history; },
    setBatchPastedElements: (elements) => { batchPastedElements = elements; },
    setArrangedElements: (elements) => { arrangedElements = elements; },
    setSelectedElements: (elements) => { selectedElements = elements; },
    
    // Mode setters
    setBatchPasteMode: (mode) => { batchPasteMode = mode; },
    setArrangeMode: (mode) => { arrangeMode = mode; },
    setMultiSelectMode: (mode) => { multiSelectMode = mode; },
    setIsDragging: (dragging) => { isDragging = dragging; },
    setIsDragSelecting: (selecting) => { isDragSelecting = selecting; },
    
    // Mode target setters
    setArrangeTargetElement: (el) => { arrangeTargetElement = el; },
    setDraggedElement: (el) => { draggedElement = el; },
    setDragSelectBox: (box) => { dragSelectBox = box; },
    
    // Drag state setters
    setDragOffset: (offset) => { dragOffset = offset; },
    setDragStartPos: (pos) => { dragStartPos = pos; },
    setDragSelectStart: (pos) => { dragSelectStart = pos; },
    setHasMoved: (moved) => { hasMoved = moved; },
    
    // Constants
    MAX_CLIPBOARD_HISTORY,
    MAX_HISTORY,
    DRAG_THRESHOLD,
    
    // Initialize
    init: initDOMReferences
};
