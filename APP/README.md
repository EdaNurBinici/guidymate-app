# GuidyMate

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

AI-powered career planning assistant with personalized roadmaps, goal tracking, and productivity tools.

> Full-Stack web application for managing career journey through gamified experience.

---

## Preview

<div align="center">

### Landing & Authentication
<img src="./screenshots/landing.jpg" width="400" alt="Landing"> <img src="./screenshots/login.png" width="400" alt="Login">

### Dashboard
<img src="./screenshots/profile.png" width="400" alt="Profile"> <img src="./screenshots/roadmap.png" width="400" alt="Roadmap">

### [🌐 Live Demo - Try it yourself!](https://guidymate.com.tr)

</div>

---

## Key Features

- AI Career Coach - 24/7 personalized guidance
- Smart Roadmap - Level-based progression (1-10)
- Focus Timer - Customizable Pomodoro
- Multi-Theme - Light, Dark, Autumn modes
- Secure Auth - Google OAuth 2.0
- Multi-Language - Turkish and English
- Smart Notes - Organize learning journey

---

## Tech Stack

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

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/EdaNurBinici/guidymate-app.git
cd guidymate-app

# 2. Backend Setup
cd web-app-api
npm install
# Create .env file with your database credentials
npm start

# 3. Frontend Setup (New Terminal)
cd frontend
npm install
npm run dev
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## Architecture

**MVC-inspired modular structure:**

- **Frontend:** Component-based architecture with dedicated modules for Roadmap, Notes, and AI Coach
- **Backend:** RESTful API with separated service layer, controllers, and routes
- **Database:** Relational design (Users, Profiles, Roadmaps tables)

---

## Documentation

- [Quick Start Guide](./QUICK-START.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Features Overview](./FEATURES.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Developer

**Eda Nur Binici**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eda-nur-binici/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/EdaNurBinici)

---

If you like this project, please give it a star!
