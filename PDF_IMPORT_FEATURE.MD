### PDF UPLOAD → EDITABLE CONTENT FEATURE

You are a senior full-stack engineer.
Your task is to **design and implement a production-ready “Upload PDF” feature** for an existing **HTML + Markdown bidirectional editor**.

#### Context

* The editor accepts **Markdown as source** and renders **full HTML** in a preview pane.
* The preview is **editable**, and changes sync back to Markdown.
* Users must end up **editing the PDF content**, not viewing it.
* **Full control is required** over text, images, tables, diagrams, and graphics.
* **Puppeteer is already available** in the project for PDF handling (use only if beneficial).

#### Core Requirement

Implement a **robust conversion pipeline** so that uploaded PDFs become **clean, editable Markdown**, with high structural fidelity.

---

### REQUIRED APPROACH (MANDATORY)

Use this pipeline **by default**:

**PDF → HTML → Clean HTML → Markdown**

Do **not** convert PDF directly to Markdown except as a fallback.

---

### IMPLEMENTATION RULES

1. **PDF → HTML**

   * Use a reliable method (Puppeteer-based rendering OR a PDF-to-HTML extractor).
   * Preserve:

     * Headings
     * Paragraph flow
     * Lists
     * Tables
     * Images (extract as files + references)
   * Ignore visual-only layout (absolute positioning, pixel-perfect styles).

2. **HTML Normalization Layer (CRITICAL)**
   Transform raw HTML into **semantic HTML**:

   * Remove inline styles, transforms, absolute positioning
   * Convert `<div><span>` soup into:

     * `<h1–h6>`
     * `<p>`
     * `<ul><ol><li>`
     * `<table>`
     * `<figure><img><figcaption>`
   * Merge broken text nodes
   * Detect multi-column text and linearize reading order
   * Deduplicate repeated headers/footers

3. **HTML → Markdown**

   * Convert normalized HTML into Markdown that matches the editor’s dialect.
   * Tables must become valid Markdown tables.
   * Images must be linked, not embedded as base64.
   * Preserve heading hierarchy.

4. **Post-Processing**

   * Normalize whitespace
   * Fix heading depth jumps
   * Ensure Markdown round-trips cleanly to HTML and back
   * Tag imported content as `source: pdf-import`

---

### UX REQUIREMENTS

* Import PDF as a **draft document**
* Allow:

  * Page-by-page import
  * Section-level selection
* Show a preview before final insertion
* Never lock content — everything must be editable

---

### FALLBACK LOGIC

* If PDF is **scanned**:

  * Run OCR
  * Then follow the same pipeline
* If HTML conversion fails:

  * Use direct PDF → Markdown as **last resort**
  * Warn about reduced fidelity

---

### OUTPUT EXPECTATION

Deliver:

1. Clear architecture explanation
2. Exact pipeline steps
3. Node-level implementation strategy
4. Key data structures
5. Error handling strategy
6. No placeholders, no vague steps


Do **not** start before providing your plan and validate your integration.
Provide your plan and proceed after the user confirmation 
---
