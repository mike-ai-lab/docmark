# Markdown Fix Engine – Inconsistent Behavior Report

## Original Input

```markdown
### 42. Professional Protocol Check
- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

### 43. List-Table Conflict
1. This is a list item
| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
```

---

## Output – Apply All Fixes

```markdown
### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

### 43. List-Table Conflict

1. This is a list item
| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
```

---

## Output – Apply Individually

```markdown
### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

1. This is a list item
1. This is a list item
| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
```

---

## Observed Problems

1. **Apply Individually duplicates the list item**
   `1. This is a list item` appears twice.

2. **Apply All does not resolve List–Table separation**
   A blank line should exist between the list and the table for CommonMark compliance.

3. The console shows only:

   * “Missing blank line after heading”
   * No detection of list–table structural conflict.

---

## Request


1. Fix the duplication bug in individual mode.
2. Ensure Apply All and Apply Individually produce identical structural results.
3. Add detection for list–table conflicts and insert required blank lines.
4. Guarantee idempotency (running fixes twice should not change output).

Return a corrected final Markdown output for the original input that is fully CommonMark-compliant and stable across multiple passes.
