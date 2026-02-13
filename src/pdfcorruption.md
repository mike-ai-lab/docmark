Ah! Now it’s clear—we’re diagnosing the **root cause of garbled characters in jsPDF**, not generating a stress test.

Here’s what’s happening:

---

### 1. **jsPDF default fonts are limited**

* Default fonts (`Helvetica`, `Times`, `Courier`) use **WinAnsiEncoding (Windows-1252)**.
* WinAnsiEncoding covers **ASCII (32–126) plus Latin-1 (codes 160–255)**.
* Anything **outside this range** cannot be represented directly, so jsPDF **maps it to garbage or placeholder sequences**.

---

### 2. **Characters that commonly break jsPDF**

| Character Type                      | Examples            | Why it breaks                                                           |
| ----------------------------------- | ------------------- | ----------------------------------------------------------------------- |
| Multiplication sign                 | `×`                 | Code 0xD7 in Unicode, not in WinAnsiEncoding → jsPDF maps to `&` or `þ` |
| Non-breaking space                  | ` `                 | Code 0xA0, sometimes OK, sometimes garbled depending on jsPDF version   |
| En-dash / Em-dash                   | `–`, `—`            | Unicode 0x2013, 0x2014 → outside WinAnsi, shows as `?` or `–` fallback  |
| Smart quotes                        | `“ ” ‘ ’`           | Unicode 0x201C–0x201D → replaced with garbled characters                |
| Superscripts / subscripts           | `² ³`               | 0x00B2, 0x00B3 → may survive or garble                                  |
| Accented characters outside Latin-1 | `ą ć ź`             | Codepoints > 255 → garbled                                              |
| RTL / Arabic / Hebrew               | `مرحبا`             | Not in WinAnsi → shows as garbage                                       |
| Emoji / surrogate pairs             | `😀`                | 4-byte Unicode → cannot map → garbled                                   |
| HTML entities                       | `&times; &lt; &gt;` | If decoded as literal `×`, still outside WinAnsi → garbled              |

---

### 3. **Why `×` specifically turns into weird sequences**

* `×` (U+00D7) is **outside the safe ASCII range** but within Latin-1.
* Depending on **font encoding in jsPDF**, it can get mapped incorrectly to:

```
& &2&4&0&0 /&m&m /&xr&8&&0&0d&&&&d&&#c
```

* This is **jsPDF’s internal PDF text mapping** trying to represent a character it **can’t encode in the font**.

---

### 4. **The real solution for your app**

1. **Use a Unicode font (TTF/OTF)** in jsPDF.

   * e.g., `NotoSans-Regular.ttf`, `DejaVuSans.ttf`, `ArialUnicode.ttf`.
   * Allows rendering `×`, `–`, Arabic, emojis, and any HTML-decoded entity.

2. **Decode HTML entities** before sending text to jsPDF:

```js
function decodeEntities(encodedString) {
  const txt = document.createElement("textarea");
  txt.innerHTML = encodedString;
  return txt.value;
}
```

* `&times;` → `×`, `&lt;` → `<`.

3. **Always embed a TTF font** for content that may contain **non-WinAnsi characters**:

```js
doc.addFileToVFS("NotoSans.ttf", base64Font);
doc.addFont("NotoSans.ttf", "NotoSans", "normal");
doc.setFont("NotoSans");
```

* After this, `×`, `±`, `–`, Arabic, emojis **render correctly**.

4. **Fallback (optional)**: for content that cannot embed a font, **strip unsupported characters** or replace them with ASCII equivalents (`×` → `x`, smart quotes → `'`). But this loses fidelity.

---

### ✅ Summary

* **Garbled text happens whenever the character is outside WinAnsiEncoding**.
* `×`, HTML-decoded symbols, smart quotes, emojis, surrogate pairs, RTL scripts → all cause mapping errors.
* **Fix is embedding a Unicode-capable TTF font in jsPDF and decoding HTML entities**.
* Standard jsPDF fonts **cannot handle full Unicode**, which is why you see sequences like `& &2&4&0&0…`.

---

If you want, I can **write a small patch for your app** that:

1. Decodes HTML entities from the user content.
2. Automatically switches jsPDF to a Unicode font if content contains any non-WinAnsi characters.

This will **fix all your `×` and other garbled text issues** in the exported PDFs.

Do you want me to do that next?
