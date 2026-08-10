import re

file_path = "extruded-fried-snacks.html"

with open(file_path, "r") as f:
    content = f.read()

# 1. Insert Key Benefits section before <!-- PRODUCT RANGE & BROCHURE -->
key_benefits_html = """  <!-- BENEFITS -->
  <section class="section" style="background: var(--c-surface-alt);">
    <div class="wrap">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 class="h2">Key Benefits</h2>
        <p style="color: var(--c-muted); max-width: 600px; margin: 0 auto;">Transform your manufacturing process with TEXTUREAID® CLF.</p>
      </div>
      
      <div class="svc-grid">
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
          <div>
            <p class="svc-p">Improves overall quality of fried snacks by 31%.</p>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg></div>
          <div>
            <p class="svc-p">Reduces grittiness by 50%.</p>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></div>
          <div>
            <p class="svc-p">Increases strength of snacks by 17%.</p>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
          <div>
            <p class="svc-p">Reduces oil uptake by 16%.</p>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
          <div>
            <p class="svc-p">Increases crispiness by 19%.</p>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-icon"><svg viewBox="0 0 24 24"><path d="M2 12h20M12 2v20"></path></svg></div>
          <div>
            <p class="svc-p">Reduces oiliness by 45%.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- PRODUCT RANGE & BROCHURE -->"""

content = content.replace("<!-- PRODUCT RANGE & BROCHURE -->", key_benefits_html)

# 2. Replace the prod-grid section with the single card wide layout
new_prod_grid = """      <div class="prod-grid" style="grid-template-columns: 1fr;">
        <div class="prod-card" style="flex-direction: row; flex-wrap: wrap; align-items: stretch; padding: 0;">
          <div style="flex: 1 1 300px; position: relative; overflow: hidden; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--c-surface-alt); border-right: 1px solid var(--c-border); border-bottom: none;">
            <img src="assets/images/textureaid_clf.svg" alt="TEXTUREAID® CLF" style="width: 100%; max-height: 320px; object-fit: contain; padding: 2rem; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <div style="font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem;">Disclaimer: Packaging in images is for visual representation only and may not reflect actual product packaging.</div>
          </div>
          <div style="padding: 4rem; flex: 2 1 400px; display: flex; flex-direction: column; justify-content: center;">
            <div class="prod-cat" style="color: var(--c-primary);">Dough Conditioner</div>
            <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;">TEXTUREAID<sup>®</sup> CLF</h3>
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
      </div>"""

# Replace the block from <div class="prod-grid" ... > down to the matching </div>
start_idx = content.find('<div class="prod-grid"')
if start_idx != -1:
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i:i+4] == '<div':
            depth += 1
        elif content[i:i+5] == '</div':
            depth -= 1
        if depth == 0 and i > start_idx:
            end_idx = i + 6
            break
    
    if end_idx != -1:
        content = content[:start_idx] + new_prod_grid + content[end_idx:]

with open(file_path, "w") as f:
    f.write(content)
print("Updated successfully.")
