# 🗺️ EdebiyatApp: İnteraktif Türk Edebiyatı Atlası

EdebiyatApp, Türk edebiyatı tarihini, dönemlerini, yazarlarını ve eserlerini modern bir arayüzle keşfetmenizi sağlayan, SEO odaklı, profesyonel bir dijital kütüphane ve atlas uygulamasıdır.

## ✨ Öne Çıkan Özellikler

- **🎨 Modern Arayüz:** Glassmorphism tasarımı, parşömen dokulu arka plan ve her döneme özel renk paletleri.
- **🔍 Gelişmiş Arama:** Yazar, eser veya tür bazlı anlık küresel arama motoru.
- **📚 Zengin Veri Yapısı:** Tanzimat'tan Cumhuriyet'e, Çocuk Edebiyatı'ndan edebi akımlara kadar geniş bir veri yelpazesi.
- **🏷️ Akıllı Etiketleme:** Tanzimat ve Cumhuriyet dönemleri için özel edebi topluluk/akım etiketleri ve detaylı akım modalları.
- **🏆 ÖSYM & Sınav Odaklı:** Sınavlarda çıkmış eserler ve akımlar için özel analizler ve rozetler.
- **📝 İnteraktif Çalışma:** Eserleri favorilere ekleme ve yazarlar hakkında kişisel çalışma notları alma özelliği.
- **🚀 SEO & Performans:** Dinamik meta yönetimi (Helmet), otomatik Sitemap/Robots.txt üretimi ve %100 mobil uyumlu yapı.
- **✍️ Blog & İçerik:** Sınav hazırlığı ve yazar analizleri için özel blog bölümü.

## 🛠️ Teknoloji Yığını

- **Core:** React 18, Vite
- **Routing:** React Router v6
- **Styling:** Vanilla CSS (Premium Glassmorphism & Custom Design Tokens)
- **State & Data:** LocalStorage (Favoriler & Notlar), Static JSON Build Pipeline
- **SEO:** React Helmet Async, Vite Plugin Sitemap
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 🚀 Hızlı Başlangıç

### Kurulum
```bash
# Bağımlılıkları yükle
npm install
```

### Geliştirme Modu
```bash
# Uygulamayı başlat
npm run dev
```

### Veri Güncelleme
Uygulama ham `.txt` ve master `.json` dosyalarından beslenir. Değişiklik yaptıktan sonra ana veriyi derlemek için:
```bash
node buildJson.cjs
```

### Üretim (Build)
```bash
# Projeyi derle (Sitemap otomatik üretilir)
npm run build
```

## 📂 Proje Yapısı

- `data/`: Ham veri dosyaları (.txt ve master .json).
- `src/components/`: Yeniden kullanılabilir UI bileşenleri.
- `src/pages/`: Statik sayfalar (Blog, Hakkımızda, İletişim).
- `src/data/`: Build scripti tarafından üretilen nihai uygulama verisi.
- `buildJson.cjs`: Veri işleme ve senkronizasyon motoru.

---
© 2025 edebiyatdonemler.com.tr — Türk Edebiyatı Tarihi Atlası
# edebiyatapp
