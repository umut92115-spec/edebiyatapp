const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outPath = path.join(__dirname, 'src', 'data', 'literatureData.json');

// Artık tüm dönemler aynı yapıyı kullanıyor
const categoriesConfig = [
  {
    id: "yeni-turk-edebiyati",
    name: "📚 Yeni Türk Edebiyatı",
    periods: [
      { file: 'tanzimat.txt', id: 'tanzimat', name: '📜 Tanzimat' },
      { file: 'servetifunun.txt', id: 'servet-i-funun', name: '🍂 Servet-i Fünun' },
      { file: 'fecriati.txt', id: 'fecr-i-ati', name: '🌅 Fecr-i Âti' },
      { file: 'millied.txt', id: 'milli-edebiyat', name: '🧿 Milli Edebiyat' }
    ]
  },
  {
    id: "cumhuriyet-edebiyati",
    name: "🏛️ Cumhuriyet Edebiyatı",
    periods: [
      { file: 'cummassive.txt', id: 'cumhuriyet-donemi', name: '🧿 Cumhuriyet Dönemi Türk Edebiyatı' }
    ]
  },
  {
    id: "cocuk-edebiyati",
    name: "🧸 Çocuk Edebiyatı",
    periods: [
      { file: 'turk-cocuk-edebiyati.txt', id: 'turk-cocuk-edebiyati', name: '🧿 Türk Çocuk Edebiyatı' },
      { file: 'dunya-cocuk-edebiyati.txt', id: 'dunya-cocuk-edebiyati', name: '🌍 Dünya Çocuk Edebiyatı' },
    ]
  },
  {
    id: "halk-edebiyati",
    name: "🌾 Halk Edebiyatı",
    periods: [
      { file: 'asıktarzihalked.txt', id: 'asik-tarzi', name: '🪕 Aşık Tarzı Halk Edebiyatı' },
      { file: 'dinitasavvufi.txt', id: 'dini-tasavvufi', name: '🕌 Dini Tasavvufi Halk Edebiyatı' }
    ]
  },
  {
    id: "dunya-edebiyati",
    name: "🌍 Dünya Edebiyatı",
    periods: [
      { file: 'eski-yunan.txt', id: 'eski-yunan-edebiyati', name: '🏛️ Eski Yunan Edebiyatı' },
      { file: 'latin.txt', id: 'latin-edebiyati', name: '📜 Latin Edebiyatı' },
      { file: 'italyan.txt', id: 'italyan-edebiyati', name: '🍕 İtalyan Edebiyatı' },
      { file: 'ispanyol.txt', id: 'ispanyol-edebiyati', name: '💃 İspanyol Edebiyatı' },
      { file: 'fransiz.txt', id: 'fransiz-edebiyati', name: '🥐 Fransız Edebiyatı' },
      { file: 'norvec.txt', id: 'norvec-edebiyati', name: '🏔️ Norveç Edebiyatı' },
      { file: 'iskoc.txt', id: 'iskoc-edebiyati', name: '🏰 İskoç Edebiyatı' },
      { file: 'danimarka.txt', id: 'danimarka-edebiyati', name: '🧜‍♀️ Danimarka Edebiyatı' },
      { file: 'hirvat.txt', id: 'hirvat-edebiyati', name: '🇭🇷 Hırvat Edebiyatı' },
      { file: 'hint.txt', id: 'hint-edebiyati', name: '🪷 Hint Edebiyatı' },
      { file: 'klasik-iran.txt', id: 'klasik-iran-edebiyati', name: '🕌 Klasik İran Edebiyatı' },
      { file: 'alman.txt', id: 'alman-edebiyati', name: '🥨 Alman Edebiyatı' },
      { file: 'ingiliz.txt', id: 'ingiliz-edebiyati', name: '☕ İngiliz Edebiyatı' },
      { file: 'rus.txt', id: 'rus-edebiyati', name: '🪆 Rus Edebiyatı' },
      { file: 'amerikan.txt', id: 'amerikan-edebiyati', name: '🗽 Amerikan Edebiyatı (ABD)' },
      { file: 'latin-amerika.txt', id: 'latin-amerika-edebiyati', name: '🦜 Latin Amerika Edebiyatı' }
    ]
  }
];

