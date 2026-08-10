/**
 * add_textureaid_products.js
 */
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const targetPage = path.join(baseDir, 'extruded-fried-snacks.html');

let content = fs.readFileSync(targetPage, 'utf8');

const cardsHTML = `
<!-- TEXTUREAID 025 -->
<div class="prod-card" style="cursor: pointer; flex-direction: row; flex-wrap: wrap; align-items: stretch; padding: 0; margin-top: 2rem;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-025.html'; }">
  <div style="flex: 1 1 300px; position: relative; overflow: hidden; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--c-surface-alt); border-right: 1px solid var(--c-border); border-bottom: none;">
    <a href="product-textureaid-025.html" style="display: block; width: 100%;">
      <img src="assets/images/textureaid_025.svg" alt="TEXTUREAID® 025" style="width: 100%; max-height: 320px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    </a>
    <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
  </div>
  <div style="padding: 4rem; flex: 2 1 400px; display: flex; flex-direction: column; justify-content: center;">
    <div class="prod-cat" style="color: var(--c-primary);">Non-Baking Solution</div>
    <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-025.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> 025</a></h3>
    <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">Dough conditioner which aids in reducing cracks and breakages in extruded food products like vermicelli, pasta, and noodles.</p>
    <ul class="feat-list" style="margin-bottom: 2.5rem;">
      <li><strong>Where product is used:</strong> Pasta &amp; Noodles</li>
      <li><strong>Nature:</strong> Psyllum husk based</li>
      <li><strong>Benefits:</strong> Conditions dough to prevent cracks and breakages, delivering pasta with greater hardness, springiness, and lasting quality.</li>
      <li><strong>Dosage:</strong> 0.1 - 0.3% w/w of total flour</li>
    </ul>
    <div style="margin-top: auto;">
      <button class="btn-quote" data-product="TEXTUREAID® 025" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
        Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </div>
  </div>
</div>

<!-- TEXTUREAID M -->
<div class="prod-card" style="cursor: pointer; flex-direction: row; flex-wrap: wrap; align-items: stretch; padding: 0; margin-top: 2rem;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-m.html'; }">
  <div style="flex: 1 1 300px; position: relative; overflow: hidden; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--c-surface-alt); border-right: 1px solid var(--c-border); border-bottom: none;">
    <a href="product-textureaid-m.html" style="display: block; width: 100%;">
      <img src="assets/images/textureaid_m.svg" alt="TEXTUREAID® M" style="width: 100%; max-height: 320px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    </a>
    <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
  </div>
  <div style="padding: 4rem; flex: 2 1 400px; display: flex; flex-direction: column; justify-content: center;">
    <div class="prod-cat" style="color: var(--c-primary);">Non-Baking Solution</div>
    <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-m.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> M</a></h3>
    <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">SVP based meat texturizer which aids in improved water holding capacity in restructured meat products.</p>
    <ul class="feat-list" style="margin-bottom: 2.5rem;">
      <li><strong>Where product is used:</strong> Meat</li>
      <li><strong>Nature:</strong> Soya vegetable protein based</li>
      <li><strong>Benefits:</strong> Optimizes restructured meat by improving water retention, reducing meat usage, and offering significant cost savings.</li>
      <li><strong>Dosage:</strong> 0.5% of total product formulation</li>
    </ul>
    <div style="margin-top: auto;">
      <button class="btn-quote" data-product="TEXTUREAID® M" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
        Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </div>
  </div>
</div>

<!-- TEXTUREAID MSK -->
<div class="prod-card" style="cursor: pointer; flex-direction: row; flex-wrap: wrap; align-items: stretch; padding: 0; margin-top: 2rem;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-msk.html'; }">
  <div style="flex: 1 1 300px; position: relative; overflow: hidden; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--c-surface-alt); border-right: 1px solid var(--c-border); border-bottom: none;">
    <a href="product-textureaid-msk.html" style="display: block; width: 100%;">
      <img src="assets/images/textureaid_msk.svg" alt="TEXTUREAID® MSK" style="width: 100%; max-height: 320px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    </a>
    <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
  </div>
  <div style="padding: 4rem; flex: 2 1 400px; display: flex; flex-direction: column; justify-content: center;">
    <div class="prod-cat" style="color: var(--c-primary);">Non-Baking Solution</div>
    <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-msk.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> MSK</a></h3>
    <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">Hydrocolloid and SVP based meat texturiser which aids in improved water holding capacity in ground meat products like sheek kebab and sausages.</p>
    <ul class="feat-list" style="margin-bottom: 2.5rem;">
      <li><strong>Where product is used:</strong> Meat</li>
      <li><strong>Nature:</strong> Soya vegetable protein based</li>
      <li><strong>Benefits:</strong> Perfect for sheek kebab and sausages. Allows up to 16% reduction of meat and 100% replacement of minced chicken with MDM in sausages.</li>
      <li><strong>Dosage:</strong> 1% of total product formulation</li>
    </ul>
    <div style="margin-top: auto;">
      <button class="btn-quote" data-product="TEXTUREAID® MSK" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
        Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </div>
  </div>
</div>
`;

