// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChatbotResponse } from '../services/movieService';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: '👋 Hi! I\'m CineBot! Ask me about movies — try "show me horror movies" or "I want something funny"! 🎬',
    movies: []
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMsg, 
      movies: [] 
    }]);
    
    setLoading(true);
    
    const response = await getChatbotResponse(userMsg);
    
    setMessages(prev => [...prev, {
      role: 'bot',
      text: response.text,
      movies: response.movies || []
    }]);
    
    setLoading(false);
  };

  const quickPrompts = [
    '😊 Happy movies',
    '😱 Horror please',
    '💥 Action films',
    '💕 Romantic',
    '🔥 Trending now',
    '🎭 Upcoming'
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '360px',
      height: '520px',
      background: '#141414',
      borderRadius: '20px',
      border: '1px solid #2a2a2a',
      boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 999,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #e50914, #b20710)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div>
            <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
              CineBot
            </div>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'rgba(255,255,255,0.8)' 
            }}>
              🟢 AI Movie Assistant
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #e50914, #b20710)'
                  : '#2a2a2a',
                color: 'white',
                fontSize: '0.88rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
            </div>
            
            {/* Movie suggestions from bot */}
            {msg.movies && msg.movies.length > 0 && (
              <div style={{ marginTop: '10px', paddingLeft: '5px' }}>
                {msg.movies.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      background: '#1e1e1e',
                      borderRadius: '12px',
                      padding: '8px',
                      marginBottom: '6px',
                      border: '1px solid #333',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#e50914'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                    >
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          style={{
                            width: '38px',
                            height: '56px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '38px',
                          height: '56px',
                          background: '#333',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0
                        }}>🎬</div>
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{
                          color: 'white',
                          margin: '0 0 3px',
                          fontSize: '0.82rem',
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {movie.title}
                        </p>
                        <p style={{ 
                          color: '#FFD700',
                          margin: '0 0 2px',
                          fontSize: '0.75rem'
                        }}>
                          ⭐ {movie.rating}
                        </p>
                        <p style={{
                          color: '#666',
                          margin: 0,
                          fontSize: '0.72rem'
                        }}>
                          {movie.release_date?.substring(0, 4)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={{ 
            display: 'flex', 
            gap: '5px',
            padding: '5px 0'
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '8px',
                height: '8px',
                background: '#e50914',
                borderRadius: '50%',
                animation: `bounce 0.6s ${i * 0.15}s infinite alternate`
              }} />
            ))}
            <style>{`
              @keyframes bounce {
                from { transform: translateY(0); opacity: 0.4; }
                to { transform: translateY(-8px); opacity: 1; }
              }
            `}</style>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #222',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        flexShrink: 0
      }}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            style={{
              padding: '4px 10px',
              background: '#222',
              border: '1px solid #333',
              borderRadius: '12px',
              color: '#bbb',
              fontSize: '0.72rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = '#e50914';
              e.target.style.color = '#e50914';
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#333';
              e.target.style.color = '#bbb';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #222',
        display: 'flex',
        gap: '8px',
        flexShrink: 0
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any movie..."
          style={{
            flex: 1,
            padding: '10px 15px',
            borderRadius: '25px',
            border: '1px solid #333',
            background: '#2a2a2a',
            color: 'white',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e50914, #b20710)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: (loading || !input.trim()) ? 0.6 : 1,
            flexShrink: 0
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;