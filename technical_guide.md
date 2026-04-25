# 🛠️ EdebiyatApp Teknik Rehber

Bu doküman, uygulamanın mimarisini, veri işleme süreçlerini, SEO stratejisini ve yeni veri ekleme standartlarını teknik detaylarıyla açıklar.

---

## 🏗️ Mimari Genel Bakış

EdebiyatApp, **React + Vite** tabanlı bir Single Page Application (SPA)'dır. Veriler statik JSON dosyaları olarak sunulur ancak bu dosyalar arka planda bir "Build Pipeline" (Veri İşleme Hattı) tarafından ham verilerden üretilir.

### Veri Akış Şeması
1.  **Ham Veriler (Source):** `data/` klasörü altındaki standart **7 sütunlu** `.txt` dosyaları.
2.  **Derleme (Build):** `buildJson.cjs` scripti tüm ham verileri okur, yazar bilgilerini `authors_master.json` ile senkronize eder.
3.  **Çıktı (Output):** `src/data/literatureData.json` dosyası üretilir.
4.  **SEO Hattı:** `npm run build` komutu çalıştırıldığında `vite-plugin-sitemap` tüm route'ları tarayarak `sitemap.xml` üretir.

---

## 🌍 SEO ve Meta Yönetimi

Uygulama, arama motorlarında (Google) üst sıralarda yer almak için gelişmiş SEO teknikleri kullanır:

### 1. Dinamik Meta Etiketleri
`react-helmet-async` kullanılarak her sayfa tipi için özelleştirilmiş başlık ve açıklamalar set edilir:
- **Ana Sayfa:** Genel edebiyat portalı vurgusu.
- **Dönem Sayfası:** Dönem adı ve genel özellikleri.
- **Yazar Sayfası:** "[Yazar Adı] Eserleri ve Hayatı" formatında hedeflenmiş başlıklar.
- **Blog:** İçerik başlığı ve özet bilgisi.

### 2. Yapılandırılmış Veri (JSON-LD)
Yazar sayfalarında Google'ın yazarı bir "Kişi (Person)" olarak tanıması için otomatik JSON-LD şemaları üretilir.

### 3. SPA Routing & Redirects
Netlify/Vercel gibi ortamlarda sayfa yenilendiğinde 404 hatası alınmaması için `public/_redirects` dosyası konfigüre edilmiştir.

---

## 🏷️ Dönem ve Akım Mantığı

Tanzimat ve Cumhuriyet gibi dönemlerde yazarlar edebi topluluklara göre etiketlenir ve sıralanır:

- **Etiketleme:** `authors_master.json` içindeki `movements` dizisi üzerinden yönetilir.
- **Sıralama:** `AuthorsScreen.jsx` içindeki özel `sort` mantığı, yazarları önce akım/dönem sırasına (`order`), sonra alfabetik sıraya göre dizer.
- **MovementModal:** `src/data/movementsData.json` dosyasındaki verileri kullanarak akım hakkında ÖSYM analizi ve detaylı bilgi sunar.

---

## ✍️ Yeni Veri Ekleme Kılavuzu

### 1. Eser Ekleme (`data/*.txt`)
Pipe (`|`) ayırıcısı kullanılır ve **tam olarak 7 sütundan** oluşur:
`Yazar | Eser | Tür | Sınav Bilgisi | Ödül Bilgisi | Eser Açıklaması | Yazar Biyografisi`

### 2. Blog İçeriği (`src/data/blogData.json`)
Yeni bir blog yazısı eklemek için bu dosyaya ID, başlık, özet ve markdown formatında içerik eklemeniz yeterlidir.

---

## ⚙️ Teknik Notlar

### CommonJS vs ESM
- Proje `"type": "module"` (ESM) olarak yapılandırılmıştır.
- Veri güncelleme scriptleri (`buildJson.cjs` gibi) `require` kullanabilmek için `.cjs` uzantısına sahiptir.
- Yeni oluşturulacak yardımcı scriptlerin de `.cjs` uzantılı olması veya `import` kullanması gerekir.

### Performans Optimizasyonları
- **Code Splitting:** Route bazlı `lazy loading` ve Vite `manualChunks` konfigürasyonu ile ana paket boyutu minimize edilmiştir.
- **Preconnect:** Wikipedia ve Google Fonts için `index.html` üzerinde `preconnect` linkleri eklenmiştir.
- **Media:** Tüm resimler `loading="lazy"` attribute'u ile yüklenir.

---
© 2025 edebiyatdonemler.com.tr
