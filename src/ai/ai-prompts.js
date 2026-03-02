// AI Prompts - Deterministic prompt templates for editor actions
// IMPORTANT: All prompts follow DocMark editor's Markdown syntax rules

export const PROMPTS = {
  improve: (text) => `
Rewrite this text to be clearer and more professional.
Fix grammar and improve word choice.
DO NOT add headers, titles, or new structure.
DO NOT add content that wasn't there.
Keep the exact same format (plain text stays plain, lists stay lists).
Return ONLY the improved text.

TEXT:
${text}
`.trim(),

  grammar: (text) => `
Fix ONLY grammar, spelling, and punctuation errors.
DO NOT change the format or structure.
DO NOT add lists, headers, or formatting.
Keep the exact same layout as the original.
Return ONLY the corrected text.

TEXT:
${text}
`.trim(),

  expand: (text) => `
Expand the text below by adding 2-3 more sentences with relevant details.
Add clarity and context but keep it concise.
Do NOT write an essay or add multiple sections.
Return only the expanded text with no explanations.

RULES:
- Use dash (-) for lists, never asterisk (*)
- Add space after # in headings
- Expand to about 2x the original length (not 10x)
- Keep the same tone and style

TEXT:
${text}
`.trim(),

  summarize: (text) => `
Create a concise summary of this text.
Keep all key ideas and important facts.
DO NOT add headers or titles.
Return ONLY the summary as plain text or simple list.

TEXT:
${text}
`.trim(),

  fixCode: (text) => `
Review the code below and fix any bugs, errors, or issues.
Improve code quality, readability, and best practices.
Return only the corrected code. No explanations, no markdown formatting, no code block syntax.
Preserve the original programming language and structure.
Do NOT add comments unless fixing existing ones.

CRITICAL RULES:
- Fix syntax errors, logic bugs, and runtime issues
- Correct common mistakes (off-by-one errors, null checks, etc.)
- Use modern syntax for the language
- Ensure proper error handling
- Return ONLY the code, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add explanatory text before or after

CODE:
${text}
`.trim(),

  improveCode: (text) => `
Optimize and improve the code below for:
- Performance and efficiency
- Readability and clarity
- Best practices and modern patterns
- Maintainability

Return only the improved code. No explanations, no markdown formatting, no code block syntax.
Preserve the original programming language and functionality.
Do NOT add comments unless improving existing ones.

CRITICAL RULES:
- Use modern language features and syntax
- Apply design patterns where appropriate
- Optimize algorithms and data structures
- Ensure consistent naming and formatting
- Return ONLY the code, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add explanatory text before or after

CODE:
${text}
`.trim(),

  documentCode: (text) => `
Add comprehensive comments and documentation to the code below.
Include function descriptions, parameter explanations, and usage examples where appropriate.
Return only the documented code. No explanations, no markdown formatting, no code block syntax.
Preserve the original programming language and structure.

CRITICAL RULES:
- Add JSDoc/docstring style comments for functions and classes
- Explain complex logic with inline comments
- Document parameters, return values, and exceptions
- Add usage examples in comments where helpful
- Use the documentation style standard for the language
- Return ONLY the code with comments, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add explanatory text before or after

CODE:
${text}
`.trim(),

  generate: (prompt) => `
${prompt}

RULES:
- Use dash (-) for lists, never asterisk (*)
- Add space after # in headings
- Use actual formatting, not syntax examples (write "bold text" not "**bold text**")
- Output clean markdown only
`.trim(),

  fixMarkdown: (text) => `
Fix markdown formatting issues in the text below.
Do NOT change any content, wording, or heading levels.
Only fix syntax and spacing.

FIXES TO MAKE:
- Change * to - for list items
- Add space after # in headings (keep the same number of #)
- Fix indentation (2 spaces per nested level)
- Remove trailing spaces
- Ensure blank line between sections

DO NOT:
- Change heading levels (# stays #, ## stays ##)
- Change any words or content
- Add or remove information

MARKDOWN:
${text}
`.trim(),
};

export function getPrompt(action, text) {
  const builder = PROMPTS[action];
  if (!builder) {
    throw new Error('Unsupported AI action: ' + action);
  }
  return builder(text);
}
