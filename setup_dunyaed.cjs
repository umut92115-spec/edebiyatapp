const fs = require('fs');

const dunyaEdebiyatiPeriods = [
  { id: 'eski-yunan-edebiyati', name: '🏛️ Eski Yunan Edebiyatı', file: 'eski-yunan.txt', desc: 'Antik Yunan döneminde ortaya çıkan felsefi, lirik ve epik eserlerin bütünü.' },
  { id: 'latin-edebiyati', name: '📜 Latin Edebiyatı', file: 'latin.txt', desc: 'Antik Roma döneminde Latince olarak kaleme alınmış edebi eserler.' },
  { id: 'italyan-edebiyati', name: '🍕 İtalyan Edebiyatı', file: 'italyan.txt', desc: 'Rönesansın doğuş yeri İtalya’nın edebi birikimi.' },
  { id: 'ispanyol-edebiyati', name: '💃 İspanyol Edebiyatı', file: 'ispanyol.txt', desc: 'İspanyol diliyle yazılmış zengin tarihi ve kültürel edebi eserler.' },
  { id: 'fransiz-edebiyati', name: '🥐 Fransız Edebiyatı', file: 'fransiz.txt', desc: 'Fransız devrimi, romantizm ve realizm gibi akımlara yön veren edebiyat.' },
  { id: 'norvec-edebiyati', name: '🏔️ Norveç Edebiyatı', file: 'norvec.txt', desc: 'İskandinav kültürünün izlerini taşıyan Norveç edebi eserleri.' },
  { id: 'iskoc-edebiyati', name: '🏰 İskoç Edebiyatı', file: 'iskoc.txt', desc: 'İskoçya’nın yerel efsaneleri ve tarihiyle yoğrulmuş edebi eserleri.' },
  { id: 'danimarka-edebiyati', name: '🧜‍♀️ Danimarka Edebiyatı', file: 'danimarka.txt', desc: 'Masallar ve destanlarla öne çıkan Danimarka edebiyatı.' },
  { id: 'hirvat-edebiyati', name: '🇭🇷 Hırvat Edebiyatı', file: 'hirvat.txt', desc: 'Balkanların kültürel çeşitliliğini yansıtan Hırvat edebi eserleri.' },
  { id: 'hint-edebiyati', name: '🪷 Hint Edebiyatı', file: 'hint.txt', desc: 'Eski Hint felsefesi ve inanç sistemlerinden beslenen edebiyat.' },
  { id: 'klasik-iran-edebiyati', name: '🕌 Klasik İran Edebiyatı', file: 'klasik-iran.txt', desc: 'Doğu edebiyatının en önemli yapı taşlarından olan Farsça eserler.' },
  { id: 'alman-edebiyati', name: '🥨 Alman Edebiyatı', file: 'alman.txt', desc: 'Alman düşünce yapısını ve felsefesini yansıtan derinlikli edebiyat.' },
  { id: 'ingiliz-edebiyati', name: '☕ İngiliz Edebiyatı', file: 'ingiliz.txt', desc: 'Dünya edebiyatına yön veren, tiyatrodan romana geniş yelpazeli edebiyat.' },
  { id: 'rus-edebiyati', name: '🪆 Rus Edebiyatı', file: 'rus.txt', desc: 'Derin psikolojik tahliller ve toplumsal eleştirilerle dolu Rus klasikleri.' },
  { id: 'amerikan-edebiyati', name: '🗽 Amerikan Edebiyatı (ABD)', file: 'amerikan.txt', desc: 'Yeni dünyanın kültürel çeşitliliğini ve toplumsal yapısını yansıtan edebiyat.' },
  { id: 'latin-amerika-edebiyati', name: '🦜 Latin Amerika Edebiyatı', file: 'latin-amerika.txt', desc: 'Büyülü gerçekçilik gibi akımların doğduğu coşkulu edebiyat.' }
];

// 1. Dosyaları oluştur
dunyaEdebiyatiPeriods.forEach(p => {
  fs.writeFileSync(`data/${p.file}`, '', 'utf-8');
});

// 2. buildJson.cjs güncellemesi
let buildJson = fs.readFileSync('buildJson.cjs', 'utf-8');
const newCategory = `
  {
    id: "dunya-edebiyati",
    name: "🌍 Dünya Edebiyatı",
    periods: [
${dunyaEdebiyatiPeriods.map(p => `      { file: '${p.file}', id: '${p.id}', name: '${p.name}' }`).join(',\n')}
    ]
  }
];`;
buildJson = buildJson.replace(/\];\s*$/, newCategory);
fs.writeFileSync('buildJson.cjs', buildJson, 'utf-8');

// 3. periods_master.json güncellemesi
let periodsMaster = JSON.parse(fs.readFileSync('data/periods_master.json', 'utf-8'));
dunyaEdebiyatiPeriods.forEach(p => {
  periodsMaster[p.id] = {
    name: p.name,
    description: p.desc,
    wikipedia: ""
  };
});
fs.writeFileSync('data/periods_master.json', JSON.stringify(periodsMaster, null, 2), 'utf-8');

console.log("Alt başlıklar ve dosyalar başarıyla oluşturuldu.");
