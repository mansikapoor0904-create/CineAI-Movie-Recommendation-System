// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      background: 'rgba(10,10,10,0.97)',
      borderBottom: '1px solid #222',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 500,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '65px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🎬</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#e50914'
            }}>
              CineAI
            </span>
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link to="/" style={{
            color: '#aaa',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = '#aaa'}
          >
            🏠 Home
          </Link>
          <Link to="/upcoming" style={{
            color: '#aaa',
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = '#aaa'}
          >
            🎭 Upcoming
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;