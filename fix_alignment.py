import os
import glob

def fix_files():
    html_files = glob.glob('*.html')
    
    start_string = '<ul style="margin-bottom:1rem; padding-left:1.5rem; color:var(--c-muted); font-size:0.9rem; line-height:1.7;"><li class="mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom mega-menu-item-home'
    end_string = '<p class="svc-p" style="margin-bottom:1rem;"><span style="color: #ffffff"><a style="color: #ffffff" href="contact-us.html">Drop us a line today.</a></span></p>'

    updated_count = 0
    
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        start_idx = content.find(start_string)
        if start_idx != -1:
            end_idx = content.find(end_string, start_idx)
            if end_idx != -1:
                # We want to remove everything from start_idx to the end of end_string
                # also maybe remove the newline after it if exists
                remove_end = end_idx + len(end_string)
                if remove_end < len(content) and content[remove_end] == '\n':
                    remove_end += 1
                    
                new_content = content[:start_idx] + content[remove_end:]
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Fixed {filepath}')
                updated_count += 1
            else:
                print(f'Found start but not end in {filepath}')
                
    print(f'Total files fixed: {updated_count}')

if __name__ == "__main__":
    fix_files()
