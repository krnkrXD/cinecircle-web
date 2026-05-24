// src/components/MovieCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import GenreTag from "./GenreTag";
import useMovies from "../hooks/useMovies";
import { useToast } from "../context/ToastContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleWatched, updateRating, deleteMovie } = useMovies();
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
    e.stopPropagation();
    if (!window.confirm(`Remove "${movie.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteMovie(movie.id);
      showToast("Movie removed.", "info");
    } catch {
      showToast("Failed to remove.", "error");
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        ...s.card,
        boxShadow: hovered ? "6px 6px 0 #1A1A1A" : "4px 4px 0 #1A1A1A",
        transform: hovered ? "translate(-1px,-1px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div style={s.posterWrap} onClick={() => navigate(`/movie/${movie.id}`)}>
        {movie.posterURL && movie.posterURL !== "N/A" ? (
          <img src={movie.posterURL} alt={movie.title} style={s.poster} />
        ) : (
          <div style={s.noPoster}>
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "11px",
                color: "#8B7355",
              }}
            >
              NO POSTER
            </span>
          </div>
        )}

        {/* Watched badge */}
        {movie.watched && <div style={s.watchedBadge}>✓ Watched</div>}

        {/* Delete btn */}
        {hovered && (
          <button
            style={s.deleteBtn}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "…" : "✕"}
          </button>
        )}
      </div>

      {/* Info */}
      <div style={s.info}>
        <div style={s.title} onClick={() => navigate(`/movie/${movie.id}`)}>
          {movie.title}
        </div>

        {movie.year && <div style={s.year}>{movie.year}</div>}

        {genres.length > 0 && (
          <div style={s.genres}>
            {genres.map((g) => (
              <GenreTag key={g} genre={g} />
            ))}
          </div>
        )}

        <StarRating
          rating={movie.rating}
          onRate={(r) => updateRating(movie.id, r)}
        />

        <button
          style={{
            ...s.watchBtn,
            background: movie.watched ? "#1A1A1A" : "#F5F0E8",
            color: movie.watched ? "#F5F0E8" : "#1A1A1A",
          }}
          onClick={() => toggleWatched(movie.id, movie.watched)}
        >
          {movie.watched ? "✓ Watched" : "Mark watched"}
        </button>
      </div>
    </div>
  );
};

const s = {
  card: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    transition: "box-shadow 0.15s, transform 0.15s",
    display: "flex",
    flexDirection: "column",
  },
  posterWrap: {
    position: "relative",
    cursor: "pointer",
    aspectRatio: "2/3",
    background: "#E8E0D0",
    border: "none",
    borderBottom: "2px solid #1A1A1A",
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
  },
  watchedBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "#1A1A1A",
    color: "#F5F0E8",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "3px 7px",
  },
  deleteBtn: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "#C41E1E",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    width: "26px",
    height: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
  info: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  title: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "13px",
    fontWeight: 700,
    color: "#1A1A1A",
    cursor: "pointer",
    lineHeight: 1.2,
  },
  year: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    color: "#8B7355",
  },
  genres: { display: "flex", flexWrap: "wrap", gap: "4px" },
  watchBtn: {
    border: "2px solid #1A1A1A",
    padding: "5px 8px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "9px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginTop: "auto",
    cursor: "pointer",
  },
};

export default MovieCard;
