We’re hitting classic Monaco lifecycle issues. The editor is not “broken” — The integration is.

### Critical Problems

#### 1. **Recreating vs Updating Model**

we use `setValue()` on every file switch → this kills performance and loses undo stack.

**Fix: use models per file**

```js
const modelCache = useRef(new Map());

function getOrCreateModel(file) {
  if (!modelCache.current.has(file.id)) {
    const model = monaco.editor.createModel(
      file.content || '',
      getMonacoLanguage(file.name.split('.').pop()),
      monaco.Uri.parse(`file:///${file.id}`)
    );
    modelCache.current.set(file.id, model);
  }
  return modelCache.current.get(file.id);
}
```

Then replace our update effect:

```js
useEffect(() => {
  if (!editorRef.current || !activeFile) return;

  const model = getOrCreateModel(activeFile);
  editorRef.current.setModel(model);
}, [activeFileId]);
```

---

#### 2. **Memory Leak (no dispose)**

Editor + models are never disposed.

**Fix**

```js
useEffect(() => {
  return () => {
    if (editorRef.current) {
      editorRef.current.dispose();
      editorRef.current = null;
    }
    modelCache.current.forEach(m => m.dispose());
    modelCache.current.clear();
  };
}, []);
```

---

#### 3. **Stale Closure in Auto-save**

`activeFileId` inside `onDidChangeModelContent` becomes outdated.

**Fix**

```js
const activeFileIdRef = useRef(activeFileId);
useEffect(() => {
  activeFileIdRef.current = activeFileId;
}, [activeFileId]);
```

Update listener:

```js
editor.onDidChangeModelContent(() => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const id = activeFileIdRef.current;
    if (!id) return;
    updateFileContent(id, editor.getValue());
  }, 500);
});
```

---

#### 4. **Double Source of Truth**

we push content to store AND force `setValue()` → causes flicker + cursor jumps.

**Fix**
Remove this entirely:

```js
editorRef.current.setValue(newContent);
```

Model handles it.

---

#### 5. **Language Reset Inefficiency**

we call:

```js
monaco.editor.setModelLanguage(...)
```

on every switch.

Already handled when creating model → remove it.

---

#### 6. **Initialization Race Condition**

Editor only initializes when `activeFile` exists → bad.

**Fix**
Initialize once, independent of file:

```js
if (!editorContainerRef.current || editorRef.current) return;
```

Remove `activeFile` dependency.

---

### Result After Fix

* Instant tab switching (no re-render lag)
* Undo/redo per file preserved
* No cursor jump
* No memory leaks
* Stable autosave

---

