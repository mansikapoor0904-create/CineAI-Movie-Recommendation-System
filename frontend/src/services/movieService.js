
 // src/services/movieService.js
// ============================================
// CINEAI MOVIE SERVICE
// FRONTEND -> NODE BACKEND -> TMDB
// ============================================

const API_BASE_URL =
  "https://cineai-movie-recommendation-system-v9qo.onrender.com/api/movies";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

// ============================================
// HELPER: FETCH DATA FROM BACKEND
// ============================================

const fetchFromBackend = async (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("Fetching from backend:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

// ============================================
// HELPER: FORMAT MOVIE DATA
// ============================================

const formatMovie = (movie) => {
  if (!movie) return null;

  const rating = Number(movie.vote_average ?? movie.rating ?? 0);

  return {
    ...movie,
    id: movie.id,
    title: movie.title || movie.name || "Unknown Title",
    overview: movie.overview || "No description available.",
    release_date:
      movie.release_date || movie.first_air_date || "TBA",
    rating: Number.isFinite(rating) ? Number(rating.toFixed(1)) : 0,
    poster_path: movie.poster_path || null,
    poster:
      movie.poster ||
      (movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : null),
    backdrop_path: movie.backdrop_path || null,
    backdrop:
      movie.backdrop ||
      (movie.backdrop_path
        ? `${BACKDROP_URL}${movie.backdrop_path}`
        : null),
    genre_ids: movie.genre_ids || [],
    popularity: movie.popularity || 0,
    vote_average: movie.vote_average || 0,
    vote_count: movie.vote_count || 0,
  };
};

// ============================================
// HELPER: GET MOVIES FROM A LIST RESPONSE
// ============================================

const getFormattedResults = (data) => {
  if (Array.isArray(data)) {
    return data.map(formatMovie).filter(Boolean);
  }

  if (Array.isArray(data?.results)) {
    return data.results.map(formatMovie).filter(Boolean);
  }

  if (Array.isArray(data?.movies)) {
    return data.movies.map(formatMovie).filter(Boolean);
  }

  return [];
};

// ============================================
// GET TRENDING MOVIES
// ============================================

export const getTrendingMovies = async () => {
  try {
    const data = await fetchFromBackend("/trending");
    return getFormattedResults(data);
  } catch (error) {
    console.error("Trending movies error:", error);
    return [];
  }
};

// ============================================
// GET POPULAR MOVIES
// ============================================

export const getPopularMovies = async () => {
  try {
    const data = await fetchFromBackend("/popular");
    return getFormattedResults(data);
  } catch (error) {
    console.error("Popular movies error:", error);
    return [];
  }
};

// ============================================
// GET TOP-RATED MOVIES
// ============================================

export const getTopRatedMovies = async () => {
  try {
    const data = await fetchFromBackend("/top-rated");
    return getFormattedResults(data);
  } catch (error) {
    console.error("Top-rated movies error:", error);
    return [];
  }
};

// ============================================
// GET UPCOMING MOVIES
// ============================================

export const getUpcomingMovies = async () => {
  try {
    const data = await fetchFromBackend("/upcoming");
    return getFormattedResults(data);
  } catch (error) {
    console.error("Upcoming movies error:", error);
    return [];
  }
};

// ============================================
// GET NOW-PLAYING MOVIES
// ============================================

export const getNowPlayingMovies = async () => {
  try {
    const data = await fetchFromBackend("/now-playing");
    return getFormattedResults(data);
  } catch (error) {
    console.error("Now-playing movies error:", error);
    return [];
  }
};

// ============================================
// SEARCH MOVIES
// ============================================

export const searchMovies = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());

    const data = await fetchFromBackend(
      `/search?query=${encodedQuery}`
    );

    return getFormattedResults(data);
  } catch (error) {
    console.error("Movie search error:", error);
    return [];
  }
};

// ============================================
// GET MOVIE DETAILS
// ============================================

