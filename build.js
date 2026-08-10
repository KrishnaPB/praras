const fs = require('fs');
const path = require('path');

const directory = '/home/prarasbiosciences-test/htdocs/test.prarasbiosciences.com';
const headerPath = path.join(directory, 'templates', 'header.php');
const footerPath = path.join(directory, 'templates', 'footer.php');

const headerContent = fs.readFileSync(headerPath, 'utf8');
const footerContent = fs.readFileSync(footerPath, 'utf8');

const files = fs.readdirSync(directory);
const htmlFiles = files.filter(f => f.endsWith('.html') && !['praras_brand_kit.html', 'praras_v2.html', 'AIRBLISS_Brand_Guidelines.html'].includes(f));

for (const file of htmlFiles) {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[0] : '<title>Praras Biosciences & Airbliss</title>';
    
    // Replace the title in the headerContent with this file's title
    let newHeader = headerContent.replace(/<title>[\s\S]*?<\/title>/, title);
    
    // Replace the old header with newHeader
    content = content.replace(/^[\s\S]*?<\/header>/i, newHeader);
    
    // Replace the footer
    let footerIndex = content.indexOf('<!-- ════ SHARED FOOTER ════ -->');
    if (footerIndex === -1) {
        footerIndex = content.indexOf('<footer class="site-footer">');
    }
    
    if (footerIndex !== -1) {
        content = content.substring(0, footerIndex) + footerContent;
    } else {
        console.warn(`Could not find footer in ${file}`);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
}
console.log('Build complete.');
