import glob

html_files = glob.glob('*.html')
ignored_files = ['index.html', 'about.html', 'industry.html', 'services.html', 'contact.html', 'careers.html', 'privacy-policy.html', 'contract_manufacturing.html', 'troubleshooting.html', 'AIRBLISS_Brand_Guidelines.html', 'praras_brand_kit.html', 'praras_v2.html']

count = 0
for filepath in html_files:
    if filepath in ignored_files:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue is that I inserted:
    #   </div>
    #   <div class="prod-page-visual">
    # Instead of:
    #   </div>
    #   </div>
    #   <div class="prod-page-visual">

    # Let's replace `  </div>\n  <div class="prod-page-visual">` 
    # with `  </div>\n  </div>\n  <div class="prod-page-visual">`
    
    target = '  </div>\n  <div class="prod-page-visual">'
    replacement = '  </div>\n  </div>\n  <div class="prod-page-visual">'
    
    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed alignment in {filepath}")
        count += 1

print(f"Total fixed: {count}")
