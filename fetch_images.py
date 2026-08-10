import os
import glob
import urllib.request
import re

ignored_files = ['index.html', 'about.html', 'industry.html', 'services.html', 'contact.html', 'careers.html', 'privacy-policy.html', 'contract_manufacturing.html', 'troubleshooting.html', 'AIRBLISS_Brand_Guidelines.html', 'praras_brand_kit.html', 'praras_v2.html']

def get_image_from_live(slug):
    url = f'https://www.prarasbiosciences.com/{slug}/'
    print(f"Fetching {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        images = re.findall(r'<img[^>]+src=\"([^\"]+)\"', html)
        for img in images:
            if 'dummy.png' not in img and 'logo' not in img.lower() and 'pixel.png' not in img and 'slider_bg' not in img and 'facebook.com' not in img:
                return img
    except Exception as e:
        print(f"Error fetching {slug}: {e}")
    return None

def download_image(img_url, local_path):
    if img_url.startswith('//'):
        img_url = 'https:' + img_url
    print(f"Downloading {img_url} to {local_path}")
    try:
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        return True
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")
        return False

for filepath in glob.glob('*.html'):
    basename = os.path.basename(filepath)
    if basename in ignored_files:
        continue
    
    slug = basename.replace('.html', '')
    img_url = get_image_from_live(slug)
    
    if img_url:
        img_name = img_url.split('/')[-1]
        local_img_path = f"assets/images/{img_name}"
        
        if not os.path.exists(local_img_path):
            download_image(img_url, local_img_path)
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # find insertion point
        # After <div class="sec-hd">...</div>
        # But sec-hd might be complex. Let's look for <div class="sec-body"
        insert_marker = '<div class="sec-body"'
        
        if insert_marker in content and f'src="{local_img_path}"' not in content:
            img_tag = f'<img src="{local_img_path}" alt="{slug}" style="width:100%; max-width:800px; height:auto; border-radius:12px; margin-bottom:2rem; box-shadow:var(--sh-card);">\n'
            # Insert right before <div class="sec-body"
            content = content.replace(insert_marker, img_tag + insert_marker)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath} with image {img_name}")
        else:
            print(f"Could not insert image or already inserted for {filepath}")
    else:
        print(f"No image found for {filepath}")
