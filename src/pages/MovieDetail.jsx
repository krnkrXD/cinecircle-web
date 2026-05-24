// src/pages/MovieDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMovie } from "../firebase/firestore";
import useMovies from "../hooks/useMovies";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/StarRating";
import GenreTag from "../components/GenreTag";
import NoteEditor from "../components/NoteEditor";
import RecModal from "../components/RecModal";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { toggleWatched, updateRating, deleteMovie } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRec, setShowRec] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
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
    fetch_();
  }, [id, currentUser]);

  const handleRate = async (rating) => {
    await updateRating(id, rating);
    setMovie((p) => ({ ...p, rating }));
    showToast("Rating updated!");
  };

  const handleToggleWatched = async () => {
    await toggleWatched(id, movie.watched);
    setMovie((p) => ({ ...p, watched: !p.watched }));
    showToast(movie.watched ? "Marked as unwatched." : "Marked as watched!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove this film from your library?")) return;
    await deleteMovie(id);
    showToast("Film removed.", "info");
    navigate("/library");
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F0E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: "12px",
            color: "#8B7355",
            letterSpacing: "0.1em",
          }}
        >
          Loading...
        </span>
      </div>
    );

  if (!movie) return null;

  const genres = movie.genre ? movie.genre.split(",").map((g) => g.trim()) : [];

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/library")}>
          ← Library
        </button>
        <div style={s.logo}>CINELOG</div>
        <div style={{ width: "100px" }} />
      </nav>

      <div style={s.content}>
        {/* Left col */}
        <div style={s.leftCol}>
          <div style={s.posterFrame}>
            {movie.posterURL && movie.posterURL !== "N/A" ? (
              <img src={movie.posterURL} alt={movie.title} style={s.poster} />
            ) : (
              <div style={s.noPoster}>
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "12px",
                    color: "#8B7355",
                  }}
                >
                  NO POSTER
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={s.actions}>
            <button
              style={{
                ...s.actionBtn,
                background: movie.watched ? "#1A1A1A" : "#F5F0E8",
                color: movie.watched ? "#F5F0E8" : "#1A1A1A",
              }}
              onClick={handleToggleWatched}
            >
              {movie.watched ? "✓ Watched" : "Mark as watched"}
            </button>
            <button
              style={{ ...s.actionBtn, color: "#8B7355" }}
              onClick={() => setShowRec(true)}
            >
              Recommend →
            </button>
            <button
              style={{
                ...s.actionBtn,
                color: "#C41E1E",
                borderColor: "#C41E1E",
              }}
              onClick={handleDelete}
            >
              Remove film
            </button>
          </div>
        </div>

        {/* Right col */}
        <div style={s.rightCol}>
          <div style={s.eyebrow}>
            {movie.year}
            {movie.imdbRating ? ` · IMDB ${movie.imdbRating}` : ""}
          </div>
          <h1 style={s.title}>{movie.title}</h1>

          {genres.length > 0 && (
            <div style={s.genres}>
              {genres.map((g) => (
                <GenreTag key={g} genre={g} />
              ))}
            </div>
          )}

          <div style={s.divider} />

          {movie.description && (
            <p style={s.description}>{movie.description}</p>
          )}

          <div style={s.divider} />

          {/* Rating */}
          <div style={s.ratingSection}>
            <div style={s.ratingLabel}>Your rating</div>
            <StarRating rating={movie.rating} onRate={handleRate} />
          </div>

          <div style={s.divider} />

          {/* Notes */}
          <NoteEditor movieId={id} />
        </div>
      </div>

      {showRec && <RecModal movie={movie} onClose={() => setShowRec(false)} />}
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#F5F0E8" },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    background: "#1A1A1A",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#C4B99A",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    width: "100px",
  },
  logo: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#F5F0E8",
    letterSpacing: "0.06em",
  },
  content: {
    display: "flex",
    gap: "0",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 28px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  leftCol: {
    width: "240px",
    flexShrink: 0,
    marginRight: "40px",
    marginBottom: "24px",
  },
  posterFrame: {
    border: "2px solid #1A1A1A",
    boxShadow: "6px 6px 0 #1A1A1A",
    marginBottom: "16px",
    background: "#E8E0D0",
  },
  poster: { width: "100%", display: "block" },
  noPoster: {
    width: "100%",
    height: "340px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { display: "flex", flexDirection: "column", gap: "8px" },
  actionBtn: {
    width: "100%",
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "2px 2px 0 #1A1A1A",
    padding: "10px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    textAlign: "left",
    color: "#1A1A1A",
  },
  rightCol: { flex: 1, minWidth: "280px" },
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    letterSpacing: "0.1em",
    marginBottom: "6px",
  },
  title: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "38px",
    fontWeight: 900,
    color: "#1A1A1A",
    lineHeight: 1.1,
    marginBottom: "14px",
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "4px",
  },
  divider: { borderTop: "2px solid #1A1A1A", margin: "18px 0" },
  description: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    lineHeight: 1.7,
  },
  ratingSection: { display: "flex", alignItems: "center", gap: "16px" },
  ratingLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8B7355",
  },
};

export default MovieDetail;
