const fs = require('fs');

const data = [
  // Şenlik Kolu
  { usta: "Âşık Şenlik", isim: "Âşık Şenlik", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Bala Kişi", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "İbrahim", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Gazeli", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Ali", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Bala Mehmet", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Namaz", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Kasım", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Asker", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Mevlüt", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Nesib", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Süleyman", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Hüseyin", kol: "Şenlik Kolu" },
  { usta: "Âşık Şenlik", isim: "Gülistan", kol: "Şenlik Kolu" },
  
  // Sümmani Kolu
  { usta: "Sümmani", isim: "Sümmani", kol: "Sümmani Kolu" },
  { usta: "Sümmani", isim: "Şevki Çavuş", kol: "Sümmani Kolu" },
  { usta: "Sümmani", isim: "Fahri Çavuş", kol: "Sümmani Kolu" },
  { usta: "Sümmani", isim: "Ahmet Çavuş", kol: "Sümmani Kolu" },
  
  // Ruhsatî Kolu
  { usta: "Ruhsati", isim: "Ruhsati", kol: "Ruhsatî Kolu" },
  { usta: "Ruhsati", isim: "Meslekî", kol: "Ruhsatî Kolu" },
  { usta: "Ruhsati", isim: "Minhacî", kol: "Ruhsatî Kolu" },
  { usta: "Ruhsati", isim: "Emsalî", kol: "Ruhsatî Kolu" },
  
  // Emrah Kolu
  { usta: "Erzurumlu Emrah", isim: "Erzurumlu Emrah", kol: "Emrah Kolu" },
  { usta: "Erzurumlu Emrah", isim: "Gedaî", kol: "Emrah Kolu" },
  { usta: "Erzurumlu Emrah", isim: "Meydanî", kol: "Emrah Kolu" },
  { usta: "Erzurumlu Emrah", isim: "Tokatlı Nuri", kol: "Emrah Kolu" },

  // Dertli Kolu
  { usta: "Dertli", isim: "Dertli", kol: "Dertli Kolu" },
  { usta: "Dertli", isim: "Geredeli Figanî", kol: "Dertli Kolu" },
  { usta: "Dertli", isim: "Pinhani", kol: "Dertli Kolu" },
  { usta: "Dertli", isim: "Yorgansız Hakkı", kol: "Dertli Kolu" },

  // Huzuri Kolu
  { usta: "Huzuri", isim: "Huzuri", kol: "Huzuri Kolu" },
  { usta: "Huzuri", isim: "İzharî", kol: "Huzuri Kolu" },
  { usta: "Huzuri", isim: "Zuhurî", kol: "Huzuri Kolu" },
  { usta: "Huzuri", isim: "Fahrî", kol: "Huzuri Kolu" },

  // Derviş Muhammed Kolu
  { usta: "Derviş Muhammed", isim: "Derviş Muhammed", kol: "Derviş Muhammed Kolu" },
  { usta: "Derviş Muhammed", isim: "Âşıkî", kol: "Derviş Muhammed Kolu" },
  { usta: "Derviş Muhammed", isim: "Şah Sultan", kol: "Derviş Muhammed Kolu" },
  { usta: "Derviş Muhammed", isim: "Bektaş Kaymaz", kol: "Derviş Muhammed Kolu" },
  { usta: "Derviş Muhammed", isim: "Hasan Hüseyin", kol: "Derviş Muhammed Kolu" },

  // Deli Derviş Feryadi Kolu
  { usta: "Deli Derviş Feryadi", isim: "Deli Derviş Feryadi", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Fahri (Süleyman)", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Suzanî", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Revanî", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Efganî", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Figanî (Abidin Şimşek)", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Cemal Koçak", kol: "Deli Derviş Feryadi Kolu" },
  { usta: "Deli Derviş Feryadi", isim: "Cemal Özcan", kol: "Deli Derviş Feryadi Kolu" }
];

let out = "";
data.forEach(item => {
  const isUsta = item.isim === item.usta;
  const eser = "Şiirler";
  const tur = "Şiir";
  const sinav = "";
  const odul = "";
  
  let aciklama = isUsta 
    ? `${item.kol}nun kurucusudur. Kendi yöresinde aşıklık geleneğini şekillendirmiş ve pek çok çırak yetiştirmiştir.` 
    : `${item.usta} ustadan el almış, ${item.kol} geleneğini devam ettirmiş önemli bir aşıktır.`;
    
  let biyo = isUsta
    ? `Aşık Tarzı Halk Edebiyatı'nın kendi adıyla anılan büyük kollarından birinin kurucusudur. Çıraklarına usta-çırak ilişkisi içerisinde aşıklık geleneğinin inceliklerini öğretmiştir.`
    : `Usta-çırak geleneği içinde yetişmiş bir halk ozanıdır. ${item.kol} özelliklerini ve yöresel motifleri şiirlerine yansıtmıştır.`;
    
  // Özel biyografiler eklenebilir ama şu an standart
  if (item.isim === "Âşık Şenlik") {
    biyo = "19. yüzyılın en büyük saz şairlerindendir. Çıldır'da doğmuştur. Doğu Anadolu ve Azerbaycan aşıklık geleneğini derinden etkilemiş, en geniş aşık kolunu kurmuştur.";
  } else if (item.isim === "Sümmani") {
    biyo = "Erzurum yöresi aşıklarının piri sayılır. Gülperi'ye olan aşkı dillere destandır ve onu aramak için yıllarca gezmiştir.";
  } else if (item.isim === "Ruhsati") {
    biyo = "Sivas yöresinin büyük halk ozanıdır. Kendi adıyla anılan Aşık Kolu'nun kurucusudur. Hiciv ustasıdır.";
  } else if (item.isim === "Erzurumlu Emrah") {
    biyo = "19. yüzyılda yaşamış Erzurumlu bir saz şairidir. Anadolu'nun birçok yerini gezmiş, kendi adıyla anılan büyük bir kol kurmuştur.";
  } else if (item.isim === "Dertli") {
    biyo = "Asıl adı İbrahim'dir. Bolu-Kastamonu yörelerinde kendi kolunu kurmuş, Bektaşi nefesleriyle ünlenmiş 19. yy aşığıdır.";
  }
  
  out += `${item.isim} | ${eser} | ${tur} | ${sinav} | ${odul} | ${aciklama} | ${biyo}\n`;
});

fs.writeFileSync('data/yeni_asik_kollari_veriseti.txt', out, 'utf-8');
console.log("Dosya oluşturuldu.");
