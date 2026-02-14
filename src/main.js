import Storehouse from 'storehouse-js';
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { setupValidationWizard } from './validation-wizard.js';

const init = () => {
    let hasEdited = false;
    let scrollBarSync = false;
    let cursorSync = false;
    let tocEnabled = false;
    
    // Paper layout state (declared early to avoid initialization errors)
    let previewLayout = 'web'; // 'web' or 'paper'
    let paperZoomLevel = 100; // percentage
    let pageSetup = {
        width: 21.0,  // cm
        height: 29.7, // cm
        marginTop: 4.5,
        marginBottom: 2.54,
        marginLeft: 2.54,
        marginRight: 1.47
    };

    // Global drag state - only one resizer can be active at a time
    let activeResizer = null;
    
    // Manual undo history stack (50 steps for better undo/redo)
    let undoHistory = [];
    let undoHistoryIndex = -1;
    const MAX_UNDO_STEPS = 50;
    let isPerformingUndoRedo = false; // Flag to prevent saving during undo/redo

    const localStorageNamespace = 'com.markdownlivepreview';
    const localStorageKey = 'last_state';
    const localStorageScrollBarKey = 'scroll_bar_settings';
    const localStorageCursorSyncKey = 'cursor_sync_settings';
    const localStorageThemeKey = 'theme_settings';
    const localStorageStyleKey = 'style_settings';
    const localStorageFlipPanelsKey = 'flip_panels_settings';
    const localStorageVerticalLayoutKey = 'vertical_layout_settings';
    const localStoragePdfSettingsKey = 'pdf_font_settings';
    const localStorageHelperMessagesKey = 'helper_messages_settings';
    const localStorageTocKey = 'toc_settings';
    const localStorageValidationKey = 'validation_settings';
    const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';
    
    // Editor reference (will be set by setupEditor)
    let editor;
    
    // Status bar update function (defined early so it can be used everywhere)
    const updateStatusBar = () => {
        if (!editor) return; // Guard against early calls
        const content = editor.getValue();
        const lines = content.split('\n');
        
        // Word count
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        document.getElementById('status-word-count').textContent = words;
        
        // Character count
        document.getElementById('status-char-count').textContent = content.length;
        
        // Line count
        document.getElementById('status-line-count').textContent = lines.length;
        
        // Reading time (200 words per minute)
        const readingMinutes = Math.ceil(words / 200);
        document.getElementById('status-reading-time').textContent = readingMinutes + ' min';
        
        // PDF page estimate (500 words per page)
        const pdfPages = Math.max(1, Math.ceil(words / 500));
        document.getElementById('status-pdf-pages').textContent = '~' + pdfPages;
    };
    
    // Manual undo history management
    const saveToUndoHistory = (content) => {
        // Remove any future history if we're not at the end
        if (undoHistoryIndex < undoHistory.length - 1) {
            undoHistory = undoHistory.slice(0, undoHistoryIndex + 1);
        }
        
        // Add new state
        undoHistory.push(content);
        
        // Keep only last MAX_UNDO_STEPS
        if (undoHistory.length > MAX_UNDO_STEPS) {
            undoHistory.shift();
        } else {
            undoHistoryIndex++;
        }
    };
    
    const performUndo = () => {
        if (undoHistoryIndex > 0) {
            isPerformingUndoRedo = true;
            undoHistoryIndex--;
            const previousContent = undoHistory[undoHistoryIndex];
            
            // Use executeEdits to preserve undo stack
            const model = editor.getModel();
            const fullRange = model.getFullModelRange();
            editor.executeEdits('undo-operation', [{
                range: fullRange,
                text: previousContent
            }]);
            
            isPerformingUndoRedo = false;
            showMofuHelper(`Undo successful! (${undoHistoryIndex + 1}/${undoHistory.length} states)`);
            return true;
        } else {
            showMofuHelper('Nothing to undo!');
            return false;
        }
    };
    
    const performRedo = () => {
        if (undoHistoryIndex < undoHistory.length - 1) {
            isPerformingUndoRedo = true;
            undoHistoryIndex++;
            const nextContent = undoHistory[undoHistoryIndex];
            
            // Use executeEdits to preserve undo stack
            const model = editor.getModel();
            const fullRange = model.getFullModelRange();
            editor.executeEdits('redo-operation', [{
                range: fullRange,
                text: nextContent
            }]);
            
            isPerformingUndoRedo = false;
            showMofuHelper(`Redo successful! (${undoHistoryIndex + 1}/${undoHistory.length} states)`);
            return true;
        } else {
            showMofuHelper('Nothing to redo!');
            return false;
        }
    };
    
    // PDF Font Settings - configurable
    let pdfFontSettings = {
        h1: 10,
        h2: 10,
        h3: 10,
        h4: 10,
        paragraph: 8,
        list: 8,
        blockquote: 8,
        code: 8,
        table: 8,
        fontFamily: 'helvetica', // helvetica, times, courier
        tableBorders: 'horizontal', // all, horizontal, none
        tableBorderWeight: 0.15,
        tableBorderColor: '#d0d0d0',
        tableHeaderBg: '#fafafa',
        tableHeaderColor: '#000000'
    };
    // default template
    const defaultInput = `# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/image/Markdown-mark.svg "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

${"`"}${"`"}${"`"}
let message = 'Hello world';
alert(message);
${"`"}${"`"}${"`"}

## Inline code

This web site is using ${"`"}markedjs/marked${"`"}.
`;

    self.MonacoEnvironment = {
        getWorker(_, label) {
            return new Proxy({}, { get: () => () => { } });
        }
    }

    // Define custom themes with specified colors
    monaco.editor.defineTheme('custom-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#f7f7f7',
            'editor.selectionBackground': '#add6ff',
            'editor.lineHighlightBackground': '#f7f7f7'
        }
    });

    monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#1A1A1A',
            'editor.selectionBackground': '#add6ff',
            'editor.lineHighlightBackground': '#1A1A1A'
        }
    });

    let setupEditor = () => {
        editor = monaco.editor.create(document.querySelector('#editor'), {
            fontSize: 14,
            language: 'markdown',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                useShadows: false
            },
            wordWrap: 'on',
            hover: { enabled: true }, // Enable hover for validation messages
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: false,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'off',
            folding: false
        });

        // Register completion provider
        const provider = monaco.languages.registerCompletionItemProvider('markdown', {
            triggerCharacters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            provideCompletionItems: (model, position, context, token) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const textUntilPosition = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column
                        });

                        // Match any word being typed (at least 2 characters)
                        const wordMatch = textUntilPosition.match(/\b(\w{2,})$/);
                        if (!wordMatch) {
                            resolve({ suggestions: [] });
                            return;
                        }

                        const prefix = wordMatch[1];

                        const allText = model.getValue();
                        const words = allText.match(/\b\w{3,}\b/g) || [];
                        const uniqueWords = [...new Set(words)];
                        
                        const matchingWords = uniqueWords
                            .filter(word => 
                                word.toLowerCase().startsWith(prefix.toLowerCase()) && 
                                word.toLowerCase() !== prefix.toLowerCase()
                            )
                            .slice(0, 5);

                        if (matchingWords.length === 0) {
                            resolve({ suggestions: [] });
                            return;
                        }

                        const suggestions = matchingWords.map((word, index) => ({
                            label: word,
                            kind: monaco.languages.CompletionItemKind.Text,
                            insertText: word,
                            range: {
                                startLineNumber: position.lineNumber,
                                startColumn: position.column - prefix.length,
                                endLineNumber: position.lineNumber,
                                endColumn: position.column
                            }
                        }));

                        resolve({ suggestions });
                    }, 50);
                });
            }
        });

        // Manually trigger suggestions on content change
        let lastTriggerTime = 0;
        editor.onDidChangeModelContent(() => {
            let changed = editor.getValue() != defaultInput;
            if (changed) {
                hasEdited = true;
            }
            let value = editor.getValue();
            convert(value);
            saveLastContent(value);
            
            // Update TOC if visible
            if (tocVisible) {
                updateToc();
            }
            
            // Update status bar
            updateStatusBar();
        });

        // Scroll sync is now handled in the consolidated section at the bottom

        // Setup markdown validation (extracted to module)
        setupValidationWizard(editor, monaco, showMofuHelper);
        return editor;
    };

    // Parse YAML front matter (metadata)
    let parseMetadata = (markdown) => {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = markdown.match(frontMatterRegex);
        
        if (!match) return { metadata: null, content: markdown };
        
        const yamlContent = match[1];
        const content = markdown.slice(match[0].length);
        
        // Simple YAML parser for our needs
        const metadata = {};
        const lines = yamlContent.split('\n');
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 1).trim();
                metadata[key] = value;
            }
        });
        
        return { metadata, content };
    };
    
    // ============================================================================
    // PAPER LAYOUT HELPER FUNCTIONS (defined before convert)
    // ============================================================================
    
    // Paginate content into A4 pages
    const paginateToA4 = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = pageSetup.width + 'cm';
        document.body.appendChild(tempDiv);
        
        const content = document.createElement('div');
        content.className = 'markdown-body';
        const contentWidth = pageSetup.width - pageSetup.marginLeft - pageSetup.marginRight;
        content.style.width = contentWidth + 'cm';
        content.style.padding = '0';
        content.style.margin = '0';
        content.innerHTML = html;
        tempDiv.appendChild(content);
        
        // Calculate available content height
        const pageContentHeight = (pageSetup.height - pageSetup.marginTop - pageSetup.marginBottom) * 37.795275591; // cm to px
        const pages = [];
        
        // Get all top-level elements
        const elements = Array.from(content.children);
        let currentPageContent = [];
        let currentHeight = 0;
        
        elements.forEach((el, index) => {
            // Measure element height
            const testDiv = document.createElement('div');
            testDiv.className = 'markdown-body';
            testDiv.style.width = contentWidth + 'cm';
            testDiv.style.padding = '0';
            testDiv.style.margin = '0';
            testDiv.appendChild(el.cloneNode(true));
            tempDiv.innerHTML = '';
            tempDiv.appendChild(testDiv);
            
            const elHeight = testDiv.offsetHeight;
            
            // If adding this element exceeds page height and we have content, start new page
            if (currentHeight + elHeight > pageContentHeight && currentPageContent.length > 0) {
                // Save current page
                const pageDiv = document.createElement('div');
                currentPageContent.forEach(node => pageDiv.appendChild(node));
                pages.push(pageDiv.innerHTML);
                
                // Start new page with current element
                currentPageContent = [el.cloneNode(true)];
                currentHeight = elHeight;
            } else {
                // Add to current page
                currentPageContent.push(el.cloneNode(true));
                currentHeight += elHeight;
            }
        });
        
        // Add remaining content as last page
        if (currentPageContent.length > 0) {
            const pageDiv = document.createElement('div');
            currentPageContent.forEach(node => pageDiv.appendChild(node));
            pages.push(pageDiv.innerHTML);
        }
        
        document.body.removeChild(tempDiv);
        return pages.length ? pages : [html];
    };
    
    // Apply paper layout to current content
    // Apply paper layout - CSS-only, no DOM restructuring
    const applyPaperLayout = () => {
        const outputDiv = document.querySelector('#output');
        if (!outputDiv) return;
        
        // Simply add a class - all styling done via CSS
        outputDiv.classList.add('paper-layout-active');
        
        // Store page setup as CSS variables on the output element
        outputDiv.style.setProperty('--paper-width', pageSetup.width + 'cm');
        outputDiv.style.setProperty('--paper-height', pageSetup.height + 'cm');
        outputDiv.style.setProperty('--paper-margin-top', pageSetup.marginTop + 'cm');
        outputDiv.style.setProperty('--paper-margin-right', pageSetup.marginRight + 'cm');
        outputDiv.style.setProperty('--paper-margin-bottom', pageSetup.marginBottom + 'cm');
        outputDiv.style.setProperty('--paper-margin-left', pageSetup.marginLeft + 'cm');
        
        applyPaperZoom();
    };
    
    // Remove paper layout
    const removePaperLayout = () => {
        const outputDiv = document.querySelector('#output');
        if (!outputDiv) return;
        
        outputDiv.classList.remove('paper-layout-active');
    };
    
    // Apply zoom to paper layout
    const applyPaperZoom = () => {
        const outputDiv = document.querySelector('#output');
        const zoomLabel = document.querySelector('.paper-zoom-label');
        
        if (outputDiv && outputDiv.classList.contains('paper-layout-active')) {
            const scale = paperZoomLevel / 100;
            outputDiv.style.setProperty('--paper-zoom', scale);
        }
        
        if (zoomLabel) {
            zoomLabel.textContent = `${paperZoomLevel}%`;
        }
    };

    // Render markdown text as html with accurate line mapping
    let convert = (markdown) => {
        // Parse metadata first
        const { metadata, content } = parseMetadata(markdown);
        
        // Configure marked with syntax highlighting
        marked.setOptions({
            headerIds: false,
            mangle: false,
            breaks: true,        // Support line breaks like VSCode
            gfm: true,           // GitHub Flavored Markdown
            pedantic: false,     // Don't be overly strict
            smartLists: true,    // Better list handling
            smartypants: false,  // Don't convert quotes/dashes
            highlight: function(code, lang) {
                // Check if highlight.js is available
                if (typeof window.hljs === 'undefined') {
                    console.warn('highlight.js not loaded');
                    return code;
                }
                
                // Use highlight.js for syntax highlighting
                if (lang && window.hljs.getLanguage(lang)) {
                    try {
                        return window.hljs.highlight(code, { language: lang }).value;
                    } catch (e) {
                        console.error('Highlight error:', e);
                        return code;
                    }
                }
                // Auto-detect language if not specified
                try {
                    return window.hljs.highlightAuto(code).value;
                } catch (e) {
                    console.error('Auto-highlight error:', e);
                    return code;
                }
            }
        });
        
        // First, render the HTML
        let html = marked.parse(markdown);
        
        // Configure DOMPurify to allow highlight.js classes
        let sanitized = DOMPurify.sanitize(html, {
            ADD_ATTR: ['class'], // Allow class attributes for syntax highlighting
            ADD_TAGS: ['span']   // Allow span tags for syntax highlighting
        });
        
        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitized;
        
        // Split markdown into lines
        const lines = markdown.split('\n');
        
        // Get all block-level elements
        const elements = Array.from(tempDiv.children);
        
        // Map each element to its source line
        let currentSearchLine = 0;
        
        elements.forEach(element => {
            const tag = element.tagName.toLowerCase();
            let lineNumber = null;
            
            // Get the text content for matching
            const elementText = element.textContent.trim();
            
            // Search for this element in the markdown starting from currentSearchLine
            for (let i = currentSearchLine; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Skip empty lines
                if (!line) continue;
                
                // Match based on element type
                if (tag === 'h1' && line.startsWith('# ') && !line.startsWith('##')) {
                    const headerText = line.substring(2).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'h2' && line.startsWith('## ') && !line.startsWith('###')) {
                    const headerText = line.substring(3).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'h3' && line.startsWith('### ') && !line.startsWith('####')) {
                    const headerText = line.substring(4).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'h4' && line.startsWith('#### ') && !line.startsWith('#####')) {
                    const headerText = line.substring(5).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'h5' && line.startsWith('##### ') && !line.startsWith('######')) {
                    const headerText = line.substring(6).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'h6' && line.startsWith('###### ')) {
                    const headerText = line.substring(7).trim();
                    if (elementText === headerText) {
                        lineNumber = i + 1;
                        currentSearchLine = i + 1;
                        break;
                    }
                } else if (tag === 'ul' && (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('+ '))) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'ol' && /^\d+\.\s/.test(line)) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'blockquote' && line.startsWith('>')) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'pre' && line.startsWith('```')) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'table' && line.includes('|')) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'hr' && (line === '---' || line === '***' || line === '___')) {
                    lineNumber = i + 1;
                    currentSearchLine = i + 1;
                    break;
                } else if (tag === 'p') {
                    // Check if paragraph contains an image
                    const hasImage = element.querySelector('img');
                    if (hasImage) {
                        // Look for image markdown syntax
                        if (line.startsWith('![')) {
                            lineNumber = i + 1;
                            currentSearchLine = i + 1;
                            break;
                        }
                    } else {
                        // For text paragraphs, match the first few words
                        // Remove markdown formatting characters for comparison
                        const cleanElementText = elementText.replace(/[*_`[\]()]/g, '').substring(0, 20).trim();
                        const cleanLineText = line.replace(/[*_`[\]()]/g, '').substring(0, 20).trim();
                        
                        if (cleanLineText && cleanElementText.toLowerCase().startsWith(cleanLineText.toLowerCase())) {
                            lineNumber = i + 1;
                            currentSearchLine = i + 1;
                            break;
                        }
                    }
                }
            }
            
            // Set the line number attribute
            if (lineNumber) {
                element.setAttribute('data-source-line', lineNumber);
            }
        });
        
        // Add metadata-based header and footer if present
        let finalHtml = tempDiv.innerHTML;
        
        if (metadata) {
            // Generate header if metadata exists
            if (metadata.title || metadata.date) {
                const title = metadata.title || 'Document';
                const date = metadata.date || new Date().toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                });
                
                const headerHtml = `<h1>${title}</h1>
<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${date}</div>
<hr>`;
                
                finalHtml = headerHtml + finalHtml;
            }
            
            // Generate footer if metadata exists
            if (metadata['footer-left'] || metadata['footer-right']) {
                const footerLeft = metadata['footer-left'] || '';
                const footerRight = metadata['footer-right'] || '';
                const footerDate = metadata.date || new Date().toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                });
                
                const footerHtml = `<hr class="metadata-footer-separator" style="margin-top: 40px;">
<div class="metadata-footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>${footerLeft}</strong><br>
    <span style="color: #666;">${metadata.title || 'Document'}</span>
  </div>
  <div style="text-align: right;">
    <strong>${footerRight}</strong><br>
    <span style="color: #666;">${footerDate}</span>
  </div>
</div>`;
                
                finalHtml = finalHtml + footerHtml;
            }
        }
        
        // Update the output
        document.querySelector('#output').innerHTML = finalHtml;
        
        // Paper layout is managed by updatePreviewLayout(), not here
        // Just ensure the output element has the right class if paper mode is active
        const outputDiv = document.querySelector('#output');
        if (previewLayout === 'paper' && outputDiv) {
            if (!outputDiv.classList.contains('paper-layout-active')) {
                outputDiv.classList.add('paper-layout-active');
                applyPaperZoom();
            }
        } else if (outputDiv) {
            outputDiv.classList.remove('paper-layout-active');
        }
        
        // Apply edit mode if enabled
        if (editModeEnabled) {
            applyEditMode();
        }
    };

    // Cursor synchronization: highlight preview element based on editor cursor
    let syncCursorToPreview = (lineNumber) => {
        if (!cursorSync) return; // Only sync if enabled
        
        const outputElement = document.querySelector('#output');
        if (!outputElement) return;
        
        // Remove previous highlights
        const previousHighlight = outputElement.querySelector('.cursor-highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('cursor-highlight');
        }
        
        // Find the element that corresponds to this exact line or closest
        const elements = outputElement.querySelectorAll('[data-source-line]');
        let targetElement = null;
        let closestDistance = Infinity;
        const MAX_DISTANCE = 5; // Don't highlight if too far away
        
        elements.forEach(element => {
            const sourceLine = parseInt(element.getAttribute('data-source-line'));
            const distance = Math.abs(sourceLine - lineNumber);
            
            // Prefer exact match, otherwise closest within threshold
            if (sourceLine === lineNumber) {
                targetElement = element;
                closestDistance = 0;
            } else if (distance < closestDistance && distance <= MAX_DISTANCE) {
                closestDistance = distance;
                targetElement = element;
            }
        });
        
        // Only highlight if we found a reasonably close element
        if (targetElement && closestDistance <= MAX_DISTANCE) {
            targetElement.classList.add('cursor-highlight');
            
            // Scroll into view only if not visible
            const rect = targetElement.getBoundingClientRect();
            const previewElement = document.querySelector('#preview');
            if (previewElement) {
                const previewRect = previewElement.getBoundingClientRect();
                const isVisible = rect.top >= previewRect.top && rect.bottom <= previewRect.bottom;
                
                if (!isVisible) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    };

    // Cursor synchronization: move editor cursor based on preview click
    let syncCursorToEditor = (element) => {
        if (!cursorSync) return; // Only sync if enabled
        
        // Find the closest element with data-source-line
        let targetElement = element;
        while (targetElement && !targetElement.hasAttribute('data-source-line')) {
            targetElement = targetElement.parentElement;
            if (targetElement && targetElement.id === 'output') {
                return; // Reached the container without finding a line
            }
        }
        
        if (targetElement && targetElement.hasAttribute('data-source-line')) {
            const lineNumber = parseInt(targetElement.getAttribute('data-source-line'));
            if (editor && lineNumber) {
                // Move cursor to the beginning of the line
                editor.setPosition({ lineNumber: lineNumber, column: 1 });
                editor.revealLineInCenter(lineNumber);
                editor.focus();
                
                // Update highlight
                syncCursorToPreview(lineNumber);
            }
        }
    };
    
    // Make functions accessible for debugging
    window.syncCursorToPreview = syncCursorToPreview;
    window.syncCursorToEditor = syncCursorToEditor;

    // Reset input text
    let reset = () => {
        let changed = editor.getValue() != defaultInput;
        if (hasEdited || changed) {
            var confirmed = window.confirm(confirmationMessage);
            if (!confirmed) {
                return;
            }
        }
        presetValue(defaultInput);
        document.querySelectorAll('.column').forEach((element) => {
            element.scrollTo({ top: 0 });
        });
    };

    // Clear editor content
    let clearEditor = () => {
        // Save current state to undo history before clearing
        saveToUndoHistory(editor.getValue());
        
        editor.setValue('');
        editor.focus();
        hasEdited = false;
        
        showMofuHelper('Editor cleared! Use <strong>Undo</strong> to restore.');
    };

    // Beautify markdown - format and clean up markdown text
    let beautifyMarkdown = () => {
        const originalContent = editor.getValue();
        if (!originalContent || originalContent.trim() === '') return;
        
        const beautifiedContent = performBeautify(originalContent);
        
        // If no changes, notify user
        if (originalContent === beautifiedContent) {
            showMofuHelper('Your markdown is already <strong>beautifully formatted</strong>!');
            return;
        }
        
        // Show inline diff in Monaco editor
        showInlineDiff(originalContent, beautifiedContent);
    };
    
    // Show inline diff view in Monaco editor
    // Helper: Calculate word-level diff for inline highlighting
    const getWordDiff = (oldText, newText) => {
        const oldWords = oldText.split(/(\s+)/);
        const newWords = newText.split(/(\s+)/);
        
        // Simple LCS-based word diff
        const dp = Array(oldWords.length + 1).fill(null).map(() => 
            Array(newWords.length + 1).fill(0)
        );
        
        for (let i = 1; i <= oldWords.length; i++) {
            for (let j = 1; j <= newWords.length; j++) {
                if (oldWords[i-1] === newWords[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        // Backtrack to find diff
        const removed = [];
        const added = [];
        const common = [];
        
        let i = oldWords.length, j = newWords.length;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldWords[i-1] === newWords[j-1]) {
                common.unshift({ type: 'common', text: oldWords[i-1] });
                i--; j--;
            } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
                common.unshift({ type: 'added', text: newWords[j-1] });
                j--;
            } else if (i > 0) {
                common.unshift({ type: 'removed', text: oldWords[i-1] });
                i--;
            }
        }
        
        return common;
    };

    let showInlineDiff = (original, modified) => {
        // Get current theme FIRST (before using colors)
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Theme-aware colors
        const colors = isDark ? {
            bg: '#1e1e1e',
            text: '#e0e0e0',
            border: '#333',
            contextText: '#999',
            addedBg: '#1a3d1a',
            addedText: '#7ee87e',
            removedBg: '#3d1a1a',
            removedText: '#ff7b7b',
            separatorBg: '#2a2a2a',
            separatorText: '#888',
            buttonBg: '#2a2a2a',
            buttonBorder: '#444',
            buttonText: '#e0e0e0'
        } : {
            bg: 'white',
            text: 'black',
            border: '#ddd',
            contextText: '#666',
            addedBg: '#e6ffed',
            addedText: '#22863a',
            removedBg: '#ffeef0',
            removedText: '#d73a49',
            separatorBg: '#f0f0f0',
            separatorText: '#666',
            buttonBg: 'white',
            buttonBorder: '#ddd',
            buttonText: 'black'
        };
        
        // Hide the regular editor
        const editorWrapper = document.getElementById('editor-wrapper');
        const originalEditorDiv = document.getElementById('editor');
        
        // Create diff editor container
        const diffContainer = document.createElement('div');
        diffContainer.id = 'diff-editor-container';
        diffContainer.style.cssText = 'width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;';
        
        // Add scrollbar styling for theme
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #diff-editor-container ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            #diff-editor-container ::-webkit-scrollbar-track {
                background: ${colors.bg};
            }
            #diff-editor-container ::-webkit-scrollbar-thumb {
                background: ${isDark ? '#444' : '#ccc'};
                border-radius: 6px;
            }
            #diff-editor-container ::-webkit-scrollbar-thumb:hover {
                background: ${isDark ? '#555' : '#999'};
            }
            #diff-editor-container {
                scrollbar-width: thin;
                scrollbar-color: ${isDark ? '#444 #1e1e1e' : '#ccc #ffffff'};
            }
        `;
        diffContainer.appendChild(scrollbarStyle);
        
        // Create header with stats
        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            padding: 12px 16px;
            background: ${colors.bg};
            border-bottom: 1px solid ${colors.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: ${colors.text};
            gap: 16px;
            overflow-x: auto;
            overflow-y: hidden;
        `;
        
        // Create action buttons overlay
        const actionsBar = document.createElement('div');
        actionsBar.style.cssText = `
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        `;
        
        actionsBar.innerHTML = `
            <button id="diff-copy-btn" title="Copy Diff" style="
                height: 32px;
                padding: 0 12px;
                background: ${colors.buttonBg};
                color: ${colors.buttonText};
                border: 1px solid ${colors.buttonBorder};
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy
            </button>
            <button id="diff-discard-btn" title="Cancel" style="
                height: 32px;
                padding: 0 12px;
                background: ${colors.buttonBg};
                color: ${colors.buttonText};
                border: 1px solid ${colors.buttonBorder};
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
                Cancel
            </button>
            <button id="diff-apply-btn" title="Apply Changes" style="
                height: 32px;
                padding: 0 12px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                </svg>
                Apply Changes
            </button>
        `;
        
        diffContainer.appendChild(headerBar);
        
        // Create scrollable diff view
        const diffScrollContainer = document.createElement('div');
        diffScrollContainer.style.cssText = `flex: 1; overflow-y: auto; background: ${colors.bg};`;
        diffContainer.appendChild(diffScrollContainer);
        
        // Hide original editor and show diff container
        originalEditorDiv.style.display = 'none';
        editorWrapper.appendChild(diffContainer);
        
        // Update preview with beautified content immediately
        convert(modified);
        
        // Generate compact diff with only changed lines + context
        const originalLines = original.split('\n');
        const modifiedLines = modified.split('\n');
        const diffBlocks = [];
        
        let changedCount = 0;
        let addedCount = 0;
        let removedCount = 0;
        
        const maxLines = Math.max(originalLines.length, modifiedLines.length);
        const CONTEXT_LINES = 2; // Show 2 lines of context around changes
        
        // Find all changed line indices
        const changedIndices = new Set();
        for (let i = 0; i < maxLines; i++) {
            if (originalLines[i] !== modifiedLines[i]) {
                changedIndices.add(i);
                // Add context lines
                for (let j = Math.max(0, i - CONTEXT_LINES); j <= Math.min(maxLines - 1, i + CONTEXT_LINES); j++) {
                    changedIndices.add(j);
                }
            }
        }
        
        // Group consecutive changed lines into blocks
        const sortedIndices = Array.from(changedIndices).sort((a, b) => a - b);
        let currentBlock = [];
        
        for (let i = 0; i < sortedIndices.length; i++) {
            const idx = sortedIndices[i];
            
            if (currentBlock.length === 0 || idx === currentBlock[currentBlock.length - 1] + 1) {
                currentBlock.push(idx);
            } else {
                diffBlocks.push(currentBlock);
                currentBlock = [idx];
            }
        }
        if (currentBlock.length > 0) {
            diffBlocks.push(currentBlock);
        }
        
        // Build HTML diff view
        let diffHTML = '<div style="font-family: monospace; font-size: 13px; line-height: 1.5;">';
        
        diffBlocks.forEach((block, blockIdx) => {
            if (blockIdx > 0) {
                diffHTML += `<div style="padding: 8px 16px; background: ${colors.separatorBg}; color: ${colors.separatorText}; border-top: 1px solid ${colors.border}; border-bottom: 1px solid ${colors.border}; margin: 8px 0;">...</div>`;
            }
            
            block.forEach(i => {
                const origLine = originalLines[i];
                const modLine = modifiedLines[i];
                const lineNum = i + 1;
                
                if (origLine === modLine) {
                    // Unchanged context line
                    diffHTML += `<div style="padding: 2px 16px; background: transparent; color: ${colors.contextText};">
                        <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${colors.contextText};">${lineNum}</span>
                        <span style="color: ${colors.contextText}; margin-right: 8px;"> </span>
                        ${escapeHtml(origLine || '')}
                    </div>`;
                } else {
                    // Changed line
                    changedCount++;
                    
                    if (origLine !== undefined && modLine !== undefined) {
                        // Line modified - show inline diff
                        const wordDiff = getWordDiff(origLine, modLine);
                        
                        // Build removed line with strikethrough
                        let removedHTML = '';
                        wordDiff.forEach(part => {
                            if (part.type === 'removed') {
                                removedHTML += `<span style="background: ${colors.removedBg}; color: ${colors.removedText}; text-decoration: line-through;">${escapeHtml(part.text)}</span>`;
                                removedCount++;
                            } else if (part.type === 'common') {
                                removedHTML += escapeHtml(part.text);
                            }
                        });
                        
                        // Build added line with green highlight
                        let addedHTML = '';
                        wordDiff.forEach(part => {
                            if (part.type === 'added') {
                                addedHTML += `<span style="background: ${colors.addedBg}; color: ${colors.addedText}; font-weight: 500;">${escapeHtml(part.text)}</span>`;
                                addedCount++;
                            } else if (part.type === 'common') {
                                addedHTML += escapeHtml(part.text);
                            }
                        });
                        
                        diffHTML += `<div style="padding: 2px 16px; background: ${colors.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${colors.removedText};">${lineNum}</span>
                            <span style="color: ${colors.removedText}; margin-right: 8px;">-</span>
                            ${removedHTML}
                        </div>`;
                        
                        diffHTML += `<div style="padding: 2px 16px; background: ${colors.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${colors.addedText};">${lineNum}</span>
                            <span style="color: ${colors.addedText}; margin-right: 8px;">+</span>
                            ${addedHTML}
                        </div>`;
                    } else if (origLine !== undefined) {
                        // Line deleted
                        removedCount++;
                        diffHTML += `<div style="padding: 2px 16px; background: ${colors.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${colors.removedText};">${lineNum}</span>
                            <span style="color: ${colors.removedText}; margin-right: 8px;">-</span>
                            <span style="color: ${colors.removedText}; text-decoration: line-through;">${escapeHtml(origLine)}</span>
                        </div>`;
                    } else if (modLine !== undefined) {
                        // Line added
                        addedCount++;
                        diffHTML += `<div style="padding: 2px 16px; background: ${colors.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${colors.addedText};">${lineNum}</span>
                            <span style="color: ${colors.addedText}; margin-right: 8px;">+</span>
                            <span style="color: ${colors.addedText}; font-weight: 500;">${escapeHtml(modLine)}</span>
                        </div>`;
                    }
                }
            });
        });
        
        diffHTML += '</div>';
        
        // Update header with stats
        headerBar.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: center; flex-shrink: 0;">
                <span style="font-weight: 600; color: ${colors.text}; white-space: nowrap;">Beautify Changes</span>
                <span style="color: ${colors.addedText}; white-space: nowrap; font-size: 12px;">+${addedCount}</span>
                <span style="color: ${colors.removedText}; white-space: nowrap; font-size: 12px;">-${removedCount}</span>
                <span style="color: ${colors.contextText}; white-space: nowrap; font-size: 12px;">${changedCount} lines</span>
            </div>
        `;
        headerBar.appendChild(actionsBar);
        
        // Set diff HTML
        diffScrollContainer.innerHTML = diffHTML;
        
        // Generate plain text diff for copying
        const plainDiff = diffBlocks.map(block => {
            return block.map(i => {
                const origLine = originalLines[i];
                const modLine = modifiedLines[i];
                
                if (origLine === modLine) {
                    return '  ' + (origLine || '');
                } else if (origLine !== undefined && modLine !== undefined) {
                    return '- ' + origLine + '\n+ ' + modLine;
                } else if (origLine !== undefined) {
                    return '- ' + origLine;
                } else {
                    return '+ ' + modLine;
                }
            }).join('\n');
        }).join('\n...\n');
        
        // Copy button handler
        document.getElementById('diff-copy-btn').addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(plainDiff);
                const btn = document.getElementById('diff-copy-btn');
                const originalBg = btn.style.background;
                const originalColor = btn.style.color;
                btn.style.background = '#28a745';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.style.background = originalBg;
                    btn.style.color = originalColor;
                }, 1500);
            } catch (err) {
                showMofuHelper('Failed to copy to clipboard');
            }
        });
        
        // Apply button handler
        document.getElementById('diff-apply-btn').addEventListener('click', () => {
            // Save current state to undo history before applying
            saveToUndoHistory(editor.getValue());
            
            // Apply to main editor using executeEdits to preserve undo
            const model = editor.getModel();
            const fullRange = model.getFullModelRange();
            editor.executeEdits('beautify-apply', [{
                range: fullRange,
                text: modified
            }]);
            
            // Clean up
            diffContainer.remove();
            originalEditorDiv.style.display = 'block';
            
            editor.focus();
            showMofuHelper('Changes <strong>applied</strong>! Your markdown has been beautified. Use <strong>Undo</strong> to revert.');
        });
        
        // Cancel button handler
        document.getElementById('diff-discard-btn').addEventListener('click', () => {
            // Clean up
            diffContainer.remove();
            originalEditorDiv.style.display = 'block';
            
            // Restore original content in preview
            convert(original);
            
            editor.focus();
            showMofuHelper('Changes <strong>discarded</strong>. Your original markdown is unchanged.');
        });
    };
    
    // Helper function to escape HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
/**
 * Robust Markdown Beautifier
 * Features: YAML safety, Code block protection, Table alignment, 
 * List normalization, and Recursive Blockquote beautification.
 * CRITICAL: Preserves indentation and document structure.
 * * Reference: CommonMark & GitHub Flavored Markdown (GFM) Specifications.
 */
let performBeautify = (content) => {
    if (!content) return '';

    const lines = content.split('\n');
    const beautified = [];
    let i = 0;
    let previousType = 'start';

    // Helper: Consistent spacing between different blocks (only for top-level)
    const ensureSpacing = () => {
        if (beautified.length > 0 && beautified[beautified.length - 1] !== '') {
            beautified.push('');
        }
    };

    // Helper: Align Table Columns
    const processTable = (tableLines) => {
        const grid = tableLines.map(line => 
            line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
        );
        const colWidths = [];
        grid.forEach(row => {
            row.forEach((cell, colIdx) => {
                colWidths[colIdx] = Math.max(colWidths[colIdx] || 0, cell.length);
            });
        });
        return grid.map((row, rowIdx) => {
            const isSep = row.every(cell => /^[ \-:]+$/.test(cell));
            const aligned = row.map((cell, colIdx) => {
                if (isSep) {
                    const l = cell.startsWith(':'), r = cell.endsWith(':');
                    return (l ? ':' : '') + '-'.repeat(Math.max(3, colWidths[colIdx] - (l ? 1 : 0) - (r ? 1 : 0))) + (r ? ':' : '');
                }
                return cell.padEnd(colWidths[colIdx], ' ');
            });
            return '| ' + aligned.join(' | ') + ' |';
        }).join('\n');
    };

    while (i < lines.length) {
        let line = lines[i];
        let trimmed = line.trim();
        
        // Detect indentation (preserve it!)
        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '';

        // 1. YAML Front Matter (Preserve as-is)
        if (i === 0 && trimmed === '---') {
            beautified.push(trimmed);
            i++;
            while (i < lines.length && lines[i].trim() !== '---') {
                beautified.push(lines[i]);
                i++;
            }
            if (i < lines.length) beautified.push('---');
            previousType = 'yaml';
            i++; continue;
        }

        // 2. Code Blocks (No modification inside)
        if (trimmed.startsWith('```')) {
            ensureSpacing();
            beautified.push(trimmed);
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                beautified.push(lines[i]);
                i++;
            }
            if (i < lines.length) beautified.push(lines[i].trim());
            previousType = 'code-end';
            i++; continue;
        }

        // 3. Blockquotes (PRESERVE INDENTATION - can be nested in lists)
        if (trimmed.startsWith('>')) {
            // Preserve the original indentation + blockquote
            const quoteContent = trimmed.substring(1).trim();
            beautified.push(`${indent}> ${quoteContent}`);
            previousType = 'blockquote';
            i++; continue;
        }

        // 4. Tables (only at top level, not indented)
        if (trimmed.startsWith('|') && indent === '') {
            ensureSpacing();
            let tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            beautified.push(processTable(tableLines));
            previousType = 'table';
            continue;
        }

        // 5. Headers (only at top level)
        const headerMatch = trimmed.match(/^(#{1,6})\s*(.*)/);
        if (headerMatch && indent === '') {
            ensureSpacing();
            let headerText = headerMatch[2].replace(/\s+#*$/, '').trim();
            // Fix numbered headings: "1.Text" -> "1. Text"
            headerText = headerText.replace(/^(\d+)\.(\S)/, '$1. $2');
            beautified.push(`${headerMatch[1]} ${headerText}`);
            previousType = 'header';
            i++; continue;
        }
        
        // 5b. Detect numbered sections that look like headings (e.g., "52. Title")
        // Convert to proper heading format
        const numberedSectionMatch = trimmed.match(/^(\d+)\.\s+([A-Z].*)/);
        if (numberedSectionMatch && indent === '' && previousType !== 'list') {
            ensureSpacing();
            const sectionNum = numberedSectionMatch[1];
            const sectionTitle = numberedSectionMatch[2];
            // Convert to h3 heading (### 52. Title)
            beautified.push(`### ${sectionNum}. ${sectionTitle}`);
            previousType = 'header';
            i++; continue;
        }

        // 6. Lists (PRESERVE INDENTATION - this is critical for nested lists)
        const listMatch = line.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);
        if (listMatch) {
            if (previousType !== 'list' && previousType !== 'start' && indent === '') {
                ensureSpacing();
            }
            let listIndent = listMatch[1];
            let bullet = listMatch[2];
            let content = listMatch[3].trim();
            
            // DEBUG: Log indentation preservation
            if (listIndent.length > 0) {
                console.log('[BEAUTIFY] Preserving list indent:', listIndent.length, 'spaces for:', content.substring(0, 30));
            }
            
            // Only normalize bullet markers (*, +, -) to -, keep numbered lists as-is
            if (['+', '*'].includes(bullet)) {
                bullet = '-';
            }
            
            // Fix key-value pairs in list items: "Key:Value" -> "Key: Value"
            content = content.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/, '$1: $2');
            
            // CRITICAL: Preserve indentation (convert tabs to 4 spaces for consistency)
            listIndent = listIndent.replace(/\t/g, '    ');
            
            beautified.push(`${listIndent}${bullet} ${content}`);
            previousType = 'list';
            i++; continue;
        }

        // 7. Horizontal Rules (Must come AFTER list check to avoid conflict)
        if (/^[-*_]{3,}$/.test(trimmed) && indent === '') {
            ensureSpacing();
            beautified.push('---');
            previousType = 'hr';
            i++; continue;
        }

        // 8. Empty Lines
        if (trimmed === '') {
            if (previousType !== 'empty' && previousType !== 'start') {
                beautified.push('');
                previousType = 'empty';
            }
            i++; continue;
        }

        // 9. Standard Text (preserve indentation if present)
        if (['header', 'hr', 'code-end', 'table'].includes(previousType) && indent === '') {
            ensureSpacing();
        }
        
        // Fix key-value pairs: "Key:Value" -> "Key: Value"
        let processedText = trimmed.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/, '$1: $2');
        
        // If line has indentation, preserve it (could be continuation of list/blockquote)
        if (indent) {
            beautified.push(`${indent}${processedText}`);
        } else {
            beautified.push(processedText);
        }
        
        previousType = 'text';
        i++;
    }

    return beautified.join('\n').trim();
};

