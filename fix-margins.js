const fs = require('fs');

let content = fs.readFileSync('src/main.js', 'utf8');

// Find and replace the safety margins block (lines 8577-8594)
const oldCode = `        // SAFETY MARGINS: Minimum margins to prevent content from touching edges or overlapping headers/footers
        const SAFETY_TOP = 8; // mm - space for document title
        const SAFETY_BOTTOM = 8; // mm - space for page number (MUST match SAFETY_TOP)
        const SAFETY_SIDES = 5; // mm - space from page edges
        
        // Apply safety margins (hidden from user, added to their configured margins)
        const safeTopMargin = Math.max(settings.margins.top, SAFETY_TOP);
        const safeBottomMargin = Math.max(settings.margins.bottom, SAFETY_BOTTOM);
        const safeLeftMargin = Math.max(settings.margins.left, SAFETY_SIDES);
        const safeRightMargin = Math.max(settings.margins.right, SAFETY_SIDES);
        
        // User margins (for display purposes - what they see)
        const actualTopMargin = safeTopMargin * PX_SCALE;
        const actualBottomMargin = safeBottomMargin * PX_SCALE;
        const actualLeftMargin = safeLeftMargin * PX_SCALE;
        const actualRightMargin = safeRightMargin * PX_SCALE;
        
        console.log(\`[Pagination] User margins: top=\${settings.margins.top}mm, bottom=\${settings.margins.bottom}mm, left=\${settings.margins.left}mm, right=\${settings.margins.right}mm\`);
        console.log(\`[Pagination] Safe margins: top=\${safeTopMargin}mm, bottom=\${safeBottomMargin}mm, left=\${safeLeftMargin}mm, right=\${safeRightMargin}mm\`);`;

const newCode = `        // Use user's actual margins (no safety margins in preview - only in PDF export)
        const actualTopMargin = settings.margins.top * PX_SCALE;
        const actualBottomMargin = settings.margins.bottom * PX_SCALE;
        const actualLeftMargin = settings.margins.left * PX_SCALE;
        const actualRightMargin = settings.margins.right * PX_SCALE;
        
        console.log(\`[Pagination] User margins: top=\${settings.margins.top}mm, bottom=\${settings.margins.bottom}mm, left=\${settings.margins.left}mm, right=\${settings.margins.right}mm\`);`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('src/main.js', content, 'utf8');
console.log('✅ Fixed preview margins!');
