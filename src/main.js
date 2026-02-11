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
    const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';
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

    let setupEditor = () => {
        let editor = monaco.editor.create(document.querySelector('#editor'), {
            fontSize: 14,
            language: 'markdown',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
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

        editor.onDidScrollChange((e) => {
            if (!scrollBarSync) {
                return;
            }

            const scrollTop = e.scrollTop;
            const scrollHeight = e.scrollHeight;
            const height = editor.getLayoutInfo().height;

            const maxScrollTop = scrollHeight - height;
            const scrollRatio = scrollTop / maxScrollTop;

            let previewElement = document.querySelector('#preview');
            let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
            previewElement.scrollTo(0, targetY);
        });

        return editor;
    };

    // Render markdown text as html
    let convert = (markdown) => {
        let options = {
            headerIds: false,
            mangle: false
        };
        let html = marked.parse(markdown, options);
        let sanitized = DOMPurify.sanitize(html);
        
        // Split markdown into lines and wrap rendered HTML with line numbers
        const lines = markdown.split('\n');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitized;
        
        // Get all rendered elements
        const renderedElements = Array.from(tempDiv.children);
        let currentLineIndex = 0;
        
        // Map each rendered element to its source line
        renderedElements.forEach(element => {
            const elementText = element.textContent.trim();
            
            // Find the line in markdown that matches this element
            for (let i = currentLineIndex; i < lines.length; i++) {
                const lineText = lines[i].trim();
                
                // Check if this line starts the element
                if (lineText && elementText.startsWith(lineText.substring(0, Math.min(20, lineText.length)))) {
                    element.setAttribute('data-source-line', i + 1);
                    currentLineIndex = i + 1;
                    break;
                } else if (elementText.includes(lineText) && lineText.length > 3) {
                    element.setAttribute('data-source-line', i + 1);
                    currentLineIndex = i + 1;
                    break;
                }
            }
            
            // If no match found, use current line
            if (!element.hasAttribute('data-source-line')) {
                element.setAttribute('data-source-line', currentLineIndex + 1);
            }
        });
        
        document.querySelector('#output').innerHTML = tempDiv.innerHTML;
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
        
        elements.forEach(element => {
            const sourceLine = parseInt(element.getAttribute('data-source-line'));
            const distance = Math.abs(sourceLine - lineNumber);
            
            // Prefer exact match, otherwise closest
            if (sourceLine === lineNumber) {
                targetElement = element;
                closestDistance = 0;
            } else if (distance < closestDistance && !targetElement) {
                closestDistance = distance;
                targetElement = element;
            }
        });
        
        if (targetElement) {
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
    const PREVIEW_CSS_LIGHT = 'css/github-markdown-light.css?v=1.11.0';
    const PREVIEW_CSS_DARK = 'css/github-markdown-dark_dimmed.css?v=1.11.0';

    let setPreviewCss = (useDark) => {
        const link = document.getElementById('gh-markdown-link');
        if (!link) {
            // fallback: create link element
            const newLink = document.createElement('link');
            newLink.id = 'gh-markdown-link';
            newLink.rel = 'stylesheet';
            newLink.href = useDark ? PREVIEW_CSS_DARK : PREVIEW_CSS_LIGHT;
            document.head.appendChild(newLink);
            return;
        }

        // Only update if href differs to avoid unnecessary reload
        const desired = useDark ? PREVIEW_CSS_DARK : PREVIEW_CSS_LIGHT;
        if (link.getAttribute('href') !== desired) {
            link.setAttribute('href', desired);
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
            monaco.editor.setTheme(settings ? 'vs-dark' : 'vs');
        }
        // set preview css to match theme
        setPreviewCss(settings);

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            setTheme(checked);
            saveThemeSettings(checked);
            setPreviewCss(checked);
            if (monaco && monaco.editor && typeof monaco.editor.setTheme === 'function') {
                monaco.editor.setTheme(checked ? 'vs-dark' : 'vs');
            }
        });
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

    let exportPreviewToPdf = () => {
        const outputElement = document.querySelector('#output');
        if (!outputElement) {
            console.log('No output element found');
            return;
        }

        console.log('Checking for jsPDF...', typeof window.jspdf, window.jspdf);
        
        if (typeof window.jspdf === 'undefined') {
            window.alert('PDF export is not available yet. Please try again in a moment.');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            console.log('jsPDF constructor:', jsPDF);
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const maxWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Helper function to add text with word wrapping and inline formatting
            const addText = (text, fontSize, isBold = false, isItalic = false) => {
                if (!text || text.trim() === '') return;
                
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

                const lines = doc.splitTextToSize(text, maxWidth);
                const lineHeight = fontSize * 0.5;

                lines.forEach(line => {
                    if (yPosition + lineHeight > pageHeight - margin) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    doc.text(line, margin, yPosition);
                    yPosition += lineHeight;
                });
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
                            // For links, show the text with the URL in parentheses
                            const linkText = node.textContent;
                            const href = node.getAttribute('href');
                            if (href && href !== linkText) {
                                result.push({ text: `${linkText} (${href})`, bold: isBold, italic: isItalic });
                            } else {
                                result.push({ text: linkText, bold: isBold, italic: isItalic });
                            }
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

            // Helper to render formatted text segments
            const addFormattedText = (segments, fontSize) => {
                if (!segments || segments.length === 0) return;
                
                doc.setFontSize(fontSize);
                const lineHeight = fontSize * 0.5;
                let currentLine = '';
                let currentX = margin;
                
                segments.forEach((seg, idx) => {
                    const text = seg.text;
                    
                    // Set font style
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
                            // Word wrap
                            const words = part.split(' ');
                            words.forEach((word, wordIdx) => {
                                const testText = wordIdx === 0 ? word : ' ' + word;
                                const textWidth = doc.getTextWidth(testText);
                                
                                if (currentX + textWidth > pageWidth - margin && currentX > margin) {
                                    // Need to wrap
                                    yPosition += lineHeight;
                                    currentX = margin;
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
                        }
                    });
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
                const tagName = element.tagName.toLowerCase();

                switch (tagName) {
                    case 'h1':
                        addSpacing(5);
                        addText(element.textContent, 20, true);
                        addSpacing(3);
                        break;
                    case 'h2':
                        addSpacing(4);
                        addText(element.textContent, 16, true);
                        addSpacing(2);
                        break;
                    case 'h3':
                        addSpacing(3);
                        addText(element.textContent, 14, true);
                        addSpacing(2);
                        break;
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        addSpacing(2);
                        addText(element.textContent, 12, true);
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
                                addFormattedText(formatted, 11);
                                addSpacing(2);
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
                                doc.setFontSize(11);
                                doc.text(bullet, margin, yPosition);
                                const bulletWidth = doc.getTextWidth(bullet);
                                
                                // Render formatted content with indent
                                doc.setFontSize(11);
                                const lineHeight = 11 * 0.5;
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
                                        doc.setFontSize(11);
                                        doc.text(nestedBullet, oldMarginValue + indentAmount, yPosition);
                                        const nestedBulletWidth = doc.getTextWidth(nestedBullet);
                                        
                                        const lineHeight = 11 * 0.5;
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
                        addText(element.textContent, 10, false, true);
                        doc.setTextColor(0, 0, 0);
                        addSpacing(2);
                        break;
                    case 'pre':
                    case 'code':
                        doc.setFont('courier', 'normal');
                        doc.setFontSize(9);
                        const codeLines = element.textContent.split('\n');
                        codeLines.forEach(line => {
                            if (yPosition + 4 > pageHeight - margin) {
                                doc.addPage();
                                yPosition = margin;
                            }
                            doc.text(line || ' ', margin + 5, yPosition);
                            yPosition += 4;
                        });
                        doc.setFont('helvetica', 'normal');
                        addSpacing(2);
                        break;
                    case 'table':
                        // Proper table rendering with borders
                        const thead = element.querySelector('thead');
                        const tbody = element.querySelector('tbody');
                        
                        if (!thead && !tbody) break;
                        
                        // Calculate column widths
                        const allRows = element.querySelectorAll('tr');
                        let maxCols = 0;
                        allRows.forEach(row => {
                            const cells = row.querySelectorAll('td, th');
                            maxCols = Math.max(maxCols, cells.length);
                        });
                        
                        const colWidth = maxWidth / maxCols;
                        const rowHeight = 7;
                        
                        // Draw table
                        let tableY = yPosition;
                        
                        allRows.forEach((row, rowIndex) => {
                            const cells = row.querySelectorAll('td, th');
                            const isHeader = row.parentElement.tagName.toLowerCase() === 'thead';
                            
                            // Check if we need a new page
                            if (tableY + rowHeight > pageHeight - margin) {
                                doc.addPage();
                                tableY = margin;
                            }
                            
                            // Draw cells
                            cells.forEach((cell, colIndex) => {
                                const x = margin + (colIndex * colWidth);
                                const y = tableY;
                                
                                // Draw cell border
                                doc.rect(x, y, colWidth, rowHeight);
                                
                                // Draw cell text
                                doc.setFontSize(9);
                                if (isHeader) {
                                    doc.setFont('helvetica', 'bold');
                                } else {
                                    doc.setFont('helvetica', 'normal');
                                }
                                
                                // Get formatted text from cell
                                const cellFormatted = getFormattedText(cell);
                                let cellText = '';
                                cellFormatted.forEach(seg => {
                                    cellText += seg.text;
                                });
                                
                                // Wrap text if needed
                                const lines = doc.splitTextToSize(cellText, colWidth - 2);
                                const textY = y + 5;
                                lines.forEach((line, lineIdx) => {
                                    doc.text(line, x + 1, textY + (lineIdx * 4));
                                });
                            });
                            
                            tableY += rowHeight;
                        });
                        
                        yPosition = tableY;
                        addSpacing(3);
                        break;
                    case 'hr':
                        if (yPosition + 5 > pageHeight - margin) {
                            doc.addPage();
                            yPosition = margin;
                        }
                        doc.line(margin, yPosition, pageWidth - margin, yPosition);
                        addSpacing(3);
                        break;
                    default:
                        // For other elements, just extract text
                        if (element.textContent && element.textContent.trim()) {
                            const children = element.children;
                            if (children.length === 0) {
                                addText(element.textContent, 11);
                            } else {
                                Array.from(children).forEach(child => parseElement(child));
                            }
                        }
                }
            };

            // Process all children of the output element
            Array.from(outputElement.children).forEach(child => {
                parseElement(child);
            });

            // Save the PDF
            doc.save('markdown-preview.pdf');
        } catch (error) {
            console.error('Failed to export PDF:', error);
            window.alert('Failed to export PDF. Please try again.');
        }
    };

    // ----- setup -----

    // setup navigation actions
    let setupResetButton = () => {
        document.querySelector("#reset-button").addEventListener('click', (event) => {
            event.preventDefault();
            reset();
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
        const exportButton = document.querySelector('#export-button');
        if (!exportButton) {
            return;
        }
        exportButton.addEventListener('click', (event) => {
            event.preventDefault();
            exportPreviewToPdf();
        });
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

    let setupDivider = () => {
        let lastLeftRatio = 0.5;
        const divider = document.getElementById('split-divider');
        const leftPane = document.getElementById('edit');
        const rightPane = document.getElementById('preview');
        const container = document.getElementById('container');

        let isDragging = false;

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
            document.body.style.cursor = 'col-resize';
        });

        divider.addEventListener('dblclick', () => {
            const containerRect = container.getBoundingClientRect();
            const totalWidth = containerRect.width;
            const dividerWidth = divider.offsetWidth;
            const halfWidth = (totalWidth - dividerWidth) / 2;

            leftPane.style.width = halfWidth + 'px';
            rightPane.style.width = halfWidth + 'px';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            document.body.style.userSelect = 'none';
            const containerRect = container.getBoundingClientRect();
            const totalWidth = containerRect.width;
            const offsetX = e.clientX - containerRect.left;
            const dividerWidth = divider.offsetWidth;

            // Prevent overlap or out-of-bounds
            const minWidth = 100;
            const maxWidth = totalWidth - minWidth - dividerWidth;
            const leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
            leftPane.style.width = leftWidth + 'px';
            rightPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
            lastLeftRatio = leftWidth / (totalWidth - dividerWidth);
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

        window.addEventListener('resize', () => {
            const containerRect = container.getBoundingClientRect();
            const totalWidth = containerRect.width;
            const dividerWidth = divider.offsetWidth;
            const availableWidth = totalWidth - dividerWidth;

            const newLeft = availableWidth * lastLeftRatio;
            const newRight = availableWidth * (1 - lastLeftRatio);

            leftPane.style.width = newLeft + 'px';
            rightPane.style.width = newRight + 'px';
        });
    };

    // ----- entry point -----
    let lastContent = loadLastContent();
    let editor = setupEditor();
    if (lastContent) {
        presetValue(lastContent);
    } else {
        presetValue(defaultInput);
    }
    setupResetButton();
    setupCopyButton(editor);
    setupExportButton();

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
        
        // Bidirectional scroll sync with debouncing
        let isEditorScrolling = false;
        let isPreviewScrolling = false;
        let editorScrollTimeout = null;
        let previewScrollTimeout = null;
        
        // Editor scroll → Preview scroll
        editor.onDidScrollChange((e) => {
            if (isPreviewScrolling || !scrollBarSync) return;
            
            isEditorScrolling = true;
            clearTimeout(editorScrollTimeout);
            
            const scrollTop = e.scrollTop;
            const scrollHeight = e.scrollHeight;
            const height = editor.getLayoutInfo().height;
            const maxScrollTop = scrollHeight - height;
            const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
            
            const targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
            previewElement.scrollTo({ top: targetY, behavior: 'auto' });
            
            editorScrollTimeout = setTimeout(() => {
                isEditorScrolling = false;
            }, 150);
        });
        
        // Preview scroll → Editor scroll
        previewElement.addEventListener('scroll', () => {
            if (isEditorScrolling || !scrollBarSync) return;
            
            isPreviewScrolling = true;
            clearTimeout(previewScrollTimeout);
            
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
            
            previewScrollTimeout = setTimeout(() => {
                isPreviewScrolling = false;
            }, 150);
        });
    }
};

window.addEventListener("load", () => {
    init();
});
