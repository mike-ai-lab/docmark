import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function PreviewPanel({ content, fileType, fileName }) {
    const [renderedContent, setRenderedContent] = useState('');
    const iframeRef = useRef(null);

    useEffect(() => {
        const renderContent = async () => {
            try {
                switch (fileType) {
                    case 'md':
                        const html = await marked.parse(content || '');
                        setRenderedContent(DOMPurify.sanitize(html));
                        break;
                    
                    case 'html':
                        setRenderedContent(DOMPurify.sanitize(content || ''));
                        break;
                    
                    case 'svg':
                        setRenderedContent(content || '');
                        break;
                    
                    case 'xml':
                        const formatted = formatXML(content || '');
                        setRenderedContent(`<pre>${escapeHtml(formatted)}</pre>`);
                        break;
                    
                    case 'json':
                        try {
                            const parsed = JSON.parse(content || '{}');
                            const pretty = JSON.stringify(parsed, null, 2);
                            setRenderedContent(`<pre>${escapeHtml(pretty)}</pre>`);
                        } catch (e) {
                            setRenderedContent(`<pre class="error">Invalid JSON: ${e.message}</pre>`);
                        }
                        break;
                    
                    default:
                        setRenderedContent(`<pre>${escapeHtml(content || '')}</pre>`);
                }
            } catch (error) {
                setRenderedContent(`<pre class="error">Preview error: ${error.message}</pre>`);
            }
        };

        renderContent();
    }, [content, fileType]);

    // Update iframe content for HTML/SVG
    useEffect(() => {
        if ((fileType === 'html' || fileType === 'svg') && iframeRef.current) {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            if (fileType === 'html') {
                doc.open();
                doc.write(content || '');
                doc.close();
            } else if (fileType === 'svg') {
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { 
                                margin: 0; 
                                padding: 20px; 
                                display: flex; 
                                justify-content: center; 
                                align-items: center;
                                min-height: 100vh;
                                background: #f5f5f5;
                            }
                            svg { 
                                max-width: 100%; 
                                height: auto;
                                background: white;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                            }
                        </style>
                    </head>
                    <body>
                        ${content || '<p>No SVG content</p>'}
                    </body>
                    </html>
                `);
                doc.close();
            }
        }
    }, [content, fileType]);

    const canPreview = ['md', 'html', 'svg', 'xml', 'json'].includes(fileType);

    if (!canPreview) {
        return (
            <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
                <div className="text-center">
                    <p className="text-lg mb-2">Preview not available</p>
                    <p className="text-sm">Preview is only available for Markdown, HTML, SVG, XML, and JSON files</p>
                </div>
            </div>
        );
    }

    if (fileType === 'html' || fileType === 'svg') {
        return (
            <div className="h-full bg-white">
                <iframe
                    ref={iframeRef}
                    title="Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto bg-white p-6">
            <style>{`
                .preview-content {
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .preview-content h1 { font-size: 2em; margin-top: 0.67em; margin-bottom: 0.67em; }
                .preview-content h2 { font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; }
                .preview-content h3 { font-size: 1.17em; margin-top: 1em; margin-bottom: 1em; }
                .preview-content p { margin: 1em 0; }
                .preview-content pre { 
                    background: #f6f8fa; 
                    padding: 16px; 
                    border-radius: 6px; 
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                }
                .preview-content code {
                    background: #f6f8fa;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                }
                .preview-content pre code {
                    background: none;
                    padding: 0;
                }
                .preview-content blockquote {
                    border-left: 4px solid #ddd;
                    padding-left: 16px;
                    margin-left: 0;
                    color: #666;
                }
                .preview-content ul, .preview-content ol {
                    padding-left: 2em;
                }
                .preview-content table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                }
                .preview-content th, .preview-content td {
                    border: 1px solid #ddd;
                    padding: 8px 12px;
                    text-align: left;
                }
                .preview-content th {
                    background: #f6f8fa;
                    font-weight: 600;
                }
                .preview-content img {
                    max-width: 100%;
                    height: auto;
                }
                .preview-content a {
                    color: #0366d6;
                    text-decoration: none;
                }
                .preview-content a:hover {
                    text-decoration: underline;
                }
                .preview-content .error {
                    color: #d73a49;
                    background: #ffeef0;
                    padding: 16px;
                    border-radius: 6px;
                    border-left: 4px solid #d73a49;
                }
            `}</style>
            <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
        </div>
    );
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatXML(xml) {
    let formatted = '';
    let indent = '';
    const tab = '  ';
    
    xml.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
        formatted += indent + '<' + node + '>\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
    });
    
    return formatted.substring(1, formatted.length - 2);
}
