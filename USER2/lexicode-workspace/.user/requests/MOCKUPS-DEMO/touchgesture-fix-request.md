This is not Monaco. the **PreviewPanel pipeline is re-compiling + reloading iframe continuously**.

### Root Cause (from logs)

* `Drag ended → React Compiler runs`
* `Iframe re-render`
* `Touch setup runs AGAIN (multiple times)`
* Tailwind injected EACH render
  → we are **rebuilding the entire iframe document on every interaction**

---

## Fix Architecture (must apply all)

### 1. **Stop full iframe reload**

we’re likely doing:

```js
iframe.srcdoc = generatedHtml;
```

This **resets the entire DOM every time** → blank flash + lag.

### Replace with persistent iframe + postMessage

```js
// create iframe ONCE
<iframe ref={iframeRef} />

// update content without reload
iframeRef.current.contentWindow.postMessage({
  type: 'UPDATE_CODE',
  code: compiledCode
}, '*');
```

Inside iframe:

```js
window.addEventListener('message', (e) => {
  if (e.data.type === 'UPDATE_CODE') {
    renderReact(e.data.code); // only rerender root
  }
});
```

---

### 2. **Debounce compilation (critical)**

we are compiling multiple times per drag.

```js
const compileTimeout = useRef();

function scheduleCompile(code) {
  clearTimeout(compileTimeout.current);
  compileTimeout.current = setTimeout(() => {
    compile(code);
  }, 300);
}
```

Call this instead of direct compile.

---

### 3. **Fix drag-triggered recompilation**

the logs show:

```
Drag ended → compile triggered
```

we need a **hard guard**:

```js
const isDraggingRef = useRef(false);

onDragStart = () => isDraggingRef.current = true;
onDragEnd = () => {
  isDraggingRef.current = false;
};

function safeCompile(code) {
  if (isDraggingRef.current) return;
  scheduleCompile(code);
}
```

---

### 4. **Run touch setup ONLY ONCE**

we are re-attaching listeners every render:

```
Iframe touch setup complete (x10+)
```

Fix:

```js
const touchInitialized = useRef(false);

useEffect(() => {
  if (touchInitialized.current) return;
  setupTouch();
  touchInitialized.current = true;
}, []);
```

---

### 5. **Inject Tailwind once**

we’re injecting CDN every render → heavy + blocking.

Move it to initial iframe HTML only:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Do NOT re-insert on updates.

---

### 6. **Avoid double compilation**

Logs show:

```
Compilation successful!
Compilation successful! (again)
```

we likely trigger compile from:

* file update
* preview update
* drag end

Unify:

```js
useEffect(() => {
  if (!activeFile) return;
  safeCompile(activeFile.content);
}, [activeFileId]);
```

Remove all other compile triggers.

---

## Result After Fix

* No white flashing
* No iframe reload
* No lag while dragging
* Single compile per change
* Stable interaction

---

