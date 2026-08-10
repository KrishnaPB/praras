import re

files_to_update = {
    'wine.html': [
        ('FLOCAID® EG', 'assets/images/flocaid_eg.png'),
        ('AIDFERM® W', 'assets/images/aidferm_w.png')
    ],
    'wafers.html': [
        ('BISCAMAZE® CW', 'assets/images/biscamaze_cw.png')
    ],
    'bread-buns-pizza-base.html': [
        ('FLOUR FORTE', 'assets/images/flour_forte.png')
    ]
}

for filename, updates in files_to_update.items():
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for product_name, new_img in updates:
        # Regex to find the <img> tag just before this product name
        # We look for a prod-card that contains the product name
        # and replace its img src
        # A bit tricky with regex. Let's do a more structured approach or a careful regex.
        # Find the block for the product
        
        pattern = r'(<div class="prod-card"[^>]*>.*?<img src=")([^"]+)(".*?)(<h3[^>]*>.*?'+re.escape(product_name)+r'.*?</h3>)'
        
        def replacer(match):
            return match.group(1) + new_img + match.group(3) + match.group(4)
            
        content = re.sub(pattern, replacer, content, flags=re.DOTALL)
        
        # Also need to fix object-fit to contain and add padding so the whole package shows
        content = re.sub(
            r'(<img src="' + re.escape(new_img) + r'"[^>]*?style="[^"]*?)object-fit:\s*cover;', 
            r'\1object-fit: contain; padding: 1.5rem;', 
            content
        )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated 4 images successfully")
