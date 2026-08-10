import glob
import re
import os

ignored_files = ['index.html', 'about.html', 'industry.html', 'services.html', 'contact.html', 'careers.html', 'privacy-policy.html', 'contract_manufacturing.html', 'troubleshooting.html', 'AIRBLISS_Brand_Guidelines.html', 'praras_brand_kit.html', 'praras_v2.html']

for filepath in glob.glob('*.html'):
    if filepath in ignored_files:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if the structure is correct
    if '<img src="assets/images/' in content and '<div class="sec-body"' in content:
        # Extract the image tag
        img_match = re.search(r'(<img src="assets/images/[^>]+>)', content)
        if not img_match:
            continue
            
        img_tag = img_match.group(1)
        
        # We need to restructure.
        # Remove the img_tag from its original place.
        content = content.replace(img_tag + '\n', '')
        content = content.replace(img_tag, '')
        
        # Update the img tag class to use our new styling instead of inline styles
        # Actually it's easier to just strip style attribute and add class
        img_tag = re.sub(r'style="[^"]+"', '', img_tag)
        img_tag = img_tag.replace('<img ', '<img class="prod-page-img" ')
        
        # Find where sec-body starts and ends
        # Since sec-body is just a div that spans the rest of the section,
        # we can replace `<div class="sec-body"` with our wrapper
        
        # Find exactly where `<div class="sec-body"` starts
        sec_body_idx = content.find('<div class="sec-body"')
        if sec_body_idx == -1:
            continue
            
        # Instead of parsing HTML, we can just replace the starting tag
        # and then append the closing divs before `</section>`
        
        # The structure is:
        # <div class="prod-page-grid">
        #   <div class="prod-page-main">
        #     <div class="sec-body" ...> ... </div>
        #   </div>
        #   <div class="prod-page-visual"> <img ...> </div>
        # </div>
        
        # Find the end of the section
        end_section_idx = content.find('</section>', sec_body_idx)
        if end_section_idx == -1:
            continue
            
        # We need to insert the closing wrapper right before </section>
        # but there is also a closing </div> for wrap, so let's look for `</div>\n</section>` or similar
        # Let's just find `</section>` and insert before the preceding `</div>`
        
        # It's safer to just regex replace `<div class="sec-body"` to `<div class="prod-page-grid"><div class="prod-page-main"><div class="sec-body"`
        content = content[:sec_body_idx] + '<div class="prod-page-grid">\n  <div class="prod-page-main">\n' + content[sec_body_idx:end_section_idx]
        
        # We need to close it and add visual
        # Before closing </section>, there is a closing </div> for wrap.
        # Let's find the position of `</section>` again in the new content
        end_section_idx = content.find('</section>', sec_body_idx)
        
        # The end should be:
        # </div> <!-- close sec-body --> (Wait, sec-body might already be closed, or maybe not closed explicitly if the file is messy, but assume it's closed)
        # We need to insert `</div> <div class="prod-page-visual"> {img_tag} </div> </div>` before the closing wrap `</div>`
        
        # Let's just do a simple replacement:
        # Find `</section>` and we know the line before it is `</div>` (the wrap)
        # So replace `</div>\n</section>` with `</div><div class="prod-page-visual">{img_tag}</div></div></div>\n</section>`
        
        new_content = content.replace('</div>\n</section>', f'</div>\n  </div>\n  <div class="prod-page-visual">\n    {img_tag}\n  </div>\n</div>\n</div>\n</section>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Beautified {filepath}")
