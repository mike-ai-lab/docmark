# Preview Panel Architecture - Before vs After

## Before Optimization (❌ Problematic)

```
User types code
    ↓
Content changes
    ↓
useEffect triggers
    ↓
generateHTML() called
    ↓
Full compilation
    ↓
Generate complete HTML with:
  - React CDN
  - ReactDOM CDN
  - Tailwind CDN
  - Compiled code
    ↓
iframe.srcdoc = html  ← FULL RELOAD
    ↓
Iframe resets completely
    ↓
All scripts re-download
    ↓
Tailwind re-initializes
    ↓
React re-initializes
    ↓
Component renders
    ↓
WHITE FLASH + LAG
```

**During Drag:**
```
Mouse move
    ↓
State updates
    ↓
Component re-renders
    ↓
useEffect triggers
    ↓
Compilation starts
    ↓
Iframe reloads
    ↓
WHITE FLASH
    ↓
Touch setup runs again
    ↓
100-200 re-renders
```

---

## After Optimization (✅ Optimized)

```
Initial Load:
    User opens JSX file
        ↓
    React renderer initializes (Babel loads)
        ↓
    Iframe created ONCE with persistent shell:
      - React CDN (loaded once)
      - ReactDOM CDN (loaded once)
      - Tailwind CDN (loaded once)
      - postMessage listener
        ↓
    iframeInitializedRef = true
        ↓
    Initial compilation
        ↓
    postMessage → UPDATE_CODE
        ↓
    Iframe renders React root
```

```
Code Changes:
    User types code
        ↓
    Content changes
        ↓
    scheduleCompile() called
        ↓
    Check isDraggingRef
        ↓
    If dragging: SKIP ✋
    If not dragging: Continue ✓
        ↓
    Wait 300ms (debounce)
        ↓
    Compile code
        ↓
    postMessage → UPDATE_CODE
        ↓
    Iframe receives message
        ↓
    Re-render React root ONLY
        ↓
    NO RELOAD, NO FLASH ✨
```

```
Drag Interaction:
    Mouse down
        ↓
    isDraggingRef = true
        ↓
    Mouse move (smooth scrolling)
        ↓
    scheduleCompile() → BLOCKED ✋
        ↓
    No compilation
        ↓
    No iframe updates
        ↓
    Mouse up
        ↓
    isDraggingRef = false
        ↓
    Compilation resumes
        ↓
    2 re-renders total (start + end)
```

---

## Component Structure

```
PreviewPanel
├── State
│   ├── isDragging (UI state)
│   ├── isReactReady
│   ├── viewMode
│   └── ...
├── Refs
│   ├── iframeRef (iframe element)
│   ├── isDraggingRef (prevents stale closures)
│   ├── iframeInitializedRef (tracks initialization)
│   ├── touchInitializedRef (tracks touch setup)
│   ├── compileTimeoutRef (debounce timer)
│   └── touchPointerRef (pointer element)
├── Effects
│   ├── Initialize React renderer (once)
│   ├── Initialize persistent iframe (once)
│   ├── Update code via postMessage (debounced)
│   ├── Update HTML/SVG (direct write)
│   └── Setup touch gestures (once per mode)
└── Functions
    ├── scheduleCompile (debounced, drag-aware)
    ├── handleMouseDown (sets isDraggingRef)
    ├── handleMouseMove (smooth scrolling)
    └── handleMouseUp (clears isDraggingRef)
```

---

## postMessage Flow

```
PreviewPanel (Parent)          Iframe (Child)
      │                              │
      │  1. Initialize iframe        │
      ├──────────────────────────────>
      │     srcdoc = persistent HTML │
      │                              │
      │  2. Iframe ready signal      │
      <──────────────────────────────┤
      │     { type: 'IFRAME_READY' } │
      │                              │
      │  3. Code update               │
      ├──────────────────────────────>
      │  { type: 'UPDATE_CODE',      │
      │    code: compiledCode }      │
      │                              │
      │                         4. Eval code
      │                         5. Render React root
      │                         6. NO RELOAD ✨
      │                              │
      │  7. Error (if any)           │
      <──────────────────────────────┤
      │  { type: 'COMPILATION_ERROR',│
      │    error: message }          │
```

---

## Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| Iframe lifecycle | Recreated every change | Created once |
| CDN loading | Every change | Once |
| Compilation trigger | Every render | Debounced + drag-aware |
| Update method | `srcdoc` replacement | `postMessage` |
| Touch setup | Every render | Once per mode |
| Console logs | 100+ per interaction | Minimal |
| Performance | Laggy | Smooth |
