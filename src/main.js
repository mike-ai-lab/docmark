import Storehouse from 'storehouse-js';
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const init = () => {
    let hasEdited = false;
    let scrollBarSync = false;
    let cursorSync = false;

    const localStorageNamespace = 'com.markdownlivepreview';
    const localStorageKey = 'last_state';
    const localStorageScrollBarKey = 'scroll_bar_settings';
    const localStorageCursorSyncKey = 'cursor_sync_settings';
    const localStorageThemeKey = 'theme_settings';
    const localStorageStyleKey = 'style_settings';
    const localStorageFlipPanelsKey = 'flip_panels_settings';
    const localStorageVerticalLayoutKey = 'vertical_layout_settings';
    const localStoragePdfSettingsKey = 'pdf_font_settings';
    const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';
    
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
        let editor = monaco.editor.create(document.querySelector('#editor'), {
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
            hover: { enabled: false },
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
        });

        // Scroll sync is now handled in the consolidated section at the bottom

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

    // Render markdown text as html with accurate line mapping
    let convert = (markdown) => {
        // Parse metadata first
        const { metadata, content } = parseMetadata(markdown);
        
        let options = {
            headerIds: false,
            mangle: false,
            breaks: true,        // Support line breaks like VSCode
            gfm: true,           // GitHub Flavored Markdown
            pedantic: false,     // Don't be overly strict
            smartLists: true,    // Better list handling
            smartypants: false   // Don't convert quotes/dashes
        };
        
        // First, render the HTML
        let html = marked.parse(markdown, options);
        let sanitized = DOMPurify.sanitize(html);
        
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
                
                const footerHtml = `<hr style="margin-top: 40px;">
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
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
        if (editor.getValue().trim() !== '') {
            var confirmed = window.confirm('Are you sure you want to clear all content?');
            if (!confirmed) {
                return;
            }
        }
        editor.setValue('');
        editor.focus();
        hasEdited = false;
    };

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
        
        // Apply initial style
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setPreviewCss(isDark, currentStyle);

        selector.addEventListener('change', (event) => {
            currentStyle = event.target.value;
            saveStyleSettings(currentStyle);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setPreviewCss(isDark, currentStyle);
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
            // Close cheatsheet panel in vertical mode
            if (cheatSheetVisible) {
                toggleCheatSheet();
            }
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
            console.log('No output element found');
            return;
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const css = await getStyleCss(currentStyle, isDark);
        
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown</title>
    <style>
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
        a.download = `Marco_${styleName}_${timestamp}.html`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

    let exportPreviewToPdf = async () => {
        const outputElement = document.querySelector('#output');
        if (!outputElement) {
            console.log('No output element found');
            return;
        }

        // Wait for jsPDF to load if not available yet
        if (typeof window.jspdf === 'undefined') {
            console.log('Waiting for jsPDF to load...');
            
            // Wait up to 5 seconds for jsPDF to load
            let attempts = 0;
            while (typeof window.jspdf === 'undefined' && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (typeof window.jspdf === 'undefined') {
                window.alert('PDF export library failed to load. Please refresh the page and try again.');
                return;
            }
        }

        try {
            // Get style-specific settings
            const styleSettings = getStylePdfSettings(currentStyle);
            
            // Use current font settings merged with style-specific settings
            const fontSizes = { ...pdfFontSettings, ...styleSettings };
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = styleSettings.margin || 15;
            const maxWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Helper to sanitize text for PDF - replace Unicode with ASCII equivalents
            const sanitizeForPdf = (text) => {
                if (!text) return '';
                
                // Map of Unicode characters to ASCII equivalents
                const charMap = {
                    '≈': '~',           // approximately equal
                    '→': '->',          // right arrow
                    '←': '<-',          // left arrow
                    '↔': '<->',         // left-right arrow
                    '²': '2',           // superscript 2
                    '³': '3',           // superscript 3
                    '×': 'x',           // multiplication
                    '÷': '/',           // division
                    'Ø': 'O',           // diameter
                    'ø': 'o',           // diameter lowercase
                    '°': ' deg',        // degree
                    '±': '+/-',         // plus-minus
                    '–': '-',           // en dash
                    '—': '--',          // em dash
                    '\u2018': "'",      // left single quote
                    '\u2019': "'",      // right single quote
                    '\u201C': '"',      // left double quote
                    '\u201D': '"',      // right double quote
                    '…': '...',         // ellipsis
                    '•': '*',           // bullet
                    '€': 'EUR',         // euro
                    '£': 'GBP',         // pound
                    '¥': 'JPY',         // yen
                    'ط': 'm.l',         // Arabic letter (linear meter)
                    'م': 'm',           // Arabic letter
                    // Add more as needed
                };
                
                let result = text;
                for (const [unicode, ascii] of Object.entries(charMap)) {
                    result = result.split(unicode).join(ascii);
                }
                
                // Remove any remaining non-ASCII characters
                result = result.replace(/[^\x00-\x7F]/g, '?');
                
                return result;
            };

            // Helper function to add text with word wrapping and inline formatting - Unicode safe
            const addText = (text, fontSize, isBold = false, isItalic = false) => {
                if (!text || text.trim() === '') return;
                
                // Sanitize text for PDF
                text = sanitizeForPdf(text);
                
                doc.setFontSize(fontSize);
                if (isBold && isItalic) {
                    doc.setFont('helvetica', 'bolditalic');
                } else if (isBold) {
                    doc.setFont('helvetica', 'bold');
                } else if (isItalic) {
                    doc.setFont('helvetica', 'italic');
                } else {
                    doc.setFont('helvetica', 'normal');
                }

                // Split text into words and wrap properly
                const words = text.split(' ');
                const lineHeight = fontSize * 0.5;
                let currentLine = '';
                
                words.forEach((word, index) => {
                    const testLine = currentLine ? currentLine + ' ' + word : word;
                    const testWidth = doc.getStringUnitWidth(testLine) * fontSize / doc.internal.scaleFactor;
                    
                    if (testWidth > maxWidth && currentLine) {
                        // Line is too long, output current line
                        if (yPosition + lineHeight > pageHeight - margin) {
                            doc.addPage();
                            yPosition = margin;
                        }
                        doc.text(currentLine, margin, yPosition);
                        yPosition += lineHeight;
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                });
                
                // Output remaining text
                if (currentLine) {
                    if (yPosition + lineHeight > pageHeight - margin) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    doc.text(currentLine, margin, yPosition);
                    yPosition += lineHeight;
                }
            };

            // Helper to extract formatted text from element with inline styles
            const getFormattedText = (element) => {
                let result = [];
                
                const processNode = (node, inheritBold = false, inheritItalic = false) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent;
                        if (text.trim()) {
                            result.push({ text, bold: inheritBold, italic: inheritItalic });
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tag = node.tagName.toLowerCase();
                        const isBold = inheritBold || tag === 'strong' || tag === 'b';
                        const isItalic = inheritItalic || tag === 'em' || tag === 'i';
                        
                        if (tag === 'br') {
                            result.push({ text: '\n', bold: false, italic: false });
                        } else if (tag === 'a') {
                            // For links, store the URL separately for clickable links
                            const linkText = node.textContent;
                            const href = node.getAttribute('href');
                            result.push({ 
                                text: linkText, 
                                bold: isBold, 
                                italic: isItalic,
                                link: href || null,
                                isLink: true
                            });
                        } else if (tag === 'code' && node.parentElement.tagName.toLowerCase() !== 'pre') {
                            // Inline code
                            result.push({ text: node.textContent, bold: false, italic: false, code: true });
                        } else {
                            // Recursively process children
                            node.childNodes.forEach(child => processNode(child, isBold, isItalic));
                        }
                    }
                };
                
                element.childNodes.forEach(child => processNode(child));
                return result;
            };

            // Helper to render formatted text segments - Unicode safe with clickable links
            const addFormattedText = (segments, fontSize) => {
                if (!segments || segments.length === 0) return;
                
                doc.setFontSize(fontSize);
                const lineHeight = fontSize * 0.5;
                let currentX = margin;
                
                segments.forEach((seg) => {
                    // Sanitize text for PDF
                    let text = sanitizeForPdf(seg.text);
                    
                    // Set font style and color
                    if (seg.isLink) {
                        // Links: use style-specific color, underlined
                        doc.setFont('helvetica', 'normal');
                        const linkColor = fontSizes.linkColor || [0, 102, 204];
                        doc.setTextColor(linkColor[0], linkColor[1], linkColor[2]);
                    } else if (seg.code) {
                        doc.setFont('courier', 'normal');
                        doc.setTextColor(0, 0, 0);
                    } else if (seg.bold && seg.italic) {
                        doc.setFont('helvetica', 'bolditalic');
                        doc.setTextColor(0, 0, 0);
                    } else if (seg.bold) {
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(0, 0, 0);
                    } else if (seg.italic) {
                        doc.setFont('helvetica', 'italic');
                        doc.setTextColor(0, 0, 0);
                    } else {
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(0, 0, 0);
                    }
                    
                    // Split by newlines
                    const parts = text.split('\n');
                    parts.forEach((part, partIdx) => {
                        if (partIdx > 0) {
                            // New line
                            yPosition += lineHeight;
                            currentX = margin;
                            if (yPosition > pageHeight - margin) {
                                doc.addPage();
                                yPosition = margin;
                            }
                        }
                        
                        if (part) {
                            // Word wrap using proper Unicode width calculation
                            const words = part.split(' ');
                            words.forEach((word) => {
                                if (!word) return;
                                
                                const spaceWidth = currentX === margin ? 0 : doc.getStringUnitWidth(' ') * fontSize / doc.internal.scaleFactor;
                                const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
                                const totalWidth = spaceWidth + wordWidth;
                                
                                if (currentX + totalWidth > pageWidth - margin && currentX > margin) {
                                    // Need to wrap
                                    yPosition += lineHeight;
                                    currentX = margin;
                                    if (yPosition > pageHeight - margin) {
                                        doc.addPage();
                                        yPosition = margin;
                                    }
                                    doc.text(word, currentX, yPosition);
                                    
                                    // Add clickable link
                                    if (seg.isLink && seg.link) {
                                        doc.link(currentX, yPosition - fontSize * 0.8, wordWidth, fontSize, { url: seg.link });
                                        // Add underline
                                        doc.setDrawColor(0, 102, 204);
                                        doc.setLineWidth(0.1);
                                        doc.line(currentX, yPosition + 0.5, currentX + wordWidth, yPosition + 0.5);
                                    }
                                    
                                    currentX += wordWidth;
                                } else {
                                    const startX = currentX;
                                    if (currentX > margin) {
                                        doc.text(' ' + word, currentX, yPosition);
                                        currentX += totalWidth;
                                    } else {
                                        doc.text(word, currentX, yPosition);
                                        currentX += wordWidth;
                                    }
                                    
                                    // Add clickable link
                                    if (seg.isLink && seg.link) {
                                        const linkX = startX + (startX > margin ? spaceWidth : 0);
                                        doc.link(linkX, yPosition - fontSize * 0.8, wordWidth, fontSize, { url: seg.link });
                                        // Add underline
                                        doc.setDrawColor(0, 102, 204);
                                        doc.setLineWidth(0.1);
                                        doc.line(linkX, yPosition + 0.5, linkX + wordWidth, yPosition + 0.5);
                                    }
                                }
                            });
                        }
                    });
                    
                    // Reset color after link
                    if (seg.isLink) {
                        doc.setTextColor(0, 0, 0);
                    }
                });
                
                // Move to next line after formatted text
                yPosition += lineHeight;
            };

            // Helper function to add spacing
            const addSpacing = (space) => {
                yPosition += space;
                if (yPosition > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
            };

            // Parse HTML and extract text content
            const parseElement = (element) => {
                // Skip elements marked to skip (like date divs already processed)
                if (element._skipInPdf) return;
                
                const tagName = element.tagName.toLowerCase();

                switch (tagName) {
                    case 'h1':
                        addSpacing(5); // More space before h1 to separate sections
                        
                        // Check if next sibling is a date div (right-aligned with negative margin)
                        const nextSibling = element.nextElementSibling;
                        const isDateDiv = nextSibling && 
                                         nextSibling.tagName.toLowerCase() === 'div' && 
                                         nextSibling.style.textAlign === 'right' &&
                                         nextSibling.style.marginTop.includes('-');
                        
                        if (isDateDiv) {
                            // Render H1 and date side-by-side
                            const h1Text = element.textContent;
                            const dateText = nextSibling.textContent;
                            
                            doc.setFont('helvetica', 'bold');
                            doc.setFontSize(fontSizes.h1);
                            doc.text(h1Text, margin, yPosition);
                            
                            // Add date on the right
                            doc.setFont('helvetica', 'normal');
                            doc.setFontSize(fontSizes.h1 * 0.6);
                            doc.setTextColor(100, 100, 100);
                            const dateWidth = doc.getTextWidth(dateText);
                            doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
                            doc.setTextColor(0, 0, 0);
                            
                            yPosition += fontSizes.h1 * 0.5;
                            
                            // Skip the date div in the next iteration
                            element.nextElementSibling._skipInPdf = true;
                        } else {
                            addText(element.textContent, fontSizes.h1, true);
                        }
                        addSpacing(0.2); // Very tight to content below
                        break;
                    case 'h2':
                        addSpacing(5); // More space before h2 to separate sections
                        addText(element.textContent, fontSizes.h2, true);
                        addSpacing(0.2); // Very tight to content below
                        break;
                    case 'h3':
                        addSpacing(4); // More space before h3 to separate sections
                        addText(element.textContent, fontSizes.h3, true);
                        addSpacing(0.2); // Very tight to content below
                        break;
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        addSpacing(2);
                        addText(element.textContent, fontSizes.h4, true);
                        addSpacing(1);
                        break;
                    case 'p':
                        // Check if paragraph contains only an image
                        if (element.children.length === 1 && element.children[0].tagName.toLowerCase() === 'img') {
                            const img = element.children[0];
                            const alt = img.getAttribute('alt') || 'Image';
                            const src = img.getAttribute('src') || '';
                            const title = img.getAttribute('title') || '';
                            
                            // Add image placeholder with info
                            doc.setFont('helvetica', 'italic');
                            doc.setFontSize(10);
                            doc.setTextColor(100, 100, 100);
                            
                            let imageText = `[Image: ${alt}]`;
                            if (title) imageText += ` - ${title}`;
                            if (src) imageText += `\n${src}`;
                            
                            const lines = doc.splitTextToSize(imageText, maxWidth);
                            lines.forEach(line => {
                                if (yPosition + 5 > pageHeight - margin) {
                                    doc.addPage();
                                    yPosition = margin;
                                }
                                doc.text(line, margin, yPosition);
                                yPosition += 5;
                            });
                            
                            doc.setTextColor(0, 0, 0);
                            addSpacing(2);
                        } else {
                            // Handle inline formatting (bold, italic, links, inline code)
                            const formatted = getFormattedText(element);
                            if (formatted.length > 0) {
                                addFormattedText(formatted, fontSizes.paragraph);
                                addSpacing(1);
                            }
                        }
                        break;
                    case 'ul':
                    case 'ol':
                        const items = element.querySelectorAll(':scope > li');
                        items.forEach((item, index) => {
                            const bullet = tagName === 'ul' ? '• ' : `${index + 1}. `;
                            
                            // Check if item has nested lists
                            const nestedList = item.querySelector('ul, ol');
                            let itemContent = item;
                            
                            if (nestedList) {
                                // Clone item and remove nested list to get only direct content
                                itemContent = item.cloneNode(true);
                                const nestedInClone = itemContent.querySelector('ul, ol');
                                if (nestedInClone) {
                                    nestedInClone.remove();
                                }
                            }
                            
                            const formatted = getFormattedText(itemContent);
                            if (formatted.length > 0) {
                                // Check if we need a new page
                                if (yPosition + 5.5 > pageHeight - margin) {
                                    doc.addPage();
                                    yPosition = margin;
                                }
                                
                                // Add bullet/number
                                doc.setFont('helvetica', 'normal');
                                doc.setFontSize(fontSizes.list);
                                doc.text(bullet, margin, yPosition);
                                const bulletWidth = doc.getTextWidth(bullet);
                                
                                // Render formatted content with indent
                                doc.setFontSize(fontSizes.list);
                                const lineHeight = fontSizes.list * 0.5;
                                let currentX = margin + bulletWidth;
                                
                                formatted.forEach(seg => {
                                    if (seg.code) {
                                        doc.setFont('courier', 'normal');
                                    } else if (seg.bold && seg.italic) {
                                        doc.setFont('helvetica', 'bolditalic');
                                    } else if (seg.bold) {
                                        doc.setFont('helvetica', 'bold');
                                    } else if (seg.italic) {
                                        doc.setFont('helvetica', 'italic');
                                    } else {
                                        doc.setFont('helvetica', 'normal');
                                    }
                                    
                                    // Better word splitting - handle multiple spaces and newlines
                                    const words = seg.text.trim().split(/\s+/);
                                    words.forEach((word, wordIdx) => {
                                        if (!word) return; // Skip empty strings
                                        
                                        const testText = wordIdx === 0 && currentX === margin + bulletWidth ? word : ' ' + word;
                                        const textWidth = doc.getTextWidth(testText);
                                        
                                        if (currentX + textWidth > pageWidth - margin && currentX > margin + bulletWidth) {
                                            yPosition += lineHeight;
                                            currentX = margin + bulletWidth;
                                            if (yPosition > pageHeight - margin) {
                                                doc.addPage();
                                                yPosition = margin;
                                            }
                                            doc.text(word, currentX, yPosition);
                                            currentX += doc.getTextWidth(word);
                                        } else {
                                            doc.text(testText, currentX, yPosition);
                                            currentX += textWidth;
                                        }
                                    });
                                });
                                
                                yPosition += lineHeight;
                            }
                            
                            // Handle nested list if exists
                            if (nestedList) {
                                const oldMarginValue = margin;
                                // Indent nested list
                                const indentAmount = 8;
                                
                                // Temporarily increase margin for nested list
                                const nestedItems = nestedList.querySelectorAll(':scope > li');
                                const nestedTag = nestedList.tagName.toLowerCase();
                                
                                nestedItems.forEach((nestedItem, nestedIndex) => {
                                    // Use simple dash for nested bullets or letters for nested numbers
                                    const nestedBullet = nestedTag === 'ul' ? '- ' : `${String.fromCharCode(97 + nestedIndex)}. `;
                                    const nestedFormatted = getFormattedText(nestedItem);
                                    
                                    if (nestedFormatted.length > 0) {
                                        // Check if we need a new page
                                        if (yPosition + 5.5 > pageHeight - margin) {
                                            doc.addPage();
                                            yPosition = margin;
                                        }
                                        
                                        doc.setFont('helvetica', 'normal');
                                        doc.setFontSize(fontSizes.list);
                                        doc.text(nestedBullet, oldMarginValue + indentAmount, yPosition);
                                        const nestedBulletWidth = doc.getTextWidth(nestedBullet);
                                        
                                        const lineHeight = fontSizes.list * 0.5;
                                        let currentX = oldMarginValue + indentAmount + nestedBulletWidth;
                                        
                                        nestedFormatted.forEach(seg => {
                                            if (seg.code) {
                                                doc.setFont('courier', 'normal');
                                            } else if (seg.bold && seg.italic) {
                                                doc.setFont('helvetica', 'bolditalic');
                                            } else if (seg.bold) {
                                                doc.setFont('helvetica', 'bold');
                                            } else if (seg.italic) {
                                                doc.setFont('helvetica', 'italic');
                                            } else {
                                                doc.setFont('helvetica', 'normal');
                                            }
                                            
                                            const words = seg.text.trim().split(/\s+/);
                                            words.forEach((word, wordIdx) => {
                                                if (!word) return;
                                                
                                                const testText = wordIdx === 0 && currentX === oldMarginValue + indentAmount + nestedBulletWidth ? word : ' ' + word;
                                                const textWidth = doc.getTextWidth(testText);
                                                
                                                if (currentX + textWidth > pageWidth - oldMarginValue && currentX > oldMarginValue + indentAmount + nestedBulletWidth) {
                                                    yPosition += lineHeight;
                                                    currentX = oldMarginValue + indentAmount + nestedBulletWidth;
                                                    if (yPosition > pageHeight - oldMarginValue) {
                                                        doc.addPage();
                                                        yPosition = oldMarginValue;
                                                    }
                                                    doc.text(word, currentX, yPosition);
                                                    currentX += doc.getTextWidth(word);
                                                } else {
                                                    doc.text(testText, currentX, yPosition);
                                                    currentX += textWidth;
                                                }
                                            });
                                        });
                                        
                                        yPosition += lineHeight;
                                    }
                                });
                            }
                        });
                        addSpacing(2);
                        break;
                    case 'blockquote':
                        doc.setTextColor(100, 100, 100);
                        addText(element.textContent, fontSizes.blockquote, false, true);
                        doc.setTextColor(0, 0, 0);
                        addSpacing(2);
                        break;
                    case 'pre':
                    case 'code':
                        doc.setFont('courier', 'normal');
                        doc.setFontSize(fontSizes.code);
                        const codeLines = element.textContent.split('\n');
                        const codeLineHeight = fontSizes.code * 0.5;
                        codeLines.forEach(line => {
                            if (yPosition + codeLineHeight > pageHeight - margin) {
                                doc.addPage();
                                yPosition = margin;
                            }
                            doc.text(line || ' ', margin + 5, yPosition);
                            yPosition += codeLineHeight;
                        });
                        doc.setFont('helvetica', 'normal');
                        addSpacing(2);
                        break;
                    case 'table':
                        // Minimal spacing before table - keep tight to heading
                        addSpacing(0.1); // Almost no space - very close to heading above
                        
                        // Enhanced table rendering with proper Unicode support
                        const thead = element.querySelector('thead');
                        const tbody = element.querySelector('tbody');
                        
                        if (!thead && !tbody) break;
                        
                        // Get all rows
                        const allRows = element.querySelectorAll('tr');
                        if (allRows.length === 0) break;
                        
                        // TABLE FONT SIZE - use configurable setting
                        const TABLE_FONT_SIZE = fontSizes.table;
                        
                        // Calculate column widths based on content
                        let maxCols = 0;
                        const columnData = [];
                        
                        allRows.forEach(row => {
                            const cells = row.querySelectorAll('td, th');
                            maxCols = Math.max(maxCols, cells.length);
                            
                            cells.forEach((cell, colIndex) => {
                                if (!columnData[colIndex]) {
                                    columnData[colIndex] = { maxWidth: 0, texts: [] };
                                }
                                
                                // Extract text and sanitize for PDF
                                let cellText = sanitizeForPdf(cell.textContent.trim());
                                columnData[colIndex].texts.push(cellText);
                                
                                // Measure text width with new font size
                                doc.setFontSize(TABLE_FONT_SIZE);
                                doc.setFont('helvetica', 'normal');
                                const textWidth = doc.getStringUnitWidth(cellText) * TABLE_FONT_SIZE / doc.internal.scaleFactor;
                                columnData[colIndex].maxWidth = Math.max(columnData[colIndex].maxWidth, textWidth);
                            });
                        });
                        
                        // Calculate proportional column widths
                        const totalContentWidth = columnData.reduce((sum, col) => sum + col.maxWidth, 0);
                        const availableWidth = maxWidth - 4; // Leave some margin
                        
                        const colWidths = columnData.map(col => {
                            const proportionalWidth = (col.maxWidth / totalContentWidth) * availableWidth;
                            return Math.max(proportionalWidth, 20); // Minimum 20mm per column
                        });
                        
                        // Adjust if total width exceeds available width
                        const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
                        if (totalWidth > availableWidth) {
                            const scale = availableWidth / totalWidth;
                            colWidths.forEach((w, i) => colWidths[i] = w * scale);
                        }
                        
                        // Check if we need a new page
                        if (yPosition + 10 > pageHeight - margin) {
                            doc.addPage();
                            yPosition = margin;
                        }
                        
                        let tableY = yPosition;
                        
                        allRows.forEach((row, rowIndex) => {
                            const cells = row.querySelectorAll('td, th');
                            const isHeader = row.parentElement.tagName.toLowerCase() === 'thead';
                            
                            // Calculate row height based on content
                            let maxRowHeight = 7;
                            const cellLines = [];
                            
                            cells.forEach((cell, colIndex) => {
                                const cellText = sanitizeForPdf(cell.textContent.trim());
                                const colWidth = colWidths[colIndex] || 30;
                                
                                doc.setFontSize(TABLE_FONT_SIZE);
                                doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
                                
                                // Split text to fit column width - handle Unicode properly
                                const words = cellText.split(' ');
                                const lines = [];
                                let currentLine = '';
                                
                                words.forEach(word => {
                                    const testLine = currentLine ? currentLine + ' ' + word : word;
                                    const testWidth = doc.getStringUnitWidth(testLine) * TABLE_FONT_SIZE / doc.internal.scaleFactor;
                                    
                                    if (testWidth > colWidth - 2) {
                                        if (currentLine) {
                                            lines.push(currentLine);
                                            currentLine = word;
                                        } else {
                                            // Word is too long, force break
                                            lines.push(word);
                                            currentLine = '';
                                        }
                                    } else {
                                        currentLine = testLine;
                                    }
                                });
                                
                                if (currentLine) {
                                    lines.push(currentLine);
                                }
                                
                                cellLines[colIndex] = lines;
                                maxRowHeight = Math.max(maxRowHeight, lines.length * 4 + 3);
                            });
                            
                            // Check if row fits on current page
                            if (tableY + maxRowHeight > pageHeight - margin) {
                                doc.addPage();
                                tableY = margin;
                            }
                            
                            // Draw cells with borders based on style settings
                            let xPos = margin;
                            cells.forEach((cell, colIndex) => {
                                const colWidth = colWidths[colIndex] || 30;
                                
                                // Apply header background color if this is a header row
                                if (isHeader && fontSizes.tableHeaderBg && fontSizes.tableHeaderBg !== 'none') {
                                    const hexColor = fontSizes.tableHeaderBg;
                                    const r = parseInt(hexColor.slice(1, 3), 16);
                                    const g = parseInt(hexColor.slice(3, 5), 16);
                                    const b = parseInt(hexColor.slice(5, 7), 16);
                                    doc.setFillColor(r, g, b);
                                    doc.rect(xPos, tableY, colWidth, maxRowHeight, 'F');
                                }
                                
                                // Draw text and detect URLs
                                doc.setFontSize(TABLE_FONT_SIZE);
                                doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
                                
                                const lines = cellLines[colIndex] || [];
                                
                                // Check if cell contains a link
                                const linkElement = cell.querySelector('a');
                                const isLinkCell = linkElement !== null;
                                const linkUrl = isLinkCell ? linkElement.getAttribute('href') : null;
                                
                                lines.forEach((line, lineIdx) => {
                                    const textY = tableY + 4 + (lineIdx * 4);
                                    
                                    if (isLinkCell && linkUrl) {
                                        // Render as clickable link with style-specific color
                                        const linkColor = fontSizes.linkColor || [0, 102, 204];
                                        doc.setTextColor(linkColor[0], linkColor[1], linkColor[2]);
                                        doc.text(line, xPos + 1, textY, { 
                                            maxWidth: colWidth - 2,
                                            align: 'left'
                                        });
                                        
                                        // Add clickable area and underline
                                        const textWidth = Math.min(
                                            doc.getStringUnitWidth(line) * TABLE_FONT_SIZE / doc.internal.scaleFactor,
                                            colWidth - 2
                                        );
                                        doc.link(xPos + 1, textY - 3, textWidth, 4, { url: linkUrl });
                                        
                                        // Add underline
                                        doc.setDrawColor(0, 102, 204);
                                        doc.setLineWidth(0.1);
                                        doc.line(xPos + 1, textY + 0.5, xPos + 1 + textWidth, textY + 0.5);
                                        
                                        doc.setTextColor(0, 0, 0); // Reset color
                                    } else {
                                        // Regular text
                                        doc.setTextColor(0, 0, 0);
                                        doc.text(line, xPos + 1, textY, { 
                                            maxWidth: colWidth - 2,
                                            align: 'left'
                                        });
                                    }
                                });
                                
                                xPos += colWidth;
                            });
                            
                            // Draw borders based on style settings
                            const borderStyle = fontSizes.tableBorders || 'horizontal';
                            const borderWeight = fontSizes.tableBorderWeight || 0.1;
                            const borderColor = fontSizes.tableBorderColor || '#cccccc';
                            
                            // Parse hex color
                            const r = parseInt(borderColor.slice(1, 3), 16);
                            const g = parseInt(borderColor.slice(3, 5), 16);
                            const b = parseInt(borderColor.slice(5, 7), 16);
                            doc.setDrawColor(r, g, b);
                            
                            if (borderStyle === 'all') {
                                // Draw all borders (horizontal and vertical)
                                doc.setLineWidth(isHeader ? borderWeight * 2 : borderWeight);
                                
                                // Horizontal line after row
                                doc.line(margin, tableY + maxRowHeight, margin + colWidths.reduce((a, b) => a + b, 0), tableY + maxRowHeight);
                                
                                // Vertical lines between columns
                                let vertX = margin;
                                colWidths.forEach((width, idx) => {
                                    if (idx > 0) {
                                        doc.line(vertX, tableY, vertX, tableY + maxRowHeight);
                                    }
                                    vertX += width;
                                });
                                
                                // Right border
                                doc.line(vertX, tableY, vertX, tableY + maxRowHeight);
                                
                                // Top border for first row
                                if (rowIndex === 0) {
                                    doc.line(margin, tableY, margin + colWidths.reduce((a, b) => a + b, 0), tableY);
                                }
                            } else if (borderStyle === 'horizontal') {
                                // Draw only horizontal lines
                                doc.setLineWidth(isHeader ? borderWeight * 2 : borderWeight);
                                doc.line(margin, tableY + maxRowHeight, margin + colWidths.reduce((a, b) => a + b, 0), tableY + maxRowHeight);
                                
                                // Top border for first row
                                if (rowIndex === 0) {
                                    doc.line(margin, tableY, margin + colWidths.reduce((a, b) => a + b, 0), tableY);
                                }
                            }
                            // If borderStyle === 'none', don't draw any borders
                            
                            tableY += maxRowHeight;
                        });
                        
                        yPosition = tableY;
                        // Large spacing after table to separate sections
                        addSpacing(8); // Very large gap - clear visual separation between sections
                        break;
                    case 'hr':
                        // Render HR as visual separator between sections
                        addSpacing(2);
                        if (yPosition + 5 > pageHeight - margin) {
                            doc.addPage();
                            yPosition = margin;
                        }
                        doc.setDrawColor(200, 200, 200);  // Light gray
                        doc.setLineWidth(0.3);
                        doc.line(margin, yPosition, pageWidth - margin, yPosition);
                        addSpacing(3);
                        break;
                    default:
                        // Check if it's a flexbox footer div
                        if (tagName === 'div' && element.style.display === 'flex' && element.style.justifyContent === 'space-between') {
                            // This is a flexbox footer - render side by side
                            const leftDiv = element.children[0];
                            const rightDiv = element.children[1];
                            
                            if (leftDiv && rightDiv) {
                                // Left side
                                doc.setFont('helvetica', 'bold');
                                doc.setFontSize(fontSizes.paragraph);
                                const leftStrong = leftDiv.querySelector('strong');
                                if (leftStrong) {
                                    doc.text(leftStrong.textContent, margin, yPosition);
                                    yPosition += fontSizes.paragraph * 0.5;
                                }
                                
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const leftSpan = leftDiv.querySelector('span');
                                if (leftSpan) {
                                    doc.text(leftSpan.textContent, margin, yPosition);
                                }
                                doc.setTextColor(0, 0, 0);
                                
                                // Right side
                                const rightY = yPosition - fontSizes.paragraph * 0.5;
                                doc.setFont('helvetica', 'bold');
                                const rightStrong = rightDiv.querySelector('strong');
                                if (rightStrong) {
                                    const rightStrongWidth = doc.getTextWidth(rightStrong.textContent);
                                    doc.text(rightStrong.textContent, pageWidth - margin - rightStrongWidth, rightY);
                                }
                                
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const rightSpan = rightDiv.querySelector('span');
                                if (rightSpan) {
                                    const rightSpanWidth = doc.getTextWidth(rightSpan.textContent);
                                    doc.text(rightSpan.textContent, pageWidth - margin - rightSpanWidth, yPosition);
                                }
                                doc.setTextColor(0, 0, 0);
                                
                                yPosition += fontSizes.paragraph * 0.5;
                                addSpacing(2);
                            }
                        } else {
                            // For other elements, just extract text
                            if (element.textContent && element.textContent.trim()) {
                                const children = element.children;
                                if (children.length === 0) {
                                    addText(element.textContent, fontSizes.paragraph);
                                } else {
                                    Array.from(children).forEach(child => parseElement(child));
                                }
                            }
                        }
                }
            };

            // Process all children of the output element
            Array.from(outputElement.children).forEach(child => {
                parseElement(child);
            });

            // Save the PDF with style and timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const styleName = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
            doc.save(`Marco_${styleName}_${timestamp}.pdf`);
        } catch (error) {
            console.error('Failed to export PDF:', error);
            window.alert('Failed to export PDF. Please try again.');
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
    
    let savePdfSettings = () => {
        try {
            localStorage.setItem(
                localStorageNamespace + '.' + localStoragePdfSettingsKey,
                JSON.stringify(pdfFontSettings)
            );
        } catch (e) {
            console.error('Failed to save PDF settings', e);
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
    
    let setupPdfSettingsButton = () => {
        let pdfSettingsLink = document.querySelector('#pdf-settings-link');
        if (pdfSettingsLink) {
            pdfSettingsLink.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('PDF Settings clicked');
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
                editor.trigger('keyboard', 'undo', null);
                editor.focus();
            }
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
            console.log('No output element found');
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

    // ----- Option 2: Insert formatting buttons -----
    let setupInsertHeaderButton = () => {
        const button = document.querySelector('#insert-header-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertHeaderTemplate();
        });
    };

    let setupInsertFooterButton = () => {
        const button = document.querySelector('#insert-footer-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertFooterTemplate();
        });
    };

    let setupInsertBreakButton = () => {
        const button = document.querySelector('#insert-break-button');
        if (!button) return;
        
        button.addEventListener('click', (event) => {
            event.preventDefault();
            insertLineBreak();
        });
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
        
        const position = editor.getPosition();
        const startLine = position.lineNumber;
        
        editor.executeEdits('', [{
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: template
        }]);
        
        // Select "Document Title" text for easy replacement
        setTimeout(() => {
            const titleStartCol = 3; // After "# "
            const titleEndCol = 3 + "Document Title".length;
            
            editor.setSelection(new monaco.Selection(
                startLine, titleStartCol,
                startLine, titleEndCol
            ));
            
            editor.focus();
            
            // Show helper message
            showHelperMessage('Replace with your document title, then press Enter');
        }, 50);
    };

    let insertFooterTemplate = () => {
        const today = new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const template = `
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
`;
        
        const position = editor.getPosition();
        const startLine = position.lineNumber + 5; // Line with "SIGNATURE"
        
        editor.executeEdits('', [{
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: template
        }]);
        
        // Select "SIGNATURE" text for easy replacement
        setTimeout(() => {
            const sigStartCol = 13; // After "    <strong>"
            const sigEndCol = 13 + "SIGNATURE".length;
            
            editor.setSelection(new monaco.Selection(
                startLine, sigStartCol,
                startLine, sigEndCol
            ));
            
            editor.focus();
            
            // Show helper message
            showHelperMessage('Replace SIGNATURE and CLIENT labels, then edit Document Name');
        }, 50);
    };

    // Helper message display
    let showHelperMessage = (message) => {
        const helperPanel = document.querySelector('#helper-panel');
        const canvas = document.getElementById('mofu-canvas');
        const mouth = document.getElementById('mofu-mouth');
        
        if (!helperPanel) return;
        
        // Set message directly in panel
        helperPanel.textContent = message;
        
        // Show panel
        helperPanel.classList.remove('hidden');
        
        // Subtle blob reaction - just a gentle smile widening
        if (canvas && mouth) {
            const originalWidth = mouth.style.width || '7px';
            mouth.style.width = '9px';
            mouth.style.transition = 'width 0.3s ease';
            
            setTimeout(() => {
                mouth.style.width = originalWidth;
            }, 800);
        }
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            helperPanel.classList.add('hidden');
        }, 4000);
    };

    // Setup helper panel close button
    let setupHelperPanel = () => {
        const helperPanel = document.querySelector('#helper-panel');
        
        // Click to dismiss
        if (helperPanel) {
            helperPanel.addEventListener('click', () => {
                helperPanel.classList.add('hidden');
            });
        }
    };

    // Setup dropdown menus to work reliably
    let setupDropdowns = () => {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!dropdownContent) return;
            
            let isOpen = false;
            let closeTimeout = null;
            
            // Open on hover
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
                isOpen = true;
                dropdownContent.style.display = 'block';
            });
            
            // Delay close when mouse leaves
            dropdown.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(() => {
                    isOpen = false;
                    dropdownContent.style.display = 'none';
                }, 200);
            });
            
            // Keep open when hovering over dropdown content
            dropdownContent.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
                isOpen = true;
            });
            
            dropdownContent.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(() => {
                    isOpen = false;
                    dropdownContent.style.display = 'none';
                }, 200);
            });
            
            // Toggle on click
            dropdown.addEventListener('click', (e) => {
                // Don't toggle if clicking on a checkbox, select, or link
                if (e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'SELECT' || 
                    e.target.tagName === 'A' ||
                    e.target.closest('a')) {
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
        // Don't allow opening cheatsheet in vertical mode
        const container = document.querySelector('#container');
        if (!cheatSheetVisible && container.classList.contains('vertical')) {
            return;
        }
        
        cheatSheetVisible = !cheatSheetVisible;
        
        const panel = document.querySelector('#cheatsheet-panel');
        const divider = document.querySelector('#cheatsheet-divider');
        
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
                    { title: 'H1 Header', code: '# Header 1' },
                    { title: 'H2 Header', code: '## Header 2' },
                    { title: 'H3 Header', code: '### Header 3' }
                ]
            },
            {
                section: 'Text Formatting',
                items: [
                    { title: 'Bold', code: '**bold text**' },
                    { title: 'Italic', code: '*italic text*' },
                    { title: 'Bold + Italic', code: '***bold and italic***' },
                    { title: 'Strikethrough', code: '~~strikethrough~~' },
                    { title: 'Inline Code', code: '`code`' }
                ]
            },
            {
                section: 'Lists',
                items: [
                    { title: 'Unordered List', code: '* Item 1\n* Item 2\n  * Nested item' },
                    { title: 'Ordered List', code: '1. First item\n2. Second item\n3. Third item' },
                    { title: 'Task List', code: '- [ ] Unchecked\n- [x] Checked' }
                ]
            },
            {
                section: 'Links & Images',
                items: [
                    { title: 'Link', code: '[Link Text](https://example.com)' },
                    { title: 'Image', code: '![Alt Text](image.jpg)' },
                    { title: 'Link with Title', code: '[Link](https://example.com "Title")' }
                ]
            },
            {
                section: 'Tables',
                items: [
                    { title: 'Basic Table', code: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |' },
                    { title: 'Aligned Table', code: '| Left | Center | Right |\n| :--- | :---: | ---: |\n| L | C | R |' }
                ]
            },
            {
                section: 'Code Blocks',
                items: [
                    { title: 'Code Block', code: '```\ncode here\n```' },
                    { title: 'Code with Language', code: '```javascript\nconst x = 10;\n```' }
                ]
            },
            {
                section: 'Quotes & Breaks',
                items: [
                    { title: 'Blockquote', code: '> This is a quote\n> Multiple lines' },
                    { title: 'Horizontal Rule', code: '---' },
                    { title: 'Line Break', code: 'Line 1  \nLine 2' }
                ]
            },
            {
                section: 'Document Structure',
                items: [
                    { title: 'Header with Date', code: '# Document Title\n\n<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">11 Feb 2026</div>\n\n---' },
                    { title: 'Footer', code: '---\n\n<div style="display: flex; justify-content: space-between; margin-top: 20px;">\n  <div>\n    <strong>SIGNATURE</strong><br>\n    <span style="color: #666;">Document Name</span>\n  </div>\n  <div style="text-align: right;">\n    <strong>CLIENT</strong><br>\n    <span style="color: #666;">11 Feb 2026</span>\n  </div>\n</div>' }
                ]
            },
            {
                section: 'YAML Metadata',
                items: [
                    { title: 'Document Metadata', code: '---\ntitle: Document Title\ndate: 11 Feb 2026\nfooter-left: SIGNATURE\nfooter-right: CLIENT\n---' }
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
                        <button class="cheatsheet-copy-btn" data-code="${itemId}">Copy</button>
                    </div>
                    <div class="cheatsheet-code" id="${itemId}">${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                </div>`;
            });
            
            contentHtml += '</div>';
        });
        
        contentContainer.innerHTML = contentHtml;
        
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

    let insertLineBreak = () => {
        const position = editor.getPosition();
        editor.executeEdits('', [{
            range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: '\n\n---\n\n'
        }]);
        editor.focus();
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

    let setupDivider = () => {
        let lastLeftRatio = 0.5;
        let lastTopRatio = 0.5;
        const divider = document.getElementById('split-divider');
        const editorPane = document.getElementById('edit');
        const previewPane = document.getElementById('preview');
        const container = document.getElementById('container');

        let isDragging = false;

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
            if (!isDragging) {
                divider.classList.remove('hover');
            }
        });

        divider.addEventListener('mousedown', () => {
            isDragging = true;
            divider.classList.add('active');
            if (isVerticalLayout()) {
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

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            document.body.style.userSelect = 'none';
            const containerRect = container.getBoundingClientRect();

            if (isVerticalLayout()) {
                // Vertical layout - resize by height
                const totalHeight = getAvailableHeight();
                const offsetY = e.clientY - containerRect.top;
                const dividerHeight = divider.offsetHeight;

                const minHeight = 100;
                const maxHeight = totalHeight - minHeight - dividerHeight;
                
                let topHeight;
                if (isFlipped()) {
                    // When flipped in vertical: preview is on top, editor on bottom
                    topHeight = Math.max(minHeight, Math.min(offsetY, maxHeight));
                    previewPane.style.height = topHeight + 'px';
                    editorPane.style.height = (totalHeight - topHeight - dividerHeight) + 'px';
                } else {
                    // Normal vertical: editor on top, preview on bottom
                    topHeight = Math.max(minHeight, Math.min(offsetY, maxHeight));
                    editorPane.style.height = topHeight + 'px';
                    previewPane.style.height = (totalHeight - topHeight - dividerHeight) + 'px';
                }
                
                editorPane.style.width = '';
                previewPane.style.width = '';
                lastTopRatio = topHeight / (totalHeight - dividerHeight);
            } else {
                // Horizontal layout - resize by width
                const totalWidth = getAvailableWidth();
                const dividerWidth = divider.offsetWidth;
                const minWidth = 100;
                const maxWidth = totalWidth - minWidth - dividerWidth;

                let leftWidth;
                if (isFlipped()) {
                    // When flipped: preview is on left, editor on right
                    // offsetX from left edge represents preview width
                    const offsetX = e.clientX - containerRect.left;
                    leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
                    previewPane.style.width = leftWidth + 'px';
                    editorPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
                } else {
                    // Normal: editor on left, preview on right
                    // offsetX from left edge represents editor width
                    const offsetX = e.clientX - containerRect.left;
                    leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
                    editorPane.style.width = leftWidth + 'px';
                    previewPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
                }
                
                editorPane.style.height = '';
                previewPane.style.height = '';
                lastLeftRatio = leftWidth / (totalWidth - dividerWidth);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                divider.classList.remove('active');
                divider.classList.remove('hover');
                document.body.style.cursor = 'default';
                document.body.style.userSelect = '';
            }
        });

        const updatePaneSizes = () => {
            if (isVerticalLayout()) {
                // Vertical layout
                const totalHeight = getAvailableHeight();
                const dividerHeight = divider.offsetHeight;
                const availableHeight = totalHeight - dividerHeight;

                const topSize = availableHeight * lastTopRatio;
                const bottomSize = availableHeight * (1 - lastTopRatio);

                if (isFlipped()) {
                    previewPane.style.height = topSize + 'px';
                    editorPane.style.height = bottomSize + 'px';
                } else {
                    editorPane.style.height = topSize + 'px';
                    previewPane.style.height = bottomSize + 'px';
                }
                
                editorPane.style.width = '';
                previewPane.style.width = '';
            } else {
                // Horizontal layout
                const totalWidth = getAvailableWidth();
                const dividerWidth = divider.offsetWidth;
                const availableWidth = totalWidth - dividerWidth;

                const leftSize = availableWidth * lastLeftRatio;
                const rightSize = availableWidth * (1 - lastLeftRatio);

                if (isFlipped()) {
                    previewPane.style.width = leftSize + 'px';
                    editorPane.style.width = rightSize + 'px';
                } else {
                    editorPane.style.width = leftSize + 'px';
                    previewPane.style.width = rightSize + 'px';
                }
                
                editorPane.style.height = '';
                previewPane.style.height = '';
            }
        };

        window.addEventListener('resize', updatePaneSizes);

        // Watch for layout changes (vertical/horizontal toggle)
        const layoutObserver = new MutationObserver(() => {
            updatePaneSizes();
        });
        layoutObserver.observe(container, { attributes: true, attributeFilter: ['class'] });
    };

    // ----- entry point -----
    let lastContent = loadLastContent();
    let editor = setupEditor();
    if (lastContent) {
        presetValue(lastContent);
    } else {
        presetValue(defaultInput);
    }
    setupClearButton();
    setupPasteButton();
    setupCopyButton(editor);
    setupUndoButton();
    setupExportButton();
    setupPrintPdfButton();
    setupExportHtmlButton();
    setupPdfSettingsButton();
    setupInsertHeaderButton();
    setupInsertFooterButton();
    setupInsertBreakButton();
    setupHelperPanel();
    setupDropdowns();
    setupCheatSheetButton();
    
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

    // initialize theme (dark/light)
    let themeSettings = loadThemeSettings();
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
            if (isAnimating) return;
            
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
    };
    
    initMofuBlob();
};

window.addEventListener("load", () => {
    init();
});
