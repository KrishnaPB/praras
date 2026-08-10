import os
import glob
import re

backup_dir = "/tmp/praras_backup/test.prarasbiosciences.com/"
current_dir = "./"

product_files = glob.glob('product-*.html')

for filename in product_files:
    if filename == 'product-premaycel-07.html':
        continue # skip manual fix
        
    backup_file = os.path.join(backup_dir, filename)
    if not os.path.exists(backup_file):
        print(f"No backup for {filename}, skipping.")
        continue
        
    with open(backup_file, 'r', encoding='utf-8') as f:
        b_content = f.read()
        
    with open(filename, 'r', encoding='utf-8') as f:
        c_content = f.read()
        
    # We want to replace everything from <h2 class="h2">Important Information</h2> down to the end of the section
    # Actually, the block starts at <div style="margin-top: 4rem;"> and ends before the footer.
    # Let's find the 'Important Information' section.
    
    b_match = re.search(r'(<div style="margin-top: 4rem;">\s*<h2 class="h2"[^>]*>Important Information</h2>.*?</div>\s*</div>\s*</div>\s*</section>)', b_content, re.DOTALL | re.IGNORECASE)
    
    # In the current file, the <h2> might not have the inline styles because I might have removed them.
    c_match = re.search(r'(<div style="margin-top: 4rem;">\s*<h2 class="h2"[^>]*>Important Information</h2>.*?</div>\s*</div>\s*</div>\s*</section>)', c_content, re.DOTALL | re.IGNORECASE)
    
    if b_match and c_match:
        b_info = b_match.group(1)
        # Replace c_match in c_content with b_info
        new_content = c_content[:c_match.start(1)] + b_info + c_content[c_match.end(1):]
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Restored Important Info for {filename}")
    else:
        print(f"Could not match section in {filename}")
