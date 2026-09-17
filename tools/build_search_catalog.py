#!/usr/bin/env python3
"""
Praras Biosciences & Airbliss - Master Product Search Catalog Builder
Scans all 72 HTML pages in products/*.html, extracts accurate metadata,
and compiles assets/data/products-search.json with 100% catalog parity.
"""

import os
import glob
import json
import re

WORKSPACE = "/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com"
PRODUCTS_DIR = os.path.join(WORKSPACE, "products")
OUTPUT_FILE = os.path.join(WORKSPACE, "assets", "data", "products-search.json")

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def build_catalog():
    product_files = sorted(glob.glob(os.path.join(PRODUCTS_DIR, "*.html")))
    print(f"Discovered {len(product_files)} product files in products/...")

    catalog = []

    for fpath in product_files:
        filename = os.path.basename(fpath)
        slug = filename[:-5]
        with open(fpath, "r", encoding="utf-8") as fp:
            html = fp.read()

        is_airbliss = slug.startswith("airbliss")

        # 1. Name / Title
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        if h1_match:
            name = clean_text(h1_match.group(1))
        else:
            name = slug.replace("-", " ").title()

        # 2. Tagline
        sub_match = re.search(r'class=["\'][^"\']*(?:wc-hero-sub|hero-sub|sub-title|tagline)[^"\']*["\'][^>]*>(.*?)</(?:p|div)>', html, re.DOTALL)
        if sub_match:
            tagline = clean_text(sub_match.group(1))
        else:
            tagline = ""

        # 3. Description
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html)
        if desc_match:
            description = clean_text(desc_match.group(1))
        else:
            description = tagline

        if not tagline and description:
            tagline = description.split(".")[0] + "."

        # 4. Category
        cat_match = re.search(r'"category":\s*"([^"]+)"', html)
        if cat_match:
            category = cat_match.group(1).strip()
        else:
            if is_airbliss:
                category = "Airbliss > Probiotic Hygiene"
            else:
                category = "Food & Beverages > Biosciences"

        # 5. Benefits & Highlights
        benefits = []
        # Check bento grid specs
        bento_matches = re.findall(r'<div class=["\']wc-bento-label["\'][^>]*>(.*?)</div>\s*<div class=["\']wc-bento-val["\'][^>]*>(.*?)</div>', html, re.DOTALL)
        for label, val in bento_matches:
            cl = clean_text(label)
            cv = clean_text(val)
            if cl and cv:
                benefits.append(f"{cl}: {cv}")

        # Check function card
        func_match = re.search(r'<p class=["\']wc-function-body["\'][^>]*>(.*?)</p>', html, re.DOTALL)
        if func_match:
            fn = clean_text(func_match.group(1))
            if fn and fn not in benefits:
                benefits.append(fn)

        # Check benefit pills/cards
        for bm in re.findall(r'<div[^>]*class=["\'][^"\']*(?:benefit-card|feature-item|highlight-item|ab-benefit)[^"\']*["\'][^>]*>(.*?)</div>', html, re.DOTALL):
            c = clean_text(bm)
            if 4 < len(c) < 140 and c not in benefits:
                benefits.append(c)

        # Fallback to list items in main content if still empty
        if not benefits:
            main_match = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
            if main_match:
                lis = re.findall(r'<li[^>]*>(.*?)</li>', main_match.group(1), re.DOTALL)
                for li in lis:
                    c = clean_text(li)
                    if 10 < len(c) < 140 and c not in benefits and not c.startswith("http"):
                        benefits.append(c)
                        if len(benefits) >= 4:
                            break

        # 6. Key Stats / Numbers
        stats = []
        stat_blocks = re.findall(r'<div[^>]*class=["\'][^"\']*(?:stat-num|wc-hero-stat-num)[^"\']*["\'][^>]*>(.*?)</div>\s*<div[^>]*class=["\'][^"\']*(?:stat-txt|wc-hero-stat-txt)[^"\']*["\'][^>]*>(.*?)</div>', html, re.DOTALL)
        for num, txt in stat_blocks:
            clean_stat = f"{clean_text(num)} {clean_text(txt)}".strip()
            if clean_stat and clean_stat not in stats:
                stats.append(clean_stat)

        # Also check performance meters
        for m_name, m_val in re.findall(r'<div class=["\']wc-meter-head["\'][^>]*>\s*<span>(.*?)</span>\s*<span class=["\']wc-meter-val["\']>(.*?)</span>', html, re.DOTALL):
            stat_str = f"{clean_text(m_name)}: {clean_text(m_val)}"
            if stat_str not in stats:
                stats.append(stat_str)

        if not stats:
            stats = ["100% Quality Assured", "Industrial Standard"]

        # 7. Brand
        brand_code = "ab" if is_airbliss else "pr"

        # 8. Keywords
        kw_parts = [
            name.lower(),
            slug.replace("-", " "),
            category.lower(),
            tagline.lower(),
            description.lower(),
            "airbliss" if is_airbliss else "praras biosciences",
            " ".join(b.lower() for b in benefits),
            " ".join(s.lower() for s in stats)
        ]
        keywords = " ".join(kw_parts)
        keywords = re.sub(r'[^\w\s]', ' ', keywords)
        keywords = re.sub(r'\s+', ' ', keywords).strip()

        item = {
            "id": slug,
            "name": name,
            "tagline": tagline,
            "category": category,
            "url": f"products/{filename}",
            "brand": brand_code,
            "description": description,
            "benefits": benefits[:5],
            "stats": stats[:4],
            "keywords": keywords
        }

        catalog.append(item)

    print(f"Successfully compiled {len(catalog)} products into search index.")
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        json.dump(catalog, out, indent=2, ensure_ascii=False)

    print(f"✓ Saved updated search catalog to {OUTPUT_FILE}")
    return len(catalog)

if __name__ == "__main__":
    count = build_catalog()
    assert count == 72, f"Expected 72 products, found {count}"
