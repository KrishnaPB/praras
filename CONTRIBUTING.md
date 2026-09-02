# Developer & Authoring Workflow Guide

This document outlines the standard engineering workflows for maintaining **Praras Biosciences** and **Airbliss** web applications with zero risk of regressions, broken links, or menu misalignments.

---

## 1. Single Source of Truth (Components)

Never manually edit headers, footers, or search modals across individual `.html` files. Instead, edit the canonical template in `components/`:

| Component File | Content Managed |
| :--- | :--- |
| `components/site-header.html` | Brand switcher, logo SVGs, main nav links, desktop mega menu, and mobile drawer. |
| `components/site-footer.html` | Corporate credentials, quick links, Airbliss switcher, copyright, and legal badges. |
| `components/quote-drawer.html` | Global sample request & quote inquiry drawer form. |
| `components/search-modal.html` | Interactive search dialog (Ctrl + K). |

### How to Apply Component Updates
After editing any file in `components/`, run:
```bash
python3 tools/sync_components.py
```
This automatically propagates changes across all 102 pages with correct relative root paths (`./` for root pages, `../` for product detail pages).

---

## 2. Scoped CSS Architecture

To ensure styling one component never alters or breaks another, all styles are organized into strictly scoped modular stylesheets:

- `assets/css/site-nav.css`: Navigation, mega menu, brand toggle, and mobile drawer.
- `assets/css/product-cards.css`: 2-column, 3-column grids and product specifications.
- `assets/css/quote-drawer.css`: Modal drawers and forms.
- `assets/css/site-core.css`: Foundation design tokens, typography, and utility classes.

---

## 3. Automated Validation & Safety Suite

Before pushing any changes, run the automated test suite:
```bash
python3 tools/test_regression.py
```
This verifies:
1. **Component Parity**: All 102 pages have valid canonical components.
2. **Sitemap Integrity**: Validates `sitemap.xml` against active filesystem targets.
3. **Schema.org Verification**: Validates syntax of all JSON-LD scripts.
4. **Internal Link Crawl**: Crawls 6,800+ links and ensures **0 broken links**.

---

## 4. Git Pre-Push Guard

A pre-push hook is installed in `.git/hooks/pre-push`. Whenever you run `git push origin main`, the regression suite runs automatically. If any broken link or structural mismatch is detected, the push is prevented until fixed.
