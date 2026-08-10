import re

with open('test-biscamaze-lf.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find section around the certificates
fssai_idx = content.find('fssai.webp')
if fssai_idx == -1:
    fssai_idx = content.find('FSSAI')

if fssai_idx != -1:
    # Extract 3000 chars around it
    start = max(0, fssai_idx - 1500)
    end = min(len(content), fssai_idx + 1500)
    excerpt = content[start:end]
    with open('certs_excerpt.txt', 'w', encoding='utf-8') as f:
        f.write(excerpt)
    print(f"Found at index {fssai_idx}, wrote excerpt ({len(excerpt)} chars)")
else:
    print("FSSAI not found in file")
    with open('certs_excerpt.txt', 'w', encoding='utf-8') as f:
        f.write("FSSAI NOT FOUND")
EOF