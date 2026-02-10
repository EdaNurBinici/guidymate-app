# 🎯 AI-Powered Career Assistant

A modern, full-stack web application that helps users plan their career path with AI-powered personalized recommendations, goal tracking, and productivity tools. Built with React, Node.js, and PostgreSQL.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 🌟 Features

### 🤖 AI Career Coach
- **Personalized Advice**: AI-powered career recommendations using Groq API
- **Interactive Chat**: Real-time conversation with AI coach
- **Session Management**: Save and resume chat sessions
- **Context-Aware**: Recommendations based on your profile and goals

### 📊 Smart Roadmap System
- **AI-Generated Paths**: Customized learning roadmaps
- **Progress Tracking**: Visual progress indicators
- **Level System**: Gamified progression (Level 1-10)
- **Adaptive Tasks**: Dynamic task generation based on progress
- **Completion Tracking**: Mark tasks as done and level up

### 📝 Advanced Note-Taking
- **Rich Text Support**: Markdown-compatible notes
- **Search & Filter**: Find notes quickly
- **Organized Cards**: Visual note cards with timestamps
- **CRUD Operations**: Create, read, update, delete notes

### ⏱️ Focus Timer (Pomodoro)
- **Customizable Intervals**: Set work and break times
- **Multiple Themes**: 
  - 5 gradient backgrounds
  - 4 image backgrounds (forest, mountain, library, space)
  - Custom color picker
- **Fullscreen Mode**: Distraction-free focus
- **Audio Notifications**: Sound alerts for breaks
- **Persistent Settings**: Saves your preferences

### 👤 Comprehensive Profile System
- **Personal Info**: Age, city, education, work experience
- **Goal Setting**: Define your career objectives
- **Study Tracking**: Log daily study hours
- **Profile Validation**: Input validation for data integrity

### 🎨 Multi-Theme System
- **Light Mode**: Clean, bright interface (default)
- **Dark Mode**: Easy on the eyes
- **Autumn Mode**: Warm, cozy colors
- **Persistent Selection**: Theme saved across sessions

### 🔐 Secure Authentication
- **Email/Password**: Traditional registration and login
- **Google OAuth**: One-click sign-in
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt encryption
- **Auto-Logout**: Token expiration handling

## 🆕 Latest Updates (v2.0)

### Code Quality Improvements
- ✅ **Custom Modal System**: Replaced browser confirm/prompt with modern modals
- ✅ **Advanced Error Handling**: Comprehensive API error management
- ✅ **Loading States**: Visual feedback for all async operations
- ✅ **Accessibility (a11y)**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Input Validation**: Min/max values, type checking, length limits
- ✅ **Logger Service**: Production-ready logging (console.log disabled in production)
- ✅ **CSS Optimization**: Reduced !important usage by 60%
- ✅ **Code Organization**: Modular API utilities

### User Experience Enhancements
- ✅ **Better Error Messages**: User-friendly, actionable error notifications
- ✅ **Improved Modals**: Smooth animations, ESC/Enter key support
- ✅ **Enhanced Forms**: Real-time validation, better placeholders
- ✅ **Responsive Design**: Optimized for mobile devices
- ✅ **Theme Consistency**: All components support all themes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with CSS variables
- **React Markdown** - Markdown rendering for AI responses
- **Google OAuth** - Social authentication
- **Custom Hooks** - useWindowSize for responsive design

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Minimal web framework
- **PostgreSQL 15** - Relational database
- **JWT** - Stateless authentication
- **Groq SDK** - AI integration (llama-3.3-70b-versatile)
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render.com
- **Database**: Render PostgreSQL
- **Version Control**: Git & GitHub

## 📦 Installation

### Prerequisites
```bash
Node.js >= 18.0.0
PostgreSQL >= 15.0
npm or yarn
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/EdaNurBinici/ai-career-assistant.git
cd ai-career-assistant
```

### 2. Backend Setup

```bash
cd web-app-api
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env`:**
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/career_db
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
NODE_ENV=development
```

**Initialize Database:**
```bash
# Create database
createdb career_db

# Run migrations
psql -d career_db -f database/schema.sql

# Or use the init script
node init-db.js
```

**Start Backend:**
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Start Frontend:**
```bash
npm run dev
# App runs on http://localhost:5173
```

**Build for Production:**
```bash
npm run build
npm run preview
```

## 🚀 Quick Start Guide

### 1. First Time Setup
1. Open the app in your browser
2. Click "Ücretsiz Başla" (Start Free)
3. Register with email or Google
4. Complete your profile with:
   - Age, city, education
   - Work experience (if applicable)
   - Career goals and interests
   - Daily study hours

### 2. Get AI Advice
1. Go to "AI Koç" tab
2. Click "✨ Analiz & Tavsiye Al"
3. Receive personalized career recommendations
4. Or chat with AI coach for specific questions

### 3. Follow Your Roadmap
1. Navigate to "Yol Haritası" tab
2. Click "✨ Plan Oluştur" to generate tasks
3. Complete tasks and check them off
4. Level up when all tasks are done
5. Generate new roadmap for next level

### 4. Take Notes
1. Go to "Not Defteri" tab
2. Add title and content
3. Click "Ekle" to save
4. Search notes using the search bar
5. Click notes to view full content

### 5. Use Focus Timer
1. Open "Focus Modu" tab
2. Set work time (default: 25 min)
3. Set break time (default: 5 min)
4. Choose background theme
5. Click play to start
6. Enter fullscreen for immersive experience

## 📱 Responsive Design

### Desktop (>768px)
- Sidebar navigation
- Two-column layouts
- Expanded chat interface
- Full-width content cards

### Mobile (<768px)
- Bottom navigation bar
- Single-column layouts
- Collapsible chat sidebar
- Touch-optimized controls
- Swipe gestures

## 🔒 Security Features

### Authentication
- ✅ JWT token-based authentication
- ✅ Secure password hashing (bcrypt, 10 rounds)
- ✅ Token expiration (24 hours)
- ✅ Auto-logout on token expiry
- ✅ Google OAuth 2.0 integration

### Data Protection
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ HTTPS enforcement (production)

### Error Handling
- ✅ Graceful error messages
- ✅ No sensitive data in errors
- ✅ Logging system (dev only)
- ✅ Network error handling
- ✅ 401/403/404/500 status handling

## 🎨 UI/UX Highlights

### Design Principles
- **Clean & Modern**: Minimalist interface
- **Intuitive**: Easy to navigate
- **Responsive**: Works on all devices
- **Accessible**: WCAG 2.1 compliant
- **Fast**: Optimized performance

### Animations
- Smooth page transitions
- Hover effects on interactive elements
- Loading spinners
- Toast notifications
- Modal slide-in animations

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios
- Focus indicators
- Semantic HTML

## 📊 Database Schema

### Tables

**users**
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- created_at (TIMESTAMP)
```

