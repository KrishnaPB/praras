import glob

# Mapping for the files where the image was stripped
img_map = {
    'wine.html': 'Wine.jpg',
    'wafers.html': 'wafers.jpg',
    'bread-buns-pizza-base.html': 'Bread.jpg',
    'biscuits-cookies.html': 'biscuit-2.jpg',
    'extruded-fried-snacks.html': 'extruded_fried_snacks.jpg',
    'microbial-solutions.html': 'Microbial-Solutions.jpg',
    'microbrewery.html': 'microbrewery.jpg',
    'distilleries.html': 'Molasses-Fermentation.jpg',
    'pasta-and-noodles.html': 'pasta-1.jpg',
    'breweries.html': 'brewery-1.jpg',
    'milk-based.html': 'milk_based.jpg',
    'cake.html': 'cake.jpg',
    'fruit-based.html': 'Fruit-Milk-Based-e1551980900548-1.jpg',
    'meat.html': 'meat-1.jpg',
    'egg-free-nougat.html': 'Nougat-2.jpg',
    'a-hango.html': 'microbrewery.jpg', # fallback
    'chocolate-coffee.html': 'chacolate.jpg',
    'mayonnaise.html': 'Mayonnaise.jpg'
}

for filepath, img_name in img_map.items():
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it was corrupted (missing <!-- ════ SHARED FOOTER ════ -->)
        if '<!-- ════ SHARED FOOTER ════ -->' not in content:
            # First, check if there's an unclosed form or section
            # The file currently ends around `<div class="wpcf7... </div></div>`
            
            # Remove any trailing whitespace
            content = content.rstrip()
            
            # The correct closing sequence for the layout:
            # We opened: <div class="prod-page-grid"><div class="prod-page-main">
            # The content ends with the form's closing </div></div> or something similar.
            
            footer_fix = f'''
  </div>
  <div class="prod-page-visual">
    <img src="assets/images/{img_name}" class="prod-page-img" alt="{filepath.replace('.html', '')}">
  </div>
</div>
</div>
</section>
</div>
</main>
<!-- ════ SHARED FOOTER ════ -->
'''
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content + footer_fix)
            print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
