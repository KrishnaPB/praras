import glob
import re

html_files = glob.glob('*.html')
product_data = {}

for html_file in html_files:
    if html_file in ['index.html', 'homepage.html', 'about.html', 'contact.html', 'careers.html', 'services.html']:
        continue
        
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if this page has product cards
    if 'class="prod-card"' in content:
        # Extract product names
        matches = re.findall(r'<h3[^>]*class="prod-h"[^>]*>(.*?)</h3>', content)
        if matches:
            # Clean up superscript/subscript tags if any
            clean_matches = [re.sub(r'<[^>]+>', '', m).strip() for m in matches]
            product_data[html_file] = clean_matches

print("Product Pages and Products:")
total_products = 0
for page, products in product_data.items():
    print(f"\n--- {page} ---")
    for p in products:
        print(f"  - {p}")
        total_products += 1

print(f"\nTotal product pages: {len(product_data)}")
print(f"Total products: {total_products}")
