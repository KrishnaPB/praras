const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const PDFParser = require("pdf2json");

// Read food.xlsx
const wb = xlsx.readFile('food.xlsx');
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
const foodItems = data.filter(item => item.Industry === 'Food');

// Read food_Products directory
const pdsDir = path.join(__dirname, 'food_Products');
let pdsFiles = [];
if (fs.existsSync(pdsDir)) {
    pdsFiles = fs.readdirSync(pdsDir);
}

// Extract base layout from wafers.html
const baseHtml = fs.readFileSync('wafers.html', 'utf8');
const mainStartIndex = baseHtml.indexOf('<main id="main-content">');
const mainEndIndex = baseHtml.indexOf('</main>') + 7;
const headerContent = baseHtml.substring(0, mainStartIndex);
const footerContent = baseHtml.substring(mainEndIndex);

function parsePDF(pdfPath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => resolve("")); // Resolve empty on error to not block
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfParser.getRawTextContent());
        });
        pdfParser.loadPDF(pdfPath);
    });
}

function cleanPdfText(text) {
    if (!text) return '';
    // Remove page breaks
    let cleaned = text.replace(/----------------Page \(\d+\) Break----------------/gi, '');
    // Replace multiple carriage returns or newlines
    cleaned = cleaned.replace(/\r/g, '');
    
    // Some lines are split awkwardly. Let's just remove multiple spaces and form paragraphs
    cleaned = cleaned.replace(/[ ]{2,}/g, ' ');
    
    const paragraphs = cleaned.split('\n').map(p => p.trim()).filter(p => p.length > 5);
    
    // We can also skip generic lines like "PRODUCT DATA SHEET"
    const filteredParagraphs = paragraphs.filter(p => {
        const lower = p.toLowerCase();
        if (lower.includes('product data sheet')) return false;
        if (lower.includes('version no')) return false;
        if (lower.includes('page break')) return false;
        if (lower.includes('fssai license number')) return false;
        return true;
    });

    filteredParagraphs.reverse();

    function isHeader(text) {
        if (text.length >= 60) return false;
        if (text.endsWith('.')) return false;
        if (text === text.toUpperCase() && /[A-Z]/.test(text)) return true;
        if (text.endsWith(':')) return true;
        if (/^[a-z]/.test(text)) return false;
        if (text.length < 45) return true;
        return false;
    }

    let joinedParagraphs = [];
    for (let p of filteredParagraphs) {
        if (joinedParagraphs.length > 0) {
            let last = joinedParagraphs[joinedParagraphs.length - 1];
            
            let isCurrentBullet = p.startsWith('•') || p.startsWith('-') || p.startsWith('');
            let isLastHeader = isHeader(last);
            let isCurrentHeader = isHeader(p);
            let isLastBullet = last.startsWith('•') || last.startsWith('-') || last.startsWith('');
            
            if (!isLastHeader && !isLastBullet && !isCurrentBullet && !isCurrentHeader && !last.endsWith('.') && !last.endsWith(':')) {
                joinedParagraphs[joinedParagraphs.length - 1] = last + ' ' + p;
                continue;
            }
        }
        joinedParagraphs.push(p);
    }

    return joinedParagraphs.map(p => {
        // Detect headers
        if (isHeader(p)) {
            let headerText = p.replace(/:$/, '').trim();
            return `<h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">${headerText}</h3>`;
        }
        
        // Detect bullet points
        if (p.startsWith('•') || p.startsWith('-') || p.startsWith('')) {
             return `<div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">${p.substring(1).trim()}</span></div>`;
        }

        return `<p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">${p}</p>`;
    }).join('\n');
}

