# 🎬 CineAI — AI-Powered Movie Recommendation System

CineAI is an AI-powered movie recommendation web application that helps users discover movies based on their interests, mood, ratings, and movie preferences.

The application combines a modern React frontend with a Node.js/Express backend and live movie information from **The Movie Database (TMDB)**.

---

## ✨ Features

### 🎥 Movie Discovery
- Browse popular movies
- Explore top-rated movies
- View trending movies
- Discover upcoming movies
- Search for movies
- View detailed movie information
- Display movie posters, ratings, release dates, and descriptions

### 🤖 AI Features
- AI-powered movie recommendations
- Mood-based movie recommendations
- AI movie assistant/chatbot
- Personalized movie discovery

### 🔐 User Features
- User signup
- User login
- Authentication support
- User profile
- Token-based authentication

### 🌐 Live Movie Data

CineAI uses the TMDB API to retrieve current movie information instead of relying on a static local movie dataset.

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Hooks
- Fetch API

### Backend

- Node.js
- Express.js
- REST API
- CORS
- dotenv

### AI & Movie APIs

- TMDB API
- AI-powered recommendation services
- Mood analysis

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- PowerShell

---

## 📁 Project Structure

```text
CineAI-Movie-Recommendation-System/
│
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── ai.py
│   │   │   ├── auth.py
│   │   │   ├── chatbot.py
│   │   │   └── movies.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── auth_service.py
│   │   │   ├── mood_service.py
│   │   │   └── tmdb_service.py
│   │   │
│   │   └── utils/
│   │       ├── jwt_handler.py
│   │       └── storage_handler.py
│   │
│   ├── app.py
│   ├── config.py
│   ├── server.js
│   ├── package.json
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── .gitignoregit 
