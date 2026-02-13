import Storehouse from 'storehouse-js';
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const init = () => {
    let hasEdited = false;
    let scrollBarSync = false;
    let cursorSync = false;
    let tocEnabled = false;

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
        });

        // Scroll sync is now handled in the consolidated section at the bottom

        // Setup markdown validation
        let validationEnabled = false;
        const validateMarkdown = () => {
            if (!validationEnabled) return;
            
            const model = editor.getModel();
            const content = model.getValue();
            const lines = content.split('\n');
            const markers = [];
            const processedLines = new Set(); // Track lines already flagged to avoid duplicates
            
            // Helper function: Split table cells by | but ignore pipes inside backticks
            const splitTableCells = (line) => {
                const cells = [];
                let currentCell = '';
                let inCode = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    if (char === '`') {
                        inCode = !inCode;
                        currentCell += char;
                    } else if (char === '|' && !inCode) {
                        cells.push(currentCell);
                        currentCell = '';
                    } else {
                        currentCell += char;
                    }
                }
                
                // Add the last cell
                cells.push(currentCell);
                
                // Filter out empty cells (from leading/trailing pipes)
                return cells.filter(c => c.trim());
            };
            
            // Track code blocks
            let inCodeBlock = false;
            let codeBlockStarts = [];
            
            // Track list context
            let lastListMarker = null;
            let lastOrderedNumber = null;
            
            // Track table context
            let inTable = false;
            let tableHeaderCols = 0;
            
            lines.forEach((line, index) => {
                const lineNumber = index + 1;
                const trimmed = line.trim();
                
                // Track code blocks
                if (trimmed.startsWith('```')) {
                    if (!inCodeBlock) {
                        codeBlockStarts.push(lineNumber);
                        inCodeBlock = true;
                    } else {
                        // Closing code block - remove the last opening from the stack
                        codeBlockStarts.pop();
                        inCodeBlock = false;
                    }
                }
                
                // Skip validation inside code blocks
                if (inCodeBlock && !trimmed.startsWith('```')) return;
                
                // Detect horizontal rules (must be before emphasis checks)
                const isHorizontalRule = /^(\*{3,}|-{3,}|_{3,})$/.test(trimmed);
                
                // Validate horizontal rule format (should be on its own line, properly formatted)
                if (trimmed.match(/^[\*\-_]{3,}$/)) {
                    const char = trimmed[0];
                    const isValid = trimmed.split('').every(c => c === char || c === ' ');
                    if (!isValid) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Info,
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: line.length + 1,
                            message: `Horizontal rule format: Use consistent characters (e.g., ---, ***, or ___)`,
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for missing blank line after heading
                if (index > 0) {
                    const prevLine = lines[index - 1].trim();
                    const isHeading = /^#{1,6}\s/.test(prevLine);
                    if (isHeading && trimmed && !trimmed.startsWith('#') && !isHorizontalRule) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Info,
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: 1,
                            message: 'Missing blank line after heading: Add blank line for better readability',
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for list-table conflict
                if (index > 0 && trimmed.includes('|')) {
                    const prevLine = lines[index - 1].trim();
                    const isListItem = /^(\d+\.|\*|\+|-)\s/.test(prevLine);
                    const isTableRow = /^\|.*\|/.test(trimmed);
                    if (isListItem && isTableRow) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Warning,
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: 1,
                            message: 'List-table conflict: Add blank line between list and table',
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for headers without space after #
                const headerNoSpace = line.match(/^(#{1,6})([^\s#])/);
                if (headerNoSpace) {
                    markers.push({
                        severity: monaco.MarkerSeverity.Warning,
                        startLineNumber: lineNumber,
                        startColumn: 1,
                        endLineNumber: lineNumber,
                        endColumn: headerNoSpace[1].length + 2,
                        message: 'Header missing space: Add space after # (e.g., "# Heading")',
                        source: 'markdown-validator'
                    });
                    processedLines.add(lineNumber);
                }
                
                // Check for malformed headers (too many #)
                if (line.match(/^#{7,}/)) {
                    markers.push({
                        severity: monaco.MarkerSeverity.Warning,
                        startLineNumber: lineNumber,
                        startColumn: 1,
                        endLineNumber: lineNumber,
                        endColumn: line.length + 1,
                        message: 'Invalid header: Markdown only supports h1-h6 (use # to ######)',
                        source: 'markdown-validator'
                    });
                    processedLines.add(lineNumber);
                }
                
                // Check for image/link issues (consolidated to avoid duplicates)
                const imagePattern = /!\[([^\]]*)\]\(([^)]*)\)/g;
                // Match broken images: ![text( OR ![text] without closing )
                const imageBrokenPattern = /!\[.*\([^)]*$/;
                
                if (imageBrokenPattern.test(line) && !imagePattern.test(line)) {
                    // Broken image syntax - missing ] or missing )
                    markers.push({
                        severity: monaco.MarkerSeverity.Error,
                        startLineNumber: lineNumber,
                        startColumn: line.indexOf('![') + 1,
                        endLineNumber: lineNumber,
                        endColumn: line.length + 1,
                        message: 'Broken image syntax: Missing closing bracket ] or parenthesis )',
                        source: 'markdown-validator'
                    });
                    processedLines.add(lineNumber);
                } else {
                    // Check for empty image URL
                    const emptyImgUrl = line.match(/!\[([^\]]*)\]\(\s*\)/);
                    if (emptyImgUrl) {
                        const startCol = line.indexOf(emptyImgUrl[0]) + 1;
                        markers.push({
                            severity: monaco.MarkerSeverity.Error,
                            startLineNumber: lineNumber,
                            startColumn: startCol,
                            endLineNumber: lineNumber,
                            endColumn: startCol + emptyImgUrl[0].length,
                            message: 'Empty image URL: Add image source (e.g., ![Alt](image.png))',
                            source: 'markdown-validator'
                        });
                        processedLines.add(lineNumber);
                    }
                    
                    // Check for empty alt text
                    const emptyAlt = line.match(/!\[\]\(([^)]+)\)/);
                    if (emptyAlt && !processedLines.has(lineNumber)) {
                        const startCol = line.indexOf(emptyAlt[0]) + 1;
                        markers.push({
                            severity: monaco.MarkerSeverity.Info,
                            startLineNumber: lineNumber,
                            startColumn: startCol,
                            endLineNumber: lineNumber,
                            endColumn: startCol + emptyAlt[0].length,
                            message: 'Empty alt text: Add description for accessibility (e.g., ![Logo](url))',
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for link issues (consolidated)
                const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
                // Match broken links: [text( OR [text] without closing ) - but only at end of line or before whitespace
                const linkBrokenPattern = /\[[^\]]*\([^)]*$/;
                
                if (linkBrokenPattern.test(line) && !linkPattern.test(line) && !processedLines.has(lineNumber)) {
                    // Check if this is truly a broken link or just incomplete at end of line
                    const lastBracketPos = line.lastIndexOf('[');
                    const hasParenAfter = line.indexOf('(', lastBracketPos) > -1;
                    
                    // Only flag if there's a ( after the [ (indicating intent to create link)
                    if (hasParenAfter) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Error,
                            startLineNumber: lineNumber,
                            startColumn: lastBracketPos + 1,
                            endLineNumber: lineNumber,
                            endColumn: line.length + 1,
                            message: 'Broken link syntax: Missing closing bracket ] or parenthesis )',
                            source: 'markdown-validator'
                        });
                        processedLines.add(lineNumber);
                    }
                }
                
                // Check for empty link
                const emptyLink = line.match(/\[\]\(\s*\)/);
                if (emptyLink && !processedLines.has(lineNumber)) {
                    const startCol = line.indexOf(emptyLink[0]) + 1;
                    markers.push({
                        severity: monaco.MarkerSeverity.Error,
                        startLineNumber: lineNumber,
                        startColumn: startCol,
                        endLineNumber: lineNumber,
                        endColumn: startCol + emptyLink[0].length,
                        message: 'Empty link: Add text and URL (e.g., [Click here](url))',
                        source: 'markdown-validator'
                    });
                }
                
                // Check for unclosed bold
                if (!isHorizontalRule) {
                    const boldMatches = line.match(/\*\*/g);
                    if (boldMatches && boldMatches.length % 2 !== 0) {
                        const lastBoldPos = line.lastIndexOf('**');
                        markers.push({
                            severity: monaco.MarkerSeverity.Warning,
                            startLineNumber: lineNumber,
                            startColumn: lastBoldPos + 1,
                            endLineNumber: lineNumber,
                            endColumn: line.length + 1,
                            message: 'Unclosed bold: Add closing ** (e.g., **bold text**)',
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for unclosed italic
                if (!isHorizontalRule) {
                    // Count all asterisks, then subtract bold markers
                    const allStars = (line.match(/\*/g) || []).length;
                    const boldMarkers = (line.match(/\*\*/g) || []).length;
                    const singleStars = allStars - (boldMarkers * 2);
                    
                    // If odd number of single stars, we have unclosed italic
                    if (singleStars % 2 !== 0 && singleStars > 0) {
                        // Find the last single * (not part of **)
                        let lastSingleStarPos = -1;
                        for (let i = line.length - 1; i >= 0; i--) {
                            if (line[i] === '*') {
                                // Check if it's part of **
                                const isPartOfBold = (i > 0 && line[i-1] === '*') || (i < line.length - 1 && line[i+1] === '*');
                                if (!isPartOfBold) {
                                    lastSingleStarPos = i;
                                    break;
                                }
                            }
                        }
                        
                        if (lastSingleStarPos !== -1) {
                            markers.push({
                                severity: monaco.MarkerSeverity.Warning,
                                startLineNumber: lineNumber,
                                startColumn: lastSingleStarPos + 1,
                                endLineNumber: lineNumber,
                                endColumn: line.length + 1,
                                message: 'Unclosed italic: Add closing * (e.g., *italic text*)',
                                source: 'markdown-validator'
                            });
                        }
                    }
                }
                
                // Check for unclosed inline code
                const backtickMatches = line.match(/(?<!`)`(?!`)/g);
                if (backtickMatches && backtickMatches.length % 2 !== 0) {
                    const lastBacktickPos = line.lastIndexOf('`');
                    if (line[lastBacktickPos + 1] !== '`' && line[lastBacktickPos - 1] !== '`') {
                        markers.push({
                            severity: monaco.MarkerSeverity.Warning,
                            startLineNumber: lineNumber,
                            startColumn: lastBacktickPos + 1,
                            endLineNumber: lineNumber,
                            endColumn: line.length + 1,
                            message: 'Unclosed inline code: Add closing ` (e.g., `code`)',
                            source: 'markdown-validator'
                        });
                    }
                }
                
                // Check for blockquote without space
                const quoteNoSpace = line.match(/^(>+)([^\s>])/);
                if (quoteNoSpace) {
                    markers.push({
                        severity: monaco.MarkerSeverity.Info,
                        startLineNumber: lineNumber,
                        startColumn: 1,
                        endLineNumber: lineNumber,
                        endColumn: quoteNoSpace[1].length + 2,
                        message: 'Blockquote missing space: Add space after > (e.g., "> Quote")',
                        source: 'markdown-validator'
                    });
                }
                
                // Check for mixed list markers - FLAG NON-DASH MARKERS
                const unorderedMatch = trimmed.match(/^([-+*])\s/);
                if (unorderedMatch) {
                    const currentMarker = unorderedMatch[1];
                    
                    // If this is not a dash and we're in a list, flag it
                    if (currentMarker !== '-' && (lastListMarker || lastListMarker === null)) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Info,
                            startLineNumber: lineNumber,
                            startColumn: 1,
                            endLineNumber: lineNumber,
                            endColumn: 3,
                            message: `Mixed list markers: Use consistent marker (-)`,
                            source: 'markdown-validator'
                        });
                    }
                    
                    lastListMarker = currentMarker;
                    lastOrderedNumber = null;
                } else if (trimmed.match(/^\d+\.\s/)) {
                    // Check ordered list numbering
                    const numMatch = trimmed.match(/^(\d+)\.\s/);
                    if (numMatch) {
                        const num = parseInt(numMatch[1]);
                        if (lastOrderedNumber !== null && num !== lastOrderedNumber + 1 && num !== 1) {
                            markers.push({
                                severity: monaco.MarkerSeverity.Info,
                                startLineNumber: lineNumber,
                                startColumn: 1,
                                endLineNumber: lineNumber,
                                endColumn: numMatch[0].length,
                                message: `List numbering skip: Expected ${lastOrderedNumber + 1}, got ${num}`,
                                source: 'markdown-validator'
                            });
                        }
                        lastOrderedNumber = num;
                        lastListMarker = null;
                    }
                } else if (trimmed && !trimmed.startsWith('>') && !trimmed.startsWith('#')) {
                    // Reset list tracking on non-list content
                    lastListMarker = null;
                    lastOrderedNumber = null;
                }
                
                // Check for table structure
                if (trimmed.includes('|')) {
                    const cells = splitTableCells(trimmed);
                    const isSeparator = /^[\s:-]+$/.test(cells.join(''));
                    
                    if (isSeparator) {
                        // This is a separator row - validate format
                        const separatorPattern = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
                        if (!separatorPattern.test(trimmed)) {
                            markers.push({
                                severity: monaco.MarkerSeverity.Warning,
                                startLineNumber: lineNumber,
                                startColumn: 1,
                                endLineNumber: lineNumber,
                                endColumn: line.length + 1,
                                message: 'Malformed table separator: Use format | --- | --- | with spaces',
                                source: 'markdown-validator'
                            });
                        }
                        
                        const prevLine = index > 0 ? lines[index - 1].trim() : '';
                        if (!prevLine.includes('|')) {
                            markers.push({
                                severity: monaco.MarkerSeverity.Warning,
                                startLineNumber: lineNumber,
                                startColumn: 1,
                                endLineNumber: lineNumber,
                                endColumn: line.length + 1,
                                message: 'Table separator without header: Add header row above',
                                source: 'markdown-validator'
                            });
                        } else {
                            const headerCols = splitTableCells(prevLine).length;
                            const separatorCols = cells.length;
                            
                            // CRITICAL: Check if separator column count matches header
                            if (separatorCols !== headerCols) {
                                markers.push({
                                    severity: monaco.MarkerSeverity.Warning,
                                    startLineNumber: lineNumber,
                                    startColumn: 1,
                                    endLineNumber: lineNumber,
                                    endColumn: line.length + 1,
                                    message: `Table separator column mismatch: Expected ${headerCols} columns, got ${separatorCols}`,
                                    source: 'markdown-validator'
                                });
                            }
                            
                            tableHeaderCols = headerCols;
                            inTable = true;
                        }
                    } else if (inTable && tableHeaderCols > 0) {
                        // CRITICAL: Check if next line is a separator (new table starting)
                        const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
                        const separatorPattern = /^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/;
                        
                        if (nextLine && separatorPattern.test(nextLine)) {
                            // This is a NEW table header, not a data row!
                            // Close current table and let next iteration handle the new one
                            inTable = false;
                            tableHeaderCols = 0;
                        } else {
                            // This is a data row - check column count consistency
                            if (cells.length !== tableHeaderCols) {
                                markers.push({
                                    severity: monaco.MarkerSeverity.Warning,
                                    startLineNumber: lineNumber,
                                    startColumn: 1,
                                    endLineNumber: lineNumber,
                                    endColumn: line.length + 1,
                                    message: `Table column mismatch: Expected ${tableHeaderCols} columns, got ${cells.length}`,
                                    source: 'markdown-validator'
                                });
                            }
                        }
                    }
                } else if (inTable && trimmed) {
                    inTable = false;
                    tableHeaderCols = 0;
                }
                
                // Check for unclosed HTML tags
                const htmlTags = line.match(/<(\w+)(?:\s[^>]*)?>(?!.*<\/\1>)/g);
                if (htmlTags) {
                    htmlTags.forEach(tag => {
                        const tagName = tag.match(/<(\w+)/)[1];
                        if (!['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
                            const tagStart = line.indexOf(tag);
                            markers.push({
                                severity: monaco.MarkerSeverity.Warning,
                                startLineNumber: lineNumber,
                                startColumn: tagStart + 1,
                                endLineNumber: lineNumber,
                                endColumn: tagStart + tag.length + 1,
                                message: `Unclosed HTML tag: <${tagName}> (add </${tagName}>)`,
                                source: 'markdown-validator'
                            });
                        }
                    });
                }
            });
            
            // Check for unclosed code blocks (global check)
            // After processing, if there are any unclosed blocks left in the stack
            if (codeBlockStarts.length > 0) {
                const lastBlockLine = codeBlockStarts[codeBlockStarts.length - 1];
                markers.push({
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: lastBlockLine,
                    startColumn: 1,
                    endLineNumber: lastBlockLine,
                    endColumn: lines[lastBlockLine - 1].length + 1,
                    message: 'Unclosed code block: Add closing ``` on a new line',
                    source: 'markdown-validator'
                });
            }
            
            monaco.editor.setModelMarkers(model, 'markdown-validator', markers);
        };
        
        // Run validation on content change (debounced)
        let validationTimeout;
        editor.onDidChangeModelContent(() => {
            if (!validationEnabled) return;
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(validateMarkdown, 500);
        });
        
        // Store validation functions for external access
        editor._validateMarkdown = validateMarkdown;
        editor._setValidationEnabled = (enabled) => {
            validationEnabled = enabled;
            if (enabled) {
                validateMarkdown();
            } else {
                monaco.editor.setModelMarkers(editor.getModel(), 'markdown-validator', []);
            }
        };
        
        // Inline rectangular validation bar (VSCode style)
        let currentSuggestionBar = null;
        let currentFixIndex = 0;
        let validationIssues = [];
        let lineDecorations = []; // Track line highlights
        
        const createInlineSuggestionBar = () => {
            const bar = document.createElement('div');
            bar.className = 'validation-inline-bar';
            bar.innerHTML = `
                <div class="validation-bar-content">
                    <div class="validation-bar-icon"></div>
                    <span class="validation-bar-file">markdown</span>
                    <span class="validation-bar-counter"></span>
                    <span class="validation-bar-message"></span>
                    <div class="validation-bar-preview"></div>
                    <div class="validation-bar-actions">
                        <button class="validation-btn validation-btn-apply" title="Apply this fix">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Apply
                        </button>
                        <button class="validation-btn validation-btn-apply-all" title="Apply all pending fixes">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M13 3L6 10L3 7M13 7L6 14L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Apply All
                        </button>
                        <button class="validation-btn validation-btn-skip" title="Skip this issue">
                            Skip
                        </button>
                        <button class="validation-btn validation-btn-discard-all" title="Discard all and close">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Discard All
                        </button>
                        <div class="validation-nav-buttons">
                            <button class="validation-btn validation-btn-prev" title="Previous issue">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="validation-btn validation-btn-next" title="Next issue">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return bar;
        };
        
        const generateFix = (marker, line) => {
            let suggestedFix = null;
            let fixDescription = '';
            
            // DEBUG: Log every fix attempt
            console.log('[generateFix] Message:', marker.message);
            console.log('[generateFix] Line:', line);
            
            // Header missing space
            if (marker.message.includes('Header missing space')) {
                const match = line.match(/^(#{1,6})([^\s#].+)/);
                if (match) {
                    suggestedFix = match[1] + ' ' + match[2];
                    fixDescription = 'Add space after #';
                    console.log('[generateFix] Header fix:', suggestedFix);
                }
            }
            // Invalid header (too many #)
            else if (marker.message.includes('Invalid header')) {
                const match = line.match(/^(#{7,})(.+)/);
                if (match) {
                    suggestedFix = '###### ' + match[2].trim();
                    fixDescription = 'Convert to h6 (maximum level)';
                }
            }
            // Blockquote missing space
            else if (marker.message.includes('Blockquote missing space')) {
                const match = line.match(/^(>+)([^\s>].+)/);
                if (match) {
                    suggestedFix = match[1] + ' ' + match[2];
                    fixDescription = 'Add space after >';
                }
            }
            // Mixed list markers - PRESERVE INDENTATION
            else if (marker.message.includes('Mixed list markers')) {
                // Match: optional indent, marker (+*-), optional space, rest of line
                const match = line.match(/^(\s*)([+*-])(\s*.+)/);
                if (match) {
                    // PRESERVE the original indentation
                    const indent = match[1];
                    const content = match[3].trimStart(); // Remove leading spaces from content only
                    suggestedFix = indent + '- ' + content;
                    fixDescription = 'Standardize to - marker';
                }
            }
            // Table column mismatch - IMPROVED: Add red placeholders
            else if (marker.message.includes('Table column mismatch')) {
                const expectedMatch = marker.message.match(/Expected (\d+) columns, got (\d+)/);
                if (expectedMatch) {
                    const expected = parseInt(expectedMatch[1]);
                    const got = parseInt(expectedMatch[2]);
                    
                    if (got < expected) {
                        // Add missing columns with red placeholder HTML
                        const missingCount = expected - got;
                        // Remove trailing pipe if exists
                        const cleanLine = line.trimEnd().replace(/\|$/, '').trimEnd();
                        // Add missing columns with red HTML spans
                        const placeholders = ' | ' + Array(missingCount).fill('<span style="color:red">COL_FIX!</span>').join(' | ');
                        suggestedFix = cleanLine + placeholders + ' |';
                        fixDescription = `Add ${missingCount} missing column(s)`;
                    } else {
                        // Too many columns - remove extras
                        const parts = line.split('|');
                        // Keep leading/trailing empty strings from split
                        const hasLeadingPipe = line.trimStart().startsWith('|');
                        const hasTrailingPipe = line.trimEnd().endsWith('|');
                        
                        let cells = parts.map(c => c.trim()).filter(c => c !== '');
                        cells = cells.slice(0, expected);
                        
                        if (hasLeadingPipe && hasTrailingPipe) {
                            suggestedFix = '| ' + cells.join(' | ') + ' |';
                        } else if (hasLeadingPipe) {
                            suggestedFix = '| ' + cells.join(' | ');
                        } else if (hasTrailingPipe) {
                            suggestedFix = cells.join(' | ') + ' |';
                        } else {
                            suggestedFix = cells.join(' | ');
                        }
                        fixDescription = `Remove ${got - expected} extra column(s)`;
                    }
                }
            }
            // Horizontal rule format
            else if (marker.message.includes('Horizontal rule format')) {
                suggestedFix = '---';
                fixDescription = 'Standardize to ---';
            }
            // Malformed table separator - FIXED: Use header row column count
            else if (marker.message.includes('Malformed table separator')) {
                // Look at the previous line to get the correct column count
                const lineNumber = marker.startLineNumber;
                const model = editor.getModel();
                const prevLine = lineNumber > 1 ? model.getLineContent(lineNumber - 1).trim() : '';
                
                if (prevLine.includes('|')) {
                    // Count columns from header row
                    const headerCols = prevLine.split('|').filter(c => c.trim()).length;
                    suggestedFix = '| ' + Array(headerCols).fill('---').join(' | ') + ' |';
                    fixDescription = `Fix separator to match ${headerCols} columns`;
                } else {
                    // Fallback: count from current line pipes
                    const pipeCount = (line.match(/\|/g) || []).length;
                    const colCount = Math.max(3, pipeCount - 1);
                    suggestedFix = '| ' + Array(colCount).fill('---').join(' | ') + ' |';
                    fixDescription = 'Fix table separator format';
                }
            }
            // Table separator column mismatch - NEW FIX
            else if (marker.message.includes('Table separator column mismatch')) {
                const expectedMatch = marker.message.match(/Expected (\d+) columns/);
                if (expectedMatch) {
                    const headerCols = parseInt(expectedMatch[1]);
                    suggestedFix = '| ' + Array(headerCols).fill('---').join(' | ') + ' |';
                    fixDescription = `Update separator to match ${headerCols} columns`;
                }
            }
            // Empty alt text
            else if (marker.message.includes('Empty alt text')) {
                suggestedFix = line.replace(/!\[\]/, '![Image description]');
                fixDescription = 'Add placeholder alt text';
            }
            // Unclosed HTML tags
            else if (marker.message.includes('Unclosed HTML tag')) {
                const tagMatch = marker.message.match(/Unclosed HTML tag: <(\w+)>/);
                if (tagMatch) {
                    const tag = tagMatch[1];
                    suggestedFix = line + `</${tag}>`;
                    fixDescription = `Add closing </${tag}>`;
                }
            }
            // List numbering skip
            else if (marker.message.includes('List numbering skip')) {
                const match = marker.message.match(/Expected (\d+)/);
                if (match) {
                    const correctNum = match[1];
                    suggestedFix = line.replace(/^(\s*)\d+\./, `$1${correctNum}.`);
                    fixDescription = `Change to ${correctNum}.`;
                }
            }
            // Unclosed inline code
            else if (marker.message.includes('Unclosed inline code')) {
                // Check where to place the closing `
                const trimmedLine = line.trimEnd();
                
                // Priority 1: Inside a link [text] - close before ]
                if (trimmedLine.match(/\[.*`[^\]]*\]/)) {
                    // Code is inside link text - close before the ]
                    suggestedFix = trimmedLine.replace(/\]/, '`]');
                }
                // Priority 2: Inside a table cell - close before |
                else if (trimmedLine.endsWith('|')) {
                    suggestedFix = trimmedLine.replace(/\s*\|$/, '`|');
                }
                // Priority 3: End of line
                else {
                    suggestedFix = line + '`';
                }
                fixDescription = 'Add closing backtick';
            }
            // Unclosed bold
            else if (marker.message.includes('Unclosed bold')) {
                const trimmedLine = line.trimEnd();
                const lastBoldPos = line.lastIndexOf('**');
                
                // Find where to close
                let closePos = trimmedLine.length;
                
                // Look for table cell boundary (| with optional space before it)
                const tableCellMatch = trimmedLine.match(/\s+\|/);
                if (tableCellMatch) {
                    const pipePos = trimmedLine.indexOf(tableCellMatch[0]);
                    if (pipePos > lastBoldPos) {
                        closePos = pipePos;
                    }
                }
                
                // Insert ** at the close position
                suggestedFix = trimmedLine.substring(0, closePos) + '**' + trimmedLine.substring(closePos);
                fixDescription = 'Add closing **';
            }
            // Unclosed italic
            else if (marker.message.includes('Unclosed italic')) {
                const trimmedLine = line.trimEnd();
                
                // Find the last single * (not part of **)
                let lastSingleStarPos = -1;
                for (let i = trimmedLine.length - 1; i >= 0; i--) {
                    if (trimmedLine[i] === '*') {
                        const isPartOfBold = (i > 0 && trimmedLine[i-1] === '*') || (i < trimmedLine.length - 1 && trimmedLine[i+1] === '*');
                        if (!isPartOfBold) {
                            lastSingleStarPos = i;
                            break;
                        }
                    }
                }
                
                if (lastSingleStarPos !== -1) {
                    // Find where to close
                    let closePos = trimmedLine.length;
                    
                    // Look for table cell boundary (| with optional space before it)
                    const tableCellMatch = trimmedLine.match(/\s+\|/);
                    if (tableCellMatch) {
                        const pipePos = trimmedLine.indexOf(tableCellMatch[0]);
                        if (pipePos > lastSingleStarPos) {
                            closePos = pipePos;
                        }
                    }
                    
                    // Insert * at the close position
                    suggestedFix = trimmedLine.substring(0, closePos) + '*' + trimmedLine.substring(closePos);
                    fixDescription = 'Add closing *';
                }
            }
            // Missing blank line after heading
            else if (marker.message.includes('Missing blank line after heading')) {
                suggestedFix = '__INSERT_BLANK_LINE__';
                fixDescription = 'Insert blank line above';
            }
            // List-table conflict
            else if (marker.message.includes('List-table conflict')) {
                suggestedFix = '__INSERT_BLANK_LINE__';
                fixDescription = 'Insert blank line above';
            }
            // Unclosed code block
            else if (marker.message.includes('Unclosed code block')) {
                // Add closing ``` on a new line after the current line
                suggestedFix = line + '\n```';
                fixDescription = 'Add closing ``` on new line';
            }
            // Broken image syntax - COMPLETELY REWRITTEN
            else if (marker.message.includes('Broken image syntax')) {
                console.log('[generateFix] Broken image - testing regex');
                // Handle two cases:
                // 1. ![text( - missing ] and )
                // 2. ![text]( - missing )
                
                // Try pattern with ] first - capture everything after ( to discard
                let brokenPattern = /!\[([^\]]*)\]\s*\(.*$/;
                let match = line.match(brokenPattern);
                
                if (!match) {
                    // Try pattern without ] (e.g., ![text( with trailing text)
                    brokenPattern = /!\[([^\(]*)\(.*$/;
                    match = line.match(brokenPattern);
                }
                
                console.log('[generateFix] Broken image match:', match);
                if (match) {
                    const altText = match[1].trim();
                    // Replace the ENTIRE matched pattern (including trailing text)
                    suggestedFix = line.replace(brokenPattern, `![${altText}](IMAGE_URL_FIX!)`);
                    fixDescription = 'Add missing brackets/parenthesis and placeholder URL';
                    console.log('[generateFix] Broken image fix:', suggestedFix);
                }
            }
            // Broken link syntax - IMPROVED: Only fix the actual broken link, not the whole line
            else if (marker.message.includes('Broken link syntax')) {
                console.log('[generateFix] Broken link - Line:', line);
                console.log('[generateFix] Marker startColumn:', marker.startColumn);
                
                // Find the last [ in the line (most likely the broken link)
                const lastBracketPos = line.lastIndexOf('[');
                
                if (lastBracketPos !== -1) {
                    const beforeBrokenLink = line.substring(0, lastBracketPos);
                    const brokenLinkPart = line.substring(lastBracketPos);
                    
                    console.log('[generateFix] Before broken link:', beforeBrokenLink);
                    console.log('[generateFix] Broken link part:', brokenLinkPart);
                    
                    // Try to extract link text from the broken part
                    // Pattern 1: [text]( with missing )
                    let match = brokenLinkPart.match(/^\[([^\]]+)\]\s*\(/);
                    if (match) {
                        const linkText = match[1].trim();
                        suggestedFix = beforeBrokenLink + `[${linkText}](URL_FIX!)`;
                        fixDescription = 'Add missing closing parenthesis and placeholder URL';
                        console.log('[generateFix] Pattern 1 - Fix:', suggestedFix);
                    }
                    // Pattern 2: [text( with missing ] and )
                    else {
                        match = brokenLinkPart.match(/^\[([^\[\(]+)\(/);
                        if (match) {
                            const linkText = match[1].trim();
                            suggestedFix = beforeBrokenLink + `[${linkText}](URL_FIX!)`;
                            fixDescription = 'Add missing bracket and parenthesis with placeholder URL';
                            console.log('[generateFix] Pattern 2 - Fix:', suggestedFix);
                        }
                        // Pattern 3: Just [text at end of line (no parenthesis at all)
                        else {
                            match = brokenLinkPart.match(/^\[([^\]]+)$/);
                            if (match) {
                                const linkText = match[1].trim();
                                suggestedFix = beforeBrokenLink + `[${linkText}](URL_FIX!)`;
                                fixDescription = 'Complete link with closing bracket, parenthesis and URL';
                                console.log('[generateFix] Pattern 3 - Fix:', suggestedFix);
                            }
                        }
                    }
                }
            }
            // Empty image URL
            else if (marker.message.includes('Empty image URL')) {
                suggestedFix = line.replace(/!\[([^\]]*)\]\(\s*\)/, '![$1](image.png)');
                fixDescription = 'Add placeholder image URL';
            }
            // Empty link
            else if (marker.message.includes('Empty link')) {
                // Handle both []() and [text]()
                if (line.includes('[]()')) {
                    suggestedFix = line.replace(/\[\]\(\s*\)/, '[Link text](url)');
                    fixDescription = 'Add link text and URL';
                } else {
                    // [text]() - just add URL
                    suggestedFix = line.replace(/\[([^\]]+)\]\(\s*\)/, '[$1](url)');
                    fixDescription = 'Add URL';
                }
            }
            
            return { suggestedFix, fixDescription };
        };
        
        // NEW: Apply multiple fixes to the same line
        const applyMultipleFixesToLine = (lineNumber, markers) => {
            const model = editor.getModel();
            let currentLine = model.getLineContent(lineNumber);
            let fixDescriptions = [];
            
            console.log('[applyMultiple] Line', lineNumber, '- Markers:', markers.length);
            console.log('[applyMultiple] BEFORE:', currentLine);
            
            // Sort markers by priority (structural fixes first, then formatting)
            const priorityOrder = [
                'Header missing space',
                'Invalid header',
                'Blockquote missing space',
                'Mixed list markers',
                'Broken image syntax',
                'Broken link syntax',
                'Empty image URL',
                'Empty link',
                'Empty alt text',
                'Unclosed bold',
                'Unclosed italic',
                'Unclosed inline code'
            ];
            
            const sortedMarkers = markers.sort((a, b) => {
                const aPriority = priorityOrder.findIndex(p => a.message.includes(p));
                const bPriority = priorityOrder.findIndex(p => b.message.includes(p));
                return (aPriority === -1 ? 999 : aPriority) - (bPriority === -1 ? 999 : bPriority);
            });
            
            console.log('[applyMultiple] Sorted markers:', sortedMarkers.map(m => m.message));
            
            // Separate blank line insertion markers from content fixes
            const blankLineMarkers = sortedMarkers.filter(m => 
                m.message.includes('Missing blank line after heading') || 
                m.message.includes('List-table conflict')
            );
            const contentMarkers = sortedMarkers.filter(m => 
                !m.message.includes('Missing blank line after heading') && 
                !m.message.includes('List-table conflict')
            );
            
            // Apply content fixes sequentially to the evolving line
            for (const marker of contentMarkers) {
                const { suggestedFix, fixDescription } = generateFix(marker, currentLine);
                if (suggestedFix && suggestedFix !== '__INSERT_BLANK_LINE__') {
                    console.log('[applyMultiple] Applying:', fixDescription);
                    console.log('[applyMultiple] From:', currentLine);
                    console.log('[applyMultiple] To:', suggestedFix);
                    currentLine = suggestedFix;
                    fixDescriptions.push(fixDescription);
                }
            }
            
            console.log('[applyMultiple] AFTER:', currentLine);
            
            // Apply the final combined fix
            if (currentLine !== model.getLineContent(lineNumber)) {
                const range = new monaco.Range(lineNumber, 1, lineNumber, model.getLineContent(lineNumber).length + 1);
                editor.executeEdits('validation-fix-multiple', [{
                    range: range,
                    text: currentLine
                }]);
            }
            
            // Handle blank line insertions separately
            if (blankLineMarkers.length > 0) {
                insertBlankLineAbove(lineNumber);
                fixDescriptions.push('Insert blank line above');
            }
            
            return { fixed: fixDescriptions.length > 0, description: fixDescriptions.join(', ') };
        };
        
        // Insert blank line above a line (idempotent)
        const insertBlankLineAbove = (lineNumber) => {
            console.log(`[insertBlankLineAbove] Called for line ${lineNumber}`);
            const model = editor.getModel();
            
            // Check if previous line is already blank
            if (lineNumber > 1) {
                const prevLine = model.getLineContent(lineNumber - 1);
                console.log(`[insertBlankLineAbove] Previous line (${lineNumber - 1}): "${prevLine}"`);
                if (prevLine.trim() === '') {
                    console.log(`[insertBlankLineAbove] Previous line is blank, skipping`);
                    return; // Already has blank line
                }
            }
            
            console.log(`[insertBlankLineAbove] Inserting blank line before line ${lineNumber}`);
            // Insert blank line at the start of current line
            const range = new monaco.Range(lineNumber, 1, lineNumber, 1);
            const lineContent = model.getLineContent(lineNumber);
            console.log(`[insertBlankLineAbove] Current line content: "${lineContent}"`);
            console.log(`[insertBlankLineAbove] Range: (${lineNumber}, 1, ${lineNumber}, 1)`);
            
            editor.executeEdits('insert-blank-line', [{
                range: range,
                text: '\n'
            }]);
            
            // Verify the edit was applied
            setTimeout(() => {
                const newPrevLine = model.getLineContent(lineNumber);
                const newCurrentLine = model.getLineContent(lineNumber + 1);
                console.log(`[insertBlankLineAbove] After edit - Line ${lineNumber}: "${newPrevLine}"`);
                console.log(`[insertBlankLineAbove] After edit - Line ${lineNumber + 1}: "${newCurrentLine}"`);
            }, 100);
        };
        
        const positionInlineBar = (lineNumber) => {
            if (!currentSuggestionBar) return;
            
            // Get the line position in the editor
            const lineTop = editor.getTopForLineNumber(lineNumber);
            const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
            const scrollTop = editor.getScrollTop();
            const editorDom = editor.getDomNode();
            const editorRect = editorDom.getBoundingClientRect();
            
            // Position directly below the error line, spanning full editor width
            const top = editorRect.top + (lineTop - scrollTop) + lineHeight;
            const left = editorRect.left;
            const width = editorRect.width;
            
            currentSuggestionBar.style.top = `${top}px`;
            currentSuggestionBar.style.left = `${left}px`;
            currentSuggestionBar.style.width = `${width}px`;
        };
        
        const updateLineDecoration = (lineNumber, state) => {
            // state: 'error' (red), 'fixed' (green), 'skipped' (blue)
            const colorMap = {
                'error': 'rgba(239, 68, 68, 0.2)',      // red
                'fixed': 'rgba(34, 197, 94, 0.2)',      // green
                'skipped': 'rgba(59, 130, 246, 0.2)'    // blue
            };
            
            const decoration = {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                    isWholeLine: true,
                    className: `validation-line-${state}`,
                    glyphMarginClassName: `validation-glyph-${state}`,
                    overviewRuler: {
                        color: colorMap[state],
                        position: monaco.editor.OverviewRulerLane.Left
                    },
                    minimap: {
                        color: colorMap[state],
                        position: monaco.editor.MinimapPosition.Inline
                    }
                }
            };
            
            lineDecorations = editor.deltaDecorations(lineDecorations, [decoration]);
        };
        
        const showSuggestionForIssue = (index) => {
            if (index < 0 || index >= validationIssues.length) return;
            
            currentFixIndex = index;
            const issue = validationIssues[index];
            const model = editor.getModel();
            const line = model.getLineContent(issue.marker.startLineNumber);
            
            // Navigate to issue
            editor.revealLineInCenter(issue.marker.startLineNumber);
            editor.setPosition({ 
                lineNumber: issue.marker.startLineNumber, 
                column: issue.marker.startColumn 
            });
            
            // Update line decoration to error state
            if (issue.state === 'pending') {
                updateLineDecoration(issue.marker.startLineNumber, 'error');
            }
            
            // Position the inline bar
            setTimeout(() => positionInlineBar(issue.marker.startLineNumber), 50);
            
            // Update bar content
            const counter = currentSuggestionBar.querySelector('.validation-bar-counter');
            const message = currentSuggestionBar.querySelector('.validation-bar-message');
            const preview = currentSuggestionBar.querySelector('.validation-bar-preview');
            const applyBtn = currentSuggestionBar.querySelector('.validation-btn-apply');
            const prevBtn = currentSuggestionBar.querySelector('.validation-btn-prev');
            const nextBtn = currentSuggestionBar.querySelector('.validation-btn-next');
            
            counter.textContent = `${index + 1} of ${validationIssues.length} problems`;
            message.textContent = issue.marker.message;
            
            // Update state and preview
            if (issue.state === 'fixed') {
                currentSuggestionBar.setAttribute('data-state', 'fixed');
                preview.textContent = '✓ Fixed';
                applyBtn.disabled = true;
            } else if (issue.state === 'skipped') {
                currentSuggestionBar.setAttribute('data-state', 'skipped');
                preview.textContent = '⊘ Skipped';
                applyBtn.disabled = true;
            } else {
                currentSuggestionBar.setAttribute('data-state', 'error');
                if (issue.suggestedFix) {
                    preview.textContent = issue.suggestedFix;
                    applyBtn.disabled = false;
                } else {
                    preview.textContent = 'No automatic fix available';
                    applyBtn.disabled = true;
                }
            }
            
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === validationIssues.length - 1;
        };
        
        const applyCurrentFix = () => {
            const issue = validationIssues[currentFixIndex];
            if (!issue || !issue.suggestedFix || issue.state !== 'pending') return;
            
            const model = editor.getModel();
            const lineNumber = issue.marker.startLineNumber;
            const line = model.getLineContent(lineNumber);
            
            // Check if this is a blank line insertion fix
            if (issue.suggestedFix === '__INSERT_BLANK_LINE__') {
                console.log('[applyCurrentFix] Blank line insertion detected for line', lineNumber);
                insertBlankLineAbove(lineNumber);
            } else {
                // Regular content fix
                const range = new monaco.Range(lineNumber, 1, lineNumber, line.length + 1);
                editor.executeEdits('validation-fix', [{
                    range: range,
                    text: issue.suggestedFix
                }]);
            }
            
            // Mark as fixed
            issue.state = 'fixed';
            updateLineDecoration(lineNumber, 'fixed');
            
            // Move to next pending issue without closing the bar
            const nextPendingIndex = validationIssues.findIndex((iss, idx) => idx > currentFixIndex && iss.state === 'pending');
            
            if (nextPendingIndex !== -1) {
                // Show next pending issue
                console.log('[applyCurrentFix] Moving to next pending issue at index:', nextPendingIndex);
                showSuggestionForIssue(nextPendingIndex);
            } else {
                // No more pending issues - check if we should close or stay
                const allProcessed = validationIssues.every(iss => iss.state !== 'pending');
                
                if (allProcessed) {
                    // All done - close and show summary
                    const fixedCount = validationIssues.filter(iss => iss.state === 'fixed').length;
                    const skippedCount = validationIssues.filter(iss => iss.state === 'skipped').length;
                    
                    closeSuggestionBar();
                    
                    let summaryMessage = `Validation complete! Fixed ${fixedCount} issue${fixedCount !== 1 ? 's' : ''}`;
                    if (skippedCount > 0) {
                        summaryMessage += `, skipped ${skippedCount}`;
                    }
                    summaryMessage += ' ✔';
                    
                    showMofuHelper(summaryMessage);
                } else {
                    // Stay on current issue (now marked as fixed)
                    showSuggestionForIssue(currentFixIndex);
                }
            }
        };
        
        const applyAllFixes = () => {
            const model = editor.getModel();
            let totalFixedCount = 0;
            let iterationCount = 0;
            const maxIterations = 10;
            
            const applyFixesIteration = () => {
                iterationCount++;
                console.log('[applyAll] ========== ITERATION', iterationCount, '==========');
                
                // Group pending issues by line number
                const issuesByLine = new Map();
                validationIssues.forEach((issue, index) => {
                    if (issue.state === 'pending' && issue.suggestedFix) {
                        const lineNum = issue.marker.startLineNumber;
                        if (!issuesByLine.has(lineNum)) {
                            issuesByLine.set(lineNum, []);
                        }
                        issuesByLine.get(lineNum).push({ issue, index });
                    }
                });
                
                console.log('[applyAll] Issues by line:', issuesByLine.size);
                console.log('[applyAll] Line numbers:', Array.from(issuesByLine.keys()));
                
                if (issuesByLine.size === 0) {
                    closeSuggestionBar();
                    if (totalFixedCount > 0) {
                        console.log('[applyAll] ✓ COMPLETE - Fixed', totalFixedCount, 'issues');
                        showMofuHelper(`Excellent! All ${totalFixedCount} fixes applied ✔`);
                    } else {
                        showMofuHelper('No issues found to fix!');
                    }
                    return;
                }
                
                // Sort line numbers in DESCENDING order (bottom to top)
                const sortedLines = Array.from(issuesByLine.keys()).sort((a, b) => b - a);
                console.log('[applyAll] Processing lines (bottom to top):', sortedLines);
                
                // Apply all fixes for each line (from bottom to top)
                sortedLines.forEach(lineNumber => {
                    const lineIssues = issuesByLine.get(lineNumber);
                    const markers = lineIssues.map(item => item.issue.marker);
                    
                    console.log('[applyAll] Processing line', lineNumber);
                    
                    // Apply multiple fixes to this line at once
                    const result = applyMultipleFixesToLine(lineNumber, markers);
                    
                    if (result.fixed) {
                        // Mark all issues on this line as fixed
                        lineIssues.forEach(({ issue }) => {
                            issue.state = 'fixed';
                        });
                        updateLineDecoration(lineNumber, 'fixed');
                        totalFixedCount += lineIssues.length;
                        console.log('[applyAll] ✓ Fixed line', lineNumber, '-', lineIssues.length, 'issues');
                    } else {
                        console.log('[applyAll] ✗ Failed to fix line', lineNumber);
                    }
                });
                
                console.log('[applyAll] Total fixed so far:', totalFixedCount);
                
                // Re-run validation to detect new issues
                if (iterationCount < maxIterations) {
                    setTimeout(() => {
                        console.log('[applyAll] Re-validating...');
                        validationIssues = [];
                        validateMarkdown();
                        
                        const newPendingIssues = validationIssues.filter(iss => iss.state === 'pending' && iss.suggestedFix);
                        console.log('[applyAll] New pending issues:', newPendingIssues.length);
                        
                        if (newPendingIssues.length > 0) {
                            console.log('[applyAll] Continuing to next iteration...');
                            applyFixesIteration();
                        } else {
                            closeSuggestionBar();
                            console.log('[applyAll] ✓ ALL DONE - Fixed', totalFixedCount, 'issues total');
                            showMofuHelper(`Excellent! All ${totalFixedCount} fixes applied ✔`);
                        }
                    }, 150);
                } else {
                    closeSuggestionBar();
                    console.log('[applyAll] ⚠ Max iterations reached');
                    showMofuHelper(`Applied ${totalFixedCount} fixes! Some issues may remain.`);
                }
            };
            
            applyFixesIteration();
        };
        
        const skipCurrentIssue = () => {
            const issue = validationIssues[currentFixIndex];
            if (!issue || issue.state !== 'pending') return;
            
            // Mark as skipped
            issue.state = 'skipped';
            updateLineDecoration(issue.marker.startLineNumber, 'skipped');
            
            // Move to next pending issue
            const nextPending = validationIssues.findIndex((iss, idx) => idx > currentFixIndex && iss.state === 'pending');
            if (nextPending !== -1) {
                showSuggestionForIssue(nextPending);
            } else {
                // No more pending
                const allDone = validationIssues.every(iss => iss.state !== 'pending');
                if (allDone) {
                    closeSuggestionBar();
                    showMofuHelper('Wizard complete! Review the highlighted changes.');
                } else {
                    showSuggestionForIssue(currentFixIndex);
                }
            }
        };
        
        const closeSuggestionBar = () => {
            if (currentSuggestionBar) {
                currentSuggestionBar.classList.add('hiding');
                setTimeout(() => {
                    if (currentSuggestionBar) {
                        currentSuggestionBar.remove();
                        currentSuggestionBar = null;
                    }
                }, 200);
            }
            
            // Clear decorations after a delay for review
            setTimeout(() => {
                lineDecorations = editor.deltaDecorations(lineDecorations, []);
            }, 5000);
            
            validationIssues = [];
            currentFixIndex = 0;
        };
        
        editor._interactiveFixWizard = async () => {
            const model = editor.getModel();
            const markers = monaco.editor.getModelMarkers({ resource: model.uri });
            const validationMarkers = markers.filter(m => m.source === 'markdown-validator');
            
            if (validationMarkers.length === 0) {
                showMofuHelper('No validation issues found!');
                return;
            }
            
            // Close existing bar if any
            closeSuggestionBar();
            
            // Prepare issues with fixes
            validationIssues = validationMarkers.map(marker => {
                const line = model.getLineContent(marker.startLineNumber);
                const { suggestedFix, fixDescription } = generateFix(marker, line);
                return { 
                    marker, 
                    suggestedFix, 
                    fixDescription,
                    state: 'pending' // pending, fixed, skipped
                };
            });
            
            // Create and show inline bar
            currentSuggestionBar = createInlineSuggestionBar();
            document.body.appendChild(currentSuggestionBar);
            
            // Setup event listeners
            currentSuggestionBar.querySelector('.validation-btn-apply').addEventListener('click', applyCurrentFix);
            currentSuggestionBar.querySelector('.validation-btn-apply-all').addEventListener('click', applyAllFixes);
            currentSuggestionBar.querySelector('.validation-btn-skip').addEventListener('click', skipCurrentIssue);
            currentSuggestionBar.querySelector('.validation-btn-discard-all').addEventListener('click', closeSuggestionBar);
            currentSuggestionBar.querySelector('.validation-btn-prev').addEventListener('click', () => {
                if (currentFixIndex > 0) {
                    showSuggestionForIssue(currentFixIndex - 1);
                }
            });
            currentSuggestionBar.querySelector('.validation-btn-next').addEventListener('click', () => {
                if (currentFixIndex < validationIssues.length - 1) {
                    showSuggestionForIssue(currentFixIndex + 1);
                }
            });
            
            // Reposition on scroll
            editor.onDidScrollChange(() => {
                if (currentSuggestionBar && validationIssues[currentFixIndex]) {
                    positionInlineBar(validationIssues[currentFixIndex].marker.startLineNumber);
                }
            });
            
            // Show first issue
            showSuggestionForIssue(0);
        };
        
        // Export validation errors to clipboard
        editor._exportValidationErrors = () => {
            const model = editor.getModel();
            const markers = monaco.editor.getModelMarkers({ resource: model.uri });
            const validationMarkers = markers.filter(m => m.source === 'markdown-validator');
            
            if (validationMarkers.length === 0) {
                return 'No validation errors found.';
            }
            
            let report = `# Markdown Validation Report\n\n`;
            report += `Total Issues: ${validationMarkers.length}\n\n`;
            
            // Group by severity
            const errors = validationMarkers.filter(m => m.severity === monaco.MarkerSeverity.Error);
            const warnings = validationMarkers.filter(m => m.severity === monaco.MarkerSeverity.Warning);
            const info = validationMarkers.filter(m => m.severity === monaco.MarkerSeverity.Info);
            
            if (errors.length > 0) {
                report += `## Errors (${errors.length})\n\n`;
                errors.forEach((marker, idx) => {
                    const lineContent = model.getLineContent(marker.startLineNumber);
                    report += `${idx + 1}. **Line ${marker.startLineNumber}**: ${marker.message}\n`;
                    report += `   \`\`\`\n   ${lineContent}\n   \`\`\`\n\n`;
                });
            }
            
            if (warnings.length > 0) {
                report += `## Warnings (${warnings.length})\n\n`;
                warnings.forEach((marker, idx) => {
                    const lineContent = model.getLineContent(marker.startLineNumber);
                    report += `${idx + 1}. **Line ${marker.startLineNumber}**: ${marker.message}\n`;
                    report += `   \`\`\`\n   ${lineContent}\n   \`\`\`\n\n`;
                });
            }
            
            if (info.length > 0) {
                report += `## Info (${info.length})\n\n`;
                info.forEach((marker, idx) => {
                    const lineContent = model.getLineContent(marker.startLineNumber);
                    report += `${idx + 1}. **Line ${marker.startLineNumber}**: ${marker.message}\n`;
                    report += `   \`\`\`\n   ${lineContent}\n   \`\`\`\n\n`;
                });
            }
            
            return report;
        };
        
        // Add keyboard shortcut: Ctrl+Shift+V to export validation errors
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV, () => {
            if (!validationEnabled) {
                console.log('Validation not enabled');
                return;
            }
            
            const report = editor._exportValidationErrors();
            navigator.clipboard.writeText(report).then(() => {
                console.log('Validation report copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy validation report:', err);
            });
        });

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
        // Hide the regular editor
        const editorWrapper = document.getElementById('editor-wrapper');
        const originalEditorDiv = document.getElementById('editor');
        
        // Create diff editor container
        const diffContainer = document.createElement('div');
        diffContainer.id = 'diff-editor-container';
        diffContainer.style.cssText = 'width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;';
        
        // Create header with stats
        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            padding: 12px 16px;
            background: var(--bg-color, white);
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-color, black);
        `;
        
        // Create action buttons overlay
        const actionsBar = document.createElement('div');
        actionsBar.style.cssText = `
            display: flex;
            gap: 8px;
        `;
        
        actionsBar.innerHTML = `
            <button id="diff-copy-btn" title="Copy Diff" style="
                height: 32px;
                padding: 0 12px;
                background: var(--bg-color, white);
                color: var(--text-color, black);
                border: 1px solid #ddd;
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
                background: var(--bg-color, white);
                color: var(--text-color, black);
                border: 1px solid #ddd;
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
        diffScrollContainer.style.cssText = 'flex: 1; overflow-y: auto; background: var(--bg-color, white);';
        diffContainer.appendChild(diffScrollContainer);
        
        // Hide original editor and show diff container
        originalEditorDiv.style.display = 'none';
        editorWrapper.appendChild(diffContainer);
        
        // Update preview with beautified content immediately
        convert(modified);
        
        // Get current theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
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
                diffHTML += '<div style="padding: 8px 16px; background: #f0f0f0; color: #666; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; margin: 8px 0;">...</div>';
            }
            
            block.forEach(i => {
                const origLine = originalLines[i];
                const modLine = modifiedLines[i];
                const lineNum = i + 1;
                
                if (origLine === modLine) {
                    // Unchanged context line
                    diffHTML += `<div style="padding: 2px 16px; background: transparent; color: var(--text-color, #666);">
                        <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: #999;">${lineNum}</span>
                        <span style="color: #999; margin-right: 8px;"> </span>
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
                                removedHTML += `<span style="background: #ffeef0; color: #d73a49; text-decoration: line-through;">${escapeHtml(part.text)}</span>`;
                                removedCount++;
                            } else if (part.type === 'common') {
                                removedHTML += escapeHtml(part.text);
                            }
                        });
                        
                        // Build added line with green highlight
                        let addedHTML = '';
                        wordDiff.forEach(part => {
                            if (part.type === 'added') {
                                addedHTML += `<span style="background: #e6ffed; color: #22863a; font-weight: 500;">${escapeHtml(part.text)}</span>`;
                                addedCount++;
                            } else if (part.type === 'common') {
                                addedHTML += escapeHtml(part.text);
                            }
                        });
                        
                        diffHTML += `<div style="padding: 2px 16px; background: #ffeef0;">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: #d73a49;">${lineNum}</span>
                            <span style="color: #d73a49; margin-right: 8px;">-</span>
                            ${removedHTML}
                        </div>`;
                        
                        diffHTML += `<div style="padding: 2px 16px; background: #e6ffed;">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: #22863a;">${lineNum}</span>
                            <span style="color: #22863a; margin-right: 8px;">+</span>
                            ${addedHTML}
                        </div>`;
                    } else if (origLine !== undefined) {
                        // Line deleted
                        removedCount++;
                        diffHTML += `<div style="padding: 2px 16px; background: #ffeef0;">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: #d73a49;">${lineNum}</span>
                            <span style="color: #d73a49; margin-right: 8px;">-</span>
                            <span style="color: #d73a49; text-decoration: line-through;">${escapeHtml(origLine)}</span>
                        </div>`;
                    } else if (modLine !== undefined) {
                        // Line added
                        addedCount++;
                        diffHTML += `<div style="padding: 2px 16px; background: #e6ffed;">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: #22863a;">${lineNum}</span>
                            <span style="color: #22863a; margin-right: 8px;">+</span>
                            <span style="color: #22863a; font-weight: 500;">${escapeHtml(modLine)}</span>
                        </div>`;
                    }
                }
            });
        });
        
        diffHTML += '</div>';
        
        // Update header with stats
        headerBar.innerHTML = `
            <div style="display: flex; gap: 16px; align-items: center;">
                <span style="font-weight: 600;">Beautify Changes</span>
                <span style="color: #22863a;">+${addedCount} additions</span>
                <span style="color: #d73a49;">-${removedCount} deletions</span>
                <span style="color: #666;">${changedCount} lines changed</span>
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
                btn.style.background = '#28a745';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.style.background = originalBg;
                    btn.style.color = 'var(--text-color, black)';
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

    let exportPreviewToPdf = async () => {
        const outputElement = document.querySelector('#output');
        if (!outputElement) {
            return;
        }

        // Wait for jsPDF to load if not available yet
        if (typeof window.jspdf === 'undefined') {
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
                
                // 1. Map known special characters to ASCII equivalents
                const charMap = {
                    '\u2248': '~',      // approximately equal
                    '\u2192': '->',     // right arrow
                    '\u2190': '<-',     // left arrow
                    '\u2194': '<->',    // left-right arrow
                    '\u00B2': '2',      // superscript 2
                    '\u00B3': '3',      // superscript 3
                    '\u00D7': 'x',      // multiplication sign
                    '\u00F7': '/',      // division
                    '\u00D8': 'O',      // diameter
                    '\u00F8': 'o',      // diameter lowercase
                    '\u00B0': ' deg',   // degree
                    '\u00B1': '+/-',    // plus-minus
                    '\u2013': '-',      // en dash
                    '\u2014': '--',     // em dash
                    '\u2011': '-',      // non-breaking hyphen
                    '\u2018': "'",      // left single quote
                    '\u2019': "'",      // right single quote
                    '\u201C': '"',      // left double quote
                    '\u201D': '"',      // right double quote
                    '\u2026': '...',    // ellipsis
                    '\u2022': '*',      // bullet
                    '\u20AC': 'EUR',    // euro
                    '\u00A3': 'GBP',    // pound
                    '\u00A5': 'JPY',    // yen
                    '\u0637': 'm.l',    // Arabic letter
                    '\u0645': 'm'       // Arabic letter
                };
                
                let result = text;
                for (const [unicode, ascii] of Object.entries(charMap)) {
                    result = result.split(unicode).join(ascii);
                }
                
                // 2. Normalize ALL Unicode spaces to a standard space (Fixes "2400 mm" spacing issues)
                result = result.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
                
                // 3. Normalize ALL Unicode dashes/hyphens to a standard minus sign
                result = result.replace(/[\u2010-\u2015\u2212]/g, '-');
                
                // 4. CRITICAL FIX: Strip all invisible Bidirectional (RTL/LTR) & formatting marks
                // These are injected by AI and completely break jsPDF text generation
                result = result.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g, '');
                
                // 5. Strip standard non-printable control characters
                result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
                
                // 6. Ultimate Fallback: Remove any remaining non-ASCII characters
                // (jsPDF's default Helvetica only supports standard Latin characters. This stops the "&" garbling entirely)
                result = result.replace(/[^\x20-\x7E]/g, '');
                
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
            const parseElement = async (element) => {
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
                            const h1Text = sanitizeForPdf(element.textContent);
                            const dateText = sanitizeForPdf(nextSibling.textContent);
                            
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
                            
                            console.log('[PDF] Processing image:', { alt, src });
                            
                            // Try to embed the actual image
                            if (src) {
                                try {
                                    console.log('[PDF] Attempting to load image from:', src);
                                    
                                    // Load image with CORS proxy fallback
                                    const imageData = await new Promise((resolve, reject) => {
                                        const image = new Image();
                                        image.crossOrigin = 'Anonymous';
                                        
                                        image.onload = () => {
                                            console.log('[PDF] Image loaded successfully');
                                            const canvas = document.createElement('canvas');
                                            canvas.width = image.width;
                                            canvas.height = image.height;
                                            const ctx = canvas.getContext('2d');
                                            
                                            try {
                                                ctx.drawImage(image, 0, 0);
                                                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                                                console.log('[PDF] Canvas conversion successful');
                                                resolve({
                                                    dataUrl,
                                                    width: image.width,
                                                    height: image.height
                                                });
                                            } catch (e) {
                                                console.error('[PDF] Canvas tainted (CORS issue):', e.message);
                                                reject(new Error('CORS: ' + e.message));
                                            }
                                        };
                                        
                                        image.onerror = (e) => {
                                            console.error('[PDF] Image load failed:', e);
                                            reject(new Error('Image load failed'));
                                        };
                                        
                                        setTimeout(() => {
                                            console.error('[PDF] Image load timeout');
                                            reject(new Error('Timeout'));
                                        }, 5000);
                                        
                                        // Try direct load first
                                        image.src = src;
                                    });
                                    
                                    // Calculate dimensions
                                    const maxImgWidth = maxWidth * 0.7;
                                    const aspectRatio = imageData.height / imageData.width;
                                    let imgWidth = Math.min(maxImgWidth, imageData.width / 3.78);
                                    let imgHeight = imgWidth * aspectRatio;
                                    
                                    const maxImgHeight = 100;
                                    if (imgHeight > maxImgHeight) {
                                        imgHeight = maxImgHeight;
                                        imgWidth = imgHeight / aspectRatio;
                                    }
                                    
                                    if (yPosition + imgHeight > pageHeight - margin) {
                                        doc.addPage();
                                        yPosition = margin;
                                    }
                                    
                                    const imgX = margin + (maxWidth - imgWidth) / 2;
                                    doc.addImage(imageData.dataUrl, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
                                    console.log('[PDF] Image embedded successfully!', { imgWidth, imgHeight });
                                    yPosition += imgHeight;
                                    addSpacing(2);
                                    
                                } catch (error) {
                                    console.error('[PDF] Failed to embed image:', error.message);
                                    
                                    // Show helpful error message based on error type
                                    if (error.message.includes('CORS')) {
                                        console.log('[PDF] CORS blocked - using placeholder with link');
                                        console.log('[PDF] TIP: Use data URLs or same-origin images for embedding');
                                    }
                                    
                                    // Fallback to placeholder with clickable link
                                    doc.setFont('helvetica', 'italic');
                                    doc.setFontSize(10);
                                    doc.setTextColor(100, 100, 100);
                                    
                                    const imageText = `[Image: ${sanitizeForPdf(alt)}]`;
                                    doc.text(imageText, margin, yPosition);
                                    yPosition += 5;
                                    
                                    // Add URL as clickable link
                                    doc.setFont('helvetica', 'normal');
                                    doc.setFontSize(9);
                                    doc.setTextColor(0, 102, 204);
                                    const urlText = sanitizeForPdf(src);
                                    const urlLines = doc.splitTextToSize(urlText, maxWidth);
                                    urlLines.forEach(line => {
                                        if (yPosition + 5 > pageHeight - margin) {
                                            doc.addPage();
                                            yPosition = margin;
                                        }
                                        doc.textWithLink(line, margin, yPosition, { url: src });
                                        yPosition += 5;
                                    });
                                    
                                    doc.setTextColor(0, 0, 0);
                                    addSpacing(2);
                                }
                            } else {
                                console.log('[PDF] No image src provided');
                                // No src, use placeholder
                                doc.setFont('helvetica', 'italic');
                                doc.setFontSize(10);
                                doc.setTextColor(100, 100, 100);
                                doc.text(`[Image: ${sanitizeForPdf(alt)}]`, margin, yPosition);
                                yPosition += 5;
                                doc.setTextColor(0, 0, 0);
                                addSpacing(2);
                            }
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
                            doc.text(sanitizeForPdf(line || ' '), margin + 5, yPosition);
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
                        // Check if it's a page break div
                        if (tagName === 'div' && element.style.pageBreakAfter === 'always') {
                            // Add a new page
                            doc.addPage();
                            yPosition = margin;
                            return;
                        }
                        
                        // Check if it's a page break before div
                        if (tagName === 'div' && element.style.pageBreakBefore === 'always') {
                            // Add a new page
                            doc.addPage();
                            yPosition = margin;
                            return;
                        }
                        
                        // Check if it's a fixed position footer div
                        if (tagName === 'div' && element.style.position === 'fixed' && element.style.bottom === '0') {
                            // Force footer to bottom of page - calculate actual bottom position
                            const footerContentHeight = 30; // Approximate height needed for footer content
                            yPosition = pageHeight - margin - footerContentHeight;
                            
                            // Process footer content
                            Array.from(element.children).forEach(child => parseElement(child));
                            return;
                        }
                        
                        // Check if it's a flexbox footer div
                        if (tagName === 'div' && element.style.display === 'flex' && element.style.justifyContent === 'space-between') {
                            // Check if this is inside a fixed footer wrapper
                            const isInFixedFooter = element.parentElement && 
                                                   element.parentElement.style.position === 'fixed' && 
                                                   element.parentElement.style.bottom === '0';
                            
                            if (isInFixedFooter) {
                                // Force to bottom of page
                                yPosition = pageHeight - margin - 30;
                            }
                            
                            // This is a flexbox footer - render side by side
                            const leftDiv = element.children[0];
                            const rightDiv = element.children[1];
                            
                            if (leftDiv && rightDiv) {
                                // Left side
                                doc.setFont('helvetica', 'bold');
                                doc.setFontSize(fontSizes.paragraph);
                                const leftStrong = leftDiv.querySelector('strong');
                                if (leftStrong) {
                                    doc.text(sanitizeForPdf(leftStrong.textContent), margin, yPosition);
                                    yPosition += fontSizes.paragraph * 0.5;
                                }
                                
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const leftSpan = leftDiv.querySelector('span');
                                if (leftSpan) {
                                    doc.text(sanitizeForPdf(leftSpan.textContent), margin, yPosition);
                                }
                                doc.setTextColor(0, 0, 0);
                                
                                // Right side
                                const rightY = yPosition - fontSizes.paragraph * 0.5;
                                doc.setFont('helvetica', 'bold');
                                const rightStrong = rightDiv.querySelector('strong');
                                if (rightStrong) {
                                    const sanitizedRightStrong = sanitizeForPdf(rightStrong.textContent);
                                    const rightStrongWidth = doc.getTextWidth(sanitizedRightStrong);
                                    doc.text(sanitizedRightStrong, pageWidth - margin - rightStrongWidth, rightY);
                                }
                                
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const rightSpan = rightDiv.querySelector('span');
                                if (rightSpan) {
                                    const sanitizedRightSpan = sanitizeForPdf(rightSpan.textContent);
                                    const rightSpanWidth = doc.getTextWidth(sanitizedRightSpan);
                                    doc.text(sanitizedRightSpan, pageWidth - margin - rightSpanWidth, yPosition);
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

            // Add Table of Contents if enabled - on dedicated page
            const tocData = getTocForPdf();
            if (tocData && tocData.length > 0) {
                // Center the TOC title vertically on the page
                const tocStartY = pageHeight / 3;
                yPosition = tocStartY;
                
                // Add "TABLE OF CONTENTS" title - centered and bold
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                const tocTitle = 'TABLE OF CONTENTS';
                const titleWidth = doc.getTextWidth(tocTitle);
                const titleX = (pageWidth - titleWidth) / 2;
                doc.text(tocTitle, titleX, yPosition);
                yPosition += 15;
                
                // Add decorative line under title
                const lineMargin = pageWidth * 0.3;
                doc.setDrawColor(100, 100, 100);
                doc.setLineWidth(0.5);
                doc.line(lineMargin, yPosition, pageWidth - lineMargin, yPosition);
                yPosition += 10;
                
                // Add TOC items with proper formatting
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                
                // Count H1 items for numbering
                let h1Counter = 0;
                
                tocData.forEach((item) => {
                    const indent = (item.level - 1) * 8;
                    const itemText = sanitizeForPdf(item.text);
                    const leftMargin = pageWidth * 0.2;
                    
                    // Check if we need a new page
                    if (yPosition + 7 > pageHeight - margin * 2) {
                        doc.addPage();
                        yPosition = margin * 2;
                    }
                    
                    // Add bullet or number based on level
                    let prefix = '';
                    if (item.level === 1) {
                        h1Counter++;
                        prefix = h1Counter + '. ';
                        doc.setFont('helvetica', 'bold');
                    } else if (item.level === 2) {
                        prefix = '  • ';
                        doc.setFont('helvetica', 'normal');
                    } else {
                        prefix = '    - ';
                        doc.setFont('helvetica', 'normal');
                    }
                    
                    // Add TOC item with indentation
                    const fullText = prefix + itemText;
                    doc.text(fullText, leftMargin + indent, yPosition);
                    yPosition += 7;
                });
                
                // Add new page for content
                doc.addPage();
                yPosition = margin;
            }

            // Process all children of the output element, but skip footer
            let footerElement = null;
            for (const child of outputElement.children) {
                // Check if this is the PDF footer
                if (child.getAttribute('data-pdf-footer') === 'true') {
                    footerElement = child;
                    continue; // Skip processing it now
                }
                await parseElement(child);
            }

            // Render footer at the bottom of the last page if it exists
            if (footerElement) {
                const footerBottomMargin = 12.75; // Distance from page bottom (15% closer)
                const footerHeight = 25; // Approximate height needed for footer
                const footerY = pageHeight - footerBottomMargin - footerHeight;
                
                // If current content is too close to footer area, add new page
                if (yPosition > footerY - 10) {
                    doc.addPage();
                }
                
                // Position at bottom of page
                yPosition = footerY;
                
                // Process footer elements
                for (const child of footerElement.children) {
                    await parseElement(child);
                }
            }

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
        const autofixLink = document.querySelector('#autofix-validation-link');
        if (!checkbox) return;
        
        // Load saved setting
        const savedSetting = loadValidationSettings();
        
        if (savedSetting !== null && savedSetting !== undefined) {
            checkbox.checked = savedSetting;
            if (editor && editor._setValidationEnabled) {
                editor._setValidationEnabled(savedSetting);
            }
            // Show/hide links based on validation state
            if (exportLink) {
                exportLink.style.display = savedSetting ? 'block' : 'none';
            }
            if (autofixLink) {
                autofixLink.style.display = savedSetting ? 'block' : 'none';
            }
        }
        
        checkbox.addEventListener('change', (event) => {
            const enabled = event.currentTarget.checked;
            saveValidationSettings(enabled);
            if (editor && editor._setValidationEnabled) {
                editor._setValidationEnabled(enabled);
            }
            // Show/hide links
            if (exportLink) {
                exportLink.style.display = enabled ? 'block' : 'none';
            }
            if (autofixLink) {
                autofixLink.style.display = enabled ? 'block' : 'none';
            }
        });
        
        // Setup export validation report button
        if (exportLink) {
            exportLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (!editor || !editor._exportValidationErrors) return;
                
                const report = editor._exportValidationErrors();
                navigator.clipboard.writeText(report).then(() => {
                    console.log('Validation report copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy validation report:', err);
                });
            });
        }
        
        // Setup auto-fix button (now interactive wizard)
        if (autofixLink) {
            autofixLink.textContent = 'Fix Issues (Interactive)';
            autofixLink.addEventListener('click', async (e) => {
                e.preventDefault();
                if (!editor || !editor._interactiveFixWizard) return;
                
                await editor._interactiveFixWizard();
            });
        }
    };
    
    let loadValidationSettings = () => {
        let last = Storehouse.getItem(localStorageNamespace, localStorageValidationKey);
        return last || false;
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
    let editor = setupEditor();
    
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
    
    // Force update validation link visibility after editor is ready
    setTimeout(() => {
        const checkbox = document.querySelector('#validation-checkbox');
        const autofixLink = document.querySelector('#autofix-validation-link');
        const exportLink = document.querySelector('#export-validation-link');
        if (checkbox && checkbox.checked) {
            if (autofixLink) autofixLink.style.display = 'block';
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
    };
    
    initMofuBlob();
};

window.addEventListener("load", () => {
    init();
});
