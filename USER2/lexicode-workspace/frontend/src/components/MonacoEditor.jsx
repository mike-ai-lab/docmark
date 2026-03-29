import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as monaco from 'monaco-editor';

/**
 * Monaco Editor Component with proper model management
 * - One model per file (preserves undo/redo history)
 * - No memory leaks (proper cleanup)
 * - No stale closures (uses refs)
 * - No cursor jumps (model switching instead of setValue)
 */
const MonacoEditor = forwardRef(({ file, onContentChange }, ref) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const currentFileIdRef = useRef(null);
  const onContentChangeRef = useRef(onContentChange);

  // Expose editor instance to parent via ref
  useImperativeHandle(ref, () => editorRef.current);

  // Keep callback ref in sync
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);

  // Helper: Get or create model for a file
  const getOrCreateModel = (fileData) => {
    if (!fileData) return null;

    if (!modelCacheRef.current.has(fileData.id)) {
      const language = getMonacoLanguage(fileData.name?.split('.').pop() || 'txt');
      const model = monaco.editor.createModel(
        fileData.content || '',
        language,
        monaco.Uri.parse(`file:///${fileData.id}`)
      );
      modelCacheRef.current.set(fileData.id, model);
      console.log('📄 [MONACO] Created model for:', fileData.name, 'Language:', language);
    }
    return modelCacheRef.current.get(fileData.id);
  };

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    console.log('✅ [MONACO] Initializing editor...');

    // Define custom themes
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6'
      }
    });

    // Create editor
    const editor = monaco.editor.create(containerRef.current, {
      theme: 'custom-dark',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: false,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false
      }
    });

    editorRef.current = editor;
    console.log('✅ [MONACO] Editor created');

    // Listen for content changes with debouncing
    let changeTimeout;
    editor.onDidChangeModelContent(() => {
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        const fileId = currentFileIdRef.current;
        if (!fileId || !onContentChangeRef.current) return;

        const newContent = editor.getValue();
        console.log('💾 [MONACO] Auto-saving file:', fileId);
        onContentChangeRef.current(fileId, newContent);
      }, 500);
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 [MONACO] Cleaning up...');
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
      modelCacheRef.current.forEach(model => model.dispose());
      modelCacheRef.current.clear();
    };
  }, []);

  // Switch model when file changes
  useEffect(() => {
    if (!editorRef.current || !file) {
      currentFileIdRef.current = null;
      return;
    }

    console.log('🔄 [MONACO] Switching to file:', file.name);
    currentFileIdRef.current = file.id;

    const model = getOrCreateModel(file);
    if (model) {
      editorRef.current.setModel(model);
      console.log('✅ [MONACO] Model switched successfully');
    }
  }, [file?.id]);

  return <div ref={containerRef} className="w-full h-full" />;
});

MonacoEditor.displayName = 'MonacoEditor';

export default MonacoEditor;

// Helper: Map file extensions to Monaco languages
function getMonacoLanguage(fileType) {
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    md: 'markdown',
    mdx: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    sql: 'sql',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    ps1: 'powershell',
    txt: 'plaintext',
  };

  return languageMap[fileType] || 'plaintext';
}
