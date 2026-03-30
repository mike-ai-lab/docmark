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
    }
    return modelCacheRef.current.get(fileData.id);
  };

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Configure Monaco Environment to disable web workers completely
    // Provide a fake worker that does nothing to prevent errors
    window.MonacoEnvironment = {
      getWorker: function (workerId, label) {
        // Return a fake worker object that prevents all worker operations
        return {
          postMessage: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          terminate: () => {},
          onmessage: null,
          onerror: null
        };
      }
    };

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

    // Listen for content changes with debouncing
    let changeTimeout;
    editor.onDidChangeModelContent(() => {
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        const fileId = currentFileIdRef.current;
        if (!fileId || !onContentChangeRef.current) return;

        const newContent = editor.getValue();
        onContentChangeRef.current(fileId, newContent);
      }, 500);
    });

    // Cleanup on unmount
    return () => {
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

    const fileId = file.id;
    const previousFileId = currentFileIdRef.current;
    
    // Only switch model if file ID changed (not just content)
    if (previousFileId !== fileId) {
      currentFileIdRef.current = fileId;
      
      const model = getOrCreateModel(file);
      if (model) {
        editorRef.current.setModel(model);
      }
    } else {
      // Same file, just update content (for streaming)
      const model = modelCacheRef.current.get(fileId);
      if (model) {
        const currentModelContent = model.getValue();
        const fileContent = file.content || '';
        
        if (currentModelContent !== fileContent) {
          // Update model content without switching models
          const position = editorRef.current.getPosition();
          const selection = editorRef.current.getSelection();
          
          model.pushEditOperations(
            [],
            [{
              range: model.getFullModelRange(),
              text: fileContent
            }],
            () => null
          );
          
          // Restore cursor position
          if (position) {
            editorRef.current.setPosition(position);
          }
          if (selection) {
            editorRef.current.setSelection(selection);
          }
        }
      }
    }
  }, [file?.id, file?.content]); // Watch both id AND content

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
