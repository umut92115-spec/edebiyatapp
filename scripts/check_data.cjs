const data = require('../src/data/literatureData.json');

function checkData() {
  const reports = [];
  let totalAuthors = 0;
  let totalWorks = 0;

  data.categories.forEach(cat => {
    cat.periods.forEach(period => {
      period.authors.forEach(author => {
        totalAuthors++;
        
        if (!author.bio || author.bio.length < 20) {
          reports.push(`[EKSİK BİYO] ${author.name} (${period.name})`);
        }

        if (!author.works || author.works.length === 0) {
          reports.push(`[ESER YOK] ${author.name} (${period.name})`);
        } else {
          totalWorks += author.works.length;
          author.works.forEach(work => {
            if (!work.description || work.description.length < 5) {
              // reports.push(`[ESER AÇIKLAMA EKSİK] ${author.name} -> ${work.name}`);
            }
          });
        }

        if (author.examCount === undefined) {
          reports.push(`[EXAMCOUNT EKSİK] ${author.name}`);
        }
      });
    });
  });

  console.log('--- EDEBİYAT ATLASI VERİ RAPORU ---');
  console.log(`Toplam Yazar: ${totalAuthors}`);
  console.log(`Toplam Eser: ${totalWorks}`);
  console.log('-----------------------------------');
  
  if (reports.length === 0) {
    console.log('✅ Tüm veriler tam görünüyor!');
  } else {
    console.log(`${reports.length} adet uyarı bulundu:`);
    reports.forEach(r => console.log(r));
  }
}

checkData();
