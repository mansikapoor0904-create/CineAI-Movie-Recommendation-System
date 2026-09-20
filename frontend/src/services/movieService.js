// src/services/movieService.js
// ============================================
// CINEAI MOVIE SERVICE
// FRONTEND -> NODE BACKEND -> TMDB
// ============================================

const API_BASE_URL = "http://localhost:5000/api/movies";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";


// ============================================
// HELPER FUNCTION
// ============================================

const fetchFromBackend = async (endpoint) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("Fetching from backend:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Backend API Error:", error);
    throw error;
  }
};


// ============================================
// FORMAT MOVIE DATA
// ============================================

const formatMovie = (movie) => ({
  id: movie.id,

  title: movie.title || movie.name || "Unknown Title",

  overview:
    movie.overview || "No description available.",

  release_date:
    movie.release_date || movie.first_air_date || "TBA",

  rating: movie.vote_average
    ? parseFloat(movie.vote_average.toFixed(1))
    : 0,

  // Keep original TMDB poster path
  poster_path: movie.poster_path || null,

  // Full poster URL
  poster: movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : null,

  backdrop_path: movie.backdrop_path || null,

  backdrop: movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : null,

  genre_ids: movie.genre_ids || [],

  popularity: movie.popularity || 0,

  vote_average: movie.vote_average || 0,

  vote_count: movie.vote_count || 0,
});


// ============================================
// GET TRENDING MOVIES
// ============================================

export const getTrendingMovies = async () => {

  const data = await fetchFromBackend("/trending");

  if (data && data.results) {
    return data.results.map(formatMovie);
  }

  return [];
};


// ============================================
// GET POPULAR MOVIES
// ============================================

export const getPopularMovies = async () => {

  const data = await fetchFromBackend("/popular");

  if (data && data.results) {
    return data.results.map(formatMovie);
  }

  return [];
};


// ============================================
// GET TOP RATED MOVIES
// ============================================

export const getTopRatedMovies = async () => {

  const data = await fetchFromBackend("/top-rated");

  if (data && data.results) {
    return data.results.map(formatMovie);
  }

  return [];
};


// ============================================
// GET UPCOMING MOVIES
// ============================================

export const getUpcomingMovies = async () => {

  const data = await fetchFromBackend("/upcoming");

  if (data && data.results) {
    return data.results.map(formatMovie);
  }

  return [];
};


// ============================================
// GET NOW PLAYING MOVIES
// ============================================

export const getNowPlayingMovies = async () => {

  const data = await fetchFromBackend("/now-playing");

  if (data && data.results) {
    return data.results.map(formatMovie);
  }

  return [];
};


// ============================================
// SEARCH MOVIES
// ============================================

export const searchMovies = async (query) => {

  if (!query || query.trim() === "") {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());

  const data = await fetchFromBackend(
    `/search?query=${encodedQuery}`
  );

  if (data && data.results) {
    return data.results
      .filter((movie) => movie.poster_path)
      .map(formatMovie);
  }

  return [];
};


// ============================================
// GET MOVIE DETAILS
// ============================================

export const getMovieDetails = async (movieId) => {

  try {

    const data = await fetchFromBackend(
      `/details/${movieId}`
    );

    if (!data) {
      return null;
    }

    return data;

  } catch (error) {

    console.error(
      "Movie details error:",
      error
    );

    return null;
  }
};


// ============================================
// GET MOVIES BY MOOD
// ============================================

export const getMoviesByMood = async (mood) => {

  // For now we use frontend mood mapping.
  // Later we can move this completely into backend.

  const moodToGenre = {

    happy: {
      genres: "35,10751",
      name: "Comedy & Family"
    },

    sad: {
      genres: "18,10749",
      name: "Drama & Romance"
    },

    excited: {
      genres: "28,12,878",
      name: "Action & Adventure"
    },

    scared: {
      genres: "27,53",
      name: "Horror & Thriller"
    },

    romantic: {
      genres: "10749,35",
      name: "Romance & Comedy"
    },

    bored: {
      genres: "878,14,12",
      name: "Sci-Fi & Fantasy"
    },

    angry: {
      genres: "28,80",
      name: "Action & Crime"
    },

    relaxed: {
      genres: "99,36,10751",
      name: "Documentary & Family"
    },

    adventurous: {
      genres: "12,14,28",
      name: "Adventure & Fantasy"
    },

    curious: {
      genres: "878,99,36",
      name: "Sci-Fi & Documentary"
    }
  };


  const moodInfo =
    moodToGenre[mood?.toLowerCase()] ||
    moodToGenre.happy;


  // If backend later supports mood endpoint,
  // we can connect it here.

  try {

    const data = await fetchFromBackend(
      `/discover?genres=${encodeURIComponent(
        moodInfo.genres
      )}`
    );

    if (data && data.results) {

      return {
        movies: data.results
          .filter((movie) => movie.poster_path)
          .map(formatMovie),

        genreNames: moodInfo.name
      };
    }

  } catch (error) {

    console.error(
      "Mood movie error:",
      error
    );
  }


  return {
    movies: [],
    genreNames: moodInfo.name
  };
};


