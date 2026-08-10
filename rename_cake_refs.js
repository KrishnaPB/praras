const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const oldName = 'preccel-93.html';
const newName = 'preccel-93.html';
const oldPath = path.join(dir, oldName);
const newPath = path.join(dir, newName);

// 1. Rename the file
if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log(`Renamed ${oldName} to ${newName}`);
} else {
  console.log(`${oldName} not found, maybe already renamed.`);
}

// 2. Update all HTML files (and JS/CSS if needed, but mostly HTML)
function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      if (name !== 'node_modules' && name !== '.git' && name !== 'assets') {
        walkSync(filePath, callback);
      }
    }
  });
}

let updateCount = 0;
walkSync(dir, function(filePath, stat) {
  if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.php')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace href="preccel-93.html" and href='preccel-93.html'
    const regex = new RegExp(`href=["']${oldName}["']`, 'g');
    const regex2 = new RegExp(`href=["']/${oldName}["']`, 'g');
    
    let updated = false;
    if (content.includes(`"${oldName}"`) || content.includes(`'${oldName}'`)) {
      content = content.replace(new RegExp(`"${oldName}"`, 'g'), `"${newName}"`);
      content = content.replace(new RegExp(`'${oldName}'`, 'g'), `'${newName}'`);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      updateCount++;
    }
  }
});

console.log(`Updated ${updateCount} files with the new link.`);
