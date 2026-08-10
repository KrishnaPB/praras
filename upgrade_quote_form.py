import re
import glob

files = glob.glob('*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace .quote-drawer-header
    content = re.sub(
        r'\.quote-drawer-header\s*\{[^}]*\}',
        '.quote-drawer-header { padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: flex-start; }',
        content
    )
    
    # Replace .quote-drawer-body
    content = re.sub(
        r'\.quote-drawer-body\s*\{[^}]*\}',
        '.quote-drawer-body { padding: 1.5rem 2.5rem 3rem; flex: 1; }',
        content
    )
    
    # Replace .quote-drawer-title
    content = re.sub(
        r'\.quote-drawer-title\s*\{[^}]*\}',
        '.quote-drawer-title { font-family: var(--font-d); font-size: 2.25rem; font-weight: 700; color: var(--c-ink); margin-bottom: 0.25rem; }',
        content
    )
    
    # Replace .q-input-wrap label
    content = re.sub(
        r'\.q-input-wrap label\s*\{[^}]*\}',
        '.q-input-wrap label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--c-muted); margin-bottom: 0.5rem; }',
        content
    )
    
    # Replace inputs
    content = re.sub(
        r'\.q-input-wrap input,\s*\.q-input-wrap select,\s*\.q-input-wrap textarea\s*\{[^}]*\}',
        '.q-input-wrap input, .q-input-wrap select, .q-input-wrap textarea { width: 100%; padding: 1rem 1.25rem; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; background: #f8f9fa; color: var(--c-ink); font-family: inherit; font-size: 1rem; transition: all 0.2s ease; box-sizing: border-box; }',
        content
    )
    
    # Replace inputs focus
    content = re.sub(
        r'\.q-input-wrap input:focus,\s*\.q-input-wrap select:focus,\s*\.q-input-wrap textarea:focus\s*\{[^}]*\}',
        '.q-input-wrap input:focus, .q-input-wrap select:focus, .q-input-wrap textarea:focus { background: #fff; border-color: var(--c-primary); box-shadow: 0 0 0 4px rgba(154,29,30,0.15); outline: none; }',
        content
    )
    
    # Replace button
    content = re.sub(
        r'\.quote-btn-submit\s*\{[^}]*\}',
        '.quote-btn-submit { width: 100%; background: linear-gradient(135deg, var(--c-primary), var(--c-primary-d)); color: #fff; padding: 1.1rem; border-radius: 8px; font-weight: 800; font-size: 1rem; text-transform:uppercase; letter-spacing:0.05em; box-shadow:var(--sh-btn); margin-top:1rem; transition: all 0.2s; border: none; cursor: pointer; }',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Quote drawer form updated successfully.")
