# Praras Biosciences - Website Maintenance Guide

This document provides instructions on how to manage the source code, deploy changes, and update content for the Praras Biosciences static website.

## 1. Repository Structure

The website is a static site built with HTML, CSS, and JS, along with a lightweight Python build script.

*   `*.html`: Individual page content (e.g., `index.html`, `about.html`, `biscuits-cookies.html`).
*   `templates/`: Contains `header.html` and `footer.html`. These are shared across all pages.
*   `assets/`: Contains CSS, JS, and image files.
*   `build_static.py`: A Python script that injects the shared header and footer into all HTML pages.
*   `mailer.php`: Handles the contact form submission.

### What NOT to commit (Add to `.gitignore`)
Ensure your repository has a `.gitignore` file with the following to prevent clutter and keep the repo clean:
```
venv/
__pycache__/
*.txt
*.log
.DS_Store
```
*Note: Since the repository is public, ensure no API keys or SMTP passwords are ever hardcoded in the PHP files or JS scripts.*

---

## 2. Content Update Guide

### Updating Page Content (Text, Images)
1. Open the specific HTML file for the page you want to edit (e.g., `biscuits-cookies.html`).
2. Modify the text or image `src` paths inside the `<main>` or content area of the page.
3. **Important:** Do not modify the code inside the `<header>` or the `<footer class="site-footer">` sections directly in these files, as they will be overwritten by the build script.

### Updating the Header or Footer
1. Open `templates/header.html` or `templates/footer.html`.
2. Make your desired changes (e.g., updating navigation links, changing a phone number).
3. Save the file.
4. Run the build script to apply changes to all pages:
   ```bash
   python3 build_static.py
   ```
   *(This will inject the updated header/footer into all `*.html` files in the root directory).*

### Adding New Images
1. Place the new image in the appropriate folder under `assets/` (or `images/` if configured).
2. Reference the image in your HTML file: `<img src="assets/images/new-image.jpg" alt="...">`.

---

## 3. Deployment Workflow

The site is configured to auto-deploy whenever changes are pushed to the `main` branch on GitHub.

### Step-by-Step Deployment:
1. **Make your changes** to the HTML files or templates locally.
2. **Run the build script** (if you changed the header/footer):
   ```bash
   python3 build_static.py
   ```
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Updated product descriptions on cookies page"
   ```
4. **Push to GitHub**:
   ```bash
   git push origin main
   ```

Once pushed, the automated deployment process (e.g., GitHub Actions or your hosting provider) will automatically pull the latest code and update the live website within a few minutes.
