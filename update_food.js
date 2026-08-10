const fs = require('fs');
const xlsx = require('xlsx');
const cheerio = require('cheerio');
const path = require('path');

// Read the excel file
const wb = xlsx.readFile('food.xlsx');
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

// Filter for food items
const foodItems = data.filter(item => item.Industry === 'Food');

// Map 'where product is used' to html files
const pageMap = {
    'Wafers': 'wafers.html',
    'Biscuits / Cookies': 'biscuits-cookies.html',
    'Cake': 'preccel-93.html',
    'Egg-free Nougat': 'egg-free-nougat.html',
    'Pasta & Noodles': 'pasta-and-noodles.html',
    'Extruded Fried Snacks': 'extruded-fried-snacks.html',
    'Mayonnaise': 'mayonnaise.html',
    'Meat': 'meat.html',
    'Anti-Hangover': 'a-hango.html'
};

// Group items by page
const itemsByPage = {};
foodItems.forEach(item => {
    const usage = item['where product is used'];
    if (pageMap[usage]) {
        const page = pageMap[usage];
        if (!itemsByPage[page]) itemsByPage[page] = [];
        itemsByPage[page].push(item);
    }
});

// Create product card HTML
function createProductCard(item, cat) {
    const name = item['Product Name'] || '';
    const nameFormatted = name.replace('®', '<sup>®</sup>');
    const whereProductIsUsed = item['where product is used'] ? "<li><strong>Where product is used:</strong> " + item['where product is used'] + "</li>" : '';
    const content = item['Content'] ? "<li><strong>Nature:</strong> " + item['Content'] + "</li>" : '';
    const activity = item['Activity'] ? "<li><strong>Activity:</strong> " + item['Activity'] + "</li>" : '';
    const func = item['Function'] ? "<li><strong>Function:</strong> " + item['Function'] + "</li>" : '';
    const dosage = item['Dosage'] ? "<li><strong>Dosage:</strong> " + item['Dosage'] + "</li>" : '';
    
    // Generate an SVG for the packaging
    let imgName = name.toLowerCase().replace(/®/g, '').replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    if (imgName.endsWith('_')) imgName = imgName.slice(0, -1);
    let imgSrc = "assets/images/" + imgName + ".svg";
    
    // Split name for SVG if it's too long
    let nameParts = [];
    let currentPart = "";
    const words = name.replace('®', '').split(' ');
    for(let word of words) {
        if((currentPart + " " + word).length > 12) {
            if(currentPart) nameParts.push(currentPart);
            currentPart = word;
        } else {
            currentPart = currentPart ? currentPart + " " + word : word;
        }
    }
    if(currentPart) nameParts.push(currentPart);
    
    let textElements = "";
    let yPos = 210;
    nameParts.forEach(part => {
        textElements += `<text x="200" y="${yPos}" font-family="sans-serif" font-weight="bold" font-size="24" fill="#333333" text-anchor="middle">${part}</text>\n`;
        yPos += 28;
    });

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="0" dy="15" stdDeviation="15" flood-opacity="0.15"/>
        </filter>
    </defs>
    <rect width="400" height="400" fill="#ffffff" />
    <rect x="90" y="40" width="220" height="320" rx="20" ry="20" fill="url(#grad)" filter="url(#shadow)" />
    <rect x="90" y="320" width="220" height="40" rx="0" ry="0" fill="#8a1d1e" />
    <circle cx="200" cy="110" r="45" fill="#8a1d1e" />
    <text x="200" y="117" font-family="sans-serif" font-weight="bold" font-size="34" fill="#ffffff" text-anchor="middle">P</text>
    ${textElements}
    <line x1="130" y1="${yPos}" x2="270" y2="${yPos}" stroke="#8a1d1e" stroke-width="3"/>
    <text x="200" y="${yPos + 25}" font-family="sans-serif" font-weight="bold" font-size="12" fill="#777777" text-anchor="middle" letter-spacing="1.5">PREMIUM QUALITY</text>
</svg>`;

    fs.writeFileSync(path.join(__dirname, imgSrc), svgContent);
    
    let description = item['Function'] ? item['Function'].split(',')[0] + '...' : '';

    let urlName = name.toLowerCase().replace(/®/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    if (urlName.endsWith('-')) urlName = urlName.slice(0, -1);
    let pageLink = `product-${urlName}.html`;

    return "\n" +
"                <div class=\"prod-card\" style=\"flex-direction: column; align-items: stretch; padding: 0;\">\n" +
"                  <div style=\"position: relative; overflow: hidden; height: 320px; display: flex; flex-direction: column; align-items: center;\">\n" +
"                    <a href=\"" + pageLink + "\" style=\"display: block; width: 100%;\">\n" +
"                      <img src=\"" + imgSrc + "\" alt=\"" + name + "\" style=\"width: 100%; height: 260px; object-fit: contain; padding: 1.5rem; display: block; border-right: 1px solid var(--c-border); transition: transform 0.3s;\" onmouseover=\"this.style.transform='scale(1.05)'\" onmouseout=\"this.style.transform='scale(1)'\">\n" +
"                    </a>\n" +
"                    <div style=\"font-size: 0.75rem; color: #888; text-align: center; padding: 0 1rem 1rem 1rem; border-right: 1px solid var(--c-border);\">Disclaimer: Packaging in images is for visual representation only and may not reflect actual product packaging.</div>\n" +
"                  </div>\n" +
"                  <div style=\"padding: 2.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center;\">\n" +
"                    <div class=\"prod-cat\" style=\"color: var(--c-primary);\">" + cat + "</div>\n" +
"                    <h3 class=\"prod-h\" style=\"color: var(--c-ink); font-size: 2.5rem; margin-bottom: 1rem;\"><a href=\"" + pageLink + "\" style=\"text-decoration: none; color: inherit; transition: color 0.2s;\" onmouseover=\"this.style.color='var(--c-primary)'\" onmouseout=\"this.style.color='inherit'\">" + nameFormatted + "</a></h3>\n" +
"                    <p class=\"prod-p\" style=\"margin-bottom: 1.5rem; font-size: 1.05rem;\">" + description + "</p>\n" +
"                    <ul class=\"feat-list\" style=\"margin-bottom: 2.5rem;\">\n" +
"                      " + whereProductIsUsed + "\n" +
"                      " + content + "\n" +
"                      " + activity + "\n" +
"                      " + func + "\n" +
"                      " + dosage + "\n" +
"                    </ul>\n" +
"                    <div style=\"margin-top: auto;\">\n" +
"                      <button class=\"btn-quote\" data-product=\"" + name + "\" style=\"background: var(--c-primary); color: #fff; padding: 1rem 2rem; border-radius: 999px; font-weight: 700; transition: all var(--transition); cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; border: none; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(138,29,30,0.2);\">\n" +
"                        Get Quote <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"12 5 19 12 12 19\"></polyline></svg>\n" +
"                      </button>\n" +
"                    </div>\n" +
"                  </div>\n" +
"                </div>";
}

// Update each page
for (const [page, items] of Object.entries(itemsByPage)) {
    const filepath = path.join(__dirname, page);
    if (fs.existsSync(filepath)) {
        console.log("Updating " + page + " with " + items.length + " items...");
        const html = fs.readFileSync(filepath, 'utf8');
        const $ = cheerio.load(html, { decodeEntities: false });
        
        let cardsHtml = '';
        items.forEach(item => {
            const cat = item['Sub Industry'] ? item['Sub Industry'] + " Solution" : 'Food Solution';
            cardsHtml += createProductCard(item, cat);
        });
        
        // Find the prod-grid
        const grid = $('.prod-grid');
        if (grid.length > 0) {
            grid.empty();
            grid.append(cardsHtml);
            fs.writeFileSync(filepath, $.html());
            console.log("Successfully updated " + page + ".");
        } else {
            console.log("Could not find .prod-grid in " + page + ".");
        }
    }
}
