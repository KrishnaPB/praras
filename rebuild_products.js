const fs = require('fs');

const products = [
    {
        file: 'product-textureaid-025.html',
        title: 'TEXTUREAID® 025',
        svg: 'textureaid_025.svg',
        usage: 'Extruded foods (pasta/noodles)',
        content: 'Dough conditioner',
        activity: '-',
        dosage: '0.1 - 0.3% w/w',
        function: 'Aids in reducing cracks and breakages in extruded food products substantially without affecting overall quality.',
        intro: '<strong>TEXTUREAID® 025</strong> is a dough conditioner that aids in reducing cracks and breakages in extruded food products like vermicelli, pasta, and noodles.',
        benefits: [
            'Zero cracking percentage in test pasta till 3 months.',
            'The hardness of the uncooked pasta of test increased by 69%',
            'Hardness of the pasta has increased by 64.43% in Test.',
            'The springiness of the pasta has increased by 40.40% in Test.'
        ],
        sensory: [],
        application: [
            'Recommended dosage of 0.1- 0.3% w/w of the total flour quantity.'
        ],
        storage: [
            'MUST BE STORED at temp. 25±2°C and <35% humid conditions',
            'Best if used before 12 months from date of manufacturing.',
            'Available in 25kg HDPE bags.'
        ]
    },
    {
        file: 'product-textureaid-clf.html',
        title: 'TEXTUREAID® CLF',
        svg: 'textureaid_clf.svg',
        usage: 'Extruded and fried snacks',
        content: 'Food grade dough conditioner',
        activity: '-',
        dosage: '0.25 - 0.50% of total flour',
        function: 'Aids in reduced fat uptake and improved overall quality of the snack product, improving customer perception.',
        intro: '<strong>TEXTUREAID® CLF</strong> is a food grade dough conditioner, which aids in reduced fat uptake and improved overall quality of the snack product.',
        benefits: [
            'Improves overall quality of fried snacks by 31%',
            'Increases strength of snacks by 17%',
            'Increases crispiness by 19%',
            'Reduces oiliness by 45%',
            'Reduces grittiness by 50%',
            'Reduces oil uptake 16%'
        ],
        sensory: [],
        application: [
            'Recommended dose of 0.25-0.50 % of total flour',
            'It is to be added and sieved along with the flour',
            'Frying Conditions: Temp. Range ~140°C for 3-6 minutes'
        ],
        storage: [
            'Must be stored at temp. 25±5°C and 35±5% humid conditions',
            'Best if used before 12 months from date of manufacturing.',
            'Available in 25kg PP bags.'
        ]
    },
    {
        file: 'product-textureaid-m.html',
        title: 'TEXTUREAID® M',
        svg: 'textureaid_m.svg',
        usage: 'Restructured meat products',
        content: 'SVP based meat texturizer',
        activity: '-',
        dosage: '0.50 % of total formulation',
        function: 'Aids in improved water holding capacity which allows reduction of meat content without affecting product quality.',
        intro: '<strong>TEXTUREAID® M</strong> is a SVP based meat texturizer, which aids in improved water holding capacity in restructured meat products.',
        benefits: [
            'Allows reduction of meat by 5% in restructured meat products.',
            'Allows addition of water in product formulation by 5%.',
            'Provides significant production costs reduction for meat product manufacturers (Rs 2000/100kg).'
        ],
        sensory: [],
        application: [
            'Recommended dose of 0.50 % of total product formulation.',
            'Frying Conditions: Temp. Range ~140°C for 3-6 minutes'
        ],
        storage: [
            'MUST BE STORED at temp. 25±5°C and 35±5% humid conditions.',
            'Best if used before 6 months from date of manufacturing.',
            'Available in 25kg HDPE bags.'
        ]
    },
    {
        file: 'product-textureaid-msk.html',
        title: 'TEXTUREAID® MSK',
        svg: 'textureaid_msk.svg',
        usage: 'Ground meat (sheek kebab/sausages)',
        content: 'Hydrocolloid and SVP based texturiser',
        activity: '-',
        dosage: '1% of total formulation',
        function: 'Aids in improved water holding capacity which allows reduction of meat content without affecting product quality.',
        intro: '<strong>TEXTUREAID® MSK</strong> is a Hydrocolloid and SVP based meat texturiser, which aids in improved water holding capacity in ground meat products.',
        benefits: [
            'Sheek Kebab: Allows reduction of meat by 16% in restructured meat products',
            'Sheek Kebab: Provides significant production costs reduction (2000/100kg Batch).',
            'Sausage: 100% replacement of minced chicken meat with MDM and availing a savings of Rs 6000/100kg.',
            'Sausage: Enables vendors to have various range of sausages based on the chicken percentage incorporation.'
        ],
        sensory: [],
        application: [
            'Recommended dose of 1% of total product formulation.'
        ],
        storage: [
            'Must be stored at temp. 25±5°C and 35±5% humid conditions',
            'Best if used before 6 months from date of manufacturing.',
            'Available in 25kg HDPE bags.'
        ]
    }
];

