// src/pages/MovieDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMovie } from "../firebase/firestore";
import useMovies from "../hooks/useMovies";
import StarRating from "../components/StarRating";
import GenreTag from "../components/GenreTag";
import NoteEditor from "../components/NoteEditor";
import RecModal from "../components/RecModal";
import { useToast } from "../context/ToastContext";

const MovieDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toggleWatched, updateRating, deleteMovie } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  // inside MovieDetail component, add this state
  const [showRecModal, setShowRecModal] = useState(false);

  // ── Fetch movie ──────────────────────────────────────────────
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovie(currentUser.uid, id);
        if (!data) {
          navigate("/library");
          return;
        }
        setMovie(data);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, currentUser]);

  // ── Handle rating ────────────────────────────────────────────
  const handleRate = async (rating) => {
    await updateRating(id, rating);
    setMovie((prev) => ({ ...prev, rating }));
    showToast("Rating updated!");
  };

  // ── Handle watched toggle ────────────────────────────────────
  const handleToggleWatched = async () => {
    await toggleWatched(id, movie.watched);
    setMovie((prev) => ({ ...prev, watched: !prev.watched }));
    showToast(movie.watched ? "Marked as unwatched" : "Marked as watched!");
  };

  // ── Handle delete ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Remove this movie from your library?")) return;
    await deleteMovie(id);
    navigate("/library");
    showToast("Movie removed from library.", "info");
  };

  // ── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.message}>Loading...</p>
      </div>
    );
  }

  if (!movie) return null;

  const genres = movie.genre ? movie.genre.split(",").map((g) => g.trim()) : [];

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate("/library")}>
        ← Back to library
      </button>

      <div style={styles.content}>
        {/* Left — poster */}
        <div style={styles.posterCol}>
          {movie.posterURL && movie.posterURL !== "N/A" ? (
            <img
              src={movie.posterURL}
              alt={movie.title}
              style={styles.poster}
            />
          ) : (
            <div style={styles.noPoster}>🎬</div>
          )}
        </div>

        {/* Right — details */}
        <div style={styles.detailCol}>
          {/* Title + year */}
          <h1 style={styles.title}>{movie.title}</h1>
          {movie.year && <p style={styles.year}>{movie.year}</p>}

          {/* Genres */}
          {genres.length > 0 && (
            <div style={styles.genres}>
              {genres.map((g) => (
                <GenreTag key={g} genre={g} />
              ))}
            </div>
          )}

          {/* IMDB rating */}
          {movie.imdbRating && (
            <p style={styles.imdb}>⭐ IMDB: {movie.imdbRating}</p>
          )}

          {/* Description */}
          {movie.description && (
            <p style={styles.description}>{movie.description}</p>
          )}

          {/* Divider */}
          <div style={styles.divider} />

          {/* Your rating */}
          <div style={styles.ratingRow}>
            <span style={styles.label}>Your rating</span>
            <StarRating rating={movie.rating} onRate={handleRate} />
          </div>

          {/* Watched toggle */}
          <button
            style={{
              ...styles.watchedBtn,
              backgroundColor: movie.watched ? "#1a3a1a" : "#1a1a2e",
              color: movie.watched ? "#4caf50" : "#7986cb",
              border: `1px solid ${movie.watched ? "#2d5a2d" : "#2a2a4a"}`,
            }}
            onClick={handleToggleWatched}
          >
            {movie.watched ? "✓ Watched" : "Mark as watched"}
          </button>

          {/* Delete */}
          <button style={styles.deleteBtn} onClick={handleDelete}>
            Remove from library
          </button>

          {/* Recommend to friend */}
          <button style={styles.recBtn} onClick={() => setShowRecModal(true)}>
            📨 Recommend to a friend
          </button>

          {/* Rec modal */}
          {showRecModal && (
            <RecModal movie={movie} onClose={() => setShowRecModal(false)} />
          )}
        </div>
      </div>

      {/* Notes section */}
      <div style={styles.notesSection}>
        <NoteEditor movieId={id} />
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: "24px",
    maxWidth: "960px",
    margin: "0 auto",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
  },
  message: {
    color: "#666",
    fontSize: "16px",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#888",
    fontSize: "14px",
    cursor: "pointer",
    padding: "0 0 24px",
    display: "block",
  },
  content: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  posterCol: {
    flexShrink: 0,
  },
  poster: {
    width: "220px",
    borderRadius: "12px",
    display: "block",
  },
  noPoster: {
    width: "220px",
    height: "320px",
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "64px",
  },
  detailCol: {
    flex: 1,
    minWidth: "260px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
    color: "#fff",
    lineHeight: "1.2",
  },
  year: {
    color: "#666",
    fontSize: "15px",
    margin: 0,
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  imdb: {
    color: "#f5c518",
    fontSize: "14px",
    margin: 0,
  },
  description: {
    color: "#aaa",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },
  divider: {
    height: "1px",
    backgroundColor: "#2a2a2a",
    margin: "4px 0",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  label: {
    color: "#888",
    fontSize: "14px",
  },
  watchedBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  deleteBtn: {
    backgroundColor: "transparent",
    border: "1px solid #3a2020",
    color: "#ff6b6b",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "8px",
  },
  notesSection: {
    marginTop: "48px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "32px",
  },
  recBtn: {
    backgroundColor: "#1a1a2e",
    border: "1px solid #2a2a4a",
    color: "#7986cb",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};

export default MovieDetail;
