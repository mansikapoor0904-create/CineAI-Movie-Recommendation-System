import React from "react";

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(229,9,20,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 5px 20px rgba(0,0,0,0.3)";
      }}
    >
      {/* Movie Poster */}
      <img
        src={posterUrl}
        alt={movie.title || "Movie poster"}
        style={{
          width: "100%",
          height: "270px",
          objectFit: "cover",
          display: "block",
        }}
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/500x750?text=No+Poster";
        }}
      />

      {/* Movie Information */}
      <div style={{ padding: "15px" }}>
        <h3
          style={{
            color: "white",
            fontSize: "1rem",
            margin: "0 0 10px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={movie.title}
        >
          {movie.title || "Unknown Movie"}
        </h3>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              color: "#FFD700",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>

          {/* Release Date */}
          <span
            style={{
              color: "#aaa",
              fontSize: "0.8rem",
            }}
          >
            {movie.release_date
              ? movie.release_date.substring(0, 4)
              : "N/A"}
          </span>
        </div>

        {/* Overview */}
        {movie.overview && (
          <p
            style={{
              color: "#999",
              fontSize: "0.8rem",
              lineHeight: "1.4",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;