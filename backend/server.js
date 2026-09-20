const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------------------------
// HOME ROUTE
// ------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CineAI backend is running",
  });
});

// ------------------------------------
// HEALTH CHECK
// ------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CineAI backend is running",
    status: "healthy",
  });
});

// ------------------------------------
// TEST ROUTE
// ------------------------------------

app.get("/api/movies/test", (req, res) => {
  res.json({
    success: true,
    message: "Movie API is working",
  });
});

// ------------------------------------
// POPULAR MOVIES
// ------------------------------------

app.get("/api/movies/popular", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1&region=IN`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Popular movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch popular movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// UPCOMING MOVIES
// ------------------------------------

app.get("/api/movies/upcoming", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1&region=IN`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Upcoming movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// NOW PLAYING MOVIES
// ------------------------------------

app.get("/api/movies/now-playing", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1&region=IN`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Now playing movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch now playing movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// TRENDING MOVIES
// ------------------------------------

app.get("/api/movies/trending", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Trending movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// TOP RATED MOVIES
// ------------------------------------

app.get("/api/movies/top-rated", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1&region=IN`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Top rated movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top rated movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// SEARCH MOVIES
// ------------------------------------

app.get("/api/movies/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a movie search query",
      });
    }

    if (!TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "TMDB_API_KEY is missing in backend/.env",
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&include_adult=false&page=1`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDB API error",
        error: data,
      });
    }

    res.json({
      success: true,
      results: data.results || [],
    });
  } catch (error) {
    console.error("Movie search error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search movies",
      error: error.message,
    });
  }
});

// ------------------------------------
// START SERVER
// ------------------------------------

app.listen(PORT, () => {
  console.log(`CineAI backend running on http://localhost:${PORT}`);
});