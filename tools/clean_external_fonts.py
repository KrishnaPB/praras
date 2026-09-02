#!/usr/bin/env python3
"""
Clean all external Google Fonts / remote font links across all HTML files
Ensures 100% self-hosted typography via local fonts/fonts.css.
"""

import os
import glob
import re

WORKSPACE = "/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com"

def clean_external_fonts():
    all_pages = glob.glob(os.path.join(WORKSPACE, "*.html")) + glob.glob(os.path.join(WORKSPACE, "products", "*.html"))
    cleaned_count = 0

    for p in all_pages:
        rel = os.path.relpath(p, WORKSPACE)
        with open(p, "r", encoding="utf-8") as fp:
            c = fp.read()
        
        if "fonts.googleapis.com" in c or "fonts.gstatic.com" in c:
            # Remove link tags referencing google fonts
            c = re.sub(r'<link\b[^>]*fonts\.googleapis\.com[^>]*>\s*', '', c)
            c = re.sub(r'<link\b[^>]*fonts\.gstatic\.com[^>]*>\s*', '', c)
            
            with open(p, "w", encoding="utf-8") as fp:
                fp.write(c)
            cleaned_count += 1
            print(f"  ✓ Cleaned external fonts from: {rel}")

    print(f"\nTotal files cleaned: {cleaned_count}")

if __name__ == "__main__":
    clean_external_fonts()
