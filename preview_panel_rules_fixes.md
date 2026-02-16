### 1. The Fixed-Width Rule (No Wrapping)

Unlike standard web design where text wraps to fit a container, this preview treats the paper as a **static object**.

- **A4 Baseline:** The width is locked at `794px` (the standard pixel width for A4 at 96 DPI).
- **Layout Preservation:** Since the width never changes, your column widths, text breaks, and image alignments remain identical to how they will appear on a physical printout.

### 2. Proportional Scaling (The Zoom Logic)

To keep the paper visible when the panel is resized, we use **CSS Coordinate Space Transformations**:

- **Scale Factor:** The system calculates a `scale` value ().
- **Visual Zoom:** Instead of changing the paper's CSS `width`, it uses `transform: scale()`. This "zooms" the entire document—text, margins, and headers—proportionally without recalculating text flow.

### 3. Top-Center Anchor

The transformation uses `transform-origin: top center;`.

- **Stability:** This ensures that as the paper scales down, it stays centered and fixed to the top of the viewing area, mimicking how a document editor (like Adobe Acrobat or AutoCAD) handles zoom levels.

### 4. Adaptive Container Height

Because `scale()` only changes the visual representation and not the space the element takes up in the DOM, a specific rule is applied:

- **Height Compensation:** The JavaScript manually updates the height of the parent container to (). This prevents the paper from "floating" over other elements and ensures the scrollbars behave correctly based on the visible size.

### 5. Print-Safe Padding (Safe Zones)

The paper uses **fixed padding** (e.g., `60px`) internally.

- **Architectural Standard:** This mimics the "unprintable area" or "margin" of a printer, ensuring that even in the digital preview, your design respects the physical constraints of paper.

### 6. Event-Driven Recalculation

The "Realistic" behavior is maintained by three triggers:

- **Input Trigger:** Content mirrors from the editor.
- **Resize Trigger:** The scaling logic re-runs when the browser window changes.
- **Drag Trigger:** The scaling logic re-runs in real-time as you move the **Resizer Component**, ensuring zero lag between your layout adjustment and the visual feedback.

**References:**

- [W3C CSS Transforms Module Level 1]()
- [DPI and Pixel Dimensions for A-Series Paper Standards]()