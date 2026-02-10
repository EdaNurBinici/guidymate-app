# 🔧 AI Koç Sorunu - Debug Rehberi

## Sorun Tespiti

AI Koç çalışmıyor. Olası sebepler:

### 1️⃣ Backend Çalışmıyor
### 2️⃣ Database Bağlantısı Yok
### 3️⃣ GROQ API Hatası
### 4️⃣ Frontend-Backend Bağlantı Sorunu
### 5️⃣ Profil Eksik

---

## ✅ Adım Adım Kontrol

### 1. Backend Çalışıyor mu?

Terminal'de:
```bash
cd web-app-api
npm start
```

Şunu görmelisiniz:
```
Server çalışıyor: http://localhost:5000
```

**Test:**
Tarayıcıda `http://localhost:5000` adresine git. Şunu görmelisin:
```json
{
  "status": "Server çalışıyor! ✅",
  "endpoints": {
    "coach": ["/coach/start", "/coach/reply", ...]
  }
}
```

---

### 2. Frontend Çalışıyor mu?

Terminal'de (yeni terminal):
```bash
cd frontend
npm run dev
```

Şunu görmelisiniz:
```
VITE ready in 500 ms
Local: http://localhost:5173
```

---

### 3. Tarayıcı Console'da Hata Var mı?

1. `http://localhost:5173` adresine git
2. **F12** tuşuna bas
3. **Console** sekmesine bak
4. "AI Koç" sekmesine tıkla
5. "Yeni Sohbet" butonuna tıkla

**Ne görüyorsun?**
- ✅ Hiçbir hata yok → Sorun backend'de
- ❌ Kırmızı hata var → Hatayı kopyala ve bana gönder

---

### 4. Backend Console'da Hata Var mı?

Backend terminaline bak. "Yeni Sohbet" butonuna tıkladığında ne yazıyor?

**Olası Hatalar:**

#### A) "Coach Start Error: rate_limit"
**Sebep:** GROQ API rate limit aşıldı
**Çözüm:** 1-2 dakika bekle ve tekrar dene

#### B) "Coach Start Error: quota"
**Sebep:** GROQ API kotası doldu
**Çözüm:** 
- Yeni GROQ API key al: https://console.groq.com/keys
- `.env` dosyasını güncelle:
```env
GROQ_API_KEY=yeni_api_key_buraya
```
- Backend'i yeniden başlat

#### C) "Coach Start Error: Invalid API Key"
**Sebep:** GROQ API key yanlış veya geçersiz
**Çözüm:**
- GROQ Console'da key'i kontrol et
- Yeni key oluştur
- `.env` dosyasını güncelle

#### D) "relation 'coach_sessions' does not exist"
**Sebep:** Database tabloları oluşturulmamış
**Çözüm:**
```bash
cd web-app-api
node init-db.js
```

---

### 5. Profil Doldurulmuş mu?

AI Koç çalışması için **profil doldurulmuş olmalı**.

1. "Profilim" sekmesine git
2. Tüm alanları doldur
3. "Güncelle" butonuna tıkla
4. "AI Koç" sekmesine geri dön
5. "Yeni Sohbet" butonuna tıkla

---

## 🔍 Manuel Test

### Backend'i Test Et

Terminal'de:
```bash
# 1. Token al (giriş yap)
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"

# Response'dan token'ı kopyala

# 2. AI Koç başlat
curl -X POST http://localhost:5000/coach/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_BURAYA" \
  -d "{\"userName\":\"Test\"}"
```

**Başarılı Response:**
```json
{
  "sessionId": 1,
  "message": "Merhaba! Ben senin kariyer koçunum..."
}
```

**Hatalı Response:**
```json
{
  "message": "Groq API rate limit aşıldı..."
}
```

---

## 🚀 Hızlı Çözümler

### Çözüm 1: Backend'i Yeniden Başlat
```bash
cd web-app-api
# Ctrl+C ile durdur
npm start
```

### Çözüm 2: Database'i Yeniden Oluştur
```bash
cd web-app-api
node init-db.js
```

### Çözüm 3: Yeni GROQ API Key Al
1. https://console.groq.com/keys adresine git
2. "Create API Key" tıkla
3. Key'i kopyala
4. `web-app-api/.env` dosyasını aç
5. `GROQ_API_KEY=yeni_key_buraya` yaz
6. Backend'i yeniden başlat

### Çözüm 4: Frontend'i Yeniden Başlat
```bash
cd frontend
# Ctrl+C ile durdur
npm run dev
```

### Çözüm 5: Cache Temizle
```
Ctrl + Shift + Delete
```
Veya gizli pencere kullan: `Ctrl + Shift + N`

---

## 📋 Kontrol Listesi

Şunları kontrol et:

- [ ] Backend çalışıyor (`http://localhost:5000` açılıyor)
- [ ] Frontend çalışıyor (`http://localhost:5173` açılıyor)
- [ ] `.env` dosyasında `GROQ_API_KEY` var
- [ ] Database bağlantısı çalışıyor
- [ ] Profil doldurulmuş
- [ ] Tarayıcı console'da hata yok
- [ ] Backend console'da hata yok

---

## 🆘 Hala Çalışmıyor?

Bana şunları söyle:

1. **Tarayıcı Console'da ne yazıyor?** (F12 → Console)
2. **Backend Console'da ne yazıyor?** (Terminal)
3. **"Yeni Sohbet" butonuna tıklayınca ne oluyor?**
4. **Profil doldurulmuş mu?**
5. **Backend `http://localhost:5000` açılıyor mu?**

Bu bilgilerle sorunu çözebilirim! 🚀
