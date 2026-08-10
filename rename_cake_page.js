const fs = require('fs');
const path = require('path');

const cakePath = path.join(__dirname, 'preccel-93.html');
let content = fs.readFileSync(cakePath, 'utf8');

// 1. Rename page titles
content = content.replace(/<title>.*?<\/title>/, '<title>PRECCEL 93 | Premium Baking Solutions</title>');
content = content.replace('<h1 class="hero-h1">Cake</h1>', '<h1 class="hero-h1">PRECCEL 93</h1>');
content = content.replace('data-product="Cake"', 'data-product="PRECCEL 93"');

// 2. Remove links from the product card
// Remove onclick from prod-card and change cursor
content = content.replace(
  /<div class="prod-card" style="cursor: pointer;([^>]*?)" onclick="[^"]*?"/,
  '<div class="prod-card" style="$1"'
);

// Remove <a> tag wrapping the image
content = content.replace(
  /<a href="product-preccel-93\.html"[^>]*>\s*(<img[^>]*>)\s*<\/a>/,
  '$1'
);

// Replace the <a> tag inside the <h3> with plain text
content = content.replace(
  /<h3 class="prod-h"([^>]*)><a href="product-preccel-93\.html"[^>]*>PRECCEL 93<\/a><\/h3>/,
  '<h3 class="prod-h"$1>PRECCEL 93</h3>'
);

fs.writeFileSync(cakePath, content, 'utf8');
console.log("Successfully updated cake.html");
