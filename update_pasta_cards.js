const fs = require('fs');

const path = 'pasta-and-noodles.html';
let content = fs.readFileSync(path, 'utf8');

const cards = `
      <div class="prod-grid">
        <!-- Card 1: TEXTUREAID 025 -->
        <div class="prod-card" style="cursor: pointer; flex-direction: column; align-items: stretch; padding: 0;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-025.html'; }">
          <div style="position: relative; overflow: hidden; height: 320px; display: flex; flex-direction: column; align-items: center;">
            <a href="product-textureaid-025.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_025.svg" alt="TEXTUREAID® 025" style="width: 100%; height: 260px; object-fit: contain; padding: 1.5rem; display: block; border-right: 1px solid var(--c-border); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem; border-right: 1px solid var(--c-border);">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="prod-cat" style="color: var(--c-primary);">Dough Conditioner</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-025.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> 025</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">Reduces cracks and breakages in extruded food products</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem;">
              <li><strong>Where product is used:</strong> Extruded foods (pasta/noodles)</li>
              <li><strong>Nature:</strong> Dough conditioner</li>
              <li><strong>Benefits:</strong> Zero cracking percentage till 3 months, increases pasta hardness by 69% and springiness by 40%</li>
              <li><strong>Dosage:</strong> 0.1 - 0.3% w/w</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® 025" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Card 2: TEXTUREAID CLF -->
        <div class="prod-card" style="cursor: pointer; flex-direction: column; align-items: stretch; padding: 0;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-clf.html'; }">
          <div style="position: relative; overflow: hidden; height: 320px; display: flex; flex-direction: column; align-items: center;">
            <a href="product-textureaid-clf.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_clf.svg" alt="TEXTUREAID® CLF" style="width: 100%; height: 260px; object-fit: contain; padding: 1.5rem; display: block; border-right: 1px solid var(--c-border); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem; border-right: 1px solid var(--c-border);">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="prod-cat" style="color: var(--c-primary);">Dough Conditioner</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-clf.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> CLF</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">Food grade dough conditioner for extruded products</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem;">
              <li><strong>Where product is used:</strong> Extruded and fried snacks</li>
              <li><strong>Nature:</strong> Food grade dough conditioner</li>
              <li><strong>Benefits:</strong> Reduces fat uptake by 16%, increases crispiness by 19%, reduces grittiness by 50%</li>
              <li><strong>Dosage:</strong> 0.25 - 0.50% of total flour</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® CLF" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Card 3: TEXTUREAID M -->
        <div class="prod-card" style="cursor: pointer; flex-direction: column; align-items: stretch; padding: 0;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-m.html'; }">
          <div style="position: relative; overflow: hidden; height: 320px; display: flex; flex-direction: column; align-items: center;">
            <a href="product-textureaid-m.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_m.svg" alt="TEXTUREAID® M" style="width: 100%; height: 260px; object-fit: contain; padding: 1.5rem; display: block; border-right: 1px solid var(--c-border); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem; border-right: 1px solid var(--c-border);">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="prod-cat" style="color: var(--c-primary);">Meat Texturizer</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-m.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> M</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">SVP based meat texturizer for restructured products</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem;">
              <li><strong>Where product is used:</strong> Restructured meat products</li>
              <li><strong>Nature:</strong> SVP based meat texturizer</li>
              <li><strong>Benefits:</strong> Allows 5% reduction of meat and 5% water addition, providing significant cost reduction</li>
              <li><strong>Dosage:</strong> 0.50% of total formulation</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® M" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Card 4: TEXTUREAID MSK -->
        <div class="prod-card" style="cursor: pointer; flex-direction: column; align-items: stretch; padding: 0;" onclick="if(!event.target.closest('button')){ window.location.href='product-textureaid-msk.html'; }">
          <div style="position: relative; overflow: hidden; height: 320px; display: flex; flex-direction: column; align-items: center;">
            <a href="product-textureaid-msk.html" style="display: block; width: 100%;">
              <img src="assets/images/textureaid_msk.svg" alt="TEXTUREAID® MSK" style="width: 100%; height: 260px; object-fit: contain; padding: 1.5rem; display: block; border-right: 1px solid var(--c-border); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </a>
            <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem; border-right: 1px solid var(--c-border);">Disclaimer: Packaging in images is for visual representation only.</div>
          </div>
          <div style="padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="prod-cat" style="color: var(--c-primary);">Meat Texturizer</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;"><a href="product-textureaid-msk.html" style="text-decoration: none; color: inherit; transition: color 0.2s;" onmouseover="this.style.color='var(--c-primary)'" onmouseout="this.style.color='inherit'">TEXTUREAID<sup>®</sup> MSK</a></h3>
            <p class="prod-p" style="margin-bottom: 1.5rem; font-size: 1.05rem;">Hydrocolloid and SVP based texturiser</p>
            <ul class="feat-list" style="margin-bottom: 2.5rem;">
              <li><strong>Where product is used:</strong> Ground meat (sheek kebab/sausages)</li>
              <li><strong>Nature:</strong> Hydrocolloid and SVP based texturiser</li>
              <li><strong>Benefits:</strong> 16% meat reduction in kebabs, 100% chicken replacement with MDM in sausages</li>
              <li><strong>Dosage:</strong> 1% of total formulation</li>
            </ul>
            <div style="margin-top: auto;">
              <button class="btn-quote" data-product="TEXTUREAID® MSK" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
`;

// Replace from <div class="prod-grid"> up to its closing tag.
// Regex will match <div class="prod-grid"> and everything until the next section tag (or we can just do a more specific replace).
const startIdx = content.indexOf('<div class="prod-grid">');
// Find the closing </div> of the prod-grid by counting.
let depth = 0;
let endIdx = startIdx;
for (let i = startIdx; i < content.length; i++) {
  if (content.substr(i, 4) === '<div') depth++;
  else if (content.substr(i, 5) === '</div') depth--;
  
  if (depth === 0 && i > startIdx) {
    endIdx = i + 6;
    break;
  }
}

content = content.substring(0, startIdx) + cards + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log('Successfully updated pasta-and-noodles.html with 4 product cards.');
