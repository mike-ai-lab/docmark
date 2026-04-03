import { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Maximize2, X, Smartphone, Monitor, RotateCw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import ReactComponentRenderer from '../utils/ReactComponentRenderer';
import { MultiFileResolver } from '../utils/MultiFileResolver';
import { useDemoStore } from '../store/useDemoStore';

// Initialize renderer once
const reactRenderer = new ReactComponentRenderer();

export default function PreviewPanel({ content, fileType, fileName }) {
    const [renderedContent, setRenderedContent] = useState('');
    const [isReactReady, setIsReactReady] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
    const [refreshKey, setRefreshKey] = useState(0); // Force refresh
    const [mobileZoom, setMobileZoom] = useState(0.75); // Default 75% zoom
    const [mobileOrientation, setMobileOrientation] = useState('portrait'); // 'portrait' or 'landscape'
    const iframeRef = useRef(null);
    
    // Get file tree and helper functions from store
    const { fileTree, findNodeInTree, activeFileId } = useDemoStore();
    
    // Get current file path
    const activeFile = activeFileId ? findNodeInTree(fileTree, activeFileId) : null;
    const currentFilePath = activeFile?.path || fileName;

    console.log('🎨 [PREVIEW] === RENDER START ===');
    console.log('🎨 [PREVIEW] fileName:', fileName);
    console.log('🎨 [PREVIEW] fileType:', fileType);
    console.log('🎨 [PREVIEW] currentFilePath:', currentFilePath);
    console.log('🎨 [PREVIEW] viewMode:', viewMode);
    console.log('🎨 [PREVIEW] mobileZoom:', mobileZoom);
    console.log('🎨 [PREVIEW] mobileOrientation:', mobileOrientation);
    console.log('🎨 [PREVIEW] isMaximized:', isMaximized);
    console.log('🎨 [PREVIEW] refreshKey:', refreshKey);
    console.log('🎨 [PREVIEW] Content length:', content?.length || 0);

    // Initialize React renderer for JSX/TSX files
    useEffect(() => {
        if ((fileType === 'jsx' || fileType === 'tsx') && !isReactReady) {
            console.log('⚛️ [PREVIEW] Initializing React renderer...');
            reactRenderer.initialize().then(() => {
                console.log('✅ [PREVIEW] React renderer ready');
                setIsReactReady(true);
            }).catch(err => {
                console.error('❌ [PREVIEW] Failed to initialize React renderer:', err);
            });
        }
    }, [fileType, isReactReady]);

    useEffect(() => {
        console.log('🎨 [PREVIEW] useEffect triggered - fileType:', fileType);
        
        const renderContent = async () => {
            try {
                switch (fileType) {
                    case 'jsx':
                    case 'tsx':
                        console.log('⚛️ [PREVIEW] Rendering React component');
                        if (!isReactReady) {
                            setRenderedContent('<div style="padding: 20px; color: #666;">Loading React compiler...</div>');
                            return;
                        }
                        // React rendering handled by iframe effect
                        break;
                    
                    case 'md':
                        console.log('📝 [PREVIEW] Rendering Markdown');
                        const html = await marked.parse(content || '');
                        setRenderedContent(DOMPurify.sanitize(html));
                        break;
                    
                    case 'html':
                        console.log('🌐 [PREVIEW] Rendering HTML in iframe');
                        // HTML is rendered in iframe, handled by separate useEffect
                        break;
                    
                    case 'svg':
                        console.log('🎨 [PREVIEW] Rendering SVG in iframe');
                        // SVG is rendered in iframe, handled by separate useEffect
                        break;
                    
                    case 'xml':
                        console.log('📄 [PREVIEW] Rendering XML');
                        const formatted = formatXML(content || '');
                        setRenderedContent(`<pre>${escapeHtml(formatted)}</pre>`);
                        break;
                    
                    case 'json':
                        console.log('📊 [PREVIEW] Rendering JSON');
                        try {
                            const parsed = JSON.parse(content || '{}');
                            const pretty = JSON.stringify(parsed, null, 2);
                            setRenderedContent(`<pre>${escapeHtml(pretty)}</pre>`);
                        } catch (e) {
                            setRenderedContent(`<pre class="error">Invalid JSON: ${e.message}</pre>`);
                        }
                        break;
                    
                    default:
                        console.log('📄 [PREVIEW] Rendering as plain text');
                        setRenderedContent(`<pre>${escapeHtml(content || '')}</pre>`);
                }
            } catch (error) {
                console.error('❌ [PREVIEW] Error:', error);
                setRenderedContent(`<pre class="error">Preview error: ${error.message}</pre>`);
            }
        };

        renderContent();
    }, [content, fileType, isReactReady]);

    // Update iframe content for HTML/SVG/JSX/TSX
    useEffect(() => {
        console.log('🖼️ [IFRAME EFFECT] === START ===');
        console.log('🖼️ [IFRAME EFFECT] fileType:', fileType);
        console.log('🖼️ [IFRAME EFFECT] viewMode:', viewMode);
        console.log('🖼️ [IFRAME EFFECT] refreshKey:', refreshKey);
        console.log('🖼️ [IFRAME EFFECT] iframeRef.current:', !!iframeRef.current);
        console.log('🖼️ [IFRAME EFFECT] isReactReady:', isReactReady);
        
        if ((fileType === 'html' || fileType === 'svg' || fileType === 'jsx' || fileType === 'tsx') && iframeRef.current) {
            const iframe = iframeRef.current;
            
            const updateIframe = async () => {
                try {
                    console.log('🔄 [IFRAME UPDATE] Starting update...');
                    
                    // Initialize MultiFileResolver
                    const resolver = new MultiFileResolver(fileTree, findNodeInTree);
                    
                    // For React components
                    if ((fileType === 'jsx' || fileType === 'tsx') && isReactReady) {
                        console.log('⚛️ [IFRAME UPDATE] Rendering React component');
                        // Bundle React component with dependencies
                        const bundled = resolver.bundleReactComponent(content || '', currentFilePath);
                        console.log('⚛️ [IFRAME UPDATE] Bundled code length:', bundled.length);
                        
                        // Extract CSS imports from the original code and find CSS files
                        const cssContent = resolver.extractCssForReact(content || '', currentFilePath);
                        console.log('🎨 [IFRAME UPDATE] CSS content length:', cssContent.length);
                        
                        const html = await reactRenderer.generateHTML(bundled, cssContent);
                        iframe.srcdoc = html;
                        console.log('✅ [IFRAME UPDATE] React component rendered, srcdoc set');
                        return;
                    }
                    
                    // For HTML - process with multi-file support
                    if (fileType === 'html') {
                        console.log('🌐 [IFRAME UPDATE] Processing HTML with dependencies');
                        const processedHtml = resolver.processHtml(content || '', currentFilePath);
                        
                        const doc = iframe.contentDocument || iframe.contentWindow?.document;
                        if (!doc) {
                            console.error('❌ [IFRAME UPDATE] Cannot access iframe document');
                            return;
                        }
                        
                        doc.open();
                        doc.write(processedHtml || '<html><body><p style="padding: 20px; color: #666;">No content</p></body></html>');
                        doc.close();
                        console.log('✅ [IFRAME UPDATE] HTML with dependencies written to iframe');
                        return;
                    }
                    
                    // For SVG
                    if (fileType === 'svg') {
                        const doc = iframe.contentDocument || iframe.contentWindow?.document;
                        if (!doc) {
                            console.error('❌ [IFRAME UPDATE] Cannot access iframe document');
                            return;
                        }
                        
                        console.log('🖼️ [IFRAME UPDATE] Writing SVG to iframe');
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
                                ${content || '<p style="padding: 20px; color: #666;">No SVG content</p>'}
                            </body>
                            </html>
                        `);
                        doc.close();
                        console.log('✅ [IFRAME UPDATE] SVG written to iframe');
                    }
                } catch (error) {
                    console.error('❌ [IFRAME UPDATE] Error:', error);
                }
            };
            
            updateIframe();
            setTimeout(updateIframe, 100);
        } else {
            console.log('⏭️ [IFRAME EFFECT] Skipping - conditions not met');
        }
    }, [content, fileType, isReactReady, refreshKey, fileTree, currentFilePath]); // Added fileTree and currentFilePath

    const canPreview = ['md', 'html', 'svg', 'xml', 'json', 'jsx', 'tsx'].includes(fileType);
    const isInteractive = ['html', 'jsx', 'tsx'].includes(fileType);

    if (!canPreview) {
        return (
            <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
                <div className="text-center">
                    <p className="text-lg mb-2">Preview not available</p>
                    <p className="text-sm">Preview is available for Markdown, HTML, SVG, XML, JSON, JSX, and TSX files</p>
                </div>
            </div>
        );
    }

    // Preview Header Component
    const PreviewHeader = () => (
        <div className="h-10 bg-[#252526] border-b border-black/40 flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center gap-2">
                {/* Live Indicator */}
                {isInteractive && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
                    </div>
                )}
                <span className="text-xs text-white/60">{fileName}</span>
            </div>

            <div className="flex items-center gap-1">
                {/* Mobile Controls - Only show in mobile view */}
                {viewMode === 'mobile' && (fileType === 'html' || fileType === 'jsx' || fileType === 'tsx') && (
                    <div className="flex items-center gap-1 mr-2">
                        {/* Zoom Controls */}
                        <div className="flex items-center bg-white/5 rounded-md p-0.5">
                            <button
                                onClick={() => {
                                    const newZoom = Math.max(0.5, mobileZoom - 0.1);
                                    console.log('🔍 [ZOOM] Zoom out to:', newZoom);
                                    setMobileZoom(newZoom);
                                }}
                                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                title="Zoom Out"
                                disabled={mobileZoom <= 0.5}
                            >
                                <ZoomOut size={14} />
                            </button>
                            <span className="text-[10px] text-white/60 px-2 font-mono min-w-[3rem] text-center">
                                {Math.round(mobileZoom * 100)}%
                            </span>
                            <button
                                onClick={() => {
                                    const newZoom = Math.min(1.5, mobileZoom + 0.1);
                                    console.log('🔍 [ZOOM] Zoom in to:', newZoom);
                                    setMobileZoom(newZoom);
                                }}
                                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                title="Zoom In"
                                disabled={mobileZoom >= 1.5}
                            >
                                <ZoomIn size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    console.log('� [ZOOM] Fit to view');
                                    setMobileZoom(0.75);
                                }}
                                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all ml-0.5"
                                title="Fit to View (75%)"
                            >
                                <Maximize size={14} />
                            </button>
                        </div>

                        {/* Rotate Button */}
                        <button
                            onClick={() => {
                                const newOrientation = mobileOrientation === 'portrait' ? 'landscape' : 'portrait';
                                console.log('🔄 [ROTATE] Rotating to:', newOrientation);
                                setMobileOrientation(newOrientation);
                            }}
                            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-all"
                            title={`Rotate to ${mobileOrientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
                        >
                            <RotateCw size={14} />
                        </button>
                    </div>
                )}

                {/* Refresh Button */}
                <button
                    onClick={() => {
                        console.log('🔄 [REFRESH] Manual refresh triggered');
                        setRefreshKey(prev => prev + 1);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-all mr-2"
                    title="Refresh Preview"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                </button>

                {/* View Mode Toggle */}
                {(fileType === 'html' || fileType === 'jsx' || fileType === 'tsx') && (
                    <div className="flex items-center bg-white/5 rounded-md p-0.5 mr-2">
                        <button
                            onClick={() => {
                                console.log('🖥️ [VIEW MODE] Switching to desktop');
                                setViewMode('desktop');
                            }}
                            className={`p-1.5 rounded transition-all ${
                                viewMode === 'desktop' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                            title="Desktop View"
                        >
                            <Monitor size={14} />
                        </button>
                        <button
                            onClick={() => {
                                console.log('📱 [VIEW MODE] Switching to mobile');
                                setViewMode('mobile');
                            }}
                            className={`p-1.5 rounded transition-all ${
                                viewMode === 'mobile' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                            title="Mobile View"
                        >
                            <Smartphone size={14} />
                        </button>
                    </div>
                )}

                {/* Maximize Button */}
                <button
                    onClick={() => {
                        console.log('⛶ [MAXIMIZE] Toggling maximize:', !isMaximized);
                        setIsMaximized(!isMaximized);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-all"
                    title={isMaximized ? "Exit Fullscreen" : "Maximize"}
                >
                    {isMaximized ? <X size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>
        </div>
    );

    // Mobile Frame Component
    const MobileFrame = ({ children }) => {
        const isLandscape = mobileOrientation === 'landscape';
        const frameWidth = isLandscape ? 667 : 375;
        const frameHeight = isLandscape ? 375 : 667;
        
        console.log('📱 [MOBILE FRAME] Rendering');
        console.log('📱 [MOBILE FRAME] Orientation:', mobileOrientation);
        console.log('📱 [MOBILE FRAME] Dimensions:', `${frameWidth}×${frameHeight}`);
        console.log('📱 [MOBILE FRAME] Zoom:', mobileZoom);
        
        return (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto">
                <div 
                    className="relative my-8 transition-transform duration-300"
                    style={{ 
                        transform: `scale(${mobileZoom})`,
                        transformOrigin: 'center'
                    }}
                >
                    {/* Phone Frame */}
                    <div 
                        className="relative bg-black rounded-[3rem] p-3 shadow-2xl transition-all duration-300" 
                        style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
                    >
                        {/* Notch - Position changes based on orientation */}
                        <div 
                            className={`absolute bg-black rounded-b-3xl z-10 transition-all duration-300 ${
                                isLandscape 
                                    ? 'left-0 top-1/2 -translate-y-1/2 w-7 h-40 rounded-r-3xl rounded-l-none' 
                                    : 'top-0 left-1/2 -translate-x-1/2 w-40 h-7'
                            }`}
                        ></div>
                        
                        {/* Screen */}
                        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                            {/* Status Bar - Position changes based on orientation */}
                            <div className={`absolute bg-white z-10 flex items-center justify-between text-xs font-semibold transition-all duration-300 ${
                                isLandscape
                                    ? 'left-0 top-0 bottom-0 w-11 flex-col py-6 px-2'
                                    : 'top-0 left-0 right-0 h-11 px-6'
                            }`}>
                                <span className={isLandscape ? 'rotate-90' : ''}>9:41</span>
                                <div className={`flex items-center gap-1 ${isLandscape ? 'rotate-90' : ''}`}>
                                    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                                        <rect opacity="0.4" x="0.5" y="0.5" width="4" height="11" rx="1" stroke="black"/>
                                        <rect opacity="0.4" x="6.5" y="0.5" width="4" height="11" rx="1" stroke="black"/>
                                        <rect x="12.5" y="0.5" width="4" height="11" rx="1" stroke="black" fill="black"/>
                                    </svg>
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                                        <path d="M1 6C1 3.79086 2.79086 2 5 2H11C13.2091 2 15 3.79086 15 6V6C15 8.20914 13.2091 10 11 10H5C2.79086 10 1 8.20914 1 6V6Z" fill="black"/>
                                        <path opacity="0.4" d="M15 4V8C15.6 7.66667 16.2 6.6 16 6C15.8 5.4 15.6 4.33333 15 4Z" fill="black"/>
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Content - Adjust padding based on orientation */}
                            <div className={`absolute inset-0 transition-all duration-300 ${
                                isLandscape ? 'pl-11' : 'pt-11'
                            }`}>
                                {children}
                            </div>
                        </div>
                        
                        {/* Home Indicator - Position changes based on orientation */}
                        <div className={`absolute bg-white/30 rounded-full transition-all duration-300 ${
                            isLandscape
                                ? 'right-2 top-1/2 -translate-y-1/2 w-1 h-32'
                                : 'bottom-2 left-1/2 -translate-x-1/2 w-32 h-1'
                        }`}></div>
                    </div>
                    
                    {/* Device Label */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium whitespace-nowrap">
                        iPhone 12 Pro • {frameWidth}×{frameHeight} • {mobileOrientation} • {Math.round(mobileZoom * 100)}%
                    </div>
                </div>
            </div>
        );
    };

    // Render iframe content
    const renderIframeContent = () => {
        console.log('🎬 [RENDER IFRAME] Called');
        console.log('🎬 [RENDER IFRAME] fileType:', fileType);
        console.log('🎬 [RENDER IFRAME] viewMode:', viewMode);
        
        if (fileType === 'html' || fileType === 'svg' || fileType === 'jsx' || fileType === 'tsx') {
            const iframeElement = (
                <iframe
                    key={`iframe-${refreshKey}-${viewMode}`} // Force remount on refresh or view change
                    ref={iframeRef}
                    title="Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
            );

            if (viewMode === 'mobile' && (fileType === 'html' || fileType === 'jsx' || fileType === 'tsx')) {
                console.log('📱 [RENDER IFRAME] Rendering mobile frame');
                return <MobileFrame>{iframeElement}</MobileFrame>;
            }

            console.log('🖥️ [RENDER IFRAME] Rendering desktop view');
            return <div className="h-full bg-white">{iframeElement}</div>;
        }

        console.log('⏭️ [RENDER IFRAME] Not an iframe file type');
        return null;
    };

    // Main render
    const previewContent = (
        <div className={`flex flex-col h-full rounded-lg overflow-hidden ${isMaximized ? 'fixed inset-0 z-50 bg-[#1e1e1e]' : ''}`}>
            <PreviewHeader />
            
            {(fileType === 'html' || fileType === 'svg' || fileType === 'jsx' || fileType === 'tsx') ? (
                renderIframeContent()
            ) : (
                <div className="flex-1 overflow-auto bg-white p-6">
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
                        
                        .preview-content {
                            max-width: 800px;
                            margin: 0 auto;
                            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', sans-serif;
                            font-size: 16px;
                            line-height: 1.8;
                            color: #24292f;
                            letter-spacing: 0.01em;
                        }
                        
                        /* Headings with DocMark style */
                        .preview-content h1 { 
                            font-size: 48px;
                            font-weight: 300;
                            line-height: 1.2;
                            letter-spacing: -0.02em;
                            margin-top: 0;
                            margin-bottom: 24px;
                            padding-bottom: 0.3em;
                            border-bottom: none;
                            color: #1f2937;
                        }
                        .preview-content h1 strong,
                        .preview-content h1 b {
                            font-weight: 700;
                            color: #2563eb;
                        }
                        
                        .preview-content h2 { 
                            font-size: 32px;
                            font-weight: 700;
                            line-height: 1.3;
                            letter-spacing: -0.01em;
                            margin-top: 48px;
                            margin-bottom: 20px;
                            padding-bottom: 0.3em;
                            border-bottom: 1px solid #d0d7de;
                            color: #1f2937;
                        }
                        .preview-content h2 strong,
                        .preview-content h2 b {
                            font-weight: 900;
                            color: #2563eb;
                        }
                        
                        .preview-content h3 { 
                            font-size: 24px;
                            font-weight: 700;
                            line-height: 1.4;
                            letter-spacing: -0.01em;
                            margin-top: 32px;
                            margin-bottom: 16px;
                            color: #1f2937;
                        }
                        .preview-content h3 strong,
                        .preview-content h3 b {
                            font-weight: 900;
                            color: #2563eb;
                        }
                        
                        .preview-content h4 {
                            font-size: 20px;
                            font-weight: 700;
                            margin-top: 24px;
                            margin-bottom: 12px;
                            color: #1f2937;
                        }
                        
                        .preview-content h5 {
                            font-size: 18px;
                            font-weight: 700;
                            margin-top: 20px;
                            margin-bottom: 10px;
                            color: #1f2937;
                        }
                        
                        .preview-content h6 {
                            font-size: 16px;
                            font-weight: 700;
                            margin-top: 16px;
                            margin-bottom: 8px;
                            color: #1f2937;
                        }
                        
                        /* Paragraphs and text */
                        .preview-content p { 
                            margin-top: 0;
                            margin-bottom: 20px;
                            font-weight: 400;
                        }
                        
                        .preview-content strong,
                        .preview-content b {
                            font-weight: 700;
                            color: #2563eb;
                        }
                        
                        /* Links with blue accent */
                        .preview-content a {
                            color: #2563eb;
                            text-decoration: none;
                            font-weight: 600;
                            transition: opacity 0.2s;
                        }
                        .preview-content a:hover {
                            opacity: 0.8;
                        }
                        
                        /* Lists */
                        .preview-content ul, .preview-content ol {
                            margin-top: 0;
                            margin-bottom: 20px;
                            padding-left: 2em;
                        }
                        .preview-content li {
                            margin-bottom: 8px;
                        }
                        .preview-content li > p {
                            margin-bottom: 8px;
                        }
                        
                        /* Code with blue accent */
                        .preview-content code {
                            font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: 600;
                            padding: 3px 8px;
                            margin: 0;
                            background-color: rgba(37, 99, 235, 0.08);
                            border: 1px solid rgba(37, 99, 235, 0.2);
                            border-radius: 4px;
                            color: #2563eb;
                        }
                        
                        .preview-content pre { 
                            padding: 20px;
                            overflow: auto;
                            font-size: 14px;
                            line-height: 1.6;
                            background-color: #f6f8fa;
                            border-radius: 8px;
                            border: 1px solid #d0d7de;
                            margin-bottom: 20px;
                        }
                        
                        .preview-content pre code {
                            display: inline;
                            max-width: auto;
                            padding: 0;
                            margin: 0;
                            overflow: visible;
                            line-height: inherit;
                            word-wrap: normal;
                            background-color: transparent;
                            border: 0;
                            color: #24292f;
                            font-weight: 400;
                        }
                        
                        /* Blockquotes with blue accent */
                        .preview-content blockquote {
                            margin: 0 0 20px 0;
                            padding: 0 1em;
                            color: #656d76;
                            border-left: 4px solid #2563eb;
                            background-color: rgba(37, 99, 235, 0.05);
                        }
                        
                        /* Tables */
                        .preview-content table {
                            border-spacing: 0;
                            border-collapse: collapse;
                            display: block;
                            width: max-content;
                            max-width: 100%;
                            overflow: auto;
                            margin-bottom: 20px;
                        }
                        .preview-content table tr {
                            background-color: #ffffff;
                            border-top: 1px solid #d0d7de;
                        }
                        .preview-content table th,
                        .preview-content table td {
                            padding: 12px 16px;
                            border: 1px solid #d0d7de;
                        }
                        .preview-content table th {
                            font-weight: 700;
                            background-color: #f6f8fa;
                        }
                        
                        /* Horizontal rule */
                        .preview-content hr {
                            height: 1px;
                            padding: 0;
                            margin: 32px 0;
                            background-color: #d0d7de;
                            border: 0;
                        }
                        
                        /* Images */
                        .preview-content img {
                            max-width: 100%;
                            height: auto;
                            box-sizing: content-box;
                        }
                        
                        /* Task lists */
                        .preview-content .task-list-item {
                            list-style-type: none;
                        }
                        .preview-content .task-list-item input {
                            margin: 0 0.5em 0.25em -1.6em;
                            vertical-align: middle;
                        }
                        
                        /* Error messages */
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
            )}
        </div>
    );

    return previewContent;
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