/**
 * EXECUTION GUIDE:
 * 1. Pass your raw Markdown string into `performBeautify(yourString)`.
 * 2. The function returns the cleaned, aligned, and professional Markdown.
 * 3. Use this for your architecture business documentation or AI-generated design notes.
 * 
 * IMPORTANT: This beautifier is STRUCTURE-PRESERVING:
 * - Preserves indentation for nested lists
 * - Preserves indented blockquotes in lists
 * - Preserves hierarchy and nesting
 * - Only normalizes formatting, not structure
 */

    // Paste from clipboard
    let pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                const position = editor.getPosition();
                editor.executeEdits('', [{
                    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                    text: text
                }]);
                editor.focus();
            }
        } catch (err) {
            window.alert('Failed to read clipboard. Please make sure you have granted clipboard permissions.');
        }
    };

    let presetValue = (value) => {
        editor.setValue(value);
        editor.revealPosition({ lineNumber: 1, column: 1 });
        editor.focus();
        hasEdited = false;
    };

    // ----- sync scroll position -----

    let initScrollBarSync = (settings) => {
        let checkbox = document.querySelector('#sync-scroll-checkbox');
        checkbox.checked = settings;
        scrollBarSync = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            scrollBarSync = checked;
            saveScrollBarSettings(checked);
        });
    };

    // ----- sync cursor position -----

    let initCursorSync = (settings) => {
        let checkbox = document.querySelector('#sync-cursor-checkbox');
        checkbox.checked = settings;
        cursorSync = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            cursorSync = checked;
            saveCursorSyncSettings(checked);
            
            // Remove highlight if disabling
            if (!checked) {
                const outputElement = document.querySelector('#output');
                if (outputElement) {
                    const previousHighlight = outputElement.querySelector('.cursor-highlight');
                    if (previousHighlight) {
                        previousHighlight.classList.remove('cursor-highlight');
                    }
                }
            }
        });
    };

    // ----- helper messages toggle -----

    let initHelperMessagesToggle = (settings) => {
        let checkbox = document.querySelector('#helper-messages-checkbox');
        if (!checkbox) return;
        
        checkbox.checked = settings;
        helperMessagesEnabled = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            saveHelperMessagesSetting(checked);
        });
    };
    
    // ----- style tooltips toggle -----
    let initStyleTooltipsToggle = () => {
        let checkbox = document.querySelector('#style-tooltips-checkbox');
        if (!checkbox) return;
        
        const disabled = localStorage.getItem('com.markdownlivepreview.style_tooltips_disabled') === 'true';
        checkbox.checked = !disabled;
        
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                localStorage.removeItem('com.markdownlivepreview.style_tooltips_disabled');
                // Show tooltip immediately for current style
                const selector = document.querySelector('#style-selector');
                if (selector) {
                    const currentStyle = selector.value;
                    // Trigger a fake change event to show tooltip
                    setTimeout(() => {
                        const changeEvent = new Event('change');
                        selector.dispatchEvent(changeEvent);
                    }, 100);
                }
            } else {
                localStorage.setItem('com.markdownlivepreview.style_tooltips_disabled', 'true');
            }
        });
    };

    // ----- preview CSS loader (switch github-markdown css) -----
    const PREVIEW_CSS_LIGHT = 'css/github-markdown-light.css?v=1.12.0';
    const PREVIEW_CSS_DARK = 'css/github-markdown-dark_dimmed.css?v=1.12.0';
    const PREVIEW_CSS_GITBOOK = 'css/gitbook-style.css?v=1.12.0';
    const PREVIEW_CSS_VSCODE = 'css/vscode-style.css?v=1.12.0';

    let currentStyle = 'github'; // default style

    let setPreviewCss = (useDark, style = currentStyle) => {
        const link = document.getElementById('gh-markdown-link');
        if (!link) {
            // fallback: create link element
            const newLink = document.createElement('link');
            newLink.id = 'gh-markdown-link';
            newLink.rel = 'stylesheet';
            newLink.href = getStyleHref(useDark, style);
            document.head.appendChild(newLink);
            return;
        }

        // Only update if href differs to avoid unnecessary reload
        const desired = getStyleHref(useDark, style);
        if (link.getAttribute('href') !== desired) {
            link.setAttribute('href', desired);
        }
    };

    let getStyleHref = (useDark, style) => {
        if (style === 'gitbook') {
            return PREVIEW_CSS_GITBOOK;
        } else if (style === 'vscode') {
            return PREVIEW_CSS_VSCODE;
        } else {
            // github style
            return useDark ? PREVIEW_CSS_DARK : PREVIEW_CSS_LIGHT;
        }
    };

    // ----- theme toggle (dark/light) -----
    let setTheme = (enabled) => {
        document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
        
        // Switch highlight.js theme
        const lightTheme = document.getElementById('hljs-light-theme');
        const darkTheme = document.getElementById('hljs-dark-theme');
        if (lightTheme && darkTheme) {
            lightTheme.disabled = enabled;
            darkTheme.disabled = !enabled;
        }
    };

    let initThemeToggle = (settings) => {
        let checkbox = document.querySelector('#theme-checkbox');
        if (!checkbox) return;
        checkbox.checked = settings;
        setTheme(settings);

        // set Monaco editor theme to match page theme
        if (monaco && monaco.editor && typeof monaco.editor.setTheme === 'function') {
            monaco.editor.setTheme(settings ? 'custom-dark' : 'custom-light');
        }
        // set preview css to match theme
        setPreviewCss(settings, currentStyle);

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            setTheme(checked);
            saveThemeSettings(checked);
            setPreviewCss(checked, currentStyle);
            if (monaco && monaco.editor && typeof monaco.editor.setTheme === 'function') {
                monaco.editor.setTheme(checked ? 'custom-dark' : 'custom-light');
            }
        });
    };

    // ----- style selector (github/gitbook/vscode) -----
    let initStyleSelector = (settings) => {
        let selector = document.querySelector('#style-selector');
        if (!selector) return;
        
        currentStyle = settings || 'github';
        selector.value = currentStyle;
        
        // Style information for tooltips
        const styleInfo = {
            github: {
                name: 'GitHub Style',
                description: 'Traditional, balanced, professional',
                fonts: 'Helvetica (Sans-serif)',
                textSize: '11pt body, 20pt H1',
                features: 'Full table borders, gray header backgrounds',
                bestFor: 'Documentation, README files, general content'
            },
            gitbook: {
                name: 'GitBook Style',
                description: 'Modern, clean, book-like',
                fonts: 'Helvetica (Sans-serif)',
                textSize: '10pt body, 18pt H1',
                features: 'Horizontal table borders, minimal styling',
                bestFor: 'Books, guides, long-form documentation'
            },
            vscode: {
                name: 'VS Code Style',
                description: 'Compact, technical, code-focused',
                fonts: 'Courier (Monospace)',
                textSize: '8pt body, 12pt H1',
                features: 'Minimal borders, tight spacing',
                bestFor: 'Technical docs, code-heavy content'
            }
        };
        
        // Check if user specifically disabled style tooltips (separate from helper messages)
        const styleTooltipsDisabled = localStorage.getItem('com.markdownlivepreview.style_tooltips_disabled') === 'true';
        
        // Show style info tooltip
        const showStyleTooltip = (style) => {
            // Check localStorage directly each time (not cached)
            const isDisabled = localStorage.getItem('com.markdownlivepreview.style_tooltips_disabled') === 'true';
            
            if (isDisabled) {
                return;
            }
            
            const info = styleInfo[style];
            if (!info) {
                return;
            }
            
            // Remove existing tooltip
            const existing = document.querySelector('.style-info-tooltip');
            if (existing) {
                existing.remove();
            }
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'style-info-tooltip';
            
            // Get current theme colors
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const bgColor = isDark ? '#1e1e1e' : '#ffffff';
            const textColor = isDark ? '#e0e0e0' : '#333333';
            const borderColor = isDark ? '#404040' : '#ddd';
            const mutedColor = isDark ? '#a0a0a0' : '#666666';
            
            tooltip.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="font-size: 14px; color: ${textColor};">${info.name}</strong>
                    <button id="close-style-tooltip" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 10px; color: ${textColor};">×</button>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: ${mutedColor};">${info.description}</p>
                <div style="margin-top: 8px; font-size: 11px; line-height: 1.6; color: ${textColor};">
                    <div><strong>Fonts:</strong> ${info.fonts}</div>
                    <div><strong>Text Size:</strong> ${info.textSize}</div>
                    <div><strong>Features:</strong> ${info.features}</div>
                    <div style="margin-top: 4px; color: ${mutedColor};"><em>Best for: ${info.bestFor}</em></div>
                </div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid ${borderColor};">
                    <label style="font-size: 11px; cursor: pointer; display: flex; align-items: center; color: ${textColor};">
                        <input type="checkbox" id="never-show-style-tooltips" style="margin-right: 6px; cursor: pointer;">
                        Don't show again
                    </label>
                </div>
            `;
            
            tooltip.style.cssText = `
                position: fixed;
                top: 60px;
                left: 20px;
                background: ${bgColor};
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,${isDark ? '0.5' : '0.15'});
                z-index: 10000;
                max-width: 320px;
                animation: slideIn 0.3s ease-out;
            `;
            
            document.body.appendChild(tooltip);
            
            let isPaused = false;
            let autoDismissTimer = null;
            
            // Auto-dismiss after 2 seconds (unless hovered or paused)
            const startAutoDismiss = () => {
                autoDismissTimer = setTimeout(() => {
                    if (!isPaused) {
                        tooltip.style.animation = 'slideOut 0.3s ease-out';
                        setTimeout(() => tooltip.remove(), 300);
                    }
                }, 2000);
            };
            
            const cancelAutoDismiss = () => {
                if (autoDismissTimer) {
                    clearTimeout(autoDismissTimer);
                    autoDismissTimer = null;
                }
            };
            
            startAutoDismiss();
            
            // Pause on hover - tooltip stays visible while mouse is over it
            tooltip.addEventListener('mouseenter', () => {
                cancelAutoDismiss();
            });
            
            // Resume when mouse leaves
            tooltip.addEventListener('mouseleave', () => {
                if (!isPaused) {
                    startAutoDismiss();
                }
            });
            
            // Pause auto-dismiss on mousedown (for text selection)
            tooltip.addEventListener('mousedown', () => {
                isPaused = true;
                cancelAutoDismiss();
            });
            
            // Resume auto-dismiss on mouseup
            tooltip.addEventListener('mouseup', () => {
                isPaused = false;
                // Don't auto-start timer here, let mouseleave handle it
            });
            
            // Close button
            document.getElementById('close-style-tooltip').addEventListener('click', (e) => {
                e.stopPropagation();
                cancelAutoDismiss();
                tooltip.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => tooltip.remove(), 300);
            });
            
            // Don't show again checkbox
            document.getElementById('never-show-style-tooltips').addEventListener('change', (e) => {
                if (e.target.checked) {
                    localStorage.setItem('com.markdownlivepreview.style_tooltips_disabled', 'true');
                    
                    // Update the settings menu checkbox
                    const settingsCheckbox = document.querySelector('#style-tooltips-checkbox');
                    if (settingsCheckbox) {
                        settingsCheckbox.checked = false;
                    }
                    
                    cancelAutoDismiss();
                    tooltip.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => tooltip.remove(), 300);
                }
            });
        };
        
        // Apply initial style
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setPreviewCss(isDark, currentStyle);
        
        // Show tooltip on initial load (delayed to avoid overwhelming user)
        setTimeout(() => {
            showStyleTooltip(currentStyle);
        }, 500);

        selector.addEventListener('change', (event) => {
            currentStyle = event.target.value;
            saveStyleSettings(currentStyle);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setPreviewCss(isDark, currentStyle);
            
            // Show tooltip when style changes
            showStyleTooltip(currentStyle);
        });
    };

    // ----- flip panels (editor <-> preview) -----
    let initFlipPanels = (settings) => {
        let checkbox = document.querySelector('#flip-panels-checkbox');
        if (!checkbox) return;
        
        checkbox.checked = settings;
        applyFlipPanels(settings);

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            applyFlipPanels(checked);
            saveFlipPanelsSettings(checked);
        });
    };

    let applyFlipPanels = (enabled) => {
        const container = document.querySelector('#container');
        if (enabled) {
            container.classList.add('flipped');
        } else {
            container.classList.remove('flipped');
        }
    };

    // ----- vertical layout -----
    let initVerticalLayout = (settings) => {
        let checkbox = document.querySelector('#vertical-layout-checkbox');
        if (!checkbox) return;
        
        checkbox.checked = settings;
        applyVerticalLayout(settings);

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            applyVerticalLayout(checked);
            saveVerticalLayoutSettings(checked);
            
            // Trigger editor resize after layout change
            if (editor) {
                setTimeout(() => {
                    editor.layout();
                }, 350);
            }
        });
    };

    let applyVerticalLayout = (enabled) => {
        const container = document.querySelector('#container');
        if (enabled) {
            container.classList.add('vertical');
        } else {
            container.classList.remove('vertical');
        }
    };
    
    let enableScrollBarSync = () => {
        scrollBarSync = true;
    };

    let disableScrollBarSync = () => {
        scrollBarSync = false;
    };

    // ----- clipboard utils -----

    let copyToClipboard = (text, successHandler, errorHandler) => {
        navigator.clipboard.writeText(text).then(
            () => {
                successHandler();
            },

            () => {
                errorHandler();
            }
        );
    };

    let notifyCopied = () => {
        let labelElement = document.querySelector("#copy-button a");
        labelElement.innerHTML = "Copied!";
        setTimeout(() => {
            labelElement.innerHTML = "Copy";
        }, 1000)
    };

    // ----- export preview -----

    let exportLightCssPromise = null;

    // Get style-specific PDF settings
    let getStylePdfSettings = (style) => {
        const baseSettings = {
            margin: 15,
            lineSpacing: 1.5,
            headingSpacing: 1.2
        };

        if (style === 'gitbook') {
            // GitBook: Clean, modern, spacious with subtle backgrounds
            return {
                ...baseSettings,
                margin: 20,
                h1: 14,
                h2: 12,
                h3: 11,
                h4: 10,
                paragraph: 9,
                list: 9,
                blockquote: 9,
                code: 8,
                table: 9,
                fontFamily: 'helvetica',
                lineSpacing: 1.8,
                headingSpacing: 1.5,
                tableBorders: 'all',
                tableBorderWeight: 0.3,
                tableBorderColor: '#e0e0e0',
                tableHeaderBg: '#f5f5f5',
                tableHeaderColor: '#000000',
                linkColor: [80, 80, 80],
                codeBackground: true,
                codeBackgroundColor: '#f8f8f8',
                blockquoteBorder: true,
                blockquoteBorderColor: '#d0d0d0'
            };
        } else if (style === 'vscode') {
            // VSCode: Compact, technical, minimal borders
            return {
                ...baseSettings,
                margin: 15,
                h1: 12,
                h2: 11,
                h3: 10,
                h4: 9,
                paragraph: 8,
                list: 8,
                blockquote: 8,
                code: 7,
                table: 8,
                fontFamily: 'courier',
                lineSpacing: 1.4,
                headingSpacing: 1.2,
                tableBorders: 'horizontal',
                tableBorderWeight: 0.2,
                tableBorderColor: '#cccccc',
                tableHeaderBg: 'none',
                tableHeaderColor: '#000000',
                linkColor: [60, 60, 60],
                codeBackground: false,
                blockquoteBorder: false
            };
        } else {
            // GitHub: Traditional, balanced, professional
            return {
                ...baseSettings,
                margin: 15,
                h1: 13,
                h2: 11,
                h3: 10,
                h4: 9,
                paragraph: 8,
                list: 8,
                blockquote: 8,
                code: 8,
                table: 8,
                fontFamily: 'helvetica',
                lineSpacing: 1.5,
                headingSpacing: 1.3,
                tableBorders: 'horizontal',
                tableBorderWeight: 0.15,
                tableBorderColor: '#d0d0d0',
                tableHeaderBg: '#fafafa',
                tableHeaderColor: '#000000',
                linkColor: [70, 70, 70],
                codeBackground: true,
                codeBackgroundColor: '#f6f6f6',
                blockquoteBorder: true,
                blockquoteBorderColor: '#ddd'
            };
        }
    };

    let getStyleCss = async (style, isDark) => {
        let cssUrl;
        if (style === 'gitbook') {
            cssUrl = PREVIEW_CSS_GITBOOK;
        } else if (style === 'vscode') {
            cssUrl = PREVIEW_CSS_VSCODE;
        } else {
            cssUrl = isDark ? PREVIEW_CSS_DARK : PREVIEW_CSS_LIGHT;
        }

        try {
            const response = await fetch(cssUrl);
            if (!response.ok) {
                throw new Error(`Failed to load CSS: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Failed to load CSS for export', error);
            return '';
        }
    };

    let exportPreviewToHtml = async () => {
        const outputElement = document.querySelector('#output');
        if (!outputElement) {
            return;
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const css = await getStyleCss(currentStyle, isDark);
        
        // Style-specific configurations for paper layout
        let paperStyles = '';
        if (currentStyle === 'gitbook') {
            paperStyles = `
                body {
                    background-color: ${isDark ? '#0d1117' : '#f5f5f5'};
                    padding: 40px 20px;
                }
                .paper-container {
                    max-width: 860px;
                    margin: 0 auto;
                    background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
                    padding: 50px 70px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, ${isDark ? '0.5' : '0.1'});
                    min-height: 100vh;
                }
                .markdown-body {
                    padding: 0;
                    background-color: transparent;
                }
            `;
        } else if (currentStyle === 'vscode') {
            paperStyles = `
                body {
                    background-color: ${isDark ? '#1e1e1e' : '#f3f3f3'};
                    padding: 40px 20px;
                }
                .paper-container {
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: ${isDark ? '#1e1e1e' : '#ffffff'};
                    padding: 40px 50px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, ${isDark ? '0.4' : '0.1'});
                    min-height: 100vh;
                    border: 1px solid ${isDark ? '#3c3c3c' : '#e1e4e8'};
                }
                .markdown-body {
                    padding: 0;
                    background-color: transparent;
                }
            `;
        } else {
            // GitHub style
            paperStyles = `
                body {
                    background-color: ${isDark ? '#0d1117' : '#f6f8fa'};
                    padding: 40px 20px;
                    margin: 0;
                }
                .paper-container {
                    max-width: 980px;
                    margin: 0 auto;
                    background-color: ${isDark ? '#0d1117' : '#ffffff'};
                    padding: 40px 50px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, ${isDark ? '0.3' : '0.08'});
                    min-height: 100vh;
                    border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
                }
                .markdown-body {
                    padding: 0;
                    margin: 0;
                    background-color: transparent;
                    max-width: 100%;
                    width: 100%;
                }
            `;
        }
        
        const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="${isDark ? 'dark' : 'light'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown - ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Style</title>
    <style>
        * {
            box-sizing: border-box;
        }
        ${paperStyles}
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .paper-container {
                box-shadow: none;
                border: none;
                max-width: 100%;
            }
        }
        ${css}
    </style>
</head>
<body>
    <div class="paper-container">
        <div class="markdown-body">
            ${outputElement.innerHTML}
        </div>
    </div>
</body>
</html>`;

        // Create a blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename with style and timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const styleName = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
        const themeMode = isDark ? 'Dark' : 'Light';
        a.download = `DocMark_${styleName}_${themeMode}_${timestamp}.html`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`HTML exported successfully (${styleName} - ${themeMode} mode)`, 'success');
    };

    let getLightMarkdownCss = () => {
        if (exportLightCssPromise) {
            return exportLightCssPromise;
        }

        exportLightCssPromise = fetch(PREVIEW_CSS_LIGHT)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load export CSS: ${response.status}`);
                }
                return response.text();
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Failed to load light markdown CSS', error);
                return '';
            });

        return exportLightCssPromise;
    };

    // ===== PDF EXPORT WITH PUPPETEER =====
    
    let exportPreviewToPdf = async () => {
        console.log('🚀 [PUPPETEER PDF EXPORT] Starting export...');
        
        const outputElement = document.querySelector('#output');
        if (!outputElement) {
            alert('No content to export');
            return;
        }

        try {
            console.log('[PDF Export] Using Puppeteer server at localhost:3000');
            
            // Show loading indicator
            showLoadingIndicator('Generating PDF...');

            // Get page setup settings (includes margins)
            const pageSettings = loadPageSetupSettings();
            const margins = pageSettings.margins || { top: 20, right: 20, bottom: 20, left: 20 };

            console.log('[PDF Export] Using margins:', margins);

            // Collect HTML with all styles (async - fetches CSS)
            const fullHtml = await collectHtmlForPuppeteer(outputElement);

            // Generate filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const styleName = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
            const filename = `DocMark_${styleName}_${timestamp}.pdf`;

            // Send to Puppeteer server
            const response = await fetch('http://localhost:3000/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html: fullHtml,
                    filename: filename,
                    margins: margins
                })
            });

            if (!response.ok) {
                throw new Error('PDF generation failed');
            }

            // Download PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            hideLoadingIndicator();
            console.log('[PDF Export] Success!');

        } catch (error) {
            console.error('[PDF Export] Failed:', error);
            hideLoadingIndicator();
            
            if (error.message.includes('Failed to fetch')) {
                alert('PDF server not running!\n\nPlease start it with:\nnode pdf-server.js');
            } else {
                alert('PDF export failed: ' + error.message);
            }
        }
    };

    // Helper function to collect HTML with inline styles for Puppeteer
    let collectHtmlForPuppeteer = async (outputElement) => {
        console.log('[PDF Export] Collecting HTML and CSS for Puppeteer...');
        
        // Get the current style CSS link
        const ghMarkdownLink = document.getElementById('gh-markdown-link');
        let markdownCss = '';
        
        if (ghMarkdownLink && ghMarkdownLink.href) {
            console.log('[PDF Export] Fetching CSS from:', ghMarkdownLink.href);
            try {
                // Fetch the CSS content
                const response = await fetch(ghMarkdownLink.href);
                markdownCss = await response.text();
                console.log('[PDF Export] CSS fetched successfully, length:', markdownCss.length);
            } catch (e) {
                console.error('[PDF Export] Failed to fetch CSS:', e);
            }
        }
        
        // Get all CSS from style tags
        let inlineCss = '';
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach(tag => {
            inlineCss += tag.textContent + '\n';
        });

        // Build complete HTML document with all CSS inlined
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Markdown body styles */
        ${markdownCss}
        
        /* Inline styles from page */
        ${inlineCss}
        
        /* Print-specific resets */
        @media print {
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
            
            /* Reset paper layout preview styles */
            #output {
                max-width: none !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                transform: none !important;
                background: white !important;
            }
            
            .markdown-body {
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* Footer positioning */
            [data-pdf-footer="true"] {
                display: block;
                margin-top: auto;
                padding-top: 20px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            /* Avoid breaking inside these elements */
            h1, h2, h3, h4, h5, h6 {
                break-after: avoid;
                page-break-after: avoid;
            }
            
            p, ul, ol, table {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    ${outputElement.innerHTML}
</body>
</html>`;

        return htmlContent;
    };

    // Loading indicator functions
    let showLoadingIndicator = (message) => {
        // Remove existing indicator if any
        const existing = document.getElementById('pdf-loading-indicator');
        if (existing) {
            existing.remove();
        }

        const indicator = document.createElement('div');
        indicator.id = 'pdf-loading-indicator';
        indicator.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.5); z-index: 10000; 
                        display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 8px; 
                            text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #333;">
                        ${message}
                    </div>
                    <div style="width: 40px; height: 40px; margin: 0 auto; 
                                border: 4px solid #f3f3f3; border-top: 4px solid #007bff; 
                                border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(indicator);
    };

    let hideLoadingIndicator = () => {
        const indicator = document.getElementById('pdf-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    // ----- PDF font settings -----
    
    let loadPdfSettings = () => {
        try {
            let raw = localStorage.getItem(localStorageNamespace + '.' + localStoragePdfSettingsKey);
            if (raw) {
                let saved = JSON.parse(raw);
                pdfFontSettings = { ...pdfFontSettings, ...saved };
            }
        } catch (e) {
            console.error('Failed to load PDF settings', e);
        }
    };
    
    let openPdfSettingsModal = () => {
        // Check if panel already exists
        if (document.getElementById('pdf-settings-panel')) {
            document.getElementById('pdf-settings-panel').remove();
            return;
        }
        
        // Load saved templates from localStorage
        const loadTemplates = () => {
            try {
                const saved = localStorage.getItem(localStorageNamespace + '.pdf_templates');
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                return {};
            }
        };
        
        const saveTemplates = (templates) => {
            try {
                localStorage.setItem(localStorageNamespace + '.pdf_templates', JSON.stringify(templates));
            } catch (e) {
                console.error('Failed to save templates', e);
            }
        };
        
        const templates = loadTemplates();
        
        // Create floating panel
        const panel = document.createElement('div');
        panel.id = 'pdf-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            width: 320px;
            max-height: calc(100vh - 80px);
            background: var(--bg-color, white);
            color: var(--text-color, black);
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            overflow-y: auto;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        
        panel.innerHTML = `
            <div style="position: sticky; top: 0; background: var(--bg-color, white); padding: 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px;">PDF Export Settings</h3>
                <button id="pdf-close-panel" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
            </div>
            
            <div style="padding: 15px;">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Font Family</h4>
                    <select id="pdf-font-family" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">
                        <option value="helvetica" ${pdfFontSettings.fontFamily === 'helvetica' ? 'selected' : ''}>Helvetica (Sans-serif)</option>
                        <option value="times" ${pdfFontSettings.fontFamily === 'times' ? 'selected' : ''}>Times (Serif)</option>
                        <option value="courier" ${pdfFontSettings.fontFamily === 'courier' ? 'selected' : ''}>Courier (Monospace)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Font Sizes (pt)</h4>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H1 Heading:</span>
                        <input type="number" id="pdf-h1" min="6" max="32" value="${pdfFontSettings.h1}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H2 Heading:</span>
                        <input type="number" id="pdf-h2" min="6" max="32" value="${pdfFontSettings.h2}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H3 Heading:</span>
                        <input type="number" id="pdf-h3" min="6" max="32" value="${pdfFontSettings.h3}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H4-H6 Heading:</span>
                        <input type="number" id="pdf-h4" min="6" max="32" value="${pdfFontSettings.h4}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Paragraph:</span>
                        <input type="number" id="pdf-paragraph" min="6" max="32" value="${pdfFontSettings.paragraph}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>List:</span>
                        <input type="number" id="pdf-list" min="6" max="32" value="${pdfFontSettings.list}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Blockquote:</span>
                        <input type="number" id="pdf-blockquote" min="6" max="32" value="${pdfFontSettings.blockquote}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Code:</span>
                        <input type="number" id="pdf-code" min="6" max="32" value="${pdfFontSettings.code}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Table:</span>
                        <input type="number" id="pdf-table" min="6" max="32" value="${pdfFontSettings.table}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Table Styling</h4>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Borders:</span>
                        <select id="pdf-table-borders" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">
                            <option value="all" ${pdfFontSettings.tableBorders === 'all' ? 'selected' : ''}>All Borders</option>
                            <option value="horizontal" ${pdfFontSettings.tableBorders === 'horizontal' ? 'selected' : ''}>Horizontal Only</option>
                            <option value="none" ${pdfFontSettings.tableBorders === 'none' ? 'selected' : ''}>No Borders</option>
                        </select>
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px;">
                        <span>Border Weight:</span>
                        <input type="number" id="pdf-border-weight" min="0.1" max="2" step="0.1" value="${pdfFontSettings.tableBorderWeight}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Border Color:</span>
                        <input type="color" id="pdf-border-color" value="${pdfFontSettings.tableBorderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Background:</span>
                        <input type="color" id="pdf-header-bg" value="${pdfFontSettings.tableHeaderBg}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Text Color:</span>
                        <input type="color" id="pdf-header-color" value="${pdfFontSettings.tableHeaderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button id="pdf-reset-btn" style="flex: 1; padding: 8px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">Reset</button>
                    <button id="pdf-export-now-btn" style="flex: 1; padding: 8px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: 500;">Export PDF</button>
                </div>
                
                <p style="margin: 15px 0 0 0; font-size: 11px; color: #999; text-align: center;">Changes save automatically</p>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners for all inputs
        const updateSetting = (key, value) => {
            pdfFontSettings[key] = value;
            savePdfSettings();
        };
        
        // Font sizes
        ['h1', 'h2', 'h3', 'h4', 'paragraph', 'list', 'blockquote', 'code', 'table'].forEach(key => {
            const input = document.getElementById(`pdf-${key}`);
            input.addEventListener('change', () => updateSetting(key, parseInt(input.value) || 8));
        });
        
        // Font family
        document.getElementById('pdf-font-family').addEventListener('change', (e) => {
            updateSetting('fontFamily', e.target.value);
        });
        
        // Table settings
        document.getElementById('pdf-table-borders').addEventListener('change', (e) => {
            updateSetting('tableBorders', e.target.value);
        });
        
        document.getElementById('pdf-border-weight').addEventListener('change', (e) => {
            updateSetting('tableBorderWeight', parseFloat(e.target.value) || 0.1);
        });
        
        document.getElementById('pdf-border-color').addEventListener('change', (e) => {
            updateSetting('tableBorderColor', e.target.value);
        });
        
        document.getElementById('pdf-header-bg').addEventListener('change', (e) => {
            updateSetting('tableHeaderBg', e.target.value);
        });
        
        document.getElementById('pdf-header-color').addEventListener('change', (e) => {
            updateSetting('tableHeaderColor', e.target.value);
        });
        
        // Buttons
        document.getElementById('pdf-reset-btn').addEventListener('click', () => {
            pdfFontSettings = {
                h1: 10,
                h2: 10,
                h3: 10,
                h4: 10,
                paragraph: 8,
                list: 8,
                blockquote: 8,
                code: 8,
                table: 8,
                fontFamily: 'helvetica',
                tableBorders: 'horizontal',
                tableBorderWeight: 0.1,
                tableBorderColor: '#cccccc',
                tableHeaderBg: '#f0f0f0',
                tableHeaderColor: '#000000'
            };
            savePdfSettings();
            panel.remove();
            openPdfSettingsModal(); // Reopen with reset values
        });
        
        document.getElementById('pdf-export-now-btn').addEventListener('click', () => {
            exportPreviewToPdf();
        });
        
        document.getElementById('pdf-close-panel').addEventListener('click', () => {
            panel.remove();
        });
    };

    // ----- setup -----

    // setup navigation actions
    let setupResetButton = () => {
        document.querySelector("#reset-button").addEventListener('click', (event) => {
            event.preventDefault();
            reset();
        });
    };

    let setupClearButton = () => {
        document.querySelector("#clear-button").addEventListener('click', (event) => {
            event.preventDefault();
            clearEditor();
        });
    };

    let setupPasteButton = () => {
        document.querySelector("#paste-button").addEventListener('click', (event) => {
            event.preventDefault();
            pasteFromClipboard();
        });
    };

    let setupCopyButton = (editor) => {
        document.querySelector("#copy-button").addEventListener('click', (event) => {
            event.preventDefault();
            let value = editor.getValue();
            copyToClipboard(value, () => {
                notifyCopied();
            },
                () => {
                    // nothing to do
                });
        });
    };

    let setupExportButton = () => {
        const exportPdfLink = document.querySelector('#export-pdf-link');
        if (exportPdfLink) {
            exportPdfLink.addEventListener('click', (event) => {
                event.preventDefault();
                exportPreviewToPdf();
            });
        }
    };

    let setupExportHtmlButton = () => {
        const exportHtmlLink = document.querySelector('#export-html-link');
        if (exportHtmlLink) {
            exportHtmlLink.addEventListener('click', (event) => {
                event.preventDefault();
                exportPreviewToHtml();
            });
        }
    };
    
    // Setup export markdown button
    let setupExportMarkdownButton = (editorInstance) => {
        const exportMdButton = document.querySelector('#export-md-button');
        if (exportMdButton) {
            exportMdButton.addEventListener('click', () => {
                if (!editorInstance) {
                    return;
                }
                
                const content = editorInstance.getValue();
                
                // Extract title from YAML front matter or first heading
                let documentTitle = 'document';
                const yamlMatch = content.match(/^---\s*\ntitle:\s*(.+?)\s*\n/m);
                if (yamlMatch) {
                    documentTitle = yamlMatch[1].trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
                } else {
                    const headingMatch = content.match(/^#\s+(.+)$/m);
                    if (headingMatch) {
                        documentTitle = headingMatch[1].trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    }
                }
                
                // Generate timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                
                // Create filename
                const filename = `${documentTitle}_docmark_${timestamp}.md`;
                
                // Create blob and download
                const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast(`Markdown exported: ${filename}`, 'success');
            });
        }
    };
    
    // Setup import markdown button
    let setupImportMarkdownButton = (editorInstance) => {
        const importMdButton = document.querySelector('#import-md-button');
        const importMdInput = document.querySelector('#import-md-input');
        
        if (importMdButton && importMdInput) {
            importMdButton.addEventListener('click', () => {
                importMdInput.click();
            });
            
            importMdInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        if (editorInstance) {
                            // Save current state before importing
                            saveToUndoHistory(editorInstance.getValue());
                            
                            // Use executeEdits to preserve undo
                            const model = editorInstance.getModel();
                            const fullRange = model.getFullModelRange();
                            editorInstance.executeEdits('import-markdown', [{
                                range: fullRange,
                                text: content
                            }]);
                            
                            showToast(`Imported: ${file.name}`, 'success');
                            showMofuHelper(`File imported! Use <strong>Undo</strong> to restore previous content.`);
                        }
                    };
                    reader.onerror = () => {
                        showToast('Failed to read file', 'error');
                    };
                    reader.readAsText(file);
                }
                // Reset input so same file can be imported again
                event.target.value = '';
            });
        }
    };
    
    let setupPdfSettingsButton = () => {
        let pdfSettingsLink = document.querySelector('#pdf-settings-link');
        if (pdfSettingsLink) {
            pdfSettingsLink.addEventListener('click', (event) => {
                event.preventDefault();
                openPdfSettingsModal();
            });
        }
    };

    // ----- Undo button -----
    let setupUndoButton = () => {
        const undoButton = document.querySelector('#undo-button');
        if (!undoButton) return;
        
        undoButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (editor) {
                performUndo();
                editor.focus();
            }
        });
    };

    // ----- Redo button -----
    let setupRedoButton = () => {
        const redoButton = document.querySelector('#redo-button');
        if (!redoButton) return;
        
        redoButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (editor) {
                performRedo();
                editor.focus();
            }
        });
    };

    // ----- Beautify button -----
    let setupBeautifyButton = () => {
        const beautifyButton = document.querySelector('#beautify-button');
        if (!beautifyButton) return;
        
        beautifyButton.addEventListener('click', (event) => {
            event.preventDefault();
            beautifyMarkdown();
        });
    };

    // ----- Option 1: Print to PDF button -----
    let setupPrintPdfButton = () => {
        const printPdfLink = document.querySelector('#print-pdf-link');
        if (printPdfLink) {
            printPdfLink.addEventListener('click', async (event) => {
                event.preventDefault();
                await printPreviewToPdf();
            });
        }
    };

    let printPreviewToPdf = async () => {
        const outputElement = document.querySelector('#output');
        if (!outputElement) {

            return;
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const css = await getStyleCss(currentStyle, isDark);
        
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Preview</title>
    <style>
        @media print {
            @page {
                margin: 1cm;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
        body {
            margin: 0;
            padding: 20px;
            background-color: ${isDark ? '#1E1E1E' : '#ffffff'};
            color: ${isDark ? '#e6edf3' : '#24292f'};
        }
        .markdown-body {
            max-width: 900px;
            margin: 0 auto;
            color: ${isDark ? '#e6edf3' : '#24292f'};
        }
        ${css}
    </style>
</head>
<body>
    <div class="markdown-body">
        ${outputElement.innerHTML}
    </div>
    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>`;

        // Open in new window and trigger print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    // ----- Toast Notification System -----
    let showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2500);
    };

    // ----- Mofu Helper Bubble System -----
    let mofuIsSpeaking = false; // Track if Mofu is showing a helper message
    let helperMessagesEnabled = true; // Track if helper messages are enabled
    
    // Load helper messages setting from localStorage
    const loadHelperMessagesSetting = () => {
        const saved = Storehouse.getItem(localStorageNamespace, localStorageHelperMessagesKey);
        helperMessagesEnabled = saved !== false; // Default to true if not set
        return helperMessagesEnabled;
    };
    
    // Save helper messages setting to localStorage
    const saveHelperMessagesSetting = (enabled) => {
        const expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageHelperMessagesKey, enabled, expiredAt);
        helperMessagesEnabled = enabled;
    };
    
    let showMofuHelper = (message) => {
        // Make Mofu react (smile + look straight) even if messages are disabled
        mofuIsSpeaking = true;
        const mofuHead = document.querySelector('.mofu-head');
        const mofuFeatures = document.querySelector('.mofu-face-features');
        const mofuSmile = document.querySelector('.mofu-smile');
        
        if (mofuHead && mofuFeatures) {
            // Reset to center position (looking straight)
            mofuHead.style.transform = '';
            mofuFeatures.style.transform = '';
            
            // Add attention animation
            mofuHead.classList.add('mofu-attention');
            
            // Make it smile bigger
            if (mofuSmile) {
                mofuSmile.style.width = '10px';
                mofuSmile.style.height = '5px';
                mofuSmile.style.borderWidth = '2px';
            }
            
            setTimeout(() => {
                mofuHead.classList.remove('mofu-attention');
            }, 600);
        }
        
        // If messages are disabled, only do the animation, no bubble
        if (!helperMessagesEnabled) {
            setTimeout(() => {
                mofuIsSpeaking = false;
                // Reset smile to normal
                if (mofuSmile) {
                    mofuSmile.style.width = '7px';
                    mofuSmile.style.height = '3.5px';
                    mofuSmile.style.borderWidth = '1.5px';
                }
            }, 2000);
            return;
        }
        
        // Remove any existing bubble
        const existingBubble = document.querySelector('.mofu-helper-bubble');
        if (existingBubble) {
            existingBubble.remove();
        }

        // Create bubble with message and checkbox
        const bubble = document.createElement('div');
        bubble.className = 'mofu-helper-bubble';
        bubble.innerHTML = `
            <div class="mofu-helper-message">${message}</div>
            <label class="mofu-helper-footer">
                <input type="checkbox" id="mofu-dont-show-again">
                <span>Don't show again</span>
            </label>
        `;
        
        document.body.appendChild(bubble);
        
        // Handle checkbox click
        const checkbox = bubble.querySelector('#mofu-dont-show-again');
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    saveHelperMessagesSetting(false);
                    // Hide bubble immediately
                    bubble.classList.add('hiding');
                    setTimeout(() => {
                        if (bubble.parentNode) {
                            document.body.removeChild(bubble);
                        }
                        mofuIsSpeaking = false;
                        // Reset smile to normal
                        if (mofuSmile) {
                            mofuSmile.style.width = '7px';
                            mofuSmile.style.height = '3.5px';
                            mofuSmile.style.borderWidth = '1.5px';
                        }
                    }, 200);
                }
            });
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.classList.add('hiding');
                setTimeout(() => {
                    if (bubble.parentNode) {
                        document.body.removeChild(bubble);
                    }
                    
                    // Reset Mofu state
                    mofuIsSpeaking = false;
                    
                    // Reset smile to normal
                    if (mofuSmile) {
                        mofuSmile.style.width = '7px';
                        mofuSmile.style.height = '3.5px';
                        mofuSmile.style.borderWidth = '1.5px';
                    }
                }, 200);
            }
        }, 5000);
    };

    // ----- Option 2: Insert formatting buttons -----
    let setupInsertHeaderButton = () => {
        const button = document.querySelector('#insert-header-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertHeaderTemplate();
            showMofuHelper('I\'ve added a <strong>header template</strong> for you! Replace the placeholders with your actual information.');
        });
    };

    let setupInsertFooterButton = () => {
        const button = document.querySelector('#insert-footer-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertFooterTemplate();
            showMofuHelper('I\'ve added a <strong>footer template</strong> for you! Replace the placeholders with your actual information.');
        });
    };

    let setupInsertBreakButton = () => {
        const button = document.querySelector('#insert-break-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertLineBreak();
            showMofuHelper('I\'ve inserted a <strong>page break</strong>! This will create a new page in your PDF export.');
        });
    };

    let setupInsertImageButton = () => {
        const button = document.querySelector('#insert-image-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertImageTemplate();
        });
    };

    let insertImageTemplate = () => {
        // Prompt for image dimensions
        const width = prompt('Enter image width (in pixels, e.g., 300):', '300');
        if (!width) return; // User cancelled
        
        const height = prompt('Enter image height (in pixels, leave empty for auto):', '');
        
        // Build the HTML img tag
        const heightAttr = height ? ` height="${height}"` : '';
        const template = `
<img src="https://via.placeholder.com/${width}x${height || '200'}?text=Your+Image" width="${width}"${heightAttr}>

`;
        
        const model = editor.getModel();
        const position = editor.getPosition();
        
        // Insert at current cursor position
        editor.executeEdits('insert-image', [{
            range: new monaco.Range(
                position.lineNumber, 
                position.column, 
                position.lineNumber, 
                position.column
            ),
            text: template
        }]);
        
        // Select the URL for easy replacement
        setTimeout(() => {
            const newLine = position.lineNumber + 1;
            const srcStart = template.indexOf('src="') + 5;
            const srcEnd = template.indexOf('"', srcStart);
            
            editor.setSelection(new monaco.Selection(
                newLine, srcStart,
                newLine, srcEnd
            ));
            
            editor.revealLineInCenter(newLine);
            editor.focus();
        }, 50);
        
        showMofuHelper(`I've added an <strong>image placeholder</strong> (${width}x${height || 'auto'})! Replace the URL with your image link.`);
    };

    let insertHeaderTemplate = () => {
        const today = new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const template = `# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${today}</div>

---

`;
        
        const model = editor.getModel();
        const content = model.getValue();
        const lines = content.split('\n');
        
        // Check if document starts with YAML front matter
        let insertLine = 1;
        let insertColumn = 1;
        
        if (lines[0] && lines[0].trim() === '---') {
            // Find end of YAML front matter
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '---') {
                    insertLine = i + 2; // Insert after YAML front matter
                    break;
                }
            }
        }
        
        // Always insert at the determined top position
        editor.executeEdits('insert-header', [{
            range: new monaco.Range(insertLine, insertColumn, insertLine, insertColumn),
            text: template
        }]);
        
        // Select "Document Title" text for easy replacement
        setTimeout(() => {
            const titleStartCol = 3; // After "# "
            const titleEndCol = 3 + "Document Title".length;
            
            editor.setSelection(new monaco.Selection(
                insertLine, titleStartCol,
                insertLine, titleEndCol
            ));
            
            editor.focus();
        }, 50);
    };

    let insertFooterTemplate = () => {
        const today = new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const template = `

<div data-pdf-footer="true">

---

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>SIGNATURE</strong><br>
    <span style="color: #666;">Document Name</span>
  </div>
  <div style="text-align: right;">
    <strong>CLIENT</strong><br>
    <span style="color: #666;">${today}</span>
  </div>
</div>

</div>
`;
        
        const model = editor.getModel();
        const lineCount = model.getLineCount();
        const lastLineContent = model.getLineContent(lineCount);
        
        // Always insert at the very end
        const insertLine = lineCount;
        const insertColumn = lastLineContent.length + 1;
        
        editor.executeEdits('insert-footer', [{
            range: new monaco.Range(insertLine, insertColumn, insertLine, insertColumn),
            text: template
        }]);
        
        // Calculate where SIGNATURE will be (line 6 after insertion point)
        const signatureLine = lineCount + 6;
        
        // Select "SIGNATURE" text for easy replacement
        setTimeout(() => {
            const sigStartCol = 13; // After "    <strong>"
            const sigEndCol = 13 + "SIGNATURE".length;
            
            editor.setSelection(new monaco.Selection(
                signatureLine, sigStartCol,
                signatureLine, sigEndCol
            ));
            
            // Scroll to the footer
            editor.revealLineInCenter(signatureLine);
            editor.focus();
        }, 50);
    };

    // Setup dropdown menus to work reliably
    let setupDropdowns = () => {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!dropdownContent) return;
            
            let isOpen = false;
            let closeTimeout = null;
            
            // Check if mouse is within dropdown area (parent or content)
            const isMouseInDropdown = () => {
                const rect = dropdown.getBoundingClientRect();
                return true; // We'll use a different approach
            };
            
            // Open on hover
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
                isOpen = true;
                dropdownContent.style.display = 'block';
            });
            
            // Keep open when hovering over dropdown content
            dropdownContent.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
                isOpen = true;
            });
            
            // Only close when mouse leaves BOTH parent AND content
            const scheduleClose = () => {
                closeTimeout = setTimeout(() => {
                    if (!isOpen) return;
                    isOpen = false;
                    dropdownContent.style.display = 'none';
                }, 150);
            };
            
            dropdown.addEventListener('mouseleave', (e) => {
                // Only close if we're actually leaving the dropdown area
                const rect = dropdown.getBoundingClientRect();
                if (e.clientX < rect.left || e.clientX > rect.right || 
                    e.clientY < rect.top || e.clientY > rect.bottom) {
                    scheduleClose();
                }
            });
            
            dropdownContent.addEventListener('mouseleave', (e) => {
                // Only close if we're actually leaving the content area
                const rect = dropdownContent.getBoundingClientRect();
                if (e.clientX < rect.left || e.clientX > rect.right || 
                    e.clientY < rect.top || e.clientY > rect.bottom) {
                    scheduleClose();
                }
            });
            
            // Toggle on click
            dropdown.addEventListener('click', (e) => {
                // Don't toggle if clicking inside dropdown-content (checkboxes, labels, etc.)
                if (e.target.closest('.dropdown-content')) {

                    return;
                }
                
                clearTimeout(closeTimeout);
                isOpen = !isOpen;
                dropdownContent.style.display = isOpen ? 'block' : 'none';

            });
        });
        
        // Close all dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector('.dropdown-content');
                    if (content) {
                        content.style.display = 'none';
                    }
                });
            }
        });
    };

    // ----- Cheat Sheet Panel (Third Panel) -----
    let cheatSheetVisible = false;
    
    let setupCheatSheetButton = () => {
        const button = document.querySelector('#cheatsheet-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            toggleCheatSheet();
        });
        
        // Setup close button
        const closeBtn = document.querySelector('#cheatsheet-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toggleCheatSheet();
            });
        }
        
        // Populate cheatsheet content
        populateCheatSheetContent();
    };

    let toggleCheatSheet = () => {
        cheatSheetVisible = !cheatSheetVisible;
        
        const panel = document.querySelector('#cheatsheet-panel');
        const divider = document.querySelector('#cheatsheet-divider');
        const container = document.querySelector('#container');
        
        if (cheatSheetVisible) {
            panel.classList.remove('hidden');
            divider.classList.remove('hidden');
            container.classList.add('cheatsheet-visible');
        } else {
            panel.classList.add('hidden');
            divider.classList.add('hidden');
            container.classList.remove('cheatsheet-visible');
        }
        
        // Trigger Monaco editor resize
        if (editor) {
            setTimeout(() => {
                editor.layout();
            }, 350); // Wait for transition to complete
        }
    };

    let populateCheatSheetContent = () => {
        const contentContainer = document.querySelector('#cheatsheet-content');
        if (!contentContainer) return;
        
        const cheatSheetData = [
            {
                section: 'Headers',
                items: [
                    { title: 'H1 Header', code: '# Header 1', type: 'header' },
                    { title: 'H2 Header', code: '## Header 2', type: 'header' },
                    { title: 'H3 Header', code: '### Header 3', type: 'header' }
                ]
            },
            {
                section: 'Text Formatting',
                items: [
                    { title: 'Bold', code: '**bold text**', type: 'inline' },
                    { title: 'Italic', code: '*italic text*', type: 'inline' },
                    { title: 'Bold + Italic', code: '***bold and italic***', type: 'inline' },
                    { title: 'Strikethrough', code: '~~strikethrough~~', type: 'inline' },
                    { title: 'Inline Code', code: '`code`', type: 'inline' }
                ]
            },
            {
                section: 'Lists',
                items: [
                    { title: 'Unordered List', code: '* Item 1\n* Item 2\n  * Nested item', type: 'block' },
                    { title: 'Ordered List', code: '1. First item\n2. Second item\n3. Third item', type: 'block' },
                    { title: 'Task List', code: '- [ ] Unchecked\n- [x] Checked', type: 'block' }
                ]
            },
            {
                section: 'Links & Images',
                items: [
                    { title: 'Link', code: '[Link Text](https://example.com)', type: 'inline' },
                    { title: 'Image', code: '![Alt Text](image.jpg)', type: 'inline' },
                    { title: 'Link with Title', code: '[Link](https://example.com "Title")', type: 'inline' }
                ]
            },
            {
                section: 'Tables',
                items: [
                    { title: 'Basic Table', code: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |', type: 'block' },
                    { title: 'Aligned Table', code: '| Left | Center | Right |\n| :--- | :---: | ---: |\n| L | C | R |', type: 'block' }
                ]
            },
            {
                section: 'Code Blocks',
                items: [
                    { title: 'Code Block', code: '```\ncode here\n```', type: 'block' },
                    { title: 'Code with Language', code: '```javascript\nconst x = 10;\n```', type: 'block' }
                ]
            },
            {
                section: 'Quotes & Breaks',
                items: [
                    { title: 'Blockquote', code: '> This is a quote\n> Multiple lines', type: 'block' },
                    { title: 'Horizontal Rule', code: '---', type: 'block' },
                    { title: 'Line Break', code: 'Line 1  \nLine 2', type: 'inline' }
                ]
            },
            {
                section: 'Document Structure',
                items: [
                    { title: 'Header with Date', code: '# Document Title\n\n<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">11 Feb 2026</div>\n\n---', type: 'block' },
                    { title: 'Footer', code: '---\n\n<div style="display: flex; justify-content: space-between; margin-top: 20px;">\n  <div>\n    <strong>SIGNATURE</strong><br>\n    <span style="color: #666;">Document Name</span>\n  </div>\n  <div style="text-align: right;">\n    <strong>CLIENT</strong><br>\n    <span style="color: #666;">11 Feb 2026</span>\n  </div>\n</div>', type: 'block' }
                ]
            },
            {
                section: 'YAML Metadata',
                items: [
                    { title: 'Document Metadata', code: '---\ntitle: Document Title\ndate: 11 Feb 2026\nfooter-left: SIGNATURE\nfooter-right: CLIENT\n---', type: 'yaml' }
                ]
            }
        ];
        
        let contentHtml = '';
        cheatSheetData.forEach(section => {
            contentHtml += `<div class="cheatsheet-section">
                <h4>${section.section}</h4>`;
            
            section.items.forEach((item, idx) => {
                const itemId = `cheat-${section.section.replace(/\s/g, '-')}-${idx}`;
                contentHtml += `
                <div class="cheatsheet-item">
                    <div class="cheatsheet-item-header">
                        <span class="cheatsheet-item-title">${item.title}</span>
                        <div class="cheatsheet-item-actions">
                            <button class="cheatsheet-insert-btn" data-code="${itemId}" data-type="${item.type}">Insert</button>
                            <button class="cheatsheet-copy-btn" data-code="${itemId}">Copy</button>
                        </div>
                    </div>
                    <div class="cheatsheet-code" id="${itemId}">${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                </div>`;
            });
            
            contentHtml += '</div>';
        });
        
        contentContainer.innerHTML = contentHtml;
        
        // Add insert button handlers
        contentContainer.querySelectorAll('.cheatsheet-insert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeId = e.target.getAttribute('data-code');
                const type = e.target.getAttribute('data-type');
                const codeElement = document.getElementById(codeId);
                const code = codeElement.textContent;
                
                insertSyntaxAtCursor(code, type);
                
                e.target.textContent = 'Inserted!';
                e.target.classList.add('inserted');
                setTimeout(() => {
                    e.target.textContent = 'Insert';
                    e.target.classList.remove('inserted');
                }, 1500);
            });
        });
        
        // Add copy button handlers
        contentContainer.querySelectorAll('.cheatsheet-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeId = e.target.getAttribute('data-code');
                const codeElement = document.getElementById(codeId);
                const code = codeElement.textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    e.target.textContent = 'Copied!';
                    e.target.classList.add('copied');
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                        e.target.classList.remove('copied');
                    }, 2000);
                }).catch(() => {
                    e.target.textContent = 'Failed';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    };

    // Intelligent syntax insertion at cursor
    let insertSyntaxAtCursor = (code, type) => {
        if (!editor) return;
        
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineContent = model.getLineContent(position.lineNumber);
        const lineLength = lineContent.length;
        const isLineEmpty = lineContent.trim() === '';
        const isAtLineStart = position.column === 1;
        const isAtLineEnd = position.column > lineLength;
        
        let insertText = code;
        let insertPosition = position;
        let needsNewlineBefore = false;
        let needsNewlineAfter = false;
        
        // Determine insertion strategy based on type and context
        if (type === 'yaml') {
            // YAML front matter must be at document start
            if (position.lineNumber !== 1 || !isAtLineStart) {
                // Move to document start
                insertPosition = new monaco.Position(1, 1);
                // If document isn't empty, add newline after YAML
                if (model.getLineCount() > 1 || !isLineEmpty) {
                    insertText = code + '\n\n';
                }
            }
        } else if (type === 'block') {
            // Block elements need their own lines
            if (!isLineEmpty) {
                if (isAtLineEnd) {
                    // At end of non-empty line - add newlines before and after
                    insertText = '\n\n' + code + '\n\n';
                } else if (isAtLineStart) {
                    // At start of non-empty line - add newline after
                    insertText = code + '\n\n';
                } else {
                    // Middle of line - go to end, then add newlines
                    insertPosition = new monaco.Position(position.lineNumber, lineLength + 1);
                    insertText = '\n\n' + code + '\n\n';
                }
            } else {
                // Empty line - just insert with newline after
                insertText = code + '\n\n';
            }
        } else if (type === 'header') {
            // Headers need their own line
            if (!isLineEmpty) {
                if (isAtLineEnd) {
                    // At end of line - add newlines
                    insertText = '\n\n' + code + '\n\n';
                } else if (isAtLineStart) {
                    // At start - insert and add newline after
                    insertText = code + '\n\n';
                } else {
                    // Middle - go to end first
                    insertPosition = new monaco.Position(position.lineNumber, lineLength + 1);
                    insertText = '\n\n' + code + '\n\n';
                }
            } else {
                // Empty line - just insert with newline after
                insertText = code + '\n\n';
            }
        } else if (type === 'inline') {
            // Inline elements can be inserted anywhere
            // Just insert at cursor position
            insertText = code;
        }
        
        // Perform the insertion
        editor.executeEdits('insert-syntax', [{
            range: new monaco.Range(
                insertPosition.lineNumber,
                insertPosition.column,
                insertPosition.lineNumber,
                insertPosition.column
            ),
            text: insertText
        }]);
        
        // Move cursor to a sensible position
        if (type === 'inline') {
            // For inline, select the placeholder text if any
            if (code.includes('text') || code.includes('Link') || code.includes('Alt')) {
                // Try to select the placeholder
                const newPos = new monaco.Position(
                    insertPosition.lineNumber,
                    insertPosition.column + code.indexOf('text') > -1 ? code.indexOf('text') : 
                    code.indexOf('Link') > -1 ? code.indexOf('Link') : 
                    code.indexOf('Alt') > -1 ? code.indexOf('Alt') : 0
                );
                editor.setPosition(newPos);
            } else {
                // Just move cursor after insertion
                editor.setPosition(new monaco.Position(
                    insertPosition.lineNumber,
                    insertPosition.column + code.length
                ));
            }
        } else {
            // For block elements, move to the content area
            const lines = insertText.split('\n');
            const targetLine = insertPosition.lineNumber + (insertText.startsWith('\n\n') ? 2 : 0);
            editor.setPosition(new monaco.Position(targetLine, 1));
        }
        
        editor.focus();
    };

    let insertLineBreak = () => {
        const model = editor.getModel();
        const position = editor.getPosition();
        const currentLine = model.getLineContent(position.lineNumber);
        
        // Page break should be inserted intelligently based on context
        let insertLine = position.lineNumber;
        let insertColumn = 1;
        let insertText = '';
        
        // If we're in the middle of text, move to next line
        if (currentLine.trim() !== '') {
            insertLine = position.lineNumber + 1;
            insertText = '\n<div style="page-break-after: always;"></div>\n\n';
        } else {
            // We're on an empty line
            insertText = '<div style="page-break-after: always;"></div>\n\n';
        }
        
        editor.executeEdits('insert-break', [{
            range: new monaco.Range(insertLine, insertColumn, insertLine, insertColumn),
            text: insertText
        }]);
        
        // Move cursor to after the page break
        const newCursorLine = insertLine + (currentLine.trim() !== '' ? 3 : 2);
        setTimeout(() => {
            editor.setPosition({ lineNumber: newCursorLine, column: 1 });
            editor.focus();
        }, 50);
    };

    // ----- TOC (Table of Contents) -----
    
    let tocVisible = false;
    let currentTocData = [];
    
    let setupTocCheckbox = () => {
        const checkbox = document.querySelector('#toc-checkbox');
        if (!checkbox) return;
        
        // Load saved setting
        const savedSetting = loadTocSettings();
        
        if (savedSetting !== null && savedSetting !== undefined && savedSetting !== false) {
            tocEnabled = savedSetting;
            checkbox.checked = savedSetting;
            // Delay toggle to ensure editor is ready
            setTimeout(() => {
                if (savedSetting) {
                    toggleToc();
                }
            }, 500);
        }
        
        checkbox.addEventListener('change', (event) => {
            tocEnabled = event.currentTarget.checked;
            saveTocSettings(tocEnabled);
            toggleToc();
        });
        
        // Setup close button
        const closeBtn = document.querySelector('#toc-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                tocEnabled = false;
                checkbox.checked = false;
                saveTocSettings(false);
                toggleToc();
            });
        }
    };
    
    let toggleToc = () => {

        tocVisible = tocEnabled;
        
        const panel = document.querySelector('#toc-panel');
        const container = document.querySelector('#container');
        

        
        if (tocVisible) {

            panel.classList.remove('hidden');
            container.classList.add('toc-visible');
            updateToc();
        } else {

            panel.classList.add('hidden');
            container.classList.remove('toc-visible');
        }
        
        // Trigger Monaco editor resize
        if (editor) {
            setTimeout(() => {
                editor.layout();
            }, 350);
        }
    };
    
    // ----- Markdown Validation -----
    
    let setupValidationCheckbox = () => {
        const checkbox = document.querySelector('#validation-checkbox');
        const exportLink = document.querySelector('#export-validation-link');
        // Auto-fix button is always visible, no need to control it here
        
        if (!checkbox) return;
        
        // Load saved setting
        const savedSetting = loadValidationSettings();
        
        if (savedSetting !== null && savedSetting !== undefined) {
            checkbox.checked = savedSetting;
            if (editor && editor._setValidationEnabled) {
                editor._setValidationEnabled(savedSetting);
            }
            // Show/hide export link based on validation state
            if (exportLink) {
                exportLink.style.display = savedSetting ? 'block' : 'none';
            }
        }
        
        checkbox.addEventListener('change', (event) => {
            const enabled = event.currentTarget.checked;
            saveValidationSettings(enabled);
            if (editor && editor._setValidationEnabled) {
                editor._setValidationEnabled(enabled);
            }
            // Show/hide export link
            if (exportLink) {
                exportLink.style.display = enabled ? 'block' : 'none';
            }
        });
    };
    
    // Edit Mode state and setup
    let editModeEnabled = false;
    const localStorageEditModeKey = 'edit_mode';
    
    const loadEditModeSettings = () => {
        const saved = Storehouse.getItem(localStorageNamespace, localStorageEditModeKey);
        return saved === true;
    };
    
    const saveEditModeSettings = (enabled) => {
        Storehouse.setItem(localStorageNamespace, localStorageEditModeKey, enabled);
    };
    
    let setupEditModeCheckbox = () => {
        const checkbox = document.querySelector('#edit-mode-checkbox');
        if (!checkbox) return;
        
        // Load saved setting
        editModeEnabled = loadEditModeSettings();
        checkbox.checked = editModeEnabled;
        
        // Apply initial state
        if (editModeEnabled) {
            document.documentElement.classList.add('edit-mode-active');
        }
        
        checkbox.addEventListener('change', (event) => {
            editModeEnabled = event.currentTarget.checked;
            saveEditModeSettings(editModeEnabled);
            
            if (editModeEnabled) {
                document.documentElement.classList.add('edit-mode-active');
                applyEditMode();
            } else {
                document.documentElement.classList.remove('edit-mode-active');
                removeEditMode();
            }
        });
    };
    
    // Initialize Turndown for HTML to Markdown conversion
    let turndownService = null;
    if (window.TurndownService) {
        turndownService = new window.TurndownService({
            headingStyle: 'atx',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced'
        });
    }
    
    // Handle contenteditable input and sync to editor
    const handleContentEditableInput = (element) => {
        if (!turndownService || !editor) return;
        
        // Get the source line number from data attribute
        const sourceLine = element.getAttribute('data-source-line');
        if (!sourceLine) return;
        
        const lineNumber = parseInt(sourceLine, 10);
        if (isNaN(lineNumber)) return;
        
        // Convert edited HTML back to Markdown
        const htmlContent = element.innerHTML;
        let markdownContent = turndownService.turndown(htmlContent);
        
        // Handle heading levels
        const tagName = element.tagName.toLowerCase();
        if (tagName.match(/^h[1-6]$/)) {
            const level = parseInt(tagName[1], 10);
            const prefix = '#'.repeat(level);
            // Ensure heading has proper prefix
            if (!markdownContent.startsWith(prefix)) {
                markdownContent = `${prefix} ${markdownContent}`;
            }
        }
        
        // Handle blockquotes
        if (tagName === 'blockquote') {
            const lines = markdownContent.split('\n');
            markdownContent = lines.map(line => line.startsWith('>') ? line : `> ${line}`).join('\n');
        }
        
        // Update the editor at the specific line
        const model = editor.getModel();
        if (!model) return;
        
        const lineContent = model.getLineContent(lineNumber);
        const range = new monaco.Range(lineNumber, 1, lineNumber, lineContent.length + 1);
        
        // Apply edit without triggering cursor sync
        const edit = { range, text: markdownContent };
        model.pushEditOperations([], [edit], () => null);
    };
    
    // Apply edit mode to preview elements
    const applyEditMode = () => {
        const output = document.querySelector('#output');
        if (!output) return;
        
        // Make block elements contenteditable
        const elements = output.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote');
        elements.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            
            // Store handler reference for later removal
            const inputHandler = (e) => {
                handleContentEditableInput(e.target);
            };
            el._editModeInputHandler = inputHandler;
            el.addEventListener('input', inputHandler);
            
            // Store original content for comparison
            el.setAttribute('data-original-html', el.innerHTML);
        });
    };
    
    // Remove edit mode from preview elements
    const removeEditMode = () => {
        const output = document.querySelector('#output');
        if (!output) return;
        
        const elements = output.querySelectorAll('[contenteditable="true"]');
        elements.forEach(el => {
            el.removeAttribute('contenteditable');
            el.removeAttribute('data-original-html');
            
            // Remove event listener using stored reference
            if (el._editModeInputHandler) {
                el.removeEventListener('input', el._editModeInputHandler);
                delete el._editModeInputHandler;
            }
        });
    };
    
    let loadValidationSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageValidationKey);
        return last === null ? true : last; // Default to true
    };
    
    let saveValidationSettings = (enabled) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageValidationKey, enabled, expiredAt);
    };
    
    let generateTocData = () => {

        const content = editor ? editor.getValue() : '';

        
        const lines = content.split('\n');

        
        const tocItems = [];
        let inCodeBlock = false;
        let inYamlFrontMatter = false;
        
        lines.forEach((line, index) => {
            // Track YAML front matter
            if (index === 0 && line.trim() === '---') {
                inYamlFrontMatter = true;

                return;
            }
            if (inYamlFrontMatter && line.trim() === '---') {
                inYamlFrontMatter = false;

                return;
            }
            if (inYamlFrontMatter) return;
            
            // Track code blocks
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;

                return;
            }
            
            // Skip if in code block
            if (inCodeBlock) return;
            
            // Match headers (# to ######) - allow optional space and handle \r\n line endings
            const trimmedLine = line.replace(/\r$/, ''); // Remove trailing \r
            const headerMatch = trimmedLine.match(/^(#{1,6})\s*(.+)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const text = headerMatch[2].trim();
                

                
                // Skip empty headings
                if (!text) {

                    return;
                }
                
                const id = text.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                tocItems.push({
                    level: level,
                    text: text,
                    id: id,
                    line: index + 1
                });
            }
        });
        

        return tocItems;
    };
    
    let updateToc = () => {

        
        if (!tocVisible) {

            return;
        }
        
        const tocContent = document.querySelector('#toc-content');
        if (!tocContent) {

            return;
        }
        

        currentTocData = generateTocData();
        
        if (currentTocData.length === 0) {

            tocContent.innerHTML = '<div class="toc-empty">No headings found in document</div>';
            return;
        }
        

        
        // Build hierarchical tree structure
        const buildTree = (items) => {
            const root = { children: [], level: 0 };
            const stack = [root];
            
            items.forEach(item => {
                const node = { ...item, children: [] };
                
                // Find parent - pop stack until we find a level less than current
                while (stack.length > 1 && stack[stack.length - 1].level >= item.level) {
                    stack.pop();
                }
                
                // Add to parent's children
                stack[stack.length - 1].children.push(node);
                
                // Push current node to stack
                stack.push(node);
            });
            
            return root.children;
        };
        
        // Render tree recursively
        const renderTree = (nodes, parentLevel = 0) => {
            if (!nodes || nodes.length === 0) return '';
            
            let html = '<ul class="toc-tree-list">';
            
            nodes.forEach(node => {
                const hasChildren = node.children && node.children.length > 0;
                const collapseIcon = hasChildren 
                    ? `<button class="toc-collapse-btn" data-collapsed="false" aria-label="Collapse">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-minus">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-plus" style="display: none;">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="12" y1="8" x2="12" y2="16"></line>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                       </button>`
                    : '<span class="toc-spacer"></span>';
                
                html += `<li class="toc-tree-item toc-h${node.level}" data-level="${node.level}">
                    <div class="toc-item-row">
                        ${collapseIcon}
                        <a href="#" class="toc-link" data-line="${node.line}" data-id="${node.id}">
                            ${node.text}
                        </a>
                    </div>`;
                
                if (hasChildren) {
                    html += `<div class="toc-children">${renderTree(node.children, node.level)}</div>`;
                }
                
                html += '</li>';
            });
            
            html += '</ul>';
            return html;
        };
        
        const tree = buildTree(currentTocData);
        tocContent.innerHTML = renderTree(tree);
        
        // Add click handlers for links
        tocContent.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const line = parseInt(e.target.getAttribute('data-line'));
                if (editor && line) {
                    editor.setPosition({ lineNumber: line, column: 1 });
                    editor.revealLineInCenter(line);
                    editor.focus();
                    
                    // Update active state
                    tocContent.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        });
        
        // Add click handlers for collapse/expand buttons
        tocContent.querySelectorAll('.toc-collapse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isCollapsed = btn.getAttribute('data-collapsed') === 'true';
                const treeItem = btn.closest('.toc-tree-item');
                const childrenContainer = treeItem.querySelector(':scope > .toc-children');
                const minusIcon = btn.querySelector('.toc-icon-minus');
                const plusIcon = btn.querySelector('.toc-icon-plus');
                
                if (isCollapsed) {
                    // Expand
                    btn.setAttribute('data-collapsed', 'false');
                    childrenContainer.style.maxHeight = childrenContainer.scrollHeight + 'px';
                    minusIcon.style.display = 'block';
                    plusIcon.style.display = 'none';
                    
                    // After animation, set to auto for dynamic content
                    setTimeout(() => {
                        if (btn.getAttribute('data-collapsed') === 'false') {
                            childrenContainer.style.maxHeight = 'none';
                        }
                    }, 300);
                } else {
                    // Collapse
                    // Set explicit height first for animation
                    childrenContainer.style.maxHeight = childrenContainer.scrollHeight + 'px';
                    // Force reflow
                    childrenContainer.offsetHeight;
                    // Then collapse
                    childrenContainer.style.maxHeight = '0';
                    btn.setAttribute('data-collapsed', 'true');
                    minusIcon.style.display = 'none';
                    plusIcon.style.display = 'block';
                }
            });
        });
    };
    
    let getTocForPdf = () => {
        const tocData = generateTocData();
        if (tocData.length === 0) return null;
        
        return tocData;
    };

    // ----- local state -----

    let loadLastContent = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageKey);
        return lastContent;
    };

    let saveLastContent = (content) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageKey, content, expiredAt);
    };

    let loadScrollBarSettings = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageScrollBarKey);
        return lastContent;
    };

    let loadThemeSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageThemeKey);
        if (last === null || last === undefined) {
            try {
                // fallback to raw localStorage boot key used by inline script
                const raw = localStorage.getItem('com.markdownlivepreview_theme');
                if (raw === 'dark') return true;
                if (raw === 'light') return false;
            } catch (e) {
                // ignore
            }
        }
        return last;
    };

    let saveScrollBarSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageScrollBarKey, settings, expiredAt);
    };

    let loadCursorSyncSettings = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageCursorSyncKey);
        return lastContent;
    };

    let saveCursorSyncSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageCursorSyncKey, settings, expiredAt);
    };

    let saveThemeSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageThemeKey, settings, expiredAt);
        try {
            localStorage.setItem('com.markdownlivepreview_theme', settings ? 'dark' : 'light');
        } catch (e) {
            // ignore storage errors
        }
    };

    let loadStyleSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageStyleKey);
        return last || 'github'; // default to github style
    };

    let saveStyleSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageStyleKey, settings, expiredAt);
        try {
            localStorage.setItem('com.markdownlivepreview.style_settings', settings);
        } catch (e) {
            // ignore storage errors
        }
    };

    let loadFlipPanelsSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageFlipPanelsKey);
        return last || false;
    };

    let saveFlipPanelsSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageFlipPanelsKey, settings, expiredAt);
    };

    let loadVerticalLayoutSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageVerticalLayoutKey);
        return last || false;
    };

    let saveVerticalLayoutSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageVerticalLayoutKey, settings, expiredAt);
    };

    let loadTocSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageTocKey);
        return last || false;
    };

    let saveTocSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageTocKey, settings, expiredAt);
    };

    let setupDivider = () => {
        let lastLeftRatio = 0.5;
        let lastTopRatio = 0.5;
        const divider = document.getElementById('split-divider');
        const editorPane = document.getElementById('edit');
        const previewPane = document.getElementById('preview');
        const container = document.getElementById('container');

        if (!divider || !editorPane || !previewPane) return;

        const isVerticalLayout = () => {
            return container.classList.contains('vertical');
        };

        const isFlipped = () => {
            return container.classList.contains('flipped');
        };

        const getAvailableWidth = () => {
            const containerRect = container.getBoundingClientRect();
            return containerRect.width;
        };

        const getAvailableHeight = () => {
            const containerRect = container.getBoundingClientRect();
            return containerRect.height;
        };

        divider.addEventListener('mouseenter', () => {
            divider.classList.add('hover');
        });

        divider.addEventListener('mouseleave', () => {
            divider.classList.remove('hover');
        });

        divider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            
            // Store initial divider position for delta calculation
            const dividerRect = divider.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const isVertical = isVerticalLayout();
            
            // Calculate initial left width (editor width in normal layout)
            let initialLeftWidth, initialTopHeight, initialDividerPos;
            
            if (isVertical) {
                // Vertical layout - use height and top position
                if (isFlipped()) {
                    initialTopHeight = previewPane.offsetHeight;
                } else {
                    initialTopHeight = editorPane.offsetHeight;
                }
                initialDividerPos = dividerRect.top - containerRect.top;
            } else {
                // Horizontal layout - use width and left position
                if (isFlipped()) {
                    initialLeftWidth = previewPane.offsetWidth;
                } else {
                    initialLeftWidth = editorPane.offsetWidth;
                }
                initialDividerPos = dividerRect.left - containerRect.left;
            }
            
            // Set up the active resizer with all needed references
            activeResizer = {
                divider: divider,
                leftPane: isFlipped() ? previewPane : editorPane,
                rightPane: isFlipped() ? editorPane : previewPane,
                container: container,
                lastLeftRatio: lastLeftRatio,
                lastTopRatio: lastTopRatio,
                isVertical: isVertical,
                isFlipped: isFlipped(),
                getAvailableWidth: getAvailableWidth,
                getAvailableHeight: getAvailableHeight,
                initialLeftWidth: initialLeftWidth || 0,
                initialTopHeight: initialTopHeight || 0,
                initialDividerX: isVertical ? 0 : initialDividerPos,
                initialDividerY: isVertical ? initialDividerPos : 0
            };
            
            document.body.classList.add('dragging');
            divider.classList.add('active');
            
            if (activeResizer.isVertical) {
                document.body.style.cursor = 'row-resize';
            } else {
                document.body.style.cursor = 'col-resize';
            }
        });

        divider.addEventListener('dblclick', () => {
            if (isVerticalLayout()) {
                // Vertical layout - split height equally
                const totalHeight = getAvailableHeight();
                const dividerHeight = divider.offsetHeight;
                const halfHeight = (totalHeight - dividerHeight) / 2;

                editorPane.style.height = halfHeight + 'px';
                previewPane.style.height = halfHeight + 'px';
                editorPane.style.width = '';
                previewPane.style.width = '';
            } else {
                // Horizontal layout - split width equally
                const totalWidth = getAvailableWidth();
                const dividerWidth = divider.offsetWidth;
                const halfWidth = (totalWidth - dividerWidth) / 2;

                editorPane.style.width = halfWidth + 'px';
                previewPane.style.width = halfWidth + 'px';
                editorPane.style.height = '';
                previewPane.style.height = '';
            }
        });
    };

    let setupCheatsheetDivider = () => {
        let lastCheatsheetWidth = 300;
        const divider = document.getElementById('cheatsheet-divider');
        const cheatsheetPane = document.querySelector('.cheatsheet-pane');
        const container = document.getElementById('container');

        if (!divider || !cheatsheetPane) return;

        const getAvailableWidth = () => {
            const containerRect = container.getBoundingClientRect();
            return containerRect.width;
        };

        divider.addEventListener('mouseenter', () => {
            divider.classList.add('hover');
        });

        divider.addEventListener('mouseleave', () => {
            divider.classList.remove('hover');
        });

        divider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            
            // Store initial positions for delta calculation
            const dividerRect = divider.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const initialCheatsheetWidth = cheatsheetPane.offsetWidth;
            
            // Set up the active resizer
            activeResizer = {
                divider: divider,
                leftPane: cheatsheetPane,
                rightPane: null,
                container: container,
                lastLeftRatio: lastCheatsheetWidth / getAvailableWidth(),
                lastTopRatio: 0,
                isVertical: false,
                isFlipped: false,
                getAvailableWidth: getAvailableWidth,
                getAvailableHeight: () => 0,
                initialLeftWidth: initialCheatsheetWidth,
                initialDividerX: dividerRect.left - containerRect.left
            };
            
            document.body.classList.add('dragging');
            divider.classList.add('active');
            document.body.style.cursor = 'col-resize';
        });
    };

    // ----- entry point -----
    let lastContent = loadLastContent();
    editor = setupEditor(); // editor already declared at top scope
    
    // Expose editor globally for testing
    window.editor = editor;
    
    if (lastContent) {
        presetValue(lastContent);
    } else {
        presetValue(defaultInput);
    }
    
    // Initialize undo history with current content
    saveToUndoHistory(editor.getValue());
    
    // Add keyboard shortcuts for custom undo/redo
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
        performUndo();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, () => {
        performRedo();
    });
    
    // Also support Ctrl+Y for redo on Windows
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
        performRedo();
    });
    
    // Save to history on typing pause (300ms debounce for responsive undo/redo)
    let typingTimer;
    editor.onDidChangeModelContent(() => {
        // Don't save to history if we're performing undo/redo
        if (isPerformingUndoRedo) return;
        
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            const currentContent = editor.getValue();
            // Only save if content actually changed from last history entry
            if (undoHistory.length === 0 || undoHistory[undoHistoryIndex] !== currentContent) {
                saveToUndoHistory(currentContent);
            }
        }, 300); // 300ms debounce - saves quickly after user stops typing
    });
    
    setupClearButton();
    setupPasteButton();
    setupCopyButton(editor);
    setupUndoButton();
    setupRedoButton();
    setupBeautifyButton();
    setupExportButton();
    setupPrintPdfButton();
    setupExportHtmlButton();
    setupExportMarkdownButton(editor);
    setupImportMarkdownButton(editor);
    setupPdfSettingsButton();
    setupInsertHeaderButton();
    setupInsertFooterButton();
    setupInsertImageButton();
    setupInsertBreakButton();
    setupDropdowns();
    setupCheatSheetButton();
    setupTocCheckbox();
    setupValidationCheckbox();
    setupEditModeCheckbox();
    
    // Setup validation link click handlers
    const autofixLink = document.querySelector('#autofix-validation-link');
    const exportLink = document.querySelector('#export-validation-link');
    
    if (autofixLink) {
        autofixLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[DEBUG] Autofix link clicked');
            
            // Enable validation if not already enabled
            const validationCheckbox = document.querySelector('#validation-checkbox');
            if (validationCheckbox && !validationCheckbox.checked) {
                validationCheckbox.checked = true;
                validationCheckbox.dispatchEvent(new Event('change'));
                console.log('[DEBUG] Validation auto-enabled');
            }
            
            console.log('[DEBUG] Editor exists:', !!editor);
            console.log('[DEBUG] _interactiveFixWizard exists:', !!(editor && editor._interactiveFixWizard));
            
            if (editor && editor._interactiveFixWizard) {
                console.log('[DEBUG] Calling _interactiveFixWizard');
                editor._interactiveFixWizard();
            } else {
                console.error('[DEBUG] Cannot call _interactiveFixWizard - editor or function not available');
            }
        });
    } else {
        console.error('[DEBUG] Autofix link not found in DOM');
    }
    
    if (exportLink) {
        exportLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[DEBUG] Export validation link clicked');
            
            if (editor && editor._exportValidationErrors) {
                const report = editor._exportValidationErrors();
                navigator.clipboard.writeText(report).then(() => {
                    showMofuHelper('Validation report copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showMofuHelper('Failed to copy report');
                });
            }
        });
    }
    
    // Force update validation link visibility after editor is ready
    setTimeout(() => {
        const checkbox = document.querySelector('#validation-checkbox');
        const exportLink = document.querySelector('#export-validation-link');
        if (checkbox && checkbox.checked) {
            if (exportLink) exportLink.style.display = 'block';
        }
    }, 100);
    
    // Load PDF settings
    loadPdfSettings();

    let scrollBarSettings = loadScrollBarSettings() || false;
    initScrollBarSync(scrollBarSettings);

    let cursorSyncSettings = loadCursorSyncSettings();
    // Default to true if not set
    if (cursorSyncSettings === null || cursorSyncSettings === undefined) {
        cursorSyncSettings = true;
    }
    initCursorSync(cursorSyncSettings);

    // initialize word wrap
    let wordWrapSettings = localStorage.getItem('com.markdownlivepreview.word_wrap');
    if (wordWrapSettings === null) {
        wordWrapSettings = true; // Default to enabled
    } else {
        wordWrapSettings = wordWrapSettings === 'true';
    }
    const wordWrapCheckbox = document.querySelector('#word-wrap-checkbox');
    if (wordWrapCheckbox) {
        wordWrapCheckbox.checked = wordWrapSettings;
        editor.updateOptions({ wordWrap: wordWrapSettings ? 'on' : 'off' });
        
        wordWrapCheckbox.addEventListener('change', (event) => {
            const enabled = event.currentTarget.checked;
            editor.updateOptions({ wordWrap: enabled ? 'on' : 'off' });
            localStorage.setItem('com.markdownlivepreview.word_wrap', enabled);
        });
    }

    // initialize helper messages
    let helperMessagesSettings = loadHelperMessagesSetting();
    initHelperMessagesToggle(helperMessagesSettings);
    
    // initialize style tooltips toggle
    initStyleTooltipsToggle();

    // initialize theme (dark/light)
    let themeSettings = loadThemeSettings();

    // ============================================================================
    // STATUS BAR FUNCTIONALITY
    // ============================================================================
    
    // PDF estimate click handler
    document.getElementById('status-pdf-estimate').addEventListener('click', () => {
        const words = parseInt(document.getElementById('status-word-count').textContent);
        const pages = Math.max(1, Math.ceil(words / 500));
        const message = `PDF Page Estimate\n\nBased on approximately 500 words per page:\n${words} words ≈ ${pages} page${pages !== 1 ? 's' : ''}\n\nNote: Actual page count may vary based on:\n• Font size and family\n• Line height\n• Images and tables\n• Margins and spacing`;
        alert(message);
    });
    
    // Initial status bar update
    updateStatusBar();
    
    // ============================================================================
    // PAPER LAYOUT FUNCTIONALITY
    // ============================================================================
    
    const localStoragePaperLayoutKey = 'paper_layout_settings';
    const localStoragePageSetupKey = 'page_setup_settings';
    
    // Load paper layout settings
    const loadPaperLayoutSettings = () => {
        try {
            const stored = localStorage.getItem(`${localStorageNamespace}.${localStoragePaperLayoutKey}`);
            if (stored) {
                const settings = JSON.parse(stored);
                previewLayout = settings.layout || 'web';
                paperZoomLevel = settings.zoom || 100;
            }
        } catch (e) {
            console.error('Failed to load paper layout settings:', e);
        }
    };
    
    // Load page setup settings
    const loadPageSetupSettings = () => {
        try {
            const stored = localStorage.getItem(`${localStorageNamespace}.${localStoragePageSetupKey}`);
            if (stored) {
                pageSetup = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load page setup settings:', e);
        }
        
        // Return settings with margins in mm for PDF export
        return {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            margins: {
                top: (pageSetup.marginTop || 2.54) * 10,    // Convert cm to mm
                right: (pageSetup.marginRight || 2.54) * 10,
                bottom: (pageSetup.marginBottom || 2.54) * 10,
                left: (pageSetup.marginLeft || 2.54) * 10
            }
        };
    };
    
    // Save page setup settings
    const savePageSetupSettings = () => {
        try {
            localStorage.setItem(`${localStorageNamespace}.${localStoragePageSetupKey}`, JSON.stringify(pageSetup));
        } catch (e) {
            console.error('Failed to save page setup settings:', e);
        }
    };
    
    // Save paper layout settings
    const savePaperLayoutSettings = () => {
        try {
            const settings = { layout: previewLayout, zoom: paperZoomLevel };
            localStorage.setItem(`${localStorageNamespace}.${localStoragePaperLayoutKey}`, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save paper layout settings:', e);
        }
    };
    
    // Update preview layout
    const updatePreviewLayout = () => {
        const previewPanel = document.querySelector('.preview-pane');
        const paperControls = document.querySelector('.paper-controls');
        const layoutModeLabel = document.getElementById('status-layout-mode');
        const outputDiv = document.querySelector('#output');
        
        if (previewLayout === 'paper') {
            if (previewPanel) previewPanel.classList.add('paper-layout');
            if (paperControls) paperControls.classList.add('visible');
            if (layoutModeLabel) layoutModeLabel.textContent = 'Paper Layout';
            if (outputDiv) {
                outputDiv.classList.add('paper-layout-active');
                applyPaperZoom();
            }
        } else {
            if (previewPanel) previewPanel.classList.remove('paper-layout');
            if (paperControls) paperControls.classList.remove('visible');
            if (layoutModeLabel) layoutModeLabel.textContent = 'Web Layout';
            if (outputDiv) {
                outputDiv.classList.remove('paper-layout-active');
            }
        }
        
        // Re-render markdown with new layout
        if (editor) {
            const currentContent = editor.getValue();
            convert(currentContent);
        }
    };
    
    // Zoom in
    const zoomIn = () => {
        if (paperZoomLevel < 200) {
            paperZoomLevel += 10;
            applyPaperZoom();
            savePaperLayoutSettings();
        }
    };
    
    // Zoom out
    const zoomOut = () => {
        if (paperZoomLevel > 50) {
            paperZoomLevel -= 10;
            applyPaperZoom();
            savePaperLayoutSettings();
        }
    };
    
    // Fit to width
    const fitToWidth = () => {
        const previewPanel = document.querySelector('.preview-pane');
        if (!previewPanel) return;
        
        const panelWidth = previewPanel.clientWidth;
        const pageWidth = pageSetup.width * 37.795275591; // cm to pixels
        const padding = 40;
        
        const scale = ((panelWidth - padding) / pageWidth) * 100;
        paperZoomLevel = Math.max(50, Math.min(200, Math.round(scale)));
        applyPaperZoom();
        savePaperLayoutSettings();
    };
    
    // Reset to 100%
    const resetZoom = () => {
        paperZoomLevel = 100;
        applyPaperZoom();
        savePaperLayoutSettings();
    };
    
    // Toggle paper layout
    const togglePaperLayout = () => {
        previewLayout = previewLayout === 'web' ? 'paper' : 'web';
        savePaperLayoutSettings();
        updatePreviewLayout();
    };
    
    // Page setup modal
    const openPageSetupModal = () => {
        const modal = document.getElementById('page-setup-modal');
        if (modal) {
            // Populate current values
            document.getElementById('page-width').value = pageSetup.width;
            document.getElementById('page-height').value = pageSetup.height;
            document.getElementById('margin-top').value = pageSetup.marginTop;
            document.getElementById('margin-bottom').value = pageSetup.marginBottom;
            document.getElementById('margin-left').value = pageSetup.marginLeft;
            document.getElementById('margin-right').value = pageSetup.marginRight;
            modal.classList.add('visible');
        }
    };
    
    const closePageSetupModal = () => {
        const modal = document.getElementById('page-setup-modal');
        if (modal) modal.classList.remove('visible');
    };
    
    const savePageSetup = () => {
        pageSetup.width = parseFloat(document.getElementById('page-width').value) || 21.0;
        pageSetup.height = parseFloat(document.getElementById('page-height').value) || 29.7;
        pageSetup.marginTop = parseFloat(document.getElementById('margin-top').value) || 4.5;
        pageSetup.marginBottom = parseFloat(document.getElementById('margin-bottom').value) || 2.54;
        pageSetup.marginLeft = parseFloat(document.getElementById('margin-left').value) || 2.54;
        pageSetup.marginRight = parseFloat(document.getElementById('margin-right').value) || 1.47;
        
        savePageSetupSettings();
        closePageSetupModal();
        
        // Re-render if in paper mode
        if (previewLayout === 'paper') {
            updatePreviewLayout();
        }
    };
    
    // Setup paper controls in status bar
    const setupPaperControls = () => {
        const layoutModeItem = document.querySelector('.status-item[title="Layout mode"]');
        if (layoutModeItem) {
            layoutModeItem.classList.add('clickable');
            layoutModeItem.addEventListener('click', togglePaperLayout);
            layoutModeItem.title = 'Click to toggle between Web and Paper layout';
        }
        
        // Create paper controls overlay
        const controlsHtml = `
            <div class="paper-controls">
                <button class="paper-control-btn" id="paper-zoom-out" title="Zoom Out (-)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <button class="paper-control-btn" id="paper-zoom-in" title="Zoom In (+)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <div class="paper-zoom-label">100%</div>
                <div class="paper-control-separator"></div>
                <button class="paper-control-btn" id="paper-fit-width" title="Fit to Width">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="5 9 2 12 5 15"></polyline>
                        <polyline points="9 5 12 2 15 5"></polyline>
                        <polyline points="15 19 12 22 9 19"></polyline>
                        <polyline points="19 9 22 12 19 15"></polyline>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                    </svg>
                </button>
                <button class="paper-control-btn" id="paper-reset-zoom" title="Actual Size (100%)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                </button>
                <div class="paper-control-separator"></div>
                <button class="paper-control-btn" id="paper-page-setup" title="Page Setup">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHtml);
        
        // Setup event listeners
        document.getElementById('paper-zoom-in').addEventListener('click', zoomIn);
        document.getElementById('paper-zoom-out').addEventListener('click', zoomOut);
        document.getElementById('paper-fit-width').addEventListener('click', fitToWidth);
        document.getElementById('paper-reset-zoom').addEventListener('click', resetZoom);
        document.getElementById('paper-page-setup').addEventListener('click', openPageSetupModal);
    };
    
    // Initialize paper layout after DOM is ready
    setTimeout(() => {
        loadPaperLayoutSettings();
        loadPageSetupSettings();
        setupPaperControls();
        updatePreviewLayout(); // Apply the loaded layout state to UI
        
        // Create page setup modal
        const modalHtml = `
            <div class="page-setup-modal" id="page-setup-modal">
                <div class="page-setup-modal-content">
                    <div class="page-setup-modal-header">
                        <h3>Page Setup</h3>
                        <button class="page-setup-modal-close" id="page-setup-close-btn">�</button>
                    </div>
                    <div class="page-setup-modal-body">
                        <div class="page-setup-section">
                            <label>Paper Size (cm)</label>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Width</label>
                                    <input type="number" id="page-width" step="0.1" min="10" max="50">
                                </div>
                                <div class="page-setup-field">
                                    <label>Height</label>
                                    <input type="number" id="page-height" step="0.1" min="10" max="50">
                                </div>
                            </div>
                        </div>
                        <div class="page-setup-section">
                            <label>Margins (cm)</label>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Top</label>
                                    <input type="number" id="margin-top" step="0.1" min="0" max="10">
                                </div>
                                <div class="page-setup-field">
                                    <label>Bottom</label>
                                    <input type="number" id="margin-bottom" step="0.1" min="0" max="10">
                                </div>
                            </div>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Left</label>
                                    <input type="number" id="margin-left" step="0.1" min="0" max="10">
                                </div>
                                <div class="page-setup-field">
                                    <label>Right</label>
                                    <input type="number" id="margin-right" step="0.1" min="0" max="10">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-setup-modal-footer">
                        <button class="page-setup-btn-cancel" id="page-setup-cancel-btn">Cancel</button>
                        <button class="page-setup-btn-save" id="page-setup-save-btn">Apply</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Setup modal event listeners
        document.getElementById('page-setup-close-btn').addEventListener('click', closePageSetupModal);
        document.getElementById('page-setup-cancel-btn').addEventListener('click', closePageSetupModal);
        document.getElementById('page-setup-save-btn').addEventListener('click', savePageSetup);
        document.getElementById('page-setup-modal').addEventListener('click', (e) => {
            if (e.target.id === 'page-setup-modal') closePageSetupModal();
        });
        
        updatePreviewLayout();
    }, 100);
    
    // ============================================================================
    // VERSION HISTORY FUNCTIONALITY
    // ============================================================================
    
    const localStorageVersionsKey = 'versions';
    const localStorageAutosaveConfigKey = 'autosave_config';
    const AUTO_SAVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes (default)
    const MAX_VERSIONS = 15; // Maximum stored versions (FIFO retention)
    
    let versions = [];
    let autoSaveTimer = null;
    let autosaveConfig = {
        enabled: true,
        intervalMinutes: 10
    };
    
    // Load versions from localStorage
    const loadVersions = () => {
        try {
            const stored = localStorage.getItem(`${localStorageNamespace}.${localStorageVersionsKey}`);
            if (stored) {
                versions = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                versions.forEach(v => v.timestamp = new Date(v.timestamp));
                updateVersionsPanel();
            }
        } catch (e) {
            console.error('Failed to load versions:', e);
            versions = [];
        }
    };
    
    // Load autosave config from localStorage
    const loadAutosaveConfig = () => {
        try {
            const stored = localStorage.getItem(`${localStorageNamespace}.${localStorageAutosaveConfigKey}`);
            if (stored) {
                autosaveConfig = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load autosave config:', e);
        }
    };
    
    // Save autosave config to localStorage
    const saveAutosaveConfig = () => {
        try {
            localStorage.setItem(`${localStorageNamespace}.${localStorageAutosaveConfigKey}`, JSON.stringify(autosaveConfig));
        } catch (e) {
            console.error('Failed to save autosave config:', e);
        }
    };
    
    // Save versions to localStorage
    const saveVersionsToStorage = () => {
        try {
            localStorage.setItem(`${localStorageNamespace}.${localStorageVersionsKey}`, JSON.stringify(versions));
        } catch (e) {
            console.error('Failed to save versions:', e);
        }
    };
    
    // Save current content as a version
    const saveVersion = () => {
        const content = editor.getValue();
        
        // Prevent duplicate snapshot if no changes
        if (versions.length > 0 && versions[0].content === content) {
            console.log('No changes detected, skipping version save');
            return;
        }
        
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const timestamp = new Date();
        
        const version = {
            id: Date.now(),
            content: content,
            timestamp: timestamp,
            words: words,
            preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            title: '' // Empty title by default, user can rename
        };
        
        console.log('Saving version:', {
            id: version.id,
            contentLength: content.length,
            preview: version.preview,
            totalVersions: versions.length + 1
        });
        
        // Add to beginning of array
        versions.unshift(version);
        
        // Keep only last MAX_VERSIONS
        if (versions.length > MAX_VERSIONS) {
            versions = versions.slice(0, MAX_VERSIONS);
        }
        
        saveVersionsToStorage();
        updateVersionsPanel();
        updateStatusBar();
        updateAutosaveTooltip();
        
        // Update save indicator with timestamp
        updateSaveIndicator();
    };
    
    // Format timestamp for display
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };
    
    // Update save indicator with last saved time
    const updateSaveIndicator = () => {
        const saveIndicator = document.getElementById('status-save-indicator');
        if (!saveIndicator) return;
        
        if (versions.length > 0) {
            const lastVersion = versions[0];
            const timeAgo = formatTimestamp(lastVersion.timestamp);
            saveIndicator.textContent = `Saved ${timeAgo}`;
        } else {
            saveIndicator.textContent = 'Not saved';
        }
    };
    
    // Update versions panel UI
    const updateVersionsPanel = (searchQuery = '') => {
        const versionsList = document.getElementById('version-history-list');
        const versionsCount = document.getElementById('status-versions-count');
        const totalVersionsDisplay = document.getElementById('total-versions-display');
        
        if (versionsCount) versionsCount.textContent = versions.length;
        if (totalVersionsDisplay) totalVersionsDisplay.textContent = versions.length;
        
        if (!versionsList) return;
        
        if (versions.length === 0) {
            versionsList.innerHTML = '<p class="version-empty-state">No versions saved yet. Versions are auto-saved every 10 minutes.</p>';
            return;
        }
        
        // Filter versions based on search query
        const filteredVersions = searchQuery.trim() === '' 
            ? versions 
            : versions.filter(v => {
                const title = v.title || '';
                const timestamp = formatTimestamp(v.timestamp);
                const preview = v.preview || '';
                const query = searchQuery.toLowerCase();
                return title.toLowerCase().includes(query) || 
                       timestamp.toLowerCase().includes(query) ||
                       preview.toLowerCase().includes(query);
            });
        
        if (filteredVersions.length === 0) {
            versionsList.innerHTML = '<p class="version-empty-state">No versions match your search.</p>';
            return;
        }
        
        versionsList.innerHTML = filteredVersions.map(version => `
            <div class="version-item" data-version-id="${version.id}">
                <div class="version-header">
                    <div class="version-title-container">
                        ${version.title ? 
                            `<input type="text" class="version-title-input" value="${escapeHtml(version.title)}" data-version-id="${version.id}" />` :
                            `<input type="text" class="version-title-input" placeholder="${formatTimestamp(version.timestamp)}" data-version-id="${version.id}" />`
                        }
                        <button class="version-save-title-btn" data-version-id="${version.id}" title="Save title">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${version.title ? '' : `<div class="version-timestamp-small">${formatTimestamp(version.timestamp)}</div>`}
                <div class="version-meta">
                    <span>${version.words} words</span>
                    <span>${Math.ceil(version.words / 500)} pages</span>
                </div>
                <div class="version-preview">${escapeHtml(version.preview)}</div>
                <div class="version-actions">
                    <button class="version-btn" onclick="window.previewVersion(${version.id})">Preview</button>
                    <button class="version-btn" onclick="window.compareVersion(${version.id})">Compare</button>
                    <button class="version-btn restore" onclick="window.restoreVersion(${version.id})">Restore</button>
                    <button class="version-btn" onclick="window.deleteVersion(${version.id})">Delete</button>
                </div>
            </div>
        `).join('');
    };
    
    // Restore a version (no confirmation needed)
    window.restoreVersion = (id) => {
        const version = versions.find(v => v.id === id);
        if (version) {
            editor.setValue(version.content);
            closeVersionModal();
            const panel = document.getElementById('version-history-panel');
            if (panel) panel.classList.remove('visible');
        }
    };
    
    // Custom confirmation dialog
    let confirmCallback = null;
    
    const showConfirmDialog = (title, message, onConfirm) => {
        const dialog = document.getElementById('confirm-dialog');
        const titleEl = document.getElementById('confirm-dialog-title');
        const messageEl = document.getElementById('confirm-dialog-message');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        confirmCallback = onConfirm;
        
        if (dialog) dialog.classList.add('visible');
    };
    
    const closeConfirmDialog = () => {
        const dialog = document.getElementById('confirm-dialog');
        if (dialog) dialog.classList.remove('visible');
        confirmCallback = null;
    };
    
    // Delete a version (with custom confirmation)
    window.deleteVersion = (id) => {
        showConfirmDialog(
            'Delete Version',
            'Are you sure you want to delete this version? This action cannot be undone.',
            () => {
                versions = versions.filter(v => v.id !== id);
                saveVersionsToStorage();
                updateVersionsPanel();
                updateStatusBar();
                updateAutosaveTooltip();
                closeConfirmDialog();
            }
        );
    };
    
    // Save version title from inline input
    window.saveVersionTitle = (id) => {
        const input = document.querySelector(`.version-title-input[data-version-id="${id}"]`);
        if (!input) return;
        
        const version = versions.find(v => v.id === id);
        if (!version) return;
        
        const newTitle = input.value.trim();
        version.title = newTitle;
        
        saveVersionsToStorage();
        updateVersionsPanel();
    };
    
    // Preview a version
    window.previewVersion = (id) => {
        const version = versions.find(v => v.id === id);
        if (!version) return;
        
        const modalTitle = document.getElementById('version-modal-title');
        const modalBody = document.getElementById('version-modal-body');
        const restoreBtn = document.getElementById('version-modal-restore-btn');
        const toggleBtn = document.getElementById('version-modal-toggle-btn');
        
        let isRawMode = false;
        
        const renderPreview = () => {
            const versionName = version.title || formatTimestamp(version.timestamp);
            
            if (modalTitle) {
                modalTitle.innerHTML = `
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">${versionName}</div>
                    <div style="font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        ${version.words} words • ${Math.ceil(version.words / 500)} pages • Saved ${formatTimestamp(version.timestamp)}
                    </div>
                `;
            }
            
            if (toggleBtn) {
                toggleBtn.style.display = 'block';
                toggleBtn.textContent = isRawMode ? 'Show Formatted' : 'Show Raw';
                toggleBtn.onclick = () => {
                    isRawMode = !isRawMode;
                    renderPreview();
                };
            }
            
            if (modalBody) {
                if (isRawMode) {
                    modalBody.innerHTML = `
                        <pre style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;" class="raw-markdown-view">${escapeHtml(version.content)}</pre>
                    `;
                } else {
                    const html = marked.parse(version.content);
                    const sanitized = DOMPurify.sanitize(html);
                    
                    modalBody.innerHTML = `
                        <div class="markdown-body" style="padding: 20px;">
                            ${sanitized}
                        </div>
                    `;
                }
            }
        };
        
        renderPreview();
        
        if (restoreBtn) {
            restoreBtn.style.display = 'block';
            restoreBtn.onclick = () => {
                window.restoreVersion(id);
            };
        }
        
        openVersionModal();
    };
    
    // Compare versions
    window.compareVersion = (id) => {
        const version = versions.find(v => v.id === id);
        if (!version) return;
        
        const currentContent = editor.getValue();
        const versionContent = version.content;
        const currentWords = currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0;
        
        console.log('Comparing versions:', {
            versionId: id,
            currentLength: currentContent.length,
            versionLength: versionContent.length,
            areSame: currentContent === versionContent,
            currentPreview: currentContent.substring(0, 50),
            versionPreview: versionContent.substring(0, 50)
        });
        
        const modalTitle = document.getElementById('version-modal-title');
        const modalBody = document.getElementById('version-modal-body');
        const restoreBtn = document.getElementById('version-modal-restore-btn');
        const toggleBtn = document.getElementById('version-modal-toggle-btn');
        
        let isRawMode = false;
        
        const renderCompare = () => {
            const versionName = version.title || formatTimestamp(version.timestamp);
            
            if (modalTitle) {
                modalTitle.innerHTML = `
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">Compare: ${versionName}</div>
                    <div style="display: flex; gap: 20px; font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        <span>Current: ${currentWords} words • ${Math.ceil(currentWords / 500)} pages</span>
                        <span>Version: ${version.words} words • ${Math.ceil(version.words / 500)} pages • Saved ${formatTimestamp(version.timestamp)}</span>
                    </div>
                `;
            }
            
            if (toggleBtn) {
                toggleBtn.style.display = 'block';
                toggleBtn.textContent = isRawMode ? 'Show Formatted' : 'Show Raw Diff';
                toggleBtn.onclick = () => {
                    isRawMode = !isRawMode;
                    renderCompare();
                };
            }
            
            if (modalBody) {
                if (isRawMode) {
                    modalBody.innerHTML = `
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${highlightDiff(currentContent, versionContent, 'current')}</pre>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${highlightDiff(versionContent, currentContent, 'version')}</pre>
                            </div>
                        </div>
                    `;
                } else {
                    // Render with diff highlighting on formatted view
                    const currentLines = currentContent.split('\n');
                    const versionLines = versionContent.split('\n');
                    const lcs = calculateLCS(currentLines, versionLines);
                    
                    // Build arrays to track which lines are added/removed
                    const currentChanges = new Set();
                    const versionChanges = new Set();
                    
                    let i = 0, j = 0, lcsIndex = 0;
                    while (i < currentLines.length || j < versionLines.length) {
                        if (lcsIndex < lcs.length && 
                            i < currentLines.length && 
                            j < versionLines.length && 
                            currentLines[i] === lcs[lcsIndex] && 
                            versionLines[j] === lcs[lcsIndex]) {
                            i++; j++; lcsIndex++;
                        } else if (i < currentLines.length && (lcsIndex >= lcs.length || currentLines[i] !== lcs[lcsIndex])) {
                            currentChanges.add(i);
                            i++;
                        } else if (j < versionLines.length) {
                            versionChanges.add(j);
                            j++;
                        }
                    }
                    
                    // Render with highlighting - use different classes for added vs removed
                    const renderWithHighlight = (content, changes, isAddition) => {
                        const lines = content.split('\n');
                        let highlightedContent = '';
                        let inChangeBlock = false;
                        const blockClass = isAddition ? 'diff-added-block' : 'diff-removed-block';
                        
                        lines.forEach((line, idx) => {
                            if (changes.has(idx)) {
                                if (!inChangeBlock) {
                                    highlightedContent += `<div class="${blockClass}">`;
                                    inChangeBlock = true;
                                }
                                highlightedContent += line + '\n';
                            } else {
                                if (inChangeBlock) {
                                    highlightedContent += '</div>';
                                    inChangeBlock = false;
                                }
                                highlightedContent += line + '\n';
                            }
                        });
                        
                        if (inChangeBlock) {
                            highlightedContent += '</div>';
                        }
                        
                        const html = marked.parse(highlightedContent);
                        return DOMPurify.sanitize(html);
                    };
                    
                    const currentSanitized = renderWithHighlight(currentContent, currentChanges, true);
                    const versionSanitized = renderWithHighlight(versionContent, versionChanges, false);
                    
                    modalBody.innerHTML = `
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${currentSanitized}
                                </div>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${versionSanitized}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        };
        
        renderCompare();
        
        if (restoreBtn) {
            restoreBtn.style.display = 'block';
            restoreBtn.onclick = () => {
                window.restoreVersion(id);
            };
        }
        
        openVersionModal();
    };
    
    // Improved diff highlighting using LCS (Longest Common Subsequence) algorithm
    const highlightDiff = (text1, text2, mode) => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        
        // Calculate LCS to find matching lines
        const lcs = calculateLCS(lines1, lines2);
        
        // Build diff result based on LCS
        let result = '';
        let i = 0, j = 0;
        let lcsIndex = 0;
        
        while (i < lines1.length || j < lines2.length) {
            // Check if current lines are in LCS (unchanged)
            if (lcsIndex < lcs.length && 
                i < lines1.length && 
                j < lines2.length && 
                lines1[i] === lcs[lcsIndex] && 
                lines2[j] === lcs[lcsIndex]) {
                // Unchanged line
                result += escapeHtml(lines1[i]) + '\n';
                i++;
                j++;
                lcsIndex++;
            } else if (mode === 'current') {
                // In current mode, show additions from text1
                if (i < lines1.length && (lcsIndex >= lcs.length || lines1[i] !== lcs[lcsIndex])) {
                    result += `<span class="diff-added">${escapeHtml(lines1[i])}</span>\n`;
                    i++;
                } else {
                    j++;
                }
            } else {
                // In saved mode, show deletions from text2
                if (j < lines2.length && (lcsIndex >= lcs.length || lines2[j] !== lcs[lcsIndex])) {
                    result += `<span class="diff-removed">${escapeHtml(lines2[j])}</span>\n`;
                    j++;
                } else {
                    i++;
                }
            }
        }
        
        return result || escapeHtml(mode === 'current' ? text1 : text2);
    };
    
    // Calculate Longest Common Subsequence for diff
    const calculateLCS = (arr1, arr2) => {
        const m = arr1.length;
        const n = arr2.length;
        
        // Create DP table
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
        
        // Fill DP table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (arr1[i - 1] === arr2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Backtrack to find LCS
        const lcs = [];
        let i = m, j = n;
        while (i > 0 && j > 0) {
            if (arr1[i - 1] === arr2[j - 1]) {
                lcs.unshift(arr1[i - 1]);
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    };
    
    // Open version modal
    const openVersionModal = () => {
        const modal = document.getElementById('version-modal');
        if (modal) modal.classList.add('visible');
    };
    
    // Close version modal
    const closeVersionModal = () => {
        const modal = document.getElementById('version-modal');
        const restoreBtn = document.getElementById('version-modal-restore-btn');
        if (modal) modal.classList.remove('visible');
        if (restoreBtn) restoreBtn.style.display = 'none';
    };
    
    // Version history panel toggle
    const versionHistoryPanel = document.getElementById('version-history-panel');
    const versionHistoryCloseBtn = document.getElementById('version-history-close-btn');
    const statusVersionsBtn = document.getElementById('status-versions');
    
    if (statusVersionsBtn) {
        statusVersionsBtn.addEventListener('click', () => {
            if (versionHistoryPanel) {
                versionHistoryPanel.classList.toggle('visible');
            }
        });
    }
    
    if (versionHistoryCloseBtn) {
        versionHistoryCloseBtn.addEventListener('click', () => {
            if (versionHistoryPanel) {
                versionHistoryPanel.classList.remove('visible');
            }
        });
    }
    
    // Autosave settings modal
    const autosaveModal = document.getElementById('autosave-modal');
    const autosaveSettingsBtn = document.getElementById('version-settings-btn');
    const autosaveCloseBtn = document.getElementById('autosave-modal-close-btn');
    const autosaveCancelBtn = document.getElementById('autosave-cancel-btn');
    const autosaveSaveBtn = document.getElementById('autosave-save-btn');
    const autosaveEnabledToggle = document.getElementById('autosave-enabled-toggle');
    const autosaveCustomMinutes = document.getElementById('autosave-custom-minutes');
    
    const openAutosaveModal = () => {
        // Populate current settings
        if (autosaveEnabledToggle) {
            autosaveEnabledToggle.checked = autosaveConfig.enabled;
        }
        if (autosaveCustomMinutes) {
            autosaveCustomMinutes.value = autosaveConfig.intervalMinutes;
        }
        
        // Update active interval button
        document.querySelectorAll('.interval-btn').forEach(btn => {
            const minutes = parseInt(btn.dataset.minutes);
            if (minutes === autosaveConfig.intervalMinutes) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        if (autosaveModal) {
            autosaveModal.classList.add('visible');
        }
    };
    
    const closeAutosaveModal = () => {
        if (autosaveModal) {
            autosaveModal.classList.remove('visible');
        }
    };
    
    const saveAutosaveSettings = () => {
        // Get enabled state
        autosaveConfig.enabled = autosaveEnabledToggle ? autosaveEnabledToggle.checked : true;
        
        // Get interval from custom input or active button
        const customValue = autosaveCustomMinutes ? parseInt(autosaveCustomMinutes.value) : null;
        if (customValue && customValue >= 1) {
            autosaveConfig.intervalMinutes = customValue;
        } else {
            const activeBtn = document.querySelector('.interval-btn.active');
            if (activeBtn) {
                autosaveConfig.intervalMinutes = parseInt(activeBtn.dataset.minutes);
            }
        }
        
        // Save to localStorage
        saveAutosaveConfig();
        
        // Restart autosave with new settings
        startAutoSave();
        
        closeAutosaveModal();
    };
    
    if (autosaveSettingsBtn) {
        autosaveSettingsBtn.addEventListener('click', openAutosaveModal);
    }
    
    if (autosaveCloseBtn) {
        autosaveCloseBtn.addEventListener('click', closeAutosaveModal);
    }
    
    if (autosaveCancelBtn) {
        autosaveCancelBtn.addEventListener('click', closeAutosaveModal);
    }
    
    if (autosaveSaveBtn) {
        autosaveSaveBtn.addEventListener('click', saveAutosaveSettings);
    }
    
    // Interval button handlers
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (autosaveCustomMinutes) {
                autosaveCustomMinutes.value = '';
            }
        });
    });
    
    // Close modal on background click
    if (autosaveModal) {
        autosaveModal.addEventListener('click', (e) => {
            if (e.target === autosaveModal) {
                closeAutosaveModal();
            }
        });
    }
    
    // Confirmation dialog handlers
    const confirmDialog = document.getElementById('confirm-dialog');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const confirmConfirmBtn = document.getElementById('confirm-confirm-btn');
    
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', closeConfirmDialog);
    }
    
    if (confirmConfirmBtn) {
        confirmConfirmBtn.addEventListener('click', () => {
            if (confirmCallback) {
                confirmCallback();
            }
        });
    }
    
    if (confirmDialog) {
        confirmDialog.addEventListener('click', (e) => {
            if (e.target === confirmDialog) {
                closeConfirmDialog();
            }
        });
    }
    
    // Delegate event for save title buttons (since they're dynamically generated)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.version-save-title-btn')) {
            const btn = e.target.closest('.version-save-title-btn');
            const versionId = parseInt(btn.dataset.versionId);
            window.saveVersionTitle(versionId);
        }
    });
    
    // Save version now button
    const saveVersionNowBtn = document.getElementById('save-version-now-btn');
    if (saveVersionNowBtn) {
        saveVersionNowBtn.addEventListener('click', () => {
            saveVersion();
        });
    }
    
    // Version search box
    const versionSearchBox = document.getElementById('version-search-box');
    if (versionSearchBox) {
        versionSearchBox.addEventListener('input', (e) => {
            updateVersionsPanel(e.target.value);
        });
    }
    
    // Modal close handlers
    const versionModalCloseBtn = document.getElementById('version-modal-close-btn');
    const versionModalCancelBtn = document.getElementById('version-modal-cancel-btn');
    const versionModal = document.getElementById('version-modal');
    
    if (versionModalCloseBtn) {
        versionModalCloseBtn.addEventListener('click', closeVersionModal);
    }
    
    if (versionModalCancelBtn) {
        versionModalCancelBtn.addEventListener('click', closeVersionModal);
    }
    
    // Close modal on background click
    if (versionModal) {
        versionModal.addEventListener('click', (e) => {
            if (e.target === versionModal) {
                closeVersionModal();
            }
        });
    }
    
    // Start auto-save timer
    const startAutoSave = () => {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
        
        if (!autosaveConfig.enabled) {
            updateAutosaveTooltip();
            return; // Don't start if disabled
        }
        
        const intervalMs = autosaveConfig.intervalMinutes * 60 * 1000;
        autoSaveTimer = setInterval(() => {
            saveVersion();
        }, intervalMs);
        
        updateAutosaveTooltip();
    };
    
    // Update autosave status tooltip
    const updateAutosaveTooltip = () => {
        const statusVersionsBtn = document.getElementById('status-versions');
        if (!statusVersionsBtn) return;
        
        let tooltipLines = ['Version History', ''];
        
        if (autosaveConfig.enabled) {
            tooltipLines.push('Autosave: Enabled');
            tooltipLines.push(`Interval: ${autosaveConfig.intervalMinutes} minutes`);
            
            if (versions.length > 0) {
                const lastVersion = versions[0];
                const timeSince = formatTimestamp(lastVersion.timestamp);
                tooltipLines.push(`Last saved: ${timeSince}`);
            } else {
                tooltipLines.push('No versions saved yet');
            }
        } else {
            tooltipLines.push('Autosave: Disabled');
            tooltipLines.push('Save manually using "Save Version Now"');
        }
        
        statusVersionsBtn.setAttribute('title', tooltipLines.join('\n'));
    };
    
    
    // Initialize version history
    loadVersions();
    loadAutosaveConfig();
    startAutoSave();
    
    // Save initial version after a short delay
    setTimeout(() => {
        if (versions.length === 0) {
            saveVersion();
        }
    }, 2000);

    // normalize to boolean (Storehouse may return string or boolean)
    if (themeSettings === 'true' || themeSettings === true) {
        themeSettings = true;
    } else {
        themeSettings = false;
    }
    
    // initialize style selector
    let styleSettings = loadStyleSettings();
    initStyleSelector(styleSettings);
    
    // initialize flip panels
    let flipPanelsSettings = loadFlipPanelsSettings();
    initFlipPanels(flipPanelsSettings);
    
    // initialize vertical layout
    let verticalLayoutSettings = loadVerticalLayoutSettings();
    initVerticalLayout(verticalLayoutSettings);
    
    initThemeToggle(themeSettings);

    setupDivider();
    setupCheatsheetDivider();

    // Global drag handler - only one resizer can be active at a time
    document.addEventListener('mousemove', (e) => {
        if (!activeResizer) return;
        e.preventDefault();
        
        const containerRect = activeResizer.container.getBoundingClientRect();
        const dividerWidth = activeResizer.divider.offsetWidth;
        
        if (activeResizer.isVertical) {
            // Vertical layout - resize by height
            const totalHeight = activeResizer.getAvailableHeight();
            const containerRect = activeResizer.container.getBoundingClientRect();
            const dividerHeight = activeResizer.divider.offsetHeight;
            
            // Calculate new top height based on delta from initial position
            const currentDividerY = e.clientY - containerRect.top;
            const deltaY = currentDividerY - activeResizer.initialDividerY;
            let newTopHeight = activeResizer.initialTopHeight + deltaY;

            const minHeight = 100;
            const maxHeight = totalHeight - minHeight - dividerHeight;
            newTopHeight = Math.max(minHeight, Math.min(newTopHeight, maxHeight));
            
            if (activeResizer.isFlipped) {
                activeResizer.leftPane.style.height = newTopHeight + 'px';
                activeResizer.rightPane.style.height = (totalHeight - newTopHeight - dividerHeight) + 'px';
            } else {
                activeResizer.leftPane.style.height = newTopHeight + 'px';
                activeResizer.rightPane.style.height = (totalHeight - newTopHeight - dividerHeight) + 'px';
            }
            
            activeResizer.lastTopRatio = newTopHeight / (totalHeight - dividerHeight);
        } else {
            // Horizontal layout - resize by width
            const totalWidth = activeResizer.getAvailableWidth();
            const containerRect = activeResizer.container.getBoundingClientRect();
            const dividerWidth = activeResizer.divider.offsetWidth;
            
            // Calculate new left width based on delta from initial position
            const currentDividerX = e.clientX - containerRect.left;
            const deltaX = currentDividerX - activeResizer.initialDividerX;
            let newLeftWidth = activeResizer.initialLeftWidth + deltaX;
            
            // Clamp to min/max
            const minWidth = 100;
            const maxWidth = totalWidth - minWidth - dividerWidth;
            newLeftWidth = Math.max(minWidth, Math.min(newLeftWidth, maxWidth));
            
            // For cheatsheet divider (on the right), dragging left increases its width
            if (activeResizer.divider.id === 'cheatsheet-divider') {
                // Cheatsheet is on the RIGHT side
                const minCheatsheetWidth = 250;
                const maxCheatsheetWidth = 600;
                
                // Calculate cheatsheet width: distance from divider's right edge to container's right edge
                const newCheatsheetWidth = totalWidth - currentDividerX - dividerWidth;
                
                // Clamp cheatsheet width to min/max
                const clampedWidth = Math.max(minCheatsheetWidth, Math.min(newCheatsheetWidth, maxCheatsheetWidth));
                
                // Apply the width to cheatsheet
                activeResizer.leftPane.style.width = clampedWidth + 'px';
                
                // Calculate remaining space for editor + preview + main divider
                const mainDivider = document.getElementById('split-divider');
                const mainDividerWidth = mainDivider ? mainDivider.offsetWidth : 5;
                const remainingWidth = totalWidth - clampedWidth - dividerWidth;
                
                // Get editor and preview panes
                const editorPane = document.getElementById('edit');
                const previewPane = document.getElementById('preview');
                
                if (editorPane && previewPane) {
                    // Distribute remaining width between editor and preview
                    // Try to maintain their current ratio if possible
                    const currentEditorWidth = editorPane.offsetWidth;
                    const currentPreviewWidth = previewPane.offsetWidth;
                    const currentTotal = currentEditorWidth + currentPreviewWidth + mainDividerWidth;
                    
                    if (currentTotal > 0) {
                        const editorRatio = currentEditorWidth / currentTotal;
                        const newEditorWidth = (remainingWidth - mainDividerWidth) * editorRatio;
                        const newPreviewWidth = remainingWidth - mainDividerWidth - newEditorWidth;
                        
                        editorPane.style.width = newEditorWidth + 'px';
                        previewPane.style.width = newPreviewWidth + 'px';
                    }
                }
                
                activeResizer.lastLeftRatio = clampedWidth / totalWidth;
            } else {
                // For main divider, both panes need explicit width
                if (activeResizer.isFlipped) {
                    // When flipped: preview is on left, editor on right
                    // leftPane = preview, rightPane = editor
                    activeResizer.leftPane.style.width = newLeftWidth + 'px';  // Preview on left
                    activeResizer.rightPane.style.width = (totalWidth - newLeftWidth - dividerWidth) + 'px';  // Editor on right
                } else {
                    // Normal: editor on left, preview on right
                    // leftPane = editor, rightPane = preview
                    activeResizer.leftPane.style.width = newLeftWidth + 'px';  // Editor on left
                    activeResizer.rightPane.style.width = (totalWidth - newLeftWidth - dividerWidth) + 'px';  // Preview on right
                }
                activeResizer.lastLeftRatio = newLeftWidth / (totalWidth - dividerWidth);
            }
        }
    });

    document.addEventListener('mouseup', () => {
        if (activeResizer) {
            activeResizer.divider.classList.remove('active');
            activeResizer.divider.classList.remove('hover');
            document.body.style.cursor = 'default';
            document.body.classList.remove('dragging');
            document.body.style.userSelect = '';
            activeResizer = null;
        }
    });

    // ----- cursor synchronization -----
    // Listen for cursor position changes in editor
    editor.onDidChangeCursorPosition((e) => {
        const lineNumber = e.position.lineNumber;
        syncCursorToPreview(lineNumber);
    });

    // Listen for clicks in preview to sync cursor to editor
    const previewElement = document.querySelector('#preview');
    if (previewElement) {
        previewElement.addEventListener('click', (e) => {
            // Skip cursor sync if edit mode is enabled and clicking on or inside contenteditable element
            if (editModeEnabled) {
                let element = e.target;
                while (element && element !== previewElement) {
                    if (element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true') {
                        return; // Let the browser handle contenteditable focus
                    }
                    element = element.parentElement;
                }
            }
            syncCursorToEditor(e.target);
        });
        
        // Consolidated bidirectional scroll sync with improved debouncing
        let isEditorScrolling = false;
        let isPreviewScrolling = false;
        let editorScrollTimeout = null;
        let previewScrollTimeout = null;
        let editorScrollFrame = null;
        let previewScrollFrame = null;
        
        // Editor scroll → Preview scroll (Element-based sync)
        editor.onDidScrollChange((e) => {
            if (isPreviewScrolling || !scrollBarSync) return;
            
            isEditorScrolling = true;
            clearTimeout(editorScrollTimeout);
            
            // Cancel any pending animation frame
            if (editorScrollFrame) {
                cancelAnimationFrame(editorScrollFrame);
            }
            
            // Use requestAnimationFrame for smoother scrolling
            editorScrollFrame = requestAnimationFrame(() => {
                try {
                    // Get the top visible line in the editor
                    const visibleRanges = editor.getVisibleRanges();
                    if (visibleRanges && visibleRanges.length > 0) {
                        const topVisibleLine = visibleRanges[0].startLineNumber;
                        
                        // Find the corresponding element in preview
                        const targetElement = document.querySelector(`[data-source-line="${topVisibleLine}"]`);
                        
                        if (targetElement) {
                            // Element-based sync: scroll to the specific element
                            const previewRect = previewElement.getBoundingClientRect();
                            const targetRect = targetElement.getBoundingClientRect();
                            const offset = targetRect.top - previewRect.top + previewElement.scrollTop;
                            
                            previewElement.scrollTo({ top: offset, behavior: 'auto' });
                        } else {
                            // Fallback to proportional sync if element not found
                            const scrollTop = e.scrollTop;
                            const scrollHeight = e.scrollHeight;
                            const height = editor.getLayoutInfo().height;
                            const maxScrollTop = scrollHeight - height;
                            const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
                            
                            const targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
                            previewElement.scrollTo({ top: targetY, behavior: 'auto' });
                        }
                    }
                } catch (error) {
                    console.error('Scroll sync error:', error);
                }
                
                editorScrollFrame = null;
            });
            
            // Use longer timeout to prevent jitter
            editorScrollTimeout = setTimeout(() => {
                isEditorScrolling = false;
            }, 200);
        });
        
        // Preview scroll → Editor scroll
        previewElement.addEventListener('scroll', () => {
            if (isEditorScrolling || !scrollBarSync) return;
            
            isPreviewScrolling = true;
            clearTimeout(previewScrollTimeout);
            
            // Cancel any pending animation frame
            if (previewScrollFrame) {
                cancelAnimationFrame(previewScrollFrame);
            }
            
            // Use requestAnimationFrame for smoother scrolling
            previewScrollFrame = requestAnimationFrame(() => {
                const scrollTop = previewElement.scrollTop;
                const scrollHeight = previewElement.scrollHeight;
                const clientHeight = previewElement.clientHeight;
                const maxScrollTop = scrollHeight - clientHeight;
                const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
                
                // Calculate target scroll position in editor
                const editorScrollHeight = editor.getScrollHeight();
                const editorHeight = editor.getLayoutInfo().height;
                const editorMaxScroll = editorScrollHeight - editorHeight;
                const targetScroll = editorMaxScroll * scrollRatio;
                
                editor.setScrollTop(targetScroll);
                
                previewScrollFrame = null;
            });
            
            // Use longer timeout to prevent jitter
            previewScrollTimeout = setTimeout(() => {
                isPreviewScrolling = false;
            }, 200);
        });
    }
    
    // ----- Mofu Blob Interactive Widget -----
    let initMofuBlob = () => {
        const mofu = document.getElementById('mofu-nav-trigger');
        const canvas = document.getElementById('mofu-canvas');
        const features = document.getElementById('mofu-features');
        const mouth = document.getElementById('mofu-mouth');
        
        if (!mofu || !canvas || !features || !mouth) return;
        
        let isAnimating = false;

        // Export reaction - Double jump (party mode!)
        const exportReaction = () => {
            if (isAnimating) return;
            isAnimating = true;
            
            canvas.style.transform = '';
            features.style.transform = '';
            
            // Change mouth to O shape
            mouth.classList.add('mofu-mouth-o');
            
            // First jump
            canvas.classList.add('mofu-jumping');

            setTimeout(() => {
                canvas.classList.remove('mofu-jumping');
                
                // Second jump after a brief pause
                setTimeout(() => {
                    canvas.classList.add('mofu-jumping');
                    
                    setTimeout(() => {
                        canvas.classList.remove('mofu-jumping');
                        mouth.classList.remove('mofu-mouth-o');
                        isAnimating = false;
                    }, 800);
                }, 100);
            }, 800);
        };

        // Copy reaction - Spin around with blue border
        const copyReaction = () => {
            if (isAnimating) return;
            isAnimating = true;
            
            // Spin animation
            canvas.classList.add('mofu-spinning');
            canvas.classList.add('mofu-copied');

            setTimeout(() => {
                canvas.classList.remove('mofu-spinning');
            }, 600);

            setTimeout(() => {
                canvas.classList.remove('mofu-copied');
                isAnimating = false;
            }, 1500);
        };

        // Mouse tracking for 3D effect
        document.addEventListener('mousemove', (e) => {
            if (isAnimating || mofuIsSpeaking) return; // Don't follow mouse when speaking
            
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = (e.clientX - centerX) / (window.innerWidth / 2);
            const dy = (e.clientY - centerY) / (window.innerHeight / 2);
            
            const xMove = dx * 8; 
            const yMove = dy * 5;
            const xRot = dx * 15; 
            const yRot = dy * -10;
            
            canvas.style.transform = `rotateX(${yRot}deg) rotateY(${xRot}deg)`;
            features.style.transform = `translate3d(${xMove}px, ${yMove}px, 0)`;
        });

        // Click for basic jump
        mofu.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            canvas.style.transform = '';
            features.style.transform = '';
            
            canvas.classList.add('mofu-jumping');

            setTimeout(() => {
                canvas.classList.remove('mofu-jumping');
                isAnimating = false;
            }, 800);
        });

        // Listen for export button clicks
        const exportButton = document.querySelector('#export-button');
        const exportHtmlButton = document.querySelector('#export-html-button');
        
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                setTimeout(exportReaction, 100);
            });
        }
        
        if (exportHtmlButton) {
            exportHtmlButton.addEventListener('click', () => {
                setTimeout(exportReaction, 100);
            });
        }

        // Listen for copy events (Ctrl+C or copy button)
        const copyButton = document.querySelector('#copy-button');
        
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                setTimeout(copyReaction, 100);
            });
        }

        // Also listen for keyboard copy
        document.addEventListener('copy', (e) => {
            // Only trigger if copying from editor
            if (document.activeElement && document.activeElement.closest('#editor')) {
                setTimeout(copyReaction, 100);
            }
        });
        
        // Setup save indicator
        const saveIndicator = document.getElementById('status-save-indicator');
        if (saveIndicator) {
            // Prevent text selection
            saveIndicator.style.userSelect = 'none';
            saveIndicator.style.webkitUserSelect = 'none';
            saveIndicator.style.cursor = 'pointer';
            saveIndicator.title = 'Double-click to save version now';
            
            // Add double-click handler to trigger manual save
            saveIndicator.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                saveVersion();
            });
            
            // Prevent text selection on mousedown
            saveIndicator.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
            
            // Initial update
            updateSaveIndicator();
            
            // Update every 5 minutes (300000ms)
            setInterval(updateSaveIndicator, 300000);
        }
    };
    
    initMofuBlob();
    
    // ============================================================================
    // SETTINGS PANEL
    // ============================================================================
    
    const settingsPanel = document.getElementById('settings-panel');
    const settingsButton = document.getElementById('settings-button');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsTabContents = document.querySelectorAll('.settings-tab-content');
    
    // Open settings panel
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            settingsPanel.classList.add('visible');
        });
    }
    
    // Close settings panel
    const closeSettingsPanel = () => {
        settingsPanel.classList.remove('visible');
    };
    
    // Close on overlay click
    settingsPanel.querySelector('.settings-panel-overlay').addEventListener('click', closeSettingsPanel);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsPanel.classList.contains('visible')) {
            closeSettingsPanel();
        }
    });
    
    // Tab switching
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            settingsTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            settingsTabContents.forEach(content => {
                if (content.dataset.tabContent === tabName) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
};

window.addEventListener("load", () => {
    init();
});

