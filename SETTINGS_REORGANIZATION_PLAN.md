# Settings Reorganization Plan

## Current Problem

The Settings dropdown has become overwhelming with **13+ options** in a single long list:

### Current Settings (Dropdown)
1. ☑️ Sync Scroll
2. ☑️ Sync Cursor
3. ☑️ Helper Messages
4. ☑️ Style Info Tooltips
5. ☑️ Dark Mode
6. ☑️ Flip Panels
7. ☑️ Vertical Layout
8. ☑️ Table of Contents
9. ☑️ Markdown Validation
10. ☑️ Edit Mode (Preview)
11. ☑️ Word Wrap
12. 🔗 Export Validation Report (conditional)
13. 🔗 Auto-Fix Issues (conditional)
14. 📋 Style Selector (GitHub/GitBook/VSCode)
15. 🔗 PDF Settings

**Issues:**
- Too many options in one dropdown
- No logical grouping
- Hard to find specific settings
- Cluttered UI
- Poor UX for new users

---

## Proposed Solution: Settings Panel with Tabs

Replace the dropdown with a **Settings Panel** (modal/side panel) with **categorized tabs**.

### Architecture

```
Settings Button (Header)
        ↓
Settings Panel (Modal)
        ↓
┌─────────────────────────────────────────┐
│  ⚙️ Settings                      [×]   │
├─────────────────────────────────────────┤
│                                         │
│  [Editor] [View] [Sync] [Export] [PDF] │
│  ─────────────────────────────────────  │
│                                         │
│  [Content based on selected tab]        │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│  [Cancel]              [Apply] [Save]   │
└─────────────────────────────────────────┘
```

---

## Settings Categories

### Tab 1: Editor ✏️
**Purpose**: Editor behavior and appearance

- ☑️ Word Wrap
- ☑️ Edit Mode (Preview)
- 📋 Font Size (new)
- 📋 Tab Size (new)
- ☑️ Line Numbers (new)
- ☑️ Minimap (new)

### Tab 2: View 👁️
**Purpose**: UI layout and appearance

- ☑️ Dark Mode
- ☑️ Flip Panels
- ☑️ Vertical Layout
- ☑️ Table of Contents
- 📋 Style: GitHub / GitBook / VSCode
- ☑️ Syntax Guide (show/hide)

### Tab 3: Sync 🔄
**Purpose**: Synchronization features

- ☑️ Sync Scroll
- ☑️ Sync Cursor
- 📋 Sync Delay (ms) (new)
- ☑️ Auto-scroll on click (new)

### Tab 4: Validation ✓
**Purpose**: Markdown validation features

- ☑️ Enable Validation
- ☑️ Show Inline Warnings
- ☑️ Auto-fix on Save (new)
- 🔗 Export Validation Report
- 🔗 Auto-Fix All Issues
- 📋 Validation Rules (new)

### Tab 5: Export 📤
**Purpose**: Export and PDF settings

- 🔗 PDF Settings (opens PDF modal)
- 🔗 Page Setup (opens page setup modal)
- ☑️ Include TOC in PDF (new)
- ☑️ Include Metadata (new)
- 📋 Default Export Format (new)

### Tab 6: Advanced 🔧
**Purpose**: Advanced features and helpers

- ☑️ Helper Messages
- ☑️ Style Info Tooltips
- ☑️ Auto-save (new)
- 📋 Auto-save Interval (new)
- ☑️ Debug Mode (new)

---

## UI Design

### Settings Button
Replace "Settings ▾" dropdown with a single button that opens the panel:

```html
<button class="icon-button" id="settings-button" title="Settings">
    <svg>⚙️</svg>
</button>
```

### Settings Panel
Modal overlay with tabbed interface:

```html
<div class="settings-panel" id="settings-panel">
    <div class="settings-panel-content">
        <div class="settings-panel-header">
            <h3>⚙️ Settings</h3>
            <button class="settings-close">×</button>
        </div>
        
        <div class="settings-tabs">
            <button class="settings-tab active" data-tab="editor">✏️ Editor</button>
            <button class="settings-tab" data-tab="view">👁️ View</button>
            <button class="settings-tab" data-tab="sync">🔄 Sync</button>
            <button class="settings-tab" data-tab="validation">✓ Validation</button>
            <button class="settings-tab" data-tab="export">📤 Export</button>
            <button class="settings-tab" data-tab="advanced">🔧 Advanced</button>
        </div>
        
        <div class="settings-content">
            <!-- Tab content here -->
        </div>
        
        <div class="settings-footer">
            <button class="btn-secondary" id="settings-cancel">Cancel</button>
            <button class="btn-secondary" id="settings-reset">Reset to Defaults</button>
            <button class="btn-primary" id="settings-save">Save</button>
        </div>
    </div>
</div>
```

---

## Benefits

### 1. Better Organization
- Logical grouping by function
- Easy to find specific settings
- Clear mental model

### 2. Scalability
- Easy to add new settings
- Won't clutter the UI
- Can add descriptions/help text

### 3. Better UX
- Less overwhelming for new users
- Power users can navigate quickly
- Visual hierarchy

### 4. Discoverability
- Tab icons help identify categories
- Can add search functionality later
- Can add "What's New" badge

### 5. Flexibility
- Can add sub-sections within tabs
- Can add presets/templates
- Can add import/export settings

---

## Implementation Plan

