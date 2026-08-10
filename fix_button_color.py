import re
import glob

files = glob.glob('*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the color definition inside .btn-mega-featured
    # We want to change color: #fff; to color: #fff !important;
    
    def replacer(match):
        inner = match.group(1)
        # If it doesn't already have !important
        if '!important' not in inner:
            inner = re.sub(r'color:\s*#fff(;|(?=\}))', r'color: #fff !important;', inner)
            inner = re.sub(r'color:\s*#ffffff(;|(?=\}))', r'color: #ffffff !important;', inner)
        return f".btn-mega-featured {{{inner}}}"
        
    content = re.sub(r'\.btn-mega-featured\s*\{([^}]+)\}', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated .btn-mega-featured to have color: #fff !important; across all HTML files.")
