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
                preview.textContent = 'âœ“ Fixed';
                applyBtn.disabled = true;
            } else if (issue.state === 'skipped') {
                currentSuggestionBar.setAttribute('data-state', 'skipped');
                preview.textContent = 'âŠ˜ Skipped';
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
                    summaryMessage += ' âœ”';
                    
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
                        console.log('[applyAll] âœ“ COMPLETE - Fixed', totalFixedCount, 'issues');
                        showMofuHelper(`Excellent! All ${totalFixedCount} fixes applied âœ”`);
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
                        console.log('[applyAll] âœ“ Fixed line', lineNumber, '-', lineIssues.length, 'issues');
                    } else {
                        console.log('[applyAll] âœ— Failed to fix line', lineNumber);
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
                            console.log('[applyAll] âœ“ ALL DONE - Fixed', totalFixedCount, 'issues total');
                            showMofuHelper(`Excellent! All ${totalFixedCount} fixes applied âœ”`);
                        }
                    }, 150);
                } else {
                    closeSuggestionBar();
                    console.log('[applyAll] âš  Max iterations reached');
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
