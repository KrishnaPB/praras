import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any <div class="prod-grid" style="..."> with <div class="prod-grid">
    new_content = re.sub(r'<div\s+class="prod-grid"\s+style="[^"]*"\s*>', '<div class="prod-grid">', content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned {file}")
