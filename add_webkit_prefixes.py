import re
import glob

files = glob.glob('*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Step 1: Remove existing -webkit-backdrop-filter to avoid duplicates
    content = re.sub(r'-webkit-backdrop-filter:\s*[^;]+;', '', content)
    
    # Step 2: Find backdrop-filter and replace with both
    # We must match `backdrop-filter: ...;` correctly. 
    # Sometime it might be just before a closing brace `}` without a semicolon, but usually there is one.
    # Let's match `backdrop-filter:\s*([^;}]+)(;|(?=\}))`
    
    def replacer(match):
        value = match.group(1).strip()
        ending = match.group(2)
        if not ending:
            ending = ''
        # Reconstruct with both
        return f'-webkit-backdrop-filter: {value}; backdrop-filter: {value}{ending}'

    content = re.sub(r'backdrop-filter:\s*([^;}]+)(;|(?=\}))', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Successfully added -webkit-backdrop-filter prefixes across all HTML files.")
