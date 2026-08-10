import os
import shutil

products = [
    'antiox.png',
    'attenaid.png',
    'brewstabaid_psep.png',
    'carraflocaid.png',
    'fermaid_b.png',
    'fermaid_bf.png',
    'flocaid_s.png',
    'foamaid.png',
    'gristsolubaid.png',
    'mashaid_a.png',
    'mashaid_gx.png',
    'mashaid_pag.png',
    'oxynilaid.png',
    'quickstabaid_a.png',
    'shineaid.png'
]

source_images = [
    'brewery-1.jpg',
    'microbrewery.jpg',
    'beverages.jpg',
    'microbial.jpg',
    'wine.jpg',
    'Bread.jpg',
    'cake.jpg',
    'chacolate.jpg',
    'meat-1.jpg',
    'pasta-1.jpg'
]

for i, prod in enumerate(products):
    src = "assets/images/" + source_images[i % len(source_images)]
    dest = "assets/images/" + prod
    shutil.copyfile(src, dest)
    print(f"Copied {src} to {dest}")
