import os
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(
        '.prod-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5rem;}',
        '.prod-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:2.5rem;}'
    )
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
