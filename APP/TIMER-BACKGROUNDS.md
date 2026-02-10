# 🎨 Timer Arka Plan Özelleştirme Rehberi

## 📁 Resimler Nereye Konur?

Tüm timer arka plan resimleri şu klasöre konulmalıdır:
```
frontend/public/timer-backgrounds/
```

## 🖼️ Hazır Resim Seçenekleri

Uygulamada şu resimler için yer ayrılmıştır:

1. **forest.jpg** - Orman manzarası
2. **mountain.jpg** - Dağ manzarası  
3. **library.jpg** - Kütüphane
4. **space.jpg** - Uzay

## 🎨 Mevcut Özellikler

### 1. Hazır Gradient Renkler (5 adet)
- ✅ Mor Gradient (varsayılan)
- ✅ Mavi Gradient
- ✅ Yeşil Gradient
- ✅ Gün Batımı
- ✅ Okyanus

### 2. Resim Arka Planlar (4 adet)
- 🌲 Orman
- ⛰️ Dağ
- 📚 Kütüphane
- 🌌 Uzay

### 3. Özel Renk Seçici
- 🎨 Color picker ile istediğin rengi seç

## 📸 Resim Özellikleri

### Önerilen Boyutlar
- **Genişlik**: 1920px veya daha fazla
- **Yükseklik**: 1080px veya daha fazla
- **Oran**: 16:9 (Full HD)

### Dosya Formatı
- ✅ JPG (önerilen - küçük dosya boyutu)
- ✅ PNG (şeffaflık gerekiyorsa)
- ❌ GIF (animasyonlu resimler dikkat dağıtır)

