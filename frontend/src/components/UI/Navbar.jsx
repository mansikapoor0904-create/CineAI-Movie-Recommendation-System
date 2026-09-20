import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <nav style={{
            background: 'rgba(10, 10, 10, 0.95)',
            borderBottom: '1px solid #222',
            padding: '0 40px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '70px'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '28px' }}>🎬</span>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            CineAI
                        </span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div style={{ 
                    display: 'flex',
                    gap: '30px',
                    alignItems: 'center'
                }}>
                    <NavLink to="/">🏠 Home</NavLink>
                    <NavLink to="/upcoming">🎭 Upcoming</NavLink>
                    {isLoggedIn && (
                        <NavLink to="/dashboard">🎯 Dashboard</NavLink>
                    )}
                </div>

                {/* Auth Section */}
                <div style={{ 
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                }}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'white'
                                }}>
                                    <div style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {user?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                        {user?.name}
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '8px 20px',
                                    background: 'transparent',
                                    border: '1px solid #444',
                                    borderRadius: '20px',
                                    color: '#aaa',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '8px 20px',
                                    background: 'transparent',
                                    border: '1px solid #555',
                                    borderRadius: '20px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '8px 20px',
                                    background: 'linear-gradient(135deg, #e50914, #b20710)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}>
                                    Sign Up Free
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} style={{
        color: '#aaa',
        textDecoration: 'none',
        fontSize: '0.95rem',
        transition: 'color 0.2s',
        padding: '5px 0'
    }}
    onMouseEnter={(e) => e.target.style.color = '#e50914'}
    onMouseLeave={(e) => e.target.style.color = '#aaa'}
    >
        {children}
    </Link>
);

export default Navbar;