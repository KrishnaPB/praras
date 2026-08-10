/**
 * two_col_snacks.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'extruded-fried-snacks.html');
let content = fs.readFileSync(filePath, 'utf8');

const newGridHTML = `
      <div class="prod-grid" style="grid-template-columns: repeat(2, 1fr); gap: 2.5rem;">
        
        <!-- TEXTUREAID CLF -->
        <div class="prod-card" style="cursor: pointer; padding: 0; display: flex; flex-direction: column;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-clf.html'; }">
          <div style="position: relative; overflow: hidden; background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px;">
            <a href="product-textureaid-clf.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_clf.svg" alt="TEXTUREAID® CLF" style="width: 100%; max-height: 200px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.7rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div class="prod-cat" style="color: var(--c-primary); font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 700;">Non-Baking Solution</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2rem; margin-bottom: 1rem;"><a href="product-textureaid-clf.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> CLF</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1rem;">Dough conditioner that reduces oil uptake in fried snacks, while enhancing crispiness, strength, and overall product quality.</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem; font-size: 0.95rem;">
              <li><strong>Where product is used:</strong> Extruded Fried Snacks</li>
              <li><strong>Nature:</strong> Milk protein &amp; Arabino xylan based</li>
              <li><strong>Dosage:</strong> 0.25-0.50 % of total flour</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® CLF" style="background: var(--c-primary); color: #fff; padding: 0.8rem 1.5rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; border: none; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- TEXTUREAID 025 -->
        <div class="prod-card" style="cursor: pointer; padding: 0; display: flex; flex-direction: column;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-025.html'; }">
          <div style="position: relative; overflow: hidden; background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px;">
            <a href="product-textureaid-025.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_025.svg" alt="TEXTUREAID® 025" style="width: 100%; max-height: 200px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.7rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div class="prod-cat" style="color: var(--c-primary); font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 700;">Non-Baking Solution</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2rem; margin-bottom: 1rem;"><a href="product-textureaid-025.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> 025</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1rem;">Dough conditioner which aids in reducing cracks and breakages in extruded food products like vermicelli, pasta, and noodles.</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem; font-size: 0.95rem;">
              <li><strong>Where product is used:</strong> Pasta &amp; Noodles</li>
              <li><strong>Nature:</strong> Psyllum husk based</li>
              <li><strong>Dosage:</strong> 0.1 - 0.3% w/w of total flour</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® 025" style="background: var(--c-primary); color: #fff; padding: 0.8rem 1.5rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; border: none; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- TEXTUREAID M -->
        <div class="prod-card" style="cursor: pointer; padding: 0; display: flex; flex-direction: column;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-m.html'; }">
          <div style="position: relative; overflow: hidden; background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px;">
            <a href="product-textureaid-m.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_m.svg" alt="TEXTUREAID® M" style="width: 100%; max-height: 200px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.7rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div class="prod-cat" style="color: var(--c-primary); font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 700;">Non-Baking Solution</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2rem; margin-bottom: 1rem;"><a href="product-textureaid-m.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> M</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1rem;">SVP based meat texturizer which aids in improved water holding capacity in restructured meat products.</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem; font-size: 0.95rem;">
              <li><strong>Where product is used:</strong> Meat</li>
              <li><strong>Nature:</strong> Soya vegetable protein based</li>
              <li><strong>Dosage:</strong> 0.5% of total product formulation</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® M" style="background: var(--c-primary); color: #fff; padding: 0.8rem 1.5rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; border: none; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- TEXTUREAID MSK -->
        <div class="prod-card" style="cursor: pointer; padding: 0; display: flex; flex-direction: column;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-msk.html'; }">
          <div style="position: relative; overflow: hidden; background: var(--c-surface-alt); border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px;">
            <a href="product-textureaid-msk.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_msk.svg" alt="TEXTUREAID® MSK" style="width: 100%; max-height: 200px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.7rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div class="prod-cat" style="color: var(--c-primary); font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 700;">Non-Baking Solution</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2rem; margin-bottom: 1rem;"><a href="product-textureaid-msk.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> MSK</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1rem;">Hydrocolloid and SVP based meat texturiser which aids in improved water holding capacity in ground meat products like sheek kebab and sausages.</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem; font-size: 0.95rem;">
              <li><strong>Where product is used:</strong> Meat</li>
              <li><strong>Nature:</strong> Soya vegetable protein based</li>
              <li><strong>Dosage:</strong> 1% of total product formulation</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® MSK" style="background: var(--c-primary); color: #fff; padding: 0.8rem 1.5rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; border: none; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

      </div>`;

// Find the start of the grid section and the end of the section
const startIndex = content.indexOf('<div class="prod-grid" style="grid-template-columns: 1fr;">');
const endIndex = content.indexOf('</section>', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  // We need to preserve the ending </div> of the wrap
  const before = content.substring(0, startIndex);
  const after = content.substring(content.lastIndexOf('</div>', endIndex - 1));
  
  content = before + newGridHTML + '\\n    ' + after;
  
  // also fix max-width 1000px on wrap
  content = content.replace('<div class="wrap" style="max-width: 1000px; margin: 0 auto;">', '<div class="wrap" style="max-width: 1200px; margin: 0 auto;">');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully rebuilt grid layout.");
} else {
  console.log("Could not find grid section.");
}
