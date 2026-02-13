// C:\Users\Administrator\markdown-live-preview\stresstest_full.js
const fs = require("fs");
const { jsPDF } = require("jspdf");

const doc = new jsPDF({ unit: "mm", format: "a4" });

// Title
doc.setFontSize(16);
doc.text("Edge Case Characters Stress Test", 20, 20);

// Sections
doc.setFontSize(12);

const sections = [
  {
    title: "1. Standard ASCII",
    content: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789\n!@#$%^&*()_+-=[]{}|;:',.<>/?`~"
  },
  {
    title: "2. Extended Latin / Accents",
    content: "á à â ä ã å æ ç é è ê ë í ì î ï ñ ó ò ô ö õ ø œ ú ù û ü ÿ ß"
  },
  {
    title: "3. RTL Text / Arabic / Hebrew",
    content: "مرحبا بالعالم\nשלום עולם"
  },
  {
    title: "4. Emojis & Symbols",
    content: "😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 🤯 🏳️‍🌈 ⛔ ⚡ ♻️ ♠️ ♥️ ♦️ ♣️ ☀ ☁ ☂ ☃ ☄ ★ ☆"
  },
  {
    title: "5. Zero-width & Invisible Characters",
    content: "ZWSP\u200B ZWNJ\u200C ZWJ\u200D LRM\u200E RLM\u200F BOM\uFEFF"
  },
  {
    title: "6. Surrogate Pairs & Rare Unicode",
    content: "𠀋 𠂢 𠂤 𠂦 𠂨 𠂪 𠂬 𠂮 𠂰"
  },
  {
    title: "7. Control Characters (shown as codes)",
    content: "NUL \\0, SOH \\x01, STX \\x02, ETX \\x03, EOT \\x04, BEL \\x07, BS \\x08, TAB \\t, LF \\n, CR \\r"
  },
  {
    title: "8. Large Stress Test Repeat",
    content: Array(50).fill("😀 😁 😂 🤣 𠀋 ZWSP\u200B العربية עברית ⛔ ⚡ ★ ☆").join(" ")
  }
];

let y = 30;
sections.forEach(sec => {
  doc.setFont(undefined, "bold");
  doc.text(sec.title, 20, y);
  y += 6;
  doc.setFont(undefined, "normal");

  const lines = doc.splitTextToSize(sec.content, 170);
  lines.forEach(line => {
    doc.text(line, 20, y);
    y += 6;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  y += 4;
});

// Export PDF in Node
const pdfData = doc.output("arraybuffer");
fs.writeFileSync("C:\\Users\\Administrator\\markdown-live-preview\\EdgeCase_Characters_Test.pdf", Buffer.from(pdfData));

console.log("PDF generated successfully at EdgeCase_Characters_Test.pdf");
