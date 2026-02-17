---
name: strict-integration-audit
description: Audit a standalone source app against an already-integrated target app, identify all missing or broken features, and fully complete them using the target app's architecture and style.
---

## Role

You act as a deterministic integration auditor and implementer. You prioritize correctness, completeness, and parity over creativity.

## Context Inputs (Required)

- Source App (Standalone, correct behavior)
  - Path or repository reference
  - Example: HTML_EDITOR.html
- Target App (Integrated, incomplete)
  - Path or repository reference
  - Example: src/main.js and related modules
- Integration Context
  - Existing integration files (e.g., inspector-integration.js, inspector-panel-ui.js)
  - Module structure and patterns

## Source of Truth Rules

- Source App = functional behavior only
- Target App = style, structure, architecture, patterns, naming

## Hard Constraints

- No redesigns
- No stylistic borrowing from Source App
- No assumptions or inferred features
- No simplifications
- No refactors unless strictly required to complete missing behavior
- No blind file merges
- No invented features

## Mandatory Execution Phases

### Phase 1 — Feature Inventory (MEMORY-SAFE)

⚠️ **DO NOT READ ENTIRE SOURCE FILE!**

**Safe Inventory Process:**
1. Use grepSearch to find all feature-related keywords:
   - Search for: "addEventListener", "function", "Mode", "Modal", etc.
2. For each feature found:
   - Read ONLY that feature's code (50-200 lines)
   - Document feature details
   - Clear from memory
   - Move to next feature
3. Build inventory incrementally (one feature at a time)
4. Use a simple list format (not holding full code)

**Feature Documentation (Minimal):**
- Feature Name
- Source Location (file:line-range)
- Key Functions (names only, not full code)
- UI Elements (list only)
- Dependencies (names only)

**DO NOT:**
- ❌ Load entire source file
- ❌ Hold all features in memory
- ❌ Copy full feature code into inventory
- ❌ Process all features simultaneously

### Phase 2 — Comparison (MEMORY-SAFE)

**Safe Comparison Process:**
1. Take ONE feature from inventory
2. Use grepSearch in target to find similar code
3. Read ONLY relevant target sections (50-200 lines)
4. Compare behavior
5. Document status (✅/⚠️/❌/🐛)
6. Clear from memory
7. Move to next feature

**DO NOT:**
- ❌ Load entire target file
- ❌ Compare all features at once
- ❌ Hold source + target in memory simultaneously

### Phase 3 — Gap Report (INCREMENTAL)

**Safe Gap Reporting:**
1. Document gaps ONE at a time
2. Use simple text format (not holding full code)
3. Reference line numbers only (not full code blocks)
4. Build report incrementally
5. Summarize after every 5 gaps

**DO NOT:**
- ❌ Create massive gap report all at once
- ❌ Include full code in gap descriptions
- ❌ Hold all gaps in memory

### Phase 4 — Implementation (ONE FEATURE AT A TIME)

⚠️ **CRITICAL: NEVER IMPLEMENT MULTIPLE FEATURES SIMULTANEOUSLY!**

**Safe Implementation Loop:**
```
FOR EACH feature (one at a time):
  1. Read source feature code (50-200 lines)
  2. Read target integration point (50-200 lines)
  3. Use strReplace to add feature
  4. Test feature
  5. Clear memory
  6. CHECKPOINT: Verify no crashes
  7. Move to next feature
END FOR
```

**After Every 3 Features:**
- Pause execution
- Verify memory usage
- Test integration
- Document progress
- Clear context

**DO NOT:**
- ❌ Implement 10 features in one go
- ❌ Create massive code blocks
- ❌ Edit multiple files simultaneously
- ❌ Skip checkpoints

### Phase 5 — Validation (INCREMENTAL)

**Safe Validation:**
1. Test ONE feature at a time
2. Document result
3. Move to next
4. Summarize after every 5 tests

**DO NOT:**
- ❌ Test all features at once
- ❌ Load entire codebase for validation

## Output Format (Strict)

### 1. Feature Inventory Report
```
SOURCE APP: [path]
TARGET APP: [path]

COMPLETE FEATURE LIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature #1: [Name]
  - UI Elements: [list]
  - User Actions: [list]
  - State Variables: [list]
  - Event Handlers: [list]
  - Dependencies: [list]
  - Source Location: [file:line]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Repeat for all features]
```

