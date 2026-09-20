// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import UpcomingMovies from './pages/UpcomingMovies';
import Chatbot from './components/Chatbot';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <Router>
      <div style={{ 
        backgroundColor: '#0a0a0a', 
        minHeight: '100vh', 
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/upcoming" element={<UpcomingMovies />} />
        </Routes>

        {/* Floating Chatbot Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e50914, #b20710)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: 'white',
            boxShadow: '0 4px 20px rgba(229,9,20,0.6)',
            zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          title="Open CineBot"
        >
          {showChatbot ? '✕' : '🤖'}
        </button>

        {/* Chatbot Panel */}
        {showChatbot && (
          <Chatbot onClose={() => setShowChatbot(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;