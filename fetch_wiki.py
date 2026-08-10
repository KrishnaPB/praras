import urllib.request
import json
import os

products = {
    'antiox.png': 'fermentation yeast',
    'attenaid.png': 'wort beer',
    'brewstabaid_psep.png': 'clear beer glass',
    'carraflocaid.png': 'brewery tank',
    'fermaid_b.png': 'baker yeast',
    'fermaid_bf.png': 'beer foam',
    'flocaid_s.png': 'beer yeast',
    'foamaid.png': 'beer head foam',
    'gristsolubaid.png': 'malt grist',
    'mashaid_a.png': 'mashing beer',
    'mashaid_gx.png': 'lautering beer',
    'mashaid_pag.png': 'mash tun',
    'oxynilaid.png': 'bottled beer',
    'quickstabaid_a.png': 'clear golden beer',
    'shineaid.png': 'shiny beer glass'
}

for filename, query in products.items():
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=0&gsrlimit=1&pithumbsize=800"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req).read().decode('utf-8')
        data = json.loads(response)
        pages = data.get('query', {}).get('pages', {})
        if pages:
            page = list(pages.values())[0]
            if 'thumbnail' in page:
                img_url = page['thumbnail']['source']
                print(f"Downloading {img_url} for {filename}")
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req) as img_res, open(f"assets/images/{filename}", 'wb') as f:
                    f.write(img_res.read())
            else:
                print(f"No thumbnail found for {query}")
        else:
            print(f"No pages found for {query}")
    except Exception as e:
        print(f"Error fetching {query}: {e}")
