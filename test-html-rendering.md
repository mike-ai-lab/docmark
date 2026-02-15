# HTML Rendering Test

This document tests full HTML rendering compatibility in DocMark.

## Test 1: Basic HTML Elements

<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
  <h3 style="color: #1e40af; margin-top: 0;">Custom HTML Block</h3>
  <p style="color: #475569;">This is a custom HTML block with inline styles. It should render fully without being escaped or broken.</p>
  <ul style="color: #64748b;">
    <li>HTML lists work</li>
    <li>With proper styling</li>
    <li>And nested elements</li>
  </ul>
</div>

## Test 2: Mixed Markdown and HTML

You can mix **markdown** with <span style="color: #ef4444; font-weight: bold;">HTML elements</span> seamlessly.

<details>
  <summary style="cursor: pointer; font-weight: 600; color: #2563eb;">Click to expand</summary>
  <div style="padding: 10px; margin-top: 10px; background: #f8fafc; border-radius: 4px;">
    This content is inside a details/summary HTML element!
  </div>
</details>

## Test 3: Complex HTML Structure

<section style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
  <article style="background: #fef3c7; padding: 15px; border-radius: 8px;">
    <h4 style="color: #92400e; margin-top: 0;">Card 1</h4>
    <p style="color: #78350f;">This is a card layout using CSS Grid.</p>
  </article>
  <article style="background: #dbeafe; padding: 15px; border-radius: 8px;">
    <h4 style="color: #1e3a8a; margin-top: 0;">Card 2</h4>
    <p style="color: #1e40af;">HTML rendering is fully supported!</p>
  </article>
</section>

## Test 4: HTML Table

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background: #f1f5f9;">
      <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Feature</th>
      <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">HTML Rendering</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 600;">✓ Enabled</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Security Sanitization</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 600;">✓ Active</td>
    </tr>
  </tbody>
</table>

## Test 5: Paste HTML Content

Try pasting HTML content from a webpage:
1. Copy HTML content from any website
2. Paste it into the editor (Ctrl+V or Cmd+V)
3. Choose "Keep as HTML" in the dialog
4. The HTML should render fully in the preview!

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;">
  <h2 style="margin: 0 0 10px 0;">🎉 HTML Rendering Complete!</h2>
  <p style="margin: 0; opacity: 0.9;">DocMark now supports full HTML rendering with security sanitization.</p>
</div>
