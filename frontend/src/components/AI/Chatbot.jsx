import React, { useState, useRef, useEffect } from 'react';
import { movieService } from '../../services/tmdbService';
import { Link } from 'react-router-dom';

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Hi! I\'m CineBot, your AI movie assistant! Ask me about movies, get recommendations based on your mood, or find where to watch your favorite films! 🎬'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [movieSuggestions, setMovieSuggestions] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Add user message
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage
        }]);

        try {
            const response = await movieService.sendChatMessage(
                userMessage,
                messages
            );

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.message
            }]);

            if (response.movie_suggestions?.length > 0) {
                setMovieSuggestions(response.movie_suggestions);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I had a problem. Please try again!'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = [
        "😊 I'm happy, suggest a movie",
        "😢 I'm sad, help me",
        "🎃 Horror movies please",
        "🚀 Best Sci-Fi movies",
        "💕 Romantic movies",
        "🔥 What's trending?"
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '380px',
            height: '550px',
            background: '#1a1a1a',
            borderRadius: '20px',
            border: '1px solid #333',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
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
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>
                        🤖
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>CineBot</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                            🟢 AI Movie Assistant
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
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
                gap: '10px'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '80%',
                            padding: '10px 15px',
                            borderRadius: msg.role === 'user' 
                                ? '20px 20px 5px 20px' 
                                : '20px 20px 20px 5px',
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, #e50914, #b20710)'
                                : '#2a2a2a',
                            color: 'white',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div style={{ display: 'flex', gap: '5px', padding: '10px' }}>
                        <div style={dotStyle}>•</div>
                        <div style={{...dotStyle, animationDelay: '0.2s'}}>•</div>
                        <div style={{...dotStyle, animationDelay: '0.4s'}}>•</div>
                    </div>
                )}
                
                {/* Movie Suggestions from Chat */}
                {movieSuggestions.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>
                            📽️ Movies I found:
                        </p>
                        {movieSuggestions.map(movie => (
                            <Link
                                key={movie.id}
                                to={`/movie/${movie.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    background: '#2a2a2a',
                                    borderRadius: '10px',
                                    padding: '8px',
                                    marginBottom: '8px',
                                    cursor: 'pointer'
                                }}>
                                    {movie.poster && (
                                        <img 
                                            src={movie.poster} 
                                            alt={movie.title}
                                            style={{
                                                width: '40px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p style={{ 
                                            color: 'white', 
                                            margin: 0,
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {movie.title}
                                        </p>
                                        <p style={{ 
                                            color: '#888', 
                                            margin: 0,
                                            fontSize: '0.75rem'
                                        }}>
                                            ⭐ {movie.rating}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div style={{
                padding: '10px 15px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                borderTop: '1px solid #333'
            }}>
                {quickPrompts.map((prompt, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setInput(prompt);
                        }}
                        style={{
                            padding: '4px 10px',
                            background: 'transparent',
                            border: '1px solid #444',
                            borderRadius: '15px',
                            color: '#aaa',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div style={{
                padding: '15px',
                borderTop: '1px solid #333',
                display: 'flex',
                gap: '10px'
            }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about any movie..."
                    style={{
                        flex: 1,
                        padding: '10px 15px',
                        borderRadius: '25px',
                        border: '1px solid #444',
                        background: '#2a2a2a',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

const dotStyle = {
    animation: 'bounce 1s infinite',
    color: '#e50914',
    fontSize: '1.5rem'
};

export default Chatbot;