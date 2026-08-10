import os
import re

dir_path = '/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com'

# Regex for the hero button
btn_pattern = re.compile(r'\s*<a href="#brochure"[^>]*>Download Brochure.*?</a>', re.IGNORECASE | re.DOTALL)

# Regex for the brochure form
form_pattern = re.compile(r'\s*<!-- BROCHURE FORM -->.*?</section>', re.IGNORECASE | re.DOTALL)

updated_count = 0

for root, dirs, files in os.walk(dir_path):
    if 'img_env' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = btn_pattern.sub('', content)
            new_content = form_pattern.sub('', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file}")
                updated_count += 1

print(f"Total files updated: {updated_count}")