export const getMovieDetails = async (movieId) => {
  try {
    if (movieId === undefined || movieId === null || movieId === "") {
      throw new Error("Movie ID is missing.");
    }

    const id = String(movieId).trim();

    if (!/^\d+$/.test(id)) {
      throw new Error(`Invalid movie ID: ${id}`);
    }

    const data = await fetchFromBackend(
      `/details/${encodeURIComponent(id)}`
    );

    if (!data) {
      throw new Error("The backend returned an empty response.");
    }

    if (data.success === false) {
      throw new Error(
        data.message || "The backend could not find this movie."
      );
    }

    // Support different response structures from the backend.
    const movie =
      data.movie ||
      data.data?.movie ||
      data.data ||
      data;

    if (
      !movie ||
      typeof movie !== "object" ||
      (!movie.id && movie.id !== 0)
    ) {
      console.error("Unexpected movie-details response:", data);

      throw new Error(
        "Movie details were not returned in the expected format."
      );
    }

    const poster =
      movie.poster ||
      (movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : null);

    const backdrop =
      movie.backdrop ||
      (movie.backdrop_path
        ? `${BACKDROP_URL}${movie.backdrop_path}`
        : null);

    const credits = movie.credits || {};
    const videos = movie.videos?.results || movie.videos || [];

    const trailer =
      movie.trailer_url ||
      videos.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer"
      );

    const director =
      movie.director ||
      credits.crew?.find(
        (person) => person.job === "Director"
      )?.name ||
      "Not available";

    const genres = Array.isArray(movie.genres)
      ? movie.genres.map((genre) =>
          typeof genre === "string" ? genre : genre.name
        )
      : [];

    return {
      ...formatMovie(movie),
      ...movie,

      id: movie.id,
      title:
        movie.title ||
        movie.original_title ||
        movie.name ||
        "Untitled",

      overview:
        movie.overview || "No description available.",

      poster,
      backdrop,

      rating: movie.rating ?? movie.vote_average ?? 0,

      release_date:
        movie.release_date || "Release date unavailable",

      runtime: movie.runtime || null,

      language:
        movie.language ||
        movie.original_language?.toUpperCase() ||
        "N/A",

      genres,
      director,

      cast: movie.cast || credits.cast || [],

      trailer_url:
        typeof trailer === "string"
          ? trailer
          : trailer?.key
            ? `https://www.youtube.com/watch?v=${trailer.key}`
            : "",

      similar_movies:
        movie.similar_movies ||
        movie.similar?.results ||
        movie.recommendations?.results ||
        [],

      streaming_platforms: movie.streaming_platforms || [],
      download_links: movie.download_links || [],
    };
  } catch (error) {
    console.error("Movie details error:", error);
    throw error;
  }
};

// ============================================
// GET MOVIES BY MOOD
// ============================================

export const getMoviesByMood = async (mood) => {
  const moodToGenre = {
    happy: {
      genres: "35|10751",
      name: "Comedy & Family",
    },
    sad: {
      genres: "18|10749",
      name: "Drama & Romance",
    },
    excited: {
      genres: "28|12|878",
      name: "Action & Adventure",
    },
    scared: {
      genres: "27|53",
      name: "Horror & Thriller",
    },
    romantic: {
      genres: "10749|35",
      name: "Romance & Comedy",
    },
    bored: {
      genres: "878|14|12",
      name: "Sci-Fi & Fantasy",
    },
    angry: {
      genres: "28|80",
      name: "Action & Crime",
    },
    relaxed: {
      genres: "99|36|10751",
      name: "Documentary & Family",
    },
    adventurous: {
      genres: "12|14|28",
      name: "Adventure & Fantasy",
    },
    curious: {
      genres: "878|99|36",
      name: "Sci-Fi & Documentary",
    },
  };

  const normalizedMood = String(mood || "happy")
    .trim()
    .toLowerCase();

  const moodInfo = moodToGenre[normalizedMood] || moodToGenre.happy;

  try {
    const data = await fetchFromBackend(
      `/discover?genres=${encodeURIComponent(moodInfo.genres)}`
    );

    return {
      movies: getFormattedResults(data),
      genreNames: moodInfo.name,
    };
  } catch (error) {
    console.error("Mood movie error:", error);

    return {
      movies: [],
      genreNames: moodInfo.name,
    };
  }
};

