/**
 * align_checkmark.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updated = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update the top alignment for the checkmark
  const target = "left: 0 !important;\n  top: 0 !important;";
  const replacement = "left: 0 !important;\n  top: 0.15rem !important;";
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
  } else if (content.includes("top: 0 !important;") && content.includes("content: '✓' !important;")) {
      // In case the spacing is different
      content = content.replace(/content: '✓' !important;([^]*?)top: 0 !important;/g, "content: '✓' !important;$1top: 0.15rem !important;");
      fs.writeFileSync(filePath, content, 'utf8');
      updated++;
  }
}

console.log('\\n✅ Done. ' + updated + ' files fixed.');