// ============================================
// GET GENRES
// ============================================

export const getGenres = async () => {

  try {

    const data =
      await fetchFromBackend("/genres");

    return data?.genres || [];

  } catch (error) {

    console.error(
      "Genres error:",
      error
    );

    return [];
  }
};


// ============================================
// GET MOVIES BY GENRE
// ============================================

export const getMoviesByGenre = async (genreId) => {

  try {

    const data =
      await fetchFromBackend(
        `/discover?genres=${genreId}`
      );

    if (data && data.results) {

      return data.results
        .filter((movie) => movie.poster_path)
        .map(formatMovie);
    }

  } catch (error) {

    console.error(
      "Genre movie error:",
      error
    );
  }

  return [];
};


// ============================================
// CHATBOT
// ============================================

export const getChatbotResponse = async (message) => {

  const lowerMsg =
    message.toLowerCase();


  if (
    lowerMsg.includes("horror") ||
    lowerMsg.includes("scary")
  ) {

    const result =
      await getMoviesByMood("scared");

    return {
      text:
        "🎃 Here are some great horror/thriller movies for you!",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("happy") ||
    lowerMsg.includes("comedy") ||
    lowerMsg.includes("funny")
  ) {

    const result =
      await getMoviesByMood("happy");

    return {
      text:
        "😊 Here are some feel-good movies to brighten your day!",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("action")
  ) {

    const result =
      await getMoviesByMood("excited");

    return {
      text:
        "💥 Get ready for some action-packed movies!",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("romance") ||
    lowerMsg.includes("romantic") ||
    lowerMsg.includes("love")
  ) {

    const result =
      await getMoviesByMood("romantic");

    return {
      text:
        "💕 Here are some romantic movies for you!",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("sci-fi") ||
    lowerMsg.includes("science") ||
    lowerMsg.includes("space")
  ) {

    const result =
      await getMoviesByMood("curious");

    return {
      text:
        "🚀 Explore these amazing Sci-Fi movies!",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("sad") ||
    lowerMsg.includes("cry") ||
    lowerMsg.includes("emotional")
  ) {

    const result =
      await getMoviesByMood("sad");

    return {
      text:
        "🎭 These emotional dramas might resonate with you:",

      movies:
        result.movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("trending") ||
    lowerMsg.includes("popular")
  ) {

    const movies =
      await getTrendingMovies();

    return {
      text:
        "🔥 Here are the trending movies right now!",

      movies:
        movies.slice(0, 3)
    };
  }


  if (
    lowerMsg.includes("upcoming") ||
    lowerMsg.includes("new")
  ) {

    const movies =
      await getUpcomingMovies();

    return {
      text:
        "🎬 Here are the upcoming movies to look forward to!",

      movies:
        movies.slice(0, 3)
    };
  }


  // Search movie by name

  const searchTerms =
    message
      .replace(/[^\w\s]/gi, "")
      .trim();


  if (searchTerms.length > 2) {

    const movies =
      await searchMovies(searchTerms);


    if (movies.length > 0) {

      return {
        text:
          `🎬 I found these movies matching "${message}":`,

        movies:
          movies.slice(0, 3)
      };
    }
  }


  // Default response

  const trending =
    await getTrendingMovies();


  return {

    text:
      `🤖 Hi! I'm CineBot!

I can help you find movies.

Try asking me:

• "Show me horror movies"
• "I want something funny"
• "Action movies please"
• "What's trending?"
• Search any movie by name!`,

    movies:
      trending.slice(0, 3)
  };
};