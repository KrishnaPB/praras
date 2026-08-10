import os
import re
import glob

# Mapping of categories to their images
CATEGORY_IMAGES = {
    'Baking': {'hero': 'biscuits_hero.png', 'product': 'biscamaze_lf.png'},
    'Beverages': {'hero': 'beverages_hero.png', 'product': 'beverages_product.png'},
    'Microbial & Others': {'hero': 'microbial_hero.png', 'product': 'microbial_product.png'},
    'Non-Baking': {'hero': 'culinary_hero.png', 'product': 'culinary_product.png'}
}

# Determine category for each file to apply correct imagery
FILE_CATEGORIES = {
    'biscuits-cookies.html': 'Baking',
    'cake.html': 'Baking',
    'bread-buns-pizza-base.html': 'Baking',
    'wafers.html': 'Baking',
    
    'meat.html': 'Non-Baking',
    'pasta-and-noodles.html': 'Non-Baking',
    'egg-free-nougat.html': 'Non-Baking',
    'a-hango.html': 'Non-Baking',
    'extruded-fried-snacks.html': 'Non-Baking',
    'mayonnaise.html': 'Non-Baking',
    
    'breweries.html': 'Beverages',
    'distilleries.html': 'Beverages',
    'wine.html': 'Beverages',
    'microbrewery.html': 'Beverages',
    'fruit-based.html': 'Beverages',
    'milk-based.html': 'Beverages',
    'chocolate-coffee.html': 'Beverages',
    
    'microbial-solutions.html': 'Microbial & Others'
}

def process_file(filepath):
    filename = os.path.basename(filepath)
    category = FILE_CATEGORIES.get(filename, 'Baking') # default
    images = CATEGORY_IMAGES.get(category)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Upgrade Hero
    hero_pattern = re.compile(r'(<section class="hero"\s+style=")(.*?)(">)(.*?)(</section>)', re.DOTALL)
    
    def hero_repl(m):
        if 'grid-template-columns' in m.group(4): return m.group(0) # already upgraded
        
        style = f"padding: 8rem 2.5rem; text-align: left; background: url('assets/images/{images['hero']}') center/cover no-repeat; position: relative; overflow: hidden;"
        inner_html = m.group(4)
        
        # update radial gradient
        inner_html = re.sub(r'(<div style="position:absolute; inset:0; background: )radial-gradient[^"]+(".*?</div>)', r'\g<1>linear-gradient(to right, rgba(26,21,18,0.9) 0%, rgba(26,21,18,0.4) 60%, transparent 100%); z-index:1;\g<2>', inner_html)
        
        # update wrap
        inner_html = re.sub(r'(<div class="wrap" style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">)', r'<div class="wrap" style="position: relative; z-index: 2; max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: 1fr; align-items: center;">\n<div style="max-width: 650px;">', inner_html)
        
        # close the extra div before the end of wrap
        inner_html = re.sub(r'(</div>\s*)$', r'</div>\n\g<1>', inner_html)
        
        # Update paragraph
        inner_html = re.sub(r'<p class="hero-p" style="margin: 0 auto 2rem; max-width: 600px; font-size: 1.15rem;">', r'<p class="hero-p" style="margin: 0 0 2.5rem; max-width: 600px; font-size: 1.15rem;">', inner_html)
        
        # Extract H1 for the button
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', inner_html)
        prod_title = h1_match.group(1) if h1_match else "Product"
        prod_title = re.sub(r'<[^>]+>', '', prod_title)
        
        # Restructure buttons
        a_tag_pattern = r'<a href="#brochure" class="btn-hero-p">Download Brochure <svg viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg></a>'
        new_btns = f"""<div class="hero-actions">
        <button class="btn-hero-p btn-quote" data-product="{prod_title}">Get a Quote <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <a href="#brochure" class="btn-hero-g">Download Brochure <svg viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </div>"""
        
        inner_html = inner_html.replace(a_tag_pattern, new_btns)
        
        return m.group(1) + style + m.group(3) + inner_html + m.group(5)

    content = hero_pattern.sub(hero_repl, content)

    # 2. Upgrade Premium Tables
    table_pattern = re.compile(r'<table class="premium-table".*?>(.*?)</table>', re.DOTALL)
    
    def table_repl(m):
        table_html = m.group(1)
        # find rows
        rows = re.findall(r'<tr.*?>(.*?)</tr>', table_html, re.DOTALL)
        
        cards = []
        for row in rows:
            cols = re.findall(r'<t[dh].*?>(.*?)</t[dh]>', row, re.DOTALL)
            if len(cols) >= 3 and 'Products' not in cols[0] and 'Product' not in cols[0]:
                prod_name_html = cols[0].strip()
                prod_name_text = re.sub(r'<[^>]+>', '', prod_name_html)
                nature = re.sub(r'<[^>]+>', '', cols[1].strip())
                function = re.sub(r'<[^>]+>', '', cols[2].strip())
                
                card_html = f"""
                <div class="prod-card" style="flex-direction: row; align-items: stretch; padding: 0;">
                  <div style="flex: 0 0 45%; position: relative; overflow: hidden; min-height: 400px;">
                    <img src="assets/images/{images['product']}" alt="{prod_name_text}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; border-right: 1px solid var(--c-border);">
                  </div>
                  <div style="padding: 4rem; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div class="prod-cat" style="color: var(--c-primary);">{category} Solution</div>
                    <h3 class="prod-h" style="color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;">{prod_name_html}</h3>
                    <p class="prod-p" style="margin-bottom: 2rem; font-size: 1.05rem;">{function}</p>
                    <ul class="feat-list" style="margin-bottom: 2.5rem;">
                      <li><strong>Nature:</strong> {nature}</li>
                      <li><strong>Function:</strong> {function}</li>
                    </ul>
                    <div style="margin-top: auto;">
                      <button class="btn-quote" data-product="{prod_name_text}" style="background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);">
                        Get Quote <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </div>
                """
                cards.append(card_html)
        
        if cards:
            return f'<div class="prod-grid" style="grid-template-columns: 1fr; display: grid; gap: 2rem;">{"".join(cards)}</div>'
        else:
            return f'<table class="premium-table">{m.group(1)}</table>'

    content = table_pattern.sub(table_repl, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Upgraded {filename}")

html_files = glob.glob('*.html')
for html_file in html_files:
    if html_file in FILE_CATEGORIES and html_file != 'biscuits-cookies.html':
        process_file(html_file)

print("Upgrade complete!")
