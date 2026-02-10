# Google ile Giriş Test Rehberi

## ✅ Kurulum Tamamlandı!

Client ID başarıyla eklendi:
```
926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0.apps.googleusercontent.com
```

---

## 🚀 Şimdi Test Edelim

### Adım 1: Backend'i Yeniden Başlat
```bash
cd backend
npm start
```

✅ Çıktıda `Server 5000 portunda çalışıyor... 🚀` görmelisin.

### Adım 2: Frontend'i Yeniden Başlat
```bash
cd frontend
npm run dev
```

✅ Çıktıda `Local: http://localhost:5173` görmelisin.

**ÖNEMLİ:** Frontend'i mutlaka yeniden başlat! `.env` değişiklikleri için gerekli.

---

## 🧪 Test Senaryoları

### Test 1: Google Butonu Görünüyor mu?

1. Tarayıcıda `http://localhost:5173` aç
2. "Yolculuğa Başla" butonuna tıkla
3. "Giriş Yap" veya "Kayıt Ol" sekmesinde **"Sign in with Google"** butonu görünmeli

✅ **Başarılı:** Google butonu görünüyor
❌ **Başarısız:** Buton yok → Frontend'i yeniden başlat

---

### Test 2: Google ile Giriş Yap

1. **"Sign in with Google"** butonuna tıkla
2. Google hesap seçim ekranı açılmalı
3. Hesabını seç (edanur0x0@gmail.com)
4. İlk girişte izin ekranı çıkacak → **"Allow"** de
5. Otomatik olarak dashboard'a yönlendirilmelisin
6. Sağ üstte **"Giriş başarılı! 🎉"** toast mesajı görmelisin

✅ **Başarılı:** Dashboard'a girdin
❌ **Başarısız:** Hata mesajı → Aşağıdaki sorun gidermeye bak

---

### Test 3: Profil Oluştur

İlk Google girişinde profil boş olacak:

1. **"Profilim"** sekmesine git
2. Bilgilerini doldur:
   - Yaş: 20
   - Şehir: İstanbul
   - Öğrenci misin: Evet
   - Hedef: "YKS'de iyi bir sıralama yapmak"
3. **"Güncelle"** butonuna tıkla
4. **"Profil Kaydedildi! ✅"** mesajı görmelisin

---

### Test 4: Çıkış Yap ve Tekrar Giriş Yap

1. **"Çıkış"** butonuna tıkla
2. Tekrar **"Sign in with Google"** ile giriş yap
3. Bu sefer izin ekranı çıkmayacak (zaten izin verdin)
4. Direkt dashboard'a gireceksin
5. Profil bilgilerin kayıtlı olmalı

---

## 🐛 Sorun Giderme

### Sorun 1: Google Butonu Görünmüyor

**Çözüm:**
```bash
# Frontend'i durdur (Ctrl+C)
# Yeniden başlat
cd frontend
npm run dev
```

**Kontrol Et:**
- `frontend/.env` dosyasında `VITE_GOOGLE_CLIENT_ID` var mı?
- Browser console'da (F12) hata var mı?

---

### Sorun 2: "Erişim engellendi: Yetkilendirme hatası"

**Sebep:** Google Cloud Console'da Authorized JavaScript origins eksik.

**Çözüm:**
1. [Google Cloud Console](https://console.cloud.google.com) > Credentials
2. OAuth 2.0 Client ID'ni düzenle
3. **Authorized JavaScript origins** ekle:
   - `http://localhost:5173`
4. **Authorized redirect URIs** ekle:
   - `http://localhost:5173`
5. Kaydet ve 5 dakika bekle (Google'ın güncelleme süresi)

---

### Sorun 3: "Google ile giriş başarısız"

**Kontrol Et:**

1. **Backend çalışıyor mu?**
   ```bash
   curl http://localhost:5000
   ```

2. **Backend .env doğru mu?**
   ```bash
   cat backend/.env | grep GOOGLE_CLIENT_ID
   ```
   Çıktı: `GOOGLE_CLIENT_ID=926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0.apps.googleusercontent.com`

3. **Backend console'da hata var mı?**
   Backend terminalinde hata mesajlarını kontrol et.

---

### Sorun 4: "redirect_uri_mismatch"

**Çözüm:**
Google Cloud Console'da redirect URI'leri kontrol et:
- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

---

## 📊 Başarı Kontrol Listesi

✅ Backend çalışıyor
✅ Frontend çalışıyor
✅ Google butonu görünüyor
✅ Google ile giriş yapabiliyorum
✅ Profil oluşturabiliyorum
✅ Çıkış yapıp tekrar girebiliyorum

**Hepsi tamam mı? Tebrikler! Google OAuth başarıyla çalışıyor! 🎉**

---

## 🌐 Production (Canlı Ortam) İçin

Sunucuya yüklerken:

1. **Google Cloud Console'da domain ekle:**
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com`

2. **Frontend .env güncelle:**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0.apps.googleusercontent.com
   ```

3. **Frontend'i build et:**
   ```bash
   cd frontend
   npm run build
   ```

4. **Filezilla ile yükle:**
   - Backend: Tüm dosyalar + `.env`
   - Frontend: `dist` klasörünün içindekiler

---

## 💡 İpuçları

1. **Test Users:** Development modunda sadece eklediğin test kullanıcıları giriş yapabilir
2. **Production Mode:** Canlıya alırken OAuth consent screen'i "In Production" moduna al
3. **HTTPS:** Production'da mutlaka HTTPS kullan
4. **Cache:** Değişiklikler hemen yansımıyorsa browser cache'ini temizle (Ctrl+Shift+Delete)

---

**İyi kullanımlar! 🚀**
