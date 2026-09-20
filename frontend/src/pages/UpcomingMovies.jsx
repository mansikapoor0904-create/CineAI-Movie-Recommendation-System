// src/pages/UpcomingMovies.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingMovies } from '../services/movieService';

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const data = await getUpcomingMovies();
    setMovies(data);
    setLoading(false);
  };

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil(
      (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return 'Released';
    if (diff === 0) return '🎉 Today!';
    return `${diff} days`;
  };

  const formatDate = (d) => {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div style={{ 
      maxWidth: '1300px', 
      margin: '0 auto',
      padding: '30px 20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
        borderRadius: '20px',
        padding: '35px',
        marginBottom: '35px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#e50914', fontSize: '2.2rem', marginBottom: '8px' }}>
          🎭 Upcoming Movies
        </h1>
        <p style={{ color: '#888', fontSize: '1rem' }}>
          Latest releases with dates, platforms & summaries
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎬</div>
          <p>Loading upcoming movies...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {movies.map(movie => (
            <div key={movie.id} style={{
              background: '#1a1a1a',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid #2a2a2a',
              display: 'flex',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e50914'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              {/* Poster */}
              <div style={{ 
                width: '180px', 
                flexShrink: 0,
                position: 'relative'
              }}>
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      minHeight: '260px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '260px',
                    background: '#2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px'
                  }}>🎬</div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(229,9,20,0.9)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold'
                }}>
                  ⏰ {getDaysLeft(movie.release_date)}
                </div>
              </div>

              {/* Details */}
              <div style={{ 
                flex: 1, 
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{ 
                    color: 'white',
                    fontSize: '1.5rem',
                    marginBottom: '12px'
                  }}>
                    {movie.title}
                  </h2>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <p style={{ 
                        color: '#666',
                        fontSize: '0.75rem',
                        marginBottom: '3px'
                      }}>
                        📅 Release Date
                      </p>
                      <p style={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {formatDate(movie.release_date)}
                      </p>
                    </div>
                    <div>
                      <p style={{ 
                        color: '#666',
                        fontSize: '0.75rem',
                        marginBottom: '3px'
                      }}>
                        ⭐ Rating
                      </p>
                      <p style={{ 
                        color: '#FFD700',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {movie.rating || 'Not rated'}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    color: '#aaa',
                    lineHeight: '1.6',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {movie.overview}
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to={`/movie/${movie.id}`}>
                    <button style={{
                      padding: '9px 22px',
                      background: 'linear-gradient(135deg, #e50914, #b20710)',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      📖 Full Details
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      const wl = JSON.parse(
                        localStorage.getItem('watchlist') || '[]'
                      );
                      if (!wl.includes(movie.id)) {
                        localStorage.setItem(
                          'watchlist', 
                          JSON.stringify([...wl, movie.id])
                        );
                        alert('✅ Added to Watchlist!');
                      } else {
                        alert('Already in Watchlist!');
                      }
                    }}
                    style={{
                      padding: '9px 22px',
                      background: 'transparent',
                      border: '1px solid #555',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    + Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMovies;