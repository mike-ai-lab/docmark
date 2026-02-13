# Broken Link Fix Test

## Test Case from User

### Input
```
* Note: Project **starts *today** and [Link
```

### Expected Output
```
* Note: Project **starts *today** and [Link](URL_FIX!)
```

### What Should Happen
1. The validator should detect incomplete link `[Link` at the end
2. The fix should ONLY modify the `[Link` part, adding `](URL_FIX!)`
3. The rest of the line should remain unchanged
4. The nested emphasis `**starts *today**` should NOT be flagged as an error (it's valid markdown)

## Fix Applied

### Validation Improvement
- Changed broken link detection to use `lastIndexOf('[')` to find the actual broken link
- Only flags as broken if there's a `(` after the `[` (indicating intent to create a link)
- Uses marker.startColumn to identify the exact position

### Fix Generation Improvement
- Uses `lastIndexOf('[')` to find the broken link position
- Splits line into "before" and "broken link part"
- Only replaces the broken link part, preserving everything before it
- Three patterns handled:
  1. `[text](` - missing closing `)`
  2. `[text(` - missing `]` and `)`
  3. `[text` - missing `]()` entirely

### Debug Logging
Added console.log statements to trace:
- Original line
- Marker startColumn
- Before broken link part
- Broken link part
- Which pattern matched
- Final fix

## Additional Test Cases

### Test 1: Simple incomplete link
```
Input:  This is a [link
Output: This is a [link](URL_FIX!)
```

### Test 2: Link with parenthesis but no closing
```
Input:  Check [this link](
Output: Check [this link](URL_FIX!)
```

### Test 3: Link with text and opening paren
```
Input:  See [documentation](http
Output: See [documentation](URL_FIX!)
```

### Test 4: Multiple links, last one broken
```
Input:  [Good link](url) and [broken
Output: [Good link](url) and [broken](URL_FIX!)
```

### Test 5: Complex line with emphasis and broken link
```
Input:  **Bold** and *italic* with [link
Output: **Bold** and *italic* with [link](URL_FIX!)
```
