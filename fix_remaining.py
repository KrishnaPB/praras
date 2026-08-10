import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    start_string = '<ul style="margin-bottom:1rem; padding-left:1.5rem; color:var(--c-muted); font-size:0.9rem; line-height:1.7;"><li class="mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom'
    
    start_idx = content.find(start_string)
    if start_idx == -1:
        print(f'No legacy nav found in {filepath}')
        return
    
    # Find the actual product content - look for the first <h3> or <p> after the legacy nav
    # that contains actual product content (not nav content)
    # The legacy nav block ends before the actual page-specific content
    # Look for a pattern that signals the real content: typically a heading like "Industry" 
    # or "Brochure" or product description
    
    # For troubleshooting and contract_manufacturing, there's no "Drop us a line" marker
    # Instead, look for "Industry" section heading which appears in all product pages
    end_string = '<h3 style="color:var(--c-ink); margin-top:2rem; margin-bottom:1rem; font-family:var(--font-d); font-weight:600;">'
    
    end_idx = content.find(end_string, start_idx)
    if end_idx != -1:
        new_content = content[:start_idx] + content[end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed {filepath} (removed from start to Industry heading)')
        return
    
    # If no Industry heading, look for other content markers
    # Try the main product content which starts with description paragraphs
    for marker in ['<p class="svc-p"', '<h3 style="color:var(--c-ink)']:
        # Find the first occurrence after the legacy nav that is the actual content
        search_pos = start_idx + len(start_string) + 500  # skip past the nav block
        end_idx = content.find(marker, search_pos)
        if end_idx != -1:
            # Make sure we're past the nav block by checking context
            new_content = content[:start_idx] + content[end_idx:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed {filepath} using marker: {marker[:30]}...')
            return
    
    print(f'Could not fix {filepath} - no suitable end marker found')

fix_file('troubleshooting.html')
fix_file('contract_manufacturing.html')