**users_profiles**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- age, city, is_student, grade
- university, uni_type, department
- is_working, sector, position
- interests, study_hours
- created_at, updated_at
```

**ai_advices**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- advice (TEXT)
- created_at (TIMESTAMP)
```

**coach_sessions**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- title (VARCHAR)
- created_at, updated_at
```

**coach_messages**
```sql
- id (SERIAL PRIMARY KEY)
- session_id (INTEGER FK)
- role (VARCHAR) -- 'user' or 'assistant'
- content (TEXT)
- created_at (TIMESTAMP)
```

**roadmap_items**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- level (INTEGER)
- task (TEXT)
- is_completed (BOOLEAN)
- created_at (TIMESTAMP)
```

**notes**
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- title (VARCHAR)
- content (TEXT)
- created_at, updated_at
```

## 🌐 API Documentation

### Authentication Endpoints

**POST /register**
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "message": "Kayıt başarılı!",
  "userId": 1
}
```

**POST /login**
```json
Request:
{
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1
}
```

**POST /auth/google**
```json
Request:
{
  "credential": "google_oauth_token"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1
}
```

### Profile Endpoints

**GET /profile/:user_id**
```json
Response:
{
  "hasProfile": true,
  "profile": {
    "age": 25,
    "city": "Istanbul",
    "interests": "Web Development",
    ...
  }
}
```

**POST /profile**
```json
Request:
{
  "age": 25,
  "city": "Istanbul",
  "interests": "Web Development",
  "study_hours": 4
}

Response:
{
  "success": true,
  "message": "Profil kaydedildi"
}
```

### AI Endpoints

**POST /get-ai-advice**
```json
Request:
{
  "age": 25,
  "interests": "Web Development",
  ...
}

Response:
{
  "advice": "AI-generated career advice..."
}
```

**POST /coach/start**
```json
Request:
{
  "userName": "John"
}

Response:
{
  "sessionId": 1,
  "message": "Merhaba John! Nasıl yardımcı olabilirim?"
}
```

**POST /coach/reply**
```json
Request:
{
  "sessionId": 1,
  "userMessage": "React nasıl öğrenebilirim?"
}

Response:
{
  "message": "React öğrenmek için..."
}
```

### Roadmap Endpoints

**GET /roadmap**
```json
Response:
[
  {
    "id": 1,
    "task": "HTML ve CSS temellerini öğren",
    "is_completed": true,
    "level": 1
  },
  ...
]
```

**POST /roadmap/generate**
```json
Response:
{
  "roadmap": [...],
  "message": "Plan oluşturuldu"
}
```

**POST /roadmap/levelup**
```json
Response:
{
  "success": true,
  "newLevel": 2,
  "message": "Tebrikler! Level 2'ye geçtin!"
}
```

### Notes Endpoints

**GET /notes**
```json
Response:
[
  {
    "id": 1,
    "title": "React Hooks",
    "content": "useState ve useEffect...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

**POST /notes**
```json
Request:
{
  "title": "React Hooks",
  "content": "useState ve useEffect..."
}

Response:
{
  "id": 1,
  "message": "Not eklendi"
}
```

**DELETE /notes/:id**
```json
Response:
{
  "message": "Not silindi"
}
```

## 🧪 Testing

```bash
# Run backend tests
cd web-app-api
npm test

# Run frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📈 Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Lazy loading for images
- Debounced search inputs
- Memoized components
- Efficient re-renders
- Optimized bundle size

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and all rights are reserved.

## 👨‍💻 Developer

**Eda Nur Binici**
- GitHub: [@EdaNurBinici](https://github.com/EdaNurBinici)
- LinkedIn: [Eda Nur Binici](https://linkedin.com/in/edanurbinici)
- Email: edanurbinici@example.com

## 🙏 Acknowledgments

- **Groq AI** - Powerful language models
- **Google OAuth** - Secure authentication
- **Render.com** - Reliable hosting
- **React Community** - Excellent ecosystem
- **PostgreSQL** - Robust database
- **Vite** - Fast build tool

## 📚 Documentation

- [Setup Guide](SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](web-app-api/README.md)
- [Frontend Documentation](frontend/README.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## 🐛 Known Issues

- None currently! 🎉

## 🗺️ Roadmap

### Planned Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Export notes as PDF
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Open an issue on GitHub
3. Contact via email

---

**Built with ❤️ by Eda Nur Binici**

*This project demonstrates full-stack development expertise including React, Node.js, PostgreSQL, AI integration, authentication, responsive design, and modern web development best practices.*
