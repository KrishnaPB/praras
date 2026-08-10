import re
import sys

def update_hero(filename, new_image):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for hero banner style with background image
    pattern = r"background:\s*url\('assets/images/hero-bg\.jpg'\)\s*center/cover\s*no-repeat;"
    if re.search(pattern, content):
        content = re.sub(pattern, f"background: url('assets/images/{new_image}') center/cover no-repeat; position: relative; overflow: hidden;", content)
    else:
        # try without single quotes
        pattern2 = r'background:\s*url\("assets/images/hero-bg\.jpg"\)\s*center/cover\s*no-repeat;'
        if re.search(pattern2, content):
            content = re.sub(pattern2, f"background: url('assets/images/{new_image}') center/cover no-repeat; position: relative; overflow: hidden;", content)
        else:
             # try generic replacement if inline style exists
             pattern3 = r"url\(['\"]?assets/images/hero-bg\.jpg['\"]?\)"
             if re.search(pattern3, content):
                 content = re.sub(pattern3, f"url('assets/images/{new_image}')", content)

    # Some files use beverages_hero.png instead of hero-bg.jpg
    pattern_bev = r"background:\s*url\('assets/images/beverages_hero\.png'\)\s*center/cover\s*no-repeat;"
    if re.search(pattern_bev, content):
        content = re.sub(pattern_bev, f"background: url('assets/images/{new_image}') center/cover no-repeat; position: relative; overflow: hidden;", content)

    # Some files use biscuits_hero.png
    pattern_bisc = r"background:\s*url\('assets/images/biscuits_hero\.png'\)\s*center/cover\s*no-repeat;"
    if re.search(pattern_bisc, content):
         content = re.sub(pattern_bisc, f"background: url('assets/images/{new_image}') center/cover no-repeat; position: relative; overflow: hidden;", content)

    # Blog might use worldclass_hero.png
    pattern_world = r"url\(['\"]?assets/images/worldclass_hero\.png['\"]?\)"
    if re.search(pattern_world, content):
         content = re.sub(pattern_world, f"url('assets/images/{new_image}')", content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename} with {new_image}")

if len(sys.argv) == 3:
    update_hero(sys.argv[1], sys.argv[2])
