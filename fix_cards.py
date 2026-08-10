import os
import glob
import re

backup_dir = "/tmp/praras_backup/test.prarasbiosciences.com/"
current_dir = "./"

# We will read each original file, extract all feat-lists, and parse their data.
# Then we read the current file, find its empty feat-lists, and inject the data.

def get_original_feat_lists(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return []
        
    feat_lists = []
    # Use re to find all feat-list sections
    ul_matches = re.finditer(r'<ul\s+class="feat-list"[^>]*>(.*?)</ul>', content, re.IGNORECASE | re.DOTALL)
    for m in ul_matches:
        ul_content = m.group(1)
        lis = re.findall(r'<li[^>]*>(.*?)</li>', ul_content, re.IGNORECASE | re.DOTALL)
        
        data = {}
        for li_inner in lis:
            strong_match = re.search(r'<strong[^>]*>(.*?)</strong>', li_inner, re.IGNORECASE | re.DOTALL)
            if strong_match:
                key = strong_match.group(1).replace(':', '').strip()
                val = re.sub(r'<strong[^>]*>.*?</strong>', '', li_inner, flags=re.IGNORECASE | re.DOTALL).strip()
                if val.startswith(':'):
                    val = val[1:].strip()
                # Also strip leading/trailing spaces and HTML tags
                val = re.sub(r'<[^>]+>', '', val).strip()
                data[key.lower()] = val
            else:
                # If there's no strong, maybe it's just text. We can't map it to a key easily, ignore or append.
                pass
        feat_lists.append(data)
    return feat_lists

def fix_current_file(filename):
    backup_file = os.path.join(backup_dir, filename)
    if filename == 'preccel-93.html':
        backup_file = os.path.join(backup_dir, 'cake.html')
        
    orig_lists = get_original_feat_lists(backup_file)
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    start_idx = 0
    new_content = ""
    list_index = 0
    modified = False
    
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
        
        # We only want to process it if it has the 4 empty keys, OR if it's a feat-list.
        # But some feat-lists are just normal lists (like in product-premaycel-07.html)
        # If it was a normal list, how to restore? The original also had it as a feat list.
        # So we can just restore the ORIGINAL list EXACTLY, EXCEPT we format it to the new standard if it's a product card list!
        # How to know if it's a product card list? It has "Where product is used" etc.
        
        orig_data = orig_lists[list_index] if list_index < len(orig_lists) else {}
        
        # Check if original list had 'where product is used'
        is_product_card = any("where product is used" in k for k in orig_data.keys())
        
        # What if we just restore the entire original UL if it's NOT a product card?
        if not is_product_card:
            # Maybe it didn't have keys in original. Just grab the exact original HTML for this UL.
            # We can parse the original file again to get the exact HTML of the i-th UL.
            with open(backup_file, 'r', encoding='utf-8') as bf:
                b_content = bf.read()
                b_uls = list(re.finditer(r'<ul\s+class="feat-list"[^>]*>.*?</ul>', b_content, re.IGNORECASE | re.DOTALL))
                if list_index < len(b_uls):
                    new_content += b_uls[list_index].group(0)
                else:
                    new_content += ul_content # fallback
        else:
            # Rebuild according to the new standard using original data
            # Map original keys to new standard
            where = ""
            activity = ""
            cont = ""
            benefits = ""
            
            for k, v in orig_data.items():
                if "where" in k: where = v
                elif "activity" in k: activity = v
                elif "content" in k: cont = v
                elif "benefit" in k or "function" in k: benefits = v
                
            ul_tag_end = ul_content.find('>') + 1
            ul_tag = ul_content[:ul_tag_end]
            rebuilt = ul_tag + "\n"
            rebuilt += f'              <li><strong>Where product is used:</strong> {where}</li>\n'
            rebuilt += f'              <li><strong>Activity:</strong> {activity}</li>\n'
            rebuilt += f'              <li><strong>Nature:</strong> {cont}</li>\n'
            rebuilt += f'              <li><strong>Benefits:</strong> {benefits}</li>\n'
            rebuilt += '            </ul>'
            new_content += rebuilt
            
        start_idx = ul_end_pos
        list_index += 1
        modified = True
        
    if modified:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

if __name__ == '__main__':
    for f in glob.glob('*.html'):
        if fix_current_file(f):
            print(f"Fixed {f}")
