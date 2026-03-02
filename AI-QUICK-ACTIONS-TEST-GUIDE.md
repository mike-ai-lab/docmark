# AI Quick Actions Test Guide

## Overview

This guide helps you test and validate all AI quick actions to ensure they produce expected outputs without drift.

## Test Suite

Open `test-ai-quick-actions.html` in your browser to see:
- All 8 quick actions with sample inputs
- Expected behavior for each action
- Actual prompts sent to the AI
- Side-by-side input/output comparison

## Quick Actions Reference

### 1. Improve Text
**Purpose:** Rewrite text to be clearer, more professional, and better structured

**Key Requirements:**
- Preserve original meaning and tone
- Don't add new information
- Maintain similar length unless poorly structured
- Use dash (-) for lists

**Common Drift Issues:**
- ❌ Adding information not in original
- ❌ Changing tone significantly
- ❌ Over-expanding brief text
- ✅ Should only clarify and restructure

### 2. Fix Grammar
**Purpose:** Correct grammar, spelling, and punctuation errors only

**Key Requirements:**
- Fix only errors, don't rewrite
- Preserve original wording and style
- Maintain sentence structure unless incorrect
- Keep author's voice

**Common Drift Issues:**
- ❌ Rewriting sentences unnecessarily
- ❌ Changing style or tone
- ❌ "Improving" text beyond grammar fixes
- ✅ Should only fix actual errors

### 3. Fix & Improve Markdown ⭐ NEW
**Purpose:** Fix markdown formatting and standardize syntax without changing content

**Key Requirements:**
- Convert list markers to dash (-)
- Fix heading spacing (# Heading)
- Standardize indentation
- Fix broken tables and code blocks
- **DO NOT** change any content or meaning
- **DO NOT** add new information

**Common Drift Issues:**
- ❌ Adding explanations or new content
- ❌ Removing information
- ❌ Changing wording
- ✅ Should only fix formatting

**Test Example:**
```markdown
Input:
#Heading
* item one
* item two
  *nested item

Output:
# Heading
- item one
- item two
  - nested item
```

### 4. Expand
**Purpose:** Add clarity, context, and detail to brief text

**Key Requirements:**
- Expand by 2-3x original length
- Add examples and explanations
- Maintain tone and intent
- Keep same structure

**Common Drift Issues:**
- ❌ Changing core message
- ❌ Adding unrelated information
- ❌ Changing writing style
- ✅ Should naturally extend content

### 5. Summarize
**Purpose:** Create concise summary of longer text

**Key Requirements:**
- Aim for 25-30% of original length
- Retain all key ideas
- Remove redundancy
- Maintain logical flow

**Common Drift Issues:**
- ❌ Missing important information
- ❌ Adding interpretations
- ❌ Too brief or too long
- ✅ Should capture essence

### 6. Fix Code
**Purpose:** Fix bugs, errors, and code quality issues

**Key Requirements:**
- Fix syntax and logic errors
- Improve code quality
- Use modern syntax
- Return ONLY code (no markdown blocks)
- Don't add comments unless fixing existing

**Common Drift Issues:**
- ❌ Wrapping in markdown code blocks
- ❌ Adding explanatory text
- ❌ Over-engineering simple code
- ✅ Should return clean code only

### 7. Improve Code
**Purpose:** Optimize code for performance, readability, and best practices

**Key Requirements:**
- Use modern language features
- Apply design patterns
- Optimize algorithms
- Return ONLY code (no markdown blocks)

**Common Drift Issues:**
- ❌ Wrapping in markdown code blocks
- ❌ Adding explanations
- ❌ Changing functionality
- ✅ Should return improved code only

### 8. Document Code
**Purpose:** Add comprehensive comments and documentation

**Key Requirements:**
- Add JSDoc/docstring comments
- Document parameters and returns
- Explain complex logic
- Return ONLY code with comments

**Common Drift Issues:**
- ❌ Wrapping in markdown code blocks
- ❌ Adding text outside code
- ❌ Over-commenting obvious code
- ✅ Should return documented code only

### 9. Generate Content
**Purpose:** Create new markdown content from prompt

**Key Requirements:**
- Use dash (-) for lists
- Proper heading spacing
- Output HTML directly (no code blocks)
- Follow markdown standards

**Common Drift Issues:**
- ❌ Using asterisk (*) for lists
- ❌ Wrapping HTML in code blocks
- ❌ Missing heading spaces
- ✅ Should follow markdown rules

## Testing Procedure

### Manual Testing

1. **Open the main application** (index.html)
2. **Configure AI settings** with your API key
3. **For each action:**
   - Select sample text in editor
   - Click the action button
   - Review the output
   - Check for drift issues

### Using Test Suite

1. **Open** `test-ai-quick-actions.html`
2. **Review** sample inputs and expected behaviors
3. **Check** actual prompts being sent
4. **Manually test** in main app with these samples
5. **Compare** results with expectations

### Validation Checklist

For each action, verify:

- [ ] Output matches expected behavior
- [ ] No unwanted additions or removals
- [ ] Proper markdown formatting (dash for lists)
- [ ] No markdown code blocks around code actions
- [ ] Tone and style preserved (where applicable)
- [ ] No meta-commentary or explanations
- [ ] Consistent results across multiple runs

## Common Issues & Solutions

### Issue: AI adds explanations
**Solution:** Prompts now explicitly say "No explanations, no preamble, no meta-commentary"

### Issue: Code wrapped in markdown blocks
**Solution:** Prompts now say "No markdown formatting, no code block syntax"

### Issue: Lists use asterisk (*)
**Solution:** All prompts enforce "Use dash (-) for unordered lists, NEVER asterisk (*)"

### Issue: Output drifts from original
**Solution:** Prompts now more specific about preserving content and not adding information

### Issue: Improve action over-expands
**Solution:** Updated to say "Maintain the same content depth - don't expand unless text is too brief"

## Prompt Improvements Made

All prompts have been updated with:

1. **Explicit output format rules** - "Return only X. No explanations, no preamble"
2. **Stronger preservation rules** - "Do NOT add new information"
3. **Clearer constraints** - Specific length targets, formatting rules
4. **Critical rules sections** - Highlighted important requirements
5. **Anti-drift measures** - Explicit "do not" statements

## New Action: Fix & Improve Markdown

This action is specifically for cleaning up messy markdown:

**Use Cases:**
- Pasted content with inconsistent formatting
- Mixed list marker styles
- Broken tables or code blocks
- Inconsistent indentation
- Missing heading spaces

**What it does:**
- Standardizes list markers to dash (-)
- Fixes heading spacing
- Corrects indentation
- Fixes table and code block syntax
- Removes trailing whitespace

**What it doesn't do:**
- Change any content or wording
- Add or remove information
- Rewrite sentences
- Add explanations

## Testing the New Action

Sample messy markdown:
```markdown
#My Document
* item one
* item two
  *nested

##Section
Some text here
```

Expected output:
```markdown
# My Document
- item one
- item two
  - nested

## Section
Some text here
```

## Reporting Issues

If you find drift or unexpected behavior:

1. Note the action name
2. Save the input text
3. Save the output text
4. Describe the expected vs actual behavior
5. Check if it's consistent across multiple runs

## Next Steps

1. Test all actions with the provided samples
2. Test with your own content
3. Verify the new Fix & Improve Markdown action
4. Report any drift issues for further prompt refinement
