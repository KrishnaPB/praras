#!/usr/bin/env python3
"""
Clean extra empty lines and normalize component boundaries across all pages
"""

import os
import glob
import re

WORKSPACE = "/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com"

def normalize_whitespace():
    all_pages = glob.glob(os.path.join(WORKSPACE, "*.html")) + glob.glob(os.path.join(WORKSPACE, "products", "*.html"))
    for p in all_pages:
        with open(p, "r", encoding="utf-8") as fp:
            c = fp.read()
        
        # Replace 3+ consecutive newlines with 2 newlines
        c = re.sub(r'\n{3,}', '\n\n', c)
        
        with open(p, "w", encoding="utf-8") as fp:
            fp.write(c)

    # Also clean components
    for cp in glob.glob(os.path.join(WORKSPACE, "components", "*.html")):
        with open(cp, "r", encoding="utf-8") as fp:
            c = fp.read()
        c = c.strip()
        with open(cp, "w", encoding="utf-8") as fp:
            fp.write(c)

    print("Normalized whitespace across all pages and components.")

if __name__ == "__main__":
    normalize_whitespace()