async function generatePages() {
    for (let item of foodItems) {
        const name = item['Product Name'] || '';
        if (!name) continue;
        const nameFormatted = name.replace('®', '<sup>®</sup>');
        const func = item['Function'] || '';
        const content = item['Content'] || '';
        const activity = item['Activity'] || '';
        const dosage = item['Dosage'] || '';
        const usage = item['where product is used'] || '';
        const subIndustry = item['Sub Industry'] || 'Food';
        
        // Create URL friendly name
        let urlName = name.toLowerCase().replace(/®/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        if (urlName.endsWith('-')) urlName = urlName.slice(0, -1);
        
        const pageFileName = `product-${urlName}.html`;
        
        // Find matching PDF
        const searchTokens = urlName.split('-');
        let matchedPdf = '';
        
        for (let pdf of pdsFiles) {
            const pdfLower = pdf.toLowerCase();
            let matchCount = 0;
            for (let token of searchTokens) {
                if (token.length >= 2 && pdfLower.includes(token)) {
                    matchCount++;
                }
            }
            if (matchCount >= Math.min(2, searchTokens.length)) {
                matchedPdf = pdf;
                break;
            } else if (searchTokens.length === 1 && matchCount === 1) {
                 matchedPdf = pdf;
                break;
            }
        }
        
        let imgName = name.toLowerCase().replace(/®/g, '').replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
        if (imgName.endsWith('_')) imgName = imgName.slice(0, -1);
        let imgSrc = "assets/images/" + imgName + ".svg";
        if (!fs.existsSync(path.join(__dirname, imgSrc))) {
            imgSrc = "assets/images/" + imgName + ".png";
        }

        // Parse PDF if matched
        let pdfTextHtml = '';
        let cleanedHtml = '';
        if (matchedPdf) {
            const rawPdfText = await parsePDF(path.join(pdsDir, matchedPdf));
            cleanedHtml = cleanPdfText(rawPdfText);
        }

        // Removed pdfSection (Download Button)
        let pdfSection = '';

        const mainContent = `
<style>
  .product-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; margin-bottom: 4rem; }
  .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .extended-info { margin-top: 2rem; }
  @media (max-width: 900px) {
    .product-grid { grid-template-columns: 1fr; gap: 2rem; }
    .product-grid > div:first-child { position: static !important; }
  }
  @media (max-width: 600px) {
    .bento-grid { grid-template-columns: 1fr; }
  }
</style>
<main id="main-content">
  <section class="section" style="padding: 6rem 2.5rem 4rem; background: var(--c-page);">
    <div class="wrap" style="max-width: 1200px; margin: 0 auto;">
      <div class="product-grid">
        <div style="background: linear-gradient(145deg, #ffffff, #f9f9f9); border-radius: 32px; padding: 3rem; box-shadow: 0 30px 60px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03); text-align: center; position: sticky; top: 120px;">
            <div style="background: radial-gradient(circle, rgba(138,29,30,0.05) 0%, transparent 70%); width: 100%; height: 100%; position: absolute; top:0; left:0; border-radius: 32px; pointer-events: none;"></div>
            <img src="${imgSrc}" alt="${name}" style="width: 100%; max-width: 320px; height: auto; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1)); transform: scale(1.05);">
            <div style="font-size: 0.75rem; color: #999; text-align: center; margin-top: 2.5rem; position: relative; z-index: 2;">Disclaimer: Packaging in images is for visual representation only.</div>
        </div>
        <div>
            <h2 class="h2" style="margin-bottom: 2rem; font-size: 2rem; color: var(--c-ink); border-bottom: 2px solid var(--c-border); padding-bottom: 1rem;">Product Details</h2>
            
            <div class="bento-grid">
                ${usage ? `<div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Usage</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${usage}</span></div>` : ''}
                ${content ? `<div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Content</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${content}</span></div>` : ''}
                ${activity ? `<div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Activity</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${activity}</span></div>` : ''}
                ${dosage ? `<div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Dosage</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${dosage}</span></div>` : ''}
                ${func ? `<div style="grid-column: 1 / -1; background: #ffffff; padding: 2rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 8px 24px rgba(0,0,0,0.03);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Function</strong><span style="color: var(--c-ink); font-size: 1.1rem; line-height: 1.7; display: block;">${func}</span></div>` : ''}
            </div>

            ${cleanedHtml ? `
            <div style="margin-top: 4rem;">
                <h2 class="h2" style="margin-bottom: 2rem; font-size: 2rem; color: var(--c-ink); border-bottom: 2px solid var(--c-border); padding-bottom: 1rem;">Important Information</h2>
                <div>
                    ${cleanedHtml}
                </div>
            </div>
            ` : ''}
        </div>
      </div>
    </div>
  </section>
</main>
        `;
        
        // Replace <title> and description in header
        let customHeader = headerContent.replace(/<title>.*?<\/title>/, `<title>${name} | Praras Biosciences</title>`);
        let funcDesc = func.substring(0, 100);
        customHeader = customHeader.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="Discover ${name}: ${funcDesc}...">`);

        const fullPage = customHeader + mainContent + footerContent;
        
        fs.writeFileSync(path.join(__dirname, pageFileName), fullPage);
        console.log(`Generated ${pageFileName} (PDF match: ${matchedPdf || 'None'})`);
    }
}

generatePages().then(() => {
    console.log("All pages generated successfully.");
}).catch(console.error);