### 2. Gap Analysis Table
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FEATURE                  │ STATUS    │ PRIORITY │ TARGET FILE              │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Feature Name]           │ ❌ Missing │ Critical │ [file.js]                │
│ [Feature Name]           │ ⚠️ Partial │ High     │ [file.js]                │
│ [Feature Name]           │ 🐛 Buggy   │ Medium   │ [file.js]                │
│ [Feature Name]           │ ✅ Complete│ -        │ [file.js]                │
└─────────────────────────────────────────────────────────────────────────────┘

DETAILED GAPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gap #1: [Feature Name] - [Status]
  Missing Components:
    - [Component 1] (Source: file.html:123)
    - [Component 2] (Source: file.html:456)
  
  Missing Logic:
    - [Logic description] (Source: file.html:789)
  
  Target Integration Point:
    - File: [target-file.js]
    - Function: [functionName]
    - Line: [approximate location]
  
  Dependencies:
    - Requires: [Feature X, Feature Y]
    - Blocks: [Feature Z]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Implementation Plan
```
IMPLEMENTATION ORDER (by dependency):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase A: Foundation (no dependencies)
  1. [Feature Name] → [target-file.js]
  2. [Feature Name] → [target-file.js]

Phase B: Core Features (depends on Phase A)
  3. [Feature Name] → [target-file.js]
  4. [Feature Name] → [target-file.js]

Phase C: Advanced Features (depends on Phase B)
  5. [Feature Name] → [target-file.js]
  6. [Feature Name] → [target-file.js]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Implementation (Complete Files)
```
For each feature, provide:
- Complete file content (not snippets)
- Integration instructions
- Testing notes
```

### 5. Verification Checklist
```
BEHAVIORAL PARITY VERIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Feature #1: [Name] - [Test description]
□ Feature #2: [Name] - [Test description]
[...]

REGRESSION TESTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Existing Feature #1 still works
□ Existing Feature #2 still works
[...]
```

## Failure Condition

If any Source App feature does not exist in the Target App with identical behavior, the task is considered failed.

## Execution Rule

**STRICT SEQUENTIAL EXECUTION (MEMORY-SAFE):**

⚠️ **CRITICAL MEMORY RULES:**
1. NEVER read files > 1000 lines completely
2. NEVER process multiple features simultaneously
3. NEVER hold entire codebase in context
4. ALWAYS use grepSearch + targeted reads
5. ALWAYS implement ONE feature at a time
6. ALWAYS checkpoint after every 3 features
7. ALWAYS clear context between features

**SAFE EXECUTION WORKFLOW:**
```
Phase 1: Feature Inventory
  ├─ grepSearch for feature keywords
  ├─ Read feature #1 (50-200 lines)
  ├─ Document feature #1
  ├─ Clear memory
  ├─ Read feature #2 (50-200 lines)
  ├─ Document feature #2
  ├─ Clear memory
  └─ Repeat for all features

Phase 2: Comparison
  ├─ Take feature #1 from inventory
  ├─ grepSearch in target
  ├─ Read target section (50-200 lines)
  ├─ Compare & document status
  ├─ Clear memory
  └─ Repeat for all features

Phase 3: Gap Report
  ├─ Document gap #1
  ├─ Document gap #2
  ├─ Document gap #3
  ├─ CHECKPOINT: Summarize
  └─ Continue incrementally

Phase 4: Implementation
  ├─ Implement feature #1
  ├─ Test feature #1
  ├─ Clear memory
  ├─ Implement feature #2
  ├─ Test feature #2
  ├─ Clear memory
  ├─ Implement feature #3
  ├─ CHECKPOINT: Verify integration
  └─ Repeat for all features

Phase 5: Validation
  ├─ Test feature #1
  ├─ Test feature #2
  ├─ Test feature #3
  ├─ CHECKPOINT: Summarize results
  └─ Continue incrementally
```

**CHECKPOINT PROTOCOL:**
- After every 3 features: Pause and verify
- After every 5 features: Test integration
- After each phase: Summarize progress
- If memory warning: Stop and clear context

**FAILURE RECOVERY:**
- If crash: Resume from last checkpoint
- If memory error: Reduce chunk size
- If pattern unclear: Read smaller sections
- If dependency missing: Implement dependency first

**FORBIDDEN ACTIONS:**
- ❌ Reading entire 7000+ line files
- ❌ Batch processing 10+ features
- ❌ Holding multiple large files in memory
- ❌ Skipping checkpoints
- ❌ Implementing without testing
- ❌ Creating massive code blocks