// ============================================
// GET MOVIES BY GENRE
// ============================================

export const getMoviesByGenre = async (genreId) => {
  if (genreId === undefined || genreId === null || genreId === "") {
    return [];
  }

  try {
    const data = await fetchFromBackend(
      `/discover?genres=${encodeURIComponent(genreId)}`
    );

    return getFormattedResults(data);
  } catch (error) {
    console.error("Genre movie error:", error);
    return [];
  }
};

// ============================================
// GET GENRES
// ============================================

export const getGenres = async () => {
  try {
    const data = await fetchFromBackend("/genres");

    return data?.genres || data?.results || [];
  } catch (error) {
    console.error("Genres error:", error);
    return [];
  }
};

// ============================================
// CHATBOT
// ============================================

export const getChatbotResponse = async (message) => {
  const lowerMsg = String(message || "").toLowerCase();

  try {
    if (
      lowerMsg.includes("horror") ||
      lowerMsg.includes("scary")
    ) {
      const result = await getMoviesByMood("scared");

      return {
        text: "🎃 Here are some great horror and thriller movies for you!",
        movies: result.movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("happy") ||
      lowerMsg.includes("comedy") ||
      lowerMsg.includes("funny")
    ) {
      const result = await getMoviesByMood("happy");

      return {
        text: "😊 Here are some feel-good movies to brighten your day!",
        movies: result.movies.slice(0, 3),
      };
    }

    if (lowerMsg.includes("action")) {
      const result = await getMoviesByMood("excited");

      return {
        text: "💥 Get ready for some action-packed movies!",
        movies: result.movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("romance") ||
      lowerMsg.includes("romantic") ||
      lowerMsg.includes("love")
    ) {
      const result = await getMoviesByMood("romantic");

      return {
        text: "💕 Here are some romantic movies for you!",
        movies: result.movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("sci-fi") ||
      lowerMsg.includes("science fiction") ||
      lowerMsg.includes("space")
    ) {
      const result = await getMoviesByMood("curious");

      return {
        text: "🚀 Explore these amazing sci-fi movies!",
        movies: result.movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("sad") ||
      lowerMsg.includes("cry") ||
      lowerMsg.includes("emotional")
    ) {
      const result = await getMoviesByMood("sad");

      return {
        text: "🎭 These emotional dramas might resonate with you.",
        movies: result.movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("trending") ||
      lowerMsg.includes("popular")
    ) {
      const movies = await getTrendingMovies();

      return {
        text: "🔥 Here are the trending movies!",
        movies: movies.slice(0, 3),
      };
    }

    if (
      lowerMsg.includes("upcoming") ||
      lowerMsg.includes("coming soon")
    ) {
      const movies = await getUpcomingMovies();

      return {
        text: "🎬 Here are the upcoming movies to look forward to!",
        movies: movies.slice(0, 3),
      };
    }

    // Search for a movie by name.
    const searchTerms = String(message || "")
      .replace(/[^\w\s]/gi, "")
      .trim();

    if (searchTerms.length > 2) {
      const movies = await searchMovies(searchTerms);

      if (movies.length > 0) {
        return {
          text: `🎬 I found these movies matching "${message}":`,
          movies: movies.slice(0, 3),
        };
      }
    }

    const trending = await getTrendingMovies();

    return {
      text:
        "🤖 Hi! I'm CineBot. I can help you find movies.\n\n" +
        'Try asking me:\n' +
        '- "Show me horror movies"\n' +
        '- "I want something funny"\n' +
        '- "Action movies please"\n' +
        '- "What is trending?"\n' +
        "- Search for a movie by name!",
      movies: trending.slice(0, 3),
    };
  } catch (error) {
    console.error("Chatbot error:", error);

    return {
      text:
        "Sorry, I couldn't connect to the movie service right now. Please try again.",
      movies: [],
    };
  }
};
