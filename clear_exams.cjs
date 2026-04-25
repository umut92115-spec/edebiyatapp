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
    if (parts.length >= 4) {
      if (parts[3] && parts[3].trim() !== '') {
         parts[3] = '  ';
         changed = true;
      }
    }
    return parts.join('|');
  });
  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    console.log(`Cleared exam info from ${file}`);
  }
});