function generateMain(prod) {
    const listHtml = (arr) => arr.map(item => `<li style="margin-bottom: 0.75rem;">${item}</li>`).join('\n                    ');
    
    let sensoryBlock = '';
    if (prod.sensory.length > 0) {
        sensoryBlock = `
                <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Sensory Benefits</h3>
                <ul class="feat-list" style="margin-bottom: 2.5rem; padding-left: 1.5rem;">
                    ${listHtml(prod.sensory)}
                </ul>`;
    }

    return `<main id="main-content">
  <section class="section" style="padding: 6rem 2.5rem 4rem; background: var(--c-page);">
    <div class="wrap" style="max-width: 1200px; margin: 0 auto;">
      <div class="product-grid">
        <div style="background: linear-gradient(145deg, #ffffff, #f9f9f9); border-radius: 32px; padding: 3rem; box-shadow: 0 30px 60px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03); text-align: center; position: sticky; top: 120px;">
            <div style="background: radial-gradient(circle, rgba(138,29,30,0.05) 0%, transparent 70%); width: 100%; height: 100%; position: absolute; top:0; left:0; border-radius: 32px; pointer-events: none;"></div>
            <img src="assets/images/${prod.svg}" alt="${prod.title}" style="width: 100%; max-width: 320px; height: auto; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1)); transform: scale(1.05);">
            <div style="font-size: 0.75rem; color: #999; text-align: center; margin-top: 2.5rem; position: relative; z-index: 2;">Disclaimer: Packaging in images is for visual representation only.</div>
        </div>
        <div>
            <h2 class="h2">Product Details</h2>
            
            <div class="bento-grid">
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Usage</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${prod.usage}</span></div>
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Content</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${prod.content}</span></div>
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Activity</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${prod.activity}</span></div>
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.02);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Dosage</strong><span style="color: var(--c-ink); font-size: 1.1rem; font-weight: 500;">${prod.dosage}</span></div>
                <div style="grid-column: 1 / -1; background: #ffffff; padding: 2rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 8px 24px rgba(0,0,0,0.03);"><strong style="color: var(--c-primary); display: block; margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Function</strong><span style="color: var(--c-ink); font-size: 1.1rem; line-height: 1.7; display: block;">${prod.function}</span></div>
            </div>

            <div style="margin-top: 4rem;">
                <h2 class="h2">Important Information</h2>
                <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">${prod.intro}</p>

                <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Key Benefits</h3>
                <ul class="feat-list" style="margin-bottom: 2.5rem; padding-left: 1.5rem;">
                    ${listHtml(prod.benefits)}
                </ul>

                ${sensoryBlock}

                <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Application Conditions</h3>
                <ul class="feat-list" style="margin-bottom: 2.5rem; padding-left: 1.5rem;">
                    ${listHtml(prod.application)}
                </ul>

                <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Storage Conditions & Packaging</h3>
                ${prod.storage.map(item => `<p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">${item}</p>`).join('\n                ')}
            </div>
        </div>
      </div>
    </div>
  </section>
</main>`;
}

products.forEach(prod => {
    if (!fs.existsSync(prod.file)) {
        console.error("Missing " + prod.file);
        return;
    }
    
    let content = fs.readFileSync(prod.file, 'utf8');
    
    // Inject missing styles if they don't exist
    if (!content.includes('.bento-grid')) {
        const styles = `
<style>
/* ─── NEW BENTO GRID LAYOUT ─── */
.product-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 4rem;
  align-items: start;
}
@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}
@media (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
.feat-list li {
  position: relative;
  padding-left: 1.5rem;
  color: var(--c-ink);
  line-height: 1.5;
}
.feat-list li::before {
  content: "✔";
  position: absolute;
  left: 0;
  top: 0.15rem;
  color: var(--c-primary);
  font-weight: 800;
  font-size: 1.1rem;
}
</style>
`;
        content = content.replace(/<\/head>/i, styles + '</head>');
    }

    // Replace the main block
    const startIdx = content.indexOf('<main id="main-content">');
    const endIdx = content.indexOf('</main>', startIdx) + 7;
    
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.substring(0, startIdx) + generateMain(prod) + content.substring(endIdx);
        fs.writeFileSync(prod.file, content);
        console.log("Updated " + prod.file);
    } else {
        console.error("Could not find <main> in " + prod.file);
    }
});
