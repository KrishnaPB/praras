import urllib.request
import re

html = urllib.request.urlopen("https://unsplash.com/s/photos/flour").read().decode('utf-8')
match = re.search(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+\?ixlib=[^"&\s]+&w=1080', html)
if match:
    url = match.group(0)
    print("Found url:", url)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response, open('assets/images/biscamaze_lf.png', 'wb') as out_file:
        out_file.write(response.read())
    print("Downloaded successfully.")
else:
    print("Not found.")
