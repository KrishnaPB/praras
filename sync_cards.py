import os
import glob
import re

# Parse all category pages to extract the feat-list for each product page
category_files = [f for f in glob.glob('*.html') if not f.startswith('product-')]

file_to_featlist = {}

for f in category_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Split by prod-card
    cards = content.split('class="prod-card"')
    for card in cards[1:]:
        # Find href
        href_match = re.search(r'href="(product-[^"]+\.html)"', card)
        if href_match:
            href = href_match.group(1)
            # Find feat-list
            ul_match = re.search(r'<ul\s+class="feat-list"[^>]*>.*?</ul>', card, re.IGNORECASE | re.DOTALL)
            if ul_match:
                ul_html = ul_match.group(0)
                file_to_featlist[href] = ul_html

print(f"Found {len(file_to_featlist)} mappings from category pages.")

# Now apply to product pages
for product_file, ul_html in file_to_featlist.items():
    if not os.path.exists(product_file):
        continue
    
    with open(product_file, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Replace the empty feat-list in the product file
    # We look for a feat-list that contains "Where product is used:</strong> </li>" or similar empty tags.
    # Actually, we can just replace the FIRST feat-list in the product file, because the first one is always the product card details.
    
    def repl(m):
        # Only replace if it's currently empty
        if "Where product is used:</strong> </li>" in m.group(0) or "Where product is used" not in m.group(0):
            return ul_html
        return m.group(0) # Keep if already populated correctly (though they should all be empty)
        
    # We'll just replace the first feat-list.
    # To be safe, we'll find all and replace the first one that has "Where product is used:</strong> </li>"
    
    new_content, count = re.subn(r'<ul\s+class="feat-list"[^>]*>.*?</ul>', lambda m: ul_html if 'Where product is used:</strong> </li>' in m.group(0) else m.group(0), content, flags=re.IGNORECASE | re.DOTALL)
    
    if count > 0:
        with open(product_file, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Patched {product_file}")

# For product-premaycel-07.html, there is no category page that links to it (or maybe mayonnaise.html links to it?). Let's see if it got patched.
