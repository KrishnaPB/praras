# Praras Biosciences & Airbliss — Website Architecture & Maintenance Guide

This document provides instructions on how to manage the source code, deploy updates, and maintain high-performance benchmarks for the **Praras Biosciences** and **Airbliss** web platform.

---

## 1. Repository Structure

The website is a static architecture built with HTML5, scoped CSS, modular JavaScript, and an automated Python component synchronization engine.

*   `*.html`: Root industry hub and corporate pages (e.g., `index.html`, `about.html`, `breweries.html`, `airbliss.html`).
*   `products/*.html`: 72 dedicated product detail pages.
*   `components/`: **Single Source of Truth** for global shared components:
    *   `site-header.html`: Global navigation, brand switcher (`Praras` / `Airbliss`), and mega menu.
    *   `site-footer.html`: Global footer, corporate credentials, credentials, and links.
    *   `quote-drawer.html`: B2B quote request and sample inquiry modal drawer with Cloudflare Turnstile and honeypot anti-spam.
    *   `search-modal.html`: Command palette search dialog (`Ctrl+K` / `Cmd+K`).
*   `assets/`: Modular stylesheets (`assets/css/`), scripts (`assets/js/`), and WebP images (`assets/images/`).
*   `tools/`: Automated quality assurance and synchronization engines:
    *   `tools/sync_components.py`: Propagates canonical components across all 103 pages.
    *   `tools/full_release_audit.py`: Validates DOM, HTML5, SEO, Schema, links, and assets.
    *   `tools/test_regression.py`: Crawls all 7,000+ internal links and verifies 0 broken links.
    *   `tools/test_ui_ux.py`: Verifies responsive breakpoints, typography, and modal ergonomics.
*   `mailer.php`: Handles inquiry dispatch, Turnstile validation, sanitization, and secure private lead storage.
*   `sitemap.xml`: Valid XML sitemap covering all 102 public production URLs.
*   `robots.txt`: Search crawler directives and sitemap declaration.

---

## 2. Content Update & Workflow Guide

### Updating Page Content (Text, Images)
1. Open the specific HTML file for the page you want to edit (e.g., `biscuits-cookies.html` or `products/fermaid-af.html`).
2. Modify text or images inside `<main id="main-content">`.
3. **Important:** Do NOT manually edit code between `<!-- START: SITE-HEADER -->` and `<!-- END: SITE-HEADER -->`, or between the footer/drawer component markers, as they are managed via the canonical templates in `components/`.

### Updating Navigation, Header, Footer, or Quote Drawer
1. Open the canonical component file in `components/`:
   - `components/site-header.html`
   - `components/site-footer.html`
   - `components/quote-drawer.html`
   - `components/search-modal.html`
2. Make your edits (use `{{ROOT}}` prefix for relative link resolution).
3. Propagate changes across all 103 pages by running:
   ```bash
   python3 tools/sync_components.py
   ```

---

## 3. Automated Quality Assurance Suite

Before pushing any changes, always run the automated QA test suite:

```bash
# 1. Full Release Readiness Audit (DOM, SEO, Schema, Links, Assets)
python3 tools/full_release_audit.py

# 2. Comprehensive Link & Parity Regression Crawl
python3 tools/test_regression.py

# 3. Responsive UI/UX Quality Verification
python3 tools/test_ui_ux.py
```

All tests must pass (`0 broken links`, `0 missing assets`, `100% component parity`).

---

## 4. Deployment Workflow

The site is configured to deploy when changes are pushed to the `main` branch.

### Step-by-Step Deployment:
1. Make changes to content or components.
2. Synchronize components if you touched `components/`:
   ```bash
   python3 tools/sync_components.py
   ```
3. Run the automated QA suite:
   ```bash
   python3 tools/full_release_audit.py
   ```
4. Commit and push:
   ```bash
   git add .
   git commit -m "feat/fix: description of update"
   git push origin main
   ```
A pre-push Git hook automatically executes `tools/test_regression.py` to prevent pushing any broken links or structural anomalies.
