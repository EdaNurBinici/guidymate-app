# Localhost'ta Google Login Hatası Çözümü

## Sorun
`origin_mismatch` hatası: Google OAuth, localhost'tan giriş yaparken "Erişim engellendi: Yetkilendirme hatası" veriyor.

## Neden Oluyor?
Google Cloud Console'da **Authorized JavaScript origins** ve **Authorized redirect URIs** ayarlarında localhost URL'leri eksik veya yanlış yapılandırılmış.

---

## ✅ Çözüm 1: Google Cloud Console Ayarları (ÖNERİLEN)

### Adım 1: Google Cloud Console'a Git
1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. OAuth 2.0 Client ID'nizi bulun (926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0)
3. Sağ taraftaki **✏️ Edit** (düzenle) ikonuna tıklayın

### Adım 2: Authorized JavaScript Origins Ekle
**Authorized JavaScript origins** bölümüne şu URL'leri ekleyin:

```
http://localhost:5173
http://localhost:5000
http://127.0.0.1:5173
http://127.0.0.1:5000
```

**NOT:** Hem `localhost` hem de `127.0.0.1` ekleyin çünkü bazı tarayıcılar farklı davranabilir.

### Adım 3: Authorized Redirect URIs Ekle
**Authorized redirect URIs** bölümüne şu URL'leri ekleyin:

```
http://localhost:5173
http://localhost:5000
http://127.0.0.1:5173
http://127.0.0.1:5000
```

### Adım 4: Kaydet ve Bekle
1. **Save** butonuna tıklayın
2. ⏰ **Değişikliklerin aktif olması 5-10 dakika sürebilir**
3. Bu süre zarfında kahve molası verin ☕

### Adım 5: Tarayıcı Cache'ini Temizle
```
Chrome/Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Del
Safari: Cmd + Option + E
```

Veya **gizli pencere (incognito)** kullanın.

### Adım 6: Test Et
1. Frontend'i başlatın: `cd frontend && npm run dev`
2. Backend'i başlatın: `cd web-app-api && npm start`
3. `http://localhost:5173` adresine gidin
4. "Sign in with Google" butonuna tıklayın
5. ✅ Artık çalışmalı!

---

## ✅ Çözüm 2: Popup Mode (HEMEN ÇALIŞIR)

Eğer Google Console ayarlarını yapmak istemiyorsanız veya hızlı bir çözüm istiyorsanız:

**Bu çözüm zaten uygulandı!** ✅

`frontend/src/App.jsx` dosyasında GoogleLogin bileşenine `ux_mode="popup"` eklendi:

```jsx
<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => {
    setMessage("Google ile giriş başarısız");
  }}
  text={view === "login" ? "signin_with" : "signup_with"}
  shape="rectangular"
  theme="outline"
  size="large"
  width="100%"
  ux_mode="popup"  // ← Bu satır eklendi
/>
```

**Avantajları:**
- ✅ Hemen çalışır, beklemeye gerek yok
- ✅ Google Console ayarı gerektirmez
- ✅ Popup pencerede giriş yapar

**Dezavantajları:**
- ⚠️ Popup blocker engelleyebilir
- ⚠️ Bazı kullanıcılar popup'ları sevmez

---

## 🔍 Sorun Giderme

### Hala "origin_mismatch" Hatası Alıyorum
1. **Google Console değişikliklerini bekleyin:** 5-10 dakika sürebilir
2. **Tarayıcı cache'ini temizleyin:** Ctrl+Shift+Delete
3. **Gizli pencere kullanın:** Ctrl+Shift+N (Chrome) veya Ctrl+Shift+P (Firefox)
4. **URL'leri kontrol edin:** `http://` ile başladığından emin olun (https değil!)
5. **Port numaralarını kontrol edin:** Frontend 5173, Backend 5000

### "Popup Blocked" Hatası
Tarayıcınızın popup engelleyicisini devre dışı bırakın:
- Chrome: Adres çubuğunun sağındaki 🚫 ikonuna tıklayın
- Firefox: Ayarlar → Gizlilik ve Güvenlik → İzinler → Açılır Pencereler

### "Google ile giriş başarısız" Mesajı
1. **Backend çalışıyor mu?** `http://localhost:5000` açık olmalı
2. **Client ID doğru mu?** `.env` dosyalarını kontrol edin
3. **Console'da hata var mı?** F12 → Console sekmesine bakın

### Backend'de "Invalid token" Hatası
Google token'ı doğrulanamıyor olabilir. Backend loglarını kontrol edin:
```bash
cd web-app-api
npm start
```

---

## 📋 Kontrol Listesi

- [ ] Google Cloud Console'da Authorized JavaScript origins eklendi
- [ ] Google Cloud Console'da Authorized redirect URIs eklendi
- [ ] Değişiklikler kaydedildi ve 5-10 dakika beklendi
- [ ] Tarayıcı cache'i temizlendi
- [ ] Frontend çalışıyor (`npm run dev`)
- [ ] Backend çalışıyor (`npm start`)
- [ ] `.env` dosyalarında GOOGLE_CLIENT_ID doğru
- [ ] `ux_mode="popup"` eklendi (zaten yapıldı ✅)

---

## 🚀 Production (Canlı Ortam) İçin

Canlı ortamda da aynı hatayı alırsanız:

1. **Google Cloud Console'da production URL'lerini ekleyin:**
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

2. **HTTPS kullanın:** Production'da mutlaka HTTPS olmalı

3. **Frontend .env dosyasını güncelleyin:**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0.apps.googleusercontent.com
   ```

4. **Frontend'i yeniden build edin:**
   ```bash
   cd frontend
   npm run build
   ```

---

## 📚 Ek Kaynaklar

- [Google OAuth Dokümantasyonu](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Kütüphanesi](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Not:** Bu rehber, localhost'ta Google OAuth sorunlarını çözmek için hazırlanmıştır. Herhangi bir sorun yaşarsanız, backend loglarını ve tarayıcı console'unu kontrol edin.
