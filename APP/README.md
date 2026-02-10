# GuidyMate - AI-Powered Career Planning Assistant

A modern, full-stack web application that helps users plan their career path with AI-powered personalized recommendations, goal tracking, and productivity tools. Built with React, Node.js, and PostgreSQL.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Live Demo

> **Note:** The application is currently in development. Live demo will be available soon.

<!-- Uncomment when deployed:
**[View Live Demo](https://your-app-url.com)** | **[API Documentation](https://your-api-url.com/docs)**
-->

## Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)
*Clean and modern landing page with theme selection*

### AI Career Coach
![AI Coach](./screenshots/ai-coach.png)
*Interactive AI chat interface with personalized career advice*

### Personalized Roadmap
![Roadmap](./screenshots/roadmap.png)
*Level-based learning roadmap with progress tracking*

### Focus Timer
![Focus Timer](./screenshots/focus-timer.png)
*Pomodoro timer with customizable backgrounds*

### Profile Management
![Profile](./screenshots/profile.png)
*Comprehensive user profile with career goals*

## Features

### AI Career Coach
- Personalized career recommendations using Groq API
- Interactive real-time chat interface
- Session management with conversation history
- Context-aware advice based on user profile and goals

### Smart Roadmap System
- AI-generated personalized learning paths
- Visual progress tracking with level indicators
- Gamified progression system (Level 1-10)
- Dynamic task generation based on user progress
- Task completion tracking and level advancement

### Advanced Note-Taking
- Rich text support with Markdown compatibility
- Search and filter functionality
- Organized card-based interface
- Full CRUD operations with timestamps

### Focus Timer (Pomodoro)
- Customizable work and break intervals
- Multiple theme options:
  - 5 gradient backgrounds
  - 4 image backgrounds (forest, mountain, library, space)
  - Custom color picker
- Fullscreen mode for distraction-free focus
- Audio notifications for session transitions
- Persistent user preferences

### Comprehensive Profile System
- Personal information management (age, city, education, work experience)
- Career goal setting and tracking
- Daily study hour logging
- Input validation and data integrity checks

### Multi-Theme System
- Light Mode: Clean, bright interface (default)
- Dark Mode: Reduced eye strain for extended use
- Autumn Mode: Warm, seasonal color palette
- Theme persistence across sessions

### Secure Authentication
- Email/password registration and login
- Google OAuth integration for one-click sign-in
- JWT-based session management
- bcrypt password encryption
- Automatic token expiration handling

## Latest Updates (v2.0)

### Code Quality Improvements
- Custom modal system replacing browser dialogs
- Comprehensive API error handling
- Loading states for all async operations
- Accessibility features (ARIA labels, keyboard navigation, screen reader support)
- Input validation with min/max values and type checking
- Production-ready logging system
- CSS optimization with reduced !important usage
- Modular API utility organization

### User Experience Enhancements
- User-friendly, actionable error messages
- Smooth modal animations with keyboard support
- Real-time form validation
- Mobile-optimized responsive design
- Consistent theming across all components

## Tech Stack

### Frontend
- React 18 - Modern UI library with hooks
- Vite - Fast build tool and dev server
- CSS3 - Custom styling with CSS variables
- React Markdown - Markdown rendering for AI responses
- Google OAuth - Social authentication
- Custom Hooks - Responsive design utilities

### Backend
- Node.js 18+ - JavaScript runtime
- Express.js - Web application framework
- PostgreSQL 15 - Relational database
- JWT - Stateless authentication
- Groq SDK - AI integration (llama-3.3-70b-versatile)
- bcrypt - Password hashing
- CORS - Cross-origin resource sharing

### DevOps & Deployment
- Frontend: Vercel / Netlify
- Backend: Render.com
- Database: Render PostgreSQL
- Version Control: Git & GitHub

## Installation

### Prerequisites
```bash
Node.js >= 18.0.0
PostgreSQL >= 15.0
npm or yarn
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/EdaNurBinici/guidymate-app.git
cd guidymate-app
```

### 2. Backend Setup

```bash
cd web-app-api
npm install

# Create environment file
cp .env.example .env
```

Configure `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/career_db
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
NODE_ENV=development
```

Initialize Database:
```bash
# Create database
createdb career_db

# Run migrations
psql -d career_db -f database/schema.sql

# Or use the init script
node init-db.js
```

Start Backend:
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

Configure `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Start Frontend:
```bash
npm run dev
# App runs on http://localhost:5173
```

Build for Production:
```bash
npm run build
npm run preview
```

## Quick Start Guide

### 1. First Time Setup
1. Open the application in your browser
2. Click "Start Free" to begin
3. Register using email or Google account
4. Complete your profile with personal information, education, work experience, and career goals

### 2. Get AI Advice
1. Navigate to the "AI Coach" tab
2. Click "Get Analysis & Advice" for personalized recommendations
3. Use the chat interface for specific questions and guidance

### 3. Follow Your Roadmap
1. Go to the "Roadmap" tab
2. Click "Generate Plan" to create personalized tasks
3. Complete tasks and mark them as done
4. Level up when all tasks are completed
5. Generate new roadmap for the next level

### 4. Take Notes
1. Access the "Notes" tab
2. Add title and content for your notes
3. Use the search bar to find specific notes
4. Click on notes to view full content

### 5. Use Focus Timer
1. Open the "Focus Mode" tab
2. Set work time (default: 25 minutes)
3. Set break time (default: 5 minutes)
4. Choose your preferred background theme
5. Click play to start the timer
6. Enter fullscreen for an immersive experience

## Responsive Design

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
- Swipe gesture support

## Security Features

### Authentication
- JWT token-based authentication
- Secure password hashing (bcrypt, 10 rounds)
- Token expiration (24 hours)
- Automatic logout on token expiry
- Google OAuth 2.0 integration

### Data Protection
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Environment variable protection
- HTTPS enforcement (production)

### Error Handling
- Graceful error messages
- No sensitive data exposure in errors
- Development-only logging
- Network error handling
- Comprehensive HTTP status handling (401/403/404/500)

## UI/UX Highlights

### Design Principles
- Clean and modern minimalist interface
- Intuitive navigation
- Responsive across all devices
- WCAG 2.1 accessibility compliance
- Optimized performance

### Animations
- Smooth page transitions
- Interactive hover effects
- Loading spinners
- Toast notifications
- Modal slide-in animations

### Accessibility
- ARIA labels on all interactive elements
- Full keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Visible focus indicators
- Semantic HTML structure

## Database Schema

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

## API Documentation

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
  "message": "Registration successful",
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
  "message": "Profile saved successfully"
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
  "message": "Hello John! How can I help you today?"
}
```

**POST /coach/reply**
```json
Request:
{
  "sessionId": 1,
  "userMessage": "How can I learn React?"
}

Response:
{
  "message": "To learn React effectively..."
}
```

### Roadmap Endpoints

**GET /roadmap**
```json
Response:
[
  {
    "id": 1,
    "task": "Learn HTML and CSS fundamentals",
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
  "message": "Roadmap generated successfully"
}
```

**POST /roadmap/levelup**
```json
Response:
{
  "success": true,
  "newLevel": 2,
  "message": "Congratulations! You've reached Level 2!"
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
    "content": "useState and useEffect...",
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
  "content": "useState and useEffect..."
}

Response:
{
  "id": 1,
  "message": "Note added successfully"
}
```

**DELETE /notes/:id**
```json
Response:
{
  "message": "Note deleted successfully"
}
```

## Testing

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

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Lazy loading for images
- Debounced search inputs
- Memoized components
- Efficient re-renders
- Optimized bundle size

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Eda Nur Binici**
- GitHub: [@EdaNurBinici](https://github.com/EdaNurBinici)
- LinkedIn: [Eda Nur Binici](https://linkedin.com/in/edanurbinici)

## Acknowledgments

- Groq AI for powerful language models
- Google OAuth for secure authentication
- Render.com for reliable hosting
- React Community for excellent ecosystem
- PostgreSQL for robust database
- Vite for fast build tool

## Documentation

- [Setup Guide](SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](web-app-api/README.md)
- [Frontend Documentation](frontend/README.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## Roadmap

### Planned Features
- Email verification
- Password reset functionality
- Export notes as PDF
- Calendar integration
- Mobile app (React Native)
- Team collaboration features
- Analytics dashboard
- Multi-language support

## Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Open an issue on GitHub
3. Contact via email

---

This project demonstrates full-stack development expertise including React, Node.js, PostgreSQL, AI integration, authentication, responsive design, and modern web development best practices.
