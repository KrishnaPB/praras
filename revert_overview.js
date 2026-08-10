const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const foodPages = [
    'wafers.html',
    'biscuits-cookies.html',
    'preccel-93.html',
    'egg-free-nougat.html',
    'pasta-and-noodles.html',
    'extruded-fried-snacks.html',
    'mayonnaise.html',
    'meat.html',
    'a-hango.html'
];

foodPages.forEach(page => {
    const filepath = path.join(__dirname, page);
    if (fs.existsSync(filepath)) {
        let html = fs.readFileSync(filepath, 'utf8');
        
        const overviewRegex = /<!-- OVERVIEW -->([\s\S]*?)<!-- PRODUCT RANGE & BROCHURE -->/;
        const match = html.match(overviewRegex);
        
        if (match && match[1].includes('var(--glass-bg)')) {
            const overviewHtml = match[1];
            const $ = cheerio.load(overviewHtml, null, false);
            
            const title = $('h2').text() || 'The Perfect Solution';
            
            const pContainer = $('div[style*="padding-left: calc(48px + 1rem)"]');
            
            pContainer.find('p').each((i, el) => {
                $(el).removeAttr('style');
                $(el).attr('style', 'color: var(--c-muted); line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.05rem;');
            });
            
            pContainer.find('ul, ol').each((i, el) => {
                $(el).removeAttr('style');
            });
            
            const paragraphsHtml = pContainer.html();
            
            const originalOverview = `
  <!-- OVERVIEW -->
  <section class="section">
    <div class="wrap">
      <div>
        <div>
          <h2 class="h2" style="margin-bottom: 2rem;">${title}</h2>
          ${paragraphsHtml}
        </div>
      </div>
    </div>
  </section>
  `;
            
            const finalHtml = html.replace(overviewRegex, originalOverview + "<!-- PRODUCT RANGE & BROCHURE -->\n");
            
            fs.writeFileSync(filepath, finalHtml, 'utf8');
            console.log(`Reverted overview in ${page}`);
        }
    }
});
