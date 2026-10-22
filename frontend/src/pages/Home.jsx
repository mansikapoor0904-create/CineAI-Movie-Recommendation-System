
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/UI/MovieCard';
import MoodDetector from '../components/Mood_detector';

import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  searchMovies,
} from '../services/movieService';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [moodMovies, setMoodMovies] = useState([]);
  const [moodInfo, setMoodInfo] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  const loadAllMovies = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [trendingData, popularData, topRatedData] =
        await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

      // Do not show an API-key error when the lists are simply empty.
      setTrending(Array.isArray(trendingData) ? trendingData : []);
      setPopular(Array.isArray(popularData) ? popularData : []);
      setTopRated(Array.isArray(topRatedData) ? topRatedData : []);

      if (
        !trendingData?.length &&
        !popularData?.length &&
        !topRatedData?.length
      ) {
        setError(
          'The movie service returned no movies. Please check the backend movie routes.'
        );
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError(
        'Unable to connect to the movie service. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllMovies();
  }, [loadAllMovies]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setError('');

    try {
      const results = await searchMovies(query);
      setSearchResults(Array.isArray(results) ? results : []);

      if (!results?.length) {
        setError(`No movies found for "${query}". Try another title.`);
      }
    } catch (err) {
      console.error('Movie search error:', err);
      setError('Movie search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setError('');
  };

  const handleMoodDetected = (mood, movies, genreNames) => {
    setMoodMovies(Array.isArray(movies) ? movies : []);
    setMoodInfo({ mood, genreNames });

    setTimeout(() => {
      document.getElementById('mood-results')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 300);
  };

  const getCurrentMovies = () => {
    if (activeTab === 'popular') return popular;
    if (activeTab === 'toprated') return topRated;
    return trending;
  };

  return (
    <main
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        color: '#fff',
      }}
    >
      {/* Hero and search */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: '20px',
          padding: '50px 25px',
          marginBottom: '35px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            color: '#e50914',
            marginBottom: '15px',
          }}
        >
          🎬 CineAI - Smart Movie Recommendations
        </h1>

        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          Discover movies and find recommendations for your mood.
        </p>

        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '650px',
            margin: '0 auto',
            gap: '10px',
          }}
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search any movie..."
            aria-label="Search movies"
            style={{
              flex: '1 1 220px',
              minWidth: 0,
              padding: '15px 20px',
              borderRadius: '50px',
              border: '1px solid #555',
              background: '#202436',
              color: '#fff',
              fontSize: '1rem',
            }}
          />

          <button
            type="submit"
            disabled={loading && isSearching}
            style={buttonStyle}
          >
            Search 🔍
          </button>

          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              style={buttonStyle}
            >
              Clear ✕
            </button>
          )}
        </form>
      </section>

      {/* Error or status message */}
      {error && (
        <div
          role="status"
          style={{
            padding: '16px',
            marginBottom: '25px',
            border: '1px solid #e50914',
            borderRadius: '12px',
            background: '#261719',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <p>{error}</p>

          <button onClick={loadAllMovies} style={buttonStyle}>
            🔄 Retry loading movies
          </button>
        </div>
      )}

      {/* Search results */}
      {isSearching && (
        <section style={{ marginBottom: '35px' }}>
          <h2 style={headingStyle}>
            🔍 Search Results: {searchQuery}
          </h2>

          {loading ? (
            <p>Searching for movies...</p>
          ) : (
            <MovieGrid movies={searchResults} />
          )}
        </section>
      )}

      {/* Mood detector */}
      {!isSearching && (
        <>
          <section style={{ marginBottom: '35px' }}>
            <h2 style={headingStyle}>
              🎭 How Are You Feeling Today?
            </h2>

            <MoodDetector onMoodDetected={handleMoodDetected} />
          </section>

          {moodMovies.length > 0 && (
            <section id="mood-results" style={{ marginBottom: '35px' }}>
              <h2 style={headingStyle}>
                🎯 Recommendations for {moodInfo?.genreNames}
              </h2>

              <p style={{ color: '#ccc' }}>
                Your mood: {moodInfo?.mood}
              </p>

              <MovieGrid movies={moodMovies} />
            </section>
          )}

          {/* Movie tabs */}
          <section>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '1px solid #444',
              }}
            >
              {[
                { key: 'trending', label: '🔥 Trending' },
                { key: 'popular', label: '⭐ Popular' },
                { key: 'toprated', label: '🏆 Top Rated' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  aria-pressed={activeTab === tab.key}
                  style={{
                    ...buttonStyle,
                    background:
                      activeTab === tab.key ? '#e50914' : '#292929',
                  }}
                >
                  {tab.label}
                </button>
              ))}

              <Link
                to="/upcoming"
                style={{
                  color: '#ff646b',
                  textDecoration: 'none',
                  padding: '10px 15px',
                  marginLeft: 'auto',
                }}
              >
                🎭 Upcoming →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: '#ccc' }}>Loading movies...</p>
            ) : (
              <MovieGrid movies={getCurrentMovies()} />
            )}
          </section>
        </>
      )}
    </main>
  );
};

const buttonStyle = {
  padding: '12px 20px',
  border: 'none',
  borderRadius: '25px',
  background: '#e50914',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const headingStyle = {
  color: '#e50914',
  fontSize: '1.5rem',
  marginBottom: '20px',
};

const MovieGrid = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '35px', color: '#aaa' }}>
        <p style={{ fontSize: '2.5rem' }}>🎬</p>
        <p>No movies to display.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '20px',
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default Home;