### Phase 1: Create Settings Panel Structure
1. Create settings panel HTML structure
2. Add CSS for modal and tabs
3. Add tab switching logic
4. Add open/close functionality

### Phase 2: Migrate Existing Settings
1. Move checkboxes to appropriate tabs
2. Update event listeners
3. Test all existing functionality
4. Ensure localStorage compatibility

### Phase 3: Add New Settings
1. Add new useful settings (font size, auto-save, etc.)
2. Add descriptions/tooltips
3. Add validation

### Phase 4: Polish
1. Add animations/transitions
2. Add keyboard shortcuts (Esc to close)
3. Add search functionality (optional)
4. Add "Reset to Defaults" button

---

## Wireframe

### Settings Panel (Editor Tab)
```
┌─────────────────────────────────────────────────┐
│  ⚙️ Settings                              [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [✏️ Editor] [👁️ View] [🔄 Sync] [✓ Valid...] │
│  ══════════                                     │
│                                                 │
│  Editor Settings                                │
│  ───────────────────────────────────────────   │
│                                                 │
│  ☑️ Word Wrap                                   │
│     Wrap long lines to fit editor width         │
│                                                 │
│  ☑️ Edit Mode (Preview)                         │
│     Enable editing directly in preview pane     │
│                                                 │
│  Font Size: [14] px                             │
│     Editor font size (10-24px)                  │
│                                                 │
│  Tab Size: [4] spaces                           │
│     Number of spaces per tab                    │
│                                                 │
│  ☐ Show Line Numbers                            │
│     Display line numbers in editor              │
│                                                 │
│  ☐ Show Minimap                                 │
│     Display code minimap on right side          │
│                                                 │
│                                                 │
│  [Cancel]    [Reset to Defaults]    [Save]     │
└─────────────────────────────────────────────────┘
```

### Settings Panel (View Tab)
```
┌─────────────────────────────────────────────────┐
│  ⚙️ Settings                              [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [✏️ Editor] [👁️ View] [🔄 Sync] [✓ Valid...] │
│              ═════════                          │
│                                                 │
│  View Settings                                  │
│  ───────────────────────────────────────────   │
│                                                 │
│  Appearance                                     │
│  ☑️ Dark Mode                                   │
│     Use dark color scheme                       │
│                                                 │
│  Layout                                         │
│  ☑️ Flip Panels                                 │
│     Swap editor and preview positions           │
│                                                 │
│  ☑️ Vertical Layout                             │
│     Stack panels vertically                     │
│                                                 │
│  Panels                                         │
│  ☑️ Table of Contents                           │
│     Show TOC panel                              │
│                                                 │
│  ☑️ Syntax Guide                                │
│     Show syntax guide panel                     │
│                                                 │
│  Preview Style                                  │
│  ○ GitHub   ● GitBook   ○ VSCode                │
│                                                 │
│  [Cancel]    [Reset to Defaults]    [Save]     │
└─────────────────────────────────────────────────┘
```

---

## CSS Structure

```css
/* Settings Panel */
.settings-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
}

.settings-panel.visible {
    display: flex;
}

.settings-panel-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.settings-panel-header {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.settings-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    padding: 0 20px;
    gap: 5px;
}

.settings-tab {
    padding: 12px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.settings-tab:hover {
    background: #f3f4f6;
}

.settings-tab.active {
    border-bottom-color: #007bff;
    color: #007bff;
}

.settings-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.settings-footer {
    padding: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}
```

---

## Migration Strategy

### Step 1: Build Panel (No Breaking Changes)
- Create settings panel HTML/CSS
- Add tab switching logic
- Keep existing dropdown functional

### Step 2: Migrate Settings (One by One)
- Move one setting at a time
- Test thoroughly
- Ensure localStorage compatibility

### Step 3: Remove Dropdown
- Once all settings migrated
- Remove old dropdown
- Update documentation

### Step 4: Add Enhancements
- Add new settings
- Add search
- Add presets

---

## Timeline

- **Phase 1** (Settings Panel Structure): 2-3 hours
- **Phase 2** (Migrate Existing Settings): 3-4 hours
- **Phase 3** (Add New Settings): 2-3 hours
- **Phase 4** (Polish): 1-2 hours

**Total**: ~8-12 hours of development

---

## Alternative: Simpler Approach

If full panel is too much work, we can do a **simpler categorized dropdown**:

```
Settings ▾
├─ Editor ▸
│  ├─ Word Wrap
│  └─ Edit Mode
├─ View ▸
│  ├─ Dark Mode
│  ├─ Flip Panels
│  └─ Style: [GitHub ▾]
├─ Sync ▸
│  ├─ Sync Scroll
│  └─ Sync Cursor
└─ More... (opens full panel)
```

This is faster to implement but less scalable.

---

## Recommendation

**Go with the Settings Panel approach** because:

1. ✅ Better UX for current 13+ settings
2. ✅ Scalable for future additions
3. ✅ Modern, professional look
4. ✅ Easier to add descriptions/help
5. ✅ Can add search/presets later

The dropdown is already too crowded, and adding more settings will make it worse. A proper settings panel is the right long-term solution.

---

## Next Steps

1. **Review this plan** - Approve the approach
2. **Create mockup** - Build HTML/CSS prototype
3. **Implement** - Follow the 4-phase plan
4. **Test** - Ensure all settings work
5. **Deploy** - Ship the new settings panel

Would you like me to proceed with creating the settings panel?
