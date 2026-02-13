# Versioning System Enhancement – Final Specification

## 1. Autosave Configuration (Dedicated Control)

### Objective

Enable autosave interval configuration directly from the Versioning panel.

### UI Placement

- Add small **Settings icon** in Versioning panel header.
- Click → opens compact modal (not global settings).

### Modal Controls

- Toggle: Enable / Disable Autosave
- Interval selector:

  - 5 min
  - 10 min
  - 30 min
  - 60 min
  - Custom input (minutes, numeric validation ≥1)

### Behavior

- Persist config via `localStorage` (e.g. `versioning.autosaveConfig`).
- Reset timer on:

  - Manual save
  - Interval change
- Autosave triggers only if:

  - Document has changes since last save.
- Clear interval on:

  - Panel unload
  - Disable toggle

---

## 2. Manual “Save Now” Trigger

### Objective

Allow immediate version snapshot creation.

### UI

- Add **Save Now** button in Versioning panel header.

### Behavior

- On click:

  - Force version snapshot.
  - Reset autosave timer.
  - Prevent duplicate snapshot if no changes.
- Update Activity Bar status:

  - “Saved just now” + timestamp.

---

## 3. Rename Version Cards

### Objective

Allow inline renaming of version entries.

### UI Behavior

- Each card includes rename icon OR clickable title.
- Click → title becomes editable input.
- Enter → confirm + persist.
- Esc / blur → cancel.
- Validation:

  - Empty → revert to previous title.

### Data Handling

- Persist title inside version metadata object.
- Re-render list after update.

---

## 4. Autosave Status Hover (Activity Bar)

### Objective

Expose autosave state clearly.

### Hover Tooltip Content

- Autosave: Enabled / Disabled
- Current interval
- Countdown to next save
- Last saved timestamp

Tooltip updates live while timer runs.

---

## 5. Version Retention Policy (Maximum Versions Limit)

### Objective

Prevent unlimited version accumulation and performance degradation.

### Default Rule

- Maximum stored versions: **15**
- Defined as constant inside versioning module:

```js
  const MAX_VERSIONS = 15;
```

### Behavior

- Before adding a new version:

  - If `versions.length >= MAX_VERSIONS`

    - Remove **one oldest version** (FIFO).
    - Then push new version.
- Never batch delete.
- Applies to:

  - Manual save
  - Autosave

### Technical Rule

Retention logic must exist only inside the `createVersion()` function to ensure single-source control.

---

## Architecture Notes

- Isolate all logic in `versioning.module.js`.
- Single interval instance for autosave.
- Use dirty-state detection before snapshot.
- Keep modal lightweight and decoupled.
- Enforce retention policy inside snapshot creation.
- Ensure proper `clearInterval()` cleanup.

---