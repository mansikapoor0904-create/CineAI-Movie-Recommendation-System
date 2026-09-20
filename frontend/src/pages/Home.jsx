// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from "../components/UI/MovieCard";
import MoodDetector from "../components/Mood_detector";
import { 
  getTrendingMovies, 
  getPopularMovies,
  getTopRatedMovies,
  searchMovies 
} from '../services/movieService';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [moodMovies, setMoodMovies] = useState([]);
  const [moodInfo, setMoodInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const [error, setError] = useState(null);

  // ============================================
  // LOAD MOVIES ON PAGE LOAD
  // ============================================
  useEffect(() => {
    loadAllMovies();
  }, []);

  const loadAllMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading movies...');
      
      // Load all at once
      const [trendingData, popularData, topRatedData] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies()
      ]);

      console.log('Trending loaded:', trendingData.length);
      console.log('Popular loaded:', popularData.length);
      
      setTrending(trendingData);
      setPopular(popularData);
      setTopRated(topRatedData);
      
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SEARCH HANDLER
  // ============================================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    const results = await searchMovies(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // ============================================
  // MOOD HANDLER
  // ============================================
  const handleMoodDetected = (mood, movies, genreNames) => {
    setMoodMovies(movies);
    setMoodInfo({ mood, genreNames });
    // Scroll to mood movies
    setTimeout(() => {
      document.getElementById('mood-results')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 300);
  };

  // Get current tab movies
  const getCurrentMovies = () => {
    if (activeTab === 'trending') return trending;
    if (activeTab === 'popular') return popular;
    if (activeTab === 'toprated') return topRated;
    return trending;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      
      {/* ── HERO SECTION ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: '20px',
        padding: '60px 40px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 'bold',
          color: '#e50914',
          marginBottom: '15px',
          textShadow: '0 0 30px rgba(229,9,20,0.3)'
        }}>
          🎬 CineAI - Smart Movie Recommendations
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#aaa',
          marginBottom: '35px'
        }}>
          AI-powered recommendations based on your mood
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          maxWidth: '600px', 
          margin: '0 auto',
          gap: '10px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search any movie..."
            style={{
              flex: 1,
              padding: '16px 22px',
              borderRadius: '50px',
              border: '2px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              backdropFilter: 'blur(10px)'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '16px 32px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #e50914, #b20710)',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            Search 🔍
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                padding: '16px 20px',
                borderRadius: '50px',
                background: '#333',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* ── ERROR MESSAGE ── */}
      {error && (
        <div style={{
          background: 'rgba(229,9,20,0.1)',
          border: '2px solid #e50914',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#e50914', fontSize: '1.1rem', marginBottom: '10px' }}>
            ⚠️ {error}
          </p>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
            Make sure your TMDB API key is set in the .env file as:<br/>
            <code style={{ 
              color: '#FFD700',
              background: '#222',
              padding: '4px 10px',
              borderRadius: '5px'
            }}>
              REACT_APP_TMDB_API_KEY=your_key_here
            </code>
          </p>
          <button
            onClick={loadAllMovies}
            style={{
              marginTop: '15px',
              padding: '10px 25px',
              background: '#e50914',
              border: 'none',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* ── SEARCH RESULTS ── */}
      {searchResults.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#e50914', fontSize: '1.5rem' }}>
              🔍 Results for "{searchQuery}" ({searchResults.length} found)
            </h2>
            <button
              onClick={clearSearch}
              style={{
                padding: '8px 20px',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ✕ Clear
            </button>
          </div>
          <MovieGrid movies={searchResults} />
        </section>
      )}

      {/* ── MOOD DETECTOR ── */}
      {!searchResults.length && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            color: '#e50914', 
            fontSize: '1.5rem',
            marginBottom: '20px'
          }}>
            🎭 How Are You Feeling Today?
          </h2>
          <MoodDetector onMoodDetected={handleMoodDetected} />
        </section>
      )}

      {/* ── MOOD RESULTS ── */}
      {moodMovies.length > 0 && (
        <section id="mood-results" style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#e50914', fontSize: '1.5rem' }}>
              🎯 Perfect for your mood — {moodInfo?.genreNames}
            </h2>
            <span style={{
              padding: '4px 15px',
              background: 'rgba(229,9,20,0.2)',
              border: '1px solid #e50914',
              borderRadius: '20px',
              color: '#e50914',
              fontSize: '0.85rem',
              textTransform: 'capitalize'
            }}>
              {moodInfo?.mood}
            </span>
          </div>
          <MovieGrid movies={moodMovies} />
        </section>
      )}

      {/* ── TABS SECTION ── */}
      {!searchResults.length && (
        <section>
          {/* Tab Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            marginBottom: '25px',
            borderBottom: '1px solid #333',
            paddingBottom: '15px'
          }}>
            {[
              { key: 'trending', label: '🔥 Trending' },
              { key: 'popular', label: '⭐ Popular' },
              { key: 'toprated', label: '🏆 Top Rated' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  background: activeTab === tab.key
                    ? 'linear-gradient(135deg, #e50914, #b20710)'
                    : '#222',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                  transition: 'all 0.3s',
                  boxShadow: activeTab === tab.key 
                    ? '0 4px 15px rgba(229,9,20,0.4)' 
                    : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
            
            <div style={{ marginLeft: 'auto' }}>
              <Link
                to="/upcoming"
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: '1px solid #e50914',
                  color: '#e50914',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
              >
                🎭 Upcoming →
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <LoadingGrid />
          ) : (
            <MovieGrid movies={getCurrentMovies()} />
          )}
        </section>
      )}
    </div>
  );
};

// ============================================
// MOVIE GRID COMPONENT
// ============================================
const MovieGrid = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666'
      }}>
        <p style={{ fontSize: '3rem' }}>🎬</p>
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px'
    }}>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

// ============================================
// LOADING SKELETON
// ============================================
const LoadingGrid = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px'
  }}>
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{
        borderRadius: '15px',
        overflow: 'hidden',
        background: '#1a1a1a',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        <div style={{
          height: '270px',
          background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
          backgroundSize: '400% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
        <div style={{ padding: '12px' }}>
          <div style={{
            height: '16px',
            background: '#2a2a2a',
            borderRadius: '8px',
            marginBottom: '8px'
          }} />
          <div style={{
            height: '12px',
            background: '#2a2a2a',
            borderRadius: '8px',
            width: '60%'
          }} />
        </div>
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400% 0; }
        100% { background-position: 400% 0; }
      }
    `}</style>
  </div>
);

export default Home;