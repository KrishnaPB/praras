const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const foodPages = [
    'wafers.html',
    'preccel-93.html',
    'egg-free-nougat.html',
    'pasta-and-noodles.html',
    'extruded-fried-snacks.html',
    'mayonnaise.html',
    'meat.html',
    'a-hango.html'
];

// biscuits-cookies.html is the source of truth, but we need to fix its double-wrapping first
let biscuitsHtml = fs.readFileSync(path.join(__dirname, 'biscuits-cookies.html'), 'utf8');
const bOverviewRegex = /<!-- OVERVIEW -->([\s\S]*?)<!-- PRODUCT RANGE & BROCHURE -->/;
let bMatch = biscuitsHtml.match(bOverviewRegex);
if (bMatch) {
    let bContent = bMatch[1];
    // If it has double section, we need to extract the inner one
    const $b = cheerio.load(bContent, null, false);
    // Find the div with linear-gradient
    const gradientDiv = $b('div[style*="linear-gradient(145deg"]').parent().parent();
    
    if (gradientDiv.length > 0) {
        // It's the inner section
        const innerSection = $b('section').last();
        if (innerSection.length > 0) {
            // Reconstruct the correct overview for biscuits-cookies
            const fixedBiscuitsOverview = `\n  <!-- OVERVIEW -->\n` + $b.html(innerSection) + `\n  <!-- PRODUCT RANGE & BROCHURE -->\n`;
            biscuitsHtml = biscuitsHtml.replace(bOverviewRegex, fixedBiscuitsOverview);
            fs.writeFileSync(path.join(__dirname, 'biscuits-cookies.html'), biscuitsHtml, 'utf8');
            console.log('Fixed biscuits-cookies.html double wrapping');
        }
    }
}

// Now apply this design to all other pages
foodPages.forEach(page => {
    const filepath = path.join(__dirname, page);
    if (fs.existsSync(filepath)) {
        let html = fs.readFileSync(filepath, 'utf8');
        const overviewRegex = /<!-- OVERVIEW -->([\s\S]*?)<!-- PRODUCT RANGE & BROCHURE -->/;
        const match = html.match(overviewRegex);
        
        if (match) {
            const overviewHtml = match[1];
            const $ = cheerio.load(overviewHtml, null, false);
            
            // Extract content
            const title = $('h2').first().text().trim() || 'The Perfect Solution';
            
            // Gather paragraphs and lists
            let paragraphs = [];
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                if (text) {
                    paragraphs.push(text);
                }
            });
            
            let listItems = [];
            $('li').each((i, el) => {
                const text = $(el).text().trim();
                if (text) {
                    listItems.push(text);
                }
            });
            
            // We need at least one paragraph for the left, and maybe one for the right
            let leftParagraphs = [];
            let rightParagraph = "Seamlessly integrate our solutions into your manufacturing process to boost efficiency and deliver consistent, perfect results every time.";
            
            if (paragraphs.length === 1) {
                leftParagraphs.push(paragraphs[0]);
            } else if (paragraphs.length > 1) {
                // All but the last go to the left
                leftParagraphs = paragraphs.slice(0, paragraphs.length - 1);
                // Last goes to the right card
                rightParagraph = paragraphs[paragraphs.length - 1];
            }
            
            // Build left paragraphs HTML
            let leftHtml = '';
            leftParagraphs.forEach(p => {
                leftHtml += `\n            <p style="color: var(--c-muted); line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.05rem;">${p}</p>`;
            });
            
            // Build checkmarks HTML if there are list items
            let checkmarksHtml = '';
            if (listItems.length > 0) {
                checkmarksHtml = `\n            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">`;
                listItems.forEach(li => {
                    checkmarksHtml += `\n              <span style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #fff; border: 1px solid var(--c-border); border-radius: 12px; font-weight: 600; color: var(--c-ink); box-shadow: 0 4px 6px rgba(0,0,0,0.02);"><span style="color: var(--c-primary);">✔</span> ${li}</span>`;
                });
                checkmarksHtml += `\n            </div>`;
            }
            
            // Construct the final HTML based on the biscuits-cookies design
            const newOverview = `
  <!-- OVERVIEW -->
  <section class="section">
    <div class="wrap">
      <div style="margin-bottom: 2rem;">
         <h2 class="h2">${title}</h2>
      </div>
      <div style="background: linear-gradient(145deg, #ffffff, #f9fafb); border-radius: 24px; padding: clamp(2rem, 5vw, 4rem); box-shadow: 0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05); position: relative; overflow: hidden; border: 1px solid rgba(0,0,0,0.03);">
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(138,29,30,0.05) 0%, rgba(255,255,255,0) 70%); border-radius: 50%;"></div>
        <div style="display: flex; flex-wrap: wrap; gap: 4rem; align-items: center; position: relative; z-index: 1;">
          <div style="flex: 1; min-width: 300px;">
            <div style="display: inline-block; padding: 0.5rem 1rem; background: rgba(138,29,30,0.08); color: var(--c-primary); border-radius: 999px; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1.5rem;">Industry Leading Quality</div>
            ${leftHtml}
            ${checkmarksHtml}
          </div>
          <div style="flex: 0 1 400px; min-width: 300px; position: relative;">
            <div style="background: var(--c-primary); color: #fff; border-radius: 24px; padding: 3rem; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(138,29,30,0.2);">
              <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.9; flex-shrink: 0;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0; white-space: nowrap;">Optimize Costs &amp; Quality</h3>
              </div>
              <p style="color: rgba(255,255,255,0.9); line-height: 1.6; font-size: 1.05rem; margin: 0;">
                ${rightParagraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- PRODUCT RANGE & BROCHURE -->
  `;
            
            const finalHtml = html.replace(overviewRegex, newOverview);
            
            fs.writeFileSync(filepath, finalHtml, 'utf8');
            console.log(`Applied biscuits-cookies design to ${page}`);
        }
    }
});
