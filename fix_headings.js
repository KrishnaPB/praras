/**
 * fix_headings.js
 * Uniformly updates h1/h2 heading CSS and removes inline overrides across all HTML files.
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Get all top-level HTML files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// The canonical .h2 and .h1 CSS block to enforce
const H2_CANONICAL = `.h2{font-family:var(--font-d);font-size:2.8rem;font-weight:700;color:var(--c-ink);line-height:1.15;letter-spacing:-.02em;margin-bottom:1rem;}`;
const H2_RESPONSIVE = `  .h2 { font-size: 2rem; }`;

// Regex to replace inline style on section-level h2 tags like:
// <h2 class="h2" style="margin-bottom: 2rem; font-size: 2rem; color: var(--c-ink); border-bottom: 2px solid var(--c-border); padding-bottom: 1rem;">
// We want to keep ONLY class="h2" and remove conflicting inline styles
const INLINE_H2_RE = /<h2\s+class="h2"\s+style="[^"]*">/g;

let totalFiles = 0;
let totalChanges = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Normalise the .h2 CSS rule (the one-liner definition)
  // Match old compact form
  const oldH2Re = /\.h2\{[^}]+\}/g;
  if (oldH2Re.test(content)) {
    content = content.replace(/\.h2\{[^}]+\}/g, H2_CANONICAL);
    changed = true;
  }

  // 2. Normalise responsive .h2 override inside @media queries
  // e.g.   .h2 { font-size: 2.2rem; }  or  .h2 { font-size: 1.8rem; }
  content = content.replace(/\.h2\s*\{\s*font-size\s*:\s*[^;]+;\s*\}/g, H2_RESPONSIVE);

  // 3. Remove inline style overrides on <h2 class="h2" style="...">
  // These often set font-size:2rem; color; border-bottom etc that conflict with the class
  content = content.replace(
    /<h2\s+class="h2"\s+style="[^"]*">/g,
    '<h2 class="h2">'
  );

  // 4. Also handle <h2 class="h2" style="margin-bottom: 2rem;"> (just margin override)
  // Already handled above

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${file}`);
    totalChanges++;
  } else if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${file}`);
    totalChanges++;
  } else {
    console.log(`  Skipped: ${file} (no changes needed)`);
  }
  totalFiles++;
}

console.log(`\nDone. ${totalChanges}/${totalFiles} files updated.`);
