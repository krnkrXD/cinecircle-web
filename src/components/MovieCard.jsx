// src/components/MovieCard.jsx

import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import GenreTag from "./GenreTag";
import useMovies from "../hooks/useMovies";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleWatched, updateRating } = useMovies();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const genres = movie.genre
    ? movie.genre
        .split(",")
        .map((g) => g.trim())
        .slice(0, 2)
    : [];

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent navigating to detail
    if (!window.confirm(`Remove "${movie.title}" from your library?`)) return;
    setDeleting(true);
    try {
      await deleteMovie(movie.id);
      showToast("Movie removed.", "info");
    } catch {
      showToast("Failed to remove movie.", "error");
      setDeleting(false);
    }
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div
        style={styles.posterWrapper}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {movie.posterURL && movie.posterURL !== "N/A" ? (
          <img src={movie.posterURL} alt={movie.title} style={styles.poster} />
        ) : (
          <div style={styles.noPoster}>🎬</div>
        )}

        {/* Watched badge */}
        {movie.watched && <div style={styles.watchedBadge}>✓ Watched</div>}
        {/* Delete button — shows on hover */}
        {hovered && (
          <button
            style={styles.deleteBtn}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "..." : "✕"}
          </button>
        )}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.title} onClick={() => navigate(`/movie/${movie.id}`)}>
          {movie.title}
        </h3>

        {movie.year && <p style={styles.year}>{movie.year}</p>}

        {/* Genres */}
        {genres.length > 0 && (
          <div style={styles.genres}>
            {genres.map((g) => (
              <GenreTag key={g} genre={g} />
            ))}
          </div>
        )}

        {/* Star rating */}
        <StarRating
          rating={movie.rating}
          onRate={(r) => updateRating(movie.id, r)}
        />

        {/* Watched toggle */}
        <button
          style={{
            ...styles.watchButton,
            backgroundColor: movie.watched ? "#1a3a1a" : "#1a1a2a",
            color: movie.watched ? "#4caf50" : "#7986cb",
            border: `1px solid ${movie.watched ? "#2a4a2a" : "#2a2a4a"}`,
          }}
          onClick={() => toggleWatched(movie.id, movie.watched)}
        >
          {movie.watched ? "✓ Watched" : "Mark as watched"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
    transition: "transform 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  posterWrapper: {
    position: "relative",
    cursor: "pointer",
    aspectRatio: "2/3",
    backgroundColor: "#111",
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  noPoster: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    backgroundColor: "#111",
  },
  watchedBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  info: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
    cursor: "pointer",
    lineHeight: "1.3",
  },
  year: {
    color: "#666",
    fontSize: "12px",
    margin: 0,
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  watchButton: {
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "auto",
  },
  deleteBtn: {
    position: "absolute",
    top: "8px",
    left: "8px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#ff6b6b",
    border: "1px solid #3a2020",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 2,
  },
};

export default MovieCard;
