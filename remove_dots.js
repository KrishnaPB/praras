/**
 * remove_dots.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updated = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the string to replace
  const target = "content: '✓' !important;";
  const replacement = "content: '✓' !important; background: transparent !important; width: auto !important; height: auto !important; border-radius: 0 !important; margin-top: 0 !important;";
  
  if (content.includes(target) && !content.includes(replacement)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
  }
}

console.log('\\n✅ Done. ' + updated + ' files fixed.');
