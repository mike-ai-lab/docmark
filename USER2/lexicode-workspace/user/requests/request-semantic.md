Use this prompt directly with Claude to implement **true semantic editing (patch engine)** into your existing LexiCode app.

---

## PROMPT — SEMANTIC EDITING ENGINE (PATCH SYSTEM)

You are a senior full-stack engineer. Upgrade my existing app **LexiCode Workspace (React + Node + Monaco + Groq)** to support **true semantic file editing using a patch/diff system** instead of full rewrites.

## OBJECTIVE

Replace current AI responses with **structured patch operations** that modify only specific parts of files.

---

## 1. AI RESPONSE FORMAT (MANDATORY)

All AI responses MUST return JSON only:

```json
{
  "type": "patch",
  "file": "example.md",
  "operations": [
    {
      "op": "insert",
      "target": { "type": "line", "value": 10 },
      "content": "New content here"
    },
    {
      "op": "replace",
      "target": { "type": "range", "start": 5, "end": 8 },
      "content": "Updated content"
    },
    {
      "op": "delete",
      "target": { "type": "line", "value": 20 }
    }
  ]
}
```

Support operations:

* insert
* replace
* delete

Target types:

* line
* range
* heading (for markdown)
* function (for code)
* cell (for CSV/XLSX)

---

## 2. FRONTEND IMPLEMENTATION (React)

Modify:
`EditorContainer.jsx`
`AiPanel.jsx`
`useDemoStore.js`

### Requirements:

* Parse AI JSON safely
* Apply patch to current file content
* Update Monaco editor state without reload
* Preserve undo/redo stack

Create utility:

```
/frontend/src/utils/patchEngine.js
```

### patchEngine.js must:

* Accept (content, operations)
* Return updated content
* Handle edge cases (invalid lines, overlaps)
* Be format-aware (basic handling for md, js, csv)

---

## 3. BACKEND (Node / Express)

Modify:
`ai.service.js`

### Requirements:

* Force AI to output ONLY patch JSON
* Inject system prompt:

```
You are a structured editing engine.
Never return full files.
Only return JSON patches.
Be precise and minimal.
```

* Validate response before sending to frontend
* Retry once if invalid JSON

---

## 4. PROMPT ENGINEERING

Update AI prompts:

### Edit Mode Prompt:

```
User wants to modify a file.

Return ONLY JSON patch operations.

Rules:
- Do NOT rewrite entire file
- Modify only necessary parts
- Use line numbers when possible
- Keep changes minimal
```

Include:

* Current file content (trimmed if large)
* File type
* User instruction

---

## 5. FILE TYPE HANDLING

Implement basic adapters:

### Markdown:

* Detect headings
* Allow targeting by heading text

### Code (JS/Python/etc):

* Detect functions
* Allow replacing function blocks

### CSV/XLSX:

* Treat as rows/columns
* Allow cell targeting (A1 format)

---

## 6. SAFETY

If patch fails:

* Fallback to safe mode:

  * Show diff preview
  * Ask user to confirm

---

## 7. UI FEEDBACK

Add:

* “Applied patch” indicator
* Highlight modified lines briefly
* Show operations log (optional)

---

## 8. TEST CASES (IMPLEMENT)

* Insert paragraph in markdown
* Replace function in JS
* Delete line in TXT
* Update cell in CSV

---

## 9. DELIVERABLES

Return:

* Full updated frontend files
* Full backend updates
* patchEngine.js complete implementation
* Example AI responses
* Working integration (no placeholders)

---

## CONSTRAINTS

* No partial implementations
* No pseudo code
* Must work inside current LexiCode structure
* Keep performance optimized

---

After this is implemented, the app must:

* Edit files surgically
* Reduce token usage
* Feel like AI is “editing” not “rewriting”

---

When done, **do a node unit test**, and test the pipeline with ede cases simulation user real workflow.
the API key is already configured in the user system environment variable and can be used.
