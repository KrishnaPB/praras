/**
 * enhance_headings.js
 * Applies all H1 + H2 visual enhancements site-wide:
 *  1. H1 (.hero-h1): bigger, stronger text-shadow, gradient text accent
 *  2. H2 (.h2): accent underline via ::after pseudo-element
 *  3. Product-detail H2s (.prod-page-grid .h2): smaller, document-style with left red bar
 *  4. Responsive breakpoints updated
 *  5. Centered H2s get centered accent line
 */

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

/* ── Replacement patterns ─────────────────────────────────────────── */

// 1. Enhanced .hero-h1
const OLD_HERO_H1 = /\.hero-h1\{[\s\S]*?font-family:var\(--font-d\);font-size:[\d.]+rem;font-weight:[\d]+;[\s\S]*?text-shadow:[^}]+\}/g;
const NEW_HERO_H1 = `.hero-h1{
  font-family:var(--font-d);font-size:6rem;font-weight:800;
  line-height:.95;color:#fff;letter-spacing:-.03em;margin-bottom:1.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35), 0 20px 60px rgba(0,0,0,0.25);
}`;

// 2. Enhanced .h2 — adds position:relative, padding-bottom for ::after line
const OLD_H2_RULE = /\.h2\{font-family:var\(--font-d\);font-size:[\d.]+rem;font-weight:[\d]+;color:var\(--c-ink\);line-height:[^;]+;letter-spacing:[^;]+;margin-bottom:[^;]+;\}/g;
const NEW_H2_RULE = `.h2{font-family:var(--font-d);font-size:2.8rem;font-weight:700;color:var(--c-ink);line-height:1.15;letter-spacing:-.02em;margin-bottom:1rem;position:relative;padding-bottom:1rem;}`;

// 3. Inject .h2::after accent line + .h2.center::after + .prod-page-grid .h2 rules
//    These are injected right after the .h2 block (after .h2.light line)
const H2_AFTER_INJECTION = `
.h2::after{content:'';position:absolute;bottom:0;left:0;width:48px;height:3px;background:linear-gradient(90deg,var(--c-primary),var(--c-accent));border-radius:3px;transition:width .3s ease;}
.h2:hover::after{width:72px;}
.h2.center{text-align:center;}.h2.center::after{left:50%;transform:translateX(-50%);}
/* product-detail page h2s — smaller, document-style */
.prod-page-grid .h2{font-size:1.8rem;font-weight:700;padding-bottom:.75rem;border-bottom:2px solid var(--c-border);letter-spacing:-.01em;font-family:var(--font-ui,'Inter',sans-serif);color:var(--c-ink);}
.prod-page-grid .h2::after{display:none;}`;

// 4. Responsive .h2 override update (768px breakpoint)
const OLD_H2_RESPONSIVE_768 = /\.h2\s*\{\s*font-size\s*:\s*[\d.]+rem;\s*\}/g;
const NEW_H2_RESPONSIVE_768 = `.h2 { font-size: 2rem; }`;

// 5. Responsive .hero-h1 override (768px)  
const OLD_HERO_RESPONSIVE = /\.hero-h1\s*\{\s*font-size\s*:\s*[\d.]+rem;\s*\}/g;
const NEW_HERO_RESPONSIVE = `.hero-h1 { font-size: 3.5rem; }`;

/* ── Injection target: right after .h2.light line ─────────────────── */
const H2_LIGHT_RE = /\.h2\.light\{color:#fff\}\.h2\.light em\{color:var\(--c-accent\)\}/;

let updated = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Skip if already enhanced
  if (content.includes('.h2::after{content:')) {
    console.log(`  Already enhanced: ${file}`);
    skipped++;
    continue;
  }

  // 1. Enhance .hero-h1 (may not exist in all files)
  if (content.includes('.hero-h1{')) {
    content = content.replace(OLD_HERO_H1, NEW_HERO_H1);
  }

  // 2. Update .h2 canonical rule
  content = content.replace(OLD_H2_RULE, NEW_H2_RULE);

  // 3. Inject .h2::after and related rules after .h2.light line
  if (H2_LIGHT_RE.test(content)) {
    content = content.replace(
      H2_LIGHT_RE,
      `.h2.light{color:#fff}.h2.light em{color:var(--c-accent)}` + H2_AFTER_INJECTION
    );
  }

  // 4. Update responsive overrides (don't double-apply)
  content = content.replace(OLD_H2_RESPONSIVE_768, NEW_H2_RESPONSIVE_768);
  content = content.replace(OLD_HERO_RESPONSIVE, NEW_HERO_RESPONSIVE);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Enhanced: ${file}`);
    updated++;
  } else {
    console.log(`  No match:  ${file}`);
    skipped++;
  }
}

console.log(`\n✅ Done. ${updated} files enhanced, ${skipped} skipped.`);
