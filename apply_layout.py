import re
import os

product_pages = [
    'wine.html', 'wafers.html', 'bread-buns-pizza-base.html', 'biscuits-cookies.html', 
    'extruded-fried-snacks.html', 'microbial-solutions.html', 'microbrewery.html', 
    'chocolate-coffee.html', 'pasta-and-noodles.html', 'breweries.html', 
    'milk-based.html', 'cake.html', 'fruit-based.html', 'meat.html', 
    'mayonnaise.html', 'egg-free-nougat.html', 'contract_manufacturing.html'
]

# Ensure we process them properly
for file_path in product_pages:
    if not os.path.exists(file_path):
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Change grid layout
    content = content.replace(
        '<div class="prod-grid" style="grid-template-columns: 1fr; display: grid; gap: 2rem;">',
        '<div class="prod-grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); display: grid; gap: 2rem;">'
    )

    # 2. Change card direction
    content = content.replace(
        'style="flex-direction: row; align-items: stretch; padding: 0;"',
        'style="flex-direction: column; align-items: stretch; padding: 0;"'
    )

    # 3. Change image container height
    content = content.replace(
        'style="flex: 0 0 45%; position: relative; overflow: hidden; min-height: 400px;"',
        'style="position: relative; overflow: hidden; height: 300px;"'
    )

    # 4. Change info container padding
    content = content.replace(
        'style="padding: 4rem; flex: 1; display: flex; flex-direction: column; justify-content: center;"',
        'style="padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;"'
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Reformatted {file_path}")
