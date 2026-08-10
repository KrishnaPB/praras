import glob
import re

def remove_sections(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    orig_len = len(html)
    
    # 1. Remove Application Conditions section
    html = re.sub(
        r'<h3[^>]*>\s*Application Conditions\s*</h3>.*?(?=<h3|<p[^>]*>\s*All our products|<p[^>]*>\s*The information provided|<div style="margin-top: auto;"|</div>\s*</div>)',
        '',
        html,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 2. Remove Storage Conditions & Packaging / Storage Conditions and Packaging / Storage Conditions
    html = re.sub(
        r'<h3[^>]*>\s*Storage Conditions.*?(?:Packaging)?\s*</h3>.*?(?=<h3|<p[^>]*>\s*All our products|<p[^>]*>\s*The information provided|<div style="margin-top: auto;"|</div>\s*</div>)',
        '',
        html,
        flags=re.DOTALL | re.IGNORECASE
    )

    if len(html) != orig_len:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Processed {filepath}: {orig_len} -> {len(html)} bytes')
    else:
        print(f'No change in {filepath}')

for f in sorted(glob.glob('product-*.html')):
    remove_sections(f)
