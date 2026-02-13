// Test the actual characters in the user's text
const testText = "Glazed Door EXT ‑ C 1: Double leaf, 2400 mm × 3400 mm, non‑fire rated, 35 dB acoustic";
const testText2 = "Wooden Solid Door EXT‑H1: Double leaf, 2200 mm × 4000 mm";
const testText3 = "Fixed Glass Window W‑02: 300 mm × 1800 mm";

console.log("Original texts:");
console.log(testText);
console.log(testText2);
console.log(testText3);

console.log("\nCharacter codes:");
for (let i = 0; i < testText.length; i++) {
    const char = testText[i];
    const code = char.charCodeAt(0);
    if (code > 127) {
        console.log(`Position ${i}: '${char}' = U+${code.toString(16).toUpperCase().padStart(4, '0')} (${code})`);
    }
}

// Test the NEW sanitization function
const sanitizeForPdf = (text) => {
    if (!text) return '';
    
    // First, ensure we're working with a proper string
    text = String(text);
    
    // Map of Unicode characters to ASCII equivalents
    const charMap = {
        '≈': '~',
        '→': '->',
        '←': '<-',
        '↔': '<->',
        '²': '2',
        '³': '3',
        '×': 'x',
        '÷': '/',
        'Ø': 'O',
        'ø': 'o',
        '°': ' deg',
        '±': '+/-',
        '–': '-',
        '—': '--',
        '‑': '-',
        '\u2010': '-',
        '\u2011': '-',
        '\u2012': '-',
        '\u2013': '-',
        '\u2014': '--',
        '\u2015': '--',
        '\u2018': "'",
        '\u2019': "'",
        '\u201C': '"',
        '\u201D': '"',
        '\u201A': ',',
        '\u201E': ',,',
        '…': '...',
        '•': '*',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        'ط': 'm.l',
        'م': 'm',
        '\u00A0': ' ',
        '\u2000': ' ',
        '\u2001': ' ',
        '\u2002': ' ',
        '\u2003': ' ',
        '\u2004': ' ',
        '\u2005': ' ',
        '\u2006': ' ',
        '\u2007': ' ',
        '\u2008': ' ',
        '\u2009': ' ',
        '\u200A': ' ',
    };
    
    let result = text;
    
    // Replace Unicode characters with ASCII equivalents
    for (const [unicode, ascii] of Object.entries(charMap)) {
        result = result.split(unicode).join(ascii);
    }
    
    // Remove control characters only
    result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    
    return result;
};

console.log("\nAfter NEW sanitization:");
console.log(sanitizeForPdf(testText));
console.log(sanitizeForPdf(testText2));
console.log(sanitizeForPdf(testText3));

console.log("\nExpected:");
console.log("Glazed Door EXT - C 1: Double leaf, 2400 mm x 3400 mm, non-fire rated, 35 dB acoustic");
console.log("Wooden Solid Door EXT-H1: Double leaf, 2200 mm x 4000 mm");
console.log("Fixed Glass Window W-02: 300 mm x 1800 mm");
