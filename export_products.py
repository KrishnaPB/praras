import glob
import re
import csv

html_files = glob.glob('*.html')
product_data = []

# Helper to format filename into a nice category name
def get_category_name(filename):
    name = filename.replace('.html', '').replace('-', ' ')
    return name.title()

for html_file in html_files:
    if html_file in ['index.html', 'homepage.html', 'about.html', 'contact.html', 'careers.html', 'services.html', 'privacy-policy.html', 'troubleshooting.html', 'contract_manufacturing.html', 'industry.html', 'blog.html', 'blog-post-precision-fermentation.html']:
        continue
        
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'class="prod-card"' in content:
        # Extract product names
        matches = re.findall(r'<h3[^>]*class="prod-h"[^>]*>(.*?)</h3>', content)
        if matches:
            category = get_category_name(html_file)
            for m in matches:
                clean_name = re.sub(r'<[^>]+>', '', m).strip()
                # Remove extra spaces inside
                clean_name = re.sub(r'\s+', ' ', clean_name)
                product_data.append([category, clean_name])

# Write to CSV
with open('praras_products_by_category.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Category', 'Product Name'])
    writer.writerows(product_data)

print(f"Successfully exported {len(product_data)} products to praras_products_by_category.csv")
