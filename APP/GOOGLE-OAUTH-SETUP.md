# Google OAuth Kurulum Rehberi

Bu rehber, Kariyer Asistanı uygulamasına Google ile giriş özelliğini eklemek için gerekli adımları açıklar.

## 1. Google Cloud Console Kurulumu

### Adım 1: Google Cloud Console'a Git
1. [Google Cloud Console](https://console.cloud.google.com) adresine git
2. Google hesabınla giriş yap

### Adım 2: Yeni Proje Oluştur
1. Sol üst köşeden proje seçiciye tıkla
2. "New Project" butonuna tıkla
3. Proje adı: `Kariyer Asistanı` (veya istediğin bir isim)
4. "Create" butonuna tıkla

### Adım 3: OAuth Consent Screen Ayarla
1. Sol menüden "APIs & Services" > "OAuth consent screen" seç
2. User Type: **External** seç (kişisel kullanım için)
3. "Create" butonuna tıkla
4. Gerekli bilgileri doldur:
   - App name: `Kariyer Asistanı`
   - User support email: Kendi email'in
   - Developer contact: Kendi email'in
5. "Save and Continue" tıkla
6. Scopes ekranında "Save and Continue" tıkla (varsayılan scope'lar yeterli)
7. Test users ekranında kendi email'ini ekle
8. "Save and Continue" tıkla

### Adım 4: OAuth Client ID Oluştur
1. Sol menüden "APIs & Services" > "Credentials" seç
2. Üstten "+ CREATE CREDENTIALS" > "OAuth client ID" seç
3. Application type: **Web application** seç
4. Name: `Kariyer Asistanı Web Client`
5. **Authorized JavaScript origins** ekle:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com` (kendi domain'in)
6. **Authorized redirect URIs** ekle:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
7. "Create" butonuna tıkla
8. **Client ID**'yi kopyala (bu önemli!)

## 2. Backend Kurulumu

### Adım 1: Environment Variables Ayarla
`backend/.env` dosyasını aç ve şunu ekle:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

**ÖNEMLİ:** `your_google_client_id_here` yerine Google Cloud Console'dan aldığın Client ID'yi yapıştır.

### Adım 2: Database'i Güncelle
Eğer database'in zaten varsa, `google_id` kolonunu eklemen gerekiyor:

```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
```

Veya database'i sıfırdan oluşturuyorsan, `backend/database/schema.sql` dosyasını kullan (zaten güncellenmiş durumda).

### Adım 3: Backend'i Başlat
```bash
cd backend
npm install
npm start
```

## 3. Frontend Kurulumu

### Adım 1: Environment Variables Ayarla
`frontend/.env` dosyasını oluştur (yoksa) ve şunu ekle:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**ÖNEMLİ:** Aynı Client ID'yi buraya da yapıştır.

### Adım 2: Frontend'i Başlat
```bash
cd frontend
npm install
npm run dev
```

## 4. Test Et

1. Tarayıcıda `http://localhost:5173` adresine git
2. "Yolculuğa Başla" butonuna tıkla
3. "Giriş Yap" sekmesinde "Sign in with Google" butonunu gör
4. Butona tıkla ve Google hesabınla giriş yap
5. İlk girişte izin ekranı çıkacak, "Allow" de
6. Başarılı giriş sonrası dashboard'a yönlendirileceksin

## 5. Production (Canlı Ortam) İçin

### Filezilla ile Sunucuya Yüklerken:

1. **Backend .env dosyasını güncelle:**
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

2. **Frontend .env dosyasını güncelle:**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. **Google Cloud Console'da Authorized Origins güncelle:**
   - `https://your-frontend-domain.com` ekle
   - `https://your-backend-domain.com` ekle

4. **Frontend'i build et:**
   ```bash
   cd frontend
   npm run build
   ```

5. **Filezilla ile yükle:**
   - Backend: Tüm dosyaları yükle (`.env` dahil)
   - Frontend: `dist` klasörünün içindekileri yükle

## Sorun Giderme

### "Google ile giriş başarısız" Hatası
- Client ID'nin doğru olduğundan emin ol
- `.env` dosyalarının doğru yerde olduğundan emin ol
- Backend'in çalıştığından emin ol (`http://localhost:5000` açık olmalı)

### "redirect_uri_mismatch" Hatası
- Google Cloud Console'da Authorized redirect URIs'e `http://localhost:5173` eklenmiş mi kontrol et
- Production'da domain'in doğru yazıldığından emin ol

### Google Butonu Görünmüyor
- `VITE_GOOGLE_CLIENT_ID` environment variable'ının set edildiğinden emin ol
- Frontend'i yeniden başlat (`npm run dev`)
- Tarayıcı console'unda hata var mı kontrol et

### Database Hatası
- `google_id` kolonunun `users` tablosuna eklendiğinden emin ol
- Backend console'unda hata mesajlarını kontrol et

## Güvenlik Notları

1. **Client ID'yi paylaşma:** `.env` dosyalarını git'e commit etme
2. **Test Users:** Development aşamasında sadece test kullanıcıları ekle
3. **Production:** Canlıya alırken OAuth consent screen'i "In Production" moduna al
4. **HTTPS:** Production'da mutlaka HTTPS kullan

## Ek Bilgiler

- Google OAuth dokümantasyonu: https://developers.google.com/identity/protocols/oauth2
- React OAuth kütüphanesi: https://www.npmjs.com/package/@react-oauth/google
- Google Cloud Console: https://console.cloud.google.com

---

**Not:** Bu özellik sayesinde kullanıcılar şifre oluşturmadan, Google hesaplarıyla hızlıca giriş yapabilirler. İlk girişte otomatik olarak hesap oluşturulur.
