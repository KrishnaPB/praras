import re
import os

replacements = {
    'wine.html': [
        (r'<img src="assets/images/placeholder_product\.png" alt="FLOCAID® EG"[^>]*>', '<img src="assets/images/flocaid_eg.png" alt="FLOCAID® EG" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 2rem; display: block;">'),
        (r'<img src="assets/images/placeholder_product\.png" alt="AIDFERM® W"[^>]*>', '<img src="assets/images/aidferm_w.png" alt="AIDFERM® W" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 2rem; display: block;">')
    ],
    'wafers.html': [
        (r'<img src="assets/images/placeholder_product\.png" alt="BISCAMAZE® CW"[^>]*>', '<img src="assets/images/biscamaze_cw.png" alt="BISCAMAZE® CW" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 2rem; display: block;">')
    ],
    'bread-buns-pizza-base.html': [
        (r'<img src="assets/images/placeholder_product\.png" alt="FLOUR FORTE"[^>]*>', '<img src="assets/images/flour_forte.png" alt="FLOUR FORTE" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 2rem; display: block;">')
    ]
}

for file, file_reps in replacements.items():
    filepath = '/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com/' + file
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old_pattern, new_img in file_reps:
            # We don't know the exact current image tag (it might be biscamaze_lf.png or something else)
            # Actually, I should just replace the image inside the specific product card.
            # Let's do a more robust replacement using the product name.
            pass

# Let's write a better replacement script
