import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all feat-list sections
    # They look like: <ul class="feat-list" ...> ... </ul>
    # We will search for '<ul class="feat-list"' and the matching '</ul>'
    
    start_idx = 0
    modified = False
    new_content = ""
    
    while True:
        ul_start = content.find('<ul class="feat-list"', start_idx)
        if ul_start == -1:
            new_content += content[start_idx:]
            break
            
        ul_end = content.find('</ul>', ul_start)
        if ul_end == -1:
            new_content += content[start_idx:]
            break
            
        new_content += content[start_idx:ul_start]
        ul_end_pos = ul_end + 5
        
        ul_content = content[ul_start:ul_end_pos]
        
        # Parse the li items
        li_pattern = re.compile(r'<li[^>]*>(.*?)</li>', re.DOTALL | re.IGNORECASE)
        lis = li_pattern.findall(ul_content)
        
        data = {
            "Where product is used": "",
            "Activity": "",
            "Content": "",
            "Benefits": ""
        }
        
        for li_inner in lis:
            # extract the strong tag text for the key, and the rest for the value
            strong_match = re.search(r'<strong[^>]*>(.*?)</strong>', li_inner, re.IGNORECASE | re.DOTALL)
            if strong_match:
                key_raw = strong_match.group(1).strip()
                # remove the strong tag to get the value
                val_raw = re.sub(r'<strong[^>]*>.*?</strong>', '', li_inner, flags=re.IGNORECASE | re.DOTALL).strip()
                # Also remove any leading colon from val_raw
                if val_raw.startswith(':'):
                    val_raw = val_raw[1:].strip()
                
                key = key_raw.replace(':', '').strip()
                
                if "Where" in key:
                    data["Where product is used"] = val_raw
                elif "Activity" in key:
                    data["Activity"] = val_raw
                elif "Content" in key:
                    data["Content"] = val_raw
                elif "Benefit" in key:
                    data["Benefits"] = val_raw

        # Reconstruct the UL
        # We need the ul tag itself.
        ul_tag_end = ul_content.find('>') + 1
        ul_tag = ul_content[:ul_tag_end]
        
        rebuilt_ul = ul_tag + "\n"
        for key in ["Where product is used", "Activity", "Content", "Benefits"]:
            val = data[key]
            rebuilt_ul += f'              <li><strong>{key}:</strong> {val}</li>\n'
        rebuilt_ul += '            </ul>'
        
        new_content += rebuilt_ul
        start_idx = ul_end_pos
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

if __name__ == '__main__':
    html_files = glob.glob('*.html')
    updated_count = 0
    for f in html_files:
        if process_file(f):
            print(f"Updated {f}")
            updated_count += 1
    
    print(f"Total files updated: {updated_count}")
