const fs = require('fs');
const periodsMasterPath = 'data/periods_master.json';
const data = JSON.parse(fs.readFileSync(periodsMasterPath, 'utf-8'));

const wikiLinks = {
  "eski-yunan-edebiyati": "https://tr.wikipedia.org/wiki/Antik_Yunan_edebiyat%C4%B1",
  "latin-edebiyati": "https://tr.wikipedia.org/wiki/Latin_edebiyat%C4%B1",
  "italyan-edebiyati": "https://tr.wikipedia.org/wiki/%C4%B0talyan_edebiyat%C4%B1",
  "ispanyol-edebiyati": "https://tr.wikipedia.org/wiki/%C4%B0spanyol_edebiyat%C4%B1",
  "fransiz-edebiyati": "https://tr.wikipedia.org/wiki/Frans%C4%B1z_edebiyat%C4%B1",
  "norvec-edebiyati": "https://tr.wikipedia.org/wiki/Norve%C3%A7_edebiyat%C4%B1",
  "iskoc-edebiyati": "https://tr.wikipedia.org/wiki/%C4%B0sko%C3%A7_edebiyat%C4%B1",
  "danimarka-edebiyati": "https://tr.wikipedia.org/wiki/Danimarka_edebiyat%C4%B1",
  "hirvat-edebiyati": "https://tr.wikipedia.org/wiki/H%C4%B1rvat_edebiyat%C4%B1",
  "hint-edebiyati": "https://tr.wikipedia.org/wiki/Hint_edebiyat%C4%B1",
  "klasik-iran-edebiyati": "https://tr.wikipedia.org/wiki/Fars_edebiyat%C4%B1",
  "alman-edebiyati": "https://tr.wikipedia.org/wiki/Alman_edebiyat%C4%B1",
  "ingiliz-edebiyati": "https://tr.wikipedia.org/wiki/%C4%B0ngiliz_edebiyat%C4%B1",
  "rus-edebiyati": "https://tr.wikipedia.org/wiki/Rus_edebiyat%C4%B1",
  "amerikan-edebiyati": "https://tr.wikipedia.org/wiki/Amerikan_edebiyat%C4%B1",
  "latin-amerika-edebiyati": "https://tr.wikipedia.org/wiki/Latin_Amerika_edebiyat%C4%B1"
};

for (const [id, url] of Object.entries(wikiLinks)) {
  if (data[id]) {
    data[id].wikipedia = url;
  }
}

fs.writeFileSync(periodsMasterPath, JSON.stringify(data, null, 2), 'utf-8');
console.log("Wikipedia linkleri eklendi.");
