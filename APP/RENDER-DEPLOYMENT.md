# 🚀 Render.com ile Backend Deployment

## Adım 1: Render.com'a Kaydol
https://render.com - GitHub ile giriş yap

## Adım 2: Backend'i Hazırla

1. `backend/package.json` dosyasına şunu ekle:
```json
"engines": {
  "node": "18.x"
}
```

2. Backend'de `start` script'i olduğundan emin ol (zaten var).

## Adım 3: Render'da Web Service Oluştur

1. Dashboard'da **"New +"** → **"Web Service"**
2. GitHub repo'nu bağla (veya manuel deploy)
3. Ayarlar:
   - **Name**: `kariyer-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

## Adım 4: Environment Variables Ekle

Render dashboard'da **Environment** sekmesine git ve ekle:

```
DB_USER=postgres
DB_PASS=your_password
DB_NAME=ai_career_db
DB_HOST=your_render_postgres_host
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Adım 5: PostgreSQL Ekle

1. **"New +"** → **"PostgreSQL"**
2. **Name**: `kariyer-db`
3. **Plan**: `Free`
4. Oluşturulduktan sonra **Internal Database URL**'i kopyala
5. Backend service'inde environment variables'ı güncelle:
   - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` yerine
   - Tek bir `DATABASE_URL` kullan

## Adım 6: Backend Kodunu Güncelle

`backend/server.js` dosyasında PostgreSQL bağlantısını güncelle:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});
```

## Adım 7: Database Schema Yükle

Render PostgreSQL dashboard'da **"Connect"** → **"External Connection"** ile bağlan:

```bash
psql -h your-host -U your-user -d your-db -f backend/database/schema.sql
```

## Adım 8: Frontend'i Güncelle

`frontend/.env` dosyasını güncelle:

```env
VITE_API_URL=https://kariyer-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=926946179411-vr7iplgn0go7i4msa53igj2ptrrkssr0.apps.googleusercontent.com
```

Frontend'i yeniden build et:
```bash
cd frontend
npm run build
```

`dist` klasörünü Filezilla ile sunucuna yükle.

## Adım 9: Google OAuth Güncelle

Google Cloud Console'da **Authorized JavaScript origins** ve **Authorized redirect URIs**'e ekle:
- `https://your-frontend-domain.com`
- `https://kariyer-backend.onrender.com`

## Adım 10: Test Et

1. Backend: `https://kariyer-backend.onrender.com` → "Server çalışıyor! ✅" görmeli
2. Frontend: Kendi domain'inde Google ile giriş yap

---

## ÖNEMLİ NOTLAR

⚠️ **Render Free Plan**: 15 dakika kullanılmazsa uyur, ilk istekte 30-60 saniye uyanma süresi var.

💡 **Alternatif**: Railway.app veya Fly.io da kullanabilirsin (benzer adımlar).

🔒 **Güvenlik**: Production'da `.env` dosyalarını GitHub'a yükleme!
