import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/tmdbService';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await authService.login(form.email, form.password);
        
        if (result.success) {
            onLogin(result.user, result.token);
            navigate('/dashboard');
        } else {
            setError(result.message || 'Login failed');
        }
        
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
            padding: '20px'
        }}>
            <div style={{
                background: '#1a1a1a',
                borderRadius: '20px',
                padding: '50px 40px',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid #333',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎬</div>
                    <h2 style={{
                        color: 'white',
                        fontSize: '2rem',
                        marginBottom: '8px'
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: '#888' }}>Sign in to CineAI</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(229, 9, 20, 0.1)',
                        border: '1px solid #e50914',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '20px',
                        color: '#e50914',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            color: '#aaa',
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            required
                            placeholder="your@email.com"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ 
                            color: '#aaa',
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: loading 
                                ? '#666'
                                : 'linear-gradient(135deg, #e50914, #b20710)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? '🔄 Signing in...' : '🎬 Sign In'}
                    </button>
                </form>

                <p style={{ 
                    textAlign: 'center',
                    color: '#888',
                    marginTop: '25px'
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ 
                        color: '#e50914',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;