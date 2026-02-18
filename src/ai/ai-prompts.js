// AI Prompts - Deterministic prompt templates for editor actions
// IMPORTANT: All prompts follow DocMark editor's Markdown syntax rules

export const PROMPTS = {
  improve: (text) => `
Rewrite the text below to be clearer, more professional, and better structured.
Preserve the original meaning and tone.
Return only the rewritten text. No explanations.

MARKDOWN RULES:
- Use dash (-) for unordered lists, never asterisk (*) or plus (+)
- Add space after # in headings
- Do NOT wrap HTML code in code blocks
- If generating HTML, output it directly without code block syntax

TEXT:
${text}
`.trim(),

  grammar: (text) => `
Correct grammar, spelling, punctuation, and syntax errors in the text below.
Preserve wording, meaning, and style.
Return only the corrected text. No explanations.

MARKDOWN RULES:
- Use dash (-) for unordered lists, never asterisk (*) or plus (+)
- Add space after # in headings

TEXT:
${text}
`.trim(),

  expand: (text) => `
Expand the text below with additional clarity, context, and detail.
Do not change the intent or tone.
Return only the expanded text. No explanations.

MARKDOWN RULES:
- Use dash (-) for unordered lists, never asterisk (*) or plus (+)
- Add space after # in headings

TEXT:
${text}
`.trim(),

  summarize: (text) => `
Produce a concise summary of the text below.
Retain key ideas and essential information.
Return only the summary. No explanations.

MARKDOWN RULES:
- Use dash (-) for unordered lists, never asterisk (*) or plus (+)
- Add space after # in headings

TEXT:
${text}
`.trim(),

  fixCode: (text) => `
Review the code below and fix any bugs, errors, or issues.
Improve code quality, readability, and best practices.
Return only the corrected code. No explanations or markdown formatting.
Preserve the original programming language and structure.

CODE:
${text}
`.trim(),

  improveCode: (text) => `
Optimize and improve the code below for:
- Performance
- Readability
- Best practices
- Maintainability

Return only the improved code. No explanations or markdown formatting.
Preserve the original programming language and structure.

CODE:
${text}
`.trim(),

  documentCode: (text) => `
Add comprehensive comments and documentation to the code below.
Include function descriptions, parameter explanations, and usage examples where appropriate.
Return only the documented code. No explanations or markdown formatting.
Preserve the original programming language and structure.

CODE:
${text}
`.trim(),

  generate: (prompt) => `
Generate markdown content strictly based on the request below.
Output valid markdown only. No explanations.

CRITICAL MARKDOWN RULES:
- Use dash (-) for unordered lists, NEVER asterisk (*) or plus (+)
- Add space after # in headings (e.g., "# Heading" not "#Heading")
- If generating HTML code, output it DIRECTLY without wrapping in code blocks
- Do NOT use code block syntax for HTML content
- HTML should be rendered, not displayed as code
- For code examples in other languages (JavaScript, Python, etc.), use code blocks normally

REQUEST:
${prompt}
`.trim(),
};

export function getPrompt(action, text) {
  const builder = PROMPTS[action];
  if (!builder) {
    throw new Error('Unsupported AI action: ' + action);
  }
  return builder(text);
}
