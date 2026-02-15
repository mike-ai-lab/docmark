// DocMark Documentation JavaScript

(function() {
    'use strict';
    
    // TOC Collapsible Sections
    const tocParents = document.querySelectorAll('.toc-parent');
    
    tocParents.forEach(parent => {
        parent.addEventListener('click', function() {
            const section = this.closest('.toc-section');
            const isExpanded = section.classList.contains('expanded');
            
            // Toggle expanded state
            if (isExpanded) {
                section.classList.remove('expanded');
                this.classList.remove('expanded');
            } else {
                section.classList.add('expanded');
                this.classList.add('expanded');
            }
        });
    });
    
    // Auto-expand current section
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = document.querySelector(`.toc-item[href="${currentPath}"]`);
    
    if (currentLink) {
        currentLink.classList.add('active');
        const parentSection = currentLink.closest('.toc-section');
        if (parentSection) {
            parentSection.classList.add('expanded');
            const parentButton = parentSection.querySelector('.toc-parent');
            if (parentButton) {
                parentButton.classList.add('expanded');
            }
        }
    }
    
    // Page Index - Auto-generate from headings
    const generatePageIndex = () => {
        const article = document.querySelector('.docs-article');
        const pageIndex = document.querySelector('.page-index');
        
        if (!article || !pageIndex) return;
        
        const headings = article.querySelectorAll('h1, h2, h3');
        pageIndex.innerHTML = '';
        
        headings.forEach((heading, index) => {
            // Create ID if doesn't exist
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'index-item';
            link.textContent = heading.textContent;
            
            // Add indentation for h3
            if (heading.tagName === 'H3') {
                link.style.paddingLeft = '24px';
            }
            
            pageIndex.appendChild(link);
        });
    };
    
    generatePageIndex();
    
    // Smooth scroll to sections
    const indexLinks = document.querySelectorAll('.index-item');
    
    indexLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Smooth scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                indexLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active index item on scroll
    let ticking = false;
    
    const updateActiveIndex = () => {
        const article = document.querySelector('.docs-article');
        if (!article) return;
        
        const headings = article.querySelectorAll('h1, h2, h3');
        const scrollPosition = window.scrollY + 100;
        
        let currentHeading = null;
        
        headings.forEach(heading => {
            if (heading.offsetTop <= scrollPosition) {
                currentHeading = heading;
            }
        });
        
        if (currentHeading) {
            indexLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentHeading.id}`) {
                    link.classList.add('active');
                }
            });
        }
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveIndex();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Set initial active index
    updateActiveIndex();
    
    // Mobile menu toggle
    const createMobileToggle = () => {
        if (window.innerWidth > 768) return;
        
        let toggle = document.getElementById('mobile-menu-toggle');
        if (toggle) return;
        
        toggle = document.createElement('button');
        toggle.id = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 1001;
            width: 44px;
            height: 44px;
            border: 1px solid #e0e0e0;
            background: #ffffff;
            color: #1a1a1a;
            border-radius: 4px;
            font-size: 20px;
            cursor: pointer;
            display: none;
        `;
        
        document.body.appendChild(toggle);
        
        const sidebar = document.querySelector('.docs-sidebar');
        
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && e.target !== toggle) {
                sidebar.classList.remove('open');
            }
        });
        
        // Show/hide toggle based on screen size
        const updateToggleVisibility = () => {
            if (window.innerWidth <= 768) {
                toggle.style.display = 'block';
            } else {
                toggle.style.display = 'none';
                sidebar.classList.remove('open');
            }
        };
        
        updateToggleVisibility();
        window.addEventListener('resize', updateToggleVisibility);
    };
    
    createMobileToggle();
    
    // ============================================================================
    // ASK MORE FUNCTIONALITY
    // ============================================================================
    
    // Toggle dropdown
    const askMoreBtn = document.getElementById('ask-more-btn');
    const askMoreContainer = document.querySelector('.ask-more-container');
    
    if (askMoreBtn && askMoreContainer) {
        askMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            askMoreContainer.classList.toggle('open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!askMoreContainer.contains(e.target)) {
                askMoreContainer.classList.remove('open');
            }
        });
    }
    
    // Copy as Markdown
    const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
    
    if (copyMarkdownBtn) {
        copyMarkdownBtn.addEventListener('click', async () => {
            const article = document.querySelector('.docs-article');
            if (!article) return;
            
            // Convert article content to markdown
            const markdown = convertToMarkdown(article);
            
            try {
                await navigator.clipboard.writeText(markdown);
                
                // Show feedback
                copyMarkdownBtn.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyMarkdownBtn.textContent = 'Copy as Markdown';
                }, 2000);
                
                // Close dropdown
                askMoreContainer.classList.remove('open');
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy to clipboard');
            }
        });
    }
    
    // Ask ChatGPT
    const askChatGPTBtn = document.getElementById('ask-chatgpt-btn');
    
    if (askChatGPTBtn) {
        askChatGPTBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get page title and URL
            const pageTitle = document.querySelector('.docs-article h1')?.textContent || 'DocMark Feature';
            const pageURL = window.location.href;
            
            // Get the actual content from the page
            const article = document.querySelector('.docs-article');
            let contentSummary = '';
            
            if (article) {
                // Get first few paragraphs for context
                const paragraphs = article.querySelectorAll('p');
                const firstParagraphs = Array.from(paragraphs).slice(0, 3);
                contentSummary = firstParagraphs.map(p => p.textContent.trim()).join('\n\n');
                
                // Limit to 500 characters
                if (contentSummary.length > 500) {
                    contentSummary = contentSummary.substring(0, 500) + '...';
                }
            }
            
            // Create a more detailed prompt that ChatGPT will understand better
            const prompt = `I'm reading the DocMark documentation about "${pageTitle}".

Here's a summary of what I'm reading:
${contentSummary}

Documentation URL: ${pageURL}

Can you:
1. Explain this feature in simple terms
2. Provide practical use cases
3. Share any tips or best practices
4. Answer any questions I might have about it`;
            
            // Encode prompt for URL
            const encodedPrompt = encodeURIComponent(prompt);
            
            // Try to use ChatGPT's URL with the prompt
            // Note: ChatGPT will pre-fill but user must press Enter due to security
            const chatGPTURL = `https://chat.openai.com/?q=${encodedPrompt}`;
            
            // Open in new tab
            const newWindow = window.open(chatGPTURL, '_blank');
            
            // Show helper message
            if (newWindow) {
                // Create a temporary notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #2c2c2c;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-size: 14px;
                    max-width: 300px;
                `;
                notification.innerHTML = `
                    <strong>ChatGPT Opened</strong><br>
                    <span style="font-size: 13px; opacity: 0.9;">The prompt is ready. Press Enter to send it to ChatGPT.</span>
                `;
                document.body.appendChild(notification);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    notification.style.transition = 'opacity 0.3s';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }, 5000);
            }
            
            // Close dropdown
            askMoreContainer.classList.remove('open');
        });
    }
    
    // Convert HTML to Markdown (simple converter)
    function convertToMarkdown(element) {
        let markdown = '';
        
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent.trim();
            }
            
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }
            
            const tag = node.tagName.toLowerCase();
            
            // Skip navigation, buttons, and UI elements
            if (tag === 'nav' || tag === 'aside' || tag === 'button' || 
                node.classList.contains('ask-more-container') ||
                node.classList.contains('docs-sidebar') ||
                node.classList.contains('docs-index') ||
                node.classList.contains('quick-links') ||
                node.classList.contains('note-box')) {
                return '';
            }
            
            let content = '';
            
            // Process children
            for (let child of node.childNodes) {
                const childContent = processNode(child);
                if (childContent) {
                    content += childContent;
                }
            }
            
            // Clean up content
            content = content.trim();
            if (!content) return '';
            
            switch (tag) {
                case 'h1':
                    return `# ${content}\n\n`;
                case 'h2':
                    return `## ${content}\n\n`;
                case 'h3':
                    return `### ${content}\n\n`;
                case 'h4':
                    return `#### ${content}\n\n`;
                case 'h5':
                    return `##### ${content}\n\n`;
                case 'h6':
                    return `###### ${content}\n\n`;
                case 'p':
                    return `${content}\n\n`;
                case 'strong':
                case 'b':
                    return `**${content}**`;
                case 'em':
                case 'i':
                    return `*${content}*`;
                case 'code':
                    if (node.parentElement?.tagName === 'PRE') {
                        return content;
                    }
                    return `\`${content}\``;
                case 'pre':
                    return `\`\`\`\n${content}\n\`\`\`\n\n`;
                case 'ul':
                    let ulResult = '';
                    Array.from(node.children).forEach(li => {
                        if (li.tagName === 'LI') {
                            const liContent = processNode(li);
                            if (liContent) {
                                ulResult += `- ${liContent}\n`;
                            }
                        }
                    });
                    return ulResult + '\n';
                case 'ol':
                    let olResult = '';
                    Array.from(node.children).forEach((li, index) => {
                        if (li.tagName === 'LI') {
                            const liContent = processNode(li);
                            if (liContent) {
                                olResult += `${index + 1}. ${liContent}\n`;
                            }
                        }
                    });
                    return olResult + '\n';
                case 'li':
                    // Content already processed by ul/ol
                    return content;
                case 'a':
                    const href = node.getAttribute('href') || '';
                    if (href && !href.startsWith('#')) {
                        return `[${content}](${href})`;
                    }
                    return content;
                case 'blockquote':
                    const lines = content.split('\n');
                    return lines.map(line => `> ${line}`).join('\n') + '\n\n';
                case 'hr':
                    return '---\n\n';
                case 'br':
                    return '\n';
                case 'section':
                case 'article':
                case 'div':
                    return content + '\n';
                default:
                    return content;
            }
        };
        
        markdown = processNode(element);
        
        // Clean up extra newlines (max 2 consecutive)
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        
        // Clean up spaces before newlines
        markdown = markdown.replace(/ +\n/g, '\n');
        
        // Trim
        markdown = markdown.trim();
        
        return markdown;
    }
    
})();