function generateId(str) {
  const map = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  return str.split('').map(char => map[char] || char).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ──────────────────────────────────────
// 1) Merkezi Yazar Kütüphanesini Yükle
// ──────────────────────────────────────
let authorsMaster = {};
try {
  const masterPath = path.join(dataDir, 'authors_master.json');
  if (fs.existsSync(masterPath)) {
    authorsMaster = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
    console.log(`✅ authors_master.json yüklendi: ${Object.keys(authorsMaster).length} yazar`);
  } else {
    console.warn("⚠️ authors_master.json bulunamadı!");
  }
} catch (err) {
  console.error("❌ authors_master.json okunamadı:", err.message);
}

// 2) Merkezi Dönem Bilgilerini Yükle
let periodsMaster = {};
try {
  const pMasterPath = path.join(dataDir, 'periods_master.json');
  if (fs.existsSync(pMasterPath)) {
    periodsMaster = JSON.parse(fs.readFileSync(pMasterPath, 'utf-8'));
    console.log(`✅ periods_master.json yüklendi: ${Object.keys(periodsMaster).length} dönem`);
  }
} catch (err) {
  console.error("❌ periods_master.json okunamadı:", err.message);
}

function getAuthorDetails(nameOrId) {
  const id = authorsMaster[nameOrId] ? nameOrId : generateId(nameOrId);
  const masterData = authorsMaster[id] || {};
  return {
    id: id,
    name: masterData.name || nameOrId,
    bio: masterData.bio || '',
    image: masterData.image || '',
    wikiPage: masterData.wikiPage || '',
    examCount: masterData.examCount || 0,
    movements: masterData.movements || [],
    awards: masterData.awards || [], 
    works: []
  };
}

// ──────────────────────────────────────
// 3) Kategorileri ve Dönemleri İşle
// ──────────────────────────────────────
const categories = categoriesConfig.map(catConfig => {
  const category = {
    id: catConfig.id,
    name: catConfig.name,
    periods: []
  };

  catConfig.periods.forEach(periodConfig => {
    const filePath = path.join(dataDir, periodConfig.file);
    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(`Hata: ${filePath} okunamadı.`);
      return;
    }

    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const authorsMap = new Map();

    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        const authorName = parts[0];
        const workName = parts[1];
        const workType = parts[2] || 'Bilinmiyor';
        let examInfo = parts[3] || '';
        if (examInfo === '-') examInfo = '';
        let awardInfo = parts[4] || '';
        if (awardInfo === '-') awardInfo = '';
        const workDesc = parts[5] ? parts[5].replace(/^"|"$/g, '') : '';
        const authorBioFromTxt = parts[6] || ''; // 7. Sütun: Yazar Bilgisi

        if (!authorsMap.has(authorName)) {
          authorsMap.set(authorName, getAuthorDetails(authorName));
        }

        const author = authorsMap.get(authorName);

        // Akıllı Yazar Güncelleme: Eğer .txt dosyasında daha detaylı (daha uzun) bir yazar bilgisi varsa
        if (authorBioFromTxt && authorBioFromTxt.length > (author.bio || "").length) {
          author.bio = authorBioFromTxt;
          // Master dosyayı da güncelle ki kalıcı olsun
          authorsMaster[author.id] = {
            ...authorsMaster[author.id],
            name: authorName,
            bio: authorBioFromTxt
          };
          fs.writeFileSync(path.join(dataDir, 'authors_master.json'), JSON.stringify(authorsMaster, null, 2), 'utf-8');
        }
        
        // Ödül bilgisi varsa yazarın ödüllerine ekle
        if (awardInfo) {
          const awards = awardInfo.split(';').map(s => s.trim());
          awards.forEach(aw => {
            if (aw && !author.awards.includes(aw)) {
              author.awards.push(aw);
            }
          });
        }

        // Removed buggy regex check that interpreted 'diplomatik' and 'armağan' in descriptions as awards.

        const work = {
          id: generateId(workName),
          name: workName,
          type: workType,
          description: workDesc
        };
        
        if (examInfo) {
           work.examInfo = examInfo;
        }

        author.works.push(work);
      }
    });

    category.periods.push({
      id: periodConfig.id,
      name: periodConfig.name,
      description: periodsMaster[periodConfig.id] || null,
      authors: Array.from(authorsMap.values())
    });
  });

  return category;
});

// ──────────────────────────────────────
// 4) JSON'u Kaydet
// ──────────────────────────────────────
const minify = process.argv.includes('--minify');
const jsonOutput = minify 
  ? JSON.stringify({ categories }) 
  : JSON.stringify({ categories }, null, 2);

fs.writeFileSync(outPath, jsonOutput, 'utf-8');

// ──────────────────────────────────────
// 5) Movements Verisini Kopyala
// ──────────────────────────────────────
const movementsSourcePath = path.join(dataDir, 'movementsData.json');
const movementsDestPath = path.join(__dirname, 'src', 'data', 'movementsData.json');

if (fs.existsSync(movementsSourcePath)) {
  fs.copyFileSync(movementsSourcePath, movementsDestPath);
  console.log('✅ movementsData.json güncellendi.');
}

console.log('');
console.log(`✨ ${minify ? 'Optimize edilmiş (Minified)' : 'Standart'} JSON başarıyla oluşturuldu: ` + outPath);
console.log(`📊 Toplam Kategori: ${categories.length}`);
console.log(`📦 Dosya Boyutu: ${(Buffer.byteLength(jsonOutput, 'utf8') / 1024).toFixed(2)} KB`);
