// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const ratingColor = (r) => {
    if (r >= 7) return '#00c851';
    if (r >= 5) return '#ffbb33';
    return '#ff4444';
  };

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '15px',
          overflow: 'hidden',
          background: '#1a1a1a',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
          boxShadow: hovered
            ? '0 20px 40px rgba(229,9,20,0.4)'
            : '0 4px 15px rgba(0,0,0,0.5)',
        }}
      >
        {/* Poster */}
        <div style={{ 
          position: 'relative', 
          height: '270px',
          overflow: 'hidden',
          background: '#111'
        }}>
          {!imgError && movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '50px' }}>🎬</span>
              <span style={{ 
                color: '#555', 
                fontSize: '0.75rem',
                textAlign: 'center',
                padding: '0 10px'
              }}>
                {movie.title}
              </span>
            </div>
          )}

          {/* Rating Badge */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: ratingColor(movie.rating),
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}>
            ⭐ {movie.rating}
          </div>

          {/* Hover Overlay */}
          {hovered && (
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
              padding: '30px 12px 12px',
            }}>
              <p style={{
                color: '#ddd',
                fontSize: '0.72rem',
                lineHeight: '1.4',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {movie.overview || 'Click to see details'}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '12px' }}>
          <h3 style={{
            color: 'white',
            fontSize: '0.9rem',
            marginBottom: '6px',
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            margin: '0 0 6px 0'
          }}>
            {movie.title}
          </h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#777', fontSize: '0.78rem' }}>
              📅 {movie.release_date?.substring(0, 4) || 'TBA'}
            </span>
            {hovered && (
              <span style={{
                color: '#e50914',
                fontSize: '0.78rem',
                fontWeight: 'bold'
              }}>
                View →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;