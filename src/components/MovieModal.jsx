// src/components/MovieModal.jsx
import { useState } from "react";
import useMovies from "../hooks/useMovies";
import { useToast } from "../context/ToastContext";
import StarRating from "./StarRating";

const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MovieModal = ({ onClose }) => {
  const { addMovie } = useMovies();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setError("");
    setSearching(true);
    setSelected(null);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(query)}&type=movie`,
      );
      const data = await res.json();
      if (data.Response === "True") setResults(data.Search);
      else {
        setResults([]);
        setError("No movies found. Try another title.");
      }
    } catch {
      setError("Search failed. Check your connection.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (movie) => {
    setError("");
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${movie.imdbID}&plot=short`,
      );
      const data = await res.json();
      setSelected(data);
      setResults([]);
      setQuery("");
    } catch {
      setError("Failed to load movie details.");
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await addMovie({
        title: selected.Title,
        posterURL: selected.Poster !== "N/A" ? selected.Poster : "",
        description: selected.Plot,
        genre: selected.Genre,
        year: selected.Year,
        imdbRating: selected.imdbRating,
        imdbID: selected.imdbID,
        rating,
      });
      showToast("Added to your library!");
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.eyebrow}>— New entry —</div>
            <h2 style={s.title}>Add a film</h2>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={s.divider} />

        {/* Search */}
        <div style={s.searchRow}>
          <input
            style={s.input}
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            style={s.searchBtn}
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? "..." : "Search"}
          </button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        {/* Results */}
        {results.length > 0 && (
          <div style={s.results}>
            {results.map((movie) => (
              <div
                key={movie.imdbID}
                style={s.resultItem}
                onClick={() => handleSelect(movie)}
              >
                {movie.Poster !== "N/A" ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={s.resultPoster}
                  />
                ) : (
                  <div style={s.noPoster}>?</div>
                )}
                <div>
                  <div style={s.resultTitle}>{movie.Title}</div>
                  <div style={s.resultYear}>{movie.Year}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected */}
        {selected && (
          <div style={s.selected}>
            <div style={s.selectedTop}>
              {selected.Poster !== "N/A" && (
                <img
                  src={selected.Poster}
                  alt={selected.Title}
                  style={s.selectedPoster}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={s.selectedTitle}>{selected.Title}</div>
                <div style={s.selectedMeta}>
                  {selected.Year} · {selected.Genre}
                </div>
                <div style={s.selectedPlot}>{selected.Plot}</div>
                <div style={s.imdb}>IMDB: {selected.imdbRating}</div>
              </div>
            </div>

            <div style={s.divider} />

            <div style={s.ratingRow}>
              <span style={s.ratingLabel}>Your rating</span>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <button
              style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add to library →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,26,26,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "8px 8px 0 #1A1A1A",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "88vh",
    overflowY: "auto",
    padding: "28px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: "#8B7355",
    marginBottom: "4px",
  },
  title: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "26px",
    fontWeight: 900,
    color: "#1A1A1A",
  },
  closeBtn: {
    background: "transparent",
    border: "2px solid #1A1A1A",
    color: "#1A1A1A",
    width: "32px",
    height: "32px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: { borderTop: "2px solid #1A1A1A", margin: "16px 0" },
  searchRow: { display: "flex", gap: "8px", marginBottom: "12px" },
  input: {
    flex: 1,
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    outline: "none",
  },
  searchBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 16px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  error: {
    border: "2px solid #C41E1E",
    color: "#C41E1E",
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    marginBottom: "12px",
  },
  results: {
    border: "2px solid #1A1A1A",
    maxHeight: "240px",
    overflowY: "auto",
    marginBottom: "16px",
  },
  resultItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #D4C9B4",
    cursor: "pointer",
    background: "#F5F0E8",
  },
  resultPoster: {
    width: "36px",
    height: "52px",
    objectFit: "cover",
    border: "1px solid #1A1A1A",
    flexShrink: 0,
  },
  noPoster: {
    width: "36px",
    height: "52px",
    background: "#E8E0D0",
    border: "1px solid #1A1A1A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "16px",
    color: "#8B7355",
    flexShrink: 0,
  },
  resultTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "13px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "2px",
  },
  resultYear: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
  },
  selected: {
    background: "#E8E0D0",
    border: "2px solid #1A1A1A",
    padding: "16px",
  },
  selectedTop: { display: "flex", gap: "14px", marginBottom: "0" },
  selectedPoster: {
    width: "80px",
    height: "114px",
    objectFit: "cover",
    border: "2px solid #1A1A1A",
    flexShrink: 0,
  },
  selectedTitle: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: "4px",
  },
  selectedMeta: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#8B7355",
    marginBottom: "8px",
  },
  selectedPlot: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#1A1A1A",
    lineHeight: 1.6,
    marginBottom: "6px",
  },
  imdb: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    color: "#C4882E",
    letterSpacing: "0.06em",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "14px",
  },
  ratingLabel: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8B7355",
  },
  saveBtn: {
    width: "100%",
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "3px 3px 0 #8B7355",
    padding: "12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};

export default MovieModal;
