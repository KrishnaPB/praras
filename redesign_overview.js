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
        
        // Use a regex to extract the overview section.
        // It typically starts with <!-- OVERVIEW --> and ends before <!-- PRODUCT RANGE & BROCHURE -->
        const overviewRegex = /<!-- OVERVIEW -->([\s\S]*?)<!-- PRODUCT RANGE & BROCHURE -->/;
        const match = html.match(overviewRegex);
        
        if (match) {
            const overviewHtml = match[1];
            const $ = cheerio.load(overviewHtml, null, false);
            
            // Extract the title and the paragraphs
            const title = $('h2').text() || 'The Perfect Solution';
            
            // Remove the h2 from the cheerio instance so we can grab just the paragraphs
            $('h2').remove();
            
            // Reformat all remaining paragraphs
            $('p').each((i, el) => {
                // Remove inline styles to apply new clean styles
                $(el).removeAttr('style');
                $(el).attr('style', 'color: var(--c-body); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.1rem;');
                // If the paragraph is completely empty, remove it
                if ($(el).text().trim() === '') {
                    $(el).remove();
                }
            });
            
            // Also grab any lists or other content that might be there
            $('ul, ol').each((i, el) => {
                $(el).removeAttr('style');
                $(el).attr('style', 'color: var(--c-body); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.1rem; padding-left: 1.5rem;');
            });
            
            const paragraphsHtml = $.html();
            
            // Build the new premium layout
            const newOverview = `
  <!-- OVERVIEW -->
  <section class="section" style="background: linear-gradient(135deg, var(--c-surface-alt) 0%, var(--c-page) 100%); position: relative; overflow: hidden; padding: 6rem 2.5rem;">
    <!-- Decorative background elements -->
    <div style="position:absolute; top: -20%; right: -10%; width: 50vw; height: 50vw; max-width: 600px; max-height: 600px; background: radial-gradient(circle, var(--c-primary-bg) 0%, transparent 70%); opacity: 0.8; pointer-events: none; border-radius: 50%;"></div>
    <div style="position:absolute; bottom: -10%; left: -5%; width: 40vw; height: 40vw; max-width: 500px; max-height: 500px; background: radial-gradient(circle, var(--c-accent-bg) 0%, transparent 70%); opacity: 0.6; pointer-events: none; border-radius: 50%;"></div>
    
    <div class="wrap" style="max-width: 1000px; margin: 0 auto; position: relative; z-index: 1;">
      <div style="background: var(--glass-bg); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); padding: 4rem 5rem; border-radius: 24px; box-shadow: var(--sh-card); border: 1px solid var(--glass-border); position: relative; overflow: hidden;">
        
        <!-- Subtle accent line -->
        <div style="position: absolute; top: 0; left: 5rem; width: 80px; height: 4px; background: linear-gradient(to right, var(--c-primary), var(--c-accent)); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"></div>
        
        <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 2rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--c-primary-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 5px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div>
            <span class="eyebrow" style="margin-bottom: 0.5rem; display: block;">Overview</span>
            <h2 class="h2" style="margin-bottom: 0; font-size: 2.25rem;">${title}</h2>
          </div>
        </div>
        
        <div style="padding-left: calc(48px + 1rem);">
          ${paragraphsHtml}
        </div>
        
      </div>
    </div>
  </section>
  <!-- PRODUCT RANGE & BROCHURE -->
  `;
            
            // Replace in the original html
            const finalHtml = html.replace(overviewRegex, newOverview);
            
            fs.writeFileSync(filepath, finalHtml, 'utf8');
            console.log(`Updated premium overview in ${page}`);
        } else {
            console.log(`Could not find OVERVIEW section in ${page}`);
        }
    }
});
