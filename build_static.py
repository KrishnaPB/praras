import os
import glob

def build():
    # Read templates
    with open('templates/header.html', 'r', encoding='utf-8') as f:
        header_template = f.read()
    with open('templates/footer.html', 'r', encoding='utf-8') as f:
        footer_template = f.read()

    # Get all html files
    html_files = [f for f in glob.glob('*.html') if f not in ['praras_brand_kit.html', 'praras_v2.html', 'AIRBLISS_Brand_Guidelines.html']]

    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract title from current file
        title_start = content.find('<title>')
        title_end = content.find('</title>')
        if title_start != -1 and title_end != -1:
            title = content[title_start:title_end + 8]
        else:
            title = '<title>Praras Biosciences & Airbliss</title>'

        # Replace title in header template
        header_title_start = header_template.find('<title>')
        header_title_end = header_template.find('</title>')
        if header_title_start != -1 and header_title_end != -1:
            new_header = header_template[:header_title_start] + title + header_template[header_title_end + 8:]
        else:
            new_header = header_template

        # Replace header in content
        # Find </header> to replace everything up to it
        header_end_idx = content.find('</header>')
        if header_end_idx != -1:
            content = new_header + content[header_end_idx + 9:]

        # Replace footer in content
        footer_start_idx = content.find('<!-- ════ SHARED FOOTER ════ -->')
        if footer_start_idx == -1:
            footer_start_idx = content.find('<footer class="site-footer">')
        
        if footer_start_idx != -1:
            content = content[:footer_start_idx] + footer_template

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

if __name__ == "__main__":
    build()
