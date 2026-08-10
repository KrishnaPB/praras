import re
import glob

files = glob.glob('*.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Standardize section padding
    # Let's replace padding: 8rem 2.5rem with padding: 4rem 2.5rem
    content = re.sub(r'padding:\s*8rem\s*2\.5rem', 'padding: 4rem 2.5rem', content)
    
    # Standardize line-height
    content = re.sub(r'line-height:\s*1\.\d+', 'line-height: 1.6', content)
    
    # Standardize paragraph margins
    content = re.sub(r'<p([^>]*)style="([^"]*)margin-bottom:\s*[^;"]+;?([^"]*)"', r'<p\1style="\2margin-bottom: 1.5rem;\3"', content)
    
    # Standardize h2 margins
    content = re.sub(r'<h2([^>]*)style="([^"]*)margin-bottom:\s*[^;"]+;?([^"]*)"', r'<h2\1style="\2margin-bottom: 2rem;\3"', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Spacing standardized across all HTML files.")
