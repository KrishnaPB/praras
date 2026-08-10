import glob
import os

with open('templates/header.html', 'r', encoding='utf-8') as f:
    header = f.read()

with open('templates/footer.html', 'r', encoding='utf-8') as f:
    footer = f.read()

for fpath in glob.glob('*.html'):
    if fpath in ['praras_brand_kit.html', 'praras_v2.html', 'AIRBLISS_Brand_Guidelines.html']:
        continue
    print(f"Processing {fpath}")
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # replace header
    header_end = content.find('</header>')
    if header_end != -1:
        t_start = content.find('<title>')
        t_end = content.find('</title>')
        title = content[t_start:t_end+8] if t_start != -1 else '<title>Praras Biosciences</title>'
        
        h_t_start = header.find('<title>')
        h_t_end = header.find('</title>')
        new_header = header[:h_t_start] + title + header[h_t_end+8:] if h_t_start != -1 else header
        
        content = new_header + content[header_end+9:]
        
    # replace footer
    # look for cert strip first, if not found look for shared footer
    footer_start = content.find('<!-- ════ CERT STRIP ════ -->')
    if footer_start == -1:
        footer_start = content.find('<!-- ════ SHARED FOOTER ════ -->')
    if footer_start == -1:
        footer_start = content.find('<footer class="site-footer">')
    
    if footer_start != -1:
        content = content[:footer_start] + footer
        
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
