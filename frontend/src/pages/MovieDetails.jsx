// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/movieService';
import MovieCard from '../components/UI/MovieCard';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    setLoading(true);
    const data = await getMovieDetails(id);
    setMovie(data);
    setLoading(false);
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px',
      color: 'white'
    }}>
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎬</div>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>
        Loading movie details...
      </p>
    </div>
  );

  if (!movie) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px',
      color: 'white'
    }}>
      <p style={{ fontSize: '1.2rem' }}>Movie not found.</p>
      <Link to="/" style={{ color: '#e50914' }}>← Go Home</Link>
    </div>
  );

  return (
    <div>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: '450px', overflow: 'hidden' }}>
        {movie.backdrop ? (
          <img
            src={movie.backdrop}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)'
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(transparent 20%, #0a0a0a 90%)'
        }} />
        
        {/* Back Button */}
        <Link to="/" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          textDecoration: 'none',
          background: 'rgba(0,0,0,0.6)',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(5px)'
        }}>
          ← Back
        </Link>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1300px',
        margin: '-120px auto 0',
        padding: '0 25px 40px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                style={{
                  width: '220px',
                  borderRadius: '15px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                }}
              />
            ) : (
              <div style={{
                width: '220px',
                height: '330px',
                borderRadius: '15px',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px'
              }}>🎬</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}>
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <p style={{ 
                color: '#888', 
                fontStyle: 'italic',
                marginBottom: '15px'
              }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Stats */}
            <div style={{ 
              display: 'flex', 
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '18px'
            }}>
              <span style={{
                background: 'rgba(255,215,0,0.15)',
                color: '#FFD700',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}>
                ⭐ {movie.rating}/10
              </span>
              <span style={{ color: '#aaa', fontSize: '0.9rem', alignSelf: 'center' }}>
                📅 {movie.release_date}
              </span>
              <span style={{ color: '#aaa', fontSize: '0.9rem', alignSelf: 'center' }}>
                ⏱️ {movie.runtime ? `${movie.runtime} min` : 'N/A'}
              </span>
              <span style={{ color: '#aaa', fontSize: '0.9rem', alignSelf: 'center' }}>
                🌐 {movie.language}
              </span>
              <span style={{ color: '#888', fontSize: '0.9rem', alignSelf: 'center' }}>
                🎬 Dir: {movie.director}
              </span>
            </div>

            {/* Genres */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              marginBottom: '20px'
            }}>
              {movie.genres?.map(g => (
                <span key={g} style={{
                  padding: '5px 14px',
                  background: 'rgba(229,9,20,0.15)',
                  border: '1px solid #e50914',
                  borderRadius: '20px',
                  color: '#e50914',
                  fontSize: '0.82rem'
                }}>
                  {g}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p style={{
              color: '#ccc',
              lineHeight: '1.8',
              fontSize: '0.97rem',
              marginBottom: '25px'
            }}>
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                  <button style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #e50914, #b20710)',
                    border: 'none',
                    borderRadius: '25px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem'
                  }}>
                    ▶ Watch Trailer
                  </button>
                </a>
              )}
              <button
                onClick={() => {
                  const wl = JSON.parse(localStorage.getItem('watchlist') || '[]');
                  if (!wl.includes(movie.id)) {
                    localStorage.setItem('watchlist', JSON.stringify([...wl, movie.id]));
                    alert('✅ Added to Watchlist!');
                  } else {
                    alert('Already in Watchlist!');
                  }
                }}
                style={{
                  padding: '12px 28px',
                  background: 'transparent',
                  border: '2px solid #e50914',
                  borderRadius: '25px',
                  color: '#e50914',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 'bold'
                }}
              >
                + Watchlist
              </button>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          marginTop: '40px'
        }}>
          {/* LEFT */}
          <div>
            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div style={{ marginBottom: '35px' }}>
                <h3 style={{ 
                  color: '#e50914', 
                  fontSize: '1.3rem',
                  marginBottom: '18px'
                }}>
                  🎭 Cast
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {movie.cast.map((p, i) => (
                    <div key={i} style={{ 
                      textAlign: 'center',
                      width: '80px'
                    }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 6px',
                        background: '#2a2a2a',
                        border: '2px solid #333'
                      }}>
                        {p.photo ? (
                          <img
                            src={p.photo}
                            alt={p.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '28px'
                          }}>👤</div>
                        )}
                      </div>
                      <p style={{ 
                        color: 'white',
                        fontSize: '0.72rem',
                        fontWeight: 'bold',
                        margin: '0 0 2px'
                      }}>
                        {p.name}
                      </p>
                      <p style={{ 
                        color: '#666',
                        fontSize: '0.65rem',
                        margin: 0
                      }}>
                        {p.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {movie.similar_movies?.length > 0 && (
              <div>
                <h3 style={{ 
                  color: '#e50914',
                  fontSize: '1.3rem',
                  marginBottom: '18px'
                }}>
                  🎯 You May Also Like
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '15px'
                }}>
                  {movie.similar_movies.map(m => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* Streaming */}
            {movie.streaming_platforms?.length > 0 && (
              <div style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #2a2a2a'
              }}>
                <h4 style={{ 
                  color: '#e50914', 
                  marginBottom: '15px',
                  fontSize: '1rem'
                }}>
                  📺 Stream On
                </h4>
                {movie.streaming_platforms.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}>
                    <img 
                      src={p.logo} 
                      alt={p.name}
                      style={{ 
                        width: '28px', 
                        height: '28px',
                        borderRadius: '6px'
                      }}
                    />
                    <span style={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {p.name}
                    </span>
                    <span style={{ 
                      marginLeft: 'auto',
                      color: '#00c851',
                      fontSize: '0.8rem'
                    }}>
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Download Links */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '20px',
              border: '1px solid #2a2a2a'
            }}>
              <h4 style={{ 
                color: '#e50914',
                marginBottom: '5px',
                fontSize: '1rem'
              }}>
                💾 Rent or Buy
              </h4>
              <p style={{ 
                color: '#666',
                fontSize: '0.75rem',
                marginBottom: '15px'
              }}>
                Legal platforms only
              </p>
              {movie.download_links?.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e50914'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <span style={{ 
                      color: 'white',
                      fontSize: '0.88rem'
                    }}>
                      {link.name}
                    </span>
                    <span style={{ 
                      color: '#888',
                      fontSize: '0.75rem'
                    }}>
                      {link.type} →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;