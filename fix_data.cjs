const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = ['tanzimat.txt', 'servetifunun.txt', 'fecriati.txt', 'millied.txt', 'cumhuriyet.txt'];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let changed = false;
  const newLines = lines.map(line => {
    if (line.trim().length === 0) return line;
    const parts = line.split('|');
    if (parts.length >= 5) {
      let awardCol = parts[4] ? parts[4].trim() : '';
      let descCol = parts[5] ? parts[5].trim() : '';
      // If 5 is not empty and 6 is empty, shift 5 to 6.
      if (awardCol !== '' && descCol === '') {
        parts[5] = ' ' + awardCol + ' ';
        parts[4] = '  ';
        changed = true;
      }
      // If we just want to wipe all awards in these files
      if (parts[4] && parts[4].trim() !== '') {
         parts[4] = '  ';
         changed = true;
      }
    }
    return parts.join('|');
  });
  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    console.log(`Fixed ${file}`);
  }
});

// Wipe awards from authors_master.json for these periods
// Wait, authors_master doesn't track periods directly, but we can just wipe all awards from authors_master to be safe? 
// No, awards is not even in authors_master!
// In buildJson.cjs: "awards: [] // Initialize awards array for all authors"
