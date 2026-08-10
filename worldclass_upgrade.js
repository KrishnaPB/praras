/**
 * worldclass_upgrade.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const CSS_INJECTION = `
/* ── WORLD-CLASS UPGRADES ── */
:root {
  --c-muted: #4a4a4a; 
}
.product-grid > div:first-child {
  position: sticky !important;
  top: 100px !important;
  align-self: flex-start; 
}
.bento-grid > div {
  background: var(--c-primary-bg) !important;
  border: 1px solid rgba(154, 29, 30, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease !important;
}
.bento-grid > div:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(154, 29, 30, 0.08) !important;
}
.feat-list {
  list-style: none !important;
  padding-left: 0 !important;
}
.feat-list li {
  position: relative !important;
  padding-left: 1.75rem !important;
  margin-bottom: 1.25rem !important;
  color: #333 !important;
  line-height: 1.7 !important;
  list-style: none !important;
}
.feat-list li::before {
  content: '✓' !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  color: var(--c-primary) !important;
  font-weight: 800 !important;
  font-size: 1.1rem !important;
}
.product-grid p {
  color: #333 !important;
  line-height: 1.7 !important;
}
/* ────────────────────────── */
`;

let updated = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already applied
  if (content.includes('/* ── WORLD-CLASS UPGRADES ── */')) {
    continue;
  }

  // Find the last </style> tag in the head to inject this.
  const styleEndIdx = content.lastIndexOf('</style>');
  
  if (styleEndIdx !== -1) {
    content = content.substring(0, styleEndIdx) + CSS_INJECTION + '\n' + content.substring(styleEndIdx);
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log("Updated: " + file);
  }
}

console.log('\\n✅ Done. ' + updated + ' files upgraded.');
