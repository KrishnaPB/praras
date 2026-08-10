/**
 * revert_h1.js
 * Reverts .hero-h1 back to the original style (5rem, weight 700, original text-shadow)
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const OLD_H1 = /\.hero-h1\{\s*font-family:var\(--font-d\);font-size:6rem;font-weight:800;\s*line-height:[^;]+;color:#fff;letter-spacing:[^;]+;margin-bottom:[^;]+;\s*text-shadow:[^}]+\}/g;

const NEW_H1 = `.hero-h1{font-family:var(--font-d);font-size:5rem;font-weight:700;line-height:1;color:#fff;letter-spacing:-.02em;margin-bottom:1.5rem;text-shadow: 0 10px 30px rgba(0,0,0,0.3);}`;

// Also revert responsive override from 3.5rem back to 3rem
const OLD_H1_RESP = /\.hero-h1\s*\{\s*font-size\s*:\s*3\.5rem;\s*\}/g;
const NEW_H1_RESP = `.hero-h1 { font-size: 3rem; }`;

let updated = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content.replace(OLD_H1, NEW_H1);
  content = content.replace(OLD_H1_RESP, NEW_H1_RESP);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Reverted H1: ${file}`);
    updated++;
  }
}

console.log(`\n✅ Done. ${updated} files reverted.`);
