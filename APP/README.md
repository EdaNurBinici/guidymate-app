# 🚀 GuidyMate

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

**GuidyMate**, yapay zeka destekli bir kariyer planlama asistanıdır. Kullanıcılara kişiselleştirilmiş yol haritaları sunar, hedeflerini takip eder ve üretkenlik araçlarıyla gelişimlerini destekler.

> *Kullanıcıların kariyer yolculuğunu oyunlaştırılmış bir deneyimle yönetmesini sağlayan Full-Stack bir web uygulamasıdır.*

---

## 📱 Preview

![Landing Page](./screenshots/landing.jpg)
![Profile Page](./screenshots/profile.png)

---

## 🎯 Project Goals

- **AI Entegrasyonu:** Groq API kullanarak kişiye özel kariyer tavsiyeleri sunmak
- **Full-Stack Mimari:** React, Node.js ve PostgreSQL ile modern ve ölçeklenebilir bir yapı kurmak
- **Kullanıcı Deneyimi:** Oyunlaştırılmış seviye sistemi (Gamification) ile kullanıcıyı motive etmek
- **Clean Code:** Modüler dosya yapısı ve temiz kod prensiplerine uygun geliştirme

---

## 🛠 Tech Stack

**Frontend:**
- React 18 + Vite
- CSS Modules
- Context API
- Google OAuth 2.0

**Backend:**
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt

**AI:**
- Groq SDK (Llama-3 Model)

**Tools:**
- Git
- Docker
- Render/Vercel

---

## 🚀 Getting Started

```bash
# 1. Projeyi Klonlayın
git clone https://github.com/EdaNurBinici/guidymate-app.git
cd guidymate-app

# 2. Backend Kurulumu
cd web-app-api
npm install
# .env dosyasını oluşturup veritabanı bilgilerinizi girin
npm start

# 3. Frontend Kurulumu (Yeni Terminalde)
cd frontend
npm install
npm run dev
```

Detaylı kurulum için [SETUP.md](./SETUP.md) dosyasına bakın.

---

## 🏗 Architecture

Proje **MVC (Model-View-Controller)** desenine benzer modüler bir yapıda tasarlanmıştır:

- **Frontend:** Bileşen tabanlı (Component-based) yapı. Her sayfa ve özellik (Roadmap, Notes, AI Coach) kendi modülü içindedir
- **Backend:** RESTful API mimarisi. Servis katmanı, kontrolcüler ve rotalar ayrılmıştır
- **Database:** İlişkisel veri tabanı tasarımı (Users, Profiles, Roadmaps tabloları)

---

## 🌟 Key Features

✅ **AI Career Coach:** 7/24 aktif kariyer danışmanı  
✅ **Smart Roadmap:** Seviye bazlı (Level 1-10) ilerleme sistemi  
✅ **Focus Timer:** Özelleştirilebilir Pomodoro sayacı ve temalar  
✅ **Multi-Theme:** Light, Dark ve Autumn (Sonbahar) modları  
✅ **Secure Auth:** Google ile tek tıkla giriş  
✅ **Multi-Language:** Türkçe ve İngilizce dil desteği

---

## 📚 Documentation

- [Quick Start Guide](./QUICK-START.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Features Overview](./FEATURES.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👤 Developer

**Eda Nur Binici**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eda-nur-binici/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/EdaNurBinici)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
