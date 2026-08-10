import re
import os

files = [
    "biscuits-cookies.html",
    "cake.html",
    "bread-buns-pizza-base.html",
    "wafers.html",
    "meat.html",
    "pasta-and-noodles.html",
    "egg-free-nougat.html",
    "a-hango.html",
    "extruded-fried-snacks.html",
    "mayonnaise.html",
    "breweries.html",
    "distilleries.html",
    "wine.html",
    "microbrewery.html",
    "fruit-based.html",
    "milk-based.html",
    "chocolate-coffee.html",
    "microbial-solutions.html"
]

for file in files:
    filepath = os.path.join('/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com', file)
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to remove the <div class="prod-page-visual" ...> ... </div> block entirely.
    # It usually spans 3-5 lines. We can use a regex that matches from <div class="prod-page-visual" up to the closing </div> of that div.
    # Since HTML can be nested, we should be careful, but we know it only contains an <img> tag.
    
    # Let's match the block.
    # The div starts with <div class="prod-page-visual"
    # and ends with </div>
    # and inside it is an <img ...> tag.
    
    pattern = re.compile(r'\s*<div class="prod-page-visual"[^>]*>\s*<img[^>]*>\s*</div>', re.MULTILINE)
    
    new_content, count = pattern.subn('', content)
    
    if count > 0:
        print(f"Removed from {file}")
        
        # Optionally, remove the sci-split class so it doesn't leave an empty grid column
        new_content = new_content.replace('<div class="sci-split">', '<div>')
        
        with open(filepath, 'w') as f:
            f.write(new_content)
    else:
        print(f"Not found in {file}")

