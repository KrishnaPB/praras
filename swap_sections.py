import os

filepath = '/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com/cake.html'

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Markers
product_range_marker = '<!-- PRODUCT RANGE & BROCHURE -->'
benefits_marker = '<!-- BENEFITS -->'
main_end_marker = '</main>'

if product_range_marker in html and benefits_marker in html and main_end_marker in html:
    part1, rest1 = html.split(product_range_marker, 1)
    part2, rest2 = rest1.split(benefits_marker, 1)
    part3, part4 = rest2.split(main_end_marker, 1)
    
    # We want: part1 + benefits + product range + main_end_marker + part4
    # Wait, the part3 (benefits) doesn't include the benefits_marker, so we must add it back.
    # Same for product_range_marker.
    
    new_html = (
        part1 + 
        benefits_marker + part3 + 
        product_range_marker + part2 + 
        main_end_marker + part4
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully swapped sections.")
else:
    print("Markers not found.")
