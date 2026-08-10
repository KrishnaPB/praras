import re
import os

replacements = {
    'meat.html': "url('assets/images/meat_hero.png')",
    'pasta-and-noodles.html': "url('assets/images/pasta_hero.png')",
    'egg-free-nougat.html': "url('assets/images/nougat_hero.png')",
    'a-hango.html': "url('assets/images/ahango_hero.png')",
    'extruded-fried-snacks.html': "url('assets/images/snacks_hero.png')",
    'mayonnaise.html': "url('assets/images/mayo_hero.png')",
    'microbial-solutions.html': "url('assets/images/microbial_hero.png')",
}

for file, new_url in replacements.items():
    filepath = '/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com/' + file
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace placehold.co URL with new image URL
        content = re.sub(r"url\('https://placehold\.co/[^']+'\)", new_url, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file} with {new_url}")
