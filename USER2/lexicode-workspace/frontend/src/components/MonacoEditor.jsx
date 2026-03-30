import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = forwardRef(({ file, onContentChange }, ref) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const currentFileRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
    getValue: () => editorRef.current?.getValue() || '',
    setValue: (value) => editorRef.current?.setValue(value || '')
  }));

  // Get Monaco language from file extension
  const getLanguage = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase() || 'txt';
    const langMap = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json', 'html': 'html', 'css': 'css', 'scss': 'scss', 'less': 'less',
      'md': 'markdown', 'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp',
      'cs': 'csharp', 'php': 'php', 'rb': 'ruby', 'go': 'go', 'rs': 'rust',
      'sql': 'sql', 'sh': 'shell', 'yaml': 'yaml', 'yml': 'yaml', 'xml': 'xml',
      'txt': 'plaintext'
    };
    return langMap[ext] || 'plaintext';
  };

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Disable Monaco workers
    window.MonacoEnvironment = {
      getWorker: () => ({
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        terminate: () => {},
        onmessage: null,
        onerror: null
      })
    };

    // Create editor
    const editor = monaco.editor.create(containerRef.current, {
      value: '',
      language: 'plaintext',
      theme: 'vs-dark',
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
      formatOnType: false
    });

    editorRef.current = editor;

    // Listen for content changes
    let changeTimeout;
    editor.onDidChangeModelContent((e) => {
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        if (!currentFileRef.current || !onContentChange) return;
        // Don't save if change was programmatic
        if (e.isFlush || e.isUndoing || e.isRedoing) return;
        
        const newContent = editor.getValue();
        onContentChange(currentFileRef.current.id, newContent);
      }, 500);
    });

    return () => {
      editor.dispose();
      editorRef.current = null;
    };
  }, []);

  // Update editor when file changes
  useEffect(() => {
    if (!editorRef.current || !file) {
      currentFileRef.current = null;
      return;
    }

    const editor = editorRef.current;
    const fileContent = file.content || '';
    const language = getLanguage(file.name);
    const uri = monaco.Uri.parse(`file:///${file.id}`);

    // Get current model
    const currentModel = editor.getModel();
    
    // Check if model with this URI already exists
    let newModel = monaco.editor.getModel(uri);
    
    if (!newModel) {
      // Create new model with file content
      newModel = monaco.editor.createModel(fileContent, language, uri);
    } else {
      // Model exists, update its content
      const oldContent = newModel.getValue();
      if (oldContent !== fileContent) {
        // Smart auto-scroll: only scroll if user is near the bottom
        const visibleRange = editor.getVisibleRanges()[0];
        const totalLines = newModel.getLineCount();
        const visibleEndLine = visibleRange?.endLineNumber || 0;
        const isNearBottom = totalLines - visibleEndLine <= 5; // Within 5 lines of bottom
        
        newModel.setValue(fileContent);
        
        // Auto-scroll to bottom if user was near bottom (streaming behavior)
        if (isNearBottom && fileContent.length > oldContent.length) {
          const newTotalLines = newModel.getLineCount();
          editor.revealLine(newTotalLines, monaco.editor.ScrollType.Smooth);
        }
      }
    }

    // Set the model
    editor.setModel(newModel);
    
    // Dispose old model if it's different
    if (currentModel && currentModel !== newModel) {
      currentModel.dispose();
    }

    // Update current file reference
    currentFileRef.current = file;

  }, [file?.id, file?.content, file?.name]);

  return <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />;
});

MonacoEditor.displayName = 'MonacoEditor';

export default MonacoEditor;