if (!content.includes('TEXTUREAID® 025')) {
  // Find the end of the CLF card
  const replaceTarget = '</div></div>\n\n    </div>\n  </section>';
  if (content.includes(replaceTarget)) {
    content = content.replace(replaceTarget, '</div></div>\n' + cardsHTML + '\n    </div>\n  </section>');
    fs.writeFileSync(targetPage, content, 'utf8');
    console.log("Added 3 cards to extruded-fried-snacks.html");
  } else {
    // try another matching pattern
    const fallbackTarget = '</div></div>\\r\\n\\r\\n    </div>\\r\\n  </section>';
    if (content.includes(fallbackTarget)) {
      content = content.replace(fallbackTarget, '</div></div>\\r\\n' + cardsHTML + '\\r\\n    </div>\\r\\n  </section>');
      fs.writeFileSync(targetPage, content, 'utf8');
      console.log("Added 3 cards to extruded-fried-snacks.html");
    } else {
      console.log("Could not find insertion point in extruded-fried-snacks.html");
    }
  }
} else {
  console.log("Cards already exist in extruded-fried-snacks.html");
}

// Update SEO tags in the 3 pages
function updateSEO(filePath, title, description) {
  if (!fs.existsSync(filePath)) return;
  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Safe RegExp replacements for title and description
  fileContent = fileContent.replace(new RegExp('<title>[\\\\s\\\\S]*?<\\/title>'), '<title>' + title + ' | Praras Biosciences</title>');
  
  fileContent = fileContent.replace(new RegExp('<meta name="description" content="[^"]*">'), '<meta name="description" content="' + description + '">');
  
  fileContent = fileContent.replace(new RegExp('<meta property="og:title" content="[^"]*">'), '<meta property="og:title" content="' + title + ' | Praras Biosciences">');
  fileContent = fileContent.replace(new RegExp('<meta property="og:description" content="[^"]*">'), '<meta property="og:description" content="' + description + '">');
  
  fileContent = fileContent.replace(new RegExp('<meta name="twitter:title" content="[^"]*">'), '<meta name="twitter:title" content="' + title + ' | Praras Biosciences">');
  fileContent = fileContent.replace(new RegExp('<meta name="twitter:description" content="[^"]*">'), '<meta name="twitter:description" content="' + description + '">');
  
  fileContent = fileContent.replace(/"name": "Precision Food Additives[^"]*"/, '"name": "' + title + '"');
  fileContent = fileContent.replace(/"description": "Praras Biosciences provides[^"]*"/, '"description": "' + description + '"');
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log("Updated SEO for: " + path.basename(filePath));
}

updateSEO(
  path.join(baseDir, 'product-textureaid-025.html'),
  'TEXTUREAID® 025 - Dough Conditioner for Extruded Foods',
  'TEXTUREAID® 025 is a dough conditioner that aids in reducing cracks and breakages in extruded food products like vermicelli, pasta, and noodles without affecting overall quality.'
);

updateSEO(
  path.join(baseDir, 'product-textureaid-m.html'),
  'TEXTUREAID® M - Meat Texturizer for Restructured Meat',
  'TEXTUREAID® M is an SVP based meat texturizer which aids in improved water holding capacity in restructured meat products, allowing reduction of meat content without affecting quality.'
);

updateSEO(
  path.join(baseDir, 'product-textureaid-msk.html'),
  'TEXTUREAID® MSK - Meat Texturiser for Ground Meat Products',
  'TEXTUREAID® MSK is a Hydrocolloid and SVP based meat texturiser which improves water holding capacity in ground meat products like sheek kebab and sausages.'
);