### Dosya Boyutu
- **Maksimum**: 500KB
- **Önerilen**: 200-300KB
- **Optimizasyon**: [TinyPNG](https://tinypng.com/) veya [Squoosh](https://squoosh.app/) kullan

### Renk ve Kontrast
- ✅ Sakin, pastel tonlar
- ✅ Düşük kontrast (dikkat dağıtmaz)
- ✅ Timer yazıları okunabilir olmalı
- ❌ Çok parlak veya karmaşık desenler

## 🔍 Ücretsiz Resim Kaynakları

### 1. Unsplash
- URL: https://unsplash.com/
- Lisans: Ücretsiz kullanım
- Kalite: Çok yüksek
- Arama örnekleri:
  - "calm forest"
  - "peaceful mountain"
  - "minimalist library"
  - "space stars"

### 2. Pexels
- URL: https://pexels.com/
- Lisans: Ücretsiz kullanım
- Kalite: Yüksek
- Arama örnekleri:
  - "study background"
  - "nature calm"
  - "workspace minimal"

### 3. Pixabay
- URL: https://pixabay.com/
- Lisans: Ücretsiz kullanım
- Kalite: Orta-Yüksek

## 🚀 Adım Adım Kurulum

### 1. Resim İndir
```bash
# Unsplash'ten örnek:
# 1. unsplash.com'a git
# 2. "calm forest" ara
# 3. Beğendiğin resmi seç
# 4. "Download free" butonuna tıkla
```

### 2. Resmi Optimize Et (Opsiyonel)
```bash
# TinyPNG kullan:
# 1. tinypng.com'a git
# 2. Resmi yükle
# 3. Optimize edilmiş versiyonu indir
```

### 3. Resmi Kopyala
```bash
# Windows:
# Resmi kopyala ve şu klasöre yapıştır:
# frontend/public/timer-backgrounds/

# Dosya adını değiştir:
# Örnek: downloaded-image.jpg → forest.jpg
```

### 4. Uygulamayı Test Et
```bash
# Uygulamayı çalıştır:
cd frontend
npm run dev

# Timer sekmesine git
# Sağ üstteki 🎨 butonuna tıkla
# "Orman" seçeneğini seç
```

## ⚙️ Özel Resim Eklemek

Kendi resimlerini eklemek istersen:

### 1. Resmi Ekle
```bash
# Resmi şu klasöre kopyala:
frontend/public/timer-backgrounds/beach.jpg
```

### 2. Kodu Güncelle
`frontend/src/App.jsx` dosyasını aç ve `backgroundOptions` dizisine ekle:

```javascript
const backgroundOptions = [
  // ... mevcut seçenekler ...
  { 
    id: "beach", 
    name: "Sahil", 
    type: "image", 
    value: "/timer-backgrounds/beach.jpg" 
  },
];
```

### 3. Kaydet ve Test Et
```bash
# Dosyayı kaydet
# Tarayıcı otomatik yenilenecek
# Timer'da yeni seçenek görünecek
```

## 🎯 Kullanım İpuçları

### Odaklanma İçin En İyi Arka Planlar
1. **Orman/Doğa**: Sakinleştirici, yeşil tonlar
2. **Dağ**: Motivasyonel, geniş perspektif
3. **Kütüphane**: Çalışma moduna sokar
4. **Minimalist**: Dikkat dağıtmaz

### Kaçınılması Gerekenler
- ❌ Çok parlak renkler
- ❌ Karmaşık desenler
- ❌ Hareketli/animasyonlu görseller
- ❌ Çok fazla detay
- ❌ Düşük çözünürlük (bulanık görünür)

### Performans İpuçları
- Dosya boyutunu küçük tut (< 500KB)
- JPG formatını tercih et
- Resmi optimize et
- Çok fazla resim ekleme (yavaşlatır)

## 🌙 Dark Mode Uyumluluğu

Timer arka planları dark mode'da da çalışır:
- Gradient'ler otomatik uyumlu
- Resimler üzerine hafif overlay eklenir
- Yazılar her zaman okunabilir

## 📱 Mobil Uyumluluk

Tüm arka planlar mobilde de çalışır:
- Resimler otomatik ölçeklenir
- Arka plan seçici mobil uyumlu
- Touch-friendly butonlar

## 🐛 Sorun Giderme

### Resim Görünmüyor
1. Dosya adını kontrol et (büyük/küçük harf önemli)
2. Dosya yolunu kontrol et (`/timer-backgrounds/`)
3. Tarayıcıyı yenile (Ctrl+F5)
4. Console'da hata var mı kontrol et (F12)

### Resim Yavaş Yükleniyor
1. Dosya boyutunu küçült (< 300KB)
2. Resmi optimize et (TinyPNG)
3. Çözünürlüğü düşür (1920x1080 yeterli)

### Yazılar Okunmuyor
1. Daha koyu/açık bir resim seç
2. Kontrast yüksek bir resim kullan
3. Gradient arka plan kullan (her zaman okunabilir)

## 📊 Örnek Resim Listesi

İşte popüler seçenekler:

### Doğa Temalı
- 🌲 Orman (yeşil, sakin)
- 🏔️ Dağ (motivasyonel)
- 🌊 Okyanus (huzurlu)
- 🌅 Gün Batımı (sıcak)

### Çalışma Temalı
- 📚 Kütüphane (odaklanma)
- 💻 Workspace (modern)
- ☕ Kafe (rahat)
- 🏛️ Üniversite (akademik)

### Minimalist
- 🌌 Uzay (sade)
- 🎨 Tek Renk (basit)
- 📐 Geometrik (modern)
- ☁️ Bulutlar (hafif)

## 🎓 Önerilen Kombinasyonlar

### Sabah Çalışması
- Gradient: Mavi veya Yeşil
- Resim: Orman, Dağ

### Öğlen Çalışması
- Gradient: Mor (varsayılan)
- Resim: Kütüphane

### Akşam Çalışması
- Gradient: Gün Batımı
- Resim: Uzay

### Gece Çalışması
- Gradient: Okyanus (koyu)
- Resim: Uzay
- Dark Mode: Açık

## 💾 Yedekleme

Özel resimlerini yedeklemeyi unutma:
```bash
# Klasörü kopyala:
frontend/public/timer-backgrounds/

# Veya Git'e ekle:
git add frontend/public/timer-backgrounds/
git commit -m "Timer arka plan resimleri eklendi"
```

## 🔗 Faydalı Linkler

- [Unsplash](https://unsplash.com/) - Ücretsiz fotoğraflar
- [Pexels](https://pexels.com/) - Stok fotoğraflar
- [TinyPNG](https://tinypng.com/) - Resim optimizasyonu
- [Squoosh](https://squoosh.app/) - Resim sıkıştırma
- [Remove.bg](https://remove.bg/) - Arka plan silme

## 📝 Notlar

- Resimleri ticari kullanım için lisanslarını kontrol et
- Telif hakkı olan resimleri kullanma
- Kendi çektiğin fotoğrafları kullanabilirsin
- Resim boyutunu optimize etmeyi unutma
