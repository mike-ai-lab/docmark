# Table of Contents - User Guide

## What is the Table of Contents Feature?

The Table of Contents (TOC) feature automatically generates a navigable outline of your markdown document based on all headings (H1 through H6). It appears as a side panel that updates in real-time as you write.

## How to Enable TOC

1. Click the **Settings** dropdown in the header
2. Check the **"Table of Contents"** option
3. The TOC panel will appear on the right side of the screen

## Using the TOC Panel

### Navigation
- **Click any heading** in the TOC to jump directly to that section in your editor
- The editor will scroll to the selected heading and place your cursor there
- The active section is highlighted in blue

### Panel Management
- **Close the panel**: Click the **×** button in the panel header
- **Reopen**: Check "Table of Contents" in Settings again
- Your preference is saved automatically

### What Gets Included
The TOC automatically includes:
- All markdown headings (# through ######)
- Proper indentation based on heading level
- Real-time updates as you type

### What Gets Excluded
The TOC intelligently skips:
- Headings inside code blocks (```...```)
- Headings in YAML front matter (---...---)

## Visual Hierarchy

The TOC displays headings with different indentation levels:

```
# H1 Heading          (Bold, no indent)
  ## H2 Heading       (Slight indent)
    ### H3 Heading    (More indent)
      #### H4 Heading (Even more indent)
```

## PDF Export with TOC

When you export your document to PDF:

1. The TOC is **automatically included** at the beginning
2. It appears before your main content
3. A separator line divides the TOC from the content
4. The TOC is formatted with proper indentation

**Note**: The TOC is included in PDF exports even if the panel is closed, as long as your document has headings.

## Tips & Best Practices

### For Best Results
- Use heading levels consistently (don't skip levels)
- Keep heading text concise for better TOC readability
- Use H1 for main sections, H2 for subsections, etc.

### Example Structure
```markdown
# Introduction
## Background
## Objectives

# Methodology
## Data Collection
### Survey Design
### Sample Size
## Analysis

# Results
## Findings
## Discussion

# Conclusion
```

This creates a clean, hierarchical TOC that's easy to navigate.

## Keyboard Shortcuts

While there's no dedicated keyboard shortcut for the TOC, you can:
- Use **Alt + S** (or click Settings) to access the TOC toggle
- Use your mouse to click TOC items for quick navigation

## Troubleshooting

### TOC is Empty
- Make sure your document has headings (lines starting with #)
- Check that headings aren't inside code blocks
- Verify headings aren't in YAML front matter

### TOC Not Updating
- The TOC updates automatically when you type
- If it seems stuck, try closing and reopening the panel

### TOC Panel Won't Open
- Check that you've checked the "Table of Contents" option in Settings
- Try refreshing the page
- Clear your browser cache if the issue persists

## Technical Details

- **Storage**: Your TOC preference is saved in localStorage
- **Performance**: TOC generation is optimized for large documents
- **Compatibility**: Works with all preview styles (GitHub, GitBook, VSCode)
- **Theme Support**: Automatically adapts to light/dark mode

## Comparison with Other Features

| Feature | Purpose | Location |
|---------|---------|----------|
| **TOC Panel** | Navigate your document structure | Right side panel |
| **Syntax Guide** | Learn markdown syntax | Right side panel (separate) |
| **Preview Pane** | See rendered output | Center/right pane |

You can use the TOC panel alongside the Syntax Guide - they're independent features.

## Future Enhancements

Potential improvements being considered:
- Collapsible TOC sections
- Search/filter within TOC
- Custom depth limits
- Export TOC as separate file

---

**Need Help?** Check the main USER_GUIDE.md or visit the GitHub repository for more information.
