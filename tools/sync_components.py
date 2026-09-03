#!/usr/bin/env python3
"""
Component Synchronization Engine
Single Source of Truth for Praras Biosciences & Airbliss Pages
Synchronizes header, mega menu, footer, quote drawer, and search modal across all 102 pages.
"""

import os
import glob
import re

WORKSPACE = "/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com"
COMPONENTS_DIR = os.path.join(WORKSPACE, "components")

def load_component(name):
    path = os.path.join(COMPONENTS_DIR, name)
    with open(path, "r", encoding="utf-8") as fp:
        return fp.read()

HEADER_TPL = load_component("site-header.html")
FOOTER_TPL = load_component("site-footer.html")
DRAWER_TPL = load_component("quote-drawer.html")
SEARCH_TPL = load_component("search-modal.html")

def render_component(tpl, is_product=False):
    root_prefix = "../" if is_product else ""
    return tpl.replace("{{ROOT}}", root_prefix)

def sync_page(filepath, is_product=False):
    with open(filepath, "r", encoding="utf-8") as fp:
        content = fp.read()

    orig_content = content
    rendered_header = render_component(HEADER_TPL, is_product)
    rendered_footer = render_component(FOOTER_TPL, is_product)
    rendered_drawer = render_component(DRAWER_TPL, is_product)
    rendered_search = render_component(SEARCH_TPL, is_product)

    def replace_section(src, start_tag, end_tag, replacement):
        s_idx = src.find(start_tag)
        if s_idx != -1:
            e_idx = src.find(end_tag, s_idx)
            if e_idx != -1:
                return src[:s_idx] + replacement + src[e_idx + len(end_tag):]
        return src

    # 1. Sync Header
    if "<!-- START: SITE-HEADER -->" in content and "<!-- END: SITE-HEADER -->" in content:
        content = replace_section(content, "<!-- START: SITE-HEADER -->", "<!-- END: SITE-HEADER -->", rendered_header)
    else:
        header_pattern = re.compile(r'(<!-- BRAND SWITCHER STRIP -->.*?)?<header class="site-nav".*?</header>', re.DOTALL)
        if header_pattern.search(content):
            content = header_pattern.sub(lambda m: rendered_header, content, count=1)

    # 2. Sync Footer
    if "<!-- START: SITE-FOOTER -->" in content and "<!-- END: SITE-FOOTER -->" in content:
        content = replace_section(content, "<!-- START: SITE-FOOTER -->", "<!-- END: SITE-FOOTER -->", rendered_footer)
    else:
        footer_pattern = re.compile(r'<!-- ════ SHARED FOOTER ════ -->.*?<footer class="site-footer".*?</footer>', re.DOTALL)
        if footer_pattern.search(content):
            content = footer_pattern.sub(lambda m: rendered_footer, content, count=1)
        else:
            f2 = re.compile(r'<footer class="site-footer".*?</footer>', re.DOTALL)
            if f2.search(content):
                content = f2.sub(lambda m: rendered_footer, content, count=1)

    # 3. Sync Quote Drawer
    if "<!-- START: QUOTE-DRAWER -->" in content and "<!-- END: QUOTE-DRAWER -->" in content:
        content = replace_section(content, "<!-- START: QUOTE-DRAWER -->", "<!-- END: QUOTE-DRAWER -->", rendered_drawer)
    else:
        drawer_pattern = re.compile(r'(<!-- ════ QUOTE DRAWER ════ -->\s*)?(<div class="quote-overlay".*?</aside>)', re.DOTALL)
        if drawer_pattern.search(content):
            content = drawer_pattern.sub(lambda m: rendered_drawer, content, count=1)

    # 4. Sync Search Modal
    if "<!-- START: SEARCH-MODAL -->" in content and "<!-- END: SEARCH-MODAL -->" in content:
        content = replace_section(content, "<!-- START: SEARCH-MODAL -->", "<!-- END: SEARCH-MODAL -->", rendered_search)
    else:
        search_pattern = re.compile(r'<div class="site-search-overlay".*?</div>\s*</div>', re.DOTALL)
        if search_pattern.search(content):
            content = search_pattern.sub(lambda m: rendered_search, content, count=1)

    if content != orig_content:
        with open(filepath, "w", encoding="utf-8") as fp:
            fp.write(content)
        return True
    return False

def main():
    root_pages = glob.glob(os.path.join(WORKSPACE, "*.html"))
    product_pages = glob.glob(os.path.join(WORKSPACE, "products", "*.html"))

    updated_root = 0
    updated_prod = 0

    for p in root_pages:
        if sync_page(p, is_product=False):
            updated_root += 1

    for p in product_pages:
        if sync_page(p, is_product=True):
            updated_prod += 1

    print(f"==================================================")
    print(f"COMPONENT SYNCHRONIZATION SUMMARY")
    print(f"==================================================")
    print(f"  ✓ Root Pages Processed:     {len(root_pages)} (Updated: {updated_root})")
    print(f"  ✓ Product Pages Processed:  {len(product_pages)} (Updated: {updated_prod})")
    print(f"  ✓ Total Pages Verified:     {len(root_pages) + len(product_pages)}")
    print(f"==================================================")

if __name__ == "__main__":
    main()
